// Arms of the robot bodies (port of cubeescape-ballon basic/arms/robot_arm.py, Arm v3, and basic/robot/arms.py): upper and
// forearm, elbow, gimbal wrist, hand with four fingers and a thumb. Segment frames: origin in the joint at the segment start,
// +Z along the segment, +Y outside/back (armour side, back of the hand), +X thumb side of the right hand; the left side is
// mirrored at X. Forms box, cyl, hull (point cloud) and plate (faceted plate, mesh.js › plateHull).

const HAND_SCALE = 0.65 * 1.4;
const HAND_BULK = 1.20;
export const ARM_BULK = 1.15;
export const UPPER_MM = 320.0, FORE_MM = 300.0;
const S_ = HAND_SCALE * 1000;
const PALM_START = 0.014 * S_, PALM_LEN = 0.082 * S_;
const PALM_W = 0.086 * S_ * HAND_BULK, PALM_T = 0.042 * S_ * HAND_BULK;
export const KNUCKLE_Z = 0.096 * S_;
export const FINGER_X = [30.5, 10.2, -10.2, -30.5];
export const FINGER_SCALE = [1.0, 1.06, 1.0, 0.84];
export const FINGER_LINKS = [0.034 * S_, 0.027 * S_, 0.022 * S_];
const FINGER_W = 18.2, FINGER_D = 0.020 * S_ * HAND_BULK;
export const THUMB_BASE = [0.046 * S_ * HAND_BULK, 0.002 * S_, 0.030 * S_];
export const THUMB_DIR = [0.55, -0.35, 0.75];
export const THUMB_LINKS = [0.036 * S_, 0.028 * S_, 0.022 * S_];

// Finger poses (degrees per link; thumb: flexion, abduction, tip).
export const FINGER_POSES = {
  open: { f: Array(4).fill([4, 4, 3]), t: [6, 34, 4] },
  relaxed: { f: [[14, 18, 12], [18, 22, 14], [22, 26, 16], [26, 30, 18]], t: [12, 30, 8] },
};

export const SEGMENTS = ['upper', 'fore', 'hand', ...[0, 1, 2, 3].flatMap(i => [0, 1, 2].map(j => `f${i}_${j}`)), 't_0', 't_1', 't_2'];

const plate = (z, w, r, t, ridge, hip, phi = 0, u = 0) => ({ z, w, r, t, ridge, hip, phi, u });

// Accent line on the ridge of a faceted plate (same slope as the base).
function ridgeLine(p, width = 3.2, depth = 1.6) {
  const [z0, z1] = p.z, [r0, r1] = p.r;
  const za = z0 + p.hip[0], zb = z1 - p.hip[1];
  const r = z => r0 + (r1 - r0) * (z - z0) / (z1 - z0) + p.t + p.ridge - depth * 0.6;
  return plate([za, zb], [width, width], [r(za), r(zb)], depth, 0.0, [0.0, 0.0], p.phi, p.u);
}

// Chamfered rectangular cross-section (8 points) at z: width w, from y0 (inside) to y1 (outside), chamfer ch.
function section(w, y0, y1, ch, z) {
  const out = [];
  for (const sx of [-1, 1]) for (const y of [y0 + ch, y1 - ch]) out.push([sx * w / 2, y, z]);
  for (const sx of [-1, 1]) for (const y of [y0, y1]) out.push([sx * (w / 2 - ch), y, z]);
  return out;
}

// Upper half of a chamfered cross-section (shell): sides at z, top at z_top (arrow cut when different).
function sectionTop(w, y0, y1, ch, z, zTop = null) {
  const zt = zTop ?? z;
  return [...[-1, 1].map(sx => [sx * w / 2, y0, z]), ...[-1, 1].map(sx => [sx * w / 2, y1 - ch, z]), ...[-1, 1].map(sx => [sx * (w / 2 - ch), y1, zt])];
}

// Scale the cross-section (X/Y) of the upper and forearm parts by k; lengths (Z) stay.
export function bulk(P, k) {
  return P.map(([pid, de, seg, kind, role, p]) => {
    if (seg === 'upper' || seg === 'fore') {
      p = { ...p };
      if (p.pts) p.pts = p.pts.map(([x, y, z]) => [x * k, y * k, z]);
      if (p.c) p.c = [p.c[0] * k, p.c[1] * k, p.c[2]];
      if (kind === 'cyl') { p.r *= k; if (p.axis !== 'z') p.len *= k; }
    }
    return [pid, de, seg, kind, role, p];
  });
}

