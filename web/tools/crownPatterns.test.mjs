import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { CROWN_PATTERNS, resolveCrownPattern } from '../src/crownPatternPresets.js';
import { createCrownMarking, createCrownPatternMap } from '../src/crownPatterns.js';

function canvasDocument() {
  return { createElement(name) {
    assert.equal(name, 'canvas');
    const canvas = { operations: [] };
    let points = [];
    const context = {
      clearRect: (...rect) => canvas.operations.push({ kind: 'clear', rect }),
      beginPath: () => { points = []; },
      moveTo: (x, y) => points.push([x, y]),
      lineTo: (x, y) => points.push([x, y]),
      closePath: () => { points.push([...points[0]]); },
      stroke: () => canvas.operations.push({ kind: 'stroke', points: points.map(point => [...point]),
        width: context.lineWidth, color: context.strokeStyle }),
      fillRect: (...rect) => canvas.operations.push({ kind: 'fill', rect, color: context.fillStyle }),
    };
    canvas.getContext = () => context;
    canvas.toDataURL = () => 'data:image/png;base64,' + Buffer.from(JSON.stringify(canvas.operations)).toString('base64');
    return canvas;
  } };
}

function sourceCrown() {
  const geometry = new THREE.BufferGeometry();
  const coordinates = [-0.1,0.4,0.3, 0.1,0.4,0.3, 0,0.5,0.2,
    -0.01,0.4,-0.3, 0,0.5,-0.2, 0.01,0.4,-0.3];
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(coordinates, 3));
  const normals = [];
  for (let i = 0; i < coordinates.length; i += 3) {
    normals.push(...new THREE.Vector3(coordinates[i], coordinates[i + 1] - 0.1, coordinates[i + 2]).normalize().toArray());
  }
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(Array(12).fill(0.125), 2));
  geometry.setIndex([0, 1, 2, 3, 4, 5]);
  const crown = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x313438 }));
  crown.name = 'Crown';
  crown.position.set(0.01, 0.02, -0.03);
  crown.rotation.y = 0.12;
  return crown;
}

function assertSurface(source, marking) {
  const sourceGeometry = source.geometry.index ? source.geometry.toNonIndexed() : source.geometry;
  const original = sourceGeometry.attributes.position, positions = marking.geometry.attributes.position;
  const normals = sourceGeometry.attributes.normal, uv = marking.geometry.attributes.uv;
  const drawnVertices = new Set(marking.geometry.index.array);
  assert.equal(positions.count, original.count);
  assert.deepEqual(marking.geometry.attributes.normal.array, normals.array);
  assert.deepEqual(marking.position.toArray(), source.position.toArray());
  assert.deepEqual(marking.quaternion.toArray(), source.quaternion.toArray());
  assert.ok(uv.array.every(Number.isFinite));
  const delta = new THREE.Vector3(), normal = new THREE.Vector3();
  for (let i = 0; i < positions.count; i++) {
    delta.fromBufferAttribute(positions, i).sub(new THREE.Vector3().fromBufferAttribute(original, i));
    normal.fromBufferAttribute(normals, i).normalize();
    assert.ok(Math.abs(delta.length() - 0.001) < 1e-7, 'Offset must follow the crown, without floating plates');
    assert.ok(delta.dot(normal) > 0.0009999, 'Offset must point out along the existing normal');
  }
  const faceNormal = (attribute, i) => {
    const a = new THREE.Vector3().fromBufferAttribute(attribute, i);
    return new THREE.Vector3().fromBufferAttribute(attribute, i + 1).sub(a)
      .cross(new THREE.Vector3().fromBufferAttribute(attribute, i + 2).sub(a));
  };
  for (let i = 0; i < positions.count; i += 3) {
    const before = faceNormal(original, i), after = faceNormal(positions, i);
    // Tiny degenerate CSG closure triangles have no defined winding.
    if (drawnVertices.has(i) && before.lengthSq() > 1e-16) {
      assert.ok(before.dot(after) > 0, 'Offset must preserve the winding of every drawn exterior triangle');
    }
    const us = [uv.getX(i), uv.getX(i + 1), uv.getX(i + 2)];
    assert.ok(Math.max(...us) - Math.min(...us) <= 0.500001, 'A triangle crosses the texture wrap without correction');
  }
  assert.ok(marking.geometry.index.count > positions.count * 0.5, 'The exterior crown surface must remain present');
  if (sourceGeometry !== source.geometry) sourceGeometry.dispose();
}

test('pattern names are explicit and none needs neither a crown nor a canvas', () => {
  assert.equal(resolveCrownPattern(), CROWN_PATTERNS.none);
  assert.equal(createCrownMarking(null), null);
  assert.equal(createCrownPatternMap(), null);
  for (const name of ['none', 'chevron', 'hex', 'tech']) assert.equal(resolveCrownPattern(name).name, name);
  for (const name of ['', 'random', 'toString', '__proto__', null]) {
    assert.throws(() => resolveCrownPattern(name), /Unknown crown pattern/);
  }
  assert.throws(() => createCrownMarking(null, 'tech'), /requires a crown/);
});

