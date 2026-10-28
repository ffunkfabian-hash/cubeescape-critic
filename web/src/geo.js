// Geometry helpers: CSG wrappers, silhouette prisms, super-ellipsoids, surface placement.
import * as THREE from 'three';
import { Brush, Evaluator, ADDITION, SUBTRACTION, INTERSECTION } from 'three-bvh-csg';

export { ADDITION, SUBTRACTION, INTERSECTION };

const evaluator = new Evaluator();
evaluator.attributes = ['position', 'normal'];
evaluator.useGroups = false;

// Wrap a geometry (optionally transformed) as a CSG brush.
export function brush(geo, { pos, rot, scale } = {}) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  if (g.getAttribute('uv')) g.deleteAttribute('uv');
  if (!g.getAttribute('normal')) g.computeVertexNormals();
  // Bake the transform: evaluate() returns its result in the local frame of the first brush.
  const o = new THREE.Object3D();
  if (pos) o.position.set(...pos);
  if (rot) o.rotation.set(...rot);
  if (scale) o.scale.set(...(Array.isArray(scale) ? scale : [scale, scale, scale]));
  o.updateMatrix();
  g.applyMatrix4(o.matrix);
  const b = new Brush(g);
  b.updateMatrixWorld();
  return b;
}

// Half-space { p : dot(p - point, normal) <= 0 } as a large box brush (for planar facet cuts with INTERSECTION).
export function halfSpace(point, normal, size = 6) {
  const n = new THREE.Vector3(...normal).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  const c = new THREE.Vector3(...point).addScaledVector(n, -size / 2);
  return brush(new THREE.BoxGeometry(size, size, size), { pos: c.toArray(), rot: new THREE.Euler().setFromQuaternion(q).toArray().slice(0, 3) });
}

// Apply a chain of operations: csg(a, [SUBTRACTION, b], [ADDITION, c], ...).
export function csg(a, ...steps) {
  let r = a;
  for (const [op, b] of steps) {
    r = evaluator.evaluate(r, b, op);
    r.updateMatrixWorld();
  }
  return r;
}

export function shape(pts) {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  return s;
}

export function roundedRect(w, h, r, cx = 0, cy = 0) {
  const s = new THREE.Shape();
  const x = cx - w / 2, y = cy - h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

// Extruded silhouette, centred on the extrusion axis.
//   'xy': outline in (x, y), extruded along Z (front view)
//   'zy': outline in (z, y), extruded along X (side view)
//   'xz': outline in (x, z), extruded along Y (top view)
export function prism(pts, plane, depth = 3) {
  const g = new THREE.ExtrudeGeometry(shape(pts), { depth, bevelEnabled: false, curveSegments: 4 });
  g.translate(0, 0, -depth / 2);
  if (plane === 'zy') g.rotateY(-Math.PI / 2); // (u, v, w) -> (-w, v, u)
  if (plane === 'xz') g.rotateX(Math.PI / 2); // (u, v, w) -> (u, -w, v)
  return g;
}

// Super-ellipsoid: unit sphere remapped with signed powers (p < 1 gives boxier shapes).
export function superEllipsoid(rx, ry, rz, pH = 0.7, pV = 0.8, segW = 96, segH = 64) {
  const g = new THREE.SphereGeometry(1, segW, segH);
  const p = g.attributes.position;
  const f = (t, e) => Math.sign(t) * Math.pow(Math.abs(t), e);
  for (let i = 0; i < p.count; i++) {
    p.setXYZ(i, rx * f(p.getX(i), pH), ry * f(p.getY(i), pV), rz * f(p.getZ(i), pH));
  }
  g.computeVertexNormals();
  return g;
}

const raycaster = new THREE.Raycaster();

// Cast from `origin` along `dir` onto `targets`; returns surface point and outward normal (world space).
export function hitSurface(targets, origin, dir) {
  raycaster.set(new THREE.Vector3(...origin), new THREE.Vector3(...dir).normalize());
  const hits = raycaster.intersectObjects(Array.isArray(targets) ? targets : [targets], true);
  if (!hits.length) return null;
  const h = hits[0];
  const n = h.face.normal.clone().transformDirection(h.object.matrixWorld);
  return { point: h.point, normal: n };
}

const Z = new THREE.Vector3(0, 0, 1);

// Place obj so that its local +Z points along `normal`; with `tangent` its local +X follows that direction.
export function orient(obj, point, normal, offset = 0, tangent = null) {
  obj.position.copy(point).addScaledVector(normal, offset);
  if (!tangent) {
    obj.quaternion.setFromUnitVectors(Z, normal);
    return obj;
  }
  const z = normal.clone().normalize();
  const x = new THREE.Vector3(...tangent).addScaledVector(z, -new THREE.Vector3(...tangent).dot(z)).normalize();
  const y = new THREE.Vector3().crossVectors(z, x);
  obj.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
  return obj;
}

// Deterministic pseudo-random generator for procedural details.
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
