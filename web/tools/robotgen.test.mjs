// three.js body generator 0.14 (web/src/robotgen): the part list equals the Python reference of the pinned Ballon commit
// (fixtures/robotgen_<name>_spec.json from robotgen_dump_spec.py), the built scene has the GLB's segment roots, objects, extras
// and role materials, every object's box matches the Blender manifest within 1 mm, parts index = parts.json, build is
// deterministic and every mesh is closed, consistently oriented, with outward volume and shading normals on the front of each face.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { robotSpec } from '../src/robotgen/robot.js';
import { buildRobotBody } from '../src/robotgen/index.js';
import { partGeometry } from '../src/robotgen/mesh.js';

const NAMES = ['waechter'];

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

function signedVolume(geo) {
  const p = geo.attributes.position.array;
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

  test(`${name}: parts index equals parts.json of the GLB export`, () => {
    assert.deepEqual(built.parts, partsJson);
  });

  test(`${name}: build is deterministic, meshes closed with outward normals`, () => {
    const hash = scene => {
      const h = createHash('sha256');
      scene.traverse(o => { if (o.isMesh) h.update(o.name).update(Buffer.from(o.geometry.attributes.position.array.buffer)).update(Buffer.from(o.geometry.attributes.normal.array.buffer)); });
      return h.digest('hex');
    };
    assert.equal(hash(buildRobotBody(name).scene), hash(built.scene));
    built.scene.traverse(o => {
      if (!o.isMesh) return;
      assert.ok(signedVolume(o.geometry) > 0, `${o.name}: volume ≤ 0`);
      assert.deepEqual(closure(o.geometry), { open: 0, back: 0 }, `${o.name}: open/flipped edges or normals facing backwards`);
    });
  });
}

test('bevel is geometry: a bevelled box has more triangles than a cube and keeps its size', () => {
  const g = partGeometry('box', { d: [40, 20, 10], c: [0, 0, 0], bevel: 2 });
  assert.ok(g.attributes.position.count / 3 > 12);
  g.computeBoundingBox();
  near(g.boundingBox.max.toArray(), [0.02, 0.01, 0.005], 'box', 1e-6);
});
