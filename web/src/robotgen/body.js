// Shared form kit of the robot body studies (port of cubeescape-ballon basic/robot/studies/body.py, round 5): bodies from
// parameters, round, with visible technology and highlights. Frames as in Ballon: torso, pelvis and head +Y front, +X right body
// side; leg +Y front, +X inside (right leg unmirrored, the left one mirrored at X), foot +Z forward, +Y up. Plate angles (wrap) in
// degrees around the segment axis, 0 = +Y. All lengths in mm.
import { sec } from './forms.js';
import { loft, wrap, ring, tab, arrow, twoBolts, medallion } from './shapes.js';
import { frame, pyRound } from './frame.js';
import { helmetParts } from './studyHelmet.js';

// ------------------------------------------------------------------ building blocks

export const cyl = (pid, de, seg, role, axis, r, len, c) => [pid, de, seg, 'cyl', role, { axis, r, len, c }];
export const tube = (pid, de, seg, role, path, r, kw = {}) => [pid, de, seg, 'tube', role, { path, r, ...kw }];
export const lerp = (a, b, t) => [0, 1, 2].map(i => a[i] + (b[i] - a[i]) * t);

// Hydraulics from a to b (segment frame): dark cylinder, bright rod, collar at the transition.
export function piston(name, de, seg, a, b, r = 9) {
  return [tube(`${name}_cyl`, de, seg, 'dark_metal', [a, lerp(a, b, 0.58)], r),
    tube(`${name}_rod`, `${de} (Stange)`, seg, 'trim', [lerp(a, b, 0.5), b], r * 0.5),
    tube(`${name}_collar`, `${de} (Manschette)`, seg, 'graphite', [lerp(a, b, 0.53), lerp(a, b, 0.6)], r * 1.2)];
}

export const cable = (name, de, seg, path, r = 5) => [tube(name, de, seg, 'rubber', path, r)];

// Visible joint: burnished axle, a medallion (disc, bright ring, hub) at both ends.
export function joint(name, de, seg, c, r, ln, axis = 'x') {
  return [cyl(`${name}_axle`, de, seg, 'dark_metal', axis, r, ln, c), ...medallion(name, seg, c, r * 0.8, ln + 8, axis)];
}

// Status light: small glowing lens in a bright bezel.
export function light(name, seg, c, axis = 'y', r = 5) {
  return [cyl(`${name}_bezel`, 'Lichtfassung', seg, 'trim', axis, r + 2.2, 3.0, c),
    cyl(`${name}_lamp`, 'Statuslicht', seg, 'energy', axis, r, 4.4, c)];
}

// Orange double stripes of the weapons along the cross-sections (angles in degrees around mid).
export function vstripes(name, seg, secs, mid, { w = 1.6, gap = 2.4, t = 1.2 } = {}) {
  return [['a', -1], ['b', 1]].map(([k, s]) => wrap(`${name}_stripe_${k}`, 'Akzentstreifen', seg, 'accent', secs,
    mid + s * gap / 2, mid + s * (gap / 2 + w), t, { steps: 2, sub: 2 }));
}

// Orange double stripes across the contour f (two bands of height h).
export function hstripes(name, seg, f, z, g, a0, a1, { h = 6, gap = 5, t = 1.2 } = {}) {
  return [['a', z], ['b', z + h + gap]].map(([k, z0]) => wrap(`${name}_stripe_${k}`, 'Akzentstreifen', seg, 'accent',
    [f(z0, g), f(z0 + h, g)], a0, a1, t, { sub: 1 }));
}

// Bright edge: narrow band of the contour s (sec) from z to z + h.
export function edge(name, seg, s, a0, a1, { h = 5, t = 1.4 } = {}) {
  return [wrap(`${name}_edge`, 'Zierkante', seg, 'trim', [s, { ...s, z: s.z + h }], a0, a1, t, { sub: 1 })];
}

// Front edge (+Y) of the cross-section s at x: superellipse or chamfered rectangle (ch).
export function surfY(s, x) {
  const dx = Math.abs(x - s.x);
  if (s.ch) {
    const c = Math.min(s.ch, s.a - 0.1, s.b - 0.1);
    return s.y + s.b - Math.max(0, dx - (s.a - c));
  }
  const u = Math.min(dx / s.a, 0.999);
  return s.y + s.b * (1 - u ** s.n) ** (1 / s.n);
}

// Groove or slot: box (segment frame) subtracted from the form (mesh.js › cut).
export const slot = (c, d, rz = 0, rx = 0) => ({ c, d, rz, rx });

// Cross-section grown by g; chamfered cross-sections move the chamfer in parallel.
export function grow(s, g) {
  const out = { ...s, a: s.a + g, b: s.b + g };
  if (s.ch) out.ch = s.ch + g * (2 - Math.SQRT2);
  return out;
}

// Plate (wrap) with bright side edges that follow the outline, the arrow cut included (every plate has a bright edge).
// w = edge width in degrees.
export function plate(pid, de, seg, role, secs, a0, a1, t, { w = 2.2, rim_t = 1.4, ...kw } = {}) {
  const out = [wrap(pid, de, seg, role, secs, a0, a1, t, kw)];
  for (const [k, side] of [['a', 0], ['b', 1]]) {
    const rs = secs.map(s => {
      const s0 = s.a0 ?? a0, s1 = s.a1 ?? a1, ww = Math.min(w, (s1 - s0) / 2);
      return grow(side === 0 ? { ...s, a0: s0, a1: s0 + ww } : { ...s, a0: s1 - ww, a1: s1 }, t);
    });
    out.push(wrap(`${pid}_rim_${k}`, 'Zierkante', seg, 'trim', rs, a0, a1, rim_t, { steps: 2, sub: kw.sub ?? 6 }));
  }
  return out;
}

