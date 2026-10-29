// Parametric military helmet of the body studies (port of cubeescape-ballon basic/robot/studies/helmet.py, round 5): cap,
// face mask, side/rear housing, jaw, communication technology. Measures in the unit E = helmet height without antennas / 100 in the
// coordinates of the user's instruction (Z up, X sideways, front −Y), converted into the head frame (mm): x = X·E, y = −Y·E,
// z = (Z + Z0)·E. In the viewer the study helmet is hidden behind Helm H or Scout (robotHelmet.js) but stays part of the body.
import { sec, pt as contourPt } from './forms.js';
import { loft, wrap, tab } from './shapes.js';
import { cyl, tube, slot, surfY, lerp } from './body.js';

export const PARAMS = {
  h: 270, z0: -8,
  cap: [[67, 40.6, -33, 42.6], [70, 40.5, -33, 42.4], [74, 40.4, -33, 41.2], [78, 40.0, -32.5, 40.2], [82, 38.8, -31, 38.8],
    [87, 36.8, -28.6, 36.6], [91, 33.8, -25.4, 33.6], [94.5, 29.4, -21.2, 29.6], [97.4, 22.2, -15.2, 22.8], [99.3, 12.6, -8, 13.2],
    [100, 4, -2, 5]],
  cap_n: 2.3,
  profile: [[-31, 82], [-40, 66], [-36, 43], [-27, 15]],
  mask_w: [[15, 23], [29, 26], [43, 30], [55, 33.6], [60, 34], [66, 34.4], [74, 35], [82, 35]],
  mask_b: 22, mask_n: 4.0, mask_span: 86, mask_t: 1.8,
  shell: [[18, 32, 3, 33], [30, 35, 2.5, 35.5], [45, 37.5, 2, 37], [60, 38.3, 2, 37], [69, 38.5, 2, 37]],
  shell_n: 3.0, shell_from: 48, shell_t: 1.6,
  jaw: [10, 19, 31, -29, 37.5], chin: [25, -30.5], chin_n: 5.0, legs: [15, 53], leg_w: 8,
  eye: { w: 16, h: 5, gap: 20, rise: 4, z: 59, frame: 1.0 },
  trap: { z0: 20, z1: 49, w0: 20, w1: 10, ridge: 2 }, cheek: { z0: 22, z1: 55.5 },
  rear: { w: 30, h: 15, d: 5, z: 60.5 },
  comm: { z: 46, y: -2, h: 28, d: 19, lat: 9 },
  antenna: { r: 0.75, over: 5 }, stub: { len: 19, d: 3, tilt: 12, cap: 4.8 },
  cable: { z: 25, d: 3.6, pitch: 1.15, off: 2.4 },
};

const DEG = 180 / Math.PI;

// Angle (degrees, superellipse parameter as forms.pt) at which the contour s reaches the width x (mm, ≥ 0).
export function angX(s, x) {
  const u = Math.min(Math.max(x - s.x, 0) / (s.a + 1e-9), 1);
  return Math.asin(u ** (s.n / 2)) * DEG;
}

// Front Y of the mask at Z: Catmull-Rom through the profile points (Y, Z).
function catmull(pts, z) {
  const P = [...pts].sort((p, q) => p[1] - q[1]);
  if (z <= P[0][1]) return P[0][0];
  if (z >= P.at(-1)[1]) return P.at(-1)[0];
  let i = 0;
  for (let k = 0; k < P.length - 1; k++) if (P[k][1] <= z) i = k;
  const p0 = P[Math.max(i - 1, 0)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(i + 2, P.length - 1)];
  const t = (z - p1[1]) / (p2[1] - p1[1]), m1 = (p2[0] - p0[0]) / 2, m2 = (p3[0] - p1[0]) / 2;
  const h00 = 2 * t ** 3 - 3 * t * t + 1, h10 = t ** 3 - 2 * t * t + t, h01 = -2 * t ** 3 + 3 * t * t, h11 = t ** 3 - t * t;
  return h00 * p1[0] + h10 * m1 + h01 * p2[0] + h11 * m2;
}

const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);

