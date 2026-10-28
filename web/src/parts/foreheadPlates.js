// Two independent trapezoidal brow plates, fitted to the accepted rounded crown.
import * as THREE from 'three';
import { D } from '../params.js';
import { brush, csg, prism, halfSpace, SUBTRACTION, INTERSECTION } from '../geo.js';
import { boxProjectUV } from '../textures.js';

export function buildForeheadPlates(crown, M) {
  const group = new THREE.Group();
  group.name = 'ForeheadPlates';
  const p = D.foreheadPlates;
  // Fade into the mask at its sloping brow; retain each plate as a separate shell.
  const fitted = (outside) => {
    const geo = crown.geometry.clone(), pos = geo.attributes.position, normals = geo.attributes.normal;
    const slope = D.crownTransition.slope;
    const centre = D.capEdgeY + slope * D.crownTransition.anchorZ;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const u = THREE.MathUtils.clamp((y + slope * z - centre) / p.joinBlendHeight, 0, 1);
      const blend = u * u * (3 - 2 * u), derivative = 6 * u * (1 - u) / p.joinBlendHeight;
      const offset = outside ? THREE.MathUtils.lerp(p.joinLip, p.projection, blend) : -p.embed;
      pos.setXYZ(i, x, y - p.joinOverlap * (1 - blend), z + offset);
      // Transport the existing smooth normals through the deformation; rebuilding
      // them on the CSG split vertices would introduce horizontal shading bands.
      const a = p.joinOverlap * derivative, b = outside ? (p.projection - p.joinLip) * derivative : 0;
      const det = 1 + a + b * slope, ny = normals.getY(i), nz = normals.getZ(i);
      const normal = new THREE.Vector3(normals.getX(i), ((1 + b * slope) * ny - b * nz) / det,
        (-a * slope * ny + (1 + a) * nz) / det).normalize();
      normals.setXYZ(i, normal.x, normal.y, normal.z);
    }
    return brush(geo);
  };
  const layer = csg(fitted(true),
    [SUBTRACTION, fitted(false)],
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
