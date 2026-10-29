// Independent upper-body proposal. +Y is up, +Z is forward; the helmet stays untouched.
import * as THREE from 'three';
import defaults from '../shoulderStudyParams.json' with { type: 'json' };

export const shoulderStudyParams = structuredClone(defaults);

// IDs are stable feedback handles, independent of traversal order or display name.
export const SHOULDER_STUDY_PARTS = Object.freeze({
  B01: 'NeckFlex', B02: 'NeckRibs', B03: 'CollarFront', B04: 'CollarRear', B05: 'UpperTorsoCore',
  B06: 'ShoulderBase_R', B07: 'ShoulderFront_R', B08: 'ShoulderRear_R',
  B09: 'ShoulderBase_L', B10: 'ShoulderFront_L', B11: 'ShoulderRear_L',
  B12: 'ClavicleArmor_R', B13: 'ClavicleArmor_L', B14: 'ChestInsert_R', B15: 'ChestInsert_L',
  B16: 'ScapulaArmor_R', B17: 'ScapulaArmor_L', B18: 'BackSpineInsert',
  B19: 'ClavicleFastener_R', B20: 'ClavicleFastener_L', B21: 'RearFastener_R', B22: 'RearFastener_L',
  B23: 'ShoulderLame_R', B24: 'ShoulderLame_L', B25: 'ShoulderJoint_R', B26: 'ShoulderJoint_L',
  B27: 'BreastplateCenter', B28: 'FlankArmor_R', B29: 'FlankArmor_L',
  B30: 'ShoulderRoof_R', B31: 'ShoulderRoof_L',
});

function signedVolume(vertices, triangles) {
  let volume = 0;
  for (let i = 0; i < triangles.length; i += 3) {
    const a = new THREE.Vector3(...vertices[triangles[i]]);
    const b = new THREE.Vector3(...vertices[triangles[i + 1]]);
    const c = new THREE.Vector3(...vertices[triangles[i + 2]]);
    volume += a.dot(b.cross(c));
  }
  return volume;
}

// Raised closed pad inset from one forward-facing relief facet; the exposed plate between pads reads as a groove.
// The rings give a groove wall followed by a two-step rounded chamfer onto the pad top. Each ring lies on the facet
// plane offset by its height along the normal, but is extruded along +Z: walls stay parallel to the frontal view,
// so steep neighbours never overhang a groove and pads stay inside the plate outline.
function appendFacetPad(vertices, triangles, corners, pad, orientation) {
  const [a, b, c] = corners.map(p => new THREE.Vector3(...p));
  const cross = b.clone().sub(a).cross(c.clone().sub(a)), normal = cross.clone().normalize();
  if (normal.z < 0) normal.negate();
  const la = b.distanceTo(c), lb = c.distanceTo(a), lc = a.distanceTo(b), perimeter = la + lb + lc;
  const incenter = a.clone().multiplyScalar(la).addScaledVector(b, lb).addScaledVector(c, lc).divideScalar(perimeter);
  // Scaling about the incenter moves every edge inward by the same distance.
  const radius = cross.length() / perimeter, k = 1 - Math.SQRT1_2;
  if (radius < pad.groove + pad.chamfer + pad.minMargin) throw new Error(`relief facet too small for a pad (r=${radius.toFixed(4)})`);
  const start = vertices.length;
  for (const [inset, height] of [[pad.groove, -pad.embed], [pad.groove, pad.height - pad.chamfer],
    [pad.groove + k * pad.chamfer, pad.height - k * pad.chamfer], [pad.groove + pad.chamfer, pad.height]]) {
    const scale = (radius - inset) / radius;
    for (const p of [a, b, c]) vertices.push(p.clone().sub(incenter).multiplyScalar(scale).add(incenter)
      .add(new THREE.Vector3(0, 0, height / normal.z)).toArray());
  }
  const shell = [start, start + 2, start + 1, start + 9, start + 10, start + 11];
  for (let ring = 0; ring < 3; ring++) for (let i = 0; i < 3; i++) {
    const p = start + ring * 3 + i, q = start + ring * 3 + (i + 1) % 3;
    shell.push(p, q, q + 3, p, q + 3, p + 3);
  }
  if (Math.sign(signedVolume(vertices, shell)) !== orientation)
    for (let i = 0; i < shell.length; i += 3) [shell[i + 1], shell[i + 2]] = [shell[i + 2], shell[i + 1]];
  triangles.push(...shell);
}

