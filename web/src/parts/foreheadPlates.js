// Two independent trapezoidal brow plates, fitted to the accepted rounded crown.
import * as THREE from 'three';
import { D } from '../params.js';
import { brush, csg, prism, halfSpace, SUBTRACTION, INTERSECTION } from '../geo.js';
import { boxProjectUV } from '../textures.js';

export function buildForeheadPlates(crown, M) {
  const group = new THREE.Group();
  group.name = 'ForeheadPlates';
  const p = D.foreheadPlates;
  // Derive the complete surface from the crown, including its triangulation.
  // Embed the underside slightly so no unsupported gap appears along the edges.
  const layer = csg(brush(crown.geometry.clone().translate(0, 0, p.projection)),
    [SUBTRACTION, brush(crown.geometry.clone().translate(0, 0, -p.embed))],
    [INTERSECTION, halfSpace([0, 0, 0], [0, 0, -1])]);
  for (const side of [-1, 1]) {
    const outline = p.outline.map(([x, y]) => [side * x, y]);
    const part = csg(layer, [INTERSECTION, brush(prism(outline, 'xy'))]);
    const mesh = new THREE.Mesh(boxProjectUV(part.geometry, 2.5), M.darkArmor);
    mesh.name = side > 0 ? 'ForeheadPlate_L' : 'ForeheadPlate_R';
    group.add(mesh);
  }
  return group;
}