// Angle range of a plate on the outside (right +center, left −center; 90° = exactly sideways).
export const sideRange = (sx, span, center = 90) => [sx * center - span, sx * center + span];

// ------------------------------------------------------------------ skeleton

const round3 = v => Math.round(v * 1000) / 1000;

export function framePoint(A, B, hint, local) {
  const [x, y, z] = frame(A, B, hint);
  return [0, 1, 2].map(i => round3(A[i] + local[0] * x[i] + local[1] * y[i] + local[2] * z[i]));
}

// Knee between hip A and ankle C (world, mm), bent towards the pole direction.
export function twoBone(A, C, l1, l2, pole) {
  const d = [0, 1, 2].map(i => C[i] - A[i]), L = Math.hypot(...d);
  if (L > l1 + l2) throw new Error(`Bein zu kurz: ${L.toFixed(0)} > ${(l1 + l2).toFixed(0)} mm`);
  const u = d.map(v => v / L);
  const x = (l1 * l1 - l2 * l2 + L * L) / (2 * L), h = Math.sqrt(Math.max(l1 * l1 - x * x, 0));
  const pd = pole[0] * u[0] + pole[1] * u[1] + pole[2] * u[2];
  const pv = pole.map((p, i) => p - pd * u[i]), pl = Math.hypot(...pv);
  return [0, 1, 2].map(i => round3(A[i] + u[i] * x + pv[i] / pl * h));
}

// Skeleton of a study from a few measures: pelvis tilted against the shoulders (contrapposto), knee by two-bone solution.
export function skeleton(S) {
  const W = S.waist, N = S.neck, P = S.pelvis;
  const out = { WAIST: W, NECK: N, PELVIS: P, HEAD_H: S.head_h, TORSO_HINT: S.torso_hint, HEAD_HINT: S.head_hint,
    HEAD_TOP: [N[0] + S.head_off[0], N[1] + S.head_off[1], N[2] + S.head_h], SHOULDER_LOCAL: S.shoulder, FOOT_H: S.foot_h };
  const J = {};
  for (const [side, sx] of [['R', 1], ['L', -1]]) {
    const hip = framePoint(P, W, [0, -1, 0], [sx * S.hip_x, 0, S.hip_z]);
    const ank = [...S.ankles[side], S.foot_h];
    const knee = twoBone(hip, ank, S.thigh, S.shin, S.knee_pole[side]);
    J[side] = [hip, knee, ank, [...S.toes[side], S.foot_h]];
  }
  out.JOINTS = J;
  return out;
}

// ------------------------------------------------------------------ head

export function head(P) {
  const { a, b } = P, n = P.n ?? 2.4, hz = P.hz ?? 1.0, jaw = P.jaw ?? 0.82;
  const zs = [36, 80, 160, 215, 246, 262].map(z => pyRound(36 + (z - 36) * hz));   // hz > 1: taller helmet
  const H = tab([[zs[0], jaw * a, 0.84 * b, 6], [zs[1], 0.97 * a, b, 8], [zs[2], a, 1.02 * b, 6], [zs[3], 0.9 * a, 0.92 * b, 2],
    [zs[4], 0.66 * a, 0.7 * b, -2], [zs[5], 0.3 * a, 0.32 * b, -4]], P.ch ?? 0);
  const out = [loft('neck', 'Hals', 'head', 'graphite', [sec(-40, P.neck, P.neck, { n: 2.2 }), sec(60, P.neck - 4, P.neck - 4, { n: 2.2 })]),
    ring('neck_ring', 'Wirbelring', 'head', 'dark_metal', 2, 14, P.neck + 2, P.neck + 2, 6),
    ring('neck_trim', 'Halskante', 'head', 'trim', 16, 19, P.neck + 3, P.neck + 3, 2.5)];
  if (P.style === 'mil') return [...out, ...helmetParts({ ...(P.helmet ?? {}), h: P.h ?? 270 })];   // parametric military helmet
  out.push(loft('helmet', 'Helm', 'head', 'shell', zs.map(z => H(z, 0, { n })), { sharp: 60 }));
  const fz = [zs[0] + 20, 90, 140, 186, zs[3] + 6, zs[4] + 4];
  const fw = P.face_w ?? [24, 32, 44, 54, 48, 26];
  out.push(...plate('face', 'Gesichtsschild', 'head', 'anodized', fz.map((z, i) => H(z, 1.0, { n, a0: -fw[i], a1: fw[i] })), -fw[3], fw[3], 5));
  out.push(wrap('face_line', 'Mittellinie', 'head', 'trim', [fz[0] + 4, 140, fz[5] - 2].map(z => H(z, 6.3, { n })), -1.4, 1.4, 1.8, { steps: 2 }),
    wrap('visor', 'Augenlinie', 'head', 'energy', [126, 130].map(z => H(z, 6.2, { n })), -34, 34, 1.0, { sub: 1, steps: 16 }));
  for (const [k, sx] of [['r', 1], ['l', -1]]) {               // temple strips, tilted outwards at the bottom
    const lo = (u0, u1) => (sx > 0 ? [u0, u1] : [-u1, -u0]);
    out.push(...plate(`temple_strip_${k}`, 'Schläfenleiste', 'head', 'shell',
      [H(zs[3] - 8, 1.5, { n, a0: lo(60, 70)[0], a1: lo(60, 70)[1] }), H(140, 3.0, { n, a0: lo(64, 75)[0], a1: lo(64, 75)[1] }),
        H(zs[0] + 24, 6.0, { n, a0: lo(70, 82)[0], a1: lo(70, 82)[1] })], ...lo(60, 70), 5, { w: 1.6 }));
  }
  out.push(wrap('chin', 'Kinnschutz', 'head', 'graphite', [sec(zs[0] - 28, 0.7 * a, 0.76 * b, 10, { n: 4.0 }), sec(zs[0], 0.9 * a, 0.9 * b, 8, { n: 4.0 }),
    sec(zs[0] + 22, 0.94 * a, 0.96 * b, 8, { n: 4.0 })], -66, 66, 8, { sharp: 25 }));
  const ear = P.ear ?? 'can', w = 2 * H(112).a;
  if (ear === 'out') {
    for (const [k, sx] of [['r', 1], ['l', -1]]) {
      out.push([`ear_${k}`, 'Ohrausleger', 'head', 'box', 'dark_metal', { d: [34, 52, 30], c: [sx * (w / 2 + 12), -14, 112], bevel: 3 }],
        [`ear_${k}_cap`, 'Auslegerkappe', 'head', 'box', 'shell', { d: [10, 44, 22], c: [sx * (w / 2 + 31), -14, 112], bevel: 2 }]);
    }
  } else if (ear === 'can') {
    out.push(...joint('ear', 'Hörkapsel', 'head', [0, -8, 112], P.ear_r ?? 32, w + 14));
  } else if (ear === 'lens') {
    out.push(...medallion('temple', 'head', [0, -6, 118], 26, w + 12), cyl('temple_lens', 'Schläfenlinse', 'head', 'anodized', 'x', 13, w + 20, [0, -6, 118]));
  }
  if (P.crest) {
    out.push(wrap('crest', 'Helmkamm', 'head', 'shell', [120, zs[3], zs[4] + 4].map(z => H(z, 7.0, { n })), 172, 188, 6.0, { steps: 4 }));
    out.push(...vstripes('crest', 'head', [130, zs[3], zs[4]].map(z => H(z, 7.0, { n })), 180, { w: 1.4, gap: 12.0 }));
  }
  if (P.antenna) {
    out.push(tube('antenna', 'Antenne', 'head', 'dark_metal', [[-H(150).a + 6, -40, 150], [-H(150).a - 4, -70, 290]], 3.0),
      cyl('antenna_tip', 'Antennenspitze', 'head', 'trim', 'z', 5, 10, [-H(150).a - 4, -70, 292]));
  }
  if (P.neck_cables) {
    for (const [k, sx] of [['r', 1], ['l', -1]]) out.push(...cable(`neck_cable_${k}`, 'Halsleitung', 'head', [[sx * 34, -36, -50], [sx * 46, -44, 10], [sx * 40, -30, 70]], 5.5));
  }
  if (P.neck_pistons) {
    for (const [k, sx] of [['r', 1], ['l', -1]]) out.push(...piston(`neck_piston_${k}`, 'Halskolben', 'head', [sx * 40, 22, -50], [sx * 30, 14, 66], 7));
  }
  return out;
}

