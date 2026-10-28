// Assembles the named part groups into one model.
import * as THREE from 'three';
import { buildUpperHelmet } from './parts/upperHelmet.js';
import { buildLowerArmor } from './parts/lowerArmor.js';
import { buildLeftEar } from './parts/leftEar.js';
import { buildRightComms } from './parts/rightComms.js';
import { buildNeck } from './parts/neck.js';

export function buildHelmet(M) {
  const model = new THREE.Group();
  model.name = 'SciFiHelmet';
  model.add(buildUpperHelmet(M), buildLowerArmor(M), buildLeftEar(M), buildRightComms(M), buildNeck(M));
  model.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return model;
}
