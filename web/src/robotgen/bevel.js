// Bevelled forms: the bevel is built into the geometry instead of Blender's bevel modifier (kit.add_bevel: width per form,
// 2 segments, circular profile). Loft: rounded transition from the side into both caps. Wrap: the plate is a rounded box in
// its own parameters (angle along the contour, cross-section index, offset from the contour), so the outer and inner edges,
// the side walls and both ends are rounded. Cylinder: rounded rims. Box: rounded box. Hull: convex hull of the eroded hull
// plus offsets along the face normals and their bisectors. Units mm, frames as forms.js.
import * as THREE from 'three';
import { ConvexHull } from 'three/examples/jsm/math/ConvexHull.js';
import { resample, pt, loft, wrap, orient } from './forms.js';

const S45 = Math.SQRT1_2;
const ARC = [[0, 0], [1 - S45, S45], [1, 1]];   // bevel profile with 2 segments: [axial share 1 − cos θ, radial share sin θ]
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
const lerpSec = (a, b, t) => Object.fromEntries(Object.keys(a).map(k => [k, typeof a[k] === 'number' ? a[k] + ((b[k] ?? a[k]) - a[k]) * t : a[k]]));

// Mean distance between corresponding contour points of two cross-sections (length of the side surface between them).
function span(a, b, angles, g = 0) {
  return angles.reduce((s, u) => s + dist(pt(a, u, g), pt(b, u, g)), 0) / angles.length || 1;
}

// Rows of a swept form with bevelled ends: [section, inset share 1 − sin θ, θ index] per row; inner rows have share 0.
function bevelRows(S, w, angles, g = 0) {
  const rows = [];
  const end = (s0, s1) => {
    const L = span(s0, s1, angles, g);
    return ARC.map(([ax, rad], i) => [lerpSec(s0, s1, Math.min(0.45, w * ax / L)), 1 - rad, i]);
  };
  rows.push(...end(S[0], S[1]));
  for (let i = 1; i < S.length - 1; i++) rows.push([S[i], 0, 2]);
  rows.push(...end(S[S.length - 1], S[S.length - 2]).reverse());
  return rows;
}

const minHalf = s => Math.min(s.a, s.b);

export function loftBevel(secs, ring = 40, sub = 6, w = 0) {
  if (w <= 0) return loft(secs, ring, sub);
  const S = resample(secs, sub);
  const angles = Array.from({ length: 8 }, (_, k) => 45 * k);
  const L0 = Math.min(span(S[0], S[1], angles), span(S.at(-1), S.at(-2), angles));
  const ww = Math.min(w, 0.45 * L0, 0.45 * Math.min(...S.map(minHalf)));
  const rows = bevelRows(S, ww, angles);
  const V = [], F = [];
  for (const [s, inset] of rows) for (let k = 0; k < ring; k++) V.push(pt(s, 360 * k / ring, -ww * inset));
  for (let i = 0; i < rows.length - 1; i++) {
    const a = i * ring, b = (i + 1) * ring;
    for (let k = 0; k < ring; k++) { const k2 = (k + 1) % ring; F.push([a + k, b + k, b + k2, a + k2]); }
  }
  for (const [idx, flip] of [[0, true], [rows.length - 1, false]]) {
    const s = rows[idx][0], c = V.length, base = idx * ring;
    V.push([s.x, s.y, s.z]);
    for (let k = 0; k < ring; k++) { const k2 = (k + 1) % ring; F.push(flip ? [c, base + k, base + k2] : [c, base + k2, base + k]); }
  }
  return { V, F: orient(V, F) };
}

// mm along the contour per degree at angle ang (offset g).
const mmPerDeg = (s, ang, g) => Math.max(1e-3, dist(pt(s, ang - 0.5, g), pt(s, ang + 0.5, g)));

