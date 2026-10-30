// three.js generator of Scout v3 (0.17 "Outrider"): replaces blender/scout (run.py › bauen_lauf6b, export_scout.py) for the 44
// exported meshes S01–S13 and builds the same scene as assets/helmet-scout/assembled/scout.glb – meshes named by their Blender
// object with extras part_id, part_label, side, source_object, the flat glTF materials of the delivery package
// (scoutMaterials.json), glTF axes (Y up, front +Z, H = 1.0). Ported step by step:
//   S01–S05  cast of run 2h (guss_2h.npz) and mouth recess – scoutGuss.js (helm_bauen.guss_2h_einsetzen)
//   S06–S09  lower helmet from the head volume by exact booleans – helm_csg.unterhelm (critic axes, then M_ACHSEN)
//   S10      ear modules – helm_csg.ohrmodule_neu;  S11 antennas – helm_build8.ohrmodule, moved by ohrmodule_neu
//   S12      back module – helm_csg.rueckmodul_neu;  S13 coiled cables – helm_build8.schlauch, helm_build3.catmull/kabel_spirale
// Parts that bauen_lauf6b builds and removes again (mask, cheek plates, visor glow, run-3 modules) are not ported.
import * as THREE from 'three';
import P from '../../../blender/scout/helm_params.json' with { type: 'json' };
import MATS from './scoutMaterials.json' with { type: 'json' };
import { mesh, join, transformed, recalcNormals, csg, moveSolid, finish, raycaster, shaded } from './scoutMesh.js';
import { gussParts } from './scoutGuss.js';
import { indexGeometry } from './mesh.js';
import { boxBevel } from './bevel.js';

const { y0: Y0, z0: Z0 } = P.achsen;
const DEG = Math.PI / 180;
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = a => Math.hypot(a[0], a[1], a[2]);
const unit = a => mul(a, 1 / (len(a) || 1));
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// mathutils Vector.orthogonal (BLI ortho_v3_v3) and rotation_difference (rotation_between_vecs_to_quat) as matrices.
export function orthogonal(v) {
  const x = Math.abs(v[0]), y = Math.abs(v[1]), z = Math.abs(v[2]);
  const axis = x > y ? (x > z ? 0 : 2) : (y > z ? 1 : 2);
  return [[-v[1] - v[2], v[0], v[0]], [v[1], -v[0] - v[2], v[1]], [v[2], v[2], -v[0] - v[1]]][axis];
}
export function rotationBetween(a, b) {
  a = unit(a); b = unit(b);
  let ax = cross(a, b);
  const q = new THREE.Quaternion();
  if (len(ax) > 1.1920929e-7) q.setFromAxisAngle(new THREE.Vector3(...unit(ax)), Math.acos(Math.max(-1, Math.min(1, dot(a, b)))));
  else if (dot(a, b) <= 0) q.setFromAxisAngle(new THREE.Vector3(...unit(orthogonal(a))), Math.PI);
  return new THREE.Matrix4().makeRotationFromQuaternion(q);
}
const apply = (M, v) => new THREE.Vector3(...v).applyMatrix4(M).toArray();

// ---------------------------------------------------------------- profiles and head volume (helm_volumen.py)
const ss = (e0, e1, x) => { const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

// Centripetal Catmull-Rom through 2D points (helm_volumen.catmull).
function catmull2(pts, n = 200) {
  let Q = pts.map(([a, y]) => [a, y]);
  Q = [[2 * Q[0][0] - Q[1][0], 2 * Q[0][1] - Q[1][1]], ...Q, [2 * Q.at(-1)[0] - Q.at(-2)[0], 2 * Q.at(-1)[1] - Q.at(-2)[1]]];
  const out = [], seg = Q.length - 3, per = Math.max(2, Math.floor(n / seg));
  const d = (a, b) => Math.max(Math.hypot(b[0] - a[0], b[1] - a[1]), 1e-9) ** 0.5;
  const mix = (p, q, wp, wq) => [p[0] * wp + q[0] * wq, p[1] * wp + q[1] * wq];
  for (let i = 1; i < Q.length - 2; i++) {
    const [p0, p1, p2, p3] = [Q[i - 1], Q[i], Q[i + 1], Q[i + 2]];
    const t0 = 0, t1 = t0 + d(p0, p1), t2 = t1 + d(p1, p2), t3 = t2 + d(p2, p3);
    for (let k = 0; k < per; k++) {
      const t = t1 + (t2 - t1) * k / per;
      const a1 = mix(p0, p1, (t1 - t) / (t1 - t0), (t - t0) / (t1 - t0)), a2 = mix(p1, p2, (t2 - t) / (t2 - t1), (t - t1) / (t2 - t1));
      const a3 = mix(p2, p3, (t3 - t) / (t3 - t2), (t - t2) / (t3 - t2));
      const b1 = mix(a1, a2, (t2 - t) / (t2 - t0), (t - t0) / (t2 - t0)), b2 = mix(a2, a3, (t3 - t) / (t3 - t1), (t - t1) / (t3 - t1));
      out.push(mix(b1, b2, (t2 - t) / (t2 - t1), (t - t1) / (t2 - t1)));
    }
  }
  out.push(Q.at(-2));
  return out;
}

function profileFn(pts) {
  const s = catmull2(pts).map(p => [p[0], p[1]]).sort((a, b) => a[1] - b[1]);
  return y => {
    if (y <= s[0][1]) return s[0][0];
    if (y >= s.at(-1)[1]) return s.at(-1)[0];
    let lo = 0, hi = s.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s[m][1] < y) lo = m; else hi = m; }
    const [a0, y0] = s[lo], [a1, y1] = s[hi];
    return a0 + (a1 - a0) * (y - y0) / Math.max(y1 - y0, 1e-9);
  };
}

