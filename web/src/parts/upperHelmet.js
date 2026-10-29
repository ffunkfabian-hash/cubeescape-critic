// UpperHelmet_Dark: dark cap and faceted front plate, V-angled visor slits, recessed mouth with two vents.
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { D } from '../params.js';
import { brush, csg, prism, shape, halfSpace, hitSurface, orient, ADDITION, SUBTRACTION, INTERSECTION } from '../geo.js';
import { boxProjectUV } from '../textures.js';
import { screws } from './common.js';
import { headVolume } from './headVolume.js';

const DEG = Math.PI / 180;

function blendCrownRim(geometry, volume, face) {
  const slope = D.crownTransition.slope;
  const centre = D.capEdgeY + slope * D.crownTransition.anchorZ;
  const height = D.crownTransition.blendHeight;
  const position = geometry.attributes.position;
  const ray = new THREE.Raycaster(), cache = new Map();
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i), y = position.getY(i), z = position.getZ(i);
    const t = y + slope * z - centre, radius = Math.hypot(x, z);
    if (z <= D.maskBackZ || t < -1e-5 || t >= height || radius < 1e-6) continue;
    const angle = Math.atan2(x, z), key = angle.toFixed(6);
    if (!cache.has(key)) {
      const direction = new THREE.Vector3(Math.sin(angle), -slope * Math.cos(angle), Math.cos(angle));
      const origin = new THREE.Vector3(0, centre - 1e-5, 0).addScaledVector(direction, 2);
      ray.set(origin, direction.clone().normalize().negate());
      const inner = ray.intersectObject(volume)[0], outer = ray.intersectObject(face)[0];
      cache.set(key, inner && outer ? {
        base: Math.hypot(inner.point.x, inner.point.z),
        delta: Math.hypot(outer.point.x, outer.point.z) - Math.hypot(inner.point.x, inner.point.z),
        fade: THREE.MathUtils.smoothstep(inner.point.z, D.maskBackZ, D.maskBackZ + D.crownTransition.sideBlendWidth),
      } : null);
    }
    const fit = cache.get(key);
    if (!fit) continue;
    const blend = fit.fade * (1 - THREE.MathUtils.smoothstep(t, 0, height));
    const scale = 1 + (fit.delta + D.crownTransition.rimCover) / fit.base * blend;
    // Hide the assembly slit with a small overlap; both parts remain separate.
    position.setXYZ(i, x * scale, y - slope * z * (scale - 1) - D.crownTransition.rimOverlap * blend, z * scale);
  }
  // Weld the outer surface, but keep the underside separate for normal generation.
  // Otherwise the broad closing faces pull the narrow rim's normals downwards.
  const normal = geometry.attributes.normal;
  for (let i = 0; i < normal.count; i++) {
    if (normal.getY(i) >= 0) normal.setXYZ(i, 0, 0, 0);
  }
  geometry.deleteAttribute('uv');
  const result = mergeVertices(geometry, 1e-5);
  result.computeVertexNormals();
  return result;
}

