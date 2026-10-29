// Mirror the complete side-A headset, keeping the central rear box unique.
import * as THREE from 'three';

export function mirrorComms(source) {
  const mirrored = source.clone(true);
  mirrored.remove(mirrored.getObjectByName('BackBox_Group'));
  mirrored.name = 'MirroredComms_B';
  mirrored.updateMatrixWorld(true);
  const reflection = new THREE.Matrix4().makeScale(-1, 1, 1);
  let detail = 0;
  mirrored.traverse(object => {
    if (object === mirrored) return;
    object.name = object.name ? `${object.name}_B` : `RadioDetail_B_${++detail}`;
    if (!object.isMesh) return;
    // Bake world reflection into independent geometry. Export positive scales and
    // reverse triangle winding so the reflected surfaces remain outward-facing.
    const geometry = object.geometry.clone().applyMatrix4(reflection.clone().multiply(object.matrixWorld));
    if (!geometry.index) geometry.setIndex(Array.from({ length: geometry.attributes.position.count }, (_, i) => i));
    const index = geometry.index.array;
    for (let i = 0; i < index.length; i += 3) [index[i + 1], index[i + 2]] = [index[i + 2], index[i + 1]];
    geometry.index.needsUpdate = true;
    geometry.computeBoundingBox(); geometry.computeBoundingSphere();
    object.geometry = geometry;
  });
  mirrored.traverse(object => {
    object.position.set(0, 0, 0); object.quaternion.identity(); object.scale.set(1, 1, 1);
  });
  mirrored.updateMatrixWorld(true);
  return mirrored;
}