function outline(half, n = 64) {
  const full = [...half, ...half.slice(1, -1).reverse().map(([u, v]) => [-u, v])];
  const pts = catmull2([...full, full[0]], n * 4).slice(0, -1), d = [0];
  pts.forEach((a, i) => { const b = pts[(i + 1) % pts.length]; d.push(d.at(-1) + Math.hypot(b[0] - a[0], b[1] - a[1])); });
  const out = [];
  for (let i = 0, j = 0; i < n; i++) {
    const s = d.at(-1) * i / n;
    while (d[j + 1] < s) j++;
    const t = (s - d[j]) / Math.max(d[j + 1] - d[j], 1e-9), a = pts[j], b = pts[(j + 1) % pts.length];
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return out;
}

// Head volume (helm_csg.volumen, critic axes +Y up, +Z front), without the crown dome (crownDomeAn false in D29).
export function volumen(inflate = 1.0, rows = 72, n = 64) {
  if (P.crownDomeAn) throw new Error('scout: crown dome not ported (crownDomeAn is false in D29)');
  const pr = P.profil, w = profileFn(pr.front), zf = profileFn(pr.sideFront), zb = profileFn(pr.sideBack), ring = outline(pr.topHalf, n);
  const yTop = Math.min(pr.front[0][1], pr.sideFront[0][1], pr.sideBack[0][1]);
  const yBot = Math.max(pr.front.at(-1)[1], pr.sideFront.at(-1)[1], pr.sideBack.at(-1)[1]);
  const R = P.crownRounding, V = [], F = [];
  for (let j = 0; j <= rows; j++) {
    const y = yBot + (yTop - yBot) * Math.sin(j / rows * Math.PI / 2), hw = Math.max(w(y), 1e-4), f = zf(y), b = zb(y);
    const rnd = R.strength * ss(R.startY, R.endY, y);
    for (const p of ring) {
      const Lp = Math.max(Math.hypot(p[0], p[1]), 1e-9), ru = p[0] + (p[0] / Lp - p[0]) * rnd, rv = p[1] + (p[1] / Lp - p[1]) * rnd;
      V.push([ru * hw, y, b + (rv + 1) / 2 * (f - b)]);
    }
  }
  for (let j = 0; j < rows; j++) for (let i = 0; i < n; i++) F.push([j * n + i, j * n + (i + 1) % n, (j + 1) * n + (i + 1) % n, (j + 1) * n + i]);
  const mean = rows0 => mul(rows0.reduce((s, v) => add(s, v), [0, 0, 0]), 1 / n);
  const cb = V.length; V.push(mean(V.slice(0, n)));
  const ct = V.length; V.push(mean(V.slice(rows * n, rows * n + n)));
  for (let i = 0; i < n; i++) { F.push([cb, (i + 1) % n, i]); F.push([ct, rows * n + i, rows * n + (i + 1) % n]); }
  const c = [0, 0.1, 0];
  return recalcNormals(mesh(V.map(v => add(c, mul(sub(v, c), inflate))), F));
}

// ---------------------------------------------------------------- primitives (helm_csg.py, helm_build.py, helm_lib.py)
export function prisma(pts, ebene, tiefe = 4.0, pos = [0, 0, 0]) {
  const n = pts.length, V = [];
  for (const d of [-tiefe / 2, tiefe / 2]) for (const [a, b] of pts) V.push(add(ebene === 'xy' ? [a, b, d] : ebene === 'zy' ? [d, b, a] : [a, d, b], pos));
  const F = [[...Array(n).keys()], Array.from({ length: n }, (_, i) => 2 * n - 1 - i), ...Array.from({ length: n }, (_, i) => [i, (i + 1) % n, n + (i + 1) % n, n + i])];
  return recalcNormals(mesh(V, F));
}
const BOX_F = [[0, 1, 3, 2], [4, 6, 7, 5], [0, 4, 5, 1], [2, 3, 7, 6], [0, 2, 6, 4], [1, 5, 7, 3]];
export function halbraum(p, nrm, S = 4.0) {
  const n = unit(nrm), t = unit(orthogonal(n)), b = cross(n, t), c = sub(p, mul(n, S)), V = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) V.push(add(add(add(c, mul(n, sx * S)), mul(t, sy * S)), mul(b, sz * S)));
  return recalcNormals(mesh(V, BOX_F));
}
export function quader(gr, pos = [0, 0, 0]) {
  const V = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) V.push(add(pos, [sx * gr[0] / 2, sy * gr[1] / 2, sz * gr[2] / 2]));
  return recalcNormals(mesh(V, BOX_F));
}
export function ellzylinder(rx, rz, y0, y1, cz, seg = 96, topScale = 1.0) {
  const V = [];
  for (const [y, s] of [[y0, 1.0], [y1, topScale]]) for (let i = 0; i < seg; i++) { const a = 2 * Math.PI * i / seg; V.push([rx * s * Math.cos(a), y, cz + rz * s * Math.sin(a)]); }
  const F = [Array.from({ length: seg }, (_, i) => seg - 1 - i), Array.from({ length: seg }, (_, i) => seg + i),
    ...Array.from({ length: seg }, (_, i) => [i, (i + 1) % seg, seg + (i + 1) % seg, seg + i])];
  return recalcNormals(mesh(V, F));
}
// helm_build.cyl: cylinder along +Z from 0 to h, optional dome (cone tip) instead of the top face.
export function cyl(r, h, n = 24, dome = 0) {
  const V = [], F = [];
  for (const z of [0, h]) for (let i = 0; i < n; i++) { const a = 2 * Math.PI * i / n; V.push([r * Math.cos(a), r * Math.sin(a), z]); }
  for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n + (i + 1) % n, n + i]);
  F.push(Array.from({ length: n }, (_, i) => n - 1 - i));
  if (dome > 0) { const c = V.length; V.push([0, 0, h + dome]); for (let i = 0; i < n; i++) F.push([n + i, n + (i + 1) % n, c]); }
  else F.push(Array.from({ length: n }, (_, i) => n + i));
  return mesh(V, F);
}
export const stack = parts => join(...parts.map(([m, z0]) => transformed(m, ([x, y, z]) => [x, y, z + z0])));
// helm_build.place: local +Z turned onto axis (rotation_difference), moved to loc; all faces smooth.
export function place(m, loc, axis) {
  const R = rotationBetween([0, 0, 1], axis);
  const out = transformed(m, v => add(apply(R, v), loc));
  return { ...out, S: out.F.map(() => true) };
}
// helm_lib.surface_box: box on a surface, w along (up × normal), h along up, from −d_in to +d_out along the normal.
export function surfaceBox(center, normal, up, w, h, dIn, dOut) {
  const n = unit(normal), u0 = up, u = unit(sub(u0, mul(n, dot(u0, n)))), r = unit(cross(u, n)), V = [];
  for (const d of [-dIn, dOut]) for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) V.push(add(add(add(center, mul(n, d)), mul(r, sx * w / 2)), mul(u, sz * h / 2)));
  return mesh(V, [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]);
}
const smooth = m => ({ ...m, S: m.F.map(() => true) });
// bmesh remove_doubles: coincident corners merged, collapsed corners dropped from faces.
function removeDoubles(m, dist = 1e-5) {
  const idx = [], V = [];
  m.V.forEach(v => { let j = V.findIndex(w => Math.hypot(w[0] - v[0], w[1] - v[1], w[2] - v[2]) <= dist); if (j < 0) { j = V.length; V.push(v); } idx.push(j); });
  const F = [], S = [];
  m.F.forEach((f, i) => {
    const g = f.map(k => idx[k]).filter((k, j, a) => k !== a[(j + 1) % a.length]);
    if (new Set(g).size >= 3) { F.push(g); S.push(m.S[i]); }
  });
  return { V, F, S };
}
// ---------------------------------------------------------------- S06–S09 lower helmet (helm_csg.unterhelm, critic axes)
export function unterhelm() {
  const c = P.core, k = P.collar, E = P.lowerArmorEdges, J = P.jaw ?? {};
  let core = ellzylinder(c.rx, c.rz, c.y0, c.y1, c.cz, E.radialSegments, c.topScale ?? 1.0);
  const fz = c.frontZ ?? 0.15, ft = c.frontZTop ?? fz, fk = c.frontKnickY ?? 0.15;
  if (c.frontKurve) throw new Error('scout: core.frontKurve not ported (absent in D29)');
  core = csg(core, [['I', prisma([[-1, -1], [fz, -1], [fz, fk], [ft, c.frontTopY ?? 0.2], [ft, 1], [-1, 1]], 'zy')]]);
  for (const x of [-0.17, 0.17]) core = csg(core, [['D', quader([0.006, 0.6, 0.2], [x, 0.1, -0.5])]]);
  core = csg(core, [['D', quader([0.2, 0.6, 0.006], [-0.42, 0.1, -0.2])], ['D', quader([0.2, 0.6, 0.006], [0.42, 0.1, -0.3])]]);
  core = csg(core, [['I', volumen(c.inflate ?? 0.985)]]);
  // collar: ring with chamfered top, open at the front, dip at the back, tilted forward
  const bs = k.bottomScale ?? 1.0, CF = P.collarFront;
  let ring = ellzylinder(k.rx * bs, k.rz * bs, k.y0, k.y1 - E.chamferHeight + 0.001, k.cz, E.radialSegments, 1 / bs);
  const top = ellzylinder(k.rx, k.rz, k.y1 - E.chamferHeight, k.y1, k.cz, E.radialSegments, E.topScale);
  ring = csg(ring, [['U', top], ['D', ellzylinder(k.rx * 0.86, k.rz * 0.86, k.y0 - 0.1, k.y1 + 0.1, k.cz, E.radialSegments)],
    ['D', prisma([[CF.topZ, k.y1], [CF.topZ, k.y1 + 0.2], [1, k.y1 + 0.2], [1, k.y0 - 0.2], [CF.bottomZ, k.y0 - 0.2], [CF.bottomZ, k.y0]], 'zy')]]);
  ring = csg(ring, [['D', prisma(k.dip.map(([x, dy]) => [x, k.y1 + dy]), 'xy', 1.0, [0, 0, -0.75])]]);
  const ct = Math.cos(k.tilt), st = Math.sin(k.tilt);
  ring = moveSolid(ring, ([x, y, z]) => [x, y * ct - z * st, y * st + z * ct]);
  if (!P.neckRing.aus) throw new Error('scout: neck ring not ported (off in D29)');
  // jaw: cut from front, side and top silhouettes
  const t = J.top ?? k.y1;
  const fh = (J.frontHalb ?? []).map(([x, y]) => [x, y === 'top' ? t : y]);
  const fr = prisma([...fh.map(([x, y]) => [-x, y]), ...fh.slice().reverse()], 'xy');
  const sd = prisma([...J.side_top, ...J.front_bar, J.hintenUnten ?? [-0.08, -0.3]], 'zy');
  const tp = prisma([[-0.4, -0.12], [-0.4, 0.12], [-0.33, 0.24], [-0.2, 0.4], [-0.1, 0.475], [0.1, 0.475], [0.2, 0.4], [0.33, 0.24], [0.4, 0.12], [0.4, -0.12]], 'xz');
  let jaw = csg(fr, [['I', sd], ['I', tp]]);
  if (J.seitenNuten ?? true) throw new Error('scout: jaw side grooves not ported (off in D29)');
  for (const s of [-1, 1]) jaw = csg(jaw, [['D', quader([0.006, 0.2, 0.3], [s * 0.175, -0.44, 0.4])]]);
  if (J.kerbe ?? true) jaw = csg(jaw, [['D', prisma(J.kerbeUmriss, 'xy', 1.0, [0, 0, (J.kerbeZ ?? 0.3) + 0.5])]]);
  if (J.lift) {
    jaw = moveSolid(jaw, ([x, y, z]) => [x, y + J.lift, z - (J.zurueck ?? 0)]);
    if (J.liftSchnitt) jaw = csg(jaw, [['I', halbraum([0, t, 0], [0, 1, 0])]]);
  }
  const kinn = csg(jaw, [['I', halbraum([0.172, 0, 0], [1, 0, 0])], ['I', halbraum([-0.172, 0, 0], [-1, 0, 0])]]);
  const kl = csg(jaw, [['I', halbraum([0.178, 0, 0], [-1, 0, 0])]]);
  const kr = csg(jaw, [['I', halbraum([-0.178, 0, 0], [1, 0, 0])]]);
  // helm_csg.uebernehmen: into our axes, smooth with sharp edges above 30°
  const ours = g => smooth(transformed(finish(g), ([x, y, z]) => [x, Y0 - z, y + Z0]));
  return { Kern: ours(core), Kragen: ours(ring), Kinnblock: ours(kinn), Kiefer_L: ours(kl), Kiefer_R: ours(kr) };
}

