// Source of bodies and Scout in the viewer (?gen=, 0.18): the GLBs exported from the three.js generator (default), the generator
// live in the browser, or the frozen Blender export (reference of the measurements). 'glb' meant the Blender export up to 0.17 and
// stays as its alias, so older links keep showing what they showed.
export const SOURCES = ['export', 'three', 'blender'];
const ALIASES = { glb: 'blender' };

export function modelSource(gen) {
  const g = ALIASES[gen] ?? gen;
  if (!SOURCES.includes(g)) throw new Error(`Unknown gen ${JSON.stringify(gen)}; expected ${SOURCES.join(', ')} (glb = blender)`);
  return g;
}
