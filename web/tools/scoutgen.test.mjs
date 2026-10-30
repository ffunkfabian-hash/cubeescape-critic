// Scout from the three.js generator (0.17 "Outrider", web/src/robotgen/scout.js): the cast is read from guss_2h.npz, the scene
// has every object of the Blender export with its extras, groups and explosion offsets of parts.json, the GLB's materials, and
// every object's box within 1 mm of the manifest (H = 1.0 ≈ 300 mm); BSP parts are closed with outward normals; the build is
// deterministic. Building blocks (npy reader, bisect, BSP booleans) are checked on small cases.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { parseNpy } from '../src/robotgen/npz.js';
import { mesh, bisect, keepFaces, csg, finish, recalcNormals } from '../src/robotgen/scoutMesh.js';
import { buildScout, explodedScout, scoutParts, quader, BSP_PARTS } from '../src/robotgen/scout.js';
import { readGussFile } from './scoutGussNode.mjs';

const root = new URL('../../assets/helmet-scout/', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('manifest.json', root)));
const partsJson = JSON.parse(readFileSync(new URL('parts.json', root))).parts;
const MM = 1 / 300;                       // 1 mm in H units (helmet height H = 1.0 ≈ 30 cm)
const warn = console.warn;
console.warn = () => {};
const guss = await readGussFile();
const parts = scoutParts(guss), built = buildScout(null, { parts });
console.warn = warn;
built.scene.updateMatrixWorld(true);
const meshes = new Map(built.scene.children.map(o => [o.name, o]));

