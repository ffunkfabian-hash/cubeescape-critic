// Polygon meshes for the Scout generator (0.17): the small part of Blender's mesh tools that archive/blender/scout uses on its final
// parts – n-gon meshes { V: [[x, y, z]], F: [[i, …]], S: [smooth per face] }, bmesh.ops.bisect_plane, face deletion,
// recalc_face_normals, exact booleans (BSP, bsp.js), BVH ray casts and Blender's shading (smooth, sharp edges by angle,
// corner normals weighted by the corner angle). Units are those of the Scout generator (H = helmet height = 1.0).
import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';
import { polygon, union, subtract, intersect } from './bsp.js';

export const mesh = (V, F, S = null) => ({ V, F, S: S ?? F.map(() => false) });
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = a => { const l = Math.hypot(...a); return l > 0 ? [a[0] / l, a[1] / l, a[2] / l] : [0, 0, 0]; };

// Newell normal (unit) and mean of the corners (bmesh calc_center_median) of a face.
export function faceNormal(V, f) {
  let x = 0, y = 0, z = 0;
  for (let k = 0; k < f.length; k++) {
    const a = V[f[k]], b = V[f[(k + 1) % f.length]];
    x += (a[1] - b[1]) * (a[2] + b[2]); y += (a[2] - b[2]) * (a[0] + b[0]); z += (a[0] - b[0]) * (a[1] + b[1]);
  }
  return norm([x, y, z]);
}
export function faceCenter(V, f) {
  const c = [0, 0, 0];
  for (const i of f) { c[0] += V[i][0]; c[1] += V[i][1]; c[2] += V[i][2]; }
  return [c[0] / f.length, c[1] / f.length, c[2] / f.length];
}

export const transformed = (m, fn) => ({ ...m, V: m.V.map(fn) });
export const join = (...ms) => {
  const V = [], F = [], S = [];
  for (const m of ms) { const o = V.length; V.push(...m.V); F.push(...m.F.map(f => f.map(i => i + o))); S.push(...m.S); }
  return { V, F, S };
};

// Faces failing keep(face index) removed, then unused corners (bmesh delete, context FACES).
export function keepFaces(m, keep) {
  const F = [], S = [], used = new Int32Array(m.V.length).fill(-1), V = [];
  m.F.forEach((f, i) => { if (keep(i)) { F.push(f); S.push(m.S[i]); } });
  for (const f of F) for (const i of f) if (used[i] < 0) { used[i] = V.length; V.push(m.V[i]); }
  return { V, F: F.map(f => f.map(i => used[i])), S };
}

// bmesh.ops.bisect_plane: edges crossing the plane get a corner on it (shared by both faces), corners within eps count as on
// the plane, and every face with corners on both sides is split between its corners on the plane (paired along the cut line).
export function bisect(m, co, no, eps = 1e-6) {
  const V = m.V.slice(), d = V.map(v => dot(sub(v, co), no)), side = d.map(x => (x > eps ? 1 : x < -eps ? -1 : 0));
  const cut = new Map(), F = [], S = [];
  const at = (a, b) => {
    const k = a < b ? `${a},${b}` : `${b},${a}`;
    if (!cut.has(k)) {
      const t = d[a] / (d[a] - d[b]), p = V[a], q = V[b];
      cut.set(k, V.length); V.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]); side.push(0);
    }
    return cut.get(k);
  };
  m.F.forEach((f, fi) => {
    let pos = false, neg = false;
    for (const i of f) { if (side[i] > 0) pos = true; if (side[i] < 0) neg = true; }
    if (!pos || !neg) { F.push(f); S.push(m.S[fi]); return; }
    const loop = [];
    for (let k = 0; k < f.length; k++) {
      const a = f[k], b = f[(k + 1) % f.length];
      loop.push(a);
      if (side[a] * side[b] < 0) loop.push(at(a, b));
    }
    const pieces = splitLoop(loop, V, side, faceNormal(V, f), no);
    for (const p of pieces) { F.push(p); S.push(m.S[fi]); }
  });
  return { V, F, S };
}

