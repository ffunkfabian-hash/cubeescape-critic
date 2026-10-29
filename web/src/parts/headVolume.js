// Shared outer volume of the helmet, lofted from drawn profiles: for every height y the top-view outline (normalised,
// chamfered front corners) is scaled to the half width w(y) from the front profile and placed between the back and
// front edges zb(y), zf(y) of the side profile. Front and side silhouettes are therefore exact and the dome tapers
// smoothly. `inflate` scales it about the head centre, so shells (face plate, head band) can sit a few mm proud.
import * as THREE from 'three';
import { D } from '../params.js';
import { brush } from '../geo.js';

// Smooth a top-to-bottom profile [[a, y], ...] and return a function y -> a (linear between dense samples).
function profileFn(pts) {
  const curve = new THREE.CatmullRomCurve3(pts.map(([a, y]) => new THREE.Vector3(a, y, 0)), false, 'centripetal');
  const s = curve.getSpacedPoints(200).map((p) => [p.x, p.y]).sort((p, q) => p[1] - q[1]);
  return (y) => {
    if (y <= s[0][1]) return s[0][0];
    if (y >= s[s.length - 1][1]) return s[s.length - 1][0];
    let i = 1;
    while (s[i][1] < y) i++;
    const [a0, y0] = s[i - 1], [a1, y1] = s[i];
    return a0 + ((a1 - a0) * (y - y0)) / Math.max(y1 - y0, 1e-9);
  };
}

function topOutline(half, n = 64) {
  const full = [...half, ...half.slice(1, -1).reverse().map(([u, v]) => [-u, v])];
  const curve = new THREE.CatmullRomCurve3(full.map(([u, v]) => new THREE.Vector3(u, v, 0)), true, 'centripetal');
  return curve.getSpacedPoints(n).slice(0, -1).map((p) => [p.x, p.y]);
}

export function loftGeometry(rows = 72, roundedCrown = false) {
  const P = D.profile;
  const w = profileFn(P.front), zf = profileFn(P.sideFront), zb = profileFn(P.sideBack);
  const ring = topOutline(P.topHalf);
  const yTop = Math.min(P.front[0][1], P.sideFront[0][1], P.sideBack[0][1]);
  const yBot = Math.max(P.front.at(-1)[1], P.sideFront.at(-1)[1], P.sideBack.at(-1)[1]);
  const pos = [];
  const idx = [];
  // Rows from bottom to top; cosine spacing puts more rows near the rounded top.
  for (let j = 0; j <= rows; j++) {
    const t = j / rows;
    const y = yBot + (yTop - yBot) * Math.sin((t * Math.PI) / 2);
    let hw = Math.max(w(y), 1e-4), f = zf(y), b = zb(y);
    const rounding = D.crownRounding;
    let round = rounding.strength * THREE.MathUtils.smoothstep(y, rounding.startY, rounding.endY);
    if (roundedCrown) {
      // A curved ellipsoidal roof removes both the flat shoulders and the long
      // plateau beside the band. Preserve the original rim and face volume.
      const dome = D.crownDome;
      const mix = THREE.MathUtils.smoothstep(y, dome.startY, dome.endY);
      const height = THREE.MathUtils.clamp((y - dome.baseY) / (yTop - dome.baseY), 0, 1);
      const radius = Math.sqrt(1 - height * height);
      hw = THREE.MathUtils.lerp(hw, Math.max(dome.radiusX * radius, 1e-4), mix);
      f = THREE.MathUtils.lerp(f, dome.radiusFront * radius, mix);
      b = THREE.MathUtils.lerp(b, -dome.radiusBack * radius, mix);
      round = THREE.MathUtils.lerp(round, 1, mix);
    }
    for (const [u, v] of ring) {
      const length = Math.hypot(u, v);
      const ru = THREE.MathUtils.lerp(u, u / length, round);
      const rv = THREE.MathUtils.lerp(v, v / length, round);
      pos.push(ru * hw, y, b + ((rv + 1) / 2) * (f - b));
    }
  }
  const n = ring.length;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < n; i++) {
      const a = j * n + i, b = j * n + ((i + 1) % n), c = a + n, d = b + n;
      idx.push(a, c, b, b, c, d);
    }
  }
  // Caps: fan to the centre of the bottom and top rings.
  const capCentre = (j) => {
    let x = 0, y = 0, z = 0;
    for (let i = 0; i < n; i++) [x, y, z] = [x + pos[(j * n + i) * 3], y + pos[(j * n + i) * 3 + 1], z + pos[(j * n + i) * 3 + 2]];
    pos.push(x / n, y / n, z / n);
    return pos.length / 3 - 1;
  };
  const cb = capCentre(0), ct = capCentre(rows);
  for (let i = 0; i < n; i++) {
    idx.push(cb, i, (i + 1) % n);
    idx.push(ct, rows * n + ((i + 1) % n), rows * n + i);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  // Orient triangles outwards (winding depends on the outline direction).
  const tmp = geo.clone().toNonIndexed();
  tmp.computeVertexNormals();
  const p = tmp.attributes.position, nm = tmp.attributes.normal;
  let out = 0;
  for (let i = 0; i < p.count; i++) out += nm.getX(i) * p.getX(i) + nm.getY(i) * (p.getY(i) - 0.1) + nm.getZ(i) * p.getZ(i);
  if (out < 0) {
    for (let i = 0; i < idx.length; i += 3) [idx[i + 1], idx[i + 2]] = [idx[i + 2], idx[i + 1]];
    geo.setIndex(idx);
  }
  geo.computeVertexNormals();
  return geo;
}

export function headVolume(inflate = 1, roundedCrown = false) {
  return brush(loftGeometry(72, roundedCrown), { scale: inflate, rot: [D.head.tilt, 0, 0] });
}