// ------------------------------------------------------------------ upper body

const setRot = (parts, rot) => { for (const q of parts) q[5].rot = rot; };

export function torso(P) {
  const C = tab(P.core, P.core_ch ?? 0);            // ch > 0: chamfered cross-sections
  const zc = P.core.map(r => r[0]);
  const [wa, wb] = P.waist, SX = P.SX, SZ = P.SZ;
  const coll = P.collar;
  const out = [loft('waist_core', 'Taillenkern', 'torso', 'graphite', [sec(-50, wa, wb, { n: 2.4 }), sec(zc[0] + 40, wa + 8, wb + 6, { n: 2.4 })]),
    loft('torso_core', 'Rumpf', 'torso', 'graphite', zc.map(z => C(z))),
    loft('collar', 'Kragen', 'torso', 'graphite', coll.map(r => sec(...r, { n: 2.5 }))),
    ring('collar_trim', 'Kragenkante', 'torso', 'trim', coll.at(-1)[0] - 4, coll.at(-1)[0] - 1, coll.at(-1)[1] + 1, coll.at(-1)[2] + 1, 2.0, { n: 2.5 })];
  if (P.gorget) {               // neck ring around the collar, lowered at the front, with a raised rim
    const [zg, ga, gb, tg] = P.gorget;
    const gs = [sec(zg, ga, gb, -8, { n: 2.6 }), sec(zg + 22, ga - 10, gb - 8, -8, { n: 2.6 })];
    const add = [wrap('gorget', 'Halsring', 'torso', 'shell', gs, -180, 180, 10, { sub: 2 }),
      ...edge('gorget', 'torso', sec(zg + 18, ga - 8 + 10.2, gb - 6.5 + 10.2, -8, { n: 2.6 }), -180, 180, { h: 5, t: 2.4 })];
    setRot(add, ['x', -tg, [0, 0, zg]]);
    out.push(...add);
  }
  if (P.bridges) {              // two thick shoulder bridges, obliquely from the chest towards the back, with a long recess on top
    const [bx, bz, bl, bt] = P.bridges;
    for (const [k, sx] of [['r', 1], ['l', -1]]) {
      const c = [sx * bx, -6, bz];
      out.push([`bridge_${k}`, 'Schultersteg', 'torso', 'box', 'shell', { d: [50, bl, 34], c, bevel: 5, rot: ['x', -bt, c] }],
        [`bridge_${k}_groove`, 'Stegvertiefung', 'torso', 'box', 'graphite', { d: [18, bl - 56, 6], c: [c[0], c[1], c[2] + 15.5], bevel: 1.5, rot: ['x', -bt, c] }]);
    }
  }
  // abdomen
  const ab = P.abdomen;
  if (ab === 'plates') {        // abdominal plates in layers, the upper one overlapping the lower one
    out.push(wrap('abs_a', 'Bauchplatte', 'torso', 'shell', [zc[0] + 4, zc[0] + 56].map(z => C(z, 3.0, { a0: -58, a1: 58 })), -58, 58, 8),
      wrap('abs_b', 'Bauchplatte', 'torso', 'shell', [zc[0] + 48, zc[0] + 110].map(z => C(z, 10.0, { a0: -64, a1: 64 })), -64, 64, 9),
      ...edge('abs_a', 'torso', C(zc[0] + 4, 11.3), -58, 58, { h: 4 }));
  } else if (ab === 'vribs') {  // narrow abdomen of dark, vertically ribbed segments
    [-60, -40, -20, 0, 20, 40, 60].forEach((ang, i) => out.push(wrap(`abs_rib_${i}`, 'Bauchrippe', 'torso', 'dark_metal',
      [sec(-34, wa + 1, wb + 1, { n: 2.4 }), sec(zc[0] + 30, wa + 9, wb + 7, { n: 2.4 })], ang - 4, ang + 4, 7, { steps: 2 })));
    out.push(ring('waist_trim', 'Taillenkante', 'torso', 'trim', -40, -36, wa + 2, wb + 2, 2));
  } else {                      // open waist: vertebra rings over the core
    const rings = P.rings ?? [-20, 6, 32];
    rings.forEach((z, i) => out.push(ring(`waist_ring_${i}`, 'Wirbelring', 'torso', 'dark_metal', z, z + 14, wa + 5, wb + 5, 5)));
    out.push(ring('waist_trim', 'Taillenkante', 'torso', 'trim', rings[0] - 4, rings[0] - 1, wa + 7, wb + 7, 2));
  }
  if (ab === 'spine') [-8, 18, 44].forEach((z, i) => out.push(cyl(`spine_disc_${i}`, 'Wirbelscheibe', 'torso', 'trim', 'z', 18, 4, [0, wb + 8, z])));
  if (P.waist_pistons) {
    for (const [k, sx] of [['r', 1], ['l', -1]]) out.push(...piston(`waist_piston_${k}`, 'Taillenkolben', 'torso', [sx * (wa + 14), 20, -40], [sx * (wa + 34), 24, zc[0] + 80], 10));
  }
  // chest
  const ch = P.chest, [a0, a1] = ch.a, g = 2.0;
  if (ch.split) {               // two chest plates with the lens between them
    for (const [k, [b0, b1]] of [['r', [3, a1]], ['l', [a0, -3]]]) {
      out.push(...plate(`chest_${k}`, 'Brustplatte', 'torso', 'shell',
        [ch.full, ...ch.mid].map(z => C(z, g, { a0: b0, a1: b1 })).concat([C(ch.top, g, { a0: b0 + (k === 'l' ? 8 : 0), a1: b1 - (k === 'r' ? 8 : 0) })]), b0, b1, ch.t));
    }
    const zl = (ch.full + ch.top) / 2, s = C(zl);
    out.push(...medallion('chest_lens', 'torso', [0, s.y + s.b + 2, zl], 30, 26, 'y'), ...light('chest_lens', 'torso', [0, s.y + s.b + 16, zl], 'y', 9));
  } else {
    // upper plate wide, flatly vaulted, trapezoid, notch at the top centre, vertical centre seam; below a dark faceted
    // plate curved downwards, two bright rib plates at the sides
    const zb = ch.full, zt = ch.top, t = ch.t, nf = 3.2, vx = ch.vent_x ?? 112;
    const cuts = [];
    for (const sx of [1, -1]) for (const z of ch.vents ?? []) cuts.push(slot([sx * vx, surfY(C(z, g + t), vx), z], [46, 26, 3.6], -sx * 12));
    cuts.push(slot([0, surfY(C(zt, g + t, { n: nf }), 0), zt], [36, 60, 40]),
      slot([0, surfY(C((zb + zt) / 2, g + t, { n: nf }), 0), (zb + zt) / 2], [3.4, 14, zt - zb - 40]));
    out.push(...plate('chest', 'Brustplatte', 'torso', 'shell',
      [C(zb, g, { n: nf, a0: a0 + 28, a1: a1 - 28 }), C(zb + 50, g, { n: nf, a0: a0 + 12, a1: a1 - 12 })]
        .concat(ch.mid.filter(z => z > zb + 60).map(z => C(z, g, { n: nf })), [C(zt, g, { n: nf, a0: a0 + 4, a1: a1 - 4 })]), a0, a1, t, { cuts, sharp: 28 }));
    if (ch.emblem) {
      const ze = zb + 0.42 * (zt - zb), s = C(ze, g + t, { n: nf });
      out.push(...medallion('emblem', 'torso', [0, s.y + s.b + 2, ze], 24, 12, 'y'), ...light('emblem', 'torso', [0, s.y + s.b + 9, ze], 'y', 8));
    }
    const gs = g + 4;
    out.push(...plate('solar', 'Sonnenplatte', 'torso', 'anodized',
      [C(zb - 74, gs, { n: 4, a0: -24, a1: 24 }), C(zb - 40, gs, { n: 4, a0: -44, a1: 44 }), C(zb + 14, gs, { n: 4, a0: -54, a1: 54 })], -54, 54, 9, { sharp: 25 }));
    out.push(...twoBolts('solar', 'torso', C, zb - 30, gs + 9 + 2, { dx: 22 }));
    for (const [k, sx] of [['r', 1], ['l', -1]]) {
      const lo = (u0, u1) => (sx > 0 ? { a0: u0, a1: u1 } : { a0: -u1, a1: -u0 });
      out.push(...plate(`rib_${k}`, 'Rippenplatte', 'torso', 'shell',
        [C(zb - 86, g + 2, lo(46, 60)), C(zb - 30, g + 2, lo(54, 74)), C(zb + 18, g + 2, lo(62, 84))], lo(46, 60).a0, lo(46, 60).a1, 8));
    }
    if (P.lights) {
      for (const [k, sx] of [['r', 1], ['l', -1]]) {
        const s = C(zb + 40, g + t, { n: nf });
        out.push(...light(`chest_light_${k}`, 'torso', [sx * 62, surfY(s, 62) + 1, zb + 40], 'y', 3.6));
      }
    }
  }
  if (ch.stripe) out.push(...hstripes('chest', 'torso', C, ch.stripe, g + ch.t, ch.a[0] + 22, ch.a[0] + 44));
  // back
  const bk = P.back;
  if (bk.kind !== 'spine') {
    out.push(...plate('back', 'Rückenplatte', 'torso', 'shell', [C(bk.z[0], g, { a0: 168, a1: 192 }), ...bk.z.slice(1).map(z => C(z, g))], 126, 234, 9));
  }
  if (bk.kind === 'pack') {     // back module with two nozzles
    const y0 = bk.y;
    out.push(loft('backpack', 'Rückenmodul', 'torso', 'graphite', bk.rows.map(([z, a, b, dy]) => sec(z, a, b, { y: y0 + dy, n: 2.8 }))),
      wrap('backpack_shell', 'Rückenmodulschale', 'torso', 'shell', bk.rows.slice(1, -1).map(([z, a, b, dy]) => grow(sec(z, a, b, { y: y0 + dy, n: 2.8 }), 1.5)), 140, 220, 7));
    for (const [k, sx] of [['r', 1], ['l', -1]]) {
      const c = [sx * bk.nozzle_x, y0 - 12, bk.rows[0][0] - 26];
      out.push(cyl(`nozzle_${k}`, 'Düse', 'torso', 'dark_metal', 'z', 26, 64, c),
        cyl(`nozzle_${k}_trim`, 'Düsenkante', 'torso', 'trim', 'z', 28, 6, [c[0], c[1], c[2] - 30]),
        cyl(`nozzle_${k}_core`, 'Düsenkern', 'torso', 'anodized', 'z', 17, 70, c),
        ...cable(`pack_cable_${k}`, 'Leitung', 'torso', [[sx * (bk.nozzle_x + 40), y0 + 20, bk.rows.at(-1)[0] - 20], [sx * (SX - 70), y0 + 40, SZ + 40],
          [sx * (SX - 100), -20, SZ + 70]], 6));
    }
    out.push(...light('backpack', 'torso', [0, y0 - bk.rows[2][2] - 9, bk.rows[2][0]], 'y', 4.5));
  } else if (bk.kind === 'spine') {   // open spine with two shoulder-blade plates
    const sb = C(200), yb = sb.y - sb.b;
    out.push(tube('spine', 'Wirbelsäule', 'torso', 'dark_metal', [[0, yb - 4, -40], [0, yb - 10, 200], [0, yb - 4, zc.at(-1)]], 14));
    for (let i = 0, z = 10; z < 380; i++, z += 46) out.push(ring(`vertebra_${i}`, 'Wirbel', 'torso', 'trim', z, z + 6, 20, 20, 3));
    for (const [k, [b0, b1]] of [['r', [128, 172]], ['l', [188, 232]]]) out.push(wrap(`blade_${k}`, 'Schulterblattplatte', 'torso', 'shell', [210, 290, 360].map(z => C(z, g)), b0, b1, 8));
  }
  // shoulders: joint, round pauldron (over torso and upper arm), layers, medallion, bright edge, stripes
  const pd = P.pauldron;
  for (const [k, sx] of [['r', 1], ['l', -1]]) {
    out.push(...joint(`shoulder_${k}`, 'Schultergelenk', 'torso', [sx * (SX - 50), -4, SZ], P.joint_r, 116));
    const add = [];
    const pch = pd.ch ?? 0, pn = pd.n ?? 2.6;
    const rows = pd.rows.map(([z, a, b, y, dx]) => sec(z, a, b, { y, x: sx * (SX + dx), n: pn, ch: Math.min(pch, 0.45 * a) }));
    const below = (R, z) => R.filter(q => q.z <= z).at(-1);
    const lam = (pd.grooves ?? []).map(z => { const r = below(rows, z); return slot([r.x + sx * r.a, r.y, z], [30, 2 * r.b + 60, 3.6]); });
    add.push(loft(`pauldron_${k}`, 'Schulterpanzer', 'torso', 'shell', rows, { sharp: pch ? 28 : 60, cuts: lam }));
    add.push(...edge(`pauldron_${k}`, 'torso', grow(rows[0], 0.4), -180, 180, { h: 5, t: 1.6 }));
    if (pd.stripes) {           // double stripes at the front outside of the pauldron
      const m = 90 - (pd.stripe_span ?? 34);
      for (const [j, [u0, u1]] of [['a', [m, m + 5]], ['b', [m + 9, m + 14]]]) {
        const [b0, b1] = sx > 0 ? [u0, u1] : [-u1, -u0];
        add.push(wrap(`pauldron_${k}_stripe_${j}`, 'Akzentstreifen', 'torso', 'accent', rows.slice(1, 3).map(r => grow(r, 0.2)), b0, b1, 1.2, { sub: 2, steps: 2 }));
      }
    }
    if (pd.panel) {             // plate on the front outside with a bright edge
      const [z0, z1, span] = pd.panel;
      const [q0, q1] = sideRange(sx, span, pd.panel_center ?? 62);
      const ps = [z0, (z0 + z1) / 2, z1].map(z => grow({ ...below(rows, z), z }, 0.5)).map((r, i) => ({ ...r, a: r.a - (i === 2 ? 2 : 0) }));
      add.push(...plate(`pauldron_${k}_panel`, 'Schulterplatte', 'torso', 'shell', ps, q0, q1, 5));
    }
    for (const [fk, span] of [['flare', pd.flare_span ?? 120], ['flare2', (pd.flare_span ?? 120) - 26]]) {
      if (!pd[fk]) continue;    // layers under the rim, narrower towards the upper arm
      const fr = pd[fk].map(([z, a, b, y, dx]) => sec(z, a, b, { y, x: sx * (SX + dx), n: pn, ch: Math.min(pch, 0.45 * a) }));
      const [f0, f1] = sideRange(sx, span);
      add.push(...plate(`pauldron_${k}_${fk}`, 'Schulterlage', 'torso', 'shell', fr, f0, f1, 9));
      add.push(...edge(`pauldron_${k}_${fk}`, 'torso', grow(fr[0], 9.2), f0, f1, { h: 4, t: 1.4 }));
    }
    if (pd.band) {
      const zb = pd.band, sb = below(rows, zb);
      add.push(wrap(`pauldron_${k}_band`, 'Panzerfuge', 'torso', 'graphite', [{ ...grow(sb, -0.5), z: zb }, { ...grow(sb, -0.5), z: zb + 6 }], -180, 180, 2.0, { sub: 1 }));
    }
    const mz = pd.med[0], mr = below(rows, mz);
    add.push(...medallion(`shoulder_${k}_med`, 'torso', [mr.x + sx * (mr.a - 4), mr.y, mz], pd.med[1], 22));
    setRot(add, ['y', sx * (pd.tilt ?? 0), [sx * SX, 0, SZ]]);   // pauldron tilted: lower outside, inside under the collar
    out.push(...add);
    if (P.shoulder_pistons) out.push(...piston(`shoulder_piston_${k}`, 'Schulterkolben', 'torso', [sx * 96, -96, 250], [sx * (SX - 36), -64, SZ + 12], 9));
  }
  return out;
}