// Split a face loop at its corners on the plane: pairs of on-plane corners along the cut line, each pair splitting the piece
// that contains both (convex faces: one pair).
function splitLoop(loop, V, side, fn, no) {
  const dir = cross(fn, no), on = loop.filter(i => side[i] === 0).sort((a, b) => dot(V[a], dir) - dot(V[b], dir));
  let pieces = [loop];
  for (let k = 0; k + 1 < on.length; k += 2) {
    const a = on[k], b = on[k + 1], next = [];
    for (const p of pieces) {
      const i = p.indexOf(a), j = p.indexOf(b);
      if (i < 0 || j < 0 || Math.abs(i - j) === 1 || Math.abs(i - j) === p.length - 1) { next.push(p); continue; }
      const [lo, hi] = i < j ? [i, j] : [j, i];
      next.push(p.slice(lo, hi + 1), [...p.slice(hi), ...p.slice(0, lo + 1)]);
    }
    pieces = next;
  }
  return pieces;
}

// bmesh.ops.recalc_face_normals: per connected region consistent winding, oriented so that the face farthest from the region's
// centre points away from it.
export function recalcNormals(m) {
  const F = m.F.map(f => f.slice()), edges = new Map();
  F.forEach((f, fi) => f.forEach((a, k) => {
    const b = f[(k + 1) % f.length], key = a < b ? `${a},${b}` : `${b},${a}`;
    if (!edges.has(key)) edges.set(key, []);
    edges.get(key).push(fi);
  }));
  const seen = new Uint8Array(F.length);
  const directed = (f, a, b) => f.some((x, k) => x === a && f[(k + 1) % f.length] === b);
  for (let s = 0; s < F.length; s++) {
    if (seen[s]) continue;
    const region = [s];
    seen[s] = 1;
    for (let r = 0; r < region.length; r++) {
      const f = F[region[r]];
      f.forEach((a, k) => {
        const b = f[(k + 1) % f.length];
        for (const g of edges.get(a < b ? `${a},${b}` : `${b},${a}`)) {
          if (seen[g]) continue;
          if (directed(F[g], a, b)) F[g].reverse();      // neighbour must run the shared edge the other way
          seen[g] = 1; region.push(g);
        }
      });
    }
    const pts = new Set(region.flatMap(fi => F[fi])), c = [0, 0, 0];
    for (const i of pts) { c[0] += m.V[i][0] / pts.size; c[1] += m.V[i][1] / pts.size; c[2] += m.V[i][2] / pts.size; }
    let far = region[0], best = -1;
    for (const fi of region) { const q = sub(faceCenter(m.V, F[fi]), c), d2 = dot(q, q); if (d2 > best) { best = d2; far = fi; } }
    if (dot(faceNormal(m.V, F[far]), sub(faceCenter(m.V, F[far]), c)) < 0) for (const fi of region) F[fi].reverse();
  }
  return { ...m, F };
}

// Triangles of a face: quads split 0-2 (1-3 if that diagonal is the convex one), larger faces by ear clipping in their plane.
function faceTriangles(V, f) {
  if (f.length === 3) return [f];
  const n = faceNormal(V, f);
  if (f.length === 4) {
    const t0 = cross(sub(V[f[1]], V[f[0]]), sub(V[f[2]], V[f[0]])), t1 = cross(sub(V[f[2]], V[f[0]]), sub(V[f[3]], V[f[0]]));
    return dot(t0, n) > 0 && dot(t1, n) > 0 ? [[f[0], f[1], f[2]], [f[0], f[2], f[3]]] : [[f[0], f[1], f[3]], [f[1], f[2], f[3]]];
  }
  const ax = Math.abs(n[0]) > Math.abs(n[1]) ? (Math.abs(n[0]) > Math.abs(n[2]) ? 0 : 2) : (Math.abs(n[1]) > Math.abs(n[2]) ? 1 : 2);
  const [u, v] = [[1, 2], [2, 0], [0, 1]][ax], s = n[ax] < 0 ? -1 : 1;
  const pts = f.map(i => new THREE.Vector2(V[i][u] * s, V[i][v]));
  const tris = THREE.ShapeUtils.triangulateShape(pts, []);
  const flip = THREE.ShapeUtils.isClockWise(pts);
  return tris.map(([a, b, c]) => (flip ? [f[a], f[c], f[b]] : [f[a], f[b], f[c]]));
}
export function triangles(m) {
  const T = [], owner = [];
  m.F.forEach((f, fi) => { for (const t of faceTriangles(m.V, f)) { T.push(t); owner.push(fi); } });
  return { T, owner };
}

