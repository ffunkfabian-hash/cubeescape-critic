// three.js generator of the robot bodies (0.14 "Foundry" Wächter, 0.15 "Anvil" Paladin and Mechanik): replaces the Blender
// export of cubeescape-ballon round 5 (blender/robot/export_robot.py) and builds the same scene as the GLB in
// assets/robot-bodies/<name>/: one root node per segment (SEG_<segment>, ARM_<side>_<segment>, extras asm and side), the meshes
// below it (indexed like the GLB) with extras asm, part, part_de, side and study, flat role materials MT_<role>_color. glTF axes
// (metres, Y up, front +Z); the parts are built in the Ballon world (mm, Z up, front −Y) and converted like the glTF exporter.
import * as THREE from 'three';
import roles from '../ballonRoles.json' with { type: 'json' };
import { frameFrom } from './frame.js';
import { robotSpec, ASSEMBLIES, asmOfSegment } from './robot.js';
import { partGeometry, indexGeometry, CUT_RETRIES } from './mesh.js';
import CUT_STAGES from './cutStages.json' with { type: 'json' };
import { UPPER_MM, FORE_MM, FINGER_X, FINGER_SCALE, FINGER_LINKS, KNUCKLE_Z, THUMB_BASE, THUMB_DIR, THUMB_LINKS, FINGER_POSES, SEGMENTS as ARM_SEGMENTS } from './arm.js';

const MM = 0.001;
// Ballon world → glTF: (x, y, z) → (x, z, −y)
const TO_GLTF = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
const FROM_GLTF = TO_GLTF.clone().invert();

const mat = (cols, loc) => new THREE.Matrix4().makeBasis(...cols.map(c => new THREE.Vector3(...c))).setPosition(...loc);
const rotX = deg => new THREE.Matrix4().makeRotationX(deg * Math.PI / 180);
const rotY = deg => new THREE.Matrix4().makeRotationY(deg * Math.PI / 180);
const trans = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z);

// Flat role material as in the GLB (Ballon basic/kit.py MATERIALS, mode color; values in ballonRoles.json; double-sided like
// Blender's export).
export function roleMaterial(role) {
  const r = roles.roles[role];
  if (!r) throw new Error(`robotgen: no material for role ${role}`);
  const m = new THREE.MeshStandardMaterial({ name: `MT_${role}_color`, roughness: r.roughness, metalness: r.metalness, side: THREE.DoubleSide });
  m.color.setRGB(...r.color, THREE.LinearSRGBColorSpace);
  if (r.emissive) { m.emissive.setRGB(...r.emissive, THREE.LinearSRGBColorSpace); m.emissiveIntensity = r.emissiveIntensity ?? 1; }
  return m;
}

// Segment matrices (Ballon world, mm) of both arms in the idle pose (robot_build.pose_arms without weapon and
// tools/ego_build.solve_arm for the fingers).
export function armPose(spec) {
  const P = spec.poses.idle, fp = FINGER_POSES[P.fingers];
  const out = {};
  for (const side of ['R', 'L']) {
    const sx = side === 'R' ? -1 : 1;                 // world side (right at −X)
    const hs = side === 'R' ? 1 : -1;                 // hand side in solve_arm
    const S = new THREE.Vector3(...spec.shoulder[side]);
    const o = [sx, 0, 0];
    const ud = new THREE.Vector3(sx * -P.upper[0], P.upper[1], P.upper[2]).normalize();
    const fd = new THREE.Vector3(sx * -P.fore[0], P.fore[1], P.fore[2]).normalize();
    const E = S.clone().addScaledVector(ud, UPPER_MM), Wp = E.clone().addScaledVector(fd, FORE_MM);
    const H = mat(frameFrom(fd.toArray(), o), Wp.toArray());
    const segs = { hand: H };
    FINGER_X.forEach((fx, i) => {
      let M = H.clone().multiply(trans(hs * fx, 0, KNUCKLE_Z));
      FINGER_LINKS.forEach((L0, j) => {
        M = M.multiply(rotX(fp.f[i][j]));
        segs[`f${i}_${j}`] = M.clone();
        M = M.multiply(trans(0, 0, L0 * FINGER_SCALE[i]));
      });
    });
    const [flex, abd, tip] = fp.t;
    let T = H.clone().multiply(mat(frameFrom([hs * THUMB_DIR[0], THUMB_DIR[1], THUMB_DIR[2]], [0, 1, 0]), [hs * THUMB_BASE[0], THUMB_BASE[1], THUMB_BASE[2]]))
      .multiply(rotY(-hs * (abd - 30)));
    THUMB_LINKS.forEach((L, j) => {
      T = T.multiply(rotX([flex, tip * 0.6, tip][j]));
      segs[`t_${j}`] = T.clone();
      T = T.multiply(trans(0, 0, L));
    });
    const hy = new THREE.Vector3().setFromMatrixColumn(H, 1).toArray();
    segs.upper = mat(frameFrom(E.clone().sub(S).toArray(), o), S.toArray());
    segs.fore = mat(frameFrom(Wp.clone().sub(E).toArray(), hy), E.toArray());
    out[side] = segs;
  }
  return out;
}

