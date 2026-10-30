// Equality of the faster generator paths (0.19 "Whetstone") with the plain ones they replace: the 0.18 implementations below are
// kept verbatim (string keys, a split per polygon and node; creaseNormals with the 0.19 fallback for vanishing normals) and must
// give the same numbers to the bit as web/src/robotgen on the CSG results of every body part with cuts and on BSP booleans of the
// Scout head volume. The tree building must also do far fewer splits (the speed itself: node tools/robotgen_bench.mjs), and parts
// without cuts are not checked for defects. Byte equality of whole builds: robotgen_export.test.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { robotSpec } from '../src/robotgen/robot.js';
import { rawCut, dropSheets, closeTJunctions, creaseNormals, meshDefects, firstClosed, partGeometry } from '../src/robotgen/mesh.js';
import { union, subtract, intersect, stats } from '../src/robotgen/bsp.js';
import { solid } from '../src/robotgen/scoutMesh.js';
import { volumen, ellzylinder, quader } from '../src/robotgen/scout.js';

const ref = {};
{
// ---------------------------------------------------------------- 0.18 mesh helpers (web/src/robotgen/mesh.js at 622c32d)
function dropSheets(geo) {
  const p = geo.attributes.position.array;
  const key = i => `${Math.round(p[i * 3] * 100)},${Math.round(p[i * 3 + 1] * 100)},${Math.round(p[i * 3 + 2] * 100)}`;   // 0.01 mm
  const seen = new Map(), drop = new Set();
  for (let t = 0; t < p.length / 9; t++) {
    const k = [0, 1, 2].map(j => key(t * 3 + j)), s = [...k].sort().join('|');
    const prev = seen.get(s);
    if (prev === undefined || prev.t < 0) { seen.set(s, { t, k }); continue; }   // first, or first after a dropped pair
    const i = k.indexOf(prev.k[0]), same = k[(i + 1) % 3] === prev.k[1];
    drop.add(t);
    if (!same) { drop.add(prev.t); seen.set(s, { t: -1, k }); }
  }
  if (!drop.size) return geo;
  const out = [];
  for (let t = 0; t < p.length / 9; t++) if (!drop.has(t)) for (let j = 0; j < 9; j++) out.push(p[t * 9 + j]);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
  return g;
}

function closeTJunctions(geo) {
  const p = geo.attributes.position.array, cell = 2;      // mm
  const verts = new Map(), grid = new Map();
  for (let i = 0; i < p.length; i += 3) {
    const k = `${Math.round(p[i] * 1e4)},${Math.round(p[i + 1] * 1e4)},${Math.round(p[i + 2] * 1e4)}`;
    if (verts.has(k)) continue;
    const v = [p[i], p[i + 1], p[i + 2]];
    verts.set(k, v);
    const g = v.map(c => Math.floor(c / cell)).join(',');
    if (!grid.has(g)) grid.set(g, []);
    grid.get(g).push(v);
  }
  const onEdge = (a, b) => {                // corners strictly inside segment a–b, ordered from a
    const lo = [0, 1, 2].map(i => Math.floor((Math.min(a[i], b[i]) - 1e-3) / cell)), hi = [0, 1, 2].map(i => Math.floor((Math.max(a[i], b[i]) + 1e-3) / cell));
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2], hits = [];
    if ((hi[0] - lo[0] + 1) * (hi[1] - lo[1] + 1) * (hi[2] - lo[2] + 1) > 4096) return hits;
    for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) {
      for (const v of grid.get(`${x},${y},${z}`) ?? []) {
        const t = ((v[0] - a[0]) * d[0] + (v[1] - a[1]) * d[1] + (v[2] - a[2]) * d[2]) / L2;
        if (t <= 1e-6 || t >= 1 - 1e-6) continue;
        const q = [a[0] + t * d[0] - v[0], a[1] + t * d[1] - v[1], a[2] + t * d[2] - v[2]];
        if (q[0] * q[0] + q[1] * q[1] + q[2] * q[2] < 1e-8) hits.push([t, v]);
      }
    }
    return hits.sort((u, w) => u[0] - w[0]).map(h => h[1]);
  };
  const out = [];
  for (let i = 0; i < p.length; i += 9) {
    const T = [[p[i], p[i + 1], p[i + 2]], [p[i + 3], p[i + 4], p[i + 5]], [p[i + 6], p[i + 7], p[i + 8]]];
    const ring = [];
    for (let k = 0; k < 3; k++) ring.push(T[k], ...onEdge(T[k], T[(k + 1) % 3]));
    if (ring.length === 3) { out.push(...T.flat()); continue; }
    const c = [0, 1, 2].map(j => (T[0][j] + T[1][j] + T[2][j]) / 3);
    for (let k = 0; k < ring.length; k++) out.push(...c, ...ring[k], ...ring[(k + 1) % ring.length]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
  return g;
}

function creaseNormals(geo, creaseDeg) {
  const p = geo.attributes.position, nTri = p.count / 3, cosC = Math.cos(creaseDeg * Math.PI / 180);
  const fn = new Float32Array(nTri * 3), fa = new Float32Array(nTri);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (let t = 0; t < nTri; t++) {
    a.fromBufferAttribute(p, 3 * t); b.fromBufferAttribute(p, 3 * t + 1); c.fromBufferAttribute(p, 3 * t + 2);
    const n = b.sub(a).cross(c.sub(a)), area = n.length();
    fa[t] = area > 1e-9 ? 1 : 0;
    if (area > 0) n.divideScalar(area);
    fn.set([n.x, n.y, n.z], 3 * t);
  }
  const key = i => `${Math.round(p.getX(i) * 1e4)},${Math.round(p.getY(i) * 1e4)},${Math.round(p.getZ(i) * 1e4)}`;
  const at = new Map();
  for (let i = 0; i < p.count; i++) { const k = key(i); if (!at.has(k)) at.set(k, []); at.get(k).push(Math.floor(i / 3)); }
  const normals = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    const t0 = Math.floor(i / 3);
    let x = 0, y = 0, z = 0;
    for (const t of at.get(key(i))) {
      if (fn[3 * t] * fn[3 * t0] + fn[3 * t + 1] * fn[3 * t0 + 1] + fn[3 * t + 2] * fn[3 * t0 + 2] < cosC) continue;
      x += fn[3 * t] * fa[t]; y += fn[3 * t + 1] * fa[t]; z += fn[3 * t + 2] * fa[t];
    }
    let L = Math.hypot(x, y, z);
    if (!(L > 1e-12)) {
      x = y = z = 0;
      for (const t of at.get(key(i))) { x += fn[3 * t] * fa[t]; y += fn[3 * t + 1] * fa[t]; z += fn[3 * t + 2] * fa[t]; }
      L = Math.hypot(x, y, z);
      if (!(L > 1e-12)) { [x, y, z] = [fn[3 * t0], fn[3 * t0 + 1], fn[3 * t0 + 2]]; L = Math.hypot(x, y, z); }
      if (!(L > 1e-12)) { [x, y, z] = [0, 0, 1]; L = 1; }
    }
    normals.set([x / L, y / L, z / L], 3 * i);
  }
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  return geo;
}

