// App shell: renderer, studio lighting, post-processing, camera views, reference overlay, lil-gui, GLB export.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import GUI from 'lil-gui';
import { createMaterials, applyArmorFinish, applyArmorAccents } from './materials.js';
import { resolveFinish, resolveAccents } from './finishPresets.js';
import { denoiseTexture, DENOISE_SEED } from './textures.js';
import { buildHelmet } from './helmet.js';
import { buildBodyStudy } from './parts/bodyStudy.js';
import { buildShoulderStudy, shoulderStudyParams } from './parts/shoulderStudy.js';
import { buildFullBody, fullBodyParams } from './parts/fullBody.js';
import { configureHelmetAssembly, createExplodedAssembly, assemblyDescription } from './assembly.js';
import { resolveAssemblyOptions } from './assemblyOptions.js';
import { createAssemblyLabels } from './assemblyLabels.js';
import { D, resetParams } from './params.js';
import { loadScout, scoutParts, SCOUT_FRAME } from './scout.js';

const query = new URLSearchParams(location.search);
const materialFinish = resolveFinish(query.get('finish') ?? 'original');
const materialAccents = resolveAccents(query.get('accents') ?? 'original');
const strips = query.get('strips') ?? 'on';
if (!['on', 'off'].includes(strips)) throw new Error(`Unknown strips ${JSON.stringify(strips)}; expected on or off`);
D.foreheadPlates.enabled = strips === 'on';
if (query.get('ui') === '0') document.body.classList.add('noui');
// ?model=scout: the Blender-built Scout v3 (blender/scout) as GLB instead of the three.js helmet; geometry GUI is off.
const modelName = query.get('model') ?? 'critic';
if (!['critic', 'scout'].includes(modelName)) throw new Error(`Unknown model ${JSON.stringify(modelName)}; expected critic or scout`);
const scoutModels = modelName === 'scout' ? { assembled: await loadScout(false), exploded: await loadScout(true) } : null;

const BG = 0x8c8c8c;
// ?static=1: no animation loop, frames only via window.renderFrame() (headless checks with software GL).
const STATIC = query.get('static') === '1';
const presentationOptions = resolveAssemblyOptions({ headset: query.get('headset') ?? 'on', body: query.get('body') ?? 'none', exploded: query.get('exploded') ?? '0' });
const annotation = createAssemblyLabels();
if (scoutModels) document.querySelector('#assembly-labels .assembly-footnote').textContent = 'S01–S13 = Scout-Teile · R/L = Seite (R = rechts in der Frontansicht) · Abstände nur zur Darstellung';
let assemblyParts = [];
const showLabels = query.get('labels') !== '0';
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: STATIC });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.getElementById('app').appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(BG);

// Studio environment: RoomEnvironment plus three large softboxes (key, fill, rim) baked into the PMREM.
const envScene = new RoomEnvironment();
for (const [pos, size, power] of [
  [[-3, 3, 4], [4, 3], 5], // key: front left, high
  [[4, 1, 3], [3, 3], 2], // fill: front right
  [[0, 3, -4], [5, 2], 4], // rim: behind
]) {
  const box = new THREE.Mesh(new THREE.PlaneGeometry(...size), new THREE.MeshBasicMaterial({ color: new THREE.Color(power, power, power) }));
  box.position.set(...pos);
  box.lookAt(0, 0, 0);
  envScene.add(box);
}
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(envScene, 0.02).texture;
scene.environmentIntensity = 0.3;

const key = new THREE.DirectionalLight(0xffffff, 1.1);
key.position.set(-2.5, 3.5, 3);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = key.shadow.camera.bottom = -1.5;
key.shadow.camera.right = key.shadow.camera.top = 1.5;
key.shadow.bias = -0.0004;
key.shadow.normalBias = 0.01;
key.shadow.radius = 4;
const fill = new THREE.DirectionalLight(0xdfe6ff, 0.35);
fill.position.set(3, 1, 2);
const rim = new THREE.DirectionalLight(0xffffff, 0.7);
rim.position.set(0.5, 2.5, -3.5);
// The video is a turntable: the helmet turns, the studio stays with the viewer. Key, fill, rim and the environment
// therefore turn with the camera azimuth (lightRig, environmentRotation), so every view is lit like the video.
const lightRig = new THREE.Group();
lightRig.add(key, fill, rim, key.target);
scene.add(lightRig, new THREE.HemisphereLight(0xffffff, 0x444444, 0.25));

// Camera views matched to the extracted video frames (refs/ref_*.png: 0 s, 1.5 s, 3 s, 4.5 s).
const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 50);
const target = new THREE.Vector3(0, -0.06, 0);
const VIEWS = {
  front: { az: 0, el: 3, dist: 2.6 },
  left: { az: 64, el: 4, dist: 2.6 },
  back: { az: 180, el: 7, dist: 2.6 },
  right: { az: 298, el: 4, dist: 2.6 },
  assembly: { az: 325, el: 18, dist: 7.8 },
};
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.copy(target);

