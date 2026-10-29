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
import { configureHelmetAssembly, createExplodedAssembly, assemblyDescription, assemblyInventory } from './assembly.js';
import { resolveAssemblyOptions } from './assemblyOptions.js';
import { createAssemblyLabels } from './assemblyLabels.js';
import { D, resetParams } from './params.js';
import { loadScout, scoutParts, SCOUT_FRAME } from './scout.js';
import { ROBOT_MODELS, ROBOT_FRAME, loadRobot, setRobotExplosion, robotParts } from './robotBodies.js';
import { setRobotWear, releaseRobotWear } from './robotWear.js';
import { HELMETS, CRITIC_VARIANTS, COLOR_SCHEMES, HELMET_FRAME_METERS, dressBody, isStudyHelmetPart, matchRobotColors, paletteMaterials, schemePalette, setRobotHelmet } from './robotHelmet.js';
import { createNavigation } from './navigation.js';
import { FINISH_PRESETS, ACCENT_PRESETS } from './finishPresets.js';

const query = new URLSearchParams(location.search);
const materialFinish = resolveFinish(query.get('finish') ?? 'original');
const materialAccents = resolveAccents(query.get('accents') ?? 'original');
const strips = query.get('strips') ?? 'on';
if (!['on', 'off'].includes(strips)) throw new Error(`Unknown strips ${JSON.stringify(strips)}; expected on or off`);
D.foreheadPlates.enabled = strips === 'on';
if (query.get('ui') === '0') document.body.classList.add('noui');
// ?model=scout: the Blender-built Scout v3 (blender/scout) as GLB instead of the three.js helmet; geometry GUI is off.
// ?model=waechter|paladin|mechanik: one of the three robot bodies (blender/robot) as GLB in its own frame (ROBOT_FRAME);
// &gen=three builds the body with the three.js generator instead (web/src/robotgen, bodies in GENERATED).
const modelName = query.get('model') ?? 'critic';
const MODEL_NAMES = ['critic', 'scout', ...Object.keys(ROBOT_MODELS)];
if (!MODEL_NAMES.includes(modelName)) throw new Error(`Unknown model ${JSON.stringify(modelName)}; expected ${MODEL_NAMES.join(', ')}`);
const scoutModels = modelName === 'scout' ? { assembled: await loadScout(false), exploded: await loadScout(true) } : null;
const robotModel = ROBOT_MODELS[modelName] ? await loadRobot(modelName, { gen: query.get('gen') ?? 'glb' }) : null;
// &wear=on|off: aged material of the colour scheme (robotWear.js) or its flat colours.
const robotLook = { wear: query.get('wear') ?? 'on' };
if (!['on', 'off'].includes(robotLook.wear)) throw new Error(`Unknown wear ${JSON.stringify(robotLook.wear)}; expected on or off`);
// &helmet=study|critic|scout (robots only): helmet on the robot's head segment (robotHelmet.js).
const robotHelmet = { kind: query.get('helmet') ?? 'critic' }; // 'study' (helmet of the body GLB) stays reachable by URL as archive
if (!HELMETS[robotHelmet.kind]) throw new Error(`Unknown helmet ${JSON.stringify(robotHelmet.kind)}; expected ${Object.keys(HELMETS).join(', ')}`);
// &helmetVariant=80…88 (Critic helmet on a robot): finish, accents and forehead strips of the stored variants
// (criticHelmetVariants.json); &headset=on|off as on the helmet alone.
robotHelmet.variant = query.get('helmetVariant') ?? CRITIC_VARIANTS.default;
if (!CRITIC_VARIANTS.variants[robotHelmet.variant]) throw new Error(`Unknown helmetVariant ${JSON.stringify(robotHelmet.variant)}; expected ${Object.keys(CRITIC_VARIANTS.variants).join(', ')}`);
// &colors=body|helmet|original: Farbschema 1 (body palette, ballonRoles.json), Farbschema 2 (helmet H's own colours on every role,
// robotHelmetColors.json › scheme2) for bodies and helmets alike, aged; or each model in its own materials. Helmet materials map to
// the roles via robotHelmetColors.json. Headless reference checks pass colors=original (verify_renders.mjs).
robotHelmet.colors = query.get('colors') ?? 'body';
if (!COLOR_SCHEMES[robotHelmet.colors]) throw new Error(`Unknown colors ${JSON.stringify(robotHelmet.colors)}; expected ${Object.keys(COLOR_SCHEMES).join(', ')}`);