const loadGLB = file => {
  const buf = readFileSync(file);
  return new Promise((res, rej) => new GLTFLoader().parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', g => res(g.scene), rej));
};
// closed and consistently oriented after welding (directed edges with their reverse), and the signed volume
function closure(geo) {
  const g = geo.index ? geo.toNonIndexed() : geo, p = g.attributes.position.array, E = new Map();
  const key = i => `${Math.round(p[i * 3] * 1e6)},${Math.round(p[i * 3 + 1] * 1e6)},${Math.round(p[i * 3 + 2] * 1e6)}`;
  let vol = 0;
  for (let t = 0; t < p.length / 9; t++) {
    const k = [0, 1, 2].map(j => key(t * 3 + j));
    if (new Set(k).size < 3) continue;
    for (let j = 0; j < 3; j++) { const d = `${k[j]}>${k[(j + 1) % 3]}`; E.set(d, (E.get(d) ?? 0) + 1); }
    const i = t * 9;
    vol += p[i] * (p[i + 4] * p[i + 8] - p[i + 5] * p[i + 7]) - p[i + 1] * (p[i + 3] * p[i + 8] - p[i + 5] * p[i + 6]) + p[i + 2] * (p[i + 3] * p[i + 7] - p[i + 4] * p[i + 6]);
  }
  let open = 0;
  for (const [d, c] of E) { const [u, v] = d.split('>'); if (E.get(`${v}>${u}`) !== c) open++; }
  return { open, volume: vol / 6 };
}

test('npy reader: little-endian float32 array with shape, strings of a <U array', () => {
  const header = "{'descr': '<f4', 'fortran_order': False, 'shape': (2, 3), }";
  const pad = 64 - ((10 + header.length + 1) % 64);
  const h = new TextEncoder().encode(header + ' '.repeat(pad) + '\n');
  const body = new Float32Array([1, 2, 3, 4, 5, 6]);
  const buf = new Uint8Array(10 + h.length + body.byteLength);
  buf.set([0x93, ...new TextEncoder().encode('NUMPY'), 1, 0, h.length & 255, h.length >> 8]);
  buf.set(h, 10); buf.set(new Uint8Array(body.buffer), 10 + h.length);
  const a = parseNpy(buf);
  assert.deepEqual(a.shape, [2, 3]);
  assert.deepEqual(Array.from(a.data), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(guss.Kappe__V.shape, [110067, 3]);
  assert.equal(guss.Kappe__MAT.data[0], 'MAT_Dunkel');
  assert.equal(guss.Kappe__L.data.reduce((s, n) => s + n, 0), guss.Kappe__I.data.length);
});

test('bisect: a face crossing the plane is split at a corner shared with its neighbour; keepFaces drops the cut side', () => {
  const m = mesh([[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [2, 0, 0], [2, 1, 0]], [[0, 1, 2, 3], [1, 4, 5, 2]]);
  const b = bisect(m, [0.5, 0, 0], [1, 0, 0]);
  assert.equal(b.F.length, 3);
  assert.equal(b.V.length, 8);                                   // two new corners on the plane
  const k = keepFaces(b, i => b.F[i].every(j => b.V[j][0] >= 0.5 - 1e-9));
  assert.equal(k.F.length, 2);
  assert.equal(k.V.length, 6);
  assert.equal(bisect(m, [5, 0, 0], [1, 0, 0]).F.length, 2);     // plane outside: unchanged
});

test('BSP booleans: box minus a box through it is closed, outward, volume 8 − 2', () => {
  const r = finish(csg(quader([2, 2, 2]), [['D', quader([1, 1, 4])]]));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(r.F.flatMap(f => f.flatMap(i => r.V[i])), 3));
  const c = closure(g);
  assert.equal(c.open, 0);
  assert.ok(Math.abs(c.volume - 6) < 1e-6, `volume ${c.volume}`);
  const i = finish(csg(quader([2, 2, 2]), [['I', quader([2, 2, 2], [1, 1, 1])]]));
  assert.ok(Math.abs(Math.max(...i.V.map(v => v[0])) - 1) < 1e-9 && Math.abs(Math.min(...i.V.map(v => v[0]))) < 1e-9);
  // recalcNormals turns an inside-out cube outwards
  const inv = recalcNormals({ ...quader([1, 1, 1]), F: quader([1, 1, 1]).F.map(f => f.slice().reverse()) });
  assert.deepEqual(inv.F, quader([1, 1, 1]).F);
});

test('scout: every object of the Blender export with its extras; groups and offsets equal parts.json', () => {
  assert.deepEqual([...meshes.keys()].sort(), manifest.objects.map(o => o.name).sort());
  assert.deepEqual(built.groups.map(g => ({ id: g.id, label: g.label, side: g.side, objects: g.objects, exploded_offset: g.offset })),
    partsJson.map(p => ({ id: p.id, label: p.label, side: p.side, objects: p.objects, exploded_offset: p.exploded_offset })));
  for (const p of partsJson) for (const n of p.objects) {
    const u = meshes.get(n).userData;
    assert.deepEqual([u.part_id, u.part_label, u.side, u.source_object], [p.id, p.label, p.side, n], n);
  }
});

test('scout: every object\'s box within 1 mm of the Blender manifest', () => {
  let worst = 0, name = '';
  for (const o of manifest.objects) {
    const b = new THREE.Box3().setFromObject(meshes.get(o.name), true);
    const [[x0, y0, z0], [x1, y1, z1]] = o.bbox;              // Blender (Z up, front −Y) → glTF
    const d = Math.max(...[x0, z0, -y1, x1, z1, -y0].map((v, i) => Math.abs(v - [b.min.x, b.min.y, b.min.z, b.max.x, b.max.y, b.max.z][i])));
    if (d > worst) { worst = d; name = o.name; }
    assert.ok(d < MM, `${o.name}: box differs by ${(d / MM).toFixed(2)} mm`);
  }
  console.log(`scout: largest box difference ${(worst / MM).toFixed(3)} mm (${name})`);
});

test('scout: materials as GLTFLoader reads them from the GLB', async () => {
  const glb = await loadGLB(new URL('assembled/scout.glb', root));
  const ref = new Map();
  glb.traverse(o => { if (o.isMesh) ref.set(o.userData.source_object, o.material); });
  for (const [n, m] of meshes) {
    const a = ref.get(n), b = m.material;
    assert.equal(b.name, a.name, n);
    for (const k of ['roughness', 'metalness', 'side', 'emissiveIntensity']) assert.ok(Math.abs(a[k] - b[k]) < 1e-4, `${n}.${k}`);
    for (const k of ['color', 'emissive']) assert.ok(a[k].toArray().every((v, i) => Math.abs(v - b[k].toArray()[i]) < 1e-4), `${n}.${k}`);
  }
});

test('scout: Blender topology – vertex and face counts as in the manifest (cap and cable within 0.5 %, CSG parts aside)', () => {
  for (const o of manifest.objects) {
    if (BSP_PARTS.includes(o.name) && o.name !== 'Mund_Vertiefung') continue;   // triangles of the BSP result instead of n-gons
    const m = parts[o.name], tol = o.name === 'Kappe' || o.name.startsWith('Kabel_') ? 0.005 * o.verts : 0;
    assert.ok(Math.abs(m.V.length - o.verts) <= tol && Math.abs(m.F.length - o.faces) <= tol, `${o.name}: ${m.V.length}/${m.F.length} for ${o.verts}/${o.faces}`);
  }
});

test('scout: BSP parts closed with outward volume, all meshes indexed, build deterministic, exploded copy offset', () => {
  for (const n of BSP_PARTS.filter(x => x !== 'Mund_Vertiefung')) {
    const c = closure(meshes.get(n).geometry);
    assert.equal(c.open, 0, `${n}: open edges`);
    assert.ok(c.volume > 0, `${n}: volume ${c.volume}`);
  }
  for (const m of meshes.values()) assert.ok(m.geometry.index, `${m.name}: not indexed`);
  const hash = scene => {
    const h = createHash('sha256');
    for (const o of scene.children) h.update(o.name).update(Buffer.from(o.geometry.index.array.buffer)).update(Buffer.from(o.geometry.attributes.position.array.buffer)).update(Buffer.from(o.geometry.attributes.normal.array.buffer));
    return h.digest('hex');
  };
  console.warn = () => {};
  assert.equal(hash(buildScout(guss).scene), hash(built.scene));
  console.warn = warn;
  const ex = explodedScout(built.scene, built.groups);
  const off = Object.fromEntries(partsJson.flatMap(p => p.objects.map(n => [n, p.exploded_offset])));
  for (const o of ex.children) assert.deepEqual(o.position.toArray(), [off[o.name][0], off[o.name][2], -off[o.name][1]], o.name);
});