// Shading like Blender: flat faces (S false) use their normal; smooth faces average the faces around each corner that are
// smooth and within `angle` degrees of the corner's face (sharp edges by angle; 180 = all), weighted by the corner angle.
// Returns a non-indexed BufferGeometry with position and normal.
export function shaded(m, angle = 180) {
  const { T, owner } = triangles(m), fn = m.F.map(f => faceNormal(m.V, f)), cosA = Math.cos(Math.min(angle, 180) * Math.PI / 180) - 1e-6;
  const around = m.V.map(() => []);
  const cornerAngle = (t, k) => {
    const p = m.V[t[k]], a = norm(sub(m.V[t[(k + 1) % 3]], p)), b = norm(sub(m.V[t[(k + 2) % 3]], p));
    return Math.acos(Math.max(-1, Math.min(1, dot(a, b))));
  };
  T.forEach((t, ti) => { if (m.S[owner[ti]]) t.forEach((i, k) => around[i].push([owner[ti], cornerAngle(t, k)])); });
  const pos = new Float32Array(T.length * 9), nor = new Float32Array(T.length * 9);
  T.forEach((t, ti) => {
    const fi = owner[ti], n0 = fn[fi];
    t.forEach((i, k) => {
      pos.set(m.V[i], ti * 9 + k * 3);
      let n = n0;
      if (m.S[fi]) {
        const s = [0, 0, 0];
        for (const [g, w] of around[i]) if (dot(fn[g], n0) >= cosA) { s[0] += fn[g][0] * w; s[1] += fn[g][1] * w; s[2] += fn[g][2] * w; }
        n = Math.hypot(...s) > 1e-12 ? norm(s) : n0;
      }
      nor.set(n, ti * 9 + k * 3);
    });
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  return g;
}

// Triangle soup (positions only) of a mesh, for CSG and ray casts.
export function soup(m, scale = 1) {
  const { T } = triangles(m), pos = new Float32Array(T.length * 9);
  T.forEach((t, ti) => t.forEach((i, k) => pos.set(m.V[i].map(c => c * scale), ti * 9 + k * 3)));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return g;
}

// Exact booleans in Blender (helm_csg.csg) as BSP polygon booleans (bsp.js, double precision): ops [['I'|'U'|'D', mesh or
// solid], …] applied in order to a; a solid is a list of convex polygons and stays one through a chain of booleans and moves.
// finish() turns it into a closed triangle mesh. (three-bvh-csg in float32 left slivers that opened the chained jaw cuts.)
const isSolid = x => Array.isArray(x);
const convexPlanar = (V, f) => {
  if (f.length === 3) return true;
  const n = faceNormal(V, f), c = V[f[0]], w = n[0] * c[0] + n[1] * c[1] + n[2] * c[2];
  return f.every((i, k) => {
    const a = V[i], b = V[f[(k + 1) % f.length]], d = V[f[(k + 2) % f.length]];
    const t = cross([b[0] - a[0], b[1] - a[1], b[2] - a[2]], [d[0] - b[0], d[1] - b[1], d[2] - b[2]]);
    return Math.abs(n[0] * a[0] + n[1] * a[1] + n[2] * a[2] - w) < 1e-9 && t[0] * n[0] + t[1] * n[1] + t[2] * n[2] > 1e-12;
  });
};
export const solid = m => (isSolid(m) ? m : m.F.flatMap(f => (convexPlanar(m.V, f) ? [f] : faceTriangles(m.V, f))).map(f => polygon(f.map(i => m.V[i]))));
export function csg(a, ops) {
  let A = solid(a);
  for (const [op, b] of ops) A = { I: intersect, U: union, D: subtract }[op](A, solid(b));
  return A;
}
export const moveSolid = (A, fn) => A.map(p => polygon(p.v.map(fn)));

// Solid → closed triangle mesh: corners welded (1e-9), corners of neighbours lying on a polygon's edge inserted into it (the BSP
// splits leave T-junctions), polygons with such corners fanned around their centroid, the others from their first corner.
export function finish(A, eps = 1e-9) {
  const pts = A.flatMap(p => p.v), order = pts.map((_, i) => i).sort((i, j) => pts[i][0] - pts[j][0]);
  const id = new Int32Array(pts.length).fill(-1), V = [];
  for (let a = 0; a < order.length; a++) {
    const i = order[a];
    if (id[i] >= 0) continue;
    id[i] = V.length; V.push(pts[i]);
    for (let b = a + 1; b < order.length && pts[order[b]][0] - pts[i][0] <= eps; b++) {
      const j = order[b], q = pts[j];
      if (id[j] < 0 && Math.abs(q[1] - pts[i][1]) <= eps && Math.abs(q[2] - pts[i][2]) <= eps) id[j] = id[i];
    }
  }
  const xs = V.map((v, i) => i).sort((i, j) => V[i][0] - V[j][0]), xv = xs.map(i => V[i][0]);
  const lower = x => { let lo = 0, hi = xv.length; while (lo < hi) { const m = (lo + hi) >> 1; if (xv[m] < x) lo = m + 1; else hi = m; } return lo; };
  const onEdge = (a, b) => {
    const A_ = V[a], B_ = V[b], d = [B_[0] - A_[0], B_[1] - A_[1], B_[2] - A_[2]], L2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2], hits = [];
    for (let k = lower(Math.min(A_[0], B_[0]) - 1e-7); k < xs.length && xv[k] <= Math.max(A_[0], B_[0]) + 1e-7; k++) {
      const i = xs[k];
      if (i === a || i === b) continue;
      const v = V[i], t = ((v[0] - A_[0]) * d[0] + (v[1] - A_[1]) * d[1] + (v[2] - A_[2]) * d[2]) / L2;
      if (t <= 1e-9 || t >= 1 - 1e-9) continue;
      const e = [A_[0] + t * d[0] - v[0], A_[1] + t * d[1] - v[1], A_[2] + t * d[2] - v[2]];
      if (e[0] * e[0] + e[1] * e[1] + e[2] * e[2] < 1e-14) hits.push([t, i]);
    }
    return hits.sort((u, w) => u[0] - w[0]).map(h => h[1]);
  };
  const F = [];
  let k = 0;
  for (const p of A) {
    const f = p.v.map(() => id[k++]).filter((v, j, arr) => v !== arr[(j + 1) % arr.length]);
    if (new Set(f).size < 3) continue;
    const ring = f.flatMap((a, j) => [a, ...onEdge(a, f[(j + 1) % f.length])]);
    if (ring.length === f.length) { for (let j = 1; j < f.length - 1; j++) F.push([f[0], f[j], f[j + 1]]); continue; }
    const c = V.length;
    V.push(faceCenter(V, f));
    for (let j = 0; j < ring.length; j++) F.push([c, ring[j], ring[(j + 1) % ring.length]]);
  }
  return mesh(V, F, F.map(() => true));
}

// Ray cast against a mesh (Blender BVHTree.ray_cast: nearest hit, either side): [point, face normal] or null.
export function raycaster(m) {
  const g = soup(m), bvh = new MeshBVH(g), ray = new THREE.Ray();
  return (origin, dir) => {
    ray.origin.set(...origin); ray.direction.set(...dir).normalize();
    const h = bvh.raycastFirst(ray, THREE.DoubleSide);
    return h ? [h.point.toArray(), h.face.normal.toArray()] : null;
  };
}
