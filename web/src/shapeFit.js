// Compress the lower face coherently across plates, inserts and fasteners.
// Work in model coordinates so connected parts remain aligned after the fit.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export function fitHelmet(model, { lowerFaceScale = 1, lowerFaceAnchor = 0.08 } = {}) {
  if (!Number.isFinite(lowerFaceScale) || lowerFaceScale < 0.7 || lowerFaceScale > 1.1 || !Number.isFinite(lowerFaceAnchor)) {
    throw new Error('Invalid lower-face fitting parameters');
  }
  if (lowerFaceScale === 1) return model;
  model.updateMatrixWorld(true);
  const meshes = [];
  model.traverse(o => { if (o.isMesh) meshes.push(o); });
  for (const object of meshes) {
    const inverse = object.matrixWorld.clone().invert();
    const deform = matrix => {
      const geometry = object.geometry.clone().applyMatrix4(matrix);
      const position = geometry.attributes.position, normal = geometry.attributes.normal;
      const n = new THREE.Vector3();
      for (let i = 0; i < position.count; i++) {
        const y = position.getY(i);
        if (y >= lowerFaceAnchor) continue;
        position.setY(i, lowerFaceAnchor + (y - lowerFaceAnchor) * lowerFaceScale);
        if (normal) {
          n.fromBufferAttribute(normal, i); n.y /= lowerFaceScale; n.normalize();
          normal.setXYZ(i, n.x, n.y, n.z);
        }
      }
      geometry.applyMatrix4(inverse);
      geometry.computeBoundingBox(); geometry.computeBoundingSphere();
      return geometry;
    };
    if (object.isInstancedMesh) {
      const pieces = [], instance = new THREE.Matrix4();
      for (let i = 0; i < object.count; i++) {
        object.getMatrixAt(i, instance);
        pieces.push(deform(new THREE.Matrix4().multiplyMatrices(object.matrixWorld, instance)));
      }
      if (!pieces.length) continue;
      const replacement = new THREE.Mesh(mergeGeometries(pieces), object.material);
      replacement.name = object.name;
      replacement.position.copy(object.position); replacement.quaternion.copy(object.quaternion); replacement.scale.copy(object.scale);
      object.parent.add(replacement); object.removeFromParent();
      for (const piece of pieces) piece.dispose();
    } else {
      object.geometry = deform(object.matrixWorld);
    }
  }
  return model;
}