export function helmetParts(over = {}) {
  const P = { ...PARAMS };
  for (const [k, v] of Object.entries(over)) P[k] = P[k] && typeof P[k] === 'object' && !Array.isArray(P[k]) ? { ...P[k], ...v } : v;
  const stage = P.stage ?? 2;
  const E = P.h / 100;
  const zz = Z => (Z + P.z0) * E;
  const S = (Z, a, front, back, n) => sec(zz(Z), a * E, (back - front) / 2 * E, -(front + back) / 2 * E, { n });
  const out = [];
  // 1 skull cap
  out.push(loft('cap', 'Schädelhaube', 'head', 'anodized', P.cap.map(([Z, a, f, b]) => S(Z, a, f, b, P.cap_n)), { sharp: 40, bevel: 1.4 }));
  // 2 face mask: dense cross-sections after the side profile (Catmull-Rom), width linear
  const W = tab(P.mask_w.map(([z, a]) => [z, a, 0, 0]));
  const mb = P.mask_b, mn = P.mask_n;
  const mz = [15, 19, 24, 29, 34, 39, 43, 48, 52, 56, 60, 63, 66, 70, 74, 78, 82];
  const M = tab(mz.map(Z => [zz(Z), W(Z).a * E, mb * E, -(catmull(P.profile, Z) + mb) * E]));
  const MS = (Z, g = 0, kw = {}) => M(zz(Z), g, { n: mn, ...kw });
  const sp = P.mask_span;
  // 3 eyes (stage 2): slots through the shell, two-step frame, glass behind
  const e = P.eye, mt = P.mask_t * E;
  const cuts = [], glass = [];
  if (stage >= 2) {
    const sl = Math.atan2(e.rise, e.w) * DEG;
    for (const sx of [1, -1]) {
      const xc = sx * (e.gap / 2 + e.w / 2) * E, zc = zz(e.z);
      const ys = surfY(MS(e.z), Math.abs(xc)) + mt;
      const box = (k, L, H) => { const D = 2 * k + 20; return slot([xc, ys - k + D / 2, zc], [D, L, H], 90, -sx * sl); };
      const fr = e.frame * E;
      cuts.push(box(0.5 * E, e.w * E + 2 * fr, e.h * E + 2 * fr), box(1.0 * E, e.w * E + 0.8 * fr, e.h * E + 0.8 * fr), box(mt + 2.5, e.w * E, e.h * E));
      const yg = ys - mt - 0.6 * E;
      glass.push([`eye_glass_${sx > 0 ? 'r' : 'l'}`, 'Sichtscheibe', 'head', 'box', 'reticle_cyan',
        { d: [e.w * E + 2, 1.6, e.h * E + 2], c: [xc, yg, zc], bevel: 0.3, rot: ['y', -sx * sl, [xc, yg, zc]] }]);
    }
  }
  out.push(wrap('mask', 'Gesichtsmaske', 'head', 'graphite', mz.map(Z => MS(Z)), -sp, sp, mt, { sharp: 30, bevel: 1.0, cuts }), ...glass);
  // inner core: closes mask and housing on the inside
  out.push(loft('helmet_core', 'Helmkern', 'head', 'graphite', [S(12, 26, -26, 30, 2.6), S(40, 31, -30, 33, 2.6), S(66, 33.5, -33, 35, 2.6), S(80, 32, -28, 34, 2.6)]));
  // 3 side/rear housing (bright), behind the mask side, round the back of the head
  const sh = P.shell.map(([Z, a, c, b]) => sec(zz(Z), a * E, b * E, -c * E, { n: P.shell_n }));
  const f0 = P.shell_from;
  out.push(wrap('shell', 'Seiten- und Hinterkopfgehäuse', 'head', 'shell', sh, f0, 360 - f0, P.shell_t * E, { sharp: 30, bevel: 1.2 }));
  // 4 jaw: band round the head, chin bar with a flat front, legs behind the cheeks
  const [jz0, jz1, ja, jf, jb] = P.jaw;
  out.push(wrap('jaw_band', 'Kieferband', 'head', 'shell', [S(jz0, ja, jf, jb, 3.6), S(jz1, ja + 0.6, jf + 0.4, jb, 3.6)], -180, 180, 1.8 * E, { sub: 2, sharp: 30, bevel: 1.0 }));
  const [cw, cf] = P.chin;
  const chin = [S(jz0 - 0.6, cw, cf, jb, P.chin_n), S(jz1 + 0.4, cw + 0.4, cf + 0.3, jb, P.chin_n)];
  const cr = angX(chin[0], (cw - 1) * E);
  out.push(wrap('chin_bar', 'Kinnbügel', 'head', 'shell', chin, -cr, cr, 1.6 * E, { sharp: 25, bevel: 1.4 }));
  const [lz0, lz1] = P.legs;
  for (const [k, sx] of [['r', 1], ['l', -1]]) {
    const rows = [lz0, (lz0 + lz1) / 2, lz1].map(Z => {
      const s = MS(Z, 0.15 * E), a0 = angX(s, s.a - P.leg_w * E);
      return { ...s, a0: sx > 0 ? a0 : -sp, a1: sx > 0 ? sp : -a0 };
    });
    out.push(wrap(`jaw_leg_${k}`, 'Kieferschenkel', 'head', 'shell', rows, rows[0].a0, rows[0].a1, 1.6 * E, { sharp: 25, bevel: 1.0 }));
  }
  if (stage < 2) return out;
  // 5 cheek plates and face centre
  const tr = P.trap;
  const tx = Z => { const u = (Z - tr.z0) / (tr.z1 - tr.z0); return (tr.w0 + (tr.w1 - tr.w0) * Math.min(1, Math.max(0, u))) / 2 * E; };
  const cz0 = P.cheek.z0, cz1 = P.cheek.z1, gc = mt + 0.35 * E;
  for (const [k, sx] of [['r', 1], ['l', -1]]) {
    const lo = (Z, x0, x1) => { const s = MS(Z, gc), a0 = angX(s, x0), a1 = angX(s, x1); return { ...s, a0: sx > 0 ? a0 : -a1, a1: sx > 0 ? a1 : -a0 }; };
    const Ws = [cz0, cz0 + 4, 40, cz1].map(Z => W(Z).a * E);
    const rows = [lo(cz0, tx(cz0) + 1.6 * E, Ws[0] - 4 * E), lo(cz0 + 4, tx(cz0 + 4) + E, Ws[1] - 1.2 * E),
      lo(40, tx(40) + E, Ws[2] - 0.8 * E), lo(cz1, tx(cz1) + E, Ws[3] - 0.8 * E)];
    const j0 = [Ws[3] - 3 * E, zz(cz1 - 3)], j1 = [tx(cz0 + 7) + 2 * E, zz(cz0 + 7)];   // seam from outside top to inside bottom
    const jl = Math.hypot(j1[0] - j0[0], j1[1] - j0[1]);
    const ja_ = Math.atan2(j0[1] - j1[1], j0[0] - j1[0]) * DEG;
    const jm = [(j0[0] + j1[0]) / 2, (j0[1] + j1[1]) / 2];
    const Zm = jm[1] / E - P.z0;
    out.push(wrap(`cheek_${k}`, 'Wangenplatte', 'head', 'anodized', rows, rows[0].a0, rows[0].a1, 1.5 * E,
      { sharp: 25, bevel: 1.4, cuts: [slot([sx * jm[0], surfY(MS(Zm, gc + 1.5 * E), jm[0]), jm[1]], [12, jl + 10, 0.9 * E], 90, -sx * ja_)] }));
  }
  const gt = mt + 0.2 * E;
  const tsec = [tr.z0, (tr.z0 + tr.z1) / 2, tr.z1].map(Z => ({ ...MS(Z, gt), a0: -angX(MS(Z, gt), tx(Z)), a1: angX(MS(Z, gt), tx(Z)) }));
  const zt = tr.z1 - 3.5;
  out.push(wrap('face_center', 'Gesichtsmitte', 'head', 'graphite', tsec, tsec[0].a0, tsec[0].a1, 0.9 * E,
    { sharp: 25, bevel: 0.6, cuts: [slot([0, surfY(MS(zt, gt + 0.9 * E), 0), zz(zt)], [10, 4 * E, 2.4 * E])] }));
  for (const [k, sx] of [['r', 1], ['l', -1]]) {
    const rs = [tr.z0, tr.z1].map(Z => {
      const s = MS(Z, gt), a1_ = angX(s, tx(Z)), a0_ = angX(s, tx(Z) - tr.ridge * E);
      return { ...s, a0: sx > 0 ? a0_ : -a1_, a1: sx > 0 ? a1_ : -a0_ };
    });
    out.push(wrap(`face_ridge_${k}`, 'Seitenleiste', 'head', 'graphite', rs, rs[0].a0, rs[0].a1, 2.2 * E, { steps: 2, sharp: 25, bevel: 0.8 }));
  }
  // 6 rear module under the cap overhang: flat, landscape rectangle, fields and recesses
  const rm = P.rear, sb = sh[2];
  const yb = sb.y - sb.b - P.shell_t * E;
  const rc = [0, yb - rm.d / 2 * E + 1.0 * E, zz(rm.z)];
  out.push(['rear_module', 'Hinterkopfmodul', 'head', 'box', 'dark_metal', { d: [rm.w * E, rm.d * E, rm.h * E], c: rc, bevel: 2.4 }]);
  const yf = rc[1] - rm.d / 2 * E;
  for (const [k, sx] of [['r', 1], ['l', -1]]) {
    out.push([`rear_field_${k}`, 'Modulfeld', 'head', 'box', 'graphite', { d: [10.5 * E, 1.2 * E, 9 * E], c: [sx * 7.2 * E, yf - 0.3 * E, rc[2] + 0.6 * E], bevel: 1.0 }]);
  }
  out.push(['rear_slot', 'Modulvertiefung', 'head', 'box', 'anodized', { d: [3.4 * E, 0.8 * E, 9 * E], c: [0, yf + 0.1 * E, rc[2] + 0.6 * E], bevel: 0.6 }],
    ['rear_strip', 'Modulleiste', 'head', 'box', 'trim', { d: [24 * E, 0.6 * E, 0.9 * E], c: [0, yf - 0.1 * E, rc[2] - 5.6 * E], bevel: 0.3 }]);
  // 7 side modules at ear height: vertical oval, flat outer face, strong round rim, holder over the housing
  const cm = P.comm;
  const szz = zz(cm.z);
  const sa = sh.filter(s => s.z <= szz).at(-1);
  const xin = sa.a + P.shell_t * E;
  for (const [k, sx] of [['r', 1], ['l', -1]]) {
    const xc = sx * (xin + cm.lat / 2 * E), yc = -cm.y * E, zc = zz(cm.z);
    const hh = cm.h / 2 * E, dd = cm.d / 2 * E;
    const ov = (scaleH, scaleD, x, a, n = 3.0, m = 9) => Array.from({ length: m }, (_, i) => {
      const u = -1 + 2 * i / (m - 1);
      return sec(zc + u * hh * scaleH, a, Math.max(1.2, dd * scaleD * Math.sqrt(Math.max(0, 1 - u * u)) ** 0.85), yc, x, { n });
    });
    out.push(loft(`comm_${k}`, 'Seitenmodul', 'head', 'dark_metal', ov(1.0, 1.0, xc, cm.lat / 2 * E), { sharp: 40, bevel: 1.2 }),
      loft(`comm_${k}_rim`, 'Modulrand', 'head', 'rubber', ov(1.06, 1.06, xc + sx * (cm.lat / 2 - 1.3) * E, 1.3 * E, 2.4), { sharp: 60 }),
      loft(`comm_${k}_face`, 'Modulfläche', 'head', 'dark_metal', ov(0.84, 0.82, xc + sx * (cm.lat / 2 - 0.2) * E, 0.8 * E), { sharp: 40 }));
    const xo = xc + sx * (cm.lat / 2 + 0.6) * E;            // holder: vertical bar over the outer face up under the cap
    const top = zz(P.cap[0][0]);
    out.push([`comm_${k}_holder`, 'Modulhalterung', 'head', 'box', 'dark_metal', { d: [1.1 * E, 4 * E, top - (zc - 0.35 * hh)], c: [xo, yc, (top + zc - 0.35 * hh) / 2], bevel: 0.8 }],
      [`comm_${k}_holder_top`, 'Halterungsfuß', 'head', 'box', 'dark_metal', { d: [Math.abs(xo) - xin + 2 * E, 4 * E, 1.4 * E], c: [sx * (xin + Math.abs(xo)) / 2, yc, top - 0.2 * E], bevel: 0.6 }],
      cyl(`comm_${k}_pin`, 'Halterungsschraube', 'head', 'trim', 'x', 1.1 * E, 1.4 * E, [xo + sx * 0.4 * E, yc, zc]));
  }
  // 8 antennas: long thin one on the right of the body (+X), short thick rod opposite
  const an = P.antenna, st = P.stub;
  const xa = xin + cm.lat * E * 0.55;
  const a0 = [xa, -cm.y * E + cm.d / 2 * E * 0.55, zz(cm.z) + cm.h / 2 * E * 0.7];
  const a1 = [xa + 0.8 * E, a0[1] - 0.6 * E, zz(100 + an.over)];
  out.push(tube('antenna', 'Stabantenne', 'head', 'dark_metal', [a0, a1], an.r * E, { segs: 8 }),
    cyl('antenna_tip', 'Antennenspitze', 'head', 'trim', 'z', an.r * E + 0.7, 4, [a1[0], a1[1], a1[2] + 1]),
    ['antenna_clip', 'Antennenhalter', 'head', 'box', 'dark_metal', { d: [2.6 * E, 3 * E, 4 * E], c: [a0[0], a0[1], a0[2] + 1.5 * E], bevel: 0.6 }]);
  const t_ = st.tilt / DEG;
  const b0 = [-xa, a0[1], a0[2]];
  const b1 = [b0[0] - st.len * E * Math.sin(t_), b0[1], b0[2] + st.len * E * Math.cos(t_)];
  out.push(tube('stub', 'Antennenstab', 'head', 'dark_metal', [b0, b1], st.d / 2 * E, { segs: 12 }),
    tube('stub_cap', 'Endkappe', 'head', 'graphite', [lerp(b0, b1, 0.86), lerp(b0, b1, 1.05)], st.cap / 2 * E, { segs: 16 }),
    ['stub_clip', 'Stabhalter', 'head', 'box', 'dark_metal', { d: [3.4 * E, 3.4 * E, 4 * E], c: [b0[0], b0[1], b0[2] + 1.2 * E], bevel: 0.6 }]);
  // 9 cable: ribbed (helix round a core), from the lower module rim round the back of the head to the other module
  const cb = P.cable;
  const sc = { ...sh.filter(s => s.z <= zz(cb.z)).at(-1), z: zz(cb.z) };
  const yc = -cm.y * E, zb = zz(cm.z) - cm.h / 2 * E * 0.86, xm = xin + cm.lat / 2 * E;
  const path = [[xm, yc, zb], [xm - 0.4 * E, yc - 1.6 * E, zb - 3 * E]];
  for (let u = 78; u < 283; u += 12) path.push(contourPt(sc, u, (P.shell_t + cb.off) * E));
  path.push([-xm + 0.4 * E, yc - 1.6 * E, zb - 3 * E], [-xm, yc, zb]);
  out.push(tube('cable', 'Kabelseele', 'head', 'rubber', path, cb.d / 2 * E * 0.72, { segs: 10 }));
  // helix: points along the path
  const L = [0];
  for (let i = 0; i < path.length - 1; i++) L.push(L.at(-1) + dist(path[i], path[i + 1]));
  const turns = Math.trunc(L.at(-1) / (cb.pitch * E));
  const helix = [];
  for (let i = 0; i <= turns * 8; i++) {
    const s_ = L.at(-1) * i / (turns * 8);
    let j = L.length - 2;
    if (s_ < L.at(-1)) for (let k = 0; k < L.length - 1; k++) if (L[k] <= s_) j = k;
    const t = (s_ - L[j]) / Math.max(L[j + 1] - L[j], 1e-6);
    const p = lerp(path[j], path[j + 1], t);
    let d = [0, 1, 2].map(m => path[j + 1][m] - path[j][m]);
    const dl = Math.hypot(...d) || 1;
    d = d.map(v => v / dl);
    const up = Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    let n1 = [d[1] * up[2] - d[2] * up[1], d[2] * up[0] - d[0] * up[2], d[0] * up[1] - d[1] * up[0]];
    const nl = Math.hypot(...n1) || 1;
    n1 = n1.map(v => v / nl);
    const n2 = [d[1] * n1[2] - d[2] * n1[1], d[2] * n1[0] - d[0] * n1[2], d[0] * n1[1] - d[1] * n1[0]];
    const ang = 2 * Math.PI * i / 8, r = cb.d / 2 * E * 0.78;
    helix.push([0, 1, 2].map(m => p[m] + r * (Math.cos(ang) * n1[m] + Math.sin(ang) * n2[m])));
  }
  out.push(tube('cable_wrap', 'Kabelwendel', 'head', 'rubber', helix, cb.d / 2 * E * 0.24, { segs: 6 }));
  for (const [k, sx] of [['r', 1], ['l', -1]]) {         // plugs into the modules
    out.push(tube(`cable_plug_${k}`, 'Kabelanschluss', 'head', 'dark_metal', [[sx * xm, yc, zb - 0.8 * E], [sx * xm, yc, zb + 1.6 * E]], cb.d / 2 * E * 1.15, { segs: 12 }));
  }
  return out;
}