// Closed custom solids use flat facets and deterministic world-space box UVs.
function solid(vertices, triangles) {
  if (signedVolume(vertices, triangles) < 0) for (let i = 0; i < triangles.length; i += 3) [triangles[i + 1], triangles[i + 2]] = [triangles[i + 2], triangles[i + 1]];
  const indexed = new THREE.BufferGeometry();
  indexed.setAttribute('position', new THREE.Float32BufferAttribute(vertices.flat(), 3));
  indexed.setIndex(triangles);
  const geometry = indexed.toNonIndexed();
  indexed.dispose();
  geometry.computeVertexNormals();
  const p = geometry.attributes.position, n = geometry.attributes.normal, uv = [];
  for (let i = 0; i < p.count; i++) {
    const axis = [Math.abs(n.getX(i)), Math.abs(n.getY(i)), Math.abs(n.getZ(i))];
    if (axis[0] >= axis[1] && axis[0] >= axis[2]) uv.push(p.getZ(i) * 2, p.getY(i) * 2);
    else if (axis[1] >= axis[2]) uv.push(p.getX(i) * 2, p.getZ(i) * 2);
    else uv.push(p.getX(i) * 2, p.getY(i) * 2);
  }
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  return geometry;
}

// Four outline rings create a real back, sidewall and narrow edge chamfers.
function beveledPlate(points, depth, bevel, map, subdivisions = 0, relief = null) {
  // Earcut normalizes cap winding; the side loops must use the same orientation.
  const reversed = THREE.ShapeUtils.isClockWise(points.map(p => new THREE.Vector2(...p)));
  if (reversed) points = points.toReversed();
  const center = points.reduce((sum, p) => [sum[0] + p[0] / points.length, sum[1] + p[1] / points.length], [0, 0]);
  const extent = Math.min(...points.map(p => Math.hypot(p[0] - center[0], p[1] - center[1])));
  const inset = Math.min(bevel / extent, 0.2), edge = Math.min(bevel, depth * 0.3);
  const vertices = [];
  let triangles = [];
  const count = points.length, reliefFaces = [];
  for (const [scale, d] of [[1 - inset, 0], [1, edge], [1, depth - edge], [1 - inset, depth]]) {
    for (const [u, v] of points) vertices.push([center[0] + (u - center[0]) * scale, center[1] + (v - center[1]) * scale, d]);
  }
  const caps = THREE.ShapeUtils.triangulateShape(points.map(p => new THREE.Vector2(...p)), []);
  for (const [a, b, c] of caps) {
    if (!relief) triangles.push(a, c, b);
    triangles.push(3 * count + a, 3 * count + b, 3 * count + c);
  }
  if (relief) {
    // Deliberate interior peaks, not incidental triangulation of a warped perimeter.
    const extra = vertices.length;
    for (const [x,y,lift] of relief.vertices) vertices.push([x,y,-lift]);
    const index = i => i < count ? (reversed ? count-1-i : i) : extra+i-count;
    for (const face of relief.triangles) {
      const [a,b,c] = face.map(index), [u,v,w] = [a,b,c].map(i=>vertices[i]);
      const cross = (v[0]-u[0])*(w[1]-u[1])-(v[1]-u[1])*(w[0]-u[0]);
      triangles.push(a,cross > 0 ? c : b,cross > 0 ? b : c);
      reliefFaces.push([a,b,c]);
    }
  }
  for (let ring = 0; ring < 3; ring++) for (let i = 0; i < count; i++) {
    const j = (i + 1) % count, a = ring * count + i, b = ring * count + j;
    triangles.push(a, b, b + count, a, b + count, a + count);
  }
  // Refine the closed parameter-domain solid before bending it. All adjacent
  // faces share edge midpoints, so curved caps keep watertight bevels and sides.
  for (let level = 0; level < subdivisions; level++) {
    const edges = new Map(), refined = [];
    const midpoint = (a, b) => {
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      if (!edges.has(key)) {
        edges.set(key, vertices.length);
        vertices.push(vertices[a].map((value, axis) => (value + vertices[b][axis]) / 2));
      }
      return edges.get(key);
    };
    for (let i = 0; i < triangles.length; i += 3) {
      const [a, b, c] = triangles.slice(i, i + 3), ab = midpoint(a, b), bc = midpoint(b, c), ca = midpoint(c, a);
      refined.push(a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca);
    }
    triangles = refined;
  }
  const mapped = vertices.map(vertex => map(...vertex));
  if (relief?.pads) {
    // Pads follow the bent facets in model space and share the plate's winding, so each shell stays closed and outward.
    const orientation = Math.sign(signedVolume(mapped, triangles));
    for (const face of reliefFaces) appendFacetPad(mapped, triangles, face.map(i => mapped[i]), relief.pads, orientation);
  }
  return solid(mapped, triangles);
}