export function buildUpperHelmet(M) {
  const g = new THREE.Group();
  g.name = 'UpperHelmet_Dark';

  // Outer volume from the drawn profiles. Dark = head ∩ (cap above the brim ∪ front-plate silhouette stack).
  const H = headVolume(1, true);
  const zb = D.maskBackZ;
  const front = brush(prism([[-0.6, 0.8], [-0.6, 0.16], [-0.38, 0.01], [-0.205, -0.35], [0.205, -0.35], [0.38, 0.01], [0.6, 0.16], [0.6, 0.8]], 'xy'));
  const side = brush(prism([[zb - 0.02, 0.8], [0.8, 0.8], [0.8, 0.05], [0.49, -0.335], [0.16, -0.335], [0.1, -0.29], [0.0, -0.2], [zb + 0.02, 0.05]], 'zy'));
  // A continuous sloping brow partitions the crown from the face. The former
  // intersection of three raised plate outlines left rectangular steps on the temples.
  const H2 = headVolume(1.022);
  const browSlope = D.crownTransition.slope;
  const browPoint = [0, D.capEdgeY, D.crownTransition.anchorZ];
  const belowBrow = halfSpace(browPoint, [0, 1, browSlope]);
  const capRegion = csg(halfSpace(browPoint, [0, -1, -browSlope]),
    [ADDITION, halfSpace([0, D.capEdgeY, 0], [0, -1, 0])]);
  // Planar facets of the face (flat front, side chamfers, sloped brow, lower face leaning back); the raised plate
  // gets the same planes pushed out by its offset.
  // Every pair in D.facetBevels gets a narrow chamfer plane along its shared edge (normal = mean of both normals),
  // so the edges catch light like machined bevels instead of meeting razor-sharp.
  const roundedEdges = [];
  const facets = (off) => {
    const planes = D.facets.map(([p, n]) => {
      const u = new THREE.Vector3(...n).normalize();
      return { u, c: u.dot(new THREE.Vector3(...p)) + off };
    });
    const out = planes.map(({ u, c }) => [INTERSECTION, halfSpace(u.clone().multiplyScalar(c).toArray(), u.toArray())]);
    for (const [a, b] of D.facetBevels) {
      if (D.templeRound.radius > 0 && ((a === 0 && b === 2) || (a === 1 && b === 3))) {
        // A circular fillet tangent to both vertical planes. The centre is the
        // intersection of the inward-offset planes; eye cutters stay unchanged.
        const first = planes[a], last = planes[b], radius = D.templeRound.radius;
        const det = first.u.x * last.u.z - last.u.x * first.u.z;
        const ca = first.c - radius, cb = last.c - radius;
        const centre = new THREE.Vector3((ca * last.u.z - cb * first.u.z) / det, 0,
          (first.u.x * cb - last.u.x * ca) / det);
        const start = Math.atan2(first.u.x, first.u.z), end = Math.atan2(last.u.x, last.u.z);
        roundedEdges.push({ centre, start, end, radius });
        for (let i = 1; i < D.templeRound.segments; i++) {
          const angle = THREE.MathUtils.lerp(start, end, i / D.templeRound.segments);
          const normal = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
          out.push([INTERSECTION, halfSpace(centre.clone().addScaledVector(normal, radius).toArray(), normal.toArray())]);
        }
        continue;
      }
      const sum = planes[a].u.clone().add(planes[b].u);
      const len = sum.length();
      const cb = (planes[a].c + planes[b].c) / len - D.bevelWidth;
      const u = sum.divideScalar(len);
      out.push([INTERSECTION, halfSpace(u.clone().multiplyScalar(cb).toArray(), u.toArray())]);
    }
    return out;
  };
  let shell = csg(H2, [INTERSECTION, front], [INTERSECTION, side],
    [INTERSECTION, belowBrow], ...facets(0.011));
  // Smooth only the new fillet's exterior, before cutting sockets and seams.
  // Keeping cut-wall normals separate preserves the crisp accepted eye rims.
  const roundPos = shell.geometry.attributes.position, roundNormal = shell.geometry.attributes.normal;
  for (let i = 0; i < roundPos.count; i++) for (const edge of roundedEdges) {
    if (Math.abs(roundNormal.getY(i)) > 1e-5) continue;
    const nx = roundPos.getX(i) - edge.centre.x, nz = roundPos.getZ(i) - edge.centre.z;
    const angle = Math.atan2(nx, nz), distance = Math.hypot(nx, nz);
    const lo = Math.min(edge.start, edge.end), hi = Math.max(edge.start, edge.end);
    if (angle >= lo - 1e-5 && angle <= hi + 1e-5 && Math.abs(distance - edge.radius) < 0.0001)
      roundNormal.setXYZ(i, nx / distance, 0, nz / distance);
  }
  const probe = new THREE.Mesh(shell.geometry, M.darkArmor);
  const crown = csg(H, [INTERSECTION, capRegion]);
  // Keep the crown and face as distinct meshes for later individual editing/export.
  const crownMesh = new THREE.Mesh(boxProjectUV(blendCrownRim(crown.geometry, H, probe), 2.5), M.crownArmor);
  crownMesh.name = 'Crown';
  g.add(crownMesh);

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
    // Place cuts and pane along the rotated socket's local depth axis.
    const axis = new THREE.Vector3(0, 0, 1).applyEuler(new THREE.Euler(...rot));
    const atDepth = (depth) => new THREE.Vector3(x, v.y, z).addScaledVector(axis, depth).toArray();
    const socket = new THREE.CylinderGeometry(1, 0.8, socketDepth + 0.03, 4, 1).rotateY(Math.PI / 4).rotateX(Math.PI / 2);
    socket.scale((v.width + v.socketMarginWidth) / Math.SQRT2, (v.height + v.socketMarginHeight) / Math.SQRT2, 1);
    cuts.push(brush(socket, { pos: atDepth(-socketDepth / 2 + 0.015), rot }));
    cuts.push(brush(new THREE.BoxGeometry(v.width, v.height, 0.3), { pos: atDepth(-socketDepth - slitDepth + 0.15), rot }));
    const glow = new THREE.Mesh(new THREE.BoxGeometry(v.width - 0.002, v.height - 0.002, 0.004), M.visorGlow);
    glow.name = s < 0 ? 'Visor_R' : 'Visor_L';
    glow.position.fromArray(atDepth(-socketDepth - 0.002));
    glow.rotation.set(...rot);
    glows.push(glow);
  }

  // Mouth: tall trapezoid recess (narrow chamfered top, wide bottom) that splits the lower cheek plates; a horizontal
  // slot at its top; slanted side rails are added as an insert below.
  const zm = surfZ(0, -0.2);
  const mo = D.mouth;
  const floorTop = Math.min(surfZ(0, -0.07), surfZ(0.06, -0.07)) - 0.05;
  const floorBottom = Math.min(surfZ(0, -0.335), surfZ(0.13, -0.335)) - 0.05;
  const mouthFloor = (y) => THREE.MathUtils.lerp(floorTop, floorBottom, (y + 0.07) / (-0.335 + 0.07));
  const mouthCut = new THREE.ExtrudeGeometry(shape(mo.outline), { depth: 1, bevelEnabled: false });
  const cutPositions = mouthCut.attributes.position;
  for (let i = 0; i < cutPositions.count; i++) {
    cutPositions.setZ(i, cutPositions.getZ(i) + mouthFloor(cutPositions.getY(i)));
  }
  mouthCut.computeVertexNormals();
  cuts.push(brush(mouthCut));
  cuts.push(brush(new THREE.BoxGeometry(mo.slotWidth, 0.014, 0.2), { pos: [0, mo.slotY, zm - mo.depth - 0.025 + 0.1] }));

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
  // Separate cheek plates along a shallow V seam, with a real clearance gap.
  const seam = -0.115, gap = 0.003;
  const upper = csg(shell,
    [INTERSECTION, halfSpace([0, seam + gap, 0], [0.23, -1, -0.05])],
    [INTERSECTION, halfSpace([0, seam + gap, 0], [-0.23, -1, -0.05])]);
  const shellMesh = new THREE.Mesh(boxProjectUV(upper.geometry, 2.5), M.darkArmor);
  shellMesh.name = 'Shell';
  const cheekMeshes = [-1, 1].map((s) => {
    const part = csg(shell,
      [INTERSECTION, halfSpace([0, seam - gap, 0], [-s * 0.23, 1, 0.05])],
      [INTERSECTION, halfSpace([0, 0, 0], [-s, 0, 0])]);
    const mesh = new THREE.Mesh(boxProjectUV(part.geometry, 2.5), M.darkArmor);
    mesh.name = s > 0 ? 'Cheek_L' : 'Cheek_R';
    return mesh;
  });
  g.add(...cheekMeshes);
  // A fitted dark insert occupies the mouth recess without protruding below the cheeks.
  let insertGeo = new THREE.ExtrudeGeometry(shape([[-0.036,-0.071],[0.036,-0.071],
    [0.05,-0.087],[0.113,-0.327],[-0.113,-0.327],[-0.05,-0.087]]),
    { depth: 0.006, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 2 });
  insertGeo = csg(brush(insertGeo), [SUBTRACTION,
    brush(new THREE.BoxGeometry(0.06, 0.01, 0.1), { pos: [0, -0.105, 0] })]).geometry;
  const insertPositions = insertGeo.attributes.position;
  for (let i = 0; i < insertPositions.count; i++) {
    const x = insertPositions.getX(i), y = insertPositions.getY(i);
    insertPositions.setZ(i, insertPositions.getZ(i) + mouthFloor(y) + 0.002);
  }
  insertGeo.computeVertexNormals();
  const insertMesh = new THREE.Mesh(insertGeo, M.blackRubber);
  insertMesh.name = 'Mouth_Insert';
  g.add(insertMesh);
  // Mouth rails: raised strips along both slanted sides of the recess, on the recess floor.
  for (const s of [-1, 1]) {
    const [xt, yt] = mo.outline[2], [xb] = mo.outline[3], yb = -0.33;
    // Follow the actual front profile at both ends, including its depth slope.
    const start = new THREE.Vector3(s * (xt - mo.railWidth * 0.6), yt, surfZ(s * xt, yt) - mo.depth + 0.01);
    const end = new THREE.Vector3(s * (xb - mo.railWidth * 0.6), yb, surfZ(s * xb, yb) - mo.depth + 0.01);
    const direction = end.clone().sub(start);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(direction.length(), mo.railWidth, 0.022), M.darkArmor);
    rail.name = s > 0 ? 'MouthRail_L' : 'MouthRail_R';
    rail.position.copy(start).add(end).multiplyScalar(0.5);
    rail.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction.normalize());
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
  const probeAll = [shellMesh, crownMesh, ...cheekMeshes];
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
    hinge.rotateZ(0.32);
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