// ---------------------------------------------------------------- S10/S11 ear modules and antennas (our axes)
function ohrmodule(kern) {
  const e = P.earR, py = Y0 - e.cz, pz = e.cy + Z0, hit = raycaster(kern), out = {};
  const a = e.d / 2, b = e.w / 2, c = e.h / 2, N = 40, R = 16, exV = e.exV ?? 3.0, eh = 2 / (e.exH ?? 3.5);
  let ohrX = e.outerX;
  for (const [side, sx] of [['R', 1], ['L', -1]]) {
    let x0 = e.outerX - e.d / 2;
    if ('abstand' in e) { const h = hit([sx * 2, py, pz], [-sx, 0, 0]); if (h) x0 = Math.abs(h[0][0]) + e.abstand + a; }
    const xs = x0 - a - (e.abstand ?? 0);
    ohrX = x0 + a;
    const V = [], F = [];
    for (let j = 0; j <= R; j++) {
      const t = -1 + 2 * j / R, s = (1 - Math.abs(t) ** exV) ** (1 / exV);
      for (let i = 0; i < N; i++) {
        const th = 2 * Math.PI * i / N, cs = Math.cos(th), sn = Math.sin(th);
        V.push([sx * (x0 + a * s * Math.sign(cs) * Math.abs(cs) ** eh), py + b * s * Math.sign(sn) * Math.abs(sn) ** eh, pz + c * t]);
      }
    }
    for (let j = 0; j < R; j++) for (let i = 0; i < N; i++) {
      const f = [j * N + i, j * N + (i + 1) % N, (j + 1) * N + (i + 1) % N, (j + 1) * N + i];
      F.push(sx > 0 ? f : f.reverse());
    }
    out[`Ohrmodul_${side}`] = { ...smooth(recalcNormals(removeDoubles(mesh(V, F)))), material: 'MAT_Modul' };
    const aus = [sx * (x0 + a), py, pz];
    out[`Ohrmodul_Ring_${side}`] = { ...place(stack([[cyl(0.045, 0.008, 40), -0.004], [cyl(0.03, 0.006, 40), 0.004]]), add(aus, [0, -0.01, 0.04]), [sx, 0, 0]), material: 'MAT_Dunkel' };
    out[`Ohrmodul_Kappe_${side}`] = { ...place(cyl(0.018, 0.008, 32, 0.004), add(aus, [0, 0.03, -0.08]), [sx, 0, 0]), material: 'MAT_Dunkel' };
    out[`Ohrmodul_Halter_${side}`] = { ...smooth(recalcNormals(surfaceBox([sx * (x0 - a + 0.005), py, pz + c * 0.8], [sx, 0, 0], [0, 0, 1], 0.05, 0.08, 0.02, 0.02))), material: 'MAT_Dunkel' };
    const bg = e.buegel;
    if (bg) {
      const z0 = pz + c * 0.85, z1 = P.capEdgeY + Z0 + 0.02;
      out[`Ohrmodul_Buegel_${side}`] = { ...smooth(recalcNormals(surfaceBox([sx * (xs + 0.003), py + (bg.dy ?? 0), (z0 + z1) / 2], [sx, 0, 0], [0, 0, 1], bg.w, z1 - z0, 0.004, bg.t))), material: 'MAT_Dunkel' };
    }
  }
  // antennas of helm_build8.ohrmodule (left long, right stub), moved by ohrmodule_neu next to the ear modules
  const loc = sx => [sx * (ohrX - 0.02), py, pz + e.h / 2 - 0.02];
  const ry = -4 * DEG, rot = ([x, y, z]) => [x * Math.cos(ry) + z * Math.sin(ry), y, -x * Math.sin(ry) + z * Math.cos(ry)];
  const antL = stack([[cyl(0.012, 0.03, 16), 0.0], [cyl(0.008, 0.10, 16), 0.03], [cyl(0.0055, 0.36, 12), 0.13]]);
  out.Antenne_L = { ...smooth(transformed(antL, v => add(rot(v), loc(-1)))), material: 'MAT_Dunkel', angle: 34 };
  const antR = stack([[cyl(0.018, 0.02, 20), 0.0], [cyl(0.014, 0.16, 20), 0.02], [cyl(0.016, 0.012, 20), 0.18]]);
  out.Antenne_Stummel_R = { ...smooth(transformed(antR, v => add(v, loc(1)))), material: 'MAT_Dunkel', angle: 34 };
  return { parts: out, ohr: [py, pz] };
}

