// Curved forms of the robot bodies (port of cubeescape-ballon basic/arms/forms.py at the commit pinned in
// robotgen/data/SOURCE.json): superellipse cross-sections, loft, wrap (armour plate) and tube. Pure geometry in mm in the
// segment frame (+Z along the segment, +Y front/armour side); every builder returns { V: [[x, y, z]…], F: [[i, j, k(, l)]…] }
// with faces oriented outwards. The bevelled variants used for the meshes live in bevel.js.

// Cross-section at z. sec(z, a, b, [y, [x]], [{ n, ch, a0, a1, … }]): half width a (X), half height b (Y), centre (x, y),
// exponent n (2 ellipse, 4 rounded rectangle); ch > 0: chamfered rectangle instead of the superellipse.
export function sec(z, a, b, ...rest) {
  const nums = rest.filter(v => typeof v === 'number');
  const o = rest.find(v => v && typeof v === 'object') ?? {};
  const { y = nums[0] ?? 0, x = nums[1] ?? 0, n = 2.6, ch = 0, ...kw } = o;
  return { z, a, b, y, x, n, ch, ...kw };
}

// Monotone tangents (Fritsch–Carlson) over uniform steps: no overshoot between the cross-sections.
function tangents(y) {
  const n = y.length;
  const d = [];
  for (let i = 0; i < n - 1; i++) d.push(y[i + 1] - y[i]);
  const m = [d[0]];
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
    if (h > 9) { const k = 3 / Math.sqrt(h); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
  }
  return m;
}

// Densify cross-sections smoothly: sub steps per span, every numeric field monotone cubic (Hermite).
export function resample(secs, sub = 6) {
  if (secs.length < 2 || sub <= 1) return secs.map(s => ({ ...s }));
  const keys = Object.keys(secs[0]).filter(k => typeof secs[0][k] === 'number');
  const tan = Object.fromEntries(keys.map(k => [k, tangents(secs.map(s => s[k]))]));
  const out = [];
  for (let i = 0; i < secs.length - 1; i++) {
    for (let j = 0; j < sub; j++) {
      const t = j / sub;
      const h00 = 2 * t ** 3 - 3 * t * t + 1, h10 = t ** 3 - 2 * t * t + t, h01 = -2 * t ** 3 + 3 * t * t, h11 = t ** 3 - t * t;
      out.push(Object.fromEntries(keys.map(k => [k, h00 * secs[i][k] + h10 * tan[k][i] + h01 * secs[i + 1][k] + h11 * tan[k][i + 1]])));
    }
  }
  out.push(Object.fromEntries(keys.map(k => [k, secs[secs.length - 1][k]])));
  return out;
}

const RAD = Math.PI / 180;

// Point of the contour of s at angle ang (degrees, 0 = +Y, positive towards +X), grown outwards by grow.
export function pt(s, ang, grow = 0) {
  const t = ang * RAD, si = Math.sin(t), co = Math.cos(t);
  const a = s.a + grow, b = s.b + grow;
  if ((s.ch ?? 0) > 0) {          // ray from the centre to the chamfered rectangle; chamfer line offset in parallel by grow
    const c = Math.min(s.ch, a - 0.1, b - 0.1);
    const r = Math.min(Math.abs(si) > 1e-9 ? a / Math.abs(si) : 1e9, Math.abs(co) > 1e-9 ? b / Math.abs(co) : 1e9,
      (a + b - c - grow * (2 - Math.SQRT2)) / (Math.abs(si) + Math.abs(co)));
    return [s.x + r * si, s.y + r * co, s.z];
  }
  const e = 2 / s.n;
  return [s.x + a * Math.sign(si) * Math.abs(si) ** e, s.y + b * Math.sign(co) * Math.abs(co) ** e, s.z];
}

function volume(V, F) {
  let vol = 0;
  for (const f of F) {
    const a = V[f[0]];
    for (let j = 1; j < f.length - 1; j++) {
      const b = V[f[j]], c = V[f[j + 1]];
      vol += a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);
    }
  }
  return vol / 6;
}

// Faces turned so the volume is positive (normals outwards), whatever the direction in z.
export function orient(V, F) {
  return volume(V, F) > 0 ? F : F.map(f => [...f].reverse());
}

