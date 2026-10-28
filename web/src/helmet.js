// Assembles the named part groups into one model.
import * as THREE from 'three';
import { D } from './params.js';
import { fitHelmet } from './shapeFit.js';
import { buildUpperHelmet } from './parts/upperHelmet.js';
import { buildLowerArmor } from './parts/lowerArmor.js';
import { buildLeftEar } from './parts/leftEar.js';
import { buildRightComms } from './parts/rightComms.js';
import { buildNeck } from './parts/neck.js';
import { buildForeheadPlates } from './parts/foreheadPlates.js';

export function buildHelmet(M) {
  const model = new THREE.Group();
  model.name = 'SciFiHelmet';
  model.add(buildUpperHelmet(M), buildLowerArmor(M), buildLeftEar(M), buildRightComms(M), buildNeck(M));
  model.add(buildForeheadPlates(model.getObjectByName('Crown'), M));
  fitHelmet(model, D.shapeFit);
  model.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return model;
}