// ---------------------------------------------------------------- S12 back module (helm_csg.rueckmodul_neu)
function rueckmodul(kern) {
  const bb = P.backBox, Z = bb.cy + Z0, h = raycaster(kern)([bb.x, 2, Z], [0, -1, 0]);
  const S = h ? h[0] : [bb.x, 0.45, Z], n = [0, 1, 0], up = [0, 0, 1], r = [-1, 0, 0], W = bb.w, Hh = bb.h, out = {};
  out.Rueckmodul_Platte = { ...recalcNormals(surfaceBox(S, n, up, W + 0.03, Hh + 0.03, 0.03, 0.012)), material: 'MAT_Dunkel' };
  // box with Blender's bevel modifier (0.005, two segments) as a rounded box; the recessed field is cut afterwards and keeps
  // sharp edges (Blender bevels those too)
  const bx = boxBevel([W, Hh, bb.d], 0.005), c0 = add(S, mul(n, 0.012 + bb.d / 2));
  let box = mesh(bx.V.map(([x, y, z]) => add(add(add(c0, mul(r, -x)), mul(up, y)), mul(n, z))), bx.F);
  box = recalcNormals(box);
  const rw = W * 0.31, rh = Hh * 0.28, ch = 0.022;
  const feld = [[-rw + ch, rh], [rw - ch, rh], [rw, rh - ch], [rw, -rh + ch], [rw - ch, -rh], [-rw + ch, -rh], [-rw, -rh + ch], [-rw, rh - ch]];
  const fv = add(S, mul(n, 0.012 + bb.d)), V = [];
  for (const d of [-0.012, 0.05]) for (const [x, y] of feld) V.push(add(add(add(fv, mul(n, d)), mul(r, x)), mul(up, y)));
  const k = feld.length;
  const cut = recalcNormals(mesh(V, [Array.from({ length: k }, (_, i) => k - 1 - i), Array.from({ length: k }, (_, i) => k + i),
    ...Array.from({ length: k }, (_, i) => [i, (i + 1) % k, k + (i + 1) % k, k + i])]));
  out.Rueckmodul = { ...finish(csg(box, [['D', cut]])), material: 'MAT_Modul', flat: true };
  const boden = sub(fv, mul(n, 0.012));
  out.Rueckmodul_Hebel = { ...place(cyl(0.014, 0.008, 24), boden, [0, 1, 0]), material: 'MAT_Metall' };
  const dir = add(mul(r, Math.sin(0.5)), mul(up, Math.cos(0.5)));
  out.Rueckmodul_Hebel_Arm = { ...recalcNormals(surfaceBox(add(add(boden, mul(n, 0.012)), mul(dir, 0.03)), n, dir, 0.012, 0.07, 0.0, 0.006)), material: 'MAT_Metall' };
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy], i) => {
    const p = add(add(fv, mul(r, sx * (W / 2 - 0.025))), mul(up, sy * (Hh / 2 - 0.025)));
    out[`Rueckmodul_Schraube_${i}`] = { ...place(cyl(0.009, 0.006, 16, 0.003), p, [0, 1, 0]), material: 'MAT_Metall' };
  });
  return { parts: out, box: [[bb.x, S[1], Z], S[1] + 0.012 + bb.d] };
}

