// Scout S01–S05 from the baked cast of run 2h (blender/scout/guss_2h.npz, read with npz.js) as blender/scout/helm_bauen.py ›
// guss_2h_einsetzen (mode 'voll') builds them: inner layer of the cap removed above innenAbZ, brim cut where the side plate starts,
// the mouth recess cut into the face plate (bisected along its outline) with a tub measured on the intact surface, shading by
// angle with hard eye rims. Blender axes (Z up, front −Y), H = 1.0.
import params from '../../../blender/scout/helm_params.json' with { type: 'json' };
import { mesh, faceNormal, faceCenter, keepFaces, bisect, raycaster, recalcNormals } from './scoutMesh.js';

export const GUSS_PARTS = ['Kappe', 'Auge_L', 'Auge_R', 'Augenhoehle_L', 'Augenhoehle_R', 'Maske_Gelenk_L', 'Maske_Gelenk_R', 'Krempe'];

// npz arrays of one object → mesh { V, F, S } and its Blender material.
export function gussMesh(npz, name) {
  const v = npz[`${name}__V`].data, L = npz[`${name}__L`].data, I = npz[`${name}__I`].data, S = npz[`${name}__S`].data;
  const V = [], F = [];
  for (let i = 0; i < v.length; i += 3) V.push([v[i], v[i + 1], v[i + 2]]);
  let k = 0;
  for (const n of L) { F.push(Array.from(I.subarray(k, k + n))); k += n; }
  return { ...mesh(V, F, Array.from(S, s => !!s)), material: npz[`${name}__MAT`].data[0] };
}

// helm_bauen.innen_weg: inner (solidify) layer of the cap above zmin, which pierces the outer skin at the temple.
export function innenWeg(m, zmin, C = [0, 0.02, 0.55]) {
  return keepFaces(m, i => {
    const c = faceCenter(m.V, m.F[i]), n = faceNormal(m.V, m.F[i]);
    return !(c[2] > zmin && n[0] * (c[0] - C[0]) + n[1] * (c[1] - C[1]) + n[2] * (c[2] - C[2]) < -0.2);
  });
}

// Brim ends at the corner of the side plate: bisect at y = ky, faces in front removed.
export function krempeKappen(m, ky) {
  const b = bisect(m, [0, ky, 0], [0, 1, 0]);
  return keepFaces(b, i => faceCenter(b.V, b.F[i])[1] >= ky);
}