export function wrapBevel(secs, a0, a1, t, steps = null, sub = 6, w = 0) {
  if (w <= 0) return wrap(secs, a0, a1, t, steps, sub);
  const S = resample(secs.map(s => ({ ...s, a0: s.a0 ?? a0, a1: s.a1 ?? a1 })), sub);
  const closed = Math.abs((a1 - a0) - 360) < 1e-6;
  const n = steps || Math.max(8, Math.trunc(Math.abs(a1 - a0) / 6));
  const mid = s => (s.a0 + s.a1) / 2;
  const angles = closed ? Array.from({ length: 8 }, (_, k) => a0 + 45 * k) : [0.25, 0.5, 0.75].map(f => a0 + (a1 - a0) * f);
  const arc = s => Math.abs(s.a1 - s.a0) * mmPerDeg(s, mid(s), 0);
  const L0 = Math.min(span(S[0], S[1], angles, t / 2), span(S.at(-1), S.at(-2), angles, t / 2));
  const ww = Math.max(0, Math.min(w, 0.45 * t, 0.45 * L0, closed ? Infinity : 0.45 * Math.min(...S.map(arc))));
  const rows = bevelRows(S, ww, angles, t / 2);
  const V = [], F = [];
  if (closed) {
    // two rings per row (inside and outside), ends rounded in (row, offset)
    for (const [s, inset] of rows) for (const g of [ww * inset, t - ww * inset]) for (let k = 0; k < n; k++) V.push(pt(s, s.a0 + 360 * k / n, g));
    const ix = (i, layer, k) => (i * 2 + layer) * n + (k % n);
    for (let i = 0; i < rows.length - 1; i++) {
      for (let k = 0; k < n; k++) {
        F.push([ix(i, 1, k), ix(i + 1, 1, k), ix(i + 1, 1, k + 1), ix(i, 1, k + 1)]);
        F.push([ix(i, 0, k + 1), ix(i + 1, 0, k + 1), ix(i + 1, 0, k), ix(i, 0, k)]);
      }
    }
    for (const [i, flip] of [[0, true], [rows.length - 1, false]]) {
      for (let k = 0; k < n; k++) { const q = [ix(i, 0, k), ix(i, 0, k + 1), ix(i, 1, k + 1), ix(i, 1, k)]; F.push(flip ? q.reverse() : q); }
    }
    return { V, F: orient(V, F) };
  }
  // open plate: per row a loop round the cross profile (angle × offset), rectangle with rounded corners
  // loop: inner edge left→right (n + 1), corner, right wall (2), corner, outer edge right→left (n + 1), corner, left wall (2), corner
  const M = 2 * n + 10;
  for (const [s, inset, th] of rows) {
    const e = ww * inset, rho = ww * ARC[th][1];
    const dir = Math.sign(s.a1 - s.a0) || 1;   // plates may run towards negative angles (a1 < a0)
    const fromL = (mm, g) => s.a0 + dir * mm / mmPerDeg(s, s.a0, g), fromR = (mm, g) => s.a1 - dir * mm / mmPerDeg(s, s.a1, g);
    const edge = (g, rev) => {
      const l = fromL(e + rho, g), r = fromR(e + rho, g);
      return Array.from({ length: n + 1 }, (_, k) => { const f = rev ? 1 - k / n : k / n; return pt(s, l + (r - l) * f, g); });
    };
    const c = rho * (1 - S45);   // corner midpoint inset along both directions
    V.push(...edge(e, false),
      pt(s, fromR(e + c, e + c), e + c),
      pt(s, fromR(e, e + rho), e + rho), pt(s, fromR(e, t - e - rho), t - e - rho),
      pt(s, fromR(e + c, t - e - c), t - e - c),
      ...edge(t - e, true),
      pt(s, fromL(e + c, t - e - c), t - e - c),
      pt(s, fromL(e, t - e - rho), t - e - rho), pt(s, fromL(e, e + rho), e + rho),
      pt(s, fromL(e + c, e + c), e + c));
  }
  for (let i = 0; i < rows.length - 1; i++) {
    const a = i * M, b = (i + 1) * M;
    for (let k = 0; k < M; k++) { const k2 = (k + 1) % M; F.push([a + k, a + k2, b + k2, b + k]); }
  }
  const top0 = n + 5;   // index of the first outer-edge point (right end)
  for (const [i, flip] of [[0, true], [rows.length - 1, false]]) {
    const o = i * M;
    for (let k = 0; k < n; k++) {
      const q = [o + k, o + top0 + n - k, o + top0 + n - k - 1, o + k + 1];
      F.push(flip ? q : q.reverse());
    }
  }
  return { V, F: orient(V, F) };
}

