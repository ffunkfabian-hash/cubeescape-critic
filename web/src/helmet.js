// Assembles the named part groups into one model.
import * as THREE from 'three';
import { D } from './params.js';
import { fitHelmet } from './shapeFit.js';
import { buildUpperHelmet } from './parts/upperHelmet.js';
import { buildLowerArmor } from './parts/lowerArmor.js';
import { buildLeftEar } from './parts/leftEar.js';
import { buildRightComms } from './parts/rightComms.js';
import { mirrorComms } from './parts/mirrorComms.js';
import { buildNeck } from './parts/neck.js';
import { buildForeheadPlates } from './parts/foreheadPlates.js';

export function buildHelmet(M) {
  const model = new THREE.Group();
  model.name = 'SciFiHelmet';
  const comms = buildRightComms(M);
  model.add(buildUpperHelmet(M), buildLowerArmor(M), buildLeftEar(M, { headBandOnly: D.comms.symmetric }), comms, buildNeck(M));
  if (D.foreheadPlates.enabled !== false) model.add(buildForeheadPlates(model.getObjectByName('Crown'), M));
  if (D.comms.symmetric) model.add(mirrorComms(comms));
  fitHelmet(model, D.shapeFit);
  model.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return model;
}