export function loft(secs, ring = 40, sub = 6) {
  const S = resample(secs, sub);
  const V = [], F = [];
  for (const s of S) for (let k = 0; k < ring; k++) V.push(pt(s, 360 * k / ring));
  for (let i = 0; i < S.length - 1; i++) {
    const a = i * ring, b = (i + 1) * ring;
    for (let k = 0; k < ring; k++) { const k2 = (k + 1) % ring; F.push([a + k, b + k, b + k2, a + k2]); }
  }
  for (const [idx, flip] of [[0, true], [S.length - 1, false]]) {
    const s = S[idx], c = V.length, base = idx * ring;
    V.push([s.x, s.y, s.z]);
    for (let k = 0; k < ring; k++) { const k2 = (k + 1) % ring; F.push(flip ? [c, base + k, base + k2] : [c, base + k2, base + k]); }
  }
  return { V, F: orient(V, F) };
}

// Armour plate over the contour of the cross-sections (inside = contour, outside = contour + t); a0/a1 may differ per
// cross-section (arrow cut); a1 − a0 = 360 gives a closed ring.
export function wrap(secs, a0, a1, t, steps = null, sub = 6) {
  const S = resample(secs.map(s => ({ ...s, a0: s.a0 ?? a0, a1: s.a1 ?? a1 })), sub);
  const closed = Math.abs((a1 - a0) - 360) < 1e-6;
  const n = steps || Math.max(8, Math.trunc(Math.abs(a1 - a0) / 6));
  const cols = closed ? n : n + 1;
  const V = [], F = [];
  for (const s of S) for (const g of [0, t]) for (let k = 0; k < cols; k++) V.push(pt(s, s.a0 + (s.a1 - s.a0) * k / n, g));
  const row = 2 * cols, ix = (i, layer, k) => i * row + layer * cols + (k % cols);
  for (let i = 0; i < S.length - 1; i++) {
    for (let k = 0; k < n; k++) {
      F.push([ix(i, 1, k), ix(i + 1, 1, k), ix(i + 1, 1, k + 1), ix(i, 1, k + 1)]);   // outside
      F.push([ix(i, 0, k + 1), ix(i + 1, 0, k + 1), ix(i + 1, 0, k), ix(i, 0, k)]);   // inside
    }
    if (!closed) {
      F.push([ix(i, 0, 0), ix(i + 1, 0, 0), ix(i + 1, 1, 0), ix(i, 1, 0)]);
      F.push([ix(i, 1, n), ix(i + 1, 1, n), ix(i + 1, 0, n), ix(i, 0, n)]);
    }
  }
  for (const [i, flip] of [[0, true], [S.length - 1, false]]) {
    for (let k = 0; k < n; k++) {
      const q = [ix(i, 0, k), ix(i, 0, k + 1), ix(i, 1, k + 1), ix(i, 1, k)];
      F.push(flip ? q.reverse() : q);
    }
  }
  return { V, F: orient(V, F) };
}

const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = v => { const L = Math.hypot(...v) || 1; return [v[0] / L, v[1] / L, v[2] / L]; };

// Tube of radius r along path [[x, y, z]…]; corners smooth (monotone Hermite), frame carried in parallel, ends closed.
export function tube(path, r, segs = 14, sub = 4) {
  let P = path.map(p => ({ x: p[0], y: p[1], z: p[2] }));
  if (path.length > 2) P = resample(P, sub);
  P = P.map(p => [p.x, p.y, p.z]);
  const T = P.map((_, i) => norm(sub3(P[Math.min(i + 1, P.length - 1)], P[Math.max(i - 1, 0)])));
  const up = Math.abs(T[0][1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  let N = norm(cross(cross(T[0], up), T[0]));
  const V = [], F = [];
  P.forEach((p, i) => {
    if (i) { const B = cross(T[i], N); N = norm(cross(B, T[i])); }
    const B = norm(cross(T[i], N));
    for (let k = 0; k < segs; k++) {
      const a = 2 * Math.PI * k / segs;
      V.push([0, 1, 2].map(j => p[j] + r * (Math.cos(a) * N[j] + Math.sin(a) * B[j])));
    }
  });
  for (let i = 0; i < P.length - 1; i++) {
    for (let k = 0; k < segs; k++) {
      const k2 = (k + 1) % segs;
      F.push([i * segs + k, i * segs + k2, (i + 1) * segs + k2, (i + 1) * segs + k]);
    }
  }
  for (const [i, flip] of [[0, true], [P.length - 1, false]]) {
    const c = V.length;
    V.push(P[i]);
    for (let k = 0; k < segs; k++) { const k2 = (k + 1) % segs; F.push(flip ? [c, i * segs + k2, i * segs + k] : [c, i * segs + k, i * segs + k2]); }
  }
  return { V, F: orient(V, F) };
}
