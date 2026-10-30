// Meshes of the robot parts (replaces cubeescape-ballon tools/ego_build.form_mesh/piece_mesh and robot_build._piece): form,
// grooves (cuts, CSG subtraction), mirroring of the left side, tilt (rot), bevel as geometry, shading normals with a crease angle
// weighted by face area (Blender: smooth + sharp from angle, bevel with harden normals, weighted normals). Output: non-indexed
// BufferGeometry in metres in the segment frame (Blender axes: Z up, front −Y).
import * as THREE from 'three';
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg';
import { tube } from './forms.js';
import { loftBevel, wrapBevel, cylBevel, boxBevel, hullBevel } from './bevel.js';

// Bevel width per form (mm) when the part sets none (robot_build._piece › kit.add_bevel).
export const BEVEL = { cyl: 0.8, hull: 2.0, hulls: 1.0, prism: 1.6, plate: 1.0, box: 1.0, loft: 1.6, wrap: 1.2, tube: 0.0 };
const FORMS = new Set(['loft', 'wrap', 'tube']);
const LOFT_CREASE = 44;

// Faceted plate (Arm v3 robot_arm.plate): tapered base at distance r(z) from the segment axis, thickness t, hip roof with ridge,
// placed around the axis by phi (0 = +Y) and shifted sideways by u; convex hull of these points.
export function platePoints(p) {
  const [z0, z1] = p.z, [w0, w1] = p.w, [r0, r1] = p.r, [h0, h1] = p.hip;
  const { t, ridge: rg } = p, u = p.u ?? 0;
  const r = z => r0 + (r1 - r0) * (z - z0) / (z1 - z0);
  const pts = [];
  for (const [z, w] of [[z0, w0], [z1, w1]]) for (const s of [-1, 1]) pts.push([u + s * w / 2, r(z), z], [u + s * w / 2, r(z) + t, z]);
  if (rg > 0) for (const z of [z0 + h0, z1 - h1]) pts.push([u, r(z) + t + rg, z]);
  const ph = (p.phi ?? 0) * Math.PI / 180, c = Math.cos(ph), s_ = Math.sin(ph);
  return pts.map(([x, n, z]) => [x * c - n * s_, x * s_ + n * c, z]);
}

// Parameters of a non-form part for side sx (robot_build._mirror): positions and point clouds mirrored at X.
export function mirrorParams(kind, p, sx) {
  p = { ...p };
  if (p.c) p.c = [sx * p.c[0], p.c[1], p.c[2]];
  if (kind === 'hull') p.pts = p.pts.map(([x, y, z]) => [sx * x, y, z]);
  if (kind === 'plate') { p.phi = sx * (p.phi ?? 0); p.u = sx * (p.u ?? 0); }
  return p;
}

function rawShape(kind, p, w) {
  switch (kind) {
    case 'loft': return loftBevel(p.secs, p.ring ?? 56, p.sub ?? 6, w);
    case 'wrap': return wrapBevel(p.secs, p.a0, p.a1, p.t, p.steps ?? null, p.sub ?? 6, w);
    case 'tube': return tube(p.path, p.r, p.segs ?? 14);
    case 'hull': return hullBevel(p.pts, w);
    case 'plate': return hullBevel(platePoints(p), w);
    case 'box': return place(boxBevel(p.d, w), p.c);
    case 'cyl': {
      const g = cylBevel(p.r, p.len, 20, w);
      // Blender create_cone along Z, turned onto X (90° about Y) or Y (90° about X)
      const turn = p.axis === 'x' ? ([x, y, z]) => [z, y, -x] : p.axis === 'y' ? ([x, y, z]) => [x, -z, y] : v => v;
      g.V = g.V.map(turn);
      if (g.N) g.N = g.N.map(turn);
      return place(g, p.c);
    }
    default: throw new Error(`robotgen: unknown form ${kind}`);
  }
}

function place(g, c) {
  if (c) g.V = g.V.map(([x, y, z]) => [x + c[0], y + c[1], z + c[2]]);
  return g;
}