// ---------------------------------------------------------------- S13 coiled cables (helm_build8.schlauch, helm_build3)
// Uniform Catmull-Rom through 3D points, resampled to n + 1 points at equal arc length (helm_build3.catmull).
export function catmull3(ctrl, n = 400) {
  const Q = [ctrl[0], ...ctrl, ctrl.at(-1)], pts = [];
  for (let i = 1; i < Q.length - 2; i++) {
    const [p0, p1, p2, p3] = [Q[i - 1], Q[i], Q[i + 1], Q[i + 2]];
    for (let k = 0; k < 20; k++) {
      const t = k / 20;
      pts.push([0, 1, 2].map(a => 0.5 * (2 * p1[a] + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t * t + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t ** 3)));
    }
  }
  pts.push(Q.at(-2));
  const d = [0];
  for (let i = 1; i < pts.length; i++) d.push(d.at(-1) + len(sub(pts[i], pts[i - 1])));
  const out = [];
  for (let i = 0, j = 0; i <= n; i++) {
    const s = d.at(-1) * i / n;
    while (j < d.length - 2 && d[j + 1] < s) j++;
    out.push(lerp(pts[j], pts[j + 1], (s - d[j]) / Math.max(d[j + 1] - d[j], 1e-9)));
  }
  return { pts: out, length: d.at(-1) };
}

