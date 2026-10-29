// Part helpers of the robot bodies (port of cubeescape-ballon basic/robot/shapes.py, round 5). A part is an array
// [id, German name, segment, form, role, params] as in Ballon; forms loft/wrap/tube (forms.js), cyl, box, hull and plate (mesh.js).
import { sec } from './forms.js';

export const loft = (pid, de, seg, role, secs, kw = {}) => [pid, de, seg, 'loft', role, { secs, ...kw }];
export const wrap = (pid, de, seg, role, secs, a0, a1, t, kw = {}) => [pid, de, seg, 'wrap', role, { secs, a0, a1, t, ...kw }];

// Closed ring (vertebra, belt, neck ring) around the segment axis.
export function ring(pid, de, seg, role, z0, z1, a, b, t, { n = 2.4, ...kw } = {}) {
  return wrap(pid, de, seg, role, [sec(z0, a, b, { n }), sec(z1, a, b, { n })], -180, 180, t, { sub: 1, ...kw });
}

// Cross-section from a table [[z, a, b, y]…] read linearly: f(z, grow = 0, { n = 2.6, …extra }) → sec. ch > 0: chamfered
// cross-section as Arm v3; grow offsets the chamfers in parallel.
export function tab(table, ch = 0) {
  const pairs = table.slice(0, -1).map((r, i) => [r, table[i + 1]]);
  return (z, grow = 0, { n = 2.6, ...extra } = {}) => {
    const [[z0, a0, b0, y0], [z1, a1, b1, y1]] = pairs.find(p => z <= p[1][0]) ?? pairs[pairs.length - 1];
    const u = Math.max(0, Math.min(1, (z - z0) / (z1 - z0)));
    return sec(z, a0 + (a1 - a0) * u + grow, b0 + (b1 - b0) * u + grow, y0 + (y1 - y0) * u,
      { n, ch: ch ? ch + grow * (2 - Math.SQRT2) : 0, ...extra });
  };
}

// Arrow cut (Arm v3): plate over f with full width a0..a1 up to z_full, narrowing to ±tip degrees at z_tip.
export function arrow(f, zFull, zTip, a0, a1, grow, { n = 2.6, tip = 3 } = {}) {
  return [f(zFull, grow, { n, a0, a1 }), f(zTip, grow, { n, a0: -tip, a1: tip })];
}

// Two bright bolts on the front (+Y) of f at z, grow = distance above the contour.
export function twoBolts(name, seg, f, z, grow, { dx = 14, r = 4.2 } = {}) {
  const s = f(z, grow);
  return [['a', -1], ['b', 1]].map(([k, sx]) => [`${name}_bolt_${k}`, 'Bolzen', seg, 'cyl', 'trim',
    { axis: 'y', r, len: 4, c: [sx * dx, s.y + s.b + 1.0, z] }]);
}

// Disc, bright ring, hub – the medallion motif of the elbow.
export function medallion(name, seg, c, r, length, axis = 'x') {
  return [[`${name}_disc`, 'Medaillon', seg, 'cyl', 'graphite', { axis, r, len: length, c }],
    [`${name}_ring`, 'Medaillonring', seg, 'cyl', 'trim', { axis, r: r * 0.76, len: length + 4, c }],
    [`${name}_hub`, 'Medaillonnabe', seg, 'cyl', 'graphite', { axis, r: r * 0.52, len: length + 8, c }]];
}