// Revolved profile [[radius, z, normal angle from +Z in degrees?]…] around +Z with segs segments; radius 0 rows are single
// pole vertices. With an angle on every row (no poles), N holds the vertex normals and the caps are fans over the first and
// last row (Blender's n-gon cap as exported).
function revolve(profile, segs) {
  const smooth = profile.filter(([r]) => r > 1e-9).every(row => row.length > 2);
  const rows = smooth ? profile.filter(([r]) => r > 1e-9) : profile;
  const V = [], F = [], N = [], idx = [];
  for (const [r, z, phi = 0] of rows) {
    if (r <= 1e-9) { idx.push([V.length]); V.push([0, 0, z]); continue; }
    const sp = Math.sin(phi * Math.PI / 180), cp = Math.cos(phi * Math.PI / 180), row = [];
    for (let k = 0; k < segs; k++) {
      const a = 2 * Math.PI * k / segs;
      row.push(V.length); V.push([r * Math.cos(a), r * Math.sin(a), z]); N.push([sp * Math.cos(a), sp * Math.sin(a), cp]);
    }
    idx.push(row);
  }
  for (let i = 0; i < idx.length - 1; i++) {
    const A = idx[i], B = idx[i + 1];
    for (let k = 0; k < segs; k++) {
      const k2 = (k + 1) % segs;
      if (A.length === 1) F.push([A[0], B[k2], B[k]]);
      else if (B.length === 1) F.push([A[k], A[k2], B[0]]);
      else F.push([A[k], A[k2], B[k2], B[k]]);
    }
  }
  if (!smooth) return { V, F: orient(V, F) };
  const first = idx[0], last = idx[idx.length - 1];
  for (let k = 1; k < segs - 1; k++) F.push([first[0], first[k + 1], first[k]], [last[0], last[k], last[k + 1]]);
  return { V, F: orient(V, F), N };
}

// Cylinder along Z (radius r, length len, centred), rims rounded by w. Normals as Ballon's GLB (bevel with harden normals): caps
// and mantle flat, the bevel rows lean 22.5°, 45° and 67.5° from the axis; rows repeat with the flat normal where a flat face
// starts (the zero-area faces between them are dropped later). No step between neighbours reaches the wear shader's 30°.
export function cylBevel(r, len, segs = 20, w = 0) {
  const h = len / 2, ww = Math.min(w, 0.45 * r, 0.45 * len);
  if (ww <= 0) return revolve([[0, -h], [r, -h], [r, h], [0, h]], segs);
  const rim = sz => ARC.map(([ax, rad], i) => [r - ww + ww * rad, sz * (h - ww + ww * (1 - ax)), sz > 0 ? 22.5 * (i + 1) : 180 - 22.5 * (i + 1)]);
  const lo = rim(-1), hi = rim(1).reverse();
  return revolve([[lo[0][0], lo[0][1], 180], ...lo, [lo[2][0], lo[2][1], 90], [hi[0][0], hi[0][1], 90], ...hi, [hi[2][0], hi[2][1], 0]], segs);
}

// Box of size d (centred), edges rounded by w.
export function boxBevel(d, w = 0) {
  const ww = Math.min(w, 0.45 * Math.min(...d));
  if (ww <= 0) return geometryToVF(new THREE.BoxGeometry(...d));
  return geometryToVF(new RoundedBox(d, ww));
}

class RoundedBox extends THREE.BufferGeometry {
  // Box with 2-segment rounded edges: every vertex of a subdivided cube (segment grid with rows at the bevel lines) is moved
  // to the surface of the box shrunk by w plus w along its direction from the inner box.
  constructor(d, w) {
    super();
    const g = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3), p = g.attributes.position;
    const half = d.map(v => v / 2), inner = half.map(v => v - w);
    const v = new THREE.Vector3(), q = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      // grid 0, 1/3, 2/3, 1 → −half, −inner, +inner, +half; the bevel rows sit exactly on the inner box
      const c = [v.x, v.y, v.z].map((u, a) => { const s = Math.sign(u); return Math.abs(u) > 0.4 ? s * inner[a] : s * inner[a] * (Math.abs(u) > 0.1 ? 1 : 0); });
      const o = [v.x, v.y, v.z].map((u, a) => (Math.abs(u) > 0.4 ? Math.sign(u) : 0));
      q.set(...o);
      if (q.lengthSq() > 0) q.normalize().multiplyScalar(w);
      p.setXYZ(i, c[0] + q.x, c[1] + q.y, c[2] + q.z);
    }
    this.copy(g);
  }
}