function torsoGeometry(p) {
  const vertices = [], triangles = [], n = p.segments;
  for (const [y, rx, rz] of p.rings) for (let i = 0; i < n; i++) {
    const a = 2 * Math.PI * i / n;
    vertices.push([rx * p.widthScale * Math.sin(a), y, rz * Math.cos(a)]);
  }
  for (let r = 0; r < p.rings.length - 1; r++) for (let i = 0; i < n; i++) {
    const a = r * n + i, b = r * n + (i + 1) % n;
    triangles.push(a, b, b + n, a, b + n, a + n);
  }
  for (const [ring, flip] of [[0, true], [p.rings.length - 1, false]]) {
    const middle = vertices.length;
    vertices.push([0, p.rings[ring][0], 0]);
    for (let i = 0; i < n; i++) {
      const a = ring * n + i, b = ring * n + (i + 1) % n;
      triangles.push(middle, flip ? b : a, flip ? a : b);
    }
  }
  return solid(vertices, triangles);
}

function collarGeometry(p, start, end) {
  const vertices = [], triangles = [], n = p.segments + 1;
  const b = p.bevel;
  const baseRx = p.outerRx + (p.baseFlareX ?? 0), baseRz = p.outerRz + (p.baseFlareZ ?? 0);
  // A chamfered octagonal section replaces the flat-cut cylindrical ring.
  const section = [[p.outerRx - b, p.outerRz - b, 0], [p.outerRx, p.outerRz, -b],
    [baseRx, baseRz, -p.height + b], [baseRx - b, baseRz - b, -p.height],
    [p.innerRx + b, p.innerRz + b, -p.height], [p.innerRx, p.innerRz, -p.height + b],
    [p.innerRx, p.innerRz, -p.innerTopDrop - b], [p.innerRx + b, p.innerRz + b, -p.innerTopDrop]];
  for (const [rx, rz, offset] of section) {
    for (let i = 0; i < n; i++) {
      const a = start + (end - start) * i / (n - 1);
      const frontAngle = Math.atan2(Math.sin(a), Math.cos(a));
      const notch = p.frontNotchDepth * Math.max(0, 1 - Math.abs(frontAngle) / p.frontNotchHalfAngle);
      const y = p.top - p.rearRise * Math.cos(a) - notch * Math.max(0, 1 + offset / p.height) + offset;
      vertices.push([Math.sin(a) * rx, y, Math.cos(a) * rz]);
    }
  }
  const quad = (a, b, c, d) => triangles.push(a, b, c, a, c, d);
  for (let r = 0; r < section.length; r++) for (let i = 0; i < n - 1; i++) {
    const next = (r + 1) % section.length;
    quad(r * n + i, r * n + i + 1, next * n + i + 1, next * n + i);
  }
  const caps = THREE.ShapeUtils.triangulateShape(section.map(([rx, , offset]) => new THREE.Vector2(rx, offset)), []);
  for (const [a, b, c] of caps) {
    triangles.push(a * n, c * n, b * n,
      a * n + n - 1, b * n + n - 1, c * n + n - 1);
  }
  return solid(vertices, triangles);
}

