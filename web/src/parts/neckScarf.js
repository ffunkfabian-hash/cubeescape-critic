// Neck_And_Scarf: dark neck with gorget plates, bust, and a multi-layer scarf of noise-folded tori.
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import { D } from '../params.js';
import { rng } from '../geo.js';

function scarfLayer(L, i, noise) {
  const { foldDepth, noiseScale } = D.scarf;
  const geo = new THREE.TorusGeometry(L.R, L.r, 40, 240);
  geo.rotateX(-Math.PI / 2); // ring in the XZ plane around the neck
  const p = geo.attributes.position;
  const v = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3();
  for (let k = 0; k < p.count; k++) {
    v.fromBufferAttribute(p, k);
    const u = Math.atan2(v.x, v.z); // 0 = front
    c.set(Math.sin(u) * L.R, 0, Math.cos(u) * L.R);
    n.subVectors(v, c).divideScalar(L.r);
    // Large soft folds (low-frequency noise + wrap wrinkles) and fine crumples.
    const big = noise(v.x * noiseScale * 0.4, v.y * noiseScale * 0.25 + i * 3.1, v.z * noiseScale * 0.4);
    const wr = Math.sin(5 * u + i * 1.7 + 1.5 * big) * 0.6 + Math.sin(11 * u - i) * 0.2;
    const fine = noise(v.x * noiseScale * 2.2, v.y * noiseScale * 2.2 - i, v.z * noiseScale * 2.2);
    // Ridges running along each layer read as folded fabric bands.
    const tv = Math.atan2(n.y, n.x * Math.sin(u) + n.z * Math.cos(u));
    const ridge = Math.sin(3 * tv + 2 * u + 3 * big) * 0.5 + 0.5;
    const swell = 1 + foldDepth * (0.3 * big + 0.35 * wr + 0.45 * ridge) + 0.02 * fine;
    v.copy(c).addScaledVector(n, L.r * swell);
    // Vertical squash, wander of the ring and the front dip below the chin.
    v.y = v.y * 0.72 + L.r * 0.35 * noise(Math.cos(u) * 1.3, Math.sin(u) * 1.3, i * 5.3);
    const front = Math.max(0, Math.cos(u));
    v.y -= L.dip * front * front;
    const rad = 1 + 0.06 * noise(Math.cos(u) * 2, Math.sin(u) * 2, i * 2.1 + 9);
    v.x *= rad;
    v.z *= rad * 1.04;
    p.setXYZ(k, v.x, v.y, v.z);
  }
  geo.rotateX(L.tilt);
  geo.translate(0, L.y, -0.02);
  geo.computeVertexNormals();
  return geo;
}

export function buildNeckScarf(M) {
  const g = new THREE.Group();
  g.name = 'Neck_And_Scarf';

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.7, 48), M.blackRubber);
  neck.name = 'Neck';
  neck.scale.set(0.24, 1, 0.27);
  neck.position.set(0, -0.62, 0);
  g.add(neck);

  // Gorget plates under the chin.
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

  const bust = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), M.bust);
  bust.name = 'Bust';
  bust.scale.set(0.78, 0.4, 0.42);
  bust.position.set(0, -1.12, -0.02);
  g.add(bust);

  const noise = createNoise3D(rng(42));
  const scarf = new THREE.Group();
  scarf.name = 'Scarf';
  D.scarf.layers.forEach((L, i) => {
    const m = new THREE.Mesh(scarfLayer(L, i, noise), M.scarfFabric);
    m.name = `Scarf_Layer${i + 1}`;
    scarf.add(m);
  });
  g.add(scarf);
  return g;
}
