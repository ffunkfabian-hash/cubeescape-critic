// Small reusable details: screw heads and perforated vent grilles.
import * as THREE from 'three';
import { orient, roundedRect } from '../geo.js';

const screwGeo = new THREE.CylinderGeometry(0.0085, 0.0095, 0.006, 6).rotateX(Math.PI / 2);

// placements: [{ point, normal }] (e.g. from hitSurface)
export function screws(M, placements, name = 'Screws') {
  const valid = placements.filter(Boolean);
  const mesh = new THREE.InstancedMesh(screwGeo, M.darkMetal, valid.length);
  mesh.name = name;
  const o = new THREE.Object3D();
  valid.forEach((p, i) => {
    orient(o, p.point, p.normal, 0.002);
    o.updateMatrix();
    mesh.setMatrixAt(i, o.matrix);
  });
  return mesh;
}

// Rounded vent grille in the local XY plane facing +Z: dark metal frame and a honeycomb-perforated plate
// (canvas colour + bump map, UVs in model units from ExtrudeGeometry).
export function grille(M, w, h, name = 'VentGrille') {
  const g = new THREE.Group();
  g.name = name;
  const r = Math.min(w, h) / 2;
  const frame = new THREE.Mesh(
    new THREE.ExtrudeGeometry(roundedRect(w, h, r), { depth: 0.008, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2 }),
    M.darkMetal,
  );
  frame.position.z = -0.006;
  const plate = new THREE.Mesh(
    new THREE.ExtrudeGeometry(roundedRect(w - 0.018, h - 0.018, Math.max(r - 0.009, 0.004)), { depth: 0.004, bevelEnabled: false }),
    M.ventPlate,
  );
  plate.position.z = 0.003;
  g.add(frame, plate);
  return g;
}