const BG = 0x8c8c8c;
// ?static=1: no animation loop, frames only via window.renderFrame() (headless checks with software GL).
const STATIC = query.get('static') === '1';
const presentationOptions = resolveAssemblyOptions({ headset: query.get('headset') ?? 'on', exploded: query.get('exploded') ?? '0' });
const annotation = createAssemblyLabels();
if (scoutModels) document.querySelector('#assembly-labels .assembly-footnote').textContent = 'S01–S13 = Scout-Teile · R/L = Seite (R = rechts in der Frontansicht) · Abstände nur zur Darstellung';
if (robotModel) document.querySelector('#assembly-labels .assembly-footnote').textContent = 'Baugruppen des Körpers · R/L = Körperseite · Socket_* = Anker zur Elternbaugruppe · Abstände nur zur Darstellung';
let assemblyParts = [];
let showLabels = query.get('labels') !== '0';
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: STATIC });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
// Render on demand (0.12): a frame only after a change; the shadow map only when model, light rig or visibility change.
renderer.shadowMap.autoUpdate = STATIC; // headless checks and probes keep per-frame shadows as before
renderer.shadowMap.needsUpdate = true;
let needsRender = true;
// While the camera is dragged (and its damping runs out) the light quality skips the AO pass; on release the full frame follows.
const quality = { light: true };
const frameTimes = [];
function requestRender(shadows = false) {
  needsRender = true;
  if (shadows) renderer.shadowMap.needsUpdate = true;
}
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

// Helmet for a robot body: helmet H in the chosen variant 80–88 (without its presentation neck) or Scout.
const variantMaterials = new Map();
async function makeRobotHelmet(kind, variant = robotHelmet.variant, headset = presentationOptions.headset) {
  if (kind === 'scout') return loadScout(false);
  if (kind !== 'critic') return null;
  const v = CRITIC_VARIANTS.variants[variant], key = `${v.finish}|${v.accents}`;
  if (!variantMaterials.has(key)) variantMaterials.set(key, createMaterials(v.finish, v.accents));
  const Mv = variantMaterials.get(key), strips = D.foreheadPlates.enabled;
  D.foreheadPlates.enabled = v.strips === 'on';
  let helmet;
  try { helmet = buildHelmet(Mv); } finally { D.foreheadPlates.enabled = strips; }
  configureHelmetAssembly(helmet, { headset, neck: false });
  applyArmorFinish(helmet, Mv);
  applyArmorAccents(helmet, Mv, v.accents);
  helmet.userData.finish = v.finish;
  return helmet;
}
// Role materials of a colour scheme: 1 = the body's own GLB materials (or the same palette from data for a helmet alone),
// 2 = helmet H's original materials on every role (built once).
let scheme2 = null;
function schemeMaterials(colors) {
  if (colors === 'helmet') return scheme2 ??= schemePalette(createMaterials('original', 'original'));
  return robotModel?.userData.roleMaterials ?? paletteMaterials();
}
if (robotModel) {
  if (robotHelmet.colors === 'helmet') dressBody(robotModel, schemeMaterials('helmet'));
  setRobotHelmet(robotModel, robotHelmet.kind, await makeRobotHelmet(robotHelmet.kind), robotHelmet.colors, schemeMaterials(robotHelmet.colors));
}