export function buildShoulderStudy(M, p = shoulderStudyParams) {
  const root = new THREE.Group();
  root.name = 'ShoulderStudy';
  root.userData.study = `${p.name ?? 'Assembly'}: neck, collar and shoulder proposal`;
  const add = (id, geometry, material) => {
    if (!['B01', 'B02'].includes(id)) geometry.translate(0, p.placement.upperBodyRise, 0);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = SHOULDER_STUDY_PARTS[id];
    mesh.userData.partId = id;
    mesh.userData.assembly = 'ShoulderStudy';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
    return mesh;
  };
  // Preserve the helmet-side neck anchor while the shoulder assembly moves up.
  const neck = { ...p.neck, bottom: p.neck.bottom + p.placement.upperBodyRise };
  const flex = new THREE.CylinderGeometry(1, 1.035, neck.top - neck.bottom, neck.segments);
  flex.scale(neck.rx, 1, neck.rz);
  flex.translate(0, (neck.top + neck.bottom) / 2, 0);
  add('B01', flex, M.blackRubber);

  // One separate mesh holds the seven independently closed circumferential ribs.
  const ribVertices = [], ribIndices = [];
  for (let r = 0; r < neck.ribs; r++) {
    const g = new THREE.TorusGeometry(1, neck.ribRadius / neck.rx, 6, neck.segments);
    g.rotateX(Math.PI / 2);
    g.scale(neck.rx + 0.004, neck.rx, neck.rz + 0.004);
    g.translate(0, neck.bottom + 0.055 + r * (neck.top - neck.bottom - 0.12) / (neck.ribs - 1), 0);
    const offset = ribVertices.length / 3;
    ribVertices.push(...g.attributes.position.array);
    ribIndices.push(...Array.from(g.index.array, i => i + offset));
    g.dispose();
  }
  add('B02', solid(Array.from({ length: ribVertices.length / 3 }, (_, i) => ribVertices.slice(i * 3, i * 3 + 3)), ribIndices), M.blackRubber);
  const c = p.collar;
  add('B03', collarGeometry(c, -Math.PI / 2 + c.seam, Math.PI / 2 - c.seam), M.whiteArmor);
  add('B04', collarGeometry(c, Math.PI / 2 + c.seam, 3 * Math.PI / 2 - c.seam), M.darkArmor);
  add('B05', torsoGeometry(p.torso), M.blackRubber);

  const s = p.shoulder, chest = p.chest;
  const wrap = s.wrap?.enabled ? s.wrap : null;
  const box = s.box?.enabled ? s.box : null;
  const shoulderX = x => s.innerX + (x - s.innerX) * s.widthScale;
  const shoulderY = (x, z) => {
    const t = THREE.MathUtils.clamp((x - s.innerX) / (s.outerX - s.innerX), 0, 1);
    return s.crownY - (x - s.innerX) * s.slope - s.arc * z * z - s.outerDrop * t ** 3
      + s.archHeight * Math.sin(Math.PI * t) ** s.archPower;
  };
  // Bend the closed plate around the shoulder, with thickness along the ellipse normal.
  const shoulderSurface = (side, x, z, d, drop = 0, outset = 0) => {
    if (!wrap) return [side * shoulderX(x), shoulderY(x, z) - drop - d, z];
    const t = (x - s.innerX) / (s.outerX - s.innerX);
    const angle = wrap.startAngle + (wrap.endAngle - wrap.startAngle) * t;
    const nx = Math.sin(angle) / wrap.rx, ny = Math.cos(angle) / wrap.ry, length = Math.hypot(nx, ny);
    return [side * (wrap.centerX + wrap.rx * Math.sin(angle) + (outset - d) * nx / length),
      wrap.centerY + wrap.ry * Math.cos(angle) - s.arc * z * z - drop + (outset - d) * ny / length, z];
  };
  const ridge = x => (chest.ridgeHeight ?? 0) * Math.max(0, 1 - Math.abs(x) / (chest.ridgeWidth ?? 1));
  const panel = (points, side, z, depth = chest.depth, lift = 0, raised = false) => beveledPlate(points, depth, chest.bevel,
    (x, y, d) => [side * x * chest.widthScale, y,
      z + lift + (raised ? ridge(x) : 0) - (Math.max(0, -y - 1.02) * chest.recede + chest.sideSweep * x * x + d) * Math.sign(z)]);
  for (const [side, ids] of [[-1, ['B06', 'B07', 'B08', 'B12', 'B14', 'B16', 'B19', 'B21']],
    [1, ['B09', 'B10', 'B11', 'B13', 'B15', 'B17', 'B20', 'B22']]]) {
    if (box) {
      // Three independently closed panels form a deep housing around a recessed support.
      const support = box.face.map(([x,y]) => [box.pivotX + (x-box.pivotX)*box.supportScale,
        box.pivotY + (y-box.pivotY)*box.supportScale]);
      add(ids[0], beveledPlate(support, box.supportDepth, s.bevel,
        (x,y,d) => [side*x,y,box.supportDepth/2-d]), M.darkArmor);
      for (const [index,z,sign] of [[1,box.frontZ,1],[2,box.rearZ,-1]]) add(ids[index],
        beveledPlate(box.face,s.thickness,s.bevel,(x,y,d)=>[side*x,y,z-sign*d]),M.whiteArmor);
      add(side < 0 ? 'B30' : 'B31',beveledPlate(box.roof,box.frontZ-box.rearZ-2*s.thickness,s.bevel,
        (x,y,d)=>[side*x,y,box.frontZ-s.thickness-d]),M.whiteArmor);
    } else {
      add(ids[0], beveledPlate(s.base, s.baseThickness, s.bevel,
        (x, z, d) => shoulderSurface(side, x, z, d + (wrap ? s.baseDrop : 0), wrap ? 0 : s.baseDrop), s.curveSubdivisions), M.darkArmor);
      for (const [index, points] of [[1, s.front], [2, s.rear]]) add(ids[index],
        beveledPlate(points, s.thickness, s.bevel,
          (x, z, d) => shoulderSurface(side, x, z, d), s.curveSubdivisions), M.whiteArmor);
    }
    add(ids[3], panel(chest.white, side, chest.frontZ, chest.depth, 0, true), M.whiteArmor);
    add(ids[4], panel(chest.insert, side, chest.frontZ, 0.043, -0.014), M.darkArmor);
    add(ids[5], panel(chest.back, side, chest.rearZ), M.darkArmor);
    for (const [id, x, y, z] of [[ids[6], 0.358, -0.971, chest.frontZ + ridge(0.358) + 0.004 - chest.sideSweep * 0.358 ** 2],
      [ids[7], 0.319, -0.969, chest.rearZ - 0.004 + chest.sideSweep * 0.319 ** 2]]) {
      const fastener = new THREE.CylinderGeometry(p.hardware.fastenerRadius, p.hardware.fastenerRadius,
        p.hardware.fastenerDepth, p.hardware.segments);
      fastener.rotateX(Math.PI / 2);
      fastener.translate(side * x * chest.widthScale, y, z);
      add(id, fastener, M.darkMetal);
    }
    if (wrap) {
      add(side < 0 ? 'B23' : 'B24', box
        ? beveledPlate(box.lame,wrap.lameThickness,s.bevel,
          (y,z,d)=>[side*(box.lameX-d-box.lameTaper*Math.max(0,-y-box.lameTaperStart)),y,z])
        : beveledPlate(wrap.lame, wrap.lameThickness, s.bevel,
          (x, z, d) => shoulderSurface(side, x, z, d, wrap.lameDrop, wrap.lameOutset), s.curveSubdivisions), M.whiteArmor);
      const joint = new THREE.CylinderGeometry(wrap.jointRadius, wrap.jointRadius * 0.92, wrap.jointHeight, 12);
      joint.scale(1, 1, wrap.jointDepthScale); joint.rotateZ(-side * 0.08);
      joint.translate(side * wrap.jointX, wrap.jointY, 0);
      add(side < 0 ? 'B25' : 'B26', joint, M.blackRubber);
    }
    if (chest.central) add(side < 0 ? 'B28' : 'B29',
      beveledPlate(chest.flank,chest.flankThickness,chest.bevel,
        (y,z,d)=>[side*(chest.flankX-chest.flankTaper*Math.max(0,-y-chest.flankTaperStart)-d),y,z]),M.whiteArmor);
  }
  if (chest.central) add('B27',beveledPlate(chest.central,chest.centerDepth ?? chest.depth,chest.bevel,
    (x,y,d)=>[x*chest.widthScale,y,chest.frontZ+chest.centerLift+chest.centerSlope*(y-chest.centerSlopeOrigin)-d],0,chest.relief),M.whiteArmor);
  add('B18', panel(chest.spine, 1, chest.rearZ, 0.042), M.whiteTextured);
  return root;
}