function meshDefects(geo) {
  const p = geo.attributes.position.array, n = geo.attributes.normal.array;
  const key = i => `${Math.round(p[i * 3] * 1e5)},${Math.round(p[i * 3 + 2] * 1e5)},${Math.round(-p[i * 3 + 1] * 1e5)}`;
  const E = new Map();
  let back = 0;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), s = new THREE.Vector3();
  for (let t = 0; t < p.length / 9; t++) {
    const k = [0, 1, 2].map(j => key(t * 3 + j));
    if (new Set(k).size < 3) continue;
    for (let j = 0; j < 3; j++) { const d = `${k[j]}>${k[(j + 1) % 3]}`; E.set(d, (E.get(d) ?? 0) + 1); }
    a.fromArray(p, t * 9); b.fromArray(p, t * 9 + 3).sub(a); c.fromArray(p, t * 9 + 6).sub(a);
    s.fromArray(n, t * 9).add(a.fromArray(n, t * 9 + 3)).add(a.fromArray(n, t * 9 + 6));
    b.cross(c);
    if (b.dot(s) <= 1e-3 * b.length() * s.length()) back++;
  }
  let open = 0;
  for (const [d, cnt] of E) { const [u, v] = d.split('>'); if (E.get(`${v}>${u}`) !== cnt) open++; }
  return open + back;
}

Object.assign(ref, { dropSheets, closeTJunctions, creaseNormals, meshDefects });
}
{
// ---------------------------------------------------------------- 0.18 BSP booleans (web/src/robotgen/bsp.js at 622c32d)
const EPS = 1e-7;

function plane(v) {
  const [a, b, c] = v, u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], t = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  let n = [u[1] * t[2] - u[2] * t[1], u[2] * t[0] - u[0] * t[2], u[0] * t[1] - u[1] * t[0]];
  const l = Math.hypot(...n);
  n = [n[0] / l, n[1] / l, n[2] / l];
  return { n, w: n[0] * a[0] + n[1] * a[1] + n[2] * a[2] };
}
const polygon = v => ({ v, ...plane(v) });
const flip = p => ({ v: p.v.slice().reverse(), n: [-p.n[0], -p.n[1], -p.n[2]], w: -p.w });