export function armParts() {
  const P = [];
  P.push(['upper_body', 'Oberarmkörper', 'upper', 'hull', 'graphite', { pts: [...section(104, -48, 44, 18, 20), ...section(112, -50, 48, 18, 150), ...section(92, -42, 38, 16, 300)] }],
    ['upper_shell', 'Oberarmschale', 'upper', 'hull', 'shell', { pts: [...sectionTop(112, -20, 54, 22, 40), ...sectionTop(120, -22, 58, 22, 150), ...sectionTop(100, -16, 48, 20, 276, 300)] }]);
  P.push(['elbow', 'Ellbogengelenk', 'fore', 'cyl', 'dark_metal', { axis: 'x', r: 40, len: 92, c: [0, 0, 0] }],
    ['elbow_disc', 'Ellbogenscheibe', 'fore', 'cyl', 'graphite', { axis: 'x', r: 36, len: 98, c: [0, 0, 0] }],
    ['elbow_ring', 'Ellbogenring', 'fore', 'cyl', 'trim', { axis: 'x', r: 27, len: 102, c: [0, 0, 0] }],
    ['elbow_hub', 'Ellbogennabe', 'fore', 'cyl', 'graphite', { axis: 'x', r: 19, len: 104, c: [0, 0, 0] }]);
  const sh0 = [104, -18, 48, 20, 58, 34], shm = [112, -20, 52, 22, 100, 100], sh1 = [68, -10, 32, 13, 250, 250];   // w, y0, y1, chamfer, z sides, z top
  const shellTop = z => { const [a, b] = z <= shm[5] ? [sh0, shm] : [shm, sh1]; return a[2] + (b[2] - a[2]) * (z - a[5]) / (b[5] - a[5]); };
  const forePts = [];
  for (const z of [52, 132]) for (const sx of [-1.6, 1.6]) for (const dy of [-0.8, 0.9]) forePts.push([sx, shellTop(z) + dy, z]);
  const topPts = [];
  for (const [z, w] of [[176, 56], [260, 42]]) for (const x of [-w / 2, w / 2]) for (const dy of [-3, 7]) topPts.push([x, shellTop(z) + dy, z]);
  for (const dy of [-3, 7]) topPts.push([0, shellTop(140) + dy, 140]);
  P.push(['fore_body', 'Unterarmkörper', 'fore', 'hull', 'graphite', { pts: [...section(92, -42, 36, 16, 24), ...section(104, -48, 42, 18, 100), ...section(60, -27, 23, 10, 262)] }],
    ['fore_shell', 'Unterarmschale', 'fore', 'hull', 'shell', { pts: [...sectionTop(...sh0.slice(0, 5), sh0[5]), ...sectionTop(...shm.slice(0, 5), shm[5]), ...sectionTop(...sh1.slice(0, 5), sh1[5])] }],
    ['fore_inset', 'Akzentlinie', 'fore', 'hull', 'accent', { pts: forePts }],
    ['fore_top', 'Handgelenkplatte', 'fore', 'hull', 'anodized', { pts: topPts }],
    ['fore_bolt_a', 'Bolzen', 'fore', 'cyl', 'trim', { axis: 'y', r: 4.2, len: 4, c: [-14, shellTop(230) + 8, 230] }],
    ['fore_bolt_b', 'Bolzen', 'fore', 'cyl', 'trim', { axis: 'y', r: 4.2, len: 4, c: [14, shellTop(230) + 8, 230] }],
    ['fore_cuff', 'Stulpe', 'fore', 'hull', 'dark_metal', { pts: [...section(72, -32, 36, 16, 264), ...section(76, -34, 38, 17, 296)] }],
    ['fore_cuff_trim', 'Stulpenkante', 'fore', 'hull', 'trim', { pts: [...section(75, -33.5, 37.5, 16.5, 262), ...section(75, -33.5, 37.5, 16.5, 266)] }]);
  // hand: gimbal block (in the cuff), palm, back shell with ridge, knuckle guard, thumb mount
  const back = plate([-4, KNUCKLE_Z - 14], [66, PALM_W - 6], [PALM_T / 2 - 1, PALM_T / 2 - 1], 5, 9, [22, 14]);
  P.push(['wrist_block', 'Kardanblock', 'hand', 'box', 'dark_metal', { d: [36, 32, 24], c: [0, 0, 2], bevel: 3 }],
    ['wrist_pin', 'Kardanbolzen', 'hand', 'cyl', 'trim', { axis: 'x', r: 8, len: 42, c: [0, 0, 2] }],
    ['palm', 'Handfläche', 'hand', 'box', 'graphite', { d: [PALM_W, PALM_T, PALM_START + PALM_LEN - 6], c: [0, 0, (PALM_START + PALM_LEN + 6) / 2], bevel: 6 }],
    ['back_plate', 'Handrückenschale', 'hand', 'plate', 'shell', back],
    ['back_inset', 'Handrücken-Akzentlinie', 'hand', 'plate', 'accent', ridgeLine(back, 2.8, 1.4)],
    ['knuckles', 'Knöchelwelle', 'hand', 'cyl', 'dark_metal', { axis: 'x', r: 10, len: PALM_W - 4, c: [0, 2, KNUCKLE_Z - 4] }],
    ['knuckle_guard', 'Knöchelschutz', 'hand', 'plate', 'dark_metal', plate([KNUCKLE_Z - 16, KNUCKLE_Z + 2], [PALM_W + 2, PALM_W + 2], [PALM_T / 2, PALM_T / 2], 5, 4, [5, 5])],
    ['thumb_mount', 'Daumensockel', 'hand', 'box', 'graphite', { d: [22, 30, 34], c: [THUMB_BASE[0] - 7, THUMB_BASE[1], THUMB_BASE[2]], bevel: 5 }]);
  // fingers: per link core, faceted plate, joint
  FINGER_X.forEach((_, i) => FINGER_LINKS.forEach((L0, j) => {
    const L = L0 * FINGER_SCALE[i], seg = `f${i}_${j}`;
    P.push([`${seg}_core`, `Finger ${i + 1} Glied ${j + 1}`, seg, 'box', 'graphite', { d: [FINGER_W - 2, FINGER_D - 2, L - 4], c: [0, 0, L / 2], bevel: 2.5 }],
      [`${seg}_plate`, `Finger ${i + 1} Glied ${j + 1} Platte`, seg, 'plate', 'shell', plate([2, L - 2], [FINGER_W - 3, FINGER_W - 4], [FINGER_D / 2 - 2, FINGER_D / 2 - 2], 3, 3, [L * 0.3, L * 0.25])],
      [`${seg}_joint`, `Finger ${i + 1} Gelenk ${j + 1}`, seg, 'cyl', 'dark_metal', { axis: 'x', r: 7, len: FINGER_W, c: [0, 0, 0] }]);
  }));
  THUMB_LINKS.forEach((L, j) => {
    const seg = `t_${j}`;
    P.push([`${seg}_core`, `Daumen Glied ${j + 1}`, seg, 'box', 'graphite', { d: [FINGER_W + 2, FINGER_D + 1, L - 4], c: [0, 0, L / 2], bevel: 2.5 }],
      [`${seg}_plate`, `Daumen Glied ${j + 1} Platte`, seg, 'plate', 'shell', plate([2, L - 2], [FINGER_W - 2, FINGER_W - 3], [FINGER_D / 2 - 1.5, FINGER_D / 2 - 1.5], 3, 3, [L * 0.3, L * 0.25])],
      [`${seg}_joint`, `Daumengelenk ${j + 1}`, seg, 'cyl', 'dark_metal', { axis: 'x', r: 7.6, len: FINGER_W + 3, c: [0, 0, 0] }]);
  });
  return bulk(P, ARM_BULK);
}

// Arms on the robot (basic/robot/arms.py): Arm v3 parts without the dropped ones, upper and forearm bulked by the study's
// factor, plus the study's own extra parts.
export const robotArmParts = ({ bulk: k, drop, extra }) => [...bulk(armParts().filter(p => !drop.includes(p[0])), k), ...extra];