let model;
let current = 'front';
let turntable = false;
const M = createMaterials(materialFinish.name, materialAccents.name);

function setCameraView(name) {
  if (name === 'turntable') {
    setTurntable(!turntable);
    return;
  }
  const v = { ...VIEWS[name] };
  if (!VIEWS[name]) throw new Error(`unknown view ${name}`);
  setTurntable(false);
  if (scoutModels && presentationOptions.exploded > 0) { target.set(...SCOUT_FRAME.explodedTarget); v.dist = SCOUT_FRAME.explodedDist; }
  else if (presentationOptions.exploded > 0) {
    const withShoulders = presentationOptions.body === 'shoulders', full = presentationOptions.body === 'full';
    target.set(0, full ? fullBodyParams.camera.explodedTarget : withShoulders ? -.55 : .05, 0);
    v.dist = full ? fullBodyParams.camera.explodedDist : withShoulders ? 9.8 : name === 'assembly' ? 7.8 : 8.8;
  }
  else if (presentationOptions.body === 'shoulders') { target.set(0, -.49, 0); v.dist = 4.7; }
  else if (presentationOptions.body === 'full') { target.set(0, fullBodyParams.camera.target, 0); v.dist = fullBodyParams.camera.dist; }
  else if (presentationOptions.body === 'legacy') { target.set(0, -.8, 0); v.dist = 5.4; }
  else target.set(0, -.06, 0);
  current = name;
  const az = THREE.MathUtils.degToRad(v.az), el = THREE.MathUtils.degToRad(v.el);
  lightRig.rotation.y = az;
  scene.environmentRotation.set(0, az, 0);
  camera.position.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(v.dist).add(target);
  controls.target.copy(target);
  camera.lookAt(target);
  controls.update();
  updateOverlay();
  markButtons();
}

function setTurntable(on) {
  turntable = on;
  if (!on && model) model.rotation.y = 0;
  if (on) {
    current = 'front';
    lightRig.rotation.y = 0;
    scene.environmentRotation.set(0, 0, 0);
    const v = { ...VIEWS.front, dist: camera.position.distanceTo(target) }, el = THREE.MathUtils.degToRad(v.el);
    camera.position.set(0, Math.sin(el), Math.cos(el)).multiplyScalar(v.dist).add(target);
    controls.target.copy(target);
    controls.update();
  }
  updateOverlay();
  markButtons();
}

// Reference overlay (onion skin): the ref frame of the active view over the canvas.
const overlay = document.getElementById('overlay');
let overlayOn = false;
let overlayMode = 'normal';
function updateOverlay() {
  const show = overlayOn && !turntable && presentationOptions.body === 'none' && presentationOptions.exploded === 0 && current !== 'assembly';
  overlay.style.display = show ? 'block' : 'none';
  if (show) overlay.src = `/refs/ref_${current}.png`;
  overlay.classList.toggle('diff', overlayMode === 'difference');
  document.getElementById('btn-overlay').classList.toggle('on', overlayOn);
}
function toggleOverlay(on = !overlayOn, mode = overlayMode) {
  overlayOn = on;
  overlayMode = mode;
  updateOverlay();
}
addEventListener('keydown', (e) => {
  if (e.key === 'o' || e.key === 'O') toggleOverlay();
});

function markButtons() {
  for (const b of document.querySelectorAll('#bar [data-view]')) {
    b.classList.toggle('on', b.dataset.view === 'turntable' ? turntable : !turntable && b.dataset.view === current);
  }
}
for (const b of document.querySelectorAll('#bar [data-view]')) b.addEventListener('click', () => setCameraView(b.dataset.view));
document.getElementById('btn-overlay').addEventListener('click', () => toggleOverlay());

// Post-processing: ambient occlusion, bloom only above the emissive threshold (visor), ACES in the output pass.
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }));
composer.addPass(new RenderPass(scene, camera));
const gtao = new GTAOPass(scene, camera, 1, 1);
gtao.pdNoiseTexture.dispose();
gtao.pdNoiseTexture = denoiseTexture();
gtao.pdMaterial.uniforms.tNoise.value = gtao.pdNoiseTexture;
window.renderSettings = { denoiseSeed: DENOISE_SEED };
gtao.updateGtaoMaterial({ radius: 0.12, distanceExponent: 1.5, thickness: 0.6, scale: 1.0 });
gtao.blendIntensity = 0.9;
composer.addPass(gtao);
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.08, 0.0, 0.9);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// Silhouette mode for the IoU measurement: model white on black, no post-processing.
const maskMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
let maskMode = false;
function setMaskMode(on) {
  maskMode = on;
}

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h);
  composer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();

