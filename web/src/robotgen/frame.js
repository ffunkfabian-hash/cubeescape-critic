// Segment frames of the robot bodies (cubeescape-ballon basic/robot._frame and tools/ego_build.frame_from).

const unit = v => { const L = Math.hypot(...v); return v.map(c => c / L); };
const crossV = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

// Frame from direction z and hint y: z normalised, y = hint orthogonal to z, x = y × z. Returns the columns [x, y, z].
export function frameFrom(z, yHint) {
  const zz = unit(z), d = yHint[0] * zz[0] + yHint[1] * zz[1] + yHint[2] * zz[2];
  const y = unit(yHint.map((h, i) => h - d * zz[i]));
  return [crossV(y, zz), y, zz];
}

// Segment frame: z from A to B, y = hint perpendicular to it, x = y × z.
export const frame = (A, B, hint) => frameFrom(B.map((b, i) => b - A[i]), hint);

// Python round() to an integer: halves to the even neighbour.
export function pyRound(v) {
  const f = Math.floor(v), d = v - f;
  if (Math.abs(d - 0.5) < 1e-12) return f % 2 === 0 ? f : f + 1;
  return Math.round(v);
}
