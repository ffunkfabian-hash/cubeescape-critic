// Helmet choice on the Ballon robot bodies (0.12 "Fusion"): the study helmet from the GLB, the three.js Critic helmet
// (H01–H21) or Scout v3. The robot's head segment SEG_head is a GLB root whose origin is Socket_Neck; in its glTF-local frame
// +Y runs from the neck to the head top and the face looks along −Z (Ballon: +Y local = HEAD_HINT, front). A chosen helmet hangs
// in that segment, rotated half a turn about Y (Critic/Scout look along +Z), so it follows the head's turn and the explosion.
// It is fitted uniformly to the box of the study helmet: same height, same bottom, same centre in x/z. The robot's neck
// (neck, neck_ring, neck_trim) stays; the study helmet parts are hidden, not removed, so switching back is lossless.
import * as THREE from 'three';
import COLORS from './robotHelmetColors.json' with { type: 'json' };
import VARIANTS from './criticHelmetVariants.json' with { type: 'json' };
import ROLES from './ballonRoles.json' with { type: 'json' };
import { keepColor, setWearScale } from './robotWear.js';

export const CRITIC_VARIANTS = VARIANTS;

export const HELMET_COLORS = COLORS;

export const HELMETS = {
  study: 'Studienhelm',
  critic: 'Helm H (H01–H21)',
  scout: 'Scout (S01–S13)',
};
// Metres per world unit of the helmet frame (Critic helmet, Scout fitted to it), for wear on a helmet shown alone.
export const HELMET_FRAME_METERS = ROLES.helmetFrameMeters;

// Colour schemes for bodies and helmets: 'body' (Farbschema 1, the body palette), 'helmet' (Farbschema 2, helmet H's own
// colours on every role) or 'original' (each model in its own materials).
export const COLOR_SCHEMES = {
  body: { label: 'Creme', title: 'Farbschema 1: Palette der Körper (Creme, Eloxal, brüniertes Metall, orange Akzente)' },
  helmet: { label: 'Weiß-Graphit', title: 'Farbschema 2: Originalfarben von Helm H (Weiß, Graphit, dunkles Metall, Cyan)' },
  original: { label: 'Original', title: 'jedes Modell in seinen eigenen Materialien' },
};

// Farbschema 2 as role materials (MT_<role>_color, so the wear shader knows the role): colour, roughness, metalness and
// emission of helmet H's original materials (`source`: name → material, e.g. createMaterials('original', 'original')).
export function schemePalette(source, table = COLORS.scheme2) {
  return new Map(Object.entries(table).filter(([role]) => role !== 'note').map(([role, name]) => {
    const s = source[name];
    if (!s) throw new Error(`scheme2: helmet material ${name} missing for ${role}`);
    const m = new THREE.MeshStandardMaterial({ name: `MT_${role}_color`, roughness: s.roughness, metalness: s.metalness });
    keepColor(m); // the wear shader must not swap in the Ballon colours of graphite/rubber
    m.color.copy(s.color);
    if (s.emissive) { m.emissive.copy(s.emissive); m.emissiveIntensity = s.emissiveIntensity; }
    return [role, m];
  }));
}

// Dress a body in a palette (Map role → material): every mesh with a role material takes the palette's. Call
// releaseRobotWear(robot) first if the body was aged, then setRobotWear again.
export function dressBody(robot, palette) {
  robot.traverse(o => {
    const role = o.isMesh && !o.userData.helmet && /^MT_(.+)_color$/.exec(o.material.name)?.[1];
    if (role && palette.has(role)) o.material = palette.get(role);
  });
}

// Farbschema 1 as materials (MT_<role>_color like the body GLBs), for helmets shown without a body.
let paletteCache = null;
export function paletteMaterials() {
  if (paletteCache) return paletteCache;
  paletteCache = new Map(Object.entries(ROLES.roles).map(([role, r]) => {
    const m = new THREE.MeshStandardMaterial({ name: `MT_${role}_color`, metalness: r.metalness, roughness: r.roughness });
    m.color.setRGB(...r.color, THREE.LinearSRGBColorSpace);
    if (r.emissive) { m.emissive.setRGB(...r.emissive, THREE.LinearSRGBColorSpace); m.emissiveIntensity = r.emissiveIntensity ?? 1; }
    return [role, m];
  }));
  return paletteCache;
}
export const NECK_PARTS = ['neck', 'neck_ring', 'neck_trim'];
// Antennas and stubs reach far above the shell; the fit uses the shell only (as SCOUT_FRAME does for Scout).
const STUDY_EXTRAS = /^(antenna|stub)/;