function setCameraView(name) {
  if (name === 'turntable') {
    setTurntable(!turntable);
    return;
  }
  const v = { ...VIEWS[name] };
  if (!VIEWS[name]) throw new Error(`unknown view ${name}`);
  setTurntable(false);
  if (scoutModels && presentationOptions.exploded > 0) { target.set(...SCOUT_FRAME.explodedTarget); v.dist = SCOUT_FRAME.explodedDist; }
  else if (robotModel) {
    const exploded = presentationOptions.exploded > 0;
    target.set(0, exploded ? ROBOT_FRAME.camera.explodedTarget : ROBOT_FRAME.camera.target, 0);
    v.dist = exploded ? ROBOT_FRAME.camera.explodedDist : ROBOT_FRAME.camera.dist;
  }
  else if (presentationOptions.exploded > 0) { target.set(0, .05, 0); v.dist = name === 'assembly' ? 7.8 : 8.8; }
  else target.set(0, -.06, 0);
  current = name;
  // Views are set for landscape windows; below an aspect of 0.6 (portrait pane, navigation open) the camera moves back.
  v.dist *= Math.max(1, 0.6 / camera.aspect);
  const az = THREE.MathUtils.degToRad(v.az), el = THREE.MathUtils.degToRad(v.el);
  lightRig.rotation.y = az;
  scene.environmentRotation.set(0, az, 0);
  camera.position.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(v.dist).add(target);
  controls.target.copy(target);
  camera.lookAt(target);
  controls.update();
  updateOverlay();
  markButtons();
  requestRender(true);
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
  requestRender(true);
}

