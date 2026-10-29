// Robot body specification (port of cubeescape-ballon basic/robot/__init__.py with use(<study>)): five assemblies, segments in
// the rest pose, shoulders and anchors, idle pose, explosion offsets. World in mm: the figure stands on z = 0, looks towards −Y,
// right body side at −X. Segments: [name, A, B, hint, side] – frame +Z from A to B, +Y = hint; side 'R'/'L' mirrors the parts
// at X ('C' centre).
import { frame } from './frame.js';
import { skeleton } from './body.js';
import { robotArmParts, SEGMENTS as ARM_SEGMENTS } from './arm.js';
import { STUDIES } from './studies.js';

export const ASSEMBLIES = [
  { id: 'head', de: 'Kopf', en: 'Head', segments: ['head'] },
  { id: 'arms', de: 'Arme', en: 'Arms', segments: ARM_SEGMENTS },
  { id: 'upper_body', de: 'Oberkörper', en: 'Upper body', segments: ['torso'] },
  { id: 'lower_body', de: 'Unterkörper', en: 'Lower body', segments: ['pelvis'] },
  { id: 'legs', de: 'Beine', en: 'Legs', segments: ['thigh', 'shin', 'foot'] },
];
// Explosion (mm, world): graphic separation along the anchors, the upper body stays.
export const EXPLODE = { head: [0, 0, 260], upper_body: [0, 0, 0], arms: [300, 0, 40], lower_body: [0, 0, -170], legs: [90, 0, -360] };
const POSES = { idle: { upper: [-0.16, 0.02, -1.0], fore: [-0.03, -0.30, -1.0], fingers: 'relaxed' } };

export const asmOfSegment = kind => ASSEMBLIES.find(a => a.segments.includes(kind))?.id ?? null;

export function robotSpec(name) {
  const S = STUDIES[name];
  if (!S) throw new Error(`Unknown body study ${JSON.stringify(name)}; expected ${Object.keys(STUDIES).join(', ')}`);
  const K = skeleton(S.skeleton);
  const torsoPoint = local => {
    const [x, y, z] = frame(K.WAIST, K.NECK, K.TORSO_HINT);
    return [0, 1, 2].map(i => Math.round((K.WAIST[i] + local[0] * x[i] + local[1] * y[i] + local[2] * z[i]) * 1000) / 1000);
  };
  const SL = K.SHOULDER_LOCAL;
  const shoulder = { R: torsoPoint(SL), L: torsoPoint([-SL[0], SL[1], SL[2]]) };
  const J = K.JOINTS;
  const anchors = {
    Socket_Neck: { pos: K.NECK, parent: 'upper_body', child: 'head', de: 'Hals' },
    Socket_Shoulder_R: { pos: shoulder.R, parent: 'upper_body', child: 'arms', side: 'R', de: 'Schulter rechts' },
    Socket_Shoulder_L: { pos: shoulder.L, parent: 'upper_body', child: 'arms', side: 'L', de: 'Schulter links' },
    Socket_Waist: { pos: K.WAIST, parent: 'upper_body', child: 'lower_body', de: 'Taille' },
    Socket_Hip_R: { pos: J.R[0], parent: 'lower_body', child: 'legs', side: 'R', de: 'Hüfte rechts' },
    Socket_Hip_L: { pos: J.L[0], parent: 'lower_body', child: 'legs', side: 'L', de: 'Hüfte links' },
  };
  const segments = [['pelvis', K.PELVIS, K.WAIST, [0, -1, 0], 'C'], ['torso', K.WAIST, K.NECK, K.TORSO_HINT, 'C'], ['head', K.NECK, K.HEAD_TOP, K.HEAD_HINT, 'C']];
  for (const [side, [hip, knee, ankle, toe]] of Object.entries(J)) {
    segments.push([`thigh_${side}`, hip, knee, [0, -1, 0], side], [`shin_${side}`, knee, ankle, [0, -1, 0], side], [`foot_${side}`, ankle, toe, [0, 0, 1], side]);
  }
  const byAsm = {
    head: S.head(), arms: robotArmParts({ bulk: S.armBulk, drop: S.armDrop, extra: S.armExtra() }),
    upper_body: S.upperBody(), lower_body: S.lowerBody(), legs: S.legs(),
  };
  const poses = Object.fromEntries(Object.entries(POSES).map(([k, v]) => [k, { ...v, ...(S.poses?.[k] ?? {}) }]));
  return {
    name, study: S.study, skeleton: K, shoulder, anchors, segments, poses, explode: EXPLODE,
    parts: ASSEMBLIES.flatMap(a => byAsm[a.id].map(p => [a.id, p])),
  };
}
