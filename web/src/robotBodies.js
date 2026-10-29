// Robot bodies (?model=waechter|paladin|mechanik): the three body studies of cubeescape-ballon round 5, exported as GLB by
// blender/robot/export_robot.py into assets/robot-bodies/<name>/. Geometry comes from the Ballon generator only; the viewer
// fits each body to ROBOT_FRAME (taken over from the former three.js full body 0.9, so the helmet scale is unchanged) and explodes it by moving the
// segment nodes (GLB roots with extras asm/side) by the assembly offsets from parts.json, as tools/robot_build.explode does.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import waechterUrl from '../../assets/robot-bodies/waechter/assembled/waechter.glb?url';
import paladinUrl from '../../assets/robot-bodies/paladin/assembled/paladin.glb?url';
import mechanikUrl from '../../assets/robot-bodies/mechanik/assembled/mechanik.glb?url';

// parts.json is loaded only when a robot is shown, so the helmet build does not carry it.
export const ROBOT_MODELS = {
  waechter: { url: waechterUrl, parts: () => import('../../assets/robot-bodies/waechter/parts.json'), de: 'Wächter (heroisch-schwer)' },
  paladin: { url: paladinUrl, parts: () => import('../../assets/robot-bodies/paladin/parts.json'), de: 'Paladin (athletisch)' },
  mechanik: { url: mechanikUrl, parts: () => import('../../assets/robot-bodies/mechanik/parts.json'), de: 'Mechanik (schlank-mechanisch)' },
};
// Frame of the bodies in the viewer (measured on the former three.js full body 0.9): feet at y = −4.85, height 5.44, helmet
// frame at the top; camera target and distance for assembled and exploded views.
export const ROBOT_FRAME = { height: 5.44, floor: -4.85, camera: { target: -2.2, dist: 11.8, explodedTarget: -2.6, explodedDist: 17.5 } };
// Anchor of each assembly towards its parent (basic/robot ANCHORS), shown as the label's connection.
const SOCKETS = { head: 'Socket_Neck', arms: 'Socket_Shoulder', upper_body: 'Rumpf', lower_body: 'Socket_Waist', legs: 'Socket_Hip' };

const cache = new Map();
const load = url => {
  if (!cache.has(url)) cache.set(url, new GLTFLoader().loadAsync(url).then(g => g.scene));
  return cache.get(url);
};

// Ballon world (Blender, mm, Z up, front −Y) → glTF (metres, Y up, front +Z); side R lies at −X and moves outward to −X.
export function explodeOffset(mm, side, amount) {
  const x = (side === 'R' ? -mm[0] : mm[0]) * 0.001 * amount;
  return new THREE.Vector3(x, mm[2] * 0.001 * amount, -mm[1] * 0.001 * amount);
}

export async function loadRobot(name) {
  const entry = ROBOT_MODELS[name];
  if (!entry) throw new Error(`Unknown robot ${JSON.stringify(name)}; expected ${Object.keys(ROBOT_MODELS).join(', ')}`);
  const [source, parts] = await Promise.all([load(entry.url), entry.parts().then(m => m.default)]);
  const inner = source.clone(true);
  const box = new THREE.Box3().setFromObject(source);
  const size = box.getSize(new THREE.Vector3()), mid = box.getCenter(new THREE.Vector3());
  const s = ROBOT_FRAME.height / size.y;
  inner.scale.setScalar(s);
  inner.position.set(-mid.x * s, ROBOT_FRAME.floor - box.min.y * s, -mid.z * s);
  for (const node of inner.children) node.userData.basePosition = node.position.clone();
  // flat GLB material per Ballon role (MT_<role>_color), e.g. to dress a helmet in the robot's colours (robotHelmet.js)
  const roleMaterials = new Map();
  inner.traverse(o => { const role = o.isMesh && /^MT_(.+)_color$/.exec(o.material.name)?.[1]; if (role && !roleMaterials.has(role)) roleMaterials.set(role, o.material); });
  inner.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const model = new THREE.Group();
  model.name = `robot_${name}`;
  model.userData = { robot: name, study: parts.study, parts, roleMaterials };
  model.add(inner);
  return model;
}

// Explosion 0..1: segment nodes at their assembled position plus amount × the assembly offset (upper body stays).
export function setRobotExplosion(model, amount) {
  const offsets = Object.fromEntries(model.userData.parts.assemblies.map(a => [a.id, a.explode_mm]));
  for (const node of model.children[0].children) {
    const { asm, side, basePosition } = node.userData;
    if (asm) node.position.copy(basePosition).add(explodeOffset(offsets[asm], side, amount));
  }
  model.name = amount > 0 ? `robot_${model.userData.robot}_exploded` : `robot_${model.userData.robot}`;
  model.updateMatrixWorld(true);
}

// Label groups (same shape as assembly.js › assemblyDescription): one per assembly, arms and legs per side.
const SIDED = { arms: 'Arm', legs: 'Bein' };
export function robotParts(model) {
  const de = Object.fromEntries(model.userData.parts.assemblies.map(a => [a.id, a.de]));
  model.updateMatrixWorld(true);
  const groups = new Map(), toLocal = model.matrixWorld.clone().invert();
  model.traverse(o => {
    if (!o.isMesh || !o.userData.asm) return;
    for (let p = o; p; p = p.parent) if (!p.visible) return; // hidden study helmet or parts hidden in the navigation
    const { asm, side } = o.userData, sided = SIDED[asm] && (side === 'R' || side === 'L');
    const key = sided ? `${asm} ${side}` : asm, socket = SOCKETS[asm] + (sided ? `_${side}` : '');
    if (!groups.has(key)) groups.set(key, { id: sided ? `${SIDED[asm]} ${side}` : de[asm], socket, meshes: [], box: new THREE.Box3() });
    const g = groups.get(key); g.meshes.push({ name: o.name, path: `${o.userData.part_de ?? o.userData.part_label ?? o.userData.partLabel ?? 'Helm'} (${o.name || o.parent?.name})` }); g.box.expandByObject(o);
  });
  return [...groups.values()].map(({ box, socket, ...g }) => ({ ...g, label: `${socket} · ${g.meshes.length} Teile`, connection: socket,
    center: box.getCenter(new THREE.Vector3()).applyMatrix4(toLocal).toArray() }));
}