// Reference overlay (onion skin): the ref frame of the active view over the canvas.
const overlay = document.getElementById('overlay');
let overlayOn = false;
let overlayMode = 'normal';
function updateOverlay() {
  const show = overlayOn && !turntable && !robotModel && presentationOptions.exploded === 0 && current !== 'assembly';
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
  for (const b of document.querySelectorAll('[data-view]')) {
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

const appElement = document.getElementById('app');
function resize() {
  const w = appElement.clientWidth || innerWidth, h = appElement.clientHeight || innerHeight;
  renderer.setSize(w, h);
  composer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  requestRender();
}
addEventListener('resize', resize);
resize();

function disposeModel(obj) {
  obj.traverse((o) => o.geometry?.dispose());
}

// A helmet shown alone in a colour scheme: its materials take the scheme's roles, then it ages like the bodies.
function dressStandalone(root, kind) {
  if (robotHelmet.colors === 'original') return;
  matchRobotColors(root, kind, schemeMaterials(robotHelmet.colors), materialFinish.name);
  setRobotWear(root, robotLook.wear === 'on', { metersPerWorld: HELMET_FRAME_METERS });
}

// Rebuild after a variant change: highlight off (it swaps materials), new model, fresh shadows, part tree refreshed.
let onRebuilt = () => {};
function rebuild() {
  clearHighlight();
  rebuildModel();
  requestRender(true);
  onRebuilt();
}
function rebuildModel() {
  // URL-level variant selection survives geometry resets and GUI rebuilds.
  D.foreheadPlates.enabled = strips === 'on';
  const rot = model ? model.rotation.y : 0;
  if (model) {
    scene.remove(model);
    if (!scoutModels && !robotModel) { releaseRobotWear(model); disposeModel(model); }
  }
  const t0 = performance.now();
  if (scoutModels) {
    model = presentationOptions.exploded > 0 ? scoutModels.exploded : scoutModels.assembled;
    dressStandalone(model, 'scout');
    assemblyParts = presentationOptions.exploded > 0 ? scoutParts(model) : [];
    annotation.setGroups(assemblyParts);
    model.rotation.y = rot;
    scene.add(model);
    window.assemblyParts = assemblyParts;
    return;
  }
  if (robotModel) {
    model = robotModel;
    setRobotWear(model, robotLook.wear === 'on');
    setRobotExplosion(model, presentationOptions.exploded);
    assemblyParts = presentationOptions.exploded > 0 ? robotParts(model) : [];
    annotation.setGroups(assemblyParts);
    model.rotation.y = rot;
    scene.add(model);
    window.assemblyParts = assemblyParts;
    return;
  }
  model = buildHelmet(M);
  configureHelmetAssembly(model, presentationOptions);
  applyArmorFinish(model, M);
  applyArmorAccents(model, M, materialAccents.name);
  if (presentationOptions.exploded > 0) model = createExplodedAssembly(model, presentationOptions.exploded);
  dressStandalone(model, 'critic');
  assemblyParts = assemblyDescription(model);
  annotation.setGroups(assemblyParts);
  model.rotation.y = rot;
  scene.add(model);
  window.assemblyParts = assemblyParts;
  console.log(`model built in ${(performance.now() - t0).toFixed(0)} ms`);
}

async function exportGLB() {
  // The aged look is a viewer shader (non-indexed copies, custom attributes): bodies and helmets export flat. A helmet alone in a
  // colour scheme exports the scheme's flat role materials, in `colors=original` its own.
  clearHighlight(); // first: the highlight remembers the aged materials
  const aged = robotLook.wear === 'on' && (robotModel || robotHelmet.colors !== 'original');
  const opts = robotModel ? {} : { metersPerWorld: HELMET_FRAME_METERS };
  if (aged) setRobotWear(model, false, opts);
  const glb = await new GLTFExporter().parseAsync(model, { binary: true }).finally(() => { if (aged) setRobotWear(model, true, opts); });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([glb], { type: 'model/gltf-binary' }));
  a.download = robotModel ? `${model.name}.glb` : scoutModels ? (presentationOptions.exploded > 0 ? 'scout_exploded.glb' : 'scout.glb') : presentationOptions.exploded > 0 ? 'scifi_helmet_exploded.glb' : 'scifi_helmet.glb';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
document.getElementById('btn-export').addEventListener('click', exportGLB);

// lil-gui (top right, Critic helmet only): live geometry parameters; geometry rebuilds after a change is finished. Models,
// variants, views, parts and look live in the navigation on the left (buildNavigation).
function buildGui() {
  if (scoutModels || robotModel) return;
  const gui = new GUI({ title: 'Helm-Parameter' });
  gui.close();
  const re = () => rebuild();
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
  // in a colour scheme the visor wears the scheme's light material, so the slider drives that one
  const glow = robotHelmet.colors === 'original' ? M.visorGlow : schemeMaterials(robotHelmet.colors).get('reticle_cyan');
  f2.add(glow, 'emissiveIntensity', 0, 10, 0.1).name('Leuchtstärke').onChange(() => requestRender()); // the light role is not aged: this material is on the mesh
  const f3 = gui.addFolder('Spiralkabel');
  f3.add(D.tube, 'coilRadius', 0.006, 0.03, 0.001).name('Wendel-Radius').onFinishChange(re);
  f3.add(D.tube, 'wireRadius', 0.003, 0.012, 0.0005).name('Draht-Radius').onFinishChange(re);
  f3.add(D.tube, 'pitch', 0.008, 0.03, 0.001).name('Steigung').onFinishChange(re);
  D.tube.points.forEach((p, i) => {
    const f = f3.addFolder(`Punkt ${i + 1}`).close();
    ['x', 'y', 'z'].forEach((axis, k) => f.add(p, String(k), -0.7, 0.7, 0.005).name(axis).onFinishChange(re));
  });
  gui.add({ json: () => console.log(JSON.stringify(D, null, 2)) }, 'json').name('Parameter → Konsole');
  gui.add({ reset: () => { resetParams(); D.foreheadPlates.enabled = strips === 'on'; gui.destroy(); buildGui(); rebuild(); } }, 'reset').name('Zurücksetzen');
}

// Highlight of the selected part in the navigation: emissive tint on per-material clones, originals restored on clear.
const highlight = { meshes: new Map(), clones: new Map() };
function clearHighlight() {
  for (const [mesh, material] of highlight.meshes) mesh.material = material;
  highlight.meshes.clear();
  requestRender();
}
function setHighlight(meshes) {
  clearHighlight();
  const tint = m => {
    if (!highlight.clones.has(m)) {
      const c = m.clone();
      c.onBeforeCompile = m.onBeforeCompile; // keep the wear shader (Material.copy does not carry it)
      c.customProgramCacheKey = m.customProgramCacheKey;
      if (c.emissive) { c.emissive = new THREE.Color(0x2fb8ac); c.emissiveIntensity = 0.55; c.emissiveMap = null; }
      highlight.clones.set(m, c);
    }
    return highlight.clones.get(m);
  };
  for (const mesh of meshes) { highlight.meshes.set(mesh, mesh.material); mesh.material = Array.isArray(mesh.material) ? mesh.material.map(tint) : tint(mesh.material); }
  requestRender();
}

// Camera onto a box (part, region), keeping the current viewing direction.
function frameBox(box, margin = 1.35) {
  if (box.isEmpty()) return;
  setTurntable(false);
  const c = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
  const dir = camera.position.clone().sub(controls.target).normalize();
  const fit = Math.max(size.y, size.x / camera.aspect, size.z) * 0.5 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  target.copy(c);
  controls.target.copy(c);
  camera.position.copy(c).addScaledVector(dir, Math.max(fit * margin + size.z * 0.5, 0.3));
  camera.lookAt(c);
  controls.update();
  current = null;
  markButtons();
  requestRender(true);
}
const visibleBox = (objects) => {
  const box = new THREE.Box3();
  for (const root of objects) root.traverse(o => { if (o.isMesh && o.visible) { let v = true; for (let p = o; p; p = p.parent) v &&= p.visible; if (v) box.expandByObject(o); } });
  return box;
};
// Region of the whole model between two height fractions (0 = feet, 1 = top), e.g. head, chest, legs.
function frameRegion(lo, hi) {
  model.updateMatrixWorld(true);
  const all = visibleBox([model]), h = all.max.y - all.min.y;
  const box = new THREE.Box3();
  model.traverse(o => {
    if (!o.isMesh || !o.visible) return;
    const b = new THREE.Box3().setFromObject(o);
    const y = (b.getCenter(new THREE.Vector3()).y - all.min.y) / h;
    if (y >= lo && y <= hi) box.union(b);
  });
  box.min.y = Math.max(box.min.y, all.min.y + lo * h);
  box.max.y = Math.min(box.max.y, all.min.y + hi * h);
  frameBox(box, 1.15);
}

// Part tree for the navigation: robots by assembly and part (with the chosen helmet under Kopf), Scout by S-ID, Critic by
// H/F/P IDs as in the exploded labels.
function helmetTree(root, kind) {
  const groups = new Map();
  if (kind === 'scout') root.traverse(o => {
    if (!o.isMesh) return;
    const label = o.userData.part_label ?? o.parent?.userData?.part_label ?? 'Scout';
    if (!groups.has(label)) groups.set(label, { id: label.split(' ')[0], label: label.split(' ').slice(1).join(' '), meshes: [] });
    groups.get(label).meshes.push(o);
  });
  else for (const e of assemblyInventory(root)) {
    if (!groups.has(e.id)) groups.set(e.id, { id: e.id, label: e.label, meshes: [] });
    groups.get(e.id).meshes.push(e.mesh);
  }
  return [...groups.values()];
}
// Study helmet parts hidden because another helmet sits on the robot (not parts the user hid in the tree).
const replacedByHelmet = m => robotHelmet.kind !== 'study' && isStudyHelmetPart(m);
function partTree() {
  const parent = (label, children, id = null) => ({ id, label, children, meshes: children.flatMap(c => c.meshes) });
  if (robotModel) {
    const byName = new Map();
    robotModel.traverse(o => { if (o.isMesh && o.userData.part) byName.set(o.name, o); });
    const side = { R: ' rechts', L: ' links', C: '' };
    const groups = robotModel.userData.parts.assemblies.map(a => parent(a.de, a.parts
      .map(p => ({ label: p.part_de + side[p.side], meshes: p.objects.map(n => byName.get(n)).filter(m => m && !replacedByHelmet(m)) }))
      .filter(c => c.meshes.length)));
    const holder = robotModel.getObjectByName(`helmet_${robotHelmet.kind}`);
    const head = groups[robotModel.userData.parts.assemblies.findIndex(a => a.id === 'head')];
    if (holder) head.children.unshift(parent(HELMETS[robotHelmet.kind], helmetTree(holder, robotHelmet.kind)));
    return groups.map(g => parent(g.label, g.children));
  }
  if (scoutModels) return [parent('Scout v3', helmetTree(model, 'scout'))];
  return [parent('Helm H', helmetTree(model, 'critic'))];
}

let helmetRun = 0; // newest helmet request; slower older loads are dropped
// Put a helmet on the robot and free the previous one (its aged copies; Critic geometry is built per helmet, Scout shares the cache).
function putRobotHelmet(kind, helmet, colors) {
  let old = null;
  robotModel.traverse(o => { if (o.userData.robotHelmet) old = o; });
  setRobotHelmet(robotModel, kind, helmet, colors, schemeMaterials(colors));
  if (!old) return;
  releaseRobotWear(old);
  if (old.userData.robotHelmet === 'critic') old.traverse(o => o.geometry?.dispose());
}
function buildNavigation() {
  const nav = createNavigation({ onToggle: () => { resize(); if (current && !turntable) setCameraView(current); } });
  const isCritic = !scoutModels && !robotModel;
  const href = params => '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== '')).toString();
  // Modelle
  const sModels = nav.section('Modelle');
  const keep = { colors: robotHelmet.colors === 'body' ? null : robotHelmet.colors, wear: robotLook.wear === 'on' ? null : robotLook.wear };
  nav.links(sModels, [
    { group: 'Körper', items: Object.entries(ROBOT_MODELS).map(([key, r]) => ({ label: r.de.replace(/ \(.*/, ''), hint: r.de.match(/\((.*)\)/)?.[1],
      href: href({ model: key, helmet: robotModel ? robotHelmet.kind : null, ...keep }), active: modelName === key })) },
    { group: 'Helme', items: [
      { label: 'Helm H', hint: 'H01–H21 · Varianten 80–88', href: href({ ...keep }), active: isCritic },
      { label: 'Scout', hint: 'S01–S13', href: href({ model: 'scout', ...keep }), active: !!scoutModels }] },
  ]);
  const reload = (key, value) => { query.set(key, value); location.search = query.toString(); };
  if (robotModel) {
    const helmetChoice = nav.choice(sModels, 'Helm', Object.entries(HELMETS).filter(([value]) => value !== 'study' || robotHelmet.kind === 'study').map(([value, title]) => ({ value, title, label: { study: 'Studie', critic: 'Helm H', scout: 'Scout' }[value] })),
      robotHelmet.kind, kind => switchHelmet({ kind }));
    // Re-dress the robot after a helmet setting changed; the URL and the links to the other robots keep the settings.
    const urlKeys = { kind: 'helmet', variant: 'helmetVariant', headset: 'headset', colors: 'colors' };
    const switchHelmet = async change => {
      const run = ++helmetRun, next = { ...robotHelmet, ...change }, headset = change.headset ?? presentationOptions.headset;
      const helmet = await makeRobotHelmet(next.kind, next.variant, headset);
      if (run !== helmetRun) return; // a later click won; state is only written by the winner
      Object.assign(robotHelmet, next);
      presentationOptions.headset = headset;
      clearHighlight();
      putRobotHelmet(next.kind, helmet, next.colors); // first: frees the old helmet's aged copies
      if (change.colors) { // re-dress the body in the new scheme (the prepared geometry stays, the aged materials are rebuilt)
        releaseRobotWear(robotModel, { keepGeometry: true });
        dressBody(robotModel, next.colors === 'helmet' ? schemeMaterials('helmet') : robotModel.userData.roleMaterials);
      }
      for (const [k, q] of Object.entries(urlKeys)) query.set(q, k === 'headset' ? presentationOptions.headset : robotHelmet[k]);
      history.replaceState(null, '', '?' + query);
      for (const a of sModels.querySelectorAll('a.nav-link')) {
        const q = new URLSearchParams(a.search);
        if (!ROBOT_MODELS[q.get('model')]) continue;
        for (const [k, name] of Object.entries(urlKeys)) q.set(name, k === 'headset' ? presentationOptions.headset : robotHelmet[k]);
        a.search = '?' + q;
      }
      helmetChoice.set(robotHelmet.kind);
      rebuild();
    };
    nav.choice(sModels, 'Farbschema', Object.entries(COLOR_SCHEMES).map(([value, s]) => ({ value, label: s.label, title: s.title })),
      robotHelmet.colors, colors => switchHelmet({ colors }));
    const variants = CRITIC_VARIANTS.variants;
    nav.choice(sModels, 'Variante Helm H', Object.entries(variants).map(([value, v]) => ({ value, label: value, title: `${value} ${v.label}: ${v.finish}, ${v.accents}, Blenden ${v.strips}` })),
      robotHelmet.variant, variant => switchHelmet({ variant, kind: 'critic' }));
    nav.choice(sModels, 'Kopfhörer', [{ value: 'on', label: 'an' }, { value: 'off', label: 'aus' }], presentationOptions.headset, headset => switchHelmet({ headset, kind: 'critic' }));
    nav.note(sModels, 'Der Helm sitzt im Kopfsegment am Halsanker und ist auf die Box des Studienhelms eingepasst; der Roboterhals bleibt.');
  }
  if (isCritic) {
    const variantNow = Object.entries(CRITIC_VARIANTS.variants).find(([, v]) => v.finish === materialFinish.name && v.accents === materialAccents.name && v.strips === strips)?.[0];
    nav.choice(sModels, 'Variante', Object.entries(CRITIC_VARIANTS.variants).map(([value, v]) => ({ value, label: value, title: `${value} ${v.label}` })), variantNow, value => {
      const v = CRITIC_VARIANTS.variants[value];
      query.set('finish', v.finish); query.set('accents', v.accents); query.set('strips', v.strips); location.search = query.toString();
    });
    nav.choice(sModels, 'Kopfhörer', [{ value: 'on', label: 'an' }, { value: 'off', label: 'aus' }], presentationOptions.headset, v => reload('headset', v));
  }
  if (!robotModel) nav.choice(sModels, 'Farbschema', Object.entries(COLOR_SCHEMES).map(([value, s]) => ({ value, label: s.label, title: s.title })),
    robotHelmet.colors, v => reload('colors', v));
  // Ansichten
  const sViews = nav.section('Ansichten');
  const views = [['front', 'Front'], ['left', 'Links'], ['back', 'Hinten'], ['right', 'Rechts'], ['assembly', 'Übersicht'], ['turntable', 'Drehteller']];
  nav.buttons(sViews, views.map(([v, label]) => ({ label, onClick: () => setCameraView(v) }))).forEach((b, i) => { b.dataset.view = views[i][0]; });
  const asmBox = (...ids) => { const ms = []; robotModel.traverse(o => { if (o.isMesh && ids.includes(o.userData.asm)) ms.push(o); }); return visibleBox(ms); };
  if (robotModel) nav.buttons(sViews, [['Kopf', ['head'], 1.15], ['Oberkörper', ['upper_body'], 1.05], ['Becken', ['lower_body'], 1.1], ['Beine', ['legs'], 1.0], ['Arme', ['arms'], 1.0]]
    .map(([label, ids, margin]) => ({ label, title: 'Nahansicht der Baugruppe', onClick: () => frameBox(asmBox(...ids), margin) })));
  if (!robotModel) nav.buttons(sViews, [['Gesicht', 0.15, 0.85], ['Krone', 0.6, 1.0], ['Kinn + Hals', 0, 0.45]].map(([label, lo, hi]) => ({ label, title: 'Nahansicht', onClick: () => frameRegion(lo, hi) })));
  nav.note(sViews, 'Maus: links drehen · rechts verschieben · Rad zoomen. Taste O: Referenz-Overlay (Helm H).');
  // Bauteile
  const sParts = nav.section('Bauteile', false);
  const meshesOfTree = () => partTree().flatMap(g => g.meshes);
  const treeActions = {
    select: node => (node ? setHighlight(node.meshes) : clearHighlight()),
    setVisible: (node, v) => { for (const m of node.meshes) m.visible = v; requestRender(true); },
    isolate: node => { for (const m of meshesOfTree()) m.visible = node.meshes.includes(m); requestRender(true); },
    showAll: () => { for (const m of meshesOfTree()) m.visible = true; requestRender(true); },
    frame: node => frameBox(visibleBox(node.meshes)),
  };
  const refreshTree = () => nav.tree(sParts, partTree(), treeActions);
  refreshTree();
  onRebuilt = refreshTree;
  // Look & Material
  const sLook = nav.section('Look & Material');
  if (robotModel || robotHelmet.colors !== 'original') nav.choice(sLook, 'Material', [{ value: 'on', label: 'gealtert' }, { value: 'off', label: 'flach' }], robotLook.wear, v => {
    clearHighlight();
    robotLook.wear = v;
    query.set('wear', v);
    history.replaceState(null, '', '?' + query);
    if (robotModel) { setRobotWear(robotModel, v === 'on'); requestRender(true); } else rebuild();
  });
  const explode = v => { presentationOptions.exploded = v; rebuild(); setCameraView(v > 0 ? 'assembly' : 'front'); };
  if (scoutModels) nav.choice(sLook, 'Explosion', [{ value: 0, label: 'montiert' }, { value: 1, label: 'explodiert' }], presentationOptions.exploded > 0 ? 1 : 0, explode);
  else nav.slider(sLook, 'Explosion', { min: 0, max: 1, step: 0.05, value: presentationOptions.exploded, format: v => v.toFixed(2), live: !!robotModel }, explode);
  nav.toggle(sLook, 'Beschriftungen in der Explosion', showLabels, v => { showLabels = v; requestRender(); });
  nav.slider(sLook, 'Belichtung', { min: 0.4, max: 2, step: 0.01, value: renderer.toneMappingExposure, format: v => v.toFixed(2), live: true }, v => { renderer.toneMappingExposure = v; requestRender(); });
  nav.slider(sLook, 'Bloom', { min: 0, max: 2, step: 0.01, value: bloom.strength, format: v => v.toFixed(2), live: true }, v => { bloom.strength = v; requestRender(); });
  nav.slider(sLook, 'AO', { min: 0, max: 1, step: 0.01, value: gtao.blendIntensity, format: v => v.toFixed(2), live: true }, v => { gtao.blendIntensity = v; requestRender(); });
  nav.choice(sLook, 'Beim Drehen', [{ value: true, label: 'flüssig', title: 'ohne AO während der Bewegung' }, { value: false, label: 'volle Qualität' }], quality.light, v => { quality.light = v; });
  if (isCritic) {
    nav.buttons(sLook, [{ label: 'Overlay', title: 'Referenzbild der Ansicht (Taste O)', onClick: () => toggleOverlay() },
      { label: 'Overlay Differenz', onClick: () => toggleOverlay(true, overlayMode === 'difference' ? 'normal' : 'difference') }]);
  }
  nav.buttons(sLook, [{ label: 'GLB exportieren', title: 'aktuelles Modell als GLB (Roboter: flache Lieferfassung)', onClick: exportGLB }]);
  // Footer: model and frame time while rendering
  const name = document.createElement('span'), perf = document.createElement('span');
  name.textContent = robotModel ? `${ROBOT_MODELS[modelName].de.replace(/ \(.*/, '')} · ${HELMETS[robotHelmet.kind].replace(/ \(.*/, '')}` : scoutModels ? 'Scout' : 'Helm H';
  nav.footer.append(name, perf);
  setInterval(() => {
    if (frameTimes.length < 10) { perf.textContent = 'ruht'; return; }
    const t = [...frameTimes].sort((a, b) => a - b), avg = t.reduce((x, y) => x + y, 0) / t.length;
    perf.textContent = `ø ${avg.toFixed(1)} ms · p95 ${t[Math.floor(t.length * 0.95)].toFixed(0)} ms`;
    frameTimes.length = 0;
  }, 1000);
}

rebuild();
buildGui();
if (query.get('ui') !== '0') buildNavigation();
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
  let endPending = false, lastFrame = 0;
  const setInteractive = on => { gtao.enabled = !(on && quality.light); requestRender(); };
  controls.addEventListener('start', () => { endPending = false; setInteractive(true); });
  controls.addEventListener('end', () => { endPending = true; });
  controls.addEventListener('change', () => requestRender());
  addEventListener('input', () => requestRender());
  addEventListener('change', () => requestRender(true));
  renderer.setAnimationLoop(() => {
    timer.update();
    const dt = timer.getDelta();
    if (turntable && model) { model.rotation.y -= dt * ((Math.PI * 2) / 12); requestRender(true); }
    if (controls.update()) needsRender = true;
    else if (endPending) { endPending = false; setInteractive(false); }
    if (frames < 3) needsRender = true;
    if (!needsRender) { lastFrame = 0; return; }
    needsRender = false;
    const now = performance.now();
    if (lastFrame) { frameTimes.push(now - lastFrame); if (frameTimes.length > 90) frameTimes.shift(); }
    lastFrame = now;
    renderFrame();
    if (++frames === 3) window.__ready = true;
  });
}

Object.assign(window, { robotLook, robotHelmet, partTree, requestRender, renderer, THREE, scene, camera, controls, renderFrame, setCameraView, toggleOverlay, setMaskMode, exportGLB, rebuild, helmetParams: D, materialFinish, materialAccents, presentationOptions, assemblyParts });
