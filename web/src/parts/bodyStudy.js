// First proportional study: independently named armor parts, in helmet coordinates.
import * as THREE from 'three';

function plate(name, points, depth, z, material) {
  const outline = new THREE.Shape();
  outline.moveTo(...points[0]);
  for (const point of points.slice(1)) outline.lineTo(...point);
  outline.closePath();
  const geometry = new THREE.ExtrudeGeometry(outline, {
    depth, bevelEnabled: true, bevelSize: 0.018, bevelThickness: 0.018, bevelSegments: 2,
  });
  geometry.translate(0, 0, z - depth / 2);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  return mesh;
}

export function buildBodyStudy(M) {
  const body = new THREE.Group();
  body.name = 'BodyStudy';
  const core = new THREE.Mesh(new THREE.CapsuleGeometry(0.33, 0.65, 8, 24), M.blackRubber);
  core.name = 'Torso_Core';
  core.scale.set(1.3, 1, 0.72);
  core.position.set(0, -1.27, 0);
  body.add(core);
  const connector = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.2, 32), M.blackRubber);
  connector.name = 'Neck_Connector';
  connector.scale.z = 0.9;
  connector.position.set(0, -0.7, 0);
  body.add(connector);

  const breast = [[-0.47,-0.76],[-0.27,-0.66],[0.27,-0.66],[0.47,-0.76],
    [0.43,-1.12],[0.29,-1.29],[-0.29,-1.29],[-0.43,-1.12]];
  body.add(plate('Chest_Armor', breast, 0.12, 0.23, M.whiteArmor));
  body.add(plate('Back_Armor', [[-0.39,-0.76],[-0.23,-0.67],[0.23,-0.67],[0.39,-0.76],
    [0.36,-1.15],[0.24,-1.29],[-0.24,-1.29],[-0.36,-1.15]], 0.1, -0.22, M.whiteArmor));
  body.add(plate('Chest_Center', [[-0.12,-0.8],[0.12,-0.8],[0.16,-0.99],
    [0.1,-1.16],[-0.1,-1.16],[-0.16,-0.99]], 0.035, 0.32, M.darkArmor));
  body.add(plate('Abdomen_Armor', [[-0.29,-1.32],[0.29,-1.32],[0.26,-1.63],
    [0.16,-1.7],[-0.16,-1.7],[-0.26,-1.63]], 0.08, 0.2, M.darkArmor));
  body.add(plate('Pelvis_Armor', [[-0.36,-1.69],[0.36,-1.69],[0.33,-1.88],
    [0.17,-2.02],[0,-2.08],[-0.17,-2.02],[-0.33,-1.88]], 0.13, 0.17, M.whiteArmor));
  for (const [side, suffix] of [[-1, 'R'], [1, 'L']]) {
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.7), M.whiteArmor);
    shoulder.name = `Shoulder_${suffix}`;
    shoulder.scale.set(0.3, 0.27, 0.31);
    shoulder.position.set(side * 0.59, -0.88, 0);
    shoulder.rotation.z = side * 0.16;
    body.add(shoulder);
    const joint = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 16), M.blackRubber);
    joint.name = `ShoulderJoint_${suffix}`;
    joint.position.set(side * 0.59, -1.02, 0);
    body.add(joint);
    const hip = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), M.darkArmor);
    hip.name = `Hip_${suffix}`;
    hip.scale.set(0.18, 0.22, 0.2);
    hip.position.set(side * 0.29, -1.87, 0);
    body.add(hip);
  }
  body.traverse((part) => { if (part.isMesh) { part.castShadow = true; part.receiveShadow = true; } });
  return body;
}
