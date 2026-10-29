// Marker page for the browser helmet: the user sets pins or draws strokes directly on the 3D model; each marker
// describes one requested change to one part. Markers live in the artifact database (collection `marker`), or only in
// this browser when no database is available (local test). See docs/MARKER.md.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { computeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import { PARTS, partOf, sideOf, STELLEN, RICHTUNGEN, BETRAEGE } from './parts.js';

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

const $ = (id) => document.getElementById(id);
const r4 = (v) => Math.round(v * 1e4) / 1e4;
const r3 = (v) => Math.round(v * 1e3) / 1e3;
const vec = (v, r = r4) => [r(v.x), r(v.y), r(v.z)];

// ---------------------------------------------------------------------------------------------------------------- scene
const stage = $('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setClearColor(0x000000, 0);
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
const envScene = new RoomEnvironment();
for (const [pos, size, power] of [[[-3, 3, 4], [4, 3], 5], [[4, 1, 3], [3, 3], 2], [[0, 3, -4], [5, 2], 4]]) {
  const box = new THREE.Mesh(new THREE.PlaneGeometry(...size), new THREE.MeshBasicMaterial({ color: new THREE.Color(power, power, power) }));
  box.position.set(...pos);
  box.lookAt(0, 0, 0);
  envScene.add(box);
}
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(envScene, 0.02).texture;
scene.environmentIntensity = 0.3;
// Studio lights turn with the camera azimuth, as in the main page: every side is lit like the front.
const lightRig = new THREE.Group();
const key = new THREE.DirectionalLight(0xffffff, 1.1);
key.position.set(-2.5, 3.5, 3);
const fill = new THREE.DirectionalLight(0xdfe6ff, 0.35);
fill.position.set(3, 1, 2);
const rim = new THREE.DirectionalLight(0xffffff, 0.7);
rim.position.set(0.5, 2.5, -3.5);
lightRig.add(key, fill, rim);
scene.add(lightRig, new THREE.HemisphereLight(0xffffff, 0x444444, 0.25));

const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 80);
// Centre and half extents of the loaded model; the default covers the helmet until it is loaded.
const TARGET = new THREE.Vector3(0, 0, 0);
const HALF = new THREE.Vector3(0.55, 0.68, 0.55);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 0.6;
controls.maxDistance = 5;
controls.target.copy(TARGET);

// Azimuth: 0 = front, −90 = side A (−X), +90 = side B (+X), as in docs/HELM_TEILE.md.
const VIEWS = [['Vorn', 0], ['¾ A', -40], ['Seite A', -90], ['Hinten', 180], ['Seite B', 90], ['¾ B', 40]];
// Distance at which the whole model fits the current canvas.
function fitDist() {
  const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const r = Math.max(HALF.x, HALF.z);
  return (Math.max(HALF.y / t, r / (t * camera.aspect)) + r) * (camera.aspect < 0.9 ? 1.2 : 1.12);
}
function viewPose(az, el = 4, dist = fitDist()) {
  const a = THREE.MathUtils.degToRad(az), e = THREE.MathUtils.degToRad(el);
  return { pos: new THREE.Vector3(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)).multiplyScalar(dist).add(TARGET), ziel: TARGET.clone() };
}
let sized = false;

const model = new THREE.Group();
const strokes = new THREE.Group();
scene.add(model, strokes);
const meshes = [];
const raycaster = new THREE.Raycaster();
raycaster.firstHitOnly = true;

let dirty = true;
let fly = null;
const requestRender = () => { dirty = true; };
controls.addEventListener('change', requestRender);

function resize() {
  const { width, height } = stage.getBoundingClientRect();
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  if (!sized) {
    sized = true;
    camera.position.copy(viewPose(-25).pos);
  }
  requestRender();
}
new ResizeObserver(resize).observe(stage);

function loop(now) {
  requestAnimationFrame(loop);
  if (fly) {
    const t = Math.min(1, (now - fly.t0) / 450), k = t * t * (3 - 2 * t);
    camera.position.lerpVectors(fly.from.pos, fly.to.pos, k);
    controls.target.lerpVectors(fly.from.ziel, fly.to.ziel, k);
    if (t === 1) fly = null;
    dirty = true;
  }
  if (controls.update() || dirty) {
    dirty = false;
    const off = camera.position.clone().sub(controls.target);
    lightRig.rotation.y = Math.atan2(off.x, off.z);
    scene.environmentRotation.set(0, lightRig.rotation.y, 0);
    renderer.render(scene, camera);
    placePins();
  }
}