function disposeModel(obj) {
  obj.traverse((o) => o.geometry?.dispose());
}

function rebuild() {
  // URL-level variant selection survives geometry resets and GUI rebuilds.
  D.foreheadPlates.enabled = strips === 'on';
  const rot = model ? model.rotation.y : 0;
  if (model) {
    scene.remove(model);
    if (!scoutModels) disposeModel(model);
  }
  const t0 = performance.now();
  if (scoutModels) {
    model = presentationOptions.exploded > 0 ? scoutModels.exploded : scoutModels.assembled;
    assemblyParts = presentationOptions.exploded > 0 ? scoutParts(model) : [];
    annotation.setGroups(assemblyParts);
    model.rotation.y = rot;
    scene.add(model);
    window.assemblyParts = assemblyParts;
    return;
  }
  model = buildHelmet(M);
  configureHelmetAssembly(model, presentationOptions);
  if (presentationOptions.body === 'legacy') model.add(buildBodyStudy(M));
  applyArmorFinish(model, M);
  applyArmorAccents(model, M, materialAccents.name);
  if (presentationOptions.body === 'shoulders') model.add(buildShoulderStudy(M));
  if (presentationOptions.body === 'full') model.add(buildFullBody(M));
  if (presentationOptions.exploded > 0) model = createExplodedAssembly(model, presentationOptions.exploded);
  assemblyParts = assemblyDescription(model);
  annotation.setGroups(assemblyParts);
  model.rotation.y = rot;
  scene.add(model);
  window.assemblyParts = assemblyParts;
  console.log(`model built in ${(performance.now() - t0).toFixed(0)} ms`);
}

async function exportGLB() {
  const glb = await new GLTFExporter().parseAsync(model, { binary: true });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([glb], { type: 'model/gltf-binary' }));
  a.download = scoutModels ? (presentationOptions.exploded > 0 ? 'scout_exploded.glb' : 'scout.glb') : presentationOptions.exploded > 0 ? 'scifi_helmet_exploded.glb' : presentationOptions.body === 'shoulders' ? 'scifi_shoulder_study.glb' : presentationOptions.body === 'full' ? 'scifi_full_body.glb' : presentationOptions.body === 'legacy' ? 'scifi_body_study.glb' : 'scifi_helmet.glb';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
document.getElementById('btn-export').addEventListener('click', exportGLB);