// ------------------------------------------------------------------ lower body

export function pelvis(P) {
  const PL = tab(P.pel, P.pel_ch ?? 0);
  const zs = P.pel.map(r => r[0]);
  const [bz0, bz1, ba, bb] = P.belt;
  const out = [loft('pelvis_core', 'Becken', 'pelvis', 'graphite', zs.map(z => PL(z))),
    ring('belt', 'Gürtelring', 'pelvis', 'dark_metal', bz0, bz1, ba, bb, 8, { n: 2.8 }),
    ring('belt_trim', 'Gürtelkante', 'pelvis', 'trim', bz1 - 3, bz1, ba + 8.5, bb + 8.5, 1.6, { n: 2.8 })];
  // crotch piece: dark core running down between the legs
  const p0 = PL(0);
  out.push(loft('brief', 'Schrittstück', 'pelvis', 'graphite', [sec(-96, 34, 40, 8), sec(-52, 60, 60, 4), sec(0, p0.a * 0.72, p0.b * 0.92, p0.y)]));
  const zm = (bz0 + bz1) / 2;   // flat rectangular buckle
  out.push(['buckle', 'Schließe', 'pelvis', 'box', 'trim', { d: [74, 12, 32], c: [0, bb + 12, zm], bevel: 2 }],
    ['buckle_inset', 'Schließenfeld', 'pelvis', 'box', 'graphite', { d: [56, 14, 18], c: [0, bb + 13, zm], bevel: 1 }]);
  const ft = P.front, zq = ft.tip + 0.24 * (ft.full - ft.tip);   // pelvis guard narrowing downwards, rounded end
  out.push(...plate('tasset', 'Lendenplatte', 'pelvis', 'shell',
    [PL(ft.tip, 2.0, { a0: -ft.a * 0.3, a1: ft.a * 0.3 }), PL(zq, 2.0, { a0: -ft.a * 0.66, a1: ft.a * 0.66 }),
      PL(ft.full, 2.0, { a0: -ft.a, a1: ft.a }), PL(bz0 - 10, 2.0, { a0: -ft.a - 4, a1: ft.a + 4 })], -ft.a, ft.a, 9));
  out.push(...vstripes('tasset', 'pelvis', [ft.full - 10, ft.full + 40, bz0 - 14].map(z => PL(z, 11.0)), 0, { w: 1.6, gap: 3.0 }));
  const sd = P.side;
  for (const [k, sx] of [['r', 1], ['l', -1]]) {
    const rows = sd.rows.map(([z, a, b, y]) => sec(z, a, b, y, { n: 2.6 }));
    const [a0, a1] = sideRange(sx, sd.span, sd.center ?? 64);
    out.push(...plate(`tasset_side_${k}`, 'Beintasche', 'pelvis', 'shell', rows, a0, a1, 9));
    out.push(...edge(`tasset_side_${k}`, 'pelvis', grow(rows[0], 9.2), a0, a1, { h: 4 }));
    if (sd.layer) {             // second, shorter layer over the first one
      const r2 = rows.slice(1).map(r => grow(r, 11));
      const [b0, b1] = sideRange(sx, sd.span - 6, sd.center ?? 64);
      out.push(wrap(`tasset_side_${k}_top`, 'Beintasche oben', 'pelvis', 'shell', r2, b0, b1, 8));
      out.push(...edge(`tasset_side_${k}_top`, 'pelvis', grow(r2[0], 8.2), b0, b1, { h: 4 }));
    }
    out.push(...joint(`hip_${k}`, 'Hüftgelenk', 'pelvis', [sx * P.hip_x, 0, P.hip_z], P.hip_r, P.hip_len ?? 92));
    if (P.belt_boxes) {
      const c = [sx * (ba - 20), -bb + 6, (bz0 + bz1) / 2 - 6];
      const bx = [c[2] - 34, c[2] + 26].map(z => sec(z, 30, 20, c[1] - 12, c[0], { n: 3.0 }));
      out.push(loft(`belt_box_${k}`, 'Gürtelmodul', 'pelvis', 'graphite', bx),
        wrap(`belt_box_${k}_trim`, 'Modulkante', 'pelvis', 'trim', [{ ...bx[1], z: c[2] + 18 }, { ...bx[1], z: c[2] + 22 }], -180, 180, 1.2, { sub: 1 }));
    }
  }
  if (P.butt) out.push(wrap('butt', 'Gesäßplatte', 'pelvis', 'shell', [-30, 40, bz0 - 8].map(z => PL(z, 2.0)), 144, 216, 8));
  return out;
}

