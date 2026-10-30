// three.js body generator 0.14 (web/src/robotgen): the part list equals the Python reference of the pinned Ballon commit
// (fixtures/robotgen_<name>_spec.json from robotgen_dump_spec.py), the built scene has the GLB's segment roots, objects, extras
// and role materials, every object's box matches the Blender manifest within 1 mm, parts index = parts.json, build is
// deterministic and every mesh is indexed like the GLB, closed, consistently oriented, with outward volume and shading normals on the
// front of each face.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { robotSpec } from '../src/robotgen/robot.js';
import { buildRobotBody } from '../src/robotgen/index.js';
import { partGeometry, meshDefects, firstClosed, CUT_RETRIES } from '../src/robotgen/mesh.js';
import CUT_STAGES from '../src/robotgen/cutStages.json' with { type: 'json' };

const NAMES = ['waechter', 'paladin', 'mechanik'];

function near(a, b, path, tol = 1e-6) {
  if (typeof a === 'number') return assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(a)), `${path}: ${a} ≠ ${b}`);
  if (Array.isArray(a)) { assert.equal(a.length, b.length, `${path}: length`); return a.forEach((v, i) => near(v, b[i], `${path}/${i}`, tol)); }
  if (a && typeof a === 'object') {
    assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), `${path}: keys`);
    return Object.keys(a).forEach(k => near(a[k], b[k], `${path}.${k}`, tol));
  }
  assert.equal(a, b, path);
}