// Split polygon p by plane pl into the four lists (coplanar polygons go to front or back by orientation).
function split(pl, p, cf, cb, f, b) {
  const types = p.v.map(x => { const t = pl.n[0] * x[0] + pl.n[1] * x[1] + pl.n[2] * x[2] - pl.w; return t < -EPS ? 2 : t > EPS ? 1 : 0; });
  const kind = types.reduce((a, t) => a | t, 0);
  if (kind === 0) (pl.n[0] * p.n[0] + pl.n[1] * p.n[1] + pl.n[2] * p.n[2] > 0 ? cf : cb).push(p);
  else if (kind === 1) f.push(p);
  else if (kind === 2) b.push(p);
  else {
    const fv = [], bv = [], n = p.v.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, ti = types[i], tj = types[j], vi = p.v[i], vj = p.v[j];
      if (ti !== 2) fv.push(vi);
      if (ti !== 1) bv.push(vi);
      if ((ti | tj) === 3) {
        const t = (pl.w - (pl.n[0] * vi[0] + pl.n[1] * vi[1] + pl.n[2] * vi[2])) / (pl.n[0] * (vj[0] - vi[0]) + pl.n[1] * (vj[1] - vi[1]) + pl.n[2] * (vj[2] - vi[2]));
        const m = [vi[0] + (vj[0] - vi[0]) * t, vi[1] + (vj[1] - vi[1]) * t, vi[2] + (vj[2] - vi[2]) * t];
        fv.push(m); bv.push(m);
      }
    }
    if (fv.length >= 3) f.push({ v: fv, n: p.n, w: p.w });
    if (bv.length >= 3) b.push({ v: bv, n: p.n, w: p.w });
  }
}

// BSP node; recursion replaced by explicit stacks (convex lofts make trees as deep as they have faces).
class Node {
  constructor(polys) { this.plane = null; this.front = null; this.back = null; this.polys = []; if (polys) this.build(polys); }
  build(polys) {
    const work = [[this, polys]];
    while (work.length) {
      const [node, list] = work.pop();
      if (!list.length) continue;
      if (!node.plane) node.plane = { n: list[0].n, w: list[0].w };
      const f = [], b = [];
      for (const p of list) split(node.plane, p, node.polys, node.polys, f, b);
      if (f.length) { node.front ??= new Node(); work.push([node.front, f]); }
      if (b.length) { node.back ??= new Node(); work.push([node.back, b]); }
    }
  }
  nodes() { const out = [], st = [this]; while (st.length) { const n = st.pop(); out.push(n); if (n.front) st.push(n.front); if (n.back) st.push(n.back); } return out; }
  invert() {
    for (const n of this.nodes()) {
      n.polys = n.polys.map(flip);
      n.plane = { n: [-n.plane.n[0], -n.plane.n[1], -n.plane.n[2]], w: -n.plane.w };
      [n.front, n.back] = [n.back, n.front];
    }
  }
  // Parts of polys outside this solid (in front of every leaf).
  clipPolygons(polys) {
    const out = [], st = [[this, polys]];
    while (st.length) {
      const [node, list] = st.pop();
      if (!node.plane) { out.push(...list); continue; }
      const f = [], b = [];
      for (const p of list) split(node.plane, p, f, b, f, b);
      if (node.front) st.push([node.front, f]); else out.push(...f);
      if (node.back) st.push([node.back, b]);
    }
    return out;
  }
  clipTo(bsp) { for (const n of this.nodes()) n.polys = bsp.clipPolygons(n.polys); }
  all() { return this.nodes().flatMap(n => n.polys); }
}

function union(A, B) {
  const a = new Node(A), b = new Node(B);
  a.clipTo(b); b.clipTo(a); b.invert(); b.clipTo(a); b.invert(); a.build(b.all());
  return a.all();
}
function subtract(A, B) {
  const a = new Node(A), b = new Node(B);
  a.invert(); a.clipTo(b); b.clipTo(a); b.invert(); b.clipTo(a); b.invert(); a.build(b.all()); a.invert();
  return a.all();
}
function intersect(A, B) {
  const a = new Node(A), b = new Node(B);
  a.invert(); b.clipTo(a); b.invert(); a.clipTo(b); b.clipTo(a); a.build(b.all()); a.invert();
  return a.all();
}

Object.assign(ref, { union, subtract, intersect });
}

const sameArray = (a, b, what) => {
  assert.equal(a.length, b.length, `${what}: length`);
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i] && !(Number.isNaN(a[i]) && Number.isNaN(b[i]))) assert.fail(`${what}: element ${i} ${a[i]} ≠ ${b[i]}`);
};
const pos = g => g.attributes.position.array;

// every form part with cuts of the three bodies, right side (the left one is mirrored after the cleanup)
const CUT_PARTS = ['waechter', 'paladin', 'mechanik'].flatMap(name => robotSpec(name).parts
  .filter(([, p]) => ['loft', 'wrap', 'tube'].includes(p[3]) && p[5].cuts?.length).map(([, p]) => [`${name}/${p[0]}`, p[3], p[5]]));