// Blender curve with round bevel (depth r, bevel_resolution 3 → 10 profile points), caps filled; minimum-twist frames.
function bevelCurve(path, r, ring = 10) {
  const n = path.length, V = [], F = [];
  const T = path.map((_, i) => unit(sub(path[Math.min(i + 1, n - 1)], path[Math.max(i - 1, 0)])));
  let N = unit(orthogonal(T[0]));
  path.forEach((p, i) => {
    if (i) N = unit(sub(N, mul(T[i], dot(N, T[i]))));
    const B = cross(T[i], N);
    for (let k = 0; k < ring; k++) { const a = 2 * Math.PI * k / ring; V.push(add(p, add(mul(N, r * Math.cos(a)), mul(B, r * Math.sin(a))))); }
  });
  for (let i = 0; i < n - 1; i++) for (let k = 0; k < ring; k++) F.push([i * ring + k, i * ring + (k + 1) % ring, (i + 1) * ring + (k + 1) % ring, (i + 1) * ring + k]);
  F.push(Array.from({ length: ring }, (_, k) => ring - 1 - k), Array.from({ length: ring }, (_, k) => (n - 1) * ring + k));
  return smooth(recalcNormals(mesh(V, F)));
}

function schlauch(ohr, box) {
  const [PY, PZ] = ohr, [c, yb] = box, out = {}, metal = 'MAT_Metall';
  for (const [side, sx] of [['R', 1], ['L', -1]]) {
    const s0 = [sx * 0.44, PY + 0.02, PZ - 0.13];
    out[`Schlauch_Stecker_${side}`] = { ...place(stack([[cyl(0.014, 0.03, 24), 0.0], [cyl(0.010, 0.02, 16), 0.03]]), add(s0, [0, 0, 0.03]), [0, 0, -1]), material: metal };
    const start = sub(s0, [0, 0, 0.02]), e = [sx * 0.19, yb - 0.06, c[2] - 0.03];
    out[`Schlauch_Anschluss_${side}`] = { ...place(stack([[cyl(0.02, 0.03, 24), 0.0], [cyl(0.022, 0.01, 6), 0.01]]), e, [sx, 0, 0]), material: metal };
    const end = add(e, [sx * 0.03, 0, 0]);
    const ctrl = [start, add(start, [0, 0.01, -0.04]), [sx * 0.43, 0.16, 0.40], [sx * 0.41, 0.34, 0.44], [sx * 0.33, 0.50, 0.52],
      [sx * 0.25, 0.57, 0.58], add(end, [sx * 0.04, 0, 0]), end];
    const { pts, length } = catmull3(ctrl), n = pts.length - 1, ds = length / n;
    // helm_build3.kabel_spirale: helix of radius 0.022 and pitch 0.018 around the path, fading in and out at the ends
    const T = pts.map((_, i) => unit(sub(pts[Math.min(i + 1, n)], pts[Math.max(i - 1, 0)])));
    let Nv = unit(orthogonal(T[0]));
    const fr = [];
    pts.forEach((_, i) => { if (i) Nv = unit(sub(Nv, mul(T[i], dot(Nv, T[i])))); fr.push([T[i], Nv, cross(T[i], Nv)]); });
    const R_ = 0.022, pitch = 0.018, sa = 0.07, sb = 0.08, steps = Math.trunc(length / (pitch / 14)), coil = [];
    for (let k = 0; k <= steps; k++) {
      const s = length * k / steps, f = s / ds, i = Math.min(Math.trunc(f), n - 1), t = f - i;
      const p = lerp(pts[i], pts[i + 1], t), [, Nn, Bb] = fr[i];
      const rr = R_ * Math.max(0, Math.min(1, (s - sa) / pitch, (length - sb - s) / pitch)), th = 2 * Math.PI * (s - sa) / pitch;
      coil.push(add(p, mul(add(mul(Nn, Math.cos(th)), mul(Bb, Math.sin(th))), rr)));
    }
    out[`Kabel_${side}`] = { ...bevelCurve(coil, 0.006), material: 'MAT_Kabel' };
    [0.07 - 0.012, length - 0.08 - 0.012].forEach((s, k) => {
      const i = Math.trunc(s / length * n);
      out[`Kabel_Huelse_${side}${k}`] = { ...place(cyl(0.012, 0.024, 20), pts[i], fr[i][0]), material: 'MAT_Kabel_Huelse' };
    });
  }
  return out;
}

