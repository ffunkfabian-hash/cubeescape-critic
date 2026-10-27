// Robot viewer: visual hull reconstructed from all 241 frames of reference/robot/turnaround.mp4
// (web/tools/robot/*.py), camera matched to every single video frame, frame overlay, mask mode, GLB export.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import GUI from 'lil-gui';

const query = new URLSearchParams(location.search);
if (query.get('ui') === '0') document.body.classList.add('noui');
const STATIC = query.get('static') === '1';
const VIDEO = { w: 1280, h: 720 };
const BG = 0xfafafa;

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: STATIC });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
document.getElementById('app').appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(BG);
scene.add(new THREE.HemisphereLight(0xffffff, 0xb0b4b8, 1.6));
const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.position.set(-2, 4, 3);
scene.add(sun);

const camera = new THREE.PerspectiveCamera(20, VIDEO.w / VIDEO.h, 0.05, 200);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const [cam, gltf] = await Promise.all([
  fetch('/robot/camera.json').then((r) => r.json()),
  new GLTFLoader().loadAsync('/robot/robot_hull.glb'),
]);
const model = gltf.scene;
scene.add(model);
const baked = [];
model.traverse((o) => o.isMesh && baked.push([o, o.material]));
const shadedMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, metalness: 0.05 });
const N = cam.phis.length;

const azimuth = (i) => cam.phis[i];
const dist = cam.D > 0 ? cam.D : 100;

// Exact camera of video frame i: azimuth, elevation, distance, scale and principal point from the fit.
let frame = 0;
function setFrameView(i) {
  frame = ((Math.round(i) % N) + N) % N;
  const phi = azimuth(frame), e = cam.e;
  camera.position.set(Math.sin(phi) * Math.cos(e), Math.sin(e), Math.cos(phi) * Math.cos(e)).multiplyScalar(dist);
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
  controls.target.set(0, 0, 0);
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(VIDEO.h / 2 / (cam.s * dist)));
  camera.setViewOffset(VIDEO.w, VIDEO.h, VIDEO.w / 2 - cam.cx, VIDEO.h / 2 - cam.cy, VIDEO.w, VIDEO.h);
  camera.updateProjectionMatrix();
  controls.update();
  params.frame = frame;
  gui?.controllersRecursive().forEach((c) => c.updateDisplay());
  updateOverlay();
}

// Named views: the frame whose azimuth is closest to the wanted direction (front = camera on +Z, left = +X).
const WANT = { front: 0, left: Math.PI / 2, back: Math.PI, right: -Math.PI / 2 };
function frameFor(az) {
  let best = 0, bd = Infinity;
  for (let i = 0; i < N; i++) {
    const d = Math.abs(Math.atan2(Math.sin(azimuth(i) - az), Math.cos(azimuth(i) - az)));
    if (d < bd) [best, bd] = [i, d];
  }
  return best;
}
const VIEWS = Object.fromEntries(Object.entries(WANT).map(([k, a]) => [k, frameFor(a)]));
let current = 'front';
let playing = false;
function setCameraView(name) {
  if (name === 'turntable') {
    playing = !playing;
    markButtons();
    return;
  }
  playing = false;
  current = name;
  setFrameView(VIEWS[name]);
  markButtons();
}

const overlay = document.getElementById('overlay');
let overlayOn = false, overlayMode = 'normal';
function updateOverlay() {
  overlay.style.display = overlayOn ? 'block' : 'none';
  if (overlayOn) overlay.src = `/robot/frames/f${String(frame + 1).padStart(3, '0')}.jpg`;
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
  if (e.key === 'ArrowRight') setFrameView(frame + 1);
  if (e.key === 'ArrowLeft') setFrameView(frame - 1);
});
function markButtons() {
  for (const b of document.querySelectorAll('#bar [data-view]')) {
    b.classList.toggle('on', b.dataset.view === 'turntable' ? playing : !playing && b.dataset.view === current);
  }
}
for (const b of document.querySelectorAll('#bar [data-view]')) b.addEventListener('click', () => setCameraView(b.dataset.view));
document.getElementById('btn-overlay').addEventListener('click', () => toggleOverlay());

function setShaded(on) {
  for (const [mesh, mat] of baked) mesh.material = on ? shadedMat : mat;
}

const maskMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
let maskMode = false;
const setMaskMode = (on) => (maskMode = on);

async function exportGLB() {
  const glb = await new GLTFExporter().parseAsync(model, { binary: true });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([glb], { type: 'model/gltf-binary' }));
  a.download = 'scifi_robot.glb';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
document.getElementById('btn-export').addEventListener('click', exportGLB);

const params = { frame: 0, shaded: false };
let gui;
if (!STATIC) {
  gui = new GUI({ title: 'Roboter' });
  gui.add(params, 'frame', 0, N - 1, 1).name(`Videoframe (0–${N - 1})`).onChange((v) => { playing = false; setFrameView(v); });
  gui.add(params, 'shaded').name('Schattiert statt Videofarben').onChange(setShaded);
  gui.add({ diff: () => toggleOverlay(true, overlayMode === 'difference' ? 'normal' : 'difference') }, 'diff').name('Overlay: Differenz');
  gui.add({ info: () => {} }, 'info').name(`Hüllen-IoU alle Frames: ${cam.hull_iou_all_frames}`).disable();
}

function resize() {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();
setFrameView(query.has('frame') ? +query.get('frame') : VIEWS[query.get('view')] ?? 0);
if (query.get('overlay')) toggleOverlay(true, query.get('overlay') === 'diff' ? 'difference' : 'normal');
markButtons();

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

if (STATIC) {
  renderFrame();
  window.__ready = true;
} else {
  // Turntable replays the video's own camera path: one video frame per 1/24 s.
  const timer = new THREE.Timer();
  let acc = 0;
  renderer.setAnimationLoop(() => {
    timer.update();
    if (playing) {
      acc += timer.getDelta();
      if (acc > 1 / 24) {
        setFrameView(frame + Math.floor(acc * 24));
        acc %= 1 / 24;
      }
    }
    controls.update();
    renderFrame();
    window.__ready = true;
  });
}

Object.assign(window, { THREE, scene, camera, renderFrame, setFrameView, setCameraView, toggleOverlay, setMaskMode, setShaded, exportGLB, robotCamera: cam });