// Triangle soup (mm) from { V, F } (with vertex normals N when the form defines them), degenerate triangles dropped.
function toGeometry({ V, F, N }) {
  const pos = [], nor = [];
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (const f of F) {
    for (let j = 1; j < f.length - 1; j++) {
      a.fromArray(V[f[0]]); b.fromArray(V[f[j]]); c.fromArray(V[f[j + 1]]);
      if (b.clone().sub(a).cross(c.clone().sub(a)).lengthSq() < 1e-12) continue;
      pos.push(...V[f[0]], ...V[f[j]], ...V[f[j + 1]]);
      if (N) nor.push(...N[f[0]], ...N[f[j]], ...N[f[j + 1]]);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  if (N) g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  return g;
}

let evaluator = null;
// Grooves and openings: boxes { c, d, rz, rx } (mm, segment frame; rotation Z·X) subtracted from the form.
function cut(geo, cuts) {
  evaluator ??= Object.assign(new Evaluator(), { attributes: ['position'], useGroups: false });
  let result = new Brush(geo);
  result.updateMatrixWorld();
  for (const c of cuts) {
    const box = new THREE.BoxGeometry(...c.d);
    box.deleteAttribute('normal'); box.deleteAttribute('uv');
    const m = new THREE.Matrix4().makeRotationZ((c.rz ?? 0) * Math.PI / 180).multiply(new THREE.Matrix4().makeRotationX((c.rx ?? 0) * Math.PI / 180));
    box.applyMatrix4(m).translate(...c.c);
    const brush = new Brush(box);
    brush.updateMatrixWorld();
    result = evaluator.evaluate(result, brush, SUBTRACTION);
  }
  const out = result.geometry.index ? result.geometry.toNonIndexed() : result.geometry;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', out.attributes.position);
  return g;
}

// Where cutters touch each other or the surface, the CSG result keeps zero-volume sheets: pairs of coincident triangles with
// opposite winding (and a few exact duplicates). Both triangles of a reversed pair and the second of a duplicate are dropped.
export function dropSheets(geo) {
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

// The CSG result has T-junctions (a corner in the middle of a neighbour's edge); the wear shader (robotWear.js) reads those edges
// as open boundaries and draws scratch lines along them. Every triangle with corners of other triangles on its edges is split
// into a fan around its centroid through those points, so all edges are shared again.
export function closeTJunctions(geo) {
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

// Vertex normals per corner from all faces at the same position whose normal is within the crease angle, weighted uniformly
// like Blender's weighted-normal modifier at weight 50 (area weighting turns the normals abruptly across narrow chamfer
// facets, which the wear shader reads as bevel strips).
export function creaseNormals(geo, creaseDeg) {
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
    const L = Math.hypot(x, y, z) || 1;
    normals.set([x / L, y / L, z / L], 3 * i);
  }
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  return geo;
}

// Open or flipped spots of a part (metres, segment frame): corners welded by the key of robotgen.test.mjs › closure (0.01 mm in
// glTF axes x, z, −y, where the part ends up), directed edges without a reverse partner, plus triangles whose shading normals
// face the back or lie almost in the face (a margin, so float rounding of the later axis turn cannot flip them).
export function meshDefects(geo) {
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

// Where cutters nearly coincide with the tessellation (eye sockets of the helmet mask), three-bvh-csg can leave slivers below
// 0.01 mm that open the mesh; Blender's exact boolean has none. The cut is then repeated with every cutter grown by
// CUT_JITTER mm per attempt (deterministic, far below the 1 mm box tolerance) until the form is closed.
export const CUT_JITTER = 0.002, CUT_RETRIES = 32;

function shapeGeometry(kind, p, sx, grow) {
  const w = p.bevel ?? BEVEL[kind] ?? 1.0;
  let geo = toGeometry(rawShape(kind, p, w));
  if (FORMS.has(kind) && p.cuts?.length) {
    const cuts = grow ? p.cuts.map(c => ({ ...c, d: c.d.map(v => v + 2 * grow) })) : p.cuts;
    geo = dropSheets(closeTJunctions(dropSheets(cut(geo, cuts))));
  }
  if (FORMS.has(kind) && sx < 0) {      // left side: mirrored at X, winding turned back outwards
    geo.scale(-1, 1, 1);
    const q = geo.attributes.position.array;
    for (let i = 0; i < q.length; i += 9) for (let k = 0; k < 3; k++) { const t = q[i + 3 + k]; q[i + 3 + k] = q[i + 6 + k]; q[i + 6 + k] = t; }
  }
  if (p.rot) {                          // tilt about a segment axis: rot = [axis, degrees, pivot mm]; left side mirrored
    let [ax, deg, piv] = p.rot;
    if (sx < 0) { piv = [-piv[0], piv[1], piv[2]]; if (ax !== 'x') deg = -deg; }
    const R = new THREE.Matrix4()[`makeRotation${ax.toUpperCase()}`](deg * Math.PI / 180);
    geo.applyMatrix4(new THREE.Matrix4().makeTranslation(...piv).multiply(R).multiply(new THREE.Matrix4().makeTranslation(-piv[0], -piv[1], -piv[2])));
  }
  // Blender bevels every edge above 30° with two segments, so on a loft the normals turn in steps below 30° across the chamfer
  // corners (33–43°) of its cross-sections; only the 45° middle step of the cap bevels stays a hard (wearing) edge.
  // cylinders bring their own smooth normals (bevel.js › cylBevel)
  if (!geo.attributes.normal) creaseNormals(geo, { hull: p.sharp ?? 40, loft: Math.max(p.sharp ?? 35, LOFT_CREASE) }[kind] ?? p.sharp ?? 35);
  return geo;
}

// Indexed geometry like the GLB: corners with equal position and shading normal (equal floats, hash table) share one vertex,
// in order of first appearance; the triangles and their shading stay as they are (a third of the vertices of the triangle soup).
export function indexGeometry(geo) {
  const p = geo.attributes.position.array, n = geo.attributes.normal.array, count = p.length / 3;
  const bits = a => new Uint32Array(a.buffer, a.byteOffset, a.length).map(w => (w === 0x80000000 ? 0 : w));   // −0 = +0
  const P = bits(p), N = bits(n);
  let size = 1;
  while (size < 2 * count) size *= 2;
  const table = new Int32Array(size).fill(-1), first = new Uint32Array(count), index = new Uint32Array(count);
  let verts = 0;
  for (let i = 0; i < count; i++) {
    let h = 0x811c9dc5;
    for (const w of [P[3 * i], P[3 * i + 1], P[3 * i + 2], N[3 * i], N[3 * i + 1], N[3 * i + 2]]) h = Math.imul(h ^ w, 0x01000193);
    let slot = (h >>> 0) & (size - 1), v;
    for (;; slot = (slot + 1) & (size - 1)) {
      v = table[slot];
      if (v < 0) { v = table[slot] = verts; first[verts++] = i; break; }
      const j = first[v];
      if (P[3 * j] === P[3 * i] && P[3 * j + 1] === P[3 * i + 1] && P[3 * j + 2] === P[3 * i + 2]
        && N[3 * j] === N[3 * i] && N[3 * j + 1] === N[3 * i + 1] && N[3 * j + 2] === N[3 * i + 2]) break;
    }
    index[i] = v;
  }
  const pos = new Float32Array(3 * verts), nor = new Float32Array(3 * verts);
  for (let v = 0; v < verts; v++) { pos.set(p.subarray(3 * first[v], 3 * first[v] + 3), 3 * v); nor.set(n.subarray(3 * first[v], 3 * first[v] + 3), 3 * v); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setIndex(new THREE.BufferAttribute(verts > 65535 ? index : Uint16Array.from(index), 1));
  return g;
}

// First of build(0), build(1), … (at most `retries` repeats) without defects; the last one when none is closed.
export function firstClosed(build, defects, retries) {
  let geo = build(0);
  for (let k = 1; k <= retries && defects(geo); k++) geo = build(k);
  return geo;
}

// Geometry of one part for side sx (+1 right/centre, −1 left), metres, segment frame.
export function partGeometry(kind, params, sx = 1, retries = CUT_RETRIES) {
  const p = FORMS.has(kind) ? params : mirrorParams(kind, params, sx);
  const retry = FORMS.has(kind) && p.cuts?.length ? retries : 0;
  const build = k => shapeGeometry(kind, p, sx, k * CUT_JITTER).scale(0.001, 0.001, 0.001);
  return firstClosed(build, meshDefects, retry);
}