function flyTo(pose) {
  fly = { t0: performance.now(), from: { pos: camera.position.clone(), ziel: controls.target.clone() }, to: pose };
}

function hitAt(clientX, clientY) {
  const r = renderer.domElement.getBoundingClientRect();
  const ndc = new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObjects(meshes, false)[0];
  if (!hit) return null;
  const normal = hit.face ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld) : new THREE.Vector3(0, 0, 1);
  if (normal.dot(raycaster.ray.direction) > 0) normal.negate();
  return { object: hit.object, point: hit.point.clone(), normal };
}

// ---------------------------------------------------------------------------------------------------------------- state
const state = {
  config: null,
  markers: [],
  draft: null, // { art, punkt, normale, strich, kamera, vorschlag, mesh, editId? }
  selected: null,
  mode: 'nadel',
  showDone: true,
  canWrite: true,
  confirmDelete: null,
};

// Storage: artifact database when the page runs in the viewer, otherwise this browser only.
const store = {
  kind: 'lokal',
  db: null,
  local() {
    try {
      return JSON.parse(localStorage.getItem('critic-marker') || '[]');
    } catch {
      return [];
    }
  },
  saveLocal(list) {
    try {
      localStorage.setItem('critic-marker', JSON.stringify(list));
    } catch {
      /* private window: keep in memory only */
    }
    state.markers = list;
    renderAll();
  },
  async add(data) {
    if (this.db) return this.db.collection('marker').add(data);
    this.saveLocal([...state.markers, { id: `lokal-${Date.now().toString(36)}`, ...data }]);
  },
  async update(id, data) {
    if (this.db) return this.db.doc(`marker/${id}`).update(data);
    this.saveLocal(state.markers.map((m) => (m.id === id ? { ...m, ...data } : m)));
  },
  async remove(id) {
    if (this.db) return this.db.doc(`marker/${id}`).delete();
    this.saveLocal(state.markers.filter((m) => m.id !== id));
  },
};

async function connectStore() {
  state.markers = store.local();
  setStoreNote('Lokaler Modus: Marker bleiben nur in diesem Browser.');
  renderAll();
  const claude = window.claude;
  if (!claude?.use) return;
  const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]);
  if (!db) {
    setStoreNote('Kein gemeinsamer Speicher in dieser Ansicht: Marker bleiben nur in diesem Browser.');
    return;
  }
  store.db = db;
  store.kind = 'db';
  state.markers = [];
  const may = user ? await user.can('data.write') : null;
  state.canWrite = may !== false;
  setStoreNote(state.canWrite ? '' : 'Nur ansehen: du kannst hier keine Marker setzen.');
  db.collection('marker').onSnapshot(
    (snap) => {
      state.markers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      renderAll();
    },
    () => setStoreNote('Verbindung zum Speicher unterbrochen. Seite neu laden.'),
  );
}

function setStoreNote(text) {
  $('store-note').textContent = text;
  $('store-note').hidden = !text;
}

// ---------------------------------------------------------------------------------------------------------------- markers
function partName(id) {
  const p = PARTS.find((q) => q.id === id);
  return p ? `${p.id} ${p.name}` : 'Teil unklar';
}

function satzOf(m) {
  const amount = m.betrag === 'in cm' && m.cm != null && m.cm !== '' ? `${m.cm} cm` : m.betrag;
  const bits = [m.seite && m.seite !== 'Mitte' ? (m.seite === 'beide' ? 'beide Seiten' : `Seite ${m.seite}`) : '', m.stelle, (m.richtung || []).join(', '), amount].filter(Boolean);
  return `${partName(m.teil)}${bits.length ? ' · ' + bits.join(' · ') : ''}${m.notiz ? ' – ' + m.notiz : ''}`;
}

const isOld = (m) => state.config && m.stand !== state.config.stand;
const visible = () => state.markers.filter((m) => state.showDone || m.status !== 'umgesetzt').sort((a, b) => (a.nr || 0) - (b.nr || 0));