test('all patterns produce deterministic transparent export maps limited to the upper front', () => {
  const previous = globalThis.document;
  globalThis.document = canvasDocument();
  try {
    const variants = new Set();
    for (const name of ['chevron', 'hex', 'tech']) {
      const texture = createCrownPatternMap(name), repeated = createCrownPatternMap(name), canvas = texture.image;
      assert.equal(canvas.width, 1024); assert.equal(canvas.height, 1024);
      assert.equal(texture.name, `crownPattern_${name}_map`);
      assert.equal(texture.wrapS, THREE.RepeatWrapping); assert.equal(texture.wrapT, THREE.RepeatWrapping);
      assert.equal(texture.colorSpace, THREE.SRGBColorSpace);
      assert.deepEqual(canvas.operations[0], { kind: 'clear', rect: [0, 0, 1024, 1024] });
      assert.equal(canvas.toDataURL('image/png'), repeated.image.toDataURL('image/png'));
      variants.add(canvas.toDataURL('image/png'));
      for (const op of canvas.operations.slice(1)) {
        assert.equal(op.color, '#d6d7d5');
        const margin = op.kind === 'stroke' ? op.width / 2 : 0;
        const points = op.points ?? [[op.rect[0], op.rect[1]], [op.rect[0] + op.rect[2], op.rect[1] + op.rect[3]]];
        for (const [x, y] of points) {
          assert.ok(x - margin > 1024 * 0.35 && x + margin < 1024 * 0.65, 'Do not paint rear-facing UVs');
          assert.ok(y - margin > 1024 * 0.2 && y + margin < 1024 * 0.8, 'Keep the lower rim and apex clear');
        }
      }
      texture.dispose(); repeated.dispose();
    }
    assert.equal(variants.size, 3, 'The three variants must have different markings');
  } finally { globalThis.document = previous; }
});

test('markings preserve source geometry, UVs and material while keeping spherical seam winding', () => {
  const previous = globalThis.document;
  globalThis.document = canvasDocument();
  const crown = sourceCrown();
  const source = Object.fromEntries(Object.entries(crown.geometry.attributes).map(([key, attr]) => [key, [...attr.array]]));
  const index = [...crown.geometry.index.array], material = crown.material.toJSON();
  try {
    for (const name of ['chevron', 'hex', 'tech']) {
      const marking = createCrownMarking(crown, name);
      assert.equal(marking.name, 'CrownMarking');
      assert.equal(marking.material.name, `crownPattern_${name}`);
      assert.equal(marking.material.alphaTest, 0.5);
      assert.equal(marking.material.roughness, 0.75); assert.equal(marking.material.metalness, 0.05);
      assert.equal(marking.material.emissive.getHex(), 0);
      assertSurface(crown, marking);
      assert.deepEqual(crown.material.toJSON(), material);
      assert.deepEqual([...crown.geometry.index.array], index);
      for (const [key, values] of Object.entries(source)) assert.deepEqual([...crown.geometry.attributes[key].array], values);
      marking.geometry.dispose(); marking.material.map.dispose(); marking.material.dispose();
    }
  } finally { crown.geometry.dispose(); crown.material.dispose(); globalThis.document = previous; }
});

test('the generated helmet crown also supports the marking without inverted surfaces or invalid UVs', async () => {
  const server = await createServer({ root: fileURLToPath(new URL('../', import.meta.url)),
    logLevel: 'error', server: { middlewareMode: true, hmr: false } });
  const previous = globalThis.document, warn = console.warn, materials = new Map();
  let model, marking, warned = false;
  globalThis.document = canvasDocument();
  try {
    const { buildUpperHelmet } = await server.ssrLoadModule('/src/parts/upperHelmet.js');
    console.warn = (...args) => {
      if (String(args[0]).includes('maxLeafSize')) { if (warned) return; warned = true; }
      warn(...args);
    };
    const palette = new Proxy({}, { get: (_, name) => {
      if (!materials.has(name)) materials.set(name, new THREE.MeshStandardMaterial({ name }));
      return materials.get(name);
    } });
    model = buildUpperHelmet(palette);
    const crown = model.getObjectByName('Crown');
    marking = createCrownMarking(crown, 'chevron');
    assertSurface(crown, marking);
    const centre = new THREE.Vector3(0, 0.1, 0);
    for (const u of [0.41, 0.45, 0.5, 0.55, 0.59]) for (const v of [0.28, 0.4, 0.55, 0.7]) {
      const azimuth = (u - 0.5) * 2 * Math.PI, polar = (1 - v) * Math.PI / 2;
      const direction = new THREE.Vector3(Math.sin(azimuth) * Math.sin(polar), Math.cos(polar), Math.cos(azimuth) * Math.sin(polar));
      const ray = new THREE.Raycaster(centre.clone().addScaledVector(direction, 2), direction.clone().negate());
      const source = ray.intersectObject(crown)[0], painted = ray.intersectObject(marking)[0];
      assert.ok(source && painted, `Missing painted outer crown at u=${u}, v=${v}`);
      assert.ok(source.distance - painted.distance > 0.0005 && source.distance - painted.distance < 0.003,
        'The visible marking must stay directly on the crown surface');
    }
  } finally {
    console.warn = warn; globalThis.document = previous;
    model?.traverse(object => object.geometry?.dispose());
    marking?.geometry.dispose(); marking?.material.map.dispose(); marking?.material.dispose();
    for (const material of materials.values()) material.dispose();
    await server.close();
  }
});
