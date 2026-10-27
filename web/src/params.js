// Live parameter set: starts from helmetParams.json, lil-gui edits it in place, parts read it at build time.
// Units: helmet height ≈ 1, Y up, face towards +Z, helmet's left side = +X.
// Measured from refs/ref_front.png at ~535 px per unit: Y = (330 - py) / 535, X = (px - 650) / 535.
import defaults from './helmetParams.json';

export const D = structuredClone(defaults);

export function resetParams() {
  const fresh = structuredClone(defaults);
  for (const k of Object.keys(fresh)) D[k] = fresh[k];
}
