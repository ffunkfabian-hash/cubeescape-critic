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

export const ACCENT_PRESETS = Object.freeze({
  original: Object.freeze({ name: 'original', lightFasteners: false, whiteStrips: false }),
  'light-fasteners': Object.freeze({ name: 'light-fasteners', lightFasteners: true, whiteStrips: false }),
  'white-strips': Object.freeze({ name: 'white-strips', lightFasteners: true, whiteStrips: true }),
});

export function resolveAccents(value = 'original') {
  if (!Object.hasOwn(ACCENT_PRESETS, value)) {
    throw new Error(`Unknown accents ${JSON.stringify(value)}; expected original, light-fasteners or white-strips`);
  }
  return ACCENT_PRESETS[value];
}
