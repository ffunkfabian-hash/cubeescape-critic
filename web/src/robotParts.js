// Viewer for the procedural robot built from the model sheet: orthographic views matching the sheet drawings,
// sheet overlay aligned to the model, mask mode for the IoU check, GLB export.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import sheet from './robot/sheet.json';
import { buildRobot } from './robot/parts.js';

const query = new URLSearchParams(location.search);
if (query.get('ui') === '0') document.body.classList.add('noui');
const STATIC = query.get('static') === '1';
const BG = 0xffffff;
const SPAN = 2.0; // visible height in units
const TARGET = new THREE.Vector3(0, 0.95, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: STATIC });
renderer.setPixelRatio(STATIC ? 1 : Math.min(devicePixelRatio, 2));
document.getElementById('app').appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(BG);
scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa0a8, 2.2));
const key = new THREE.DirectionalLight(0xffffff, 1.2);
key.position.set(-1.5, 3, 2.5);
scene.add(key);

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 50);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(TARGET);
controls.enableDamping = !STATIC;

const t0 = performance.now();
const model = await buildRobot();
scene.add(model);
console.log(`model built in ${(performance.now() - t0).toFixed(0)} ms`);

// View directions as in the sheet: camera on +Z for front, on -X for the robot's right side, etc.
const VIEWS = { front: [0, 0, 1], back: [0, 0, -1], right: [-1, 0, 0], left: [1, 0, 0], top: [0, 1, 0.0001] };
let current = 'front';

function frustum() {
  const a = innerWidth / innerHeight;
  camera.top = SPAN / 2;
  camera.bottom = -SPAN / 2;
  camera.left = (-SPAN / 2) * a;
  camera.right = (SPAN / 2) * a;
  camera.updateProjectionMatrix();
}

function setCameraView(name) {
  if (!VIEWS[name]) return;
  current = name;
  const t = name === 'top' ? new THREE.Vector3(0, 1.2, 0) : TARGET;
  camera.position.copy(t).addScaledVector(new THREE.Vector3(...VIEWS[name]).normalize(), 10);
  camera.up.set(0, name === 'top' ? 0 : 1, name === 'top' ? -1 : 0);
  camera.lookAt(t);
  controls.target.copy(t);
  camera.zoom = 1;
  frustum();
  controls.update();
  updateOverlay();
  for (const b of document.querySelectorAll('#bar [data-view]')) b.classList.toggle('on', b.dataset.view === name);
}

// Sheet overlay: scale and shift the whole sheet so the active drawing lies exactly over the orthographic render.
const overlay = document.getElementById('overlay');
let overlayOn = false, overlayMode = 'normal';
function updateOverlay() {
  overlay.style.display = overlayOn ? 'block' : 'none';
  overlay.classList.toggle('diff', overlayMode === 'difference');
  document.getElementById('btn-overlay').classList.toggle('on', overlayOn);
  if (!overlayOn) return;
  const v = sheet.views[current];
  const t = current === 'top' ? [0, 1.2, 0] : TARGET.toArray();
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const sx = v.ox + sheet.scale * dot(t, v.U), sy = v.oy - sheet.scale * dot(t, v.V);
  const k = innerHeight / SPAN / sheet.scale;
  Object.assign(overlay.style, {
    left: `${innerWidth / 2 - k * sx}px`, top: `${innerHeight / 2 - k * sy}px`,
    width: `${k * sheet.size[0]}px`, height: `${k * sheet.size[1]}px`, transform: 'none',
  });
  overlay.src = '/robot/sheet.png';
}
function toggleOverlay(on = !overlayOn, mode = overlayMode) {
  overlayOn = on;
  overlayMode = mode;
  updateOverlay();
}
addEventListener('keydown', (e) => (e.key === 'o' || e.key === 'O') && toggleOverlay());
for (const b of document.querySelectorAll('#bar [data-view]')) b.addEventListener('click', () => setCameraView(b.dataset.view));
document.getElementById('btn-overlay').addEventListener('click', () => toggleOverlay());

const maskMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
let maskMode = false;
const setMaskMode = (on) => (maskMode = on);

async function exportGLB() {
  const solid = model.clone();
  solid.children = solid.children.filter((c) => !c.name.endsWith('_Outline'));
  const glb = await new GLTFExporter().parseAsync(solid, { binary: true });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([glb], { type: 'model/gltf-binary' }));
  a.download = 'scifi_robot_parts.glb';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
document.getElementById('btn-export').addEventListener('click', exportGLB);

function resize() {
  renderer.setSize(innerWidth, innerHeight);
  frustum();
  updateOverlay();
}
addEventListener('resize', resize);
resize();
setCameraView(VIEWS[query.get('view')] ? query.get('view') : 'front');
if (query.get('overlay')) toggleOverlay(true, query.get('overlay') === 'diff' ? 'difference' : 'normal');

function renderFrame() {
  if (maskMode) {
    scene.overrideMaterial = maskMaterial;
    scene.background = new THREE.Color(0x000000);
    renderer.render(scene, camera);
    scene.background = new THREE.Color(BG);
    scene.overrideMaterial = null;
  } else {
    renderer.render(scene, camera);
  }
}

let turntable = false;
document.querySelector('#bar [data-view="turntable"]')?.addEventListener('click', () => (turntable = !turntable));
if (STATIC) {
  renderFrame();
  window.__ready = true;
} else {
  const timer = new THREE.Timer();
  renderer.setAnimationLoop(() => {
    timer.update();
    if (turntable) model.rotation.y -= timer.getDelta() * ((Math.PI * 2) / 12);
    else model.rotation.y = 0;
    controls.update();
    renderFrame();
    window.__ready = true;
  });
}

Object.assign(window, { THREE, scene, camera, model, renderFrame, setCameraView, toggleOverlay, setMaskMode, exportGLB, sheet });