// lil-gui: live geometry parameters; geometry rebuilds after a change is finished.
function buildGui() {
  const gui = new GUI({ title: 'Helm-Parameter' });
  gui.close();
  const re = () => rebuild();
  const assembly = gui.addFolder('Aufbau und Varianten');
  const changeAssembly = () => { rebuild(); setCameraView(presentationOptions.exploded > 0 ? 'assembly' : 'front'); };
  if (scoutModels) {
    // Scout comes from the Blender generator: only the presentation can change here, not the geometry.
    gui.title('Scout v3 (Blender)');
    assembly.add(presentationOptions, 'exploded', { montiert: 0, explodiert: 1 }).name('Ansicht').onFinishChange(changeAssembly);
    assembly.add({ parts:()=>annotation.togglePanel() }, 'parts').name('Bauteile S01–S13');
    const look = gui.addFolder('Look');
    look.add(bloom, 'strength', 0, 2, 0.01).name('Bloom');
    look.add(gtao, 'blendIntensity', 0, 1, 0.01).name('AO');
    look.add(renderer, 'toneMappingExposure', 0.4, 2, 0.01).name('Belichtung');
    gui.add({ exportGLB }, 'exportGLB').name('scout.glb');
    return;
  }
  assembly.add(presentationOptions, 'headset', { sichtbar:'on', ausgeblendet:'off' }).name('Kopfhörer + Band').onFinishChange(changeAssembly);
  assembly.add(presentationOptions, 'body', { 'nur Helm':'none', 'Schultern + Hals':'shoulders', 'Gesamtkörper':'full', 'alte Körperstudie':'legacy' }).name('Körper').onFinishChange(changeAssembly);
  assembly.add(presentationOptions, 'exploded', 0, 1, .05).name('Explosionsabstand').onFinishChange(changeAssembly);
  assembly.add({ parts:()=>annotation.togglePanel() }, 'parts').name('Bauteile / Anschlüsse');
  const f1 = gui.addFolder('Proportionen');
  f1.add(D.head, 'tilt', -0.3, 0.3, 0.01).name('Kuppel Neigung').onFinishChange(re);
  f1.add(D, 'capEdgeY', 0.2, 0.42, 0.005).name('Kappenkante Y').onFinishChange(re);
  f1.add(D.core, 'rx', 0.28, 0.4, 0.005).name('Kern Breite').onFinishChange(re);
  f1.add(D.core, 'rz', 0.33, 0.48, 0.005).name('Kern Tiefe').onFinishChange(re);
  f1.add(D.collar, 'tilt', -0.2, 0.3, 0.01).name('Kragen Neigung').onFinishChange(re);
  const f2 = gui.addFolder('Visier');
  f2.add(D.visor, 'angleDeg', 0, 25, 0.5).name('V-Winkel °').onFinishChange(re);
  f2.add(D.visor, 'width', 0.08, 0.24, 0.005).name('Breite').onFinishChange(re);
  f2.add(D.visor, 'height', 0.03, 0.12, 0.002).name('Höhe').onFinishChange(re);
  f2.add(D.visor, 'x', 0.1, 0.25, 0.005).name('Abstand X').onFinishChange(re);
  f2.add(D.visor, 'y', -0.05, 0.2, 0.005).name('Höhe Y').onFinishChange(re);
  f2.add(D.visor, 'socketDepth', 0.0, 0.08, 0.002).name('Tiefe Augenhöhle').onFinishChange(re);
  f2.add(D.visor, 'slitDepth', 0.005, 0.06, 0.002).name('Tiefe Schlitz').onFinishChange(re);
  f2.add(M.visorGlow, 'emissiveIntensity', 0, 10, 0.1).name('Leuchtstärke');
  const f3 = gui.addFolder('Spiralkabel');
  f3.add(D.tube, 'coilRadius', 0.006, 0.03, 0.001).name('Wendel-Radius').onFinishChange(re);
  f3.add(D.tube, 'wireRadius', 0.003, 0.012, 0.0005).name('Draht-Radius').onFinishChange(re);
  f3.add(D.tube, 'pitch', 0.008, 0.03, 0.001).name('Steigung').onFinishChange(re);
  D.tube.points.forEach((p, i) => {
    const f = f3.addFolder(`Punkt ${i + 1}`).close();
    ['x', 'y', 'z'].forEach((axis, k) => f.add(p, String(k), -0.7, 0.7, 0.005).name(axis).onFinishChange(re));
  });
  const f5 = gui.addFolder('Look');
  f5.add(bloom, 'strength', 0, 2, 0.01).name('Bloom');
  f5.add(gtao, 'blendIntensity', 0, 1, 0.01).name('AO');
  f5.add(renderer, 'toneMappingExposure', 0.4, 2, 0.01).name('Belichtung');
  gui.add({ overlay: () => toggleOverlay() }, 'overlay').name('Overlay (O)');
  gui.add({ diff: () => toggleOverlay(true, overlayMode === 'difference' ? 'normal' : 'difference') }, 'diff').name('Overlay: Differenz');
  gui.add({ json: () => console.log(JSON.stringify(D, null, 2)) }, 'json').name('Parameter → Konsole');
  gui.add({ reset: () => { resetParams(); D.foreheadPlates.enabled = strips === 'on'; gui.destroy(); buildGui(); rebuild(); } }, 'reset').name('Zurücksetzen');
  gui.add({ exportGLB }, 'exportGLB').name('scifi_helmet.glb');
}

rebuild();
buildGui();
setCameraView(VIEWS[query.get('view')] ? query.get('view') : presentationOptions.exploded > 0 ? 'assembly' : 'front');
if (query.get('turntable') === '1') setTurntable(true);
if (query.get('overlay')) toggleOverlay(true, query.get('overlay') === 'diff' ? 'difference' : 'normal');

function renderFrame() {
  annotation.update(camera, model, showLabels && presentationOptions.exploded > 0 && !maskMode);
  if (maskMode) {
    scene.overrideMaterial = maskMaterial;
    scene.background = new THREE.Color(0x000000);
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.render(scene, camera);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    scene.background = new THREE.Color(BG);
    scene.overrideMaterial = null;
  } else {
    composer.render();
  }
}

const timer = new THREE.Timer();
let frames = 0;
if (STATIC) {
  renderFrame();
  window.__ready = true;
} else {
  renderer.setAnimationLoop(() => {
    timer.update();
    const dt = timer.getDelta();
    if (turntable && model) model.rotation.y -= dt * ((Math.PI * 2) / 12);
    controls.update();
    renderFrame();
    if (++frames === 3) window.__ready = true;
  });
}

Object.assign(window, { THREE, scene, camera, controls, renderFrame, setCameraView, toggleOverlay, setMaskMode, exportGLB, rebuild, fullBodyParams, helmetParams: D, materialFinish, materialAccents, presentationOptions, assemblyParts, shoulderStudyParams });
