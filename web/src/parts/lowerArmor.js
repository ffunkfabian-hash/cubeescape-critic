// LowerArmor_White: white core, rear collar, neck ring and the faceted U-shaped jaw with chin screws and vent grilles.
import * as THREE from 'three';
import { D } from '../params.js';
import { brush, csg, prism, hitSurface, orient, SUBTRACTION, INTERSECTION } from '../geo.js';
import { screws, grille, texturedPanel } from './common.js';
import { boxProjectUV } from '../textures.js';

function ellipticCylinder(rx, rz, y0, y1, cz, seg = 96) {
  const g = new THREE.CylinderGeometry(1, 1, y1 - y0, seg);
  g.scale(rx, 1, rz);
  g.translate(0, (y0 + y1) / 2, cz);
  return g;
}

export function buildLowerArmor(M) {
  const g = new THREE.Group();
  g.name = 'LowerArmor_White';

  // Core: rear and side wall between cap and collar, with vertical panel seams at the back.
  const c = D.core;
  let core = brush(ellipticCylinder(c.rx, c.rz, c.y0, c.y1, c.cz));
  for (const x of [-0.17, 0.17]) {
    core = csg(core, [SUBTRACTION, brush(new THREE.BoxGeometry(0.006, 0.6, 0.2), { pos: [x, 0.1, -0.5] })]);
  }
  core = csg(core, [SUBTRACTION, brush(new THREE.BoxGeometry(0.2, 0.6, 0.006), { pos: [-0.42, 0.1, -0.2] })]);
  core = csg(core, [SUBTRACTION, brush(new THREE.BoxGeometry(0.2, 0.6, 0.006), { pos: [0.42, 0.1, -0.3] })]);
  const coreMesh = new THREE.Mesh(boxProjectUV(core.geometry, 2), M.whiteArmor);
  coreMesh.name = 'Core';
  g.add(coreMesh);

  // Rear inset panel around the tech box: a patch of a slightly larger core shell, textured light grey.
  const shellOut = brush(ellipticCylinder(c.rx + 0.007, c.rz + 0.007, c.y0, c.y1, c.cz));
  const patch = brush(new THREE.BoxGeometry(0.4, 0.3, 0.4), { pos: [0, 0.17, -0.45] });
  const rearPanel = new THREE.Mesh(csg(shellOut, [INTERSECTION, patch]).geometry, M.whiteTextured);
  rearPanel.name = 'RearPanel';
  g.add(rearPanel);

  // Collar: chamfered ring around back and sides, tilted so it drops towards the front.
  const k = D.collar;
  const prof = [[0.86, k.y0], [1.0, k.y0 + 0.03], [1.0, k.y1 - 0.05], [0.95, k.y1], [0.86, k.y1]].map(([r, y]) => new THREE.Vector2(r, y));
  prof.push(prof[0].clone());
  const collarGeo = new THREE.LatheGeometry(prof, 120, 1.15, Math.PI * 2 - 2.3);
  collarGeo.computeVertexNormals();
  collarGeo.scale(k.rx, 1, k.rz);
  collarGeo.translate(0, 0, k.cz);
  collarGeo.rotateX(k.tilt);
  const collar = new THREE.Mesh(collarGeo, M.whiteArmor);
  collar.name = 'Collar';
  g.add(collar);

  for (const x of [-0.07, 0.07]) {
    const hit = hitSurface(collar, [x, -0.12, -2], [0, 0, 1]);
    if (!hit) continue;
    const notch = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.035, 0.012), M.darkMetal);
    notch.name = 'CollarNotch';
    orient(notch, hit.point, hit.normal, 0.001, [1, 0, 0]);
    g.add(notch);
  }

  const n = D.neckRing;
  const neckRing = new THREE.Mesh(ellipticCylinder(n.rx, n.rz, n.y0, n.y1, -0.02), M.whiteArmor);
  neckRing.name = 'NeckRing';
  g.add(neckRing);

  // Jaw: intersection of front, side and top silhouettes; chin plate split by grooves.
  const top = D.collar.y1;
  const front = brush(prism([[-0.37, top], [-0.37, -0.12], [-0.4, -0.18], [-0.4, -0.26], [-0.3, -0.38], [-0.24, -0.4], [-0.17, -0.49], [0.17, -0.49], [0.24, -0.4], [0.3, -0.38], [0.4, -0.26], [0.4, -0.18], [0.37, -0.12], [0.37, top]], 'xy'));
  // Behind the face plate the jaw rises to the cheek; further forward it is only a bar under the plate's lower edge.
  const side = brush(prism([[-0.08, top], [0.0, top], [0.06, -0.16], [0.14, -0.25], [0.5, -0.335], [0.535, -0.41], [0.535, -0.465], [0.48, -0.505], [0.16, -0.47], [-0.08, -0.3]], 'zy'));
  const topV = brush(prism([[-0.4, -0.12], [-0.4, 0.12], [-0.35, 0.24], [-0.3, 0.34], [-0.22, 0.535], [0.22, 0.535], [0.3, 0.34], [0.35, 0.24], [0.4, 0.12], [0.4, -0.12]], 'xz'));
  let jaw = csg(front, [INTERSECTION, side], [INTERSECTION, topV]);
  for (const s of [-1, 1]) {
    jaw = csg(jaw, [SUBTRACTION, brush(new THREE.BoxGeometry(0.006, 0.2, 0.3), { pos: [s * 0.175, -0.44, 0.4] })]);
    jaw = csg(jaw, [SUBTRACTION, brush(new THREE.BoxGeometry(0.3, 0.3, 0.006), { pos: [s * 0.4, -0.25, 0.3], rot: [0.5, 0, 0] })]);
  }
  const jawMesh = new THREE.Mesh(boxProjectUV(jaw.geometry, 2), M.whiteArmor);
  jawMesh.name = 'Jaw';
  g.add(jawMesh);

  // Exactly four dark screw heads on the chin.
  const chin = [[-0.1, -0.455], [0.1, -0.455], [-0.12, -0.375], [0.12, -0.375]].map(([x, y]) => hitSurface(jawMesh, [x, y, 2], [0, 0, -1]));
  g.add(screws(M, chin, 'Screws_Chin'));

  // Side screws on the cheek panels and collar.
  const sideScrews = [];
  for (const s of [-1, 1]) {
    sideScrews.push(hitSurface(jawMesh, [s * 2, -0.04, 0.12], [-s, 0, 0]));
    sideScrews.push(hitSurface(jawMesh, [s * 2, -0.2, 0.22], [-s, 0, 0]));
    sideScrews.push(hitSurface(collar, [s * 2, -0.02, -0.3], [-s, 0, 0]));
  }
  g.add(screws(M, sideScrews, 'Screws_Side'));

  // Honeycomb vent grilles along the lower jaw edge, large textured panels on the collar sides.
  const targets = [jawMesh, collar];
  for (const s of [-1, 1]) {
    for (const [y, z, w, h, tan, name] of [
      [-0.3, 0.28, 0.22, 0.065, [0, -0.2, 1], 'Jaw'],
      [-0.115, -0.16, 0.32, 0.11, [0, 0.06, 1], 'Collar'],
    ]) {
      const hit = hitSurface(targets, [s * 2, y, z], [-s, 0, 0]);
      if (!hit) continue;
      const gr = name === 'Collar' ? texturedPanel(M, w, h, `Panel_${name}_${s > 0 ? 'L' : 'R'}`) : grille(M, w, h, `Grille_${name}_${s > 0 ? 'L' : 'R'}`);
      orient(gr, hit.point, hit.normal, 0.004, tan);
      g.add(gr);
    }
  }
  return g;
}
