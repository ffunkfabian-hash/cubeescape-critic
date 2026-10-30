// Scout v3 (?model=scout): the Blender-built helmet from blender/scout, loaded as GLB from assets/helmet-scout.
// The GLB is the generator's export (Y up, front +Z, height 1.0); it is scaled and centred to the frame of the
// three.js helmet so the same camera views apply. Exported meshes carry extras part_id/part_label/side (parts.json).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import assembledUrl from '../../assets/helmet-scout/assembled/scout.glb?url';
import explodedUrl from '../../assets/helmet-scout/exploded/scout_exploded.glb?url';

// Shell of the three.js helmet without neck and antennas (measured: dome top ≈ 0.40, collar bottom −0.41), so both
// helmets fill the camera views alike. Scout is fitted by its own box without antennas (Antenne_*).
export const SCOUT_FRAME = { height: 0.81, center: [0, -0.005, 0], explodedTarget: [0, 0.02, 0], explodedDist: 5.4 };
// Exploded camera: whole explosion incl. labels fits the 'assembly' view (checked at 1100×800).

const cache = new Map();
const load = url => {
  if (!cache.has(url)) cache.set(url, new GLTFLoader().loadAsync(url).then(g => g.scene));
  return cache.get(url);
};

// Scale and centre of the assembled Scout GLB scene in the helmet frame (shell box without antennas); also used by the skin bake.
export function scoutFit(ref) {
  const box = new THREE.Box3();
  ref.updateMatrixWorld(true);
  ref.traverse(o => { if (o.isMesh && !(o.userData.source_object ?? o.name).startsWith('Antenne')) box.expandByObject(o); });
  const size = box.getSize(new THREE.Vector3());
  return { scale: SCOUT_FRAME.height / size.y, mid: box.getCenter(new THREE.Vector3()) };
}

export async function loadScout(exploded) {
  // Fit by the assembled helmet's box so the exploded parts keep the same scale and origin.
  const ref = await load(assembledUrl);
  const source = exploded ? await load(explodedUrl) : ref;
  const model = new THREE.Group();
  model.name = exploded ? 'scout_exploded' : 'scout';
  const inner = source.clone(true);
  const { scale: s, mid } = scoutFit(ref);
  inner.scale.setScalar(s);
  inner.position.set(-mid.x * s, -mid.y * s, -mid.z * s).add(new THREE.Vector3(...SCOUT_FRAME.center));
  inner.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  model.add(inner);
  return model;
}

// Label groups for the exploded view (same shape as assembly.js › assemblyDescription), one per part ID and side.
export function scoutParts(model) {
  model.updateMatrixWorld(true);
  const groups = new Map(), toLocal = model.matrixWorld.clone().invert();
  model.traverse(o => {
    const x = o.userData;
    if (!o.isMesh && !x?.part_id) return;
    const holder = x?.part_id ? o : o.parent?.userData?.part_id ? o.parent : null;
    if (!holder || !o.isMesh) return;
    const label = holder.userData.part_label;
    if (!groups.has(label)) groups.set(label, { id: label.split(' ')[0] + (holder.userData.side ? ' ' + holder.userData.side : ''),
      label: label.split(' ').slice(1).filter(w => w !== holder.userData.side).join(' '), connection: '', meshes: [], box: new THREE.Box3() });
    const g = groups.get(label); g.meshes.push({ name: holder.name, path: holder.name }); g.box.expandByObject(o);
  });
  return [...groups.values()].map(({ box, ...g }) => ({ ...g, center: box.getCenter(new THREE.Vector3()).applyMatrix4(toLocal).toArray() }));
}
