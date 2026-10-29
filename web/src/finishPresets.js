// Only the dark shell, mask and forehead armor use these finishes.
// Other materials keep their existing appearance in every comparison.
export const FINISH_PRESETS = Object.freeze({
  original: Object.freeze({ name: 'original', sharedArmorMaps: false }),
  metal: Object.freeze({ name: 'metal', sharedArmorMaps: true, color: 0x313438,
    roughness: 0.5, metalness: 0.55, envMapIntensity: 0.7,
    specularIntensity: 1, normalScale: 0.06,
    textureSeeds: Object.freeze({ normal: 73, roughness: 11 }) }),
  graphite: Object.freeze({ name: 'graphite', sharedArmorMaps: true, color: 0x313438,
    roughness: 0.9, metalness: 0.15, envMapIntensity: 0.35,
    specularIntensity: 0.45, normalScale: 1, textureSeed: 73 }),
});

export function resolveFinish(value = 'original') {
  if (!Object.hasOwn(FINISH_PRESETS, value)) {
    throw new Error(`Unknown finish ${JSON.stringify(value)}; expected original, metal or graphite`);
  }
  return FINISH_PRESETS[value];
}

const GRAPHITE_STRIP = Object.freeze({ color: 0x41474d, roughness: 0.58, metalness: 0.2,
  normalScale: 0.15, envMapIntensity: 0.45, map: null, normalMap: 'crownNormal', roughnessMap: 'darkArmor' });
const METAL_STRIP = Object.freeze({ color: 0x41474d, roughness: 0.7, metalness: 0.55,
  normalScale: 0.1, envMapIntensity: 0.6, map: null, normalMap: 'crownNormal', roughnessMap: 'darkArmor' });

export const ACCENT_PRESETS = Object.freeze({
  original: Object.freeze({ name: 'original', lightFasteners: false, whiteStrips: false }),
  'light-fasteners': Object.freeze({ name: 'light-fasteners', lightFasteners: true, whiteStrips: false }),
  'white-strips': Object.freeze({ name: 'white-strips', lightFasteners: true, whiteStrips: true }),
  'contrast-strips': Object.freeze({ name: 'contrast-strips', lightFasteners: true, contrastStrips: true,
    stripProfiles: Object.freeze({ original: GRAPHITE_STRIP, graphite: GRAPHITE_STRIP, metal: METAL_STRIP }) }),
});

export function resolveAccents(value = 'original') {
  if (!Object.hasOwn(ACCENT_PRESETS, value)) {
    throw new Error(`Unknown accents ${JSON.stringify(value)}; expected original, light-fasteners, white-strips or contrast-strips`);
  }
  return ACCENT_PRESETS[value];
}