function strokeMesh(points, color) {
  const pts = points.map((p) => new THREE.Vector3(...p));
  if (pts.length < 2) return null;
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const geo = new THREE.TubeGeometry(curve, Math.min(400, pts.length * 3), 0.0028, 6, false);
  return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, toneMapped: false }));
}

function cssColor(name) {
  return new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#e8962a');
}

function rebuildStrokes() {
  for (const c of [...strokes.children]) {
    strokes.remove(c);
    c.geometry.dispose();
    c.material.dispose();
  }
  for (const m of visible()) {
    if (!m.strich) continue;
    const color = isOld(m) ? cssColor('--old') : m.status === 'umgesetzt' ? cssColor('--done') : cssColor('--accent');
    const mesh = strokeMesh(m.strich, color);
    if (mesh) strokes.add(mesh);
  }
  if (state.draft?.strich) {
    const mesh = strokeMesh(state.draft.strich, cssColor('--draft'));
    if (mesh) strokes.add(mesh);
  }
  requestRender();
}

// HTML pins over the canvas; a pin behind the model is drawn faded.
const pinLayer = $('pins');
function pinEl(key) {
  let el = pinLayer.querySelector(`[data-key="${key}"]`);
  if (!el) {
    el = document.createElement('button');
    el.type = 'button';
    el.className = 'pin';
    el.dataset.key = key;
    el.addEventListener('click', () => (key === 'draft' ? $('f-notiz')?.focus() : select(key, true)));
    pinLayer.append(el);
  }
  return el;
}

function placePins() {
  const r = renderer.domElement.getBoundingClientRect();
  const items = visible().map((m) => ({ key: m.id, m }));
  if (state.draft?.punkt && !state.draft.editId) items.push({ key: 'draft', m: state.draft });
  const keep = new Set(items.map((i) => i.key));
  for (const el of [...pinLayer.children]) if (!keep.has(el.dataset.key)) el.remove();
  const ray = new THREE.Raycaster();
  ray.firstHitOnly = true;
  for (const { key, m } of items) {
    const p = new THREE.Vector3(...m.punkt).addScaledVector(new THREE.Vector3(...(m.normale || [0, 0, 0])), 0.004);
    const s = p.clone().project(camera);
    const el = pinEl(key);
    el.textContent = key === 'draft' ? '+' : String(m.nr ?? '?');
    el.className = 'pin' + (key === 'draft' ? ' draft' : '') + (m.status === 'umgesetzt' ? ' done' : '') + (key !== 'draft' && isOld(m) ? ' old' : '') + (state.selected === key ? ' sel' : '');
    const dist = camera.position.distanceTo(p);
    ray.set(camera.position, p.clone().sub(camera.position).normalize());
    ray.far = dist;
    const hidden = ray.intersectObjects(meshes, false).some((h) => h.distance < dist - 0.012);
    el.classList.toggle('behind', hidden);
    el.style.display = s.z > 1 ? 'none' : '';
    el.style.left = `${((s.x + 1) / 2) * r.width}px`;
    el.style.top = `${((1 - s.y) / 2) * r.height}px`;
    el.setAttribute('aria-label', key === 'draft' ? 'Neuer Marker' : `Marker ${m.nr}`);
  }
}

function currentPose() {
  return { pos: vec(camera.position, r3), ziel: vec(controls.target, r3) };
}

function startDraft(hit, art, strich = null) {
  const part = partOf(hit.object);
  state.draft = {
    art,
    punkt: vec(hit.point),
    normale: vec(hit.normal, r3),
    strich,
    kamera: currentPose(),
    vorschlag: part ? `${part.id} ${part.name}` : '',
    mesh: hit.object.name || hit.object.parent?.name || '',
    teil: part?.id || '?',
    seite: sideOf(hit.point),
    stelle: '',
    richtung: [],
    betrag: '',
    cm: null,
    notiz: '',
  };
  state.selected = null;
  rebuildStrokes();
  renderAll();
  $('f-notiz')?.focus({ preventScroll: true });
}