// ---------------------------------------------------------------- parts S01–S13 (helm_explosion.TEILE) and the scene
// ID, name, object prefixes, explosion offset (Blender axes), sided (one label per side, x mirrored; side from the position)
export const TEILE = [
  ['S01', 'Haube (Guss)', ['Kappe'], [0, 0, 0.30], false],
  ['S02', 'Augen', ['Auge_', 'Augenhoehle_'], [0, -0.10, 0.30], false],
  ['S03', 'Gelenkscheibe', ['Maske_Gelenk_'], [0.10, 0, 0.30], true],
  ['S04', 'Krempe', ['Krempe'], [0, 0, 0.16], false],
  ['S05', 'Mundvertiefung', ['Mund_Vertiefung'], [0, -0.32, 0.04], false],
  ['S06', 'Kinnblock', ['Kinnblock'], [0, -0.34, -0.14], false],
  ['S07', 'Kieferstück', ['Kiefer_'], [0.28, -0.12, -0.14], true],
  ['S08', 'Seitenschale (Kern)', ['Kern'], [0, 0, 0], false],
  ['S09', 'Kragen', ['Kragen'], [0, 0.05, -0.30], false],
  ['S10', 'Funkmuschel', ['Ohrmodul_'], [0.34, 0, 0], true],
  ['S11', 'Antenne', ['Antenne_'], [0.34, 0, 0.10], true],
  ['S12', 'Rückmodul', ['Rueckmodul'], [0, 0.40, 0], false],
  ['S13', 'Spiralkabel', ['Kabel_', 'Schlauch_'], [0.20, 0.22, -0.05], true],
];

