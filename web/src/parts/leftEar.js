// LeftEar_Cap (+X): contoured white ear cap with a textured insert, the head band over the top and the dark bracket.
import * as THREE from 'three';
import { D } from '../params.js';
import { brush, csg, hitSurface, orient, SUBTRACTION, INTERSECTION } from '../geo.js';
import { headVolume } from './headVolume.js';

// Side module B: flat, angular, irregular quadrilateral in (z, y) relative to its centre; top and bottom edges slanted,
// the front lower corner more rounded.
const CAP = [[0.09, 0.125], [-0.12, 0.15], [-0.135, -0.11], [-0.02, -0.15], [0.055, -0.135], [0.09, -0.09]];

function sidePlate(pts, depth, bevel, outerX, cz, cy) {
  // Round corners along the existing polygon instead of beveling a rectangular-looking silhouette.
  const rounded = new THREE.Shape();
  const edges = pts.map((p, i) => {
    const previous = pts[(i + pts.length - 1) % pts.length], next = pts[(i + 1) % pts.length];
    return { p, in: [p[0] + (previous[0] - p[0]) * 0.17, p[1] + (previous[1] - p[1]) * 0.17],
      out: [p[0] + (next[0] - p[0]) * 0.17, p[1] + (next[1] - p[1]) * 0.17] };
  });
  rounded.moveTo(...edges[0].in);
  for (const e of edges) { rounded.lineTo(...e.in); rounded.quadraticCurveTo(...e.p, ...e.out); }
  rounded.closePath();
  const geo = new THREE.ExtrudeGeometry(rounded, {
    depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 6,
  });
  geo.rotateY(-Math.PI / 2); // (u, v, w) -> (-w, v, u): outline in (z, y), thickness towards -X
  geo.translate(outerX - bevel, cy, cz);
  return geo;
}

// Strip of a shell offset from the head surface, limited to a slab around z = zc.
function bandShell(dIn, dOut, zc, half, yMin) {
  // Offsets as uniform scale of the head volume (radius ~0.45).
  const outer = headVolume(1 + dOut / 0.45, true);
  const inner = headVolume(1 + dIn / 0.45, true);
  const slab = brush(new THREE.BoxGeometry(2, 1, half * 2), { pos: [0, yMin + 0.5, zc] });
  return csg(outer, [SUBTRACTION, inner], [INTERSECTION, slab]).geometry;
}

export function buildLeftEar(M, { headBandOnly = false } = {}) {
  const g = new THREE.Group();
  g.name = 'LeftEar_Cap';
  const e = D.earL;

  const cap = new THREE.Mesh(sidePlate(CAP, 0.035, 0.012, e.outerX, e.cz, e.cy), M.whiteArmor);
  cap.name = 'EarCap';
  const insertPts = CAP.map(([z, y]) => [z * 0.74 - 0.008, y * 0.74]);
  const insert = new THREE.Mesh(sidePlate(insertPts, 0.01, 0.003, e.outerX + 0.008, e.cz, e.cy), M.whiteTextured);
  insert.name = 'EarCap_Insert';
  const fold = new THREE.Mesh(new THREE.BoxGeometry(0.002, 0.002, 0.22), M.whiteTextured);
  fold.position.set(e.outerX + 0.009, e.cy, e.cz);
  fold.rotation.x = -0.75;
  if (!headBandOnly) g.add(cap, insert, fold);

  // Head band ear to ear over the dome: dark strap with a light centre stripe and clip blocks.
  const b = D.band;
  const band = new THREE.Mesh(bandShell(0.004, 0.02, b.z, b.half, 0.2), M.darkArmor);
  band.name = 'HeadBand';
  const stripe = new THREE.Mesh(bandShell(0.018, 0.026, b.z, 0.014, 0.24), M.bandStripe);
  stripe.name = 'HeadBand_Stripe';
  g.add(band, stripe);
  for (const s of [-1, 1]) {
    const a = 0.85;
    const hit = hitSurface(band, [s * Math.sin(a) * 2, Math.cos(a) * 2 + 0.1, b.z], [-s * Math.sin(a), -Math.cos(a), 0]);
    if (!hit) continue;
    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.022), M.darkArmor);
    clip.name = s > 0 ? 'BandClip_L' : 'BandClip_R';
    orient(clip, hit.point, hit.normal, 0.008, [0, 0, 1]);
    g.add(clip);
  }

  if (headBandOnly) return g;

  // Dark bracket: runs forward from the band and hooks down in front of the cap.
  const hook = new THREE.CatmullRomCurve3(
    [[0.35, 0.36, b.z - 0.06], [0.4, 0.32, b.z + 0.02], [0.415, 0.26, -0.05], [0.42, 0.17, -0.045], [0.41, 0.07, -0.06]].map((p) => new THREE.Vector3(...p)),
  );
  const bracket = new THREE.Mesh(new THREE.TubeGeometry(hook, 48, 0.014, 12), M.darkArmor);
  bracket.name = 'Bracket';
  const wireCurve = new THREE.CatmullRomCurve3(
    [[0.37, 0.31, -0.25], [0.405, 0.28, -0.26], [0.41, 0.22, -0.25]].map((p) => new THREE.Vector3(...p)),
  );
  const wire = new THREE.Mesh(new THREE.TubeGeometry(wireCurve, 24, 0.004, 8), M.darkMetal);
  wire.name = 'Wire';
  g.add(bracket, wire);
  return g;
}