function select(id, flyThere) {
  state.selected = state.selected === id && !flyThere ? null : id;
  state.confirmDelete = null;
  const m = state.markers.find((x) => x.id === id);
  if (m && flyThere && m.kamera) flyTo({ pos: new THREE.Vector3(...m.kamera.pos), ziel: new THREE.Vector3(...m.kamera.ziel) });
  renderAll();
  document.querySelector(`[data-item="${CSS.escape(id)}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// ---------------------------------------------------------------------------------------------------------------- input
const canvas = renderer.domElement;
let down = null;
let drawing = null;

canvas.addEventListener('pointerdown', (e) => {
  down = { x: e.clientX, y: e.clientY, t: performance.now() };
  if (state.mode !== 'stift' || !state.canWrite) return;
  const hit = hitAt(e.clientX, e.clientY);
  if (!hit) return;
  canvas.setPointerCapture(e.pointerId);
  drawing = { first: hit, pts: [hit.point.clone().addScaledVector(hit.normal, 0.002)] };
  state.draft = null;
  e.preventDefault();
});

canvas.addEventListener('pointermove', (e) => {
  if (!drawing) return;
  const hit = hitAt(e.clientX, e.clientY);
  if (!hit) return;
  const p = hit.point.clone().addScaledVector(hit.normal, 0.002);
  if (p.distanceTo(drawing.pts[drawing.pts.length - 1]) < 0.004) return;
  drawing.pts.push(p);
  if (drawing.pts.length > 600) drawing.pts = drawing.pts.filter((_, i) => i % 2 === 0);
  state.draft = { strich: drawing.pts.map((q) => vec(q)) };
  rebuildStrokes();
});

canvas.addEventListener('pointerup', (e) => {
  if (drawing) {
    const d = drawing;
    drawing = null;
    if (d.pts.length >= 2) startDraft(d.first, 'strich', d.pts.map((q) => vec(q)));
    else startDraft(d.first, 'nadel');
    return;
  }
  if (!down || state.mode !== 'nadel' || !state.canWrite) return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
  if (moved > 6 || performance.now() - down.t > 600) return;
  const hit = hitAt(e.clientX, e.clientY);
  if (hit) startDraft(hit, 'nadel');
});

function setMode(mode) {
  state.mode = mode;
  controls.enabled = mode === 'nadel';
  stage.dataset.mode = mode;
  for (const b of document.querySelectorAll('[data-mode]')) b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
  $('hint').textContent = mode === 'stift'
    ? 'Auf den Helm zeichnen: eine Linie für eine Kante, ein Kreis um einen Bereich. Zum Drehen zurück auf „Nadel“.'
    : 'Antippen setzt eine Nadel · Ziehen dreht · Scrollen oder zwei Finger zoomen';
}

// ---------------------------------------------------------------------------------------------------------------- UI
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, '');
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const c of children.flat()) if (c != null && c !== false) el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return el;
}

function select_(id, label, value, options) {
  return h('label', { class: 'field', for: id }, h('span', {}, label),
    h('select', { id, onchange: (e) => (state.draft[id.slice(2)] = e.target.value) },
      options.map(([v, t]) => h('option', { value: v, selected: v === value }, t))));
}

function renderForm() {
  const box = $('form');
  box.replaceChildren();
  const d = state.draft;
  box.hidden = !d || !d.art;
  if (box.hidden) return;
  const title = d.editId ? `Marker ${state.markers.find((m) => m.id === d.editId)?.nr} bearbeiten` : d.art === 'strich' ? 'Neuer Strich' : 'Neue Nadel';
  box.append(
    h('div', { class: 'form-head' }, h('h2', {}, title), h('span', { class: 'mono' }, `Vorschlag: ${d.vorschlag || '–'}`)),
    h('div', { class: 'grid2' },
      select_('f-teil', 'Teil', d.teil, [['?', '? unklar'], ...PARTS.map((p) => [p.id, `${p.id} ${p.name}`])]),
      select_('f-seite', 'Seite', d.seite, [['A', 'A – im Frontbild links'], ['B', 'B – im Frontbild rechts'], ['beide', 'beide'], ['Mitte', 'Mitte']])),
    h('div', { class: 'grid2' },
      select_('f-stelle', 'Stelle', d.stelle, [['', '–'], ...STELLEN.map((s) => [s, s])]),
      select_('f-betrag', 'Betrag', d.betrag, [['', '–'], ...BETRAEGE.map((s) => [s, s])])),
  );
  const cm = h('label', { class: 'field', for: 'f-cm' }, h('span', {}, 'cm'),
    h('input', { id: 'f-cm', type: 'number', step: '0.1', inputmode: 'decimal', value: d.cm ?? '', oninput: (e) => (d.cm = e.target.value === '' ? null : Number(e.target.value)) }));
  cm.hidden = d.betrag !== 'in cm';
  box.querySelector('#f-betrag').addEventListener('change', () => (cm.hidden = d.betrag !== 'in cm'));
  box.append(cm,
    h('fieldset', { class: 'chips' }, h('legend', {}, 'Richtung'),
      RICHTUNGEN.map((r) => h('button', {
        type: 'button', class: 'chip', 'aria-pressed': String(d.richtung.includes(r)),
        onclick: (e) => {
          d.richtung = d.richtung.includes(r) ? d.richtung.filter((x) => x !== r) : [...d.richtung, r];
          e.currentTarget.setAttribute('aria-pressed', String(d.richtung.includes(r)));
        },
      }, r))),
    h('label', { class: 'field', for: 'f-notiz' }, h('span', {}, 'Notiz (hat Vorrang vor den Feldern)'),
      h('textarea', { id: 'f-notiz', rows: '3', placeholder: 'z. B. Lücke zur Haube schließen – gilt auch für die andere Seite', oninput: (e) => (d.notiz = e.target.value) }, d.notiz)),
    h('p', { id: 'form-error', class: 'error', hidden: true }),
    h('div', { class: 'actions' },
      h('button', { type: 'button', class: 'primary', id: 'f-save', onclick: saveDraft }, d.editId ? 'Änderung speichern' : 'Marker speichern'),
      h('button', { type: 'button', id: 'f-cancel', onclick: () => { state.draft = null; rebuildStrokes(); renderAll(); } }, 'Verwerfen')),
  );
}

async function saveDraft() {
  const d = state.draft;
  const btn = $('f-save');
  btn.disabled = true;
  const fields = { teil: d.teil, seite: d.seite, stelle: d.stelle, richtung: d.richtung, betrag: d.betrag, cm: d.betrag === 'in cm' ? d.cm : null, notiz: d.notiz.trim() };
  fields.satz = satzOf(fields);
  try {
    if (d.editId) {
      await store.update(d.editId, fields);
    } else {
      const nr = state.markers.reduce((n, m) => Math.max(n, m.nr || 0), 0) + 1;
      await store.add({
        nr, stand: state.config.stand, art: d.art, punkt: d.punkt, normale: d.normale, strich: d.strich, kamera: d.kamera,
        vorschlag: d.vorschlag, mesh: d.mesh, ...fields, status: 'offen', antwort: '', erstellt: new Date().toISOString(),
      });
    }
    state.draft = null;
    rebuildStrokes();
    renderAll();
  } catch (e) {
    btn.disabled = false;
    const err = $('form-error');
    err.hidden = false;
    err.textContent = e?.code === 'quota_exceeded' ? 'Speicher voll: bitte alte Marker löschen.' : 'Speichern ging nicht. Prüfe die Verbindung und versuche es noch einmal.';
  }
}

function renderList() {
  const list = $('list');
  const items = visible();
  const open = state.markers.filter((m) => m.status !== 'umgesetzt').length;
  $('count').textContent = `${open} offen · ${state.markers.length - open} umgesetzt`;
  list.replaceChildren();
  if (!items.length) {
    list.append(h('li', { class: 'empty' },
      state.markers.length ? 'Alle Marker sind umgesetzt.' : 'Noch keine Marker. Tippe auf den Helm, um eine Nadel zu setzen, oder zeichne im Stift-Modus eine Linie.'));
    return;
  }
  for (const m of items) {
    const sel = state.selected === m.id;
    const status = m.status === 'umgesetzt' ? 'umgesetzt' : 'offen';
    const li = h('li', { class: `item${sel ? ' sel' : ''}`, 'data-item': m.id },
      h('button', { type: 'button', class: 'item-main', onclick: () => select(m.id, true) },
        h('span', { class: `badge ${status}${isOld(m) ? ' old' : ''}` }, m.nr ?? '?'),
        h('span', { class: 'item-text' },
          h('span', { class: 'satz' }, m.satz || satzOf(m)),
          h('span', { class: 'meta mono' }, [m.stand, m.art === 'strich' ? 'Strich' : 'Nadel', status].join(' · ')))),
      m.antwort ? h('p', { class: 'antwort' }, h('strong', {}, 'Antwort: '), m.antwort) : null,
      isOld(m) ? h('p', { class: 'note' }, `Gesetzt an Stand ${m.stand}; das Modell hat sich seitdem geändert.`) : null,
    );
    if (sel && state.canWrite && m.status !== 'umgesetzt') {
      const del = state.confirmDelete === m.id;
      li.append(h('div', { class: 'actions small' },
        h('button', { type: 'button', onclick: () => editMarker(m) }, 'Bearbeiten'),
        h('button', { type: 'button', class: del ? 'danger' : '', onclick: () => deleteMarker(m) }, del ? 'Wirklich löschen' : 'Löschen')));
    }
    list.append(li);
  }
}

function editMarker(m) {
  state.draft = { ...m, richtung: [...(m.richtung || [])], editId: m.id, notiz: m.notiz || '' };
  renderAll();
  $('form').scrollIntoView({ block: 'start', behavior: 'smooth' });
}

async function deleteMarker(m) {
  if (state.confirmDelete !== m.id) {
    state.confirmDelete = m.id;
    renderList();
    return;
  }
  state.confirmDelete = null;
  state.selected = null;
  await store.remove(m.id).catch(() => setStoreNote('Löschen ging nicht. Versuche es noch einmal.'));
}

function renderAll() {
  renderForm();
  renderList();
  rebuildStrokes();
  requestRender();
}

function buildToolbar() {
  $('views').append(...VIEWS.map(([label, az]) => h('button', { type: 'button', onclick: () => flyTo(viewPose(az)) }, label)));
  for (const b of document.querySelectorAll('[data-mode]')) b.addEventListener('click', () => setMode(b.dataset.mode));
  $('show-done').addEventListener('change', (e) => {
    state.showDone = e.target.checked;
    renderAll();
  });
  $('ref-toggle').addEventListener('click', (e) => {
    const box = $('refs');
    box.hidden = !box.hidden;
    e.currentTarget.setAttribute('aria-pressed', String(!box.hidden));
  });
  setMode('nadel');
}

// ---------------------------------------------------------------------------------------------------------------- start
async function loadModel(url) {
  const gltf = await new GLTFLoader().loadAsync(url, (p) => {
    if (p.total) $('loading').textContent = `Helm wird geladen … ${Math.round((p.loaded / p.total) * 100)} %`;
  });
  model.add(gltf.scene);
  gltf.scene.traverse((o) => {
    if (o.isMesh) {
      o.geometry.computeBoundsTree();
      meshes.push(o);
    }
  });
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  box.getCenter(TARGET);
  box.getSize(HALF).multiplyScalar(0.5);
  controls.target.copy(TARGET);
  controls.maxDistance = fitDist() * 2.5;
  camera.position.copy(viewPose(-25).pos);
  requestRender();
}

async function start() {
  buildToolbar();
  connectStore();
  try {
    state.config = await (await fetch('stand.json')).json();
    $('stand').textContent = `Stand ${state.config.stand}`;
    $('refs').append(...(state.config.vorlagen || []).map((v) => h('figure', {}, h('img', { src: v.datei, alt: `Vorlage ${v.ansicht}` }), h('figcaption', {}, v.ansicht))));
    await loadModel(state.config.modell);
    $('loading').hidden = true;
    stage.classList.add('ready');
    window.__markerReady = true;
    // For tools/marker_shot.mjs: show one marker from its saved camera, optionally moved closer to the point.
    window.markerApi = {
      show(id, closer = 0) {
        const m = state.markers.find((x) => x.id === id);
        if (!m?.kamera) return false;
        const p = new THREE.Vector3(...m.punkt);
        camera.position.set(...m.kamera.pos).lerp(p, closer);
        controls.target.set(...m.kamera.ziel).lerp(p, closer);
        controls.update();
        state.selected = id;
        renderAll();
        return true;
      },
    };
  } catch (e) {
    $('loading').textContent = 'Der Helm konnte nicht geladen werden. Seite neu laden.';
    console.error(e);
  }
  renderAll();
  requestAnimationFrame(loop);
}

start();