test('mesh helpers: cleanup of every CSG cut and its shading equal the 0.18 implementations to the bit', () => {
  const warn = console.warn;
  console.warn = () => {};
  try {
    assert.ok(CUT_PARTS.length >= 20, `${CUT_PARTS.length} parts with cuts`);
    let junctions = 0;
    for (const [key, kind, p] of CUT_PARTS) {
      const raw = rawCut(kind, p);
      const s1 = dropSheets(raw), r1 = ref.dropSheets(raw);
      sameArray(pos(s1), pos(r1), `${key} dropSheets`);
      const t = closeTJunctions(s1), rt = ref.closeTJunctions(r1);
      sameArray(pos(t), pos(rt), `${key} closeTJunctions`);
      if (pos(t).length !== pos(s1).length) junctions++;
      const g = dropSheets(t);
      for (const crease of [35, 44]) {
        const a = creaseNormals(g.clone(), crease), b = ref.creaseNormals(g.clone(), crease);
        sameArray(a.attributes.normal.array, b.attributes.normal.array, `${key} creaseNormals ${crease}°`);
        assert.equal(meshDefects(a), ref.meshDefects(b), `${key} meshDefects`);
      }
    }
    assert.ok(junctions > 10, `T-junctions closed in ${junctions} parts`);
  } finally {
    console.warn = warn;
  }
});

test('mesh helpers: equal on noisy input too (welding keys at their rounding limits, degenerate triangles)', () => {
  let seed = 7;
  const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) / 2 ** 32);
  // a jittered, finely triangulated box with T-junctions: its faces split once into 2 and once into 4 strips
  const P = [];
  const quad = (o, u, v, nu, nv) => {
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
      const c = (a, b) => [0, 1, 2].map(k => o[k] + u[k] * a / nu + v[k] * b / nv + (rnd() < 0.3 ? (rnd() - 0.5) * 2e-4 : 0));
      P.push(...c(i, j), ...c(i + 1, j), ...c(i + 1, j + 1), ...c(i, j), ...c(i + 1, j + 1), ...c(i, j + 1));
    }
  };
  quad([0, 0, 0], [0, 40, 0], [40, 0, 0], 2, 4);
  quad([0, 0, 0], [40, 0, 0], [0, 0, 30], 4, 2);
  quad([0, 0, 30], [40, 0, 0], [0, 40, 0], 4, 4);
  P.push(1, 1, 1, 1, 1, 1, 2, 2, 2);                                   // degenerate
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  sameArray(pos(dropSheets(g)), pos(ref.dropSheets(g)), 'dropSheets');
  sameArray(pos(closeTJunctions(g)), pos(ref.closeTJunctions(g)), 'closeTJunctions');
  const a = creaseNormals(g.clone(), 35), b = ref.creaseNormals(g.clone(), 35);
  sameArray(a.attributes.normal.array, b.attributes.normal.array, 'creaseNormals');
  assert.equal(meshDefects(a.clone().scale(0.001, 0.001, 0.001)), ref.meshDefects(b.clone().scale(0.001, 0.001, 0.001)));
});

test('BSP booleans: the same polygons as the 0.18 tree, with far fewer splits building it', () => {
  const head = solid(volumen(0.985)), core = solid(ellzylinder(0.42, 0.4, -0.55, 0.15, 0.02, 96));
  const box = solid(quader([0.3, 1.2, 0.3], [0.1, -0.2, 0.15]));
  for (const [op, a, b] of [['intersect', core, head], ['subtract', head, box], ['union', box, core]]) {
    stats.splits = 0;
    const fast = { intersect, subtract, union }[op](a, b), splits = stats.splits;
    const plain = ref[op](a, b);
    assert.equal(fast.length, plain.length, `${op}: polygons`);
    fast.forEach((p, i) => {
      assert.deepEqual(p.v, plain[i].v, `${op}: polygon ${i}`);
      assert.deepEqual([p.n, p.w], [plain[i].n, plain[i].w], `${op}: plane ${i}`);
    });
    if (op === 'intersect') assert.ok(splits < 0.3 * head.length * head.length / 2, `${op}: ${splits} splits for ${head.length} polygons of the head`);
  }
});

test('parts without cuts are built once and not checked for defects; parts with cuts still are', () => {
  let checks = 0;
  const count = () => (checks++, 0);
  assert.equal(firstClosed(k => k, count, 0, 0), 0);
  assert.equal(checks, 0);
  assert.equal(firstClosed(k => k, count, 3, 0), 0);
  assert.equal(checks, 1);
  const g = partGeometry('box', { d: [40, 20, 10], c: [0, 0, 0], bevel: 2 });
  assert.equal(g.userData.cutStage, 0);
});
