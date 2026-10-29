// Neck: dark neck with gorget plates under the helmet (the scarf of the video is not part of the model).
import * as THREE from 'three';

export function buildNeck(M) {
  const g = new THREE.Group();
  g.name = 'Neck';
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.42, 48), M.blackRubber);
  neck.name = 'NeckCore';
  neck.scale.set(0.24, 1, 0.27);
  neck.position.set(0, -0.5, 0);
  g.add(neck);
  const plates = new THREE.Group();
  plates.name = 'NeckPlates';
  for (let i = 0; i < 4; i++) {
    const r = 0.255 + i * 0.006;
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(r, r + 0.012, 0.055, 32, 1, false, -1.15, 2.3), M.blackRubber);
    plate.scale.set(1, 1, 1.12);
    plate.position.set(0, -0.36 - i * 0.05, 0);
    plates.add(plate);
  }
  const seam = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.22, 0.01), M.darkMetal);
  seam.position.set(0, -0.45, 0.305);
  plates.add(seam);
  g.add(plates);
  return g;
}
