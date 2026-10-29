import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';

let server, model, unrounded, crown, plates, band, D;
const materials = new Map();

before(async () => {
  server = await createServer({ root: fileURLToPath(new URL('../', import.meta.url)),
    logLevel: 'error', server: { middlewareMode: true, hmr: false } });
  const { buildUpperHelmet } = await server.ssrLoadModule('/src/parts/upperHelmet.js');
  const { buildForeheadPlates } = await server.ssrLoadModule('/src/parts/foreheadPlates.js');
  const { buildLeftEar } = await server.ssrLoadModule('/src/parts/leftEar.js');
  ({ D } = await server.ssrLoadModule('/src/params.js'));
  const palette = new Proxy({}, { get: (_, name) => {
    if (!materials.has(name)) materials.set(name, new THREE.MeshStandardMaterial({ name }));
    return materials.get(name);
  } });
  const warn = console.warn;
  let warned = false;
  console.warn = (...args) => {
    if (String(args[0]).includes('maxLeafSize')) {
      if (warned) return;
      warned = true;
    }
    warn(...args);
  };
  const radius = D.templeRound.radius;
  try {
    model = buildUpperHelmet(palette);
    crown = model.getObjectByName('Crown');
    plates = buildForeheadPlates(crown, palette);
    band = buildLeftEar(palette, { headBandOnly: true }).getObjectByName('HeadBand');
    model.add(plates, band);
    model.updateMatrixWorld(true);
    // Disable only the new fillet, independently checking that it does not move
    // the accepted eye panes or change their geometry.
    D.templeRound.radius = 0;
    unrounded = buildUpperHelmet(palette);
    unrounded.updateMatrixWorld(true);
  } finally {
    D.templeRound.radius = radius;
    console.warn = warn;
  }
});

after(async () => {
  for (const root of [model, unrounded]) root?.traverse(object => object.geometry?.dispose());
  for (const material of materials.values()) material.dispose();
  await server?.close();
});

function ray(origin, direction) {
  return new THREE.Raycaster(new THREE.Vector3(...origin), new THREE.Vector3(...direction).normalize());
}

test('temple fillets preserve the accepted eye geometry and transforms', () => {
  for (const name of ['Visor_L', 'Visor_R']) {
    const actual = model.getObjectByName(name), expected = unrounded.getObjectByName(name);
    assert.ok(actual.matrixWorld.elements.every((value, index) => Math.abs(value - expected.matrixWorld.elements[index]) < 1e-7),
      `${name}: eye transform changed beyond CSG floating-point precision`);
    for (const key of ['position', 'normal', 'uv']) {
      assert.deepEqual(actual.geometry.attributes[key].array, expected.geometry.attributes[key].array, `${name}.${key}`);
    }
    assert.deepEqual(actual.geometry.index.array, expected.geometry.index.array, name);
    const axis = new THREE.Vector3(0, 0, 1).applyQuaternion(actual.quaternion);
    for (const x of [-0.05, 0, 0.05]) for (const y of [-0.015, 0, 0.015]) {
      const target = actual.localToWorld(new THREE.Vector3(x, y, 0));
      const cast = new THREE.Raycaster(target.addScaledVector(axis, 0.15), axis.clone().negate());
      assert.equal(cast.intersectObject(model, true)[0]?.object.name, name, 'The new surfaces must not obstruct the eyes');
    }
  }
});

