// RightComms_And_Tube (-X and rear): olive radio module with buttons and whip antenna, rear tech box with four
// corner screws, and the ribbed black hose from the radio's lower front edge into the box.
import * as THREE from 'three';
import { D } from '../params.js';
import { brush, csg, prism, roundedRect, SUBTRACTION } from '../geo.js';
import { screws } from './common.js';

function tube(points, r) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  return [curve, new THREE.TubeGeometry(curve, 64, r, 10)];
}

export function buildRightComms(M) {
  const g = new THREE.Group();
  g.name = 'RightComms_And_Tube';
  const e = D.earR;

  // Radio module: rounded box on the right ear, thickness towards +X (into the helmet).
  const depth = 0.05, bevel = 0.025;
  const radioGeo = new THREE.ExtrudeGeometry(roundedRect(e.w - 2 * bevel, e.h - 2 * bevel, 0.07), {
    depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 6, curveSegments: 12,
  });
  radioGeo.rotateY(-Math.PI / 2); // (u, v, w) -> (-w, v, u)
  radioGeo.rotateY(Math.PI); // flip so the extrusion grows towards +X: (u, v, w) -> (w, v, -u)
  radioGeo.translate(e.outerX + bevel, e.cy, e.cz);
  const radio = new THREE.Mesh(radioGeo, M.oliveTech);
  radio.name = 'RadioModule';
  g.add(radio);

  // Cushion ring between radio and helmet.
  const cushion = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.02, 48).rotateZ(Math.PI / 2), M.blackRubber);
  cushion.scale.set(1, e.h * 0.46, e.w * 0.46);
  cushion.position.set(e.outerX + depth + bevel * 2 + 0.008, e.cy, e.cz);
  g.add(cushion);

  // Buttons on the outer face.
  const face = e.outerX - 0.002;
  const buttons = new THREE.Group();
  buttons.name = 'Buttons';
  for (const [dz, dy, w, h] of [[0.02, -0.03, 0.05, 0.075], [-0.035, -0.06, 0.04, 0.05]]) {
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.02, h, w), M.blackRubber);
    pad.position.set(face, e.cy + dy, e.cz + dz);
    pad.rotation.x = 0.35;
    buttons.add(pad);
  }
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.014, 24).rotateZ(Math.PI / 2), M.darkMetal);
  knob.position.set(face, e.cy + 0.075, e.cz + 0.02);
  buttons.add(knob);
  g.add(buttons);

  // Whip antenna rising from the module's upper front edge.
  const ax = e.outerX + 0.035, az = e.cz + e.w * 0.28, ay = e.cy + e.h / 2;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.017, 0.05, 16), M.darkMetal);
  base.position.set(ax, ay + 0.02, az);
  const whipLen = D.antenna.top - ay;
  const whip = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0075, whipLen, 10), M.darkMetal);
  whip.position.set(ax, ay + whipLen / 2, az);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.008, 12, 8), M.darkMetal);
  tip.position.set(ax, D.antenna.top, az);
  const antenna = new THREE.Group();
  antenna.name = 'Antenna';
  antenna.add(base, whip, tip);
  g.add(antenna);

  // Yoke joining the head band to the radio, and wire bails over the module.
  const yoke = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.09), M.darkArmor);
  yoke.name = 'Yoke';
  yoke.position.set(e.outerX + 0.045, ay + 0.03, D.band.z);
  g.add(yoke);
  for (const dz of [-0.085, 0.085]) {
    const [, geo] = tube([[e.outerX + 0.06, ay + 0.06, D.band.z], [e.outerX + 0.005, ay + 0.04, e.cz + dz], [e.outerX + 0.01, ay - 0.02, e.cz + dz]], 0.004);
    g.add(new THREE.Mesh(geo, M.darkMetal));
  }

  // Rear tech box: mounting plate, box with a recessed polygonal field and logo, four corner screws, cylindrical side
  // connectors (the coiled cord leaves through the one on the cord side).
  const bb = D.backBox, zBack = -(D.core.rz - D.core.cz) + 0.035;
  const plateGeo = new THREE.ExtrudeGeometry(roundedRect(bb.w + 0.03, bb.h + 0.03, 0.02), { depth: 0.09, bevelEnabled: false });
  plateGeo.rotateY(Math.PI); // faces -Z, extrusion towards -Z
  plateGeo.translate(0, bb.cy, zBack);
  const plate = new THREE.Mesh(plateGeo, M.oliveTech);
  plate.name = 'BackBox_Mount';
  const boxFront = zBack - 0.09;
  const boxGeo = new THREE.ExtrudeGeometry(roundedRect(bb.w, bb.h, 0.025), { depth: 0.035, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 3 });
  boxGeo.rotateY(Math.PI);
  boxGeo.translate(0, bb.cy, boxFront);
  const face0 = boxFront - 0.043;
  const rw = bb.w * 0.31, rh = bb.h * 0.28, ch = 0.022;
  const field = [[-rw + ch, rh], [rw - ch, rh], [rw, rh - ch], [rw, -rh + ch], [rw - ch, -rh], [-rw + ch, -rh], [-rw, -rh + ch], [-rw, rh - ch]];
  const recess = brush(prism(field.map(([x, y]) => [x, y + bb.cy]), 'xy', 0.04), { pos: [0, 0, face0 - 0.02 + 0.012] });
  const box = new THREE.Mesh(csg(brush(boxGeo), [SUBTRACTION, recess]).geometry, M.oliveTech);
  box.name = 'BackBox';
  const logo = new THREE.Group();
  logo.name = 'Logo';
  for (const [x, rot, len] of [[-0.018, -0.35, 0.09], [0.018, 0.35, 0.09], [0.0, 0, 0.07]]) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.01, len, 0.008), M.oliveTech);
    bar.position.set(x, bb.cy - (len === 0.07 ? 0.005 : 0), face0 + 0.008);
    bar.rotation.z = rot;
    logo.add(bar);
  }
  const tabs = [-1, 1].map((s) => {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.045, 20).rotateZ(Math.PI / 2), M.darkMetal);
    t.name = 'BackBox_Connector';
    t.position.set(s * (bb.w / 2 + 0.022), bb.cy - 0.03, boxFront - 0.02);
    return t;
  });
  const corner = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    corner.push({ point: new THREE.Vector3(sx * (bb.w / 2 - 0.028), bb.cy + sy * (bb.h / 2 - 0.028), face0), normal: new THREE.Vector3(0, 0, -1) });
  }
  const backBox = new THREE.Group();
  backBox.name = 'BackBox_Group';
  backBox.add(plate, box, logo, ...tabs, screws(M, corner, 'Screws_BackBox'));
  g.add(backBox);

  // Coiled cord: a helix wound around a Catmull-Rom path (Frenet frames), with three light clamps. It leaves the back box
  // sideways, loops out and down, runs along the lower side frame and rises to the radio module.
  const T = D.tube;
  const path = new THREE.CatmullRomCurve3(T.points.map((p) => new THREE.Vector3(...p)));
  const len = path.getLength();
  const turns = Math.round(len / T.pitch);
  const steps = turns * 16;
  const frames = path.computeFrenetFrames(steps, false);
  const helix = [];
  for (let i = 0; i <= steps; i++) {
    const a = (i / 16) * Math.PI * 2;
    helix.push(path.getPointAt(i / steps)
      .addScaledVector(frames.normals[i], Math.cos(a) * T.coilRadius)
      .addScaledVector(frames.binormals[i], Math.sin(a) * T.coilRadius));
  }
  const hose = new THREE.Group();
  hose.name = 'Hose';
  const coil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helix), steps * 2, T.wireRadius, 8), M.blackRubber);
  coil.name = 'Hose_Coil';
  hose.add(coil);
  const Z = new THREE.Vector3(0, 0, 1);
  // Connectors where the cord enters the back box and the radio module.
  for (const t of [0, 1]) {
    const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.035, 16).rotateX(Math.PI / 2), M.darkMetal);
    plug.name = 'Hose_Plug';
    plug.position.copy(path.getPointAt(t));
    plug.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), path.getTangentAt(t));
    hose.add(plug);
  }
  for (const t of [0.3, 0.55, 0.8]) {
    const r = T.coilRadius + T.wireRadius + 0.004;
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.05, 20).rotateX(Math.PI / 2), M.whiteArmor);
    sleeve.position.copy(path.getPointAt(t));
    sleeve.quaternion.setFromUnitVectors(Z, path.getTangentAt(t));
    hose.add(sleeve);
  }
  g.add(hose);
  return g;
}
