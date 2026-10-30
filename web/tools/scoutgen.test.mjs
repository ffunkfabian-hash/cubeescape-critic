// Building blocks of the Scout generator (0.17 "Outrider", web/src/robotgen/scout.js): npy reader of the cast guss_2h.npz, bisect,
// BSP booleans. Since 0.19 the built Scout is checked against its own delivery package (robotgen_form.test.mjs: objects, groups,
// boxes, known openings, normals, determinism, explosion); the frozen Blender export (assets/helmet-scout/) is an optional report
// (node tools/robotgen_reference.mjs --model=scout).
import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { parseNpy } from '../src/robotgen/npz.js';
import { mesh, bisect, keepFaces, csg, finish, recalcNormals } from '../src/robotgen/scoutMesh.js';
import { quader } from '../src/robotgen/scout.js';
import { readGussFile } from './scoutGussNode.mjs';

const guss = await readGussFile();

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