export function geometryToVF(g) {
  const p = g.attributes.position, V = [], F = [];
  for (let i = 0; i < p.count; i++) V.push([p.getX(i), p.getY(i), p.getZ(i)]);
  const ix = g.index ? Array.from(g.index.array) : V.map((_, i) => i);
  for (let i = 0; i < ix.length; i += 3) F.push([ix[i], ix[i + 1], ix[i + 2]]);
  return { V, F };
}

// Convex hull of points (mm) as { V, F } with outward triangles.
export function hull(points) {
  const h = new ConvexHull().setFromPoints(points.map(p => new THREE.Vector3(...p)));
  const V = [], F = [], key = new Map();
  const id = v => { const k = `${v.x.toFixed(5)},${v.y.toFixed(5)},${v.z.toFixed(5)}`; if (!key.has(k)) { key.set(k, V.length); V.push([v.x, v.y, v.z]); } return key.get(k); };
  for (const f of h.faces) {
    const ring = [];
    let e = f.edge;
    do { ring.push(id(e.head().point)); e = e.next; } while (e !== f.edge);
    for (let j = 1; j < ring.length - 1; j++) F.push([ring[0], ring[j], ring[j + 1]]);
  }
  return { V, F: orient(V, F) };
}

// Bevelled convex hull: planes of the hull (coplanar triangles merged), every vertex moved inwards so that it lies w below all
// its planes (least squares), then the hull of these points offset by w along each plane normal and along the bisectors of plane
// pairs – flat faces keep their place, edges and corners get a 2-segment rounding.
export function hullBevel(points, w = 0) {
  const base = hull(points);
  if (w <= 0) return base;
  const { V, F } = base;
  const planes = [], faceNormals = F.map(([a, b, c]) => {
    const u = new THREE.Vector3(...V[b]).sub(new THREE.Vector3(...V[a])), v = new THREE.Vector3(...V[c]).sub(new THREE.Vector3(...V[a]));
    return u.cross(v).normalize();
  });
  const planeOf = F.map((f, i) => {
    const n = faceNormals[i], d = n.dot(new THREE.Vector3(...V[f[0]]));
    let k = planes.findIndex(p => p.n.dot(n) > 0.99985 && Math.abs(p.d - d) < 0.02);
    if (k < 0) { k = planes.length; planes.push({ n: n.clone(), d }); }
    return k;
  });
  const box = new THREE.Box3().setFromPoints(V.map(p => new THREE.Vector3(...p)));
  const size = box.getSize(new THREE.Vector3());
  const ww = Math.min(w, 0.3 * Math.min(size.x, size.y, size.z));
  const vp = V.map(() => new Set());
  F.forEach((f, i) => f.forEach(v => vp[v].add(planeOf[i])));
  const out = [];
  V.forEach((p, i) => {
    const N = [...vp[i]].map(k => planes[k].n);
    // least squares m with n·m = 1 for every plane at the vertex (Tikhonov for edges with two planes)
    const A = new THREE.Matrix3().set(1e-6, 0, 0, 0, 1e-6, 0, 0, 0, 1e-6), rhs = new THREE.Vector3();
    const e = A.elements;
    for (const n of N) {
      const a = [n.x, n.y, n.z];
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) e[c * 3 + r] += a[r] * a[c];
      rhs.add(n);
    }
    const m = rhs.applyMatrix3(A.clone().invert());
    const q = new THREE.Vector3(...p).addScaledVector(m, -ww);
    const dirs = [...N];
    for (let a = 0; a < N.length; a++) for (let b = a + 1; b < N.length; b++) if (N[a].dot(N[b]) < Math.cos(Math.PI / 6)) dirs.push(N[a].clone().add(N[b]).normalize());
    for (const d of dirs) out.push(q.clone().addScaledVector(d, ww).toArray());
  });
  return hull(out);
}