const loadGLB = file => {
  const buf = readFileSync(file);
  return new Promise((res, rej) => new GLTFLoader().parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', g => res(g.scene), rej));
};

// triangle soup of a mesh (the generator's meshes are indexed like the GLB's)
const soup = geo => (geo.index ? geo.toNonIndexed() : geo);

function signedVolume(geo) {
  const p = soup(geo).attributes.position.array;
  let v = 0;
  for (let i = 0; i < p.length; i += 9) {
    v += p[i] * (p[i + 4] * p[i + 8] - p[i + 5] * p[i + 7]) - p[i + 1] * (p[i + 3] * p[i + 8] - p[i + 5] * p[i + 6]) + p[i + 2] * (p[i + 3] * p[i + 7] - p[i + 4] * p[i + 6]);
  }
  return v / 6;
}

// Closed and consistently oriented after welding positions (0.01 mm): every directed edge occurs as often as its reverse
// (open edges and flipped triangles break this; edges where two volumes touch occur twice in each direction). Returns the
// number of offending edges and of triangles whose shading normals point to the back of the face.
function closure(geo) {
  geo = soup(geo);
  const p = geo.attributes.position.array, n = geo.attributes.normal.array;
  const key = i => `${Math.round(p[i * 3] * 1e5)},${Math.round(p[i * 3 + 1] * 1e5)},${Math.round(p[i * 3 + 2] * 1e5)}`;
  const E = new Map();
  let back = 0;
  for (let t = 0; t < p.length / 9; t++) {
    const k = [0, 1, 2].map(j => key(t * 3 + j));
    if (new Set(k).size < 3) continue;
    for (let j = 0; j < 3; j++) { const d = `${k[j]}>${k[(j + 1) % 3]}`; E.set(d, (E.get(d) ?? 0) + 1); }
    const a = new THREE.Vector3().fromArray(p, t * 9), f = new THREE.Vector3().fromArray(p, t * 9 + 3).sub(a).cross(new THREE.Vector3().fromArray(p, t * 9 + 6).sub(a));
    const s = new THREE.Vector3().fromArray(n, t * 9).add(new THREE.Vector3().fromArray(n, t * 9 + 3)).add(new THREE.Vector3().fromArray(n, t * 9 + 6));
    if (f.dot(s) <= 0) back++;
  }
  let open = 0;
  for (const [d, c] of E) { const [a, b] = d.split('>'); if (E.get(`${b}>${a}`) !== c) open++; }
  return { open, back };
}

for (const name of NAMES) {
  const root = new URL(`../../assets/robot-bodies/${name}/`, import.meta.url);
  const ref = JSON.parse(readFileSync(new URL(`fixtures/robotgen_${name}_spec.json`, import.meta.url)));
  const manifest = JSON.parse(readFileSync(new URL('manifest.json', root)));
  const partsJson = JSON.parse(readFileSync(new URL('parts.json', root)));
  const built = buildRobotBody(name);
  built.scene.updateMatrixWorld(true);

  test(`${name}: part list, segments and shoulders equal the Ballon reference`, () => {
    const spec = robotSpec(name);
    near(ref.segments, spec.segments, 'segments');
    near(ref.shoulder, spec.shoulder, 'shoulder');
    assert.deepEqual(spec.parts.map(([a, p]) => `${a}:${p[0]}`), ref.parts.map(([a, p]) => `${a}:${p[0]}`));
    spec.parts.forEach(([, p], i) => near(ref.parts[i][1], p, p[0]));
  });

  test(`${name}: segment roots and their matrices as in the GLB`, async () => {
    const glb = await loadGLB(new URL(`assembled/${name}.glb`, root));
    assert.deepEqual(built.scene.children.map(n => n.name), glb.children.map(n => n.name));
    for (const n of glb.children) {
      const m = built.scene.getObjectByName(n.name);
      assert.deepEqual([m.userData.asm, m.userData.side], [n.userData.asm, n.userData.side], n.name);
      n.matrix.elements.forEach((v, i) => assert.ok(Math.abs(v - m.matrix.elements[i]) < 1e-5, `${n.name}[${i}]`));
    }
  });

  test(`${name}: every manifest object with extras, role material and its box within 1 mm`, () => {
    const meshes = new Map();
    built.scene.traverse(o => { if (o.isMesh) meshes.set(o.name, o); });
    assert.deepEqual([...meshes.keys()].sort(), manifest.objects.map(o => o.name).sort());
    let worst = 0;
    for (const o of manifest.objects) {
      const m = meshes.get(o.name);
      assert.deepEqual([m.userData.asm, m.userData.part, m.userData.side, m.userData.part_de, m.userData.study], [o.asm, o.part, o.side, o.part_de, manifest.study], o.name);
      assert.match(m.material.name, /^MT_[a-z_]+_color$/);
      const b = new THREE.Box3().setFromObject(m, true);
      const [[x0, y0, z0], [x1, y1, z1]] = o.bbox;           // Blender world (Z up, front −Y) → glTF
      const d = Math.max(...[x0, z0, -y1, x1, z1, -y0].map((v, i) => Math.abs(v - [b.min.x, b.min.y, b.min.z, b.max.x, b.max.y, b.max.z][i])));
      worst = Math.max(worst, d);
      assert.ok(d < 0.001, `${o.name}: box differs by ${(d * 1000).toFixed(2)} mm`);
    }
    console.log(`${name}: largest box difference ${(worst * 1000).toFixed(2)} mm`);
  });

  test(`${name}: role materials and cylinder normals as in the GLB`, async () => {
    const glb = await loadGLB(new URL(`assembled/${name}.glb`, root));
    const mats = new Map();
    glb.traverse(o => { if (o.isMesh) mats.set(o.material.name, o.material); });
    built.scene.traverse(o => {
      if (!o.isMesh) return;
      const a = mats.get(o.material.name), b = o.material;
      assert.ok(a, `${o.material.name} not in the GLB`);
      near([a.color.r, a.color.g, a.color.b, a.roughness, a.metalness, a.side, a.emissive.r, a.emissiveIntensity],
        [b.color.r, b.color.g, b.color.b, b.roughness, b.metalness, b.side, b.emissive.r, b.emissiveIntensity], o.material.name, 1e-3);
    });
    // smooth cylinder rims (cap and mantle flat, bevel rows 22.5°/45°/67.5°): same set of normal directions as the GLB
    const dirs = mesh => {
      const n = mesh.geometry.attributes.normal, p = mesh.geometry.attributes.position, out = new Set();
      for (let i = 0; i < n.count; i++) if (p.getX(i) > 0) out.add(`${n.getX(i).toFixed(1)} ${Math.hypot(n.getY(i), n.getZ(i)).toFixed(1)}`);
      return [...out].sort();
    };
    assert.deepEqual(dirs(built.scene.getObjectByName('arm_R_elbow_ring')), dirs(glb.getObjectByName('arm_R_elbow_ring')));
  });

  test(`${name}: cut stage table – listed parts close at their stage at once, all others at stage 0 (on the table's platform)`, t => {
    const table = CUT_STAGES.stages[name] ?? {}, used = Object.fromEntries(Object.entries(built.stages).filter(([, k]) => k > 0));
    for (const key of Object.keys(table)) assert.ok(key in built.stages, `${key}: listed in cutStages.json but not a part with cuts`);
    if (CUT_STAGES.platform.startsWith(`${process.platform}-${process.arch} `)) assert.deepEqual(used, table, 'cut stages differ: node tools/robotgen_cut_stages.mjs');
    else t.diagnostic(`table written on ${CUT_STAGES.platform}; here ${JSON.stringify(used)}, table ${JSON.stringify(table)}`);
  });

  test(`${name}: parts index equals parts.json of the GLB export`, () => {
    assert.deepEqual(built.parts, partsJson);
  });

  test(`${name}: build is deterministic, meshes closed with outward normals`, () => {
    const hash = scene => {
      const h = createHash('sha256');
      scene.traverse(o => { if (o.isMesh) h.update(o.name).update(Buffer.from(o.geometry.index.array.buffer)).update(Buffer.from(o.geometry.attributes.position.array.buffer)).update(Buffer.from(o.geometry.attributes.normal.array.buffer)); });
      return h.digest('hex');
    };
    assert.equal(hash(buildRobotBody(name).scene), hash(built.scene));
    let corners = 0, verts = 0;
    built.scene.traverse(o => {
      if (!o.isMesh) return;
      assert.ok(o.geometry.index, `${o.name}: not indexed`);
      corners += o.geometry.index.count; verts += o.geometry.attributes.position.count;
      assert.ok(signedVolume(o.geometry) > 0, `${o.name}: volume ≤ 0`);
      assert.deepEqual(closure(o.geometry), { open: 0, back: 0 }, `${o.name}: open/flipped edges or normals facing backwards`);
    });
    assert.ok(verts < 0.4 * corners, `${verts} vertices for ${corners} corners: corners of equal position and normal not shared`);
  });
}

test('bevel is geometry: a bevelled box has more triangles than a cube and keeps its size', () => {
  const g = partGeometry('box', { d: [40, 20, 10], c: [0, 0, 0], bevel: 2 });
  assert.ok(g.attributes.position.count / 3 > 12);
  g.computeBoundingBox();
  near(g.boundingBox.max.toArray(), [0.02, 0.01, 0.005], 'box', 1e-6);
});

test('mesh defects: a closed box has none, a missing triangle opens it, a flipped normal faces backwards', () => {
  const box = () => new THREE.BoxGeometry(0.04, 0.02, 0.01).toNonIndexed();
  assert.equal(meshDefects(box()), 0);
  const open = box();
  open.setAttribute('position', new THREE.BufferAttribute(open.attributes.position.array.slice(9), 3));
  open.setAttribute('normal', new THREE.BufferAttribute(open.attributes.normal.array.slice(9), 3));
  assert.equal(meshDefects(open), 3);
  const flipped = box();
  for (let i = 0; i < 9; i++) flipped.attributes.normal.array[i] *= -1;
  assert.equal(meshDefects(flipped), 1);
});

test('cut retry: the stage from the table first, then the search without it', () => {
  const calls = [], build = k => (calls.push(k), k);
  assert.equal(firstClosed(build, k => (k === 5 ? 0 : 1), CUT_RETRIES, 5), 5);
  assert.deepEqual(calls, [5]);                                 // table stage closes: cut once
  calls.length = 0;
  assert.equal(firstClosed(build, k => (k < 3 || k === 5 ? 1 : 0), CUT_RETRIES, 5), 3);
  assert.deepEqual(calls, [5, 0, 1, 2, 3]);                     // table stage open (other platform): search from 0, skipping it
  calls.length = 0;
  assert.equal(firstClosed(build, () => 1, 4, 2), 4);
  assert.deepEqual(calls, [2, 0, 1, 3, 4]);                     // never closed: each stage once, up to the limit
});

test('cut retry: builds with growing cutters until one is closed, at most CUT_RETRIES repeats', () => {
  const calls = [], build = k => (calls.push(k), k);
  assert.equal(firstClosed(build, k => (k < 3 ? 1 : 0), CUT_RETRIES), 3);
  assert.deepEqual(calls, [0, 1, 2, 3]);
  calls.length = 0;
  assert.equal(firstClosed(build, () => 1, 4), 4);              // never closed: stops after the limit
  assert.deepEqual(calls, [0, 1, 2, 3, 4]);
  calls.length = 0;
  assert.equal(firstClosed(build, () => 0, CUT_RETRIES), 0);    // closed at once: no repeat
  assert.deepEqual(calls, [0]);
});

test('cut slivers: every helmet mask ends closed (CSG noise opens some first cuts, platform-dependent)', () => {
  let retried = 0;
  for (const name of NAMES) {
    const [, , , kind, , p] = robotSpec(name).parts.find(([, q]) => q[0] === 'mask')[1];
    if (meshDefects(partGeometry(kind, p, 1, 0))) retried++;
    assert.equal(meshDefects(partGeometry(kind, p, 1)), 0, `${name} mask`);
  }
  console.log(`masks with a repeated cut on this platform: ${retried} of ${NAMES.length}`);
});
