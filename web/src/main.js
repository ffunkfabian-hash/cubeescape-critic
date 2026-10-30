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
import { ROBOT_MODELS, ROBOT_FRAME, loadRobot, setRobotExplosion, robotParts, assemblyOf, shoulderSide } from './robotBodies.js';
import { modelSource } from './modelSource.js';
import { setRobotWear, releaseRobotWear } from './robotWear.js';
import { SKINS, loadSkinAtlas, loadSkinTextures, prepareSkin, applySkin, releaseSkin, skinState, bakeSkinTextures, useBakedMaterial } from './robotSkins.js';
import { HELMETS, CRITIC_VARIANTS, COLOR_SCHEMES, HELMET_FRAME_METERS, dressBody, isStudyHelmetPart, matchRobotColors, paletteMaterials, schemePalette, setRobotHelmet } from './robotHelmet.js';
import { createNavigation, thumb } from './navigation.js';
import { createLoadingBar } from './loadingBar.js';
import { FINISH_PRESETS, ACCENT_PRESETS } from './finishPresets.js';

let query = new URLSearchParams(location.search);
if (query.get('ui') === '0') document.body.classList.add('noui');
const loading = createLoadingBar();
// Page state from the URL. Since 0.20 "Livery" a model link or a setting that used to reload the page loads the next page in place
// (go, readPage, enterPage): renderer, lights and navigation stay. robotLook, robotHelmet and presentationOptions are the same objects
// for the whole session (window.* refers to them), the other values are replaced per page.
// ?model=scout: Scout v3 instead of the three.js helmet H; geometry GUI is off.
// ?model=waechter|paladin|mechanik: one of the three robot bodies in its own frame (ROBOT_FRAME).
// Bodies and Scout come from the three.js generator (web/src/robotgen) as exported GLBs (tools/robotgen_export.mjs, 0.18);
// &gen=three builds them live in the browser, &gen=blender (alias glb) loads the frozen Blender export (modelSource.js).
// The skin atlases (assets/skins/<model>) are baked from the exported GLBs and fit the live build as well.
const MODEL_NAMES = ['critic', 'scout', ...Object.keys(ROBOT_MODELS)];
let materialFinish, materialAccents, strips, modelName, robotGen, scoutModels = null, robotModel = null;
// &wear=on|off: aged material of the colour scheme (robotWear.js) or its flat colours.
// &skin=none|<key of skins.json>: skin of body and helmet (robotSkins.js, atlases assets/skins/<model>). Wear and dirt are part of
// the recipe, so the aged shader is off while a skin is shown; the colour scheme stays underneath.
const robotLook = {};
const skinOn = () => robotLook.skin !== 'none';
// &helmet=study|critic|scout (robots only): helmet on the robot's head segment (robotHelmet.js); 'study' (helmet of the body GLB)
// stays reachable by URL as archive. &helmetVariant=80…88 (Critic helmet on a robot): finish, accents and forehead strips of the
// stored variants (criticHelmetVariants.json); &headset=on|off as on the helmet alone.
// &colors=body|helmet|original: Farbschema 1 (body palette, ballonRoles.json), Farbschema 2 (helmet H's own colours on every role,
// robotHelmetColors.json › scheme2) for bodies and helmets alike, aged; or each model in its own materials. Helmet materials map to
// the roles via robotHelmetColors.json. Headless reference checks pass colors=original (verify_renders.mjs).
const robotHelmet = {};
const presentationOptions = {};
// atlases of the shown models (body and both helmets on a robot), loaded when a skin is first shown, keyed by atlas model
// (waechter, paladin, mechanik, critic, scout). The Blender reference (&gen=blender) has other meshes: a skin paints it without maps.
const skinAtlases = {};
const atlasOf = kind => (kind === 'body' ? modelName : kind);
async function ensureSkinAtlases(name = modelName, robot = !!robotModel) {
  const models = robot ? [name, 'critic', 'scout'] : [name];
  await Promise.all([loadSkinTextures(), ...models.map(async m => { skinAtlases[m] ??= await loadSkinAtlas(m); })]);
}
const pageTitle = name => (ROBOT_MODELS[name] ? ROBOT_MODELS[name].de.replace(/ \(.*/, '') : name === 'scout' ? 'Scout' : 'Helm H');

// Everything a URL asks for, validated and loaded, without touching the shown page: a failed or overtaken load leaves it as it was.
async function readPage(q) {
  const finish = resolveFinish(q.get('finish') ?? 'original'), accents = resolveAccents(q.get('accents') ?? 'original');
  const stripsOn = q.get('strips') ?? 'on';
  if (!['on', 'off'].includes(stripsOn)) throw new Error(`Unknown strips ${JSON.stringify(stripsOn)}; expected on or off`);
  const name = q.get('model') ?? 'critic';
  if (!MODEL_NAMES.includes(name)) throw new Error(`Unknown model ${JSON.stringify(name)}; expected ${MODEL_NAMES.join(', ')}`);
  const gen = modelSource(q.get('gen') ?? 'export');
  const look = { wear: q.get('wear') ?? 'on', skin: q.get('skin') ?? 'none' };
  if (!['on', 'off'].includes(look.wear)) throw new Error(`Unknown wear ${JSON.stringify(look.wear)}; expected on or off`);
  if (look.skin !== 'none' && !SKINS[look.skin]) throw new Error(`Unknown skin ${JSON.stringify(look.skin)}; expected none${Object.keys(SKINS).map(k => ', ' + k).join('')}`);
  const helmet = { kind: q.get('helmet') ?? 'critic', variant: q.get('helmetVariant') ?? CRITIC_VARIANTS.default, colors: q.get('colors') ?? 'body' };
  if (!HELMETS[helmet.kind]) throw new Error(`Unknown helmet ${JSON.stringify(helmet.kind)}; expected ${Object.keys(HELMETS).join(', ')}`);
  if (!CRITIC_VARIANTS.variants[helmet.variant]) throw new Error(`Unknown helmetVariant ${JSON.stringify(helmet.variant)}; expected ${Object.keys(CRITIC_VARIANTS.variants).join(', ')}`);
  if (!COLOR_SCHEMES[helmet.colors]) throw new Error(`Unknown colors ${JSON.stringify(helmet.colors)}; expected ${Object.keys(COLOR_SCHEMES).join(', ')}`);
  const presentation = resolveAssemblyOptions({ headset: q.get('headset') ?? 'on', exploded: q.get('exploded') ?? '0' });
  const [scout, robot] = await Promise.all([
    name === 'scout' ? Promise.all([loadScout(false, gen), loadScout(true, gen)]).then(([assembled, exploded]) => ({ assembled, exploded })) : null,
    ROBOT_MODELS[name] ? loadRobot(name, { gen }) : null]);
  const [helmetModel] = await Promise.all([robot ? makeRobotHelmet(helmet.kind, helmet.variant, presentation.headset, gen) : null,
    look.skin !== 'none' ? ensureSkinAtlases(name, !!robot) : null]);
  return { query: q, finish, accents, strips: stripsOn, name, gen, look, helmet, presentation, scout, robot, helmetModel };
}

const BG = 0x8c8c8c;
// ?static=1: no animation loop, frames only via window.renderFrame() (headless checks with software GL).
const STATIC = query.get('static') === '1';
const annotation = createAssemblyLabels();
const footnote = document.querySelector('#assembly-labels .assembly-footnote');
const FOOTNOTES = { critic: footnote.textContent, scout: 'S01–S13 = Scout-Teile · R/L = Seite (R = rechts in der Frontansicht) · Abstände nur zur Darstellung',
  robot: 'Baugruppen des Körpers · R/L = Körperseite · Socket_* = Anker zur Elternbaugruppe · Abstände nur zur Darstellung' };
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
let M = null; // materials of helmet H alone (finish and accents of the page), built once per pair
const criticMaterials = new Map();

// Helmet for a robot body: helmet H in the chosen variant 80–88 (without its presentation neck) or Scout.
const variantMaterials = new Map();
async function makeRobotHelmet(kind, variant = robotHelmet.variant, headset = presentationOptions.headset, gen = robotGen) {
  if (kind === 'scout') return loadScout(false, gen);
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

// Skins: the roots that carry one (robot: body without the hung-in helmet, and the helmet; helmet alone: its model root).
function robotSkinRoots() {
  const out = [{ root: robotModel.children[0], kind: 'body', skip: o => !!o.userData.helmet }];
  const holder = robotModel.getObjectByName(`helmet_${robotHelmet.kind}`);
  // the atlas keys start at the helmet's own root: Helm H as built, Scout at its GLB scene (inside the group of loadScout)
  const helmet = robotHelmet.kind === 'scout' ? holder?.children[0]?.children[0] : holder?.children[0];
  if (helmet) out.push({ root: helmet, kind: robotHelmet.kind, skip: () => false });
  return out;
}
const applySkinIfPrepared = (root, key) => { const st = skinState(root); if (st) applySkin(st, key); };
function skinStandalone(root, kind) {
  setRobotWear(root, false, { metersPerWorld: HELMET_FRAME_METERS });
  applySkin(prepareSkin(root, kind, skinAtlases[atlasOf(kind)]), robotLook.skin);
}
// prepared skin states with a skin shown (texture and GLB export)
function activeSkinStates() {
  const roots = robotModel ? robotSkinRoots().map(r => r.root) : scoutModels ? [model.children[0]] : [model];
  return roots.map(skinState).filter(st => st?.active);
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
    if (!scoutModels && !robotModel) { releaseSkin(model); releaseRobotWear(model); disposeModel(model); }
  }
  const t0 = performance.now();
  if (scoutModels) {
    model = presentationOptions.exploded > 0 ? scoutModels.exploded : scoutModels.assembled;
    if (skinOn()) skinStandalone(model.children[0], 'scout');
    else { applySkinIfPrepared(model.children[0], null); dressStandalone(model, 'scout'); }
    assemblyParts = presentationOptions.exploded > 0 ? scoutParts(model) : [];
    annotation.setGroups(assemblyParts);
    model.rotation.y = rot;
    scene.add(model);
    window.assemblyParts = assemblyParts;
    return;
  }
  if (robotModel) {
    model = robotModel;
    // order matters: a skin restores the flat state it found, the aged shader records its own flat state
    if (!skinOn()) for (const root of robotSkinRoots()) applySkinIfPrepared(root.root, null);
    setRobotWear(model, robotLook.wear === 'on' && !skinOn());
    if (skinOn()) for (const { root, kind, skip } of robotSkinRoots()) applySkin(prepareSkin(root, kind, skinAtlases[atlasOf(kind)], { skip }), robotLook.skin);
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
  if (skinOn()) skinStandalone(model, 'critic');
  else dressStandalone(model, 'critic');
  assemblyParts = assemblyDescription(model);
  annotation.setGroups(assemblyParts);
  model.rotation.y = rot;
  scene.add(model);
  window.assemblyParts = assemblyParts;
  console.log(`model built in ${(performance.now() - t0).toFixed(0)} ms`);
}

// Exports run one after another: each swaps materials over an await (GLTFExporter) and puts them back afterwards.
let exportQueue = Promise.resolve();
function exportGLB() {
  const run = exportQueue.then(exportGLBNow);
  exportQueue = run.catch(() => {});
  return run;
}
async function exportGLBNow() {
  // The aged look is a viewer shader (non-indexed copies, custom attributes): bodies and helmets export flat. A helmet alone in a
  // colour scheme exports the scheme's flat role materials, in `colors=original` its own.
  clearHighlight(); // first: the highlight remembers the aged materials
  const aged = robotLook.wear === 'on' && !skinOn() && (robotModel || robotHelmet.colors !== 'original'); // a skin exports its textures
  const opts = robotModel ? {} : { metersPerWorld: HELMET_FRAME_METERS };
  if (aged) setRobotWear(model, false, opts);
  const restore = activeSkinStates().map(st => useBakedMaterial(st, bakeSkinTextures(renderer, st)));
  const glb = await new GLTFExporter().parseAsync(model, { binary: true }).finally(() => {
    // paint changed meanwhile (skin chosen, material flat): the rebuild has set the new look, which stays
    if (aged && robotLook.wear === 'on' && !skinOn()) setRobotWear(model, true, opts);
    for (const r of restore) r();
    requestRender(true);
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([glb], { type: 'model/gltf-binary' }));
  a.download = robotModel ? `${model.name}.glb` : scoutModels ? (presentationOptions.exploded > 0 ? 'scout_exploded.glb' : 'scout.glb') : presentationOptions.exploded > 0 ? 'scifi_helmet_exploded.glb' : 'scifi_helmet.glb';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// lil-gui (Critic helmet only): live geometry parameters; geometry rebuilds after a change is finished. Since 0.20 it sits in the
// right panel (section Helm-Geometrie); models, variants, views, parts and look are the navigation (buildNavigation).
let gui = null;
function buildGui() {
  gui?.destroy();
  gui = null;
  if (scoutModels || robotModel) return;
  // in the right panel (section Helm-Geometrie) when the navigation is shown, else floating and closed
  gui = new GUI({ title: 'Helm-Parameter', container: guiHost ?? undefined });
  if (!guiHost) gui.close();
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
  gui.add({ reset: () => { resetParams(); D.foreheadPlates.enabled = strips === 'on'; buildGui(); rebuild(); } }, 'reset').name('Zurücksetzen');
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
      .map(p => ({ label: p.part_de + side[a.id === 'shoulders' ? shoulderSide(p.objects[0]) : p.side], meshes: p.objects.map(n => byName.get(n)).filter(m => m && !replacedByHelmet(m)) }))
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
  for (const root of [old.children[0], old.children[0]?.children[0]]) if (root) releaseSkin(root); // Helm H or Scout (its GLB scene)
  releaseRobotWear(old);
  if (old.userData.robotHelmet === 'critic') old.traverse(o => o.geometry?.dispose());
}
// Texture export of the shown skin: base colour, ORM and emission per atlas (body, helmet) as PNG downloads.
async function exportSkinTextures() {
  const states = activeSkinStates();
  if (!states.length) { alert('Kein Skin aktiv – zuerst unter „Lackierung“ einen Skin wählen.'); return; }
  clearHighlight();
  // bake everything first: the downloads wait for PNG encoding, the paint may change meanwhile
  const files = states.flatMap(st => Object.entries(bakeSkinTextures(renderer, st)).map(([kind, img]) => ({ img, name: `${st.atlas.model}_${st.active}_${kind}.png` })));
  requestRender(true);
  for (const { img, name } of files) {
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    c.getContext('2d').putImageData(img, 0, 0);
    const blob = await new Promise(r => c.toBlob(r, 'image/png'));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  return files.map(f => f.name);
}
// The frame (bar and panels) is built once; its content per page (buildNavigation after every page change). Bar: models and camera
// views; left panel "Modell": helmet and variants, close-ups, parts; right panel "Look": paint, display, helmet geometry, export.
let nav = null;
const navPerf = document.createElement('span');
let guiHost = null; // section of the right panel that holds lil-gui (Helm H)
function buildNavigation() {
  if (!nav) {
    nav = createNavigation({ onToggle: () => { resize(); if (current && !turntable) setCameraView(current); }, onLink: search => go(search) });
    setInterval(() => {
      if (frameTimes.length < 10) { navPerf.textContent = 'ruht'; return; }
      const t = [...frameTimes].sort((a, b) => a - b), avg = t.reduce((x, y) => x + y, 0) / t.length;
      navPerf.textContent = `ø ${avg.toFixed(1)} ms · p95 ${t[Math.floor(t.length * 0.95)].toFixed(0)} ms`;
      frameTimes.length = 0;
    }, 1000);
  }
  nav.clear();
  const isCritic = !scoutModels && !robotModel;
  const href = params => '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== '')).toString();
  // Bar: shown model and camera views
  const headKind = robotModel ? robotHelmet.kind : scoutModels ? 'scout' : 'critic';
  const headLabel = { study: 'Studie', critic: 'Helm H', scout: 'Scout' };
  nav.title(robotModel ? `${pageTitle(modelName)} · ${headLabel[headKind]}` : `${headLabel[headKind]} ohne Körper`);
  nav.views([['front', 'Front'], ['left', 'Links'], ['back', 'Hinten'], ['right', 'Rechts'], ['assembly', 'Übersicht'], ['turntable', 'Drehteller']]
    .map(([v, label]) => ({ view: v, label: `${label} – Maus: links drehen, rechts verschieben, Rad zoomen`, onClick: () => setCameraView(v) })));
  const reload = (key, value) => { const q = new URLSearchParams(query); q.set(key, value); go(q); };
  const variantTiles = Object.entries(CRITIC_VARIANTS.variants).map(([value, v]) => ({ value, label: v.label.replace(', weiße Streifen', ' · Weiß').replace(', Kontraststreifen', ' · Kontrast').replace(' ohne Blenden', ' · ohne'), badge: value,
    title: `${value} ${v.label}`, img: thumb(`variant_${value}`) }));

  // Left panel: body and head (links to other pages keep paint and source), Helm H's variants only while Helm H is the head
  const keep = { colors: robotHelmet.colors === 'body' ? null : robotHelmet.colors, wear: robotLook.wear === 'on' ? null : robotLook.wear, skin: skinOn() ? robotLook.skin : null };
  const keepGen = { gen: robotGen !== 'export' && !isCritic ? robotGen : null };
  const alone = kind => (kind === 'scout' ? href({ model: 'scout', ...keepGen, ...keep }) : href({ ...keep })); // a head without body
  const sModel = nav.section('left', 'Roboter');
  nav.heading(sModel, 'Körper');
  const bodyTiles = nav.tiles(sModel, [
    ...Object.entries(ROBOT_MODELS).map(([key, r]) => ({ value: key, label: pageTitle(key), title: `Körper ${r.de}`, img: thumb(`model_${key}`),
      href: href({ model: key, helmet: headKind, ...keepGen, ...keep }) })),
    { value: 'none', label: 'ohne', title: 'Kopf ohne Körper', icon: 'noBody', href: alone(headKind) }], robotModel ? modelName : 'none', null, { columns: 4 });
  nav.heading(sModel, 'Kopf');
  const headKinds = Object.keys(HELMETS).filter(k => k !== 'study' || headKind === 'study');
  const helmetChoice = nav.tiles(sModel, headKinds.map(k => ({ value: k, label: headLabel[k], title: robotModel ? `${HELMETS[k]} auf dem Körper` : `${HELMETS[k]} ohne Körper`,
    img: thumb(`model_${k}`), href: robotModel ? undefined : alone(k) })), headKind, kind => { helmetOptions.hidden = kind !== 'critic'; switchHelmet({ kind }); });
  // variants and headset belong to Helm H (Scout has none)
  const helmetOptions = document.createElement('div');
  helmetOptions.hidden = headKind !== 'critic';
  sModel.append(helmetOptions);
  nav.heading(helmetOptions, 'Variante Helm H');
  let switchHelmet = null;
  if (robotModel) {
    // Re-dress the robot after a helmet setting changed; the URL and the links to the other bodies and to the head alone keep the settings.
    const urlKeys = { kind: 'helmet', variant: 'helmetVariant', headset: 'headset', colors: 'colors' };
    switchHelmet = async change => {
      const run = ++helmetRun, next = { ...robotHelmet, ...change }, headset = change.headset ?? presentationOptions.headset;
      const [helmet] = await loading.track(Promise.all([makeRobotHelmet(next.kind, next.variant, headset), skinOn() ? ensureSkinAtlases() : null]), 'Lade Helm …');
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
      for (const a of document.querySelectorAll('a.nav-link')) {
        const q = new URLSearchParams(a.search);
        if (!ROBOT_MODELS[q.get('model')]) continue;
        for (const [k, name] of Object.entries(urlKeys)) q.set(name, k === 'headset' ? presentationOptions.headset : robotHelmet[k]);
        a.search = '?' + q;
      }
      bodyTiles.elements.at(-1).search = new URL(alone(robotHelmet.kind), location.href).search;
      helmetChoice.set(robotHelmet.kind);
      helmetOptions.hidden = robotHelmet.kind !== 'critic';
      nav.title(`${pageTitle(modelName)} · ${headLabel[robotHelmet.kind]}`);
      rebuild();
      await loading.track(compileShown(), 'Helm wird aufgebaut …');
    };
    nav.tiles(helmetOptions, variantTiles, robotHelmet.variant, variant => switchHelmet({ variant, kind: 'critic' }), { prefix: 'Helm H: ' });
    nav.toggle(helmetOptions, 'Kopfhörer', presentationOptions.headset === 'on', on => switchHelmet({ headset: on ? 'on' : 'off', kind: 'critic' }));
  }
  if (isCritic) {
    const variantNow = Object.entries(CRITIC_VARIANTS.variants).find(([, v]) => v.finish === materialFinish.name && v.accents === materialAccents.name && v.strips === strips)?.[0];
    nav.tiles(helmetOptions, variantTiles, variantNow, value => {
      const v = CRITIC_VARIANTS.variants[value];
      const q = new URLSearchParams(query);
      q.set('finish', v.finish); q.set('accents', v.accents); q.set('strips', v.strips);
      go(q);
    });
    nav.toggle(helmetOptions, 'Kopfhörer', presentationOptions.headset === 'on', on => reload('headset', on ? 'on' : 'off'));
  }
  const sClose = nav.section('left', 'Nahansicht');
  const asmBox = (...ids) => { const ms = []; robotModel.traverse(o => { if (o.isMesh && ids.includes(assemblyOf(o))) ms.push(o); }); return visibleBox(ms); };
  if (robotModel) nav.buttons(sClose, [['Kopf', ['head'], 1.15], ['Oberkörper', ['upper_body'], 1.05], ['Schultern', ['shoulders'], 1.1], ['Becken', ['lower_body'], 1.1], ['Beine', ['legs'], 1.0], ['Arme', ['arms'], 1.0]]
    .map(([label, ids, margin]) => ({ label, title: 'Nahansicht der Baugruppe', onClick: () => frameBox(asmBox(...ids), margin) })));
  else nav.buttons(sClose, [['Gesicht', 0.15, 0.85], ['Krone', 0.6, 1.0], ['Kinn + Hals', 0, 0.45]].map(([label, lo, hi]) => ({ label, title: 'Nahansicht', onClick: () => frameRegion(lo, hi) })));
  const sParts = nav.section('left', 'Bauteile', false);
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
  nav.left.append(Object.assign(document.createElement('span'), { textContent: 'Bildzeit' }), navPerf);

  // Right panel: Look. Colour scheme or skin, for body and helmet together.
  const sPaint = nav.section('right', 'Lackierung');
  const setLinks = () => { for (const a of document.querySelectorAll('a.nav-link')) { const q = new URLSearchParams(a.search); if (skinOn()) q.set('skin', robotLook.skin); else q.delete('skin'); a.search = '?' + q; } };
  let paintRun = 0;
  // Colour schemes 1 and 2 (one scheme for every model, 0.12); 'original' (each model in its own materials) is the reference of the
  // checks (verify, colors=original) and sits under "Referenz & Export".
  nav.heading(sPaint, 'Farbschema');
  const setScheme = async colors => {
    ++paintRun;
    skinChoice.set(null);
    schemeChoice.set(colors);
    originalSwitch.set(colors === 'original');
    if (!robotModel) { const q = new URLSearchParams(query); q.delete('skin'); q.set('colors', colors); go(q); return; } // a helmet alone is re-dressed from its source
    clearHighlight();
    const wasSkin = skinOn();
    robotLook.skin = 'none';
    query.delete('skin');
    for (const { root } of robotSkinRoots()) applySkinIfPrepared(root, null); // before re-dressing: the skin hides the role materials
    history.replaceState(null, '', '?' + query);
    setLinks();
    if (colors !== robotHelmet.colors) await switchHelmet({ colors });
    else if (wasSkin) rebuild();
  };
  const schemeChoice = nav.tiles(sPaint, Object.entries(COLOR_SCHEMES).filter(([value]) => value !== 'original').map(([value, s]) => ({ value, label: s.label, title: s.title, img: thumb(`scheme_${value}`) })),
    skinOn() ? null : robotHelmet.colors, setScheme);
  if (robotModel || robotHelmet.colors !== 'original') nav.toggle(sPaint, 'gealtert (nur Farbschema)', robotLook.wear === 'on', on => {
    const v = on ? 'on' : 'off';
    clearHighlight();
    robotLook.wear = v;
    query.set('wear', v);
    history.replaceState(null, '', '?' + query);
    if (robotModel) { if (!skinOn()) setRobotWear(robotModel, v === 'on'); requestRender(true); } else rebuild();
  }, 'Farbschema mit Abrieb und Schmutz oder flach; Skins bringen ihre Alterung selbst mit');
  nav.heading(sPaint, 'Skins');
  const skinChoice = nav.tiles(sPaint, Object.entries(SKINS).map(([value, s]) => ({ value, label: s.de, swatch: s.swatch, img: thumb(`skin_${value}`),
    title: `${s.de} (skins.json): Muster, Abrieb und Schmutz im Shader, Karten aus dem UV-Atlas` })),
    skinOn() ? robotLook.skin : null, async v => {
      const run = ++paintRun;
      schemeChoice.set(null);
      originalSwitch.set(false);
      try {
        await loading.track(ensureSkinAtlases(), 'Lade Skin …'); // all atlases of the model first (on a robot: body, Helm H and Scout), so a rebuild meanwhile keeps the old paint
      } catch (e) {
        if (run === paintRun) { skinChoice.set(skinOn() ? robotLook.skin : null); schemeChoice.set(skinOn() ? null : robotHelmet.colors); }
        throw e;
      }
      if (run !== paintRun) return; // a later click won
      robotLook.skin = v;
      clearHighlight();
      query.set('skin', v);
      history.replaceState(null, '', '?' + query);
      setLinks();
      rebuild();
      await loading.track(compileShown(), 'Skin wird aufgebaut …');
    }, { prefix: 'Skin ' });
  const sLook = nav.section('right', 'Darstellung', false);
  const explode = v => { presentationOptions.exploded = v; rebuild(); setCameraView(v > 0 ? 'assembly' : 'front'); };
  if (scoutModels) nav.choice(sLook, 'Explosion', [{ value: 0, label: 'montiert' }, { value: 1, label: 'explodiert' }], presentationOptions.exploded > 0 ? 1 : 0, explode);
  else nav.slider(sLook, 'Explosion', { min: 0, max: 1, step: 0.05, value: presentationOptions.exploded, format: v => v.toFixed(2), live: !!robotModel }, explode);
  nav.toggle(sLook, 'Beschriftungen in der Explosion', showLabels, v => { showLabels = v; requestRender(); });
  nav.slider(sLook, 'Belichtung', { min: 0.4, max: 2, step: 0.01, value: renderer.toneMappingExposure, format: v => v.toFixed(2), live: true }, v => { renderer.toneMappingExposure = v; requestRender(); });
  nav.slider(sLook, 'Bloom', { min: 0, max: 2, step: 0.01, value: bloom.strength, format: v => v.toFixed(2), live: true }, v => { bloom.strength = v; requestRender(); });
  nav.slider(sLook, 'AO', { min: 0, max: 1, step: 0.01, value: gtao.blendIntensity, format: v => v.toFixed(2), live: true }, v => { gtao.blendIntensity = v; requestRender(); });
  nav.choice(sLook, 'Beim Drehen', [{ value: true, label: 'flüssig', title: 'ohne AO während der Bewegung' }, { value: false, label: 'volle Qualität' }], quality.light, v => { quality.light = v; });
  if (isCritic) nav.buttons(sLook, [{ label: 'Overlay', title: 'Referenzbild der Ansicht (Taste O)', onClick: () => toggleOverlay() },
    { label: 'Overlay Differenz', onClick: () => toggleOverlay(true, overlayMode === 'difference' ? 'normal' : 'difference') }]);
  guiHost = isCritic ? nav.section('right', 'Helm-Geometrie', false) : null;
  guiHost?.classList.add('nav-gui');
  const sExport = nav.section('right', 'Referenz & Export', false);
  const originalSwitch = nav.toggle(sExport, 'Originalmaterialien (Referenz)', !skinOn() && robotHelmet.colors === 'original', on => setScheme(on ? 'original' : 'body'),
    COLOR_SCHEMES.original.title + ' – Referenz der Prüfungen (verify), kein Farbschema');
  nav.buttons(sExport, [{ label: 'GLB exportieren', title: 'aktuelles Modell als GLB (Roboter: flache Lieferfassung; mit Skin: gebackene Texturen)', onClick: exportGLB },
    { label: 'Skin-Texturen', title: 'Skin als Basisfarbe, ORM und Emission im UV-Atlas (PNG, 2048²) je Modell', onClick: exportSkinTextures }]);
  // Source of bodies and Scout (robotBodies.js › SOURCES), next page
  if (!isCritic) nav.choice(sExport, 'Quelle', [{ value: 'export', label: 'Export', title: 'GLB aus dem three.js-Generator (Lieferpaket, Standard)' },
    { value: 'three', label: 'Live', title: 'three.js-Generator im Browser (web/src/robotgen; dauert)' }, { value: 'blender', label: 'Blender', title: 'eingefrorener Blender-Export (Referenz der Messungen)' }],
    robotGen, v => reload('gen', v));
  nav.note(sExport, 'Tasten: [ und ] blenden die Leisten aus, O zeigt das Referenz-Overlay (Helm H).');
  markButtons();
}

// Page change in place (0.20): the shown model is freed (prepared skins, aged copies, Helm H geometry; GLB geometry stays in the
// loader cache), the next one is dressed and built, then GUI, navigation content and camera follow. The camera stays where it is
// between models of the same kind (robot to robot), so bodies and skins can be compared from the same view.
const pageKind = () => (robotModel ? 'robot' : scoutModels ? 'scout' : 'critic');
let shownKind = null;
function leavePage() {
  if (!model) return;
  clearHighlight();
  onRebuilt = () => {};
  scene.remove(model);
  if (robotModel) {
    let helmet = null;
    robotModel.traverse(o => { if (o.userData.robotHelmet) helmet = o; });
    for (const { root } of robotSkinRoots()) releaseSkin(root);
    releaseRobotWear(robotModel);
    if (helmet?.userData.robotHelmet === 'critic') helmet.traverse(o => o.geometry?.dispose());
  } else if (scoutModels) for (const m of [scoutModels.assembled, scoutModels.exploded]) { releaseSkin(m.children[0]); releaseRobotWear(m); }
  else { releaseSkin(model); releaseRobotWear(model); disposeModel(model); }
  model = null;
}
function enterPage(page) {
  leavePage();
  query = page.query;
  ({ finish: materialFinish, accents: materialAccents, strips, name: modelName, gen: robotGen, scout: scoutModels, robot: robotModel } = page);
  Object.assign(robotLook, page.look);
  Object.assign(robotHelmet, page.helmet);
  Object.assign(presentationOptions, page.presentation);
  D.foreheadPlates.enabled = strips === 'on';
  const kind = pageKind();
  if (kind === 'critic') {
    const key = `${materialFinish.name}|${materialAccents.name}`;
    if (!criticMaterials.has(key)) criticMaterials.set(key, createMaterials(materialFinish.name, materialAccents.name));
    M = criticMaterials.get(key);
  }
  footnote.textContent = FOOTNOTES[kind];
  if (robotModel) {
    if (robotHelmet.colors === 'helmet') dressBody(robotModel, schemeMaterials('helmet'));
    setRobotHelmet(robotModel, robotHelmet.kind, page.helmetModel, robotHelmet.colors, schemeMaterials(robotHelmet.colors));
  }
  rebuild();
  if (query.get('ui') !== '0') buildNavigation();
  buildGui();
  if (kind !== shownKind) {
    setCameraView(VIEWS[query.get('view')] ? query.get('view') : presentationOptions.exploded > 0 ? 'assembly' : 'front');
    if (query.get('turntable') === '1') setTurntable(true);
    if (query.get('overlay')) toggleOverlay(true, query.get('overlay') === 'diff' ? 'difference' : 'normal');
  } else {
    updateOverlay();
    markButtons();
  }
  shownKind = kind;
  document.title = `${pageTitle(modelName)} – Roboter-Viewer`;
  Object.assign(window, { materialFinish, materialAccents });
}
// Shaders of new materials (a skin, a helmet) compile in parallel before the next frame; meanwhile the last frame stays on screen.
let compiling = 0;
async function compileShown() {
  if (STATIC) return;
  compiling++;
  try { await renderer.compileAsync(scene, camera); } catch (e) { console.warn('compileAsync', e); } finally { compiling--; requestRender(true); }
}
// Next page from a link or setting (search: string or URLSearchParams); history 'push' (default), 'replace' or 'none' (back/forward).
let pageRun = 0;
async function go(search, history_ = 'push') {
  const run = ++pageRun, q = new URLSearchParams(search);
  loading.start(`Lade ${pageTitle(q.get('model') ?? 'critic')} …`);
  try {
    const page = await readPage(q);
    if (run === pageRun) {
      enterPage(page);
      if (history_ === 'push') history.pushState(null, '', '?' + q);
      else if (history_ === 'replace') history.replaceState(null, '', '?' + q);
      await compileShown();
    }
  } catch (e) {
    console.error(e);
    if (run === pageRun) {
      loading.fail(`Fehler: ${e.message ?? e}`);
      if (history_ === 'none') history.replaceState(null, '', '?' + query); // back/forward to a page that failed: show what is shown
      if (query.get('ui') !== '0') buildNavigation(); // undo the link marked on click
      return;
    }
  }
  loading.end();
}
addEventListener('popstate', () => { if (location.search.slice(1) !== query.toString()) go(location.search, 'none'); });

try {
  enterPage(await readPage(query));
} catch (e) {
  loading.fail(`Fehler: ${e.message ?? e}`);
  throw e;
}

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
  loading.end();
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
    if (!needsRender || compiling) { lastFrame = 0; return; }
    needsRender = false;
    const now = performance.now();
    if (lastFrame) { frameTimes.push(now - lastFrame); if (frameTimes.length > 90) frameTimes.shift(); }
    lastFrame = now;
    renderFrame();
    if (++frames === 3) { window.__ready = true; loading.end(); }
  });
}

Object.assign(window, { GLTFExporter, SKINS, go, exportSkinTextures, activeSkinStates, bakeSkinTextures, robotLook, robotHelmet, partTree, requestRender, renderer, THREE, scene, camera, controls, renderFrame, setCameraView, toggleOverlay, setMaskMode, exportGLB, rebuild, helmetParams: D, materialFinish, materialAccents, presentationOptions, assemblyParts });
