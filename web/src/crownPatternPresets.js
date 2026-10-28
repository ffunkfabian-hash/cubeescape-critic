const pattern = name => Object.freeze({ name, requiresStripsOff: true, textureSize: 1024,
  surfaceOffset: 0.001, color: '#d6d7d5', roughness: 0.75, metalness: 0.05, alphaTest: 0.5 });

export const CROWN_PATTERNS = Object.freeze({
  none: Object.freeze({ name: 'none', requiresStripsOff: false }),
  chevron: pattern('chevron'),
  hex: pattern('hex'),
  tech: pattern('tech'),
});

export function resolveCrownPattern(value = 'none') {
  if (!Object.hasOwn(CROWN_PATTERNS, value)) {
    throw new Error(`Unknown crown pattern ${JSON.stringify(value)}; expected none, chevron, hex or tech`);
  }
  return CROWN_PATTERNS[value];
}
