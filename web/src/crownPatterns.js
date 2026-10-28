import * as THREE from 'three';
import { resolveCrownPattern } from './crownPatternPresets.js';

// Transparent, deterministic vector marks, rasterized into a real exportable PNG.
// All motifs stay in the front/upper UV patch; the rear and lower rim stay clear.
export function createCrownPatternMap(name = 'none') {
  const preset = resolveCrownPattern(name);
  if (name === 'none') return null;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = preset.textureSize;
  const context = canvas.getContext('2d'), size = preset.textureSize;
  context.clearRect(0, 0, size, size);
  context.fillStyle = context.strokeStyle = preset.color;
  context.lineCap = 'butt';
  context.lineJoin = 'miter';
  const line = (points, width) => {
    context.lineWidth = width * size;
    context.beginPath();
    for (let i = 0; i < points.length; i++) context[i ? 'lineTo' : 'moveTo'](points[i][0] * size, points[i][1] * size);
    context.stroke();
  };
  const block = (x, y, width, height) => context.fillRect(x * size, y * size, width * size, height * size);
  if (name === 'chevron') {
    for (const [y, halfWidth] of [[0.32, 0.07], [0.49, 0.09], [0.66, 0.11]]) {
      line([[0.5 - halfWidth, y], [0.5, y + 0.065], [0.5 + halfWidth, y]], 0.012);
    }
  } else if (name === 'hex') {
    const radius = 28, stepY = Math.sqrt(3) * radius;
    context.lineWidth = 2.5;
    for (let column = 0, x = size * 0.39 + radius; x + radius < size * 0.61; column++, x += radius * 1.5) {
      for (let y = size * 0.25 + radius + column % 2 * stepY / 2; y + radius < size * 0.75; y += stepY) {
        context.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = i * Math.PI / 3;
          context[i ? 'lineTo' : 'moveTo'](x + radius * Math.cos(angle), y + radius * Math.sin(angle));
        }
        context.closePath();
        context.stroke();
      }
    }
  } else if (name === 'tech') {
    block(0.397, 0.32, 0.036, 0.085);
    line([[0.442, 0.36], [0.51, 0.36], [0.54, 0.3]], 0.006);
    block(0.565, 0.47, 0.026, 0.1);
    line([[0.49, 0.53], [0.55, 0.53]], 0.008);
    line([[0.43, 0.53], [0.43, 0.69], [0.49, 0.69]], 0.006);
    block(0.515, 0.66, 0.058, 0.022);
    block(0.515, 0.7, 0.026, 0.014);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.name = `crownPattern_${name}_map`;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function createCrownMarking(crown, name = 'none') {
  const preset = resolveCrownPattern(name);
  if (name === 'none') return null;
  if (!crown?.isMesh || !crown.geometry?.attributes.normal) throw new Error('Crown marking requires a crown mesh with normals');
  const geometry = crown.geometry.index ? crown.geometry.toNonIndexed() : crown.geometry.clone();
  const positions = geometry.attributes.position, normals = geometry.attributes.normal;
  const uv = new Float32Array(positions.count * 2), radial = new THREE.Vector3(), normal = new THREE.Vector3();
  const centre = new THREE.Vector3(0, 0.1, 0);
  const exterior = [], point = new THREE.Vector3();
  for (let i = 0; i < positions.count; i += 3) {
    radial.set(0, 0, 0); normal.set(0, 0, 0);
    for (let j = i; j < i + 3; j++) {
      radial.add(point.fromBufferAttribute(positions, j).sub(centre));
      normal.add(point.fromBufferAttribute(normals, j));
    }
    // The crown includes inward-facing CSG closing faces below its rim. They
    // need no paint and can fold under a normal offset at very narrow slivers.
    if (normal.dot(radial) > 0) exterior.push(i, i + 1, i + 2);
  }
  for (let i = 0; i < positions.count; i++) {
    radial.fromBufferAttribute(positions, i).sub(centre);
    uv[i * 2] = 0.5 + Math.atan2(radial.x, radial.z) / (2 * Math.PI);
    uv[i * 2 + 1] = 1 - Math.acos(THREE.MathUtils.clamp(radial.y / radial.length(), -1, 1)) / (Math.PI / 2);
    normal.fromBufferAttribute(normals, i).normalize().multiplyScalar(preset.surfaceOffset);
    positions.setXYZ(i, positions.getX(i) + normal.x, positions.getY(i) + normal.y, positions.getZ(i) + normal.z);
  }
  // Keep each rear-facing triangle on one side of the U wrap. RepeatWrapping
  // gives continuous sampling without changing any triangle or source UV.
  for (let i = 0; i < positions.count; i += 3) {
    const values = [uv[i * 2], uv[(i + 1) * 2], uv[(i + 2) * 2]];
    if (Math.max(...values) - Math.min(...values) > 0.5) {
      for (let j = i; j < i + 3; j++) if (uv[j * 2] < 0.5) uv[j * 2] += 1;
    }
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geometry.setIndex(exterior);
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  const material = new THREE.MeshStandardMaterial({ name: `crownPattern_${name}`,
    color: 0xffffff, map: createCrownPatternMap(name), roughness: preset.roughness,
    metalness: preset.metalness, alphaTest: preset.alphaTest });
  const marking = new THREE.Mesh(geometry, material);
  marking.name = 'CrownMarking';
  marking.position.copy(crown.position);
  marking.quaternion.copy(crown.quaternion);
  marking.scale.copy(crown.scale);
  marking.receiveShadow = crown.receiveShadow;
  return marking;
}
