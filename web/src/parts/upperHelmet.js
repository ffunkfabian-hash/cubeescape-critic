// UpperHelmet_Dark: dark cap and faceted front plate, V-angled visor slits, recessed mouth with two vents.
import * as THREE from 'three';
import { D } from '../params.js';
import { brush, csg, prism, shape, halfSpace, hitSurface, orient, ADDITION, SUBTRACTION, INTERSECTION } from '../geo.js';
import { boxProjectUV } from '../textures.js';
import { screws } from './common.js';
import { headVolume } from './headVolume.js';

const DEG = Math.PI / 180;

export function buildUpperHelmet(M) {
  const g = new THREE.Group();
  g.name = 'UpperHelmet_Dark';

  // Outer volume from the drawn profiles. Dark = head ∩ (cap above the brim ∪ front-plate silhouette stack).
  const H = headVolume(1);
  const capBox = brush(new THREE.BoxGeometry(2, 1, 2), { pos: [0, D.capEdgeY + 0.5, D.maskBackZ + 0.02 - 1] });
  const zb = D.maskBackZ;
  const front = brush(prism([[-0.5, 0.8], [-0.5, 0.2], [-0.345, 0.1], [-0.345, -0.02], [-0.2, -0.335], [0.2, -0.335], [0.345, -0.02], [0.345, 0.1], [0.5, 0.2], [0.5, 0.8]], 'xy'));
  const side = brush(prism([[zb - 0.02, 0.8], [0.8, 0.8], [0.8, 0.05], [0.49, -0.335], [0.16, -0.335], [0.1, -0.29], [0.0, -0.2], [zb + 0.02, 0.05]], 'zy'));
  const top = brush(prism([[-0.5, -0.3], [-0.5, 0.26], [-0.22, 0.49], [0, 0.505], [0.22, 0.49], [0.5, 0.26], [0.5, -0.3]], 'xz'));
  const region = csg(front, [INTERSECTION, side], [INTERSECTION, top], [ADDITION, capBox]);
  // Raised face plate: slightly inflated head volume cut to the plate outline, so its edges read as panel steps.
  const H2 = headVolume(1.022);
  const pFront = brush(prism([[-0.31, 0.27], [0.31, 0.27], [0.355, 0.12], [0.355, -0.02], [0.205, -0.34], [-0.205, -0.34], [-0.355, -0.02], [-0.355, 0.12]], 'xy'));
  const pSide = brush(prism([[0.2, 0.27], [0.8, 0.27], [0.8, 0.0], [0.505, -0.34], [0.2, -0.34]], 'zy'));
  const pTop = brush(prism([[-0.6, 0.18], [-0.24, 0.505], [0, 0.52], [0.24, 0.505], [0.6, 0.18], [0.6, 0.05], [-0.6, 0.05]], 'xz'));
  // Planar facets of the face (flat front, side chamfers, sloped brow, lower face leaning back); the raised plate
  // gets the same planes pushed out by its offset.
  // Every pair in D.facetBevels gets a narrow chamfer plane along its shared edge (normal = mean of both normals),
  // so the edges catch light like machined bevels instead of meeting razor-sharp.
  const facets = (off) => {
    const planes = D.facets.map(([p, n]) => {
      const u = new THREE.Vector3(...n).normalize();
      return { u, c: u.dot(new THREE.Vector3(...p)) + off };
    });
    const out = planes.map(({ u, c }) => [INTERSECTION, halfSpace(u.clone().multiplyScalar(c).toArray(), u.toArray())]);
    for (const [a, b] of D.facetBevels) {
      const sum = planes[a].u.clone().add(planes[b].u);
      const len = sum.length();
      const cb = (planes[a].c + planes[b].c) / len - D.bevelWidth;
      const u = sum.divideScalar(len);
      out.push([INTERSECTION, halfSpace(u.clone().multiplyScalar(cb).toArray(), u.toArray())]);
    }
    return out;
  };
  const facePlate = csg(H2, [INTERSECTION, pFront], [INTERSECTION, pSide], [INTERSECTION, pTop], ...facets(0.011));
  let shell = csg(H, [INTERSECTION, region], ...facets(0), [ADDITION, facePlate]);

  const probe = new THREE.Mesh(shell.geometry, M.darkArmor);
  const surfZ = (x, y) => hitSurface(probe, [x, y, 2], [0, 0, -1])?.point.z ?? 0.45;

  // Visor: a socket with sloped walls (square frustum, wide at the surface), then the slit; the light sits deep at the
  // bottom so the brow and the socket walls frame it. Inner ends lower (V shape).
  const v = D.visor;
  const cuts = [];
  const glows = [];
  const socketDepth = v.socketDepth, slitDepth = v.slitDepth;
  for (const s of [-1, 1]) {
    // Yaw follows the V-shaped front, so the socket keeps its depth along the slit and wraps onto the side chamfer.
    const x = s * v.x, z = surfZ(x, v.y), rz = s * v.angleDeg * DEG, rot = [0, s * v.yawDeg * DEG, rz];
    const socket = new THREE.CylinderGeometry(1, 0.8, socketDepth + 0.03, 4, 1).rotateY(Math.PI / 4).rotateX(Math.PI / 2);
    socket.scale((v.width + 0.04) / Math.SQRT2, (v.height + 0.034) / Math.SQRT2, 1);
    cuts.push(brush(socket, { pos: [x, v.y, z - socketDepth / 2 + 0.015], rot }));
    cuts.push(brush(new THREE.BoxGeometry(v.width, v.height, 0.3), { pos: [x, v.y, z - socketDepth - slitDepth + 0.15], rot }));
    const glow = new THREE.Mesh(new THREE.BoxGeometry(v.width - 0.004, v.height - 0.004, 0.02), M.visorGlow);
    glow.name = s < 0 ? 'Visor_R' : 'Visor_L';
    glow.position.set(x, v.y, z - socketDepth - slitDepth + 0.006 - 0.01);
    glow.rotation.set(...rot);
    glows.push(glow);
  }

  // Mouth: tall trapezoid recess (narrow chamfered top, wide bottom) that splits the lower cheek plates; a horizontal
  // slot at its top; slanted side rails are added as an insert below.
  const zm = surfZ(0, -0.2);
  const mo = D.mouth;
  cuts.push(brush(prism(mo.outline, 'xy', 1), { pos: [0, 0, zm - mo.depth + 0.5] }));
  cuts.push(brush(new THREE.BoxGeometry(mo.slotWidth, 0.014, 0.2), { pos: [0, mo.slotY, zm - mo.depth - 0.025 + 0.1] }));

  // Panel lines: narrow grooves on the lower front plate and a transverse seam on the cap.
  const groove = (x, y, len, ang, w = 0.006) => {
    const z = surfZ(x, y);
    cuts.push(brush(new THREE.BoxGeometry(len, w, 0.2), { pos: [x, y, z + 0.1 - 0.012], rot: [0, 0, ang] }));
  };
  for (const s of [-1, 1]) {
    groove(s * 0.19, -0.115, 0.2, s * 0.32);
    groove(s * 0.17, -0.25, 0.16, s * -0.55);
    groove(s * 0.28, 0.215, 0.12, s * -0.18);
    // Seam under the eye socket towards the mouth plate.
    groove(s * 0.2, -0.015, 0.22, s * 0.1, 0.007);
    // Small chevron marks on the lower cheek plates.
    for (let k = 0; k < 3; k++) groove(s * (0.215 + k * 0.016), -0.205, 0.035, s * 1.0, 0.004);
  }
  cuts.push(brush(new THREE.BoxGeometry(2, 1, 0.006), { pos: [0, D.capEdgeY + 0.55, -0.25] }));
  for (const s of [-1, 1]) {
    // Side seam: from the brow corner back and up over the temple, as a thin slot in a vertical plane.
    cuts.push(brush(new THREE.BoxGeometry(0.12, 0.006, 0.42), { pos: [s * 0.38, 0.36, 0.1], rot: [0.32, 0, 0] }));
  }
  cuts.push(brush(new THREE.BoxGeometry(0.006, 1, 0.6), { pos: [0, D.capEdgeY + 0.6, -0.3] }));

  // Temple recesses: rounded triangles with sloped walls (three-sided frustum), a fastener in the floor added below.
  const templeHits = [];
  for (const s of [-1, 1]) {
    const h = hitSurface(probe, [s * 2, 0.26, 0.15], [-s, 0, 0]);
    if (!h) continue;
    templeHits.push(h);
    const tri = new THREE.CylinderGeometry(0.042, 0.026, 0.05, 3).rotateY(s * 0.3).rotateZ(-s * Math.PI / 2);
    cuts.push(brush(tri, { pos: h.point.toArray() }));
  }

  for (const c of cuts) shell = csg(shell, [SUBTRACTION, c]);
  boxProjectUV(shell.geometry, 2.5);
  const shellMesh = new THREE.Mesh(shell.geometry, M.darkArmor);
  shellMesh.name = 'Shell';
  // Mouth rails: raised strips along both slanted sides of the recess, on the recess floor.
  for (const s of [-1, 1]) {
    const [xt, yt] = mo.outline[2], [xb, yb] = mo.outline[3];
    const len = Math.hypot(xb - xt, yb - yt), ang = Math.atan2(yb - yt, xb - xt);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(len, mo.railWidth, 0.022), M.darkArmor);
    rail.name = 'MouthRail';
    rail.position.set(s * ((xt + xb) / 2 - mo.railWidth * 0.6), (yt + yb) / 2, zm - mo.depth + 0.01);
    rail.rotation.z = s * ang;
    g.add(rail);
  }

  // Dark recess behind the side edge of the face plate, separating it from the housing.
  for (const s of [-1, 1]) {
    const pts = D.maskGap.map(([z, y]) => hitSurface(probe, [s * 2, y, z], [-s, 0, 0])?.point).filter(Boolean);
    if (pts.length < 2) continue;
    const gap = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.0065, 6), M.darkMetal);
    gap.name = 'MaskGap';
    g.add(gap);
  }

  g.add(shellMesh, ...glows);

  // Brim: overhanging rim along the cap's lower edge at the back.
  const brimProfile = [[0.93, 0], [1.0, 0.004], [1.0, 0.026], [0.97, 0.032], [0.93, 0.032]].map(([r, y]) => new THREE.Vector2(r, y));
  brimProfile.push(brimProfile[0].clone());
  const brim = new THREE.Mesh(new THREE.LatheGeometry(brimProfile, 96, 1.45, Math.PI * 2 - 2.9), M.darkArmor);
  brim.name = 'Brim';
  brim.geometry.computeVertexNormals();
  brim.scale.set(0.39, 1, 0.475);
  brim.position.set(0, D.capEdgeY - 0.016, 0);
  g.add(brim);

  // Hinge panels on the plate sides between visor and ear, with ribs.
  const probeAll = [shellMesh];
  for (const s of [-1, 1]) {
    const h = hitSurface(probeAll, [s * 2, 0.08, 0.05], [-s, 0, 0]);
    if (!h) continue;
    const hinge = new THREE.Group();
    hinge.name = s > 0 ? 'Hinge_L' : 'Hinge_R';
    // Temple plate: chamfered hexagon (local x = along +Z of the helmet, y = up), ribbed grip in the middle.
    const hex = shape([[-0.035, 0.12], [0.02, 0.12], [0.04, 0.07], [0.04, -0.05], [0.015, -0.1], [-0.035, -0.1], [-0.045, 0.0]]);
    const plateGeo = new THREE.ExtrudeGeometry(hex, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2 });
    plateGeo.translate(0, 0, -0.012);
    const body = new THREE.Mesh(plateGeo, M.darkArmor);
    hinge.add(body);
    for (let i = 0; i < 5; i++) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.06, 0.01), M.darkMetal);
      rib.position.set(-0.017 + i * 0.008, -0.01, 0.026);
      hinge.add(rib);
    }
    // Joint at the top of the mask holder.
    const joint = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.05, 16), M.darkMetal);
    joint.rotation.x = Math.PI / 2;
    joint.position.set(0, 0.13, 0.012);
    hinge.add(joint);
    orient(hinge, h.point, h.normal, 0.01, [0, 0, 1]);
    g.add(hinge);
  }

  // Screws on the front plate.
  const pts = [];
  for (const s of [-1, 1]) {
    for (const [x, y] of [[0.12, -0.27], [0.27, -0.12], [0.24, 0.2], [0.07, -0.02], [0.31, 0.03]]) {
      pts.push(hitSurface(probeAll, [s * x, y, 2], [0, 0, -1]));
    }
    pts.push(hitSurface(probeAll, [s * 2, 0.3, 0.05], [-s, 0, 0]));
    pts.push(hitSurface(probeAll, [s * 2, 0.4, -0.05], [-s, -0.4, 0]));
    // Fastener in the floor of the temple recess.
    const th = templeHits.find((h) => Math.sign(h.point.x) === s);
    if (th) pts.push(hitSurface(probeAll, [s * 2, th.point.y, th.point.z], [-s, 0, 0]));
    // Row of screws along the brim at the back.
    for (const a of [0.35, 0.75, 1.15]) pts.push(hitSurface(probeAll, [s * Math.sin(a) * 2, 0.36, -Math.cos(a) * 2], [-s * Math.sin(a), 0, Math.cos(a)]));
  }
  g.add(screws(M, pts, 'Screws_Upper'));
  return g;
}