// helm_bauen.mund_vertiefung: mouth recess (trapezoid, outline in critic units (x, y_c) → z = y_c + z0) in the face plate. Returns
// the cut cap and the tub Mund_Vertiefung (rim measured on the intact surface before cutting, floor `tiefe` behind it).
export function mundVertiefung(kappe, outline, tiefe, z0, zb, ymax = -0.15) {
  const ray = raycaster(kappe);
  const vorn = (x, z) => { const h = ray([x, -2, z], [0, 1, 0]); return h && h[0][1] < ymax ? h[0] : null; };
  const P = outline.map(([x, y]) => [x, 0, y + z0]);
  const Q = [];                                            // clipped at the lower edge (half plane z ≥ zb)
  P.forEach((a, k) => {
    const b = P[(k + 1) % P.length], ia = a[2] >= zb, ib = b[2] >= zb;
    if (ia) Q.push(a);
    if (ia !== ib) { const t = (zb - a[2]) / (b[2] - a[2]); Q.push(a.map((c, j) => c + (b[j] - c) * t)); }
  });
  const R = [];                                            // outline subdivided so the wall follows the surface
  Q.forEach((a, k) => {
    const b = Q[(k + 1) % Q.length], n = Math.max(1, Math.trunc(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) / 0.008));
    for (let j = 0; j < n; j++) R.push(a.map((c, i) => c + (b[i] - c) * j / n));
  });
  const rand = R.map(p => { const h = vorn(p[0], p[2]); return h ? [p[0], h[1], p[2]] : null; });
  rand.forEach((r, i) => {
    if (r) return;
    let j = null;
    for (let k = 1; k < rand.length && !j; k++) j = rand[(i + k) % rand.length];
    rand[i] = [R[i][0], j ? j[1] : -0.32, R[i][2]];
  });
  // split the surface along the outline edges (vertical planes), then delete the faces in front inside it
  let m = kappe;
  Q.forEach((a, k) => { const b = Q[(k + 1) % Q.length], d = [b[0] - a[0], 0, b[2] - a[2]], l = Math.hypot(d[0], d[2]); m = bisect(m, a, [-d[2] / l, 0, d[0] / l]); });
  const convexIn = (poly, p) => {                          // inside a convex outline in x/z, whichever its winding
    const sgn = poly.reduce((s, a, k) => { const b = poly[(k + 1) % poly.length]; return s + (b[0] - a[0]) * (b[2] + a[2]); }, 0) < 0 ? 1 : -1;
    return poly.every((a, k) => { const b = poly[(k + 1) % poly.length]; return sgn * ((b[0] - a[0]) * (p[2] - a[2]) - (b[2] - a[2]) * (p[0] - a[0])) >= -1e-6; });
  };
  const cut = keepFaces(m, i => {
    const c = faceCenter(m.V, m.F[i]);
    return !(c[1] < ymax && (convexIn(Q, c) || (c[2] < zb && convexIn(P, c))));
  });
  const n = rand.length, boden = rand.map(p => [p[0], p[1] + tiefe, p[2]]);
  const F = rand.map((_, i) => [i, (i + 1) % n, n + (i + 1) % n, n + i]);
  F.push(Array.from({ length: n }, (_, i) => 2 * n - 1 - i));
  return { kappe: cut, tub: recalcNormals(mesh([...rand, ...boden], F)) };
}

// Faces of the cap within the eye socket boxes (plus margin): hard-edged (Marker 6, augenKantig).
export function flatNearEyes(kappe, sockets, margin) {
  const boxes = sockets.map(s => {
    const lo = [0, 1, 2].map(a => Math.min(...s.V.map(v => v[a])) - margin), hi = [0, 1, 2].map(a => Math.max(...s.V.map(v => v[a])) + margin);
    return [lo, hi];
  });
  const S = kappe.F.map((f, i) => {
    const c = faceCenter(kappe.V, f);
    return kappe.S[i] && !boxes.some(([lo, hi]) => c.every((x, a) => x >= lo[a] && x <= hi[a]));
  });
  return { ...kappe, S };
}

// The cast parts after guss_2h_einsetzen ('voll'): { name: mesh with material and crease angle }.
export function gussParts(npz) {
  const g = params.guss2h, mo = params.mouth;
  const parts = Object.fromEntries(GUSS_PARTS.map(n => [n, gussMesh(npz, n)]));
  let kappe = innenWeg(parts.Kappe, g.innenAbZ ?? 0.66);
  parts.Krempe = { ...krempeKappen(parts.Krempe, g.krempeVornY), material: parts.Krempe.material };
  const { kappe: cut, tub } = mundVertiefung(kappe, mo.outline, mo.depth, params.achsen.z0, g.mundUntenZ);
  kappe = { ...cut, S: cut.F.map(() => true) };            // shade_smooth_by_angle(30°): every face smooth, edges by angle
  const out = {};
  for (const [n, m] of Object.entries(parts)) out[n] = { ...m, angle: 180 };
  for (const n of ['Krempe', 'Maske_Gelenk_L', 'Maske_Gelenk_R']) out[n] = { ...out[n], S: out[n].F.map(() => true), angle: 30 };
  for (const n of ['Augenhoehle_L', 'Augenhoehle_R']) out[n] = { ...out[n], S: out[n].F.map(() => !g.augenKantig) };
  out.Kappe = { ...(g.augenKantig ? flatNearEyes(kappe, [parts.Augenhoehle_L, parts.Augenhoehle_R], g.augenRand ?? 0.012) : kappe), material: parts.Kappe.material, angle: 30 };
  out.Mund_Vertiefung = { ...tub, material: 'MAT_Dunkel', angle: 180 };
  return out;
}