// ------------------------------------------------------------------ legs

export function legs(P) {
  const T = tab(P.thigh, P.thigh_ch ?? 0), S = tab(P.shin, P.shin_ch ?? 0), F = tab(P.foot, P.foot_ch ?? 14);
  const LT = P.LT, LS = P.LS, FH = P.foot_h;
  const [ta0, ta1] = P.thigh_shell;
  const hr = P.hip_ball ?? T(0).a * 0.9;           // hip ball: the thigh starts round, not cut flat
  const zt = P.thigh_top ?? 150;                   // shell starts below the leg pocket, hip dark and open
  const out = [loft('hip_ball', 'Hüftkugel', 'thigh', 'dark_metal', [[-0.92, 0.39], [-0.6, 0.8], [0, 1], [0.6, 0.8], [0.92, 0.39]].map(([z, r]) => sec(z * hr, r * hr, r * hr, { n: 2.0 }))),
    loft('thigh_core', 'Oberschenkel', 'thigh', 'graphite', [20, 100, 240, LT].map(z => T(z))),
    wrap('thigh_cuff', 'Hüftmanschette', 'thigh', 'dark_metal', [T(36, 1.0), T(60, 1.0)], -180, 180, 6, { sub: 1 }),
    wrap('thigh_cuff_trim', 'Manschettenkante', 'thigh', 'trim', [T(60, 1.5), T(63, 1.5)], -180, 180, 2.0, { sub: 1 })];
  // shell: high start with rounded top edge, slightly drawn-in sides and an angular lower end
  const tm = (ta0 + ta1) / 2;
  out.push(...plate('thigh_shell', 'Oberschenkelschale', 'thigh', 'shell',
    [T(zt - 16, 2.0, { a0: tm - 14, a1: tm + 14 }), T(zt + 8, 2.0, { a0: ta0 + 14, a1: ta1 - 14 }), T(zt + 60, 2.0),
      T(220, 2.0, { a0: ta0 + 7, a1: ta1 - 7 }), T(LT - 84, 2.0), T(LT - 46, 2.0, { a0: ta0 + 24, a1: ta1 - 24 })], ta0, ta1, 9));
  out.push(...vstripes('thigh', 'thigh', [zt + 30, 190, 250].map(z => T(z, 11.0)), ta0 + 16, { w: 1.8, gap: 3.0 }));
  (P.thigh_seams ?? []).forEach((z, i) => out.push(wrap(`thigh_seam_${i}`, 'Fuge', 'thigh', 'graphite', [T(z, 10.6), T(z + 4, 10.6)], ta0 + 2, ta1 - 2, 1.4, { sub: 1 })));
  if (P.thigh_piston) {
    out.push(...piston('thigh_piston', 'Oberschenkelkolben', 'thigh', [-T(60).a - 4, -T(60).b * 0.55, 30], [-T(LT - 60).a - 2, -T(LT - 60).b * 0.5, LT - 40], 10));
  }
  if (P.thigh_cable) {
    out.push(...cable('thigh_cable', 'Leitung', 'thigh', [[T(40).a * 0.5, -T(40).b - 4, 20], [T(200).a * 0.6, -T(200).b - 8, 200], [T(LT).a * 0.4, -T(LT).b - 6, LT - 20]], 5));
  }
  // knee
  out.push(...joint('knee', 'Kniegelenk', 'shin', [0, 0, 0], P.knee_r, P.knee_len ?? 136));
  const kc = P.kneecap, kb = Math.max(...kc.slice(1).map(r => r[2])), kch = P.knee_ch ?? 0;   // knee cap split lengthwise
  out.push(wrap('knee_cap', 'Kniekappe', 'shin', 'shell',
    [sec(kc[0][0], kc[0][1], kc[0][2], { n: 2.4, ch: Math.min(kch, 0.4 * kc[0][1]), a0: -8, a1: 8 }), ...kc.slice(1).map(([z, a, b]) => sec(z, a, b, { n: 2.4, ch: kch }))], -62, 62, 11,
    { cuts: [slot([0, kb + 11, (kc[1][0] + kc.at(-1)[0]) / 2], [3.4, 16, kc.at(-1)[0] - kc[1][0] + 30])] }));
  out.push(...edge('knee_cap', 'shin', grow(sec(kc.at(-1)[0] - 5, kc.at(-1)[1], kc.at(-1)[2], { n: 2.4, ch: kch }), 11.2), -62, 62, { h: 4 }));
  if (P.knee_pistons) {
    for (const [k, dx] of [['a', -26], ['b', 26]]) out.push(...piston(`knee_piston_${k}`, 'Kniekolben', 'shin', [dx, -T(LT - 120).b - 4, -150], [dx * 0.8, -S(140).b - 6, 140], 8));
  }
  // shin: broad upper end, narrow ankle zone, raised side rims, angular cut-out above the foot
  const [sa0, sa1] = P.shin_shell;
  out.push(loft('shin_core', 'Schienbein', 'shin', 'graphite', [30, 140, 290, LS].map(z => S(z))));
  out.push(...plate('shin_shell', 'Schienbeinschale', 'shin', 'shell',
    [S(64, 2.0, { a0: sa0 + 6, a1: sa1 - 6 }), S(110, 2.0), S(230, 2.0, { a0: sa0 + 8, a1: sa1 - 8 }), S(LS - 40, 2.0, { a0: sa0 + 16, a1: sa1 - 16 })],
    sa0, sa1, 9, { rim_t: 3.2, cuts: [slot([0, surfY(S(LS - 40, 11.0), 0), LS - 40], [40, 74, 74], 90, 45)] }));
  out.push(wrap('shin_plate', 'Schienbeinlage', 'shin', 'anodized',
    [...arrow(S, 196, 166, -18, 18, 11.0, { tip: 1.5 }).reverse(), ...[226, 256].map(z => S(z, 11.0))], -18, 18, 2.5, { steps: 8 }));
  out.push(...twoBolts('shin', 'shin', S, 240, 14.5, { dx: 11, r: 3.6 }));
  if (P.lights) { const s = S(150, 11.0); out.push(...light('shin_light', 'shin', [0, s.y + s.b + 1.5, 150], 'y', 3.2)); }
  if (P.calf) out.push(wrap('calf', 'Wadenplatte', 'shin', 'shell', [90, 170, 250].map(z => S(z, 2.0)), 140, 220, 8));
  if (P.calf_piston) out.push(...piston('calf_piston', 'Wadenkolben', 'shin', [0, -S(60).b - 8, 50], [0, -S(LS).b - 10, LS + 20], 9));
  if (P.ankle_pistons) {
    for (const [k, sx] of [['a', 1], ['b', -1]]) {
      out.push(...piston(`ankle_piston_${k}`, 'Knöchelkolben', 'shin', [sx * (S(LS - 170).a + 6), 0, LS - 180], [sx * (S(LS - 30).a + 4), 4, LS - 24], 7));
    }
  }
  out.push(wrap('boot_cuff', 'Stiefelschaft', 'shin', 'shell', [LS - 72, LS - 38, LS - 6].map(z => S(z, 3.0)), 40, 320, 9));
  out.push(...edge('boot_cuff', 'shin', S(LS - 74, 12.2), 40, 320, { h: 4 }));
  // foot
  out.push(...joint('ankle', 'Knöchel', 'foot', [0, 0, 0], P.ankle_r, P.ankle_len ?? 122));
  const fz = P.foot.map(r => r[0]);
  out.push(loft('foot_core', 'Fuß', 'foot', 'graphite', fz.map(z => F(z))),
    wrap('toe_cap', 'Zehenkappe', 'foot', 'shell', [...arrow(F, fz[2] + 6, fz[2] - 34, -82, 82, 2.0, { tip: 5 }).reverse(), F(fz[3], 2.0), F(fz.at(-1) + 2, 2.0)], -82, 82, 8),
    wrap('heel_cap', 'Fersenkappe', 'foot', 'shell', [fz[0] - 4, fz[0] + 30, fz[0] + 60].map(z => F(z, 2.0)), 70, 290, 8),
    loft('sole', 'Sohle', 'foot', 'rubber', [sec(fz[0] - 6, F(fz[0]).a + 2, 6, -FH + 6, { n: 4 }), sec(fz.at(-1) + 8, F(fz.at(-1)).a, 6, -FH + 6, { n: 4 })], { sub: 1 }));
  out.push(...edge('toe_cap', 'foot', { ...F(fz.at(-1) - 30, 10.2), a0: -82, a1: 82 }, -82, 82, { h: 4 }));
  return out;
}