const headSegment = robot => robot.children[0].children.find(n => n.name === 'SEG_head');

// Mesh of the study helmet in the GLB (head assembly without the neck parts; meshes of a hung-in helmet carry userData.helmet).
export const isStudyHelmetPart = o => o.isMesh && o.userData.asm === 'head' && !NECK_PARTS.includes(o.userData.part) && !o.userData.helmet;

// Box of meshes in the frame of `frame` (only meshes passing `keep`).
export function boxIn(frame, root, keep = () => true) {
  frame.updateMatrixWorld(true);
  root.updateMatrixWorld(true);
  const inv = frame.matrixWorld.clone().invert(), box = new THREE.Box3(), m = new THREE.Matrix4();
  root.traverse(o => {
    if (!o.isMesh || !keep(o)) return;
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    box.union(o.geometry.boundingBox.clone().applyMatrix4(m.multiplyMatrices(inv, o.matrixWorld)));
  });
  return box;
}

// Scale and position for a helmet (local box `helmet`, turned half a turn about Y) inside the head segment so that it matches
// the study helmet box `study`: equal height, equal bottom, equal centre in x and z.
export function fitHelmet(study, helmet) {
  const s = (study.max.y - study.min.y) / (helmet.max.y - helmet.min.y);
  const hc = helmet.getCenter(new THREE.Vector3()), sc = study.getCenter(new THREE.Vector3());
  // turned half a turn: (x, y, z) → (−x, y, −z)
  return { scale: s, position: [sc.x + s * hc.x, study.min.y - s * helmet.min.y, sc.z + s * hc.z] };
}

// Helmet shell box in the helmet's own frame, without antennas (Critic: groups Antenna*, after removing the presentation neck
// with configureHelmetAssembly(…, { body: 'full' }) the shell runs from the chin to the headband; Scout: objects Antenne_*).
const inAntenna = o => { for (let p = o; p; p = p.parent) if (/^Antenn/.test(p.userData.source_object ?? p.name)) return true; return false; };
export const helmetShellBox = helmet => boxIn(helmet, helmet, o => !inAntenna(o));

// Robot colours on a helmet: each helmet material listed in robotHelmetColors.json gets the robot's own flat material of that
// Ballon role (shared instance, so setRobotWear ages it like the body). roleMaterials: Map role → material of the robot GLB.
// finish: Critic finish of the helmet (helmet.userData.finish); entries may name a role per finish (variants 80–88).
export function matchRobotColors(helmet, kind, roleMaterials, finish = helmet.userData.finish ?? 'original') {
  const table = COLORS[kind] ?? {};
  let changed = 0;
  helmet.traverse(o => {
    if (!o.isMesh || Array.isArray(o.material)) return;
    const entry = table[o.material.name], role = typeof entry === 'object' ? entry[finish] : entry;
    const m = roleMaterials.get(role);
    if (m) { o.material = m; setWearScale(o, COLORS.wear?.[kind] ?? 1); changed++; }
  });
  return changed;
}

// Put `helmet` (Object3D in Critic helmet frame, or null for the study helmet) on the robot; returns the fit or null.
// colors 'body' or 'helmet': helmet materials replaced by the palette's role materials (matchRobotColors; palette defaults to
// the robot's own), 'original': helmet keeps its own.
export function setRobotHelmet(robot, kind, helmet, colors = 'body', palette = robot.userData.roleMaterials) {
  const seg = headSegment(robot);
  if (!seg) throw new Error('robot without SEG_head');
  const old = seg.children.find(c => c.userData.robotHelmet);
  if (old) old.removeFromParent();
  const studyParts = [];
  seg.traverse(o => { if (isStudyHelmetPart(o)) studyParts.push(o); });
  for (const o of studyParts) o.visible = !helmet;
  robot.userData.helmet = helmet ? kind : 'study';
  if (!helmet) return null;
  const study = boxIn(seg, seg, o => studyParts.includes(o) && !STUDY_EXTRAS.test(o.userData.part));
  const fit = fitHelmet(study, helmetShellBox(helmet));
  if (colors !== 'original' && palette) matchRobotColors(helmet, kind, palette);
  const holder = new THREE.Group();
  holder.name = `helmet_${kind}`;
  holder.userData = { robotHelmet: kind };
  holder.rotation.y = Math.PI;
  holder.scale.setScalar(fit.scale);
  holder.position.fromArray(fit.position);
  holder.add(helmet);
  helmet.traverse(o => { if (o.isMesh) { o.userData.asm = 'head'; o.userData.helmet = kind; o.castShadow = o.receiveShadow = true; } });
  seg.add(holder);
  return fit;
}
