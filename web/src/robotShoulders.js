// Shoulders as their own assembly (0.17, user's wish): pauldrons with their edges and stripes, shoulder discs, axles and pistons
// (Ballon: upper body) and the arm's shoulder ball (Ballon: arms) move to nodes SHOULDER_R/SHOULDER_L between upper body and arm,
// so they explode and show apart from both. Viewer only: GLB, parts.json and the generator keep Ballon's grouping; the meshes keep
// their extras (asm for skins and roles) and their atlas key (userData.sourcePath), the assembly is userData.assembly.
// No GLB imports, so the test (robotShoulders.test.mjs) runs it on the generated bodies in Node.
import * as THREE from 'three';
import { skinMeshes } from './skinAtlas.js';

export const SHOULDERS = { id: 'shoulders', de: 'Schultern', en: 'Shoulders', explode_mm: [150, 0, 20] };
export const shoulderSide = name => /^(?:pauldron|shoulder(?:_piston)?)_([rl])(?:_|$)/.exec(name)?.[1].toUpperCase() ?? /^arm_([RL])_shoulder_ball$/.exec(name)?.[1] ?? null;
export const assemblyOf = o => o.userData.assembly ?? o.userData.asm;

// Moves the shoulder meshes of a body scene (`inner`: segment nodes as children) into SHOULDER_R/L and returns the parts index
// with the shoulder assembly.
export function separateShoulders(inner, parts) {
  const keys = new Map(skinMeshes(inner).map(({ mesh, key }) => [mesh, key]));
  const torso = inner.children.find(n => n.name === 'SEG_torso'), nodes = {};
  inner.updateMatrixWorld(true);
  for (const side of ['R', 'L']) {
    const n = new THREE.Object3D();
    n.name = `SHOULDER_${side}`;
    n.position.copy(torso.position); n.quaternion.copy(torso.quaternion); n.scale.copy(torso.scale);
    n.userData = { name: n.name, asm: SHOULDERS.id, side };
    inner.add(n);
    n.updateMatrixWorld(true);
    nodes[side] = n;
  }
  const moved = [];
  inner.traverse(o => { if (o.isMesh && shoulderSide(o.name)) moved.push(o); });
  for (const o of moved) {
    o.userData.sourcePath = `${inner.name || 'root'}/${keys.get(o)}`;
    o.userData.assembly = SHOULDERS.id;
    nodes[shoulderSide(o.name)].attach(o);
  }
  // parts index: the shoulder parts leave arms and upper body for their own assembly (before the arms)
  const names = new Set(moved.map(o => o.name));
  const assemblies = parts.assemblies.map(a => ({ ...a, parts: a.parts.filter(p => !p.objects.every(n => names.has(n))) }));
  const shoulder = { ...SHOULDERS, parts: parts.assemblies.flatMap(a => a.parts.filter(p => p.objects.every(n => names.has(n)))) };
  assemblies.splice(assemblies.findIndex(a => a.id === 'arms'), 0, shoulder);
  return { ...parts, assemblies };
}