// ------------------------------------------------------------------ upper arm (robot variant; Arm v3 stays for the ego view)

// Round upper arm instead of the chamfered v3 hull: graphite body, outer shell with an arrow cut towards the elbow, seam,
// shoulder ball. Segment upper (Arm v3): origin at the shoulder, +Z towards the elbow, +Y outside.
export function upperArm(P) {
  const out = [loft('shoulder_ball', 'Schulterkugel', 'upper', 'dark_metal', [[-44, 8], [-30, 40], [0, P.ball], [30, 40], [44, 8]].map(([z, r]) => sec(z, r, r, { n: 2.0 })))];
  if (!P.rows) return out;      // upper arm v3 stays, only the ball is added
  const U = tab(P.rows, P.ch ?? 0);
  out.push(loft('upper_core', 'Oberarmkörper', 'upper', 'graphite', [10, 150, 290].map(z => U(z))));
  if (P.shell) {
    const [s0, s1] = P.shell;
    out.push(wrap('upper_shell_r', 'Oberarmschale', 'upper', 'shell', [U(60, 2.0, { a0: s0 + 14, a1: s1 - 14 }), U(150, 2.0), ...arrow(U, 230, 280, s0, s1, 2.0, { tip: 5 })], s0, s1, 8));
    out.push(...vstripes('upper', 'upper', [90, 150, 200].map(z => U(z, 10.0)), 0, { w: 1.6, gap: 3.0 }));
  }
  out.push(wrap('upper_seam', 'Oberarmfuge', 'upper', 'trim', [U(40, 0.5), U(44, 0.5)], -180, 180, 1.4, { sub: 1 }));
  if (P.piston) out.push(...piston('biceps_piston', 'Armkolben', 'upper', [U(40).a + 6, 0, 30], [U(260).a + 4, 0, 300], 8));
  return out;
}