// Root node of a segment: matrix (Ballon world, mm) converted to glTF metres.
function segmentNode(name, M, asm, side) {
  const m = M.clone();
  m.elements[12] *= MM; m.elements[13] *= MM; m.elements[14] *= MM;
  const node = new THREE.Object3D();
  node.name = name;
  TO_GLTF.clone().multiply(m).multiply(FROM_GLTF).decompose(node.position, node.quaternion, node.scale);
  node.userData = { name, asm, side };
  return node;
}

// Body study as a scene like the GLB: { scene, spec, parts, stages }. name: waechter, paladin or mechanik (robotgen/studies.js).
// stages: cut stage to try first per part (key `${segment node}/${mesh name}`), default the checked table cutStages.json; the
// returned stages list the stage each cut part needed (robotgen_cut_stages.mjs writes the table from it).
export function buildRobotBody(name, { stages = CUT_STAGES.stages[name] ?? {} } = {}) {
  const used = {};
  const spec = robotSpec(name);
  const de = new Map(spec.parts.map(([asm, p]) => [`${asm}:${p[0]}`, p[1]]));
  const materials = new Map();
  const material = role => { if (!materials.has(role)) materials.set(role, roleMaterial(role)); return materials.get(role); };
  const roots = [];
  const addParts = (node, list, side, naming) => {
    const sx = side === 'L' ? -1 : 1;
    for (const [asm, [pid, , , kind, role, p]] of list) {
      const key = `${node.name}/${naming(pid)}`, raw = partGeometry(kind, p, sx, CUT_RETRIES, stages[key] ?? 0);
      if (p.cuts?.length) used[key] = raw.userData.cutStage;
      const geo = indexGeometry(raw);
      geo.applyMatrix4(TO_GLTF);
      const mesh = new THREE.Mesh(geo, material(role));
      mesh.name = naming(pid);
      mesh.userData = { name: mesh.name, asm, part: pid, side, part_de: de.get(`${asm}:${pid}`) ?? pid, study: spec.study };
      node.add(mesh);
    }
  };
  for (const [name_, A, B, hint, side] of spec.segments) {
    const kind = name_.split('_')[0], asm = asmOfSegment(kind);
    const M = mat(frameFrom(B.map((b, i) => b - A[i]), hint), A);
    const node = segmentNode(`SEG_${name_}`, M, asm, side);
    addParts(node, spec.parts.filter(([a, p]) => a !== 'arms' && p[2] === kind), side, pid => (side !== 'C' ? `${name_}_${pid}` : pid));
    roots.push(node);
  }
  const pose = armPose(spec);
  for (const side of ['R', 'L']) {
    for (const s of ARM_SEGMENTS) {
      const node = segmentNode(`ARM_${side}_${s}`, pose[side][s], 'arms', side);
      addParts(node, spec.parts.filter(([a, p]) => a === 'arms' && p[2] === s), side, pid => `arm_${side}_${pid}`);
      roots.push(node);
    }
  }
  const scene = new THREE.Group();
  scene.name = `robotgen_${name}`;
  for (const r of roots.sort((a, b) => (a.name < b.name ? -1 : 1))) scene.add(r);
  scene.userData = { generator: 'robotgen', study: spec.study };
  return { scene, spec, parts: partsIndex(scene, spec), stages: used };
}

// Assemblies → parts → objects as parts.json of the GLB export (export_robot.py): objects sorted by name, grouped by
// assembly, part and side in that order.
export function partsIndex(scene, spec) {
  const rows = [];
  scene.traverse(o => { if (o.isMesh) rows.push(o); });
  rows.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const groups = new Map();
  for (const o of rows) {
    const { asm, part, part_de, side } = o.userData, k = `${asm}\u0000${part}\u0000${side}`;
    if (!groups.has(k)) groups.set(k, { asm, part, part_de, side, objects: [] });
    groups.get(k).objects.push(o.name);
  }
  return {
    study: spec.study, name: spec.name,
    assemblies: ASSEMBLIES.map(a => ({ id: a.id, de: a.de, en: a.en, explode_mm: [...spec.explode[a.id]], parts: [...groups.values()].filter(g => g.asm === a.id) })),
  };
}