// Parts cut by BSP booleans or measured by ray casts: their corners may differ in the last bits in another JavaScript engine,
// so their skin atlas entries keep baked positions (skin_bake.mjs, skinAtlas.js › transferGeometry).
export const BSP_PARTS = ['Kern', 'Kragen', 'Kinnblock', 'Kiefer_L', 'Kiefer_R', 'Rueckmodul', 'Mund_Vertiefung'];

// All 44 parts in Blender axes: { name: { V, F, S, material (Blender name), angle (sharp edges, degrees) } }.
export function scoutParts(guss) {
  const parts = { ...gussParts(guss) };
  const unten = unterhelm();
  for (const [n, m] of Object.entries(unten)) parts[n] = { ...m, material: 'MAT_Weiss', angle: 30 };
  const ear = ohrmodule(unten.Kern), back = rueckmodul(unten.Kern);
  Object.assign(parts, ear.parts, back.parts, schlauch(ear.ohr, back.box));
  for (const m of Object.values(parts)) if (m.flat) m.S = m.F.map(() => false);
  return parts;
}

// Groups like helm_explosion._gruppen: [{ id, label, side, objects, offset }] in TEILE order, objects sorted by name.
export function partGroups(parts) {
  const xsum = m => { const lo = [0, 1, 2].map(a => Math.min(...m.V.map(v => v[a]))), hi = [0, 1, 2].map(a => Math.max(...m.V.map(v => v[a]))); return lo[0] + hi[0]; };
  const out = [];
  for (const [id, name, pre, off, seitig] of TEILE) {
    const objs = Object.keys(parts).filter(n => pre.some(p => n.startsWith(p))).sort();
    if (!objs.length) continue;
    if (seitig) {
      for (const [s, sx] of [['R', 1], ['L', -1]]) {
        const g = objs.filter(n => (xsum(parts[n]) > 0) === (s === 'R'));
        if (g.length) out.push({ id, label: `${id} ${name} ${s}`, side: s, objects: g, offset: [off[0] * sx, off[1], off[2]] });
      }
    } else out.push({ id, label: `${id} ${name}`, side: '', objects: objs, offset: off });
  }
  return out;
}

// MeshStandardMaterial as GLTFLoader builds it from the GLB's material (scoutMaterials.json).
export function scoutMaterial(name) {
  const r = MATS[name];
  if (!r) throw new Error(`scout: no material ${name}`);
  const m = new THREE.MeshStandardMaterial({ name, roughness: r.roughness, metalness: r.metalness, side: THREE.DoubleSide });
  m.color.setRGB(...r.color, THREE.LinearSRGBColorSpace);
  if (r.emissive) { m.emissive.setRGB(...r.emissive, THREE.LinearSRGBColorSpace); m.emissiveIntensity = r.emissiveIntensity ?? 1; }
  return m;
}

// Blender → glTF: (x, y, z) → (x, z, −y)
const TO_GLTF = new THREE.Matrix4().makeRotationX(-Math.PI / 2);

// Scout as a scene like the GLB: { scene, groups }. guss: arrays of guss_2h.npz (npz.js › readNpz).
export function buildScout(guss, { parts = null } = {}) {
  parts ??= scoutParts(guss);
  const groups = partGroups(parts), materials = new Map();
  const material = n => { const k = `${n}_glb`; if (!materials.has(k)) materials.set(k, scoutMaterial(k)); return materials.get(k); };
  const scene = new THREE.Group();
  scene.name = 'scoutgen';
  scene.userData = { generator: 'scoutgen' };
  for (const g of groups) {
    for (const name of g.objects) {
      const m = parts[name], geo = indexGeometry(shaded(m, m.angle ?? 180));
      geo.applyMatrix4(TO_GLTF);
      const o = new THREE.Mesh(geo, material(m.material));
      o.name = name;
      o.userData = { part_id: g.id, part_label: g.label, side: g.side, source_object: name };
      scene.add(o);
    }
  }
  return { scene, groups };
}

// Exploded copy like scout_exploded.glb: every mesh moved by its group's explosion offset (geometry shared with `scene`).
export function explodedScout(scene, groups) {
  const out = scene.clone(), off = new Map(groups.flatMap(g => g.objects.map(n => [n, g.offset])));
  out.name = 'scoutgen_exploded';
  for (const o of out.children) { const v = off.get(o.name); o.position.set(v[0], v[2], -v[1]); }
  return out;
}

