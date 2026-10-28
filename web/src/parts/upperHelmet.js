// UpperHelmet_Dark: dark cap and faceted front plate, V-angled visor slits, recessed mouth with two vents.
import * as THREE from 'three';
import { D } from '../params.js';
import { brush, csg, prism, halfSpace, hitSurface, orient, ADDITION, SUBTRACTION, INTERSECTION } from '../geo.js';
import { boxProjectUV } from '../textures.js';
import { screws } from './common.js';
import { headVolume } from './headVolume.js';

const DEG = Math.PI / 180;

export function buildUpperHelmet(M) {
  const g = new THREE.Group();
  g.name = 'UpperHelmet_Dark';

  // Outer volume from the drawn profiles. Dark = head ∩ (cap above the brim ∪ front-plate silhouette stack).
  const H = headVolume(1);
  const capBox = brush(new THREE.BoxGeometry(2, 1, 2), { pos: [0, D.capEdgeY + 0.5, D.maskBackZ + 0.02 - 1] });
  const zb = D.maskBackZ;
  const front = brush(prism([[-0.5, 0.8], [-0.5, 0.2], [-0.345, 0.1], [-0.345, -0.02], [-0.2, -0.335], [0.2, -0.335], [0.345, -0.02], [0.345, 0.1], [0.5, 0.2], [0.5, 0.8]], 'xy'));
  const side = brush(prism([[zb - 0.02, 0.8], [0.8, 0.8], [0.8, 0.05], [0.49, -0.335], [0.16, -0.335], [0.1, -0.29], [0.0, -0.2], [zb + 0.02, 0.05]], 'zy'));
  const top = brush(prism([[-0.5, -0.3], [-0.5, 0.26], [-0.22, 0.49], [0, 0.505], [0.22, 0.49], [0.5, 0.26], [0.5, -0.3]], 'xz'));
  const region = csg(front, [INTERSECTION, side], [INTERSECTION, top], [ADDITION, capBox]);
  // Raised face plate: slightly inflated head volume cut to the plate outline, so its edges read as panel steps.
  const H2 = headVolume(1.022);
  const pFront = brush(prism([[-0.31, 0.27], [0.31, 0.27], [0.355, 0.12], [0.355, -0.02], [0.205, -0.34], [-0.205, -0.34], [-0.355, -0.02], [-0.355, 0.12]], 'xy'));
  const pSide = brush(prism([[0.2, 0.27], [0.8, 0.27], [0.8, 0.0], [0.505, -0.34], [0.2, -0.34]], 'zy'));
  const pTop = brush(prism([[-0.6, 0.18], [-0.24, 0.505], [0, 0.52], [0.24, 0.505], [0.6, 0.18], [0.6, 0.05], [-0.6, 0.05]], 'xz'));
  // Planar facets of the face (flat front, side chamfers, sloped brow, lower face leaning back); the raised plate
  // gets the same planes pushed out by its offset.
  const facets = (off) => D.facets.map(([p, n]) => {
    const m = Math.hypot(...n);
    return [INTERSECTION, halfSpace(p.map((v, i) => v + (n[i] / m) * off), n)];
  });
  const facePlate = csg(H2, [INTERSECTION, pFront], [INTERSECTION, pSide], [INTERSECTION, pTop], ...facets(0.011));
  let shell = csg(H, [INTERSECTION, region], ...facets(0), [ADDITION, facePlate]);

  const probe = new THREE.Mesh(shell.geometry, M.darkArmor);
  const surfZ = (x, y) => hitSurface(probe, [x, y, 2], [0, 0, -1])?.point.z ?? 0.45;

  // Visor: shallow frame recess, then the slit; inner ends lower (V shape).
  const v = D.visor;
  const cuts = [];
  const glows = [];
  for (const s of [-1, 1]) {
    const x = s * v.x, z = surfZ(x, v.y), rz = s * v.angleDeg * DEG;
    cuts.push(brush(new THREE.BoxGeometry(v.width + 0.03, v.height + 0.028, 0.2), { pos: [x, v.y, z + 0.1 - 0.012], rot: [0, s * 0.12, rz] }));
    cuts.push(brush(new THREE.BoxGeometry(v.width, v.height, 0.3), { pos: [x, v.y, z - 0.035 + 0.15], rot: [0, s * 0.12, rz] }));
    const glow = new THREE.Mesh(new THREE.BoxGeometry(v.width - 0.004, v.height - 0.004, 0.03), M.visorGlow);
    glow.name = s < 0 ? 'Visor_R' : 'Visor_L';
    glow.position.set(x, v.y, z - 0.03);
    glow.rotation.set(0, s * 0.12, rz);
    glows.push(glow);
  }

  // Mouth: trapezoid recess open at the bottom, two vertical vent slots.
  const zm = surfZ(0, -0.2);
  cuts.push(brush(prism([[-0.062, -0.03], [0.062, -0.03], [0.118, -0.5], [-0.118, -0.5]], 'xy', 1), { pos: [0, 0, zm - 0.035 + 0.5] }));
  for (const s of [-1, 1]) {
    cuts.push(brush(new THREE.BoxGeometry(0.022, 0.17, 0.2), { pos: [s * 0.032, -0.2, zm - 0.06 + 0.1] }));
  }

  // Panel lines: narrow grooves on the lower front plate and a transverse seam on the cap.
  const groove = (x, y, len, ang, w = 0.006) => {
    const z = surfZ(x, y);
    cuts.push(brush(new THREE.BoxGeometry(len, w, 0.2), { pos: [x, y, z + 0.1 - 0.012], rot: [0, 0, ang] }));
  };
  for (const s of [-1, 1]) {
    groove(s * 0.19, -0.115, 0.2, s * 0.32);
    groove(s * 0.17, -0.25, 0.16, s * -0.55);
    groove(s * 0.28, 0.215, 0.12, s * -0.18);
  }
  cuts.push(brush(new THREE.BoxGeometry(2, 1, 0.006), { pos: [0, D.capEdgeY + 0.55, -0.25] }));
  for (const s of [-1, 1]) {
    // Side seam: from the brow corner back and up over the temple, as a thin slot in a vertical plane.
    cuts.push(brush(new THREE.BoxGeometry(0.12, 0.006, 0.42), { pos: [s * 0.38, 0.36, 0.1], rot: [0.32, 0, 0] }));
  }
  cuts.push(brush(new THREE.BoxGeometry(0.006, 1, 0.6), { pos: [0, D.capEdgeY + 0.6, -0.3] }));

  // Round temple recesses on both sides.
  for (const s of [-1, 1]) {
    const h = hitSurface(probe, [s * 2, 0.24, 0.17], [-s, 0, 0]);
    if (h) {
      const c = new THREE.CylinderGeometry(0.024, 0.024, 0.03, 32).rotateZ(Math.PI / 2);
      cuts.push(brush(c, { pos: h.point.toArray() }));
    }
  }

  for (const c of cuts) shell = csg(shell, [SUBTRACTION, c]);
  boxProjectUV(shell.geometry, 2.5);
  const shellMesh = new THREE.Mesh(shell.geometry, M.darkArmor);
  shellMesh.name = 'Shell';
  g.add(shellMesh, ...glows);

  // Brim: overhanging rim along the cap's lower edge at the back.
  const brimProfile = [[0.93, 0], [1.0, 0.004], [1.0, 0.026], [0.97, 0.032], [0.93, 0.032]].map(([r, y]) => new THREE.Vector2(r, y));
  brimProfile.push(brimProfile[0].clone());
  const brim = new THREE.Mesh(new THREE.LatheGeometry(brimProfile, 96, 1.45, Math.PI * 2 - 2.9), M.darkArmor);
  brim.name = 'Brim';
  brim.geometry.computeVertexNormals();
  brim.scale.set(0.39, 1, 0.475);
  brim.position.set(0, D.capEdgeY - 0.016, 0);
  g.add(brim);

  // Hinge panels on the plate sides between visor and ear, with ribs.
  const probeAll = [shellMesh];
  for (const s of [-1, 1]) {
    const h = hitSurface(probeAll, [s * 2, 0.09, 0.08], [-s, 0, 0]);
    if (!h) continue;
    const hinge = new THREE.Group();
    hinge.name = s > 0 ? 'Hinge_L' : 'Hinge_R';
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.24, 0.045), M.darkArmor);
    hinge.add(body);
    for (let i = 0; i < 4; i++) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.05, 0.012), M.darkMetal);
      rib.position.set(-0.015 + i * 0.01, -0.02, 0.026);
      hinge.add(rib);
    }
    orient(hinge, h.point, h.normal, 0.01, [0, 0, 1]);
    g.add(hinge);
  }

  // Screws on the front plate.
  const pts = [];
  for (const s of [-1, 1]) {
    for (const [x, y] of [[0.12, -0.27], [0.27, -0.12], [0.24, 0.2], [0.07, -0.02], [0.31, 0.03]]) {
      pts.push(hitSurface(probeAll, [s * x, y, 2], [0, 0, -1]));
    }
    pts.push(hitSurface(probeAll, [s * 2, 0.3, 0.05], [-s, 0, 0]));
    pts.push(hitSurface(probeAll, [s * 2, 0.4, -0.05], [-s, -0.4, 0]));
  }
  g.add(screws(M, pts, 'Screws_Upper'));
  return g;
}
