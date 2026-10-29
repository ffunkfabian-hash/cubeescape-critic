// Simple full-body proposal: the unchanged Bastion upper body plus waist, hips, arms, hands, legs and feet.
// Block forms only (faceted lofts and beveled plates); no fingers, rig or mounting details. +Y up, +Z forward.
import * as THREE from 'three';
import defaults from '../fullBodyParams.json' with { type: 'json' };
import { beveledPlate, buildShoulderStudy, shoulderStudyParams, signedVolume, solid } from './shoulderStudy.js';

export const fullBodyParams = structuredClone(defaults);

// Stable feedback handles continue after the upper body's B01-B31. Side A is -X (the shoulder study's _R side).
export const FULL_BODY_PARTS = Object.freeze({
  B32: 'AbdomenLame_1', B33: 'AbdomenLame_2', B34: 'AbdomenLame_3', B35: 'WaistBelt', B36: 'PelvisCore',
  B37: 'HipPlate_R', B38: 'HipPlate_L',
  B39: 'UpperArm_R', B40: 'UpperArm_L', B41: 'Elbow_R', B42: 'Elbow_L', B43: 'Forearm_R', B44: 'Forearm_L',
  B45: 'Hand_R', B46: 'Hand_L',
  B47: 'HipJoint_R', B48: 'HipJoint_L', B49: 'Thigh_R', B50: 'Thigh_L', B51: 'Knee_R', B52: 'Knee_L',
  B53: 'KneePad_R', B54: 'KneePad_L', B55: 'Shin_R', B56: 'Shin_L', B57: 'Foot_R', B58: 'Foot_L',
});

// Closed faceted tube through rings [y, rx, rz, cx, cz]; the half-step phase puts a flat face to the front.
function loftShell(rings, segments, side = 1) {
  const vertices = [], triangles = [];
  for (const [y, rx, rz, cx, cz] of rings) for (let i = 0; i < segments; i++) {
    const a = 2 * Math.PI * (i + 0.5) / segments;
    vertices.push([side * cx + rx * Math.sin(a), y, cz + rz * Math.cos(a)]);
  }
  for (let r = 0; r < rings.length - 1; r++) for (let i = 0; i < segments; i++) {
    const a = r * segments + i, b = r * segments + (i + 1) % segments;
    triangles.push(a, b, b + segments, a, b + segments, a + segments);
  }
  for (const [ring, flip] of [[0, true], [rings.length - 1, false]]) {
    const middle = vertices.length, [y, , , cx, cz] = rings[ring];
    vertices.push([side * cx, y, cz]);
    for (let i = 0; i < segments; i++) {
      const a = ring * segments + i, b = ring * segments + (i + 1) % segments;
      triangles.push(middle, flip ? b : a, flip ? a : b);
    }
  }
  return { vertices, triangles };
}

// Several closed shells in one part; each shell is oriented outward on its own before merging.
function shells(...parts) {
  const vertices = [], triangles = [];
  for (const shell of parts) {
    const offset = vertices.length, own = [...shell.triangles];
    if (signedVolume(shell.vertices, own) < 0) for (let i = 0; i < own.length; i += 3) [own[i + 1], own[i + 2]] = [own[i + 2], own[i + 1]];
    vertices.push(...shell.vertices);
    triangles.push(...own.map(i => i + offset));
  }
  return solid(vertices, triangles);
}

// Faceted capsule standing for a joint placeholder.
function joint({ center: [cx, cy, cz], radius, halfHeight }, segments, side) {
  return loftShell([[cy + halfHeight + 0.6 * radius, 0.6 * radius, 0.6 * radius, cx, cz], [cy + halfHeight, radius, radius, cx, cz],
    [cy - halfHeight, radius, radius, cx, cz], [cy - halfHeight - 0.6 * radius, 0.6 * radius, 0.6 * radius, cx, cz]], segments, side);
}

export function buildFullBody(M, p = fullBodyParams, upper = shoulderStudyParams) {
  const root = buildShoulderStudy(M, upper);
  root.name = 'FullBodyStudy';
  root.userData.study = `${p.name}: simple full body on ${upper.name ?? 'the'} upper body`;
  const add = (id, geometry, material) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = FULL_BODY_PARTS[id];
    mesh.userData.partId = id;
    mesh.userData.assembly = 'FullBodyStudy';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
    return mesh;
  };
  const w = p.waist, a = p.arm, l = p.leg, bevel = p.bevel;
  // Overlapping dark lamellae: each band's narrow top tucks under the band above.
  w.lamellae.forEach((rings, i) => add(`B3${2 + i}`, shells(loftShell(rings, w.segments)), M.darkArmor));
  add('B35', shells(loftShell(w.belt, w.segments)), M.whiteArmor);
  add('B36', shells(loftShell(w.core, w.segments)), M.blackRubber);
  for (const [side, ids] of [[-1, ['B37', 'B39', 'B41', 'B43', 'B45', 'B47', 'B49', 'B51', 'B53', 'B55', 'B57']],
    [1, ['B38', 'B40', 'B42', 'B44', 'B46', 'B48', 'B50', 'B52', 'B54', 'B56', 'B58']]]) {
    const [hip, upperArm, elbow, fore, hand, hipJoint, thigh, knee, kneePad, shin, foot] = ids;
    const h = w.hipPlate, top = Math.max(...h.outline.map(p => p[1])), span = top - Math.min(...h.outline.map(p => p[1]));
    // Side tasset hangs from the belt and flares outward toward its lower edge.
    add(hip, beveledPlate(h.outline, h.thickness, bevel,
      (z, y, d) => [side * (h.x + h.flare * (top - y) / span + d), y, z]), M.whiteArmor);
    add(upperArm, shells(loftShell(a.upper, a.segments, side)), M.whiteArmor);
    add(elbow, shells(joint(a.elbow, a.segments, side)), M.blackRubber);
    add(fore, shells(loftShell(a.fore, a.segments, side)), M.whiteArmor);
    // Mitten hand: palm block plus a separate thumb shell on the front edge.
    add(hand, shells(loftShell(a.hand, a.segments, side), loftShell(a.thumb, 6, side)), M.darkArmor);
    add(hipJoint, shells(joint(l.hip, l.segments, side)), M.blackRubber);
    add(thigh, shells(loftShell(l.thigh, l.segments, side)), M.whiteArmor);
    add(knee, shells(joint(l.knee, l.segments, side)), M.blackRubber);
    const k = l.kneePad;
    add(kneePad, beveledPlate(k.outline, k.depth, bevel, (x, y, d) => [side * x, y, k.front - d]), M.whiteArmor);
    add(shin, shells(loftShell(l.shin, l.segments, side)), M.whiteArmor);
    const f = l.foot;
    add(foot, beveledPlate(f.profile, f.width, bevel, (z, y, d) => [side * (f.x - f.width / 2 + d), y, z]), M.darkArmor);
  }
  return root;
}