test('both uncut temple fillets retain exterior coverage and continuous radial shading', () => {
  const shell = model.getObjectByName('Shell');
  for (const indices of [[0, 2], [1, 3]]) {
    const [a, b] = indices.map(index => {
      const [point, normal] = D.facets[index], n = new THREE.Vector3(...normal).normalize();
      return { n, c: n.dot(new THREE.Vector3(...point)) + 0.011 };
    });
    const radius = D.templeRound.radius;
    const determinant = a.n.x * b.n.z - b.n.x * a.n.z;
    const centre = new THREE.Vector3(((a.c - radius) * b.n.z - (b.c - radius) * a.n.z) / determinant,
      0, (a.n.x * (b.c - radius) - b.n.x * (a.c - radius)) / determinant);
    const start = Math.atan2(a.n.x, a.n.z), end = Math.atan2(b.n.x, b.n.z);
    // These rows lie below the intentionally sharp eye sockets. Sample inside
    // the tangent-plane intervals to avoid ambiguous rays exactly on CSG edges.
    for (const y of [-0.02, 0.02, 0.04, 0.06]) {
      let previous;
      for (let i = 0; i < 80; i++) {
        const angle = THREE.MathUtils.lerp(start, end, (i + 0.37) / 80);
        const outward = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
        const cast = new THREE.Raycaster(centre.clone().setY(y).addScaledVector(outward, 2), outward.clone().negate());
        const hit = cast.intersectObject(shell)[0];
        assert.ok(hit, `Missing temple surface at y=${y}, angle=${angle}`);
        const measuredRadius = 2 - hit.distance;
        assert.ok(Math.abs(measuredRadius - radius) < 0.0001, `Temple radius drift: ${measuredRadius}`);
        const normal = hit.normal.clone().normalize();
        assert.ok(normal.angleTo(outward) < 0.035, 'Fillet shading must follow the circular surface');
        if (previous) assert.ok(normal.angleTo(previous) < 0.035, 'Hard shading step remains in the fillet');
        previous = normal;
      }
    }
  }
});

test('each separate forehead strip has a supported outer surface and thickness over the whole dome', () => {
  assert.equal(plates.children.length, 2);
  for (const side of [-1, 1]) {
    const part = plates.getObjectByName(side > 0 ? 'ForeheadPlate_L' : 'ForeheadPlate_R');
    assert.ok(part?.isMesh, 'The two strips must remain independently exportable');
    for (const attribute of Object.values(part.geometry.attributes)) assert.ok(attribute.array.every(Number.isFinite));
    for (const view of ['front', 'roof', 'rear']) {
      const coordinates = view === 'front' ? [0.22, 0.29, 0.36] : view === 'rear' ? [0.34, 0.38, 0.42] : [0.25, 0, -0.25];
      for (const x of [0.09, 0.12, 0.15]) for (const coordinate of coordinates) {
        const cast = view === 'roof' ? ray([side * x, 2, coordinate], [0, -1, 0])
          : ray([side * x, coordinate, view === 'front' ? 2 : -2], [0, 0, view === 'front' ? -1 : 1]);
        const support = cast.intersectObject(crown)[0], outside = cast.intersectObject(part)[0];
        assert.ok(support && outside, `Missing ${view} strip or supporting crown`);
        assert.ok(view !== 'rear' || outside.point.z < 0, 'Rear surface must reach the rear hemisphere');
        const clearance = support.distance - outside.distance;
        assert.ok(clearance > 0.002 && clearance < 0.02, `Floating/buried ${view} strip: ${clearance}`);
        const previousSide = part.material.side;
        let crossings;
        try {
          part.material.side = THREE.DoubleSide;
          crossings = cast.intersectObject(part).filter((hit, index, all) => !index || hit.distance - all[index - 1].distance > 1e-6);
        } finally { part.material.side = previousSide; }
        assert.ok(crossings.length >= 2, `Open ${view} strip shell`);
        const thickness = crossings[1].distance - crossings[0].distance;
        assert.ok(thickness > 0.001 && thickness < 0.025, `Invalid ${view} strip thickness: ${thickness}`);
      }
    }
  }
});

test('the centre stays open from forehead to rear and the band covers both strips', () => {
  for (const x of [-0.03, 0, 0.03]) {
    for (const y of [0.22, 0.3, 0.38, 0.44]) {
      for (const side of [-1, 1]) assert.equal(ray([x, y, side * 2], [0, 0, -side]).intersectObject(plates, true).length, 0,
        'Keep the central crown strip free');
    }
    for (const z of [-0.3, -0.15, 0, 0.15, 0.3]) assert.equal(ray([x, 2, z], [0, -1, 0]).intersectObject(plates, true).length, 0);
  }
  // The existing band seats into the crown/strip assembly. Assert exterior
  // ordering, rather than claiming complete volumetric separation underneath.
  for (const side of [-1, 1]) for (const x of [0.09, 0.12, 0.15]) for (const dz of [-0.03, 0, 0.03]) {
    const cast = ray([side * x, 2, D.band.z + dz], [0, -1, 0]);
    const strip = cast.intersectObject(plates, true)[0], cover = cast.intersectObject(band)[0];
    assert.ok(strip && cover, 'Band must cross both forehead strips');
    assert.ok(strip.distance - cover.distance > 0.01, 'A strip protrudes through the outside of the band');
  }
});
