// Skins in the viewer (0.13 "Skins", &skin=rost|glut|ornat): bodies and helmets painted by the skin mixer (skinShader.js) after a
// recipe of skins.json, on the robot and on a helmet alone. Every model has its own atlas (assets/skins/<model>/, built by
// tools/skin_bake.mjs); a skin is one material per atlas. Wear and dirt are part of the recipe, so the aged shader (robotWear.js)
// stays off while a skin is shown. The textures of a skin can be exported (bakeSkinTextures) and go into the GLB export.
import * as THREE from 'three';
import { readAtlas, skinMeshes, geometrySignature, sameSignature, closeSignature, skinGeometry, transferGeometry, unmappedGeometry } from './skinAtlas.js';
import { describeSkinMeshes, SKIN_RECIPES } from './skinParts.js';
import { skinLayerMask, skinMaterial, skinBakeMaterial } from './skinShader.js';

export const SKINS = Object.fromEntries(Object.entries(SKIN_RECIPES.skins).map(([key, r]) => [key, { de: r.de, energy: r.energy }]));
const ATLAS_JSON = import.meta.glob('../../assets/skins/*/atlas.json', { import: 'default' });
const ATLAS_FILES = import.meta.glob('../../assets/skins/*/*.{bin,png}', { eager: true, query: '?url', import: 'default' });

const atlases = new Map();
// Atlas and maps texture of a model (waechter, paladin, mechanik, critic, scout), loaded once.
export function loadSkinAtlas(model) {
  if (!atlases.has(model)) atlases.set(model, (async () => {
    const dir = `../../assets/skins/${model}/`;
    if (!ATLAS_JSON[`${dir}atlas.json`]) throw new Error(`Skin: no atlas for ${model} (node tools/skin_bake.mjs --model ${model})`);
    const json = await ATLAS_JSON[`${dir}atlas.json`]();
    const [buffer, maps] = await Promise.all([fetch(ATLAS_FILES[dir + json.bin]).then(r => { if (!r.ok) throw new Error(`Skin: ${json.bin} of ${model}: HTTP ${r.status}`); return r.arrayBuffer(); }),
      new THREE.TextureLoader().loadAsync(ATLAS_FILES[dir + json.maps])]);
    maps.flipY = false;
    maps.colorSpace = THREE.NoColorSpace;
    maps.anisotropy = 8;
    maps.needsUpdate = true;
    return { ...readAtlas(json, buffer), texture: maps };
  })());
  const loading = atlases.get(model);
  loading.catch(() => { if (atlases.get(model) === loading) atlases.delete(model); }); // a failed load may be retried
  return loading;
}

// Per model root the prepared meshes: atlas geometry (or an unmapped copy), description, part frame. kind: 'body' | 'critic' |
// 'scout'; skip: meshes below root that belong to another atlas (a helmet hung into a body). materials: flat material per mesh
// (the description judges roles from it). Geometry is built once per root and mesh.
const prepared = new WeakMap();
export function prepareSkin(root, kind, atlas, { skip = () => false, materials = null } = {}) {
  let state = prepared.get(root);
  if (state && state.atlas === atlas) return state;
  root.updateMatrixWorld(true);
  const inv = root.matrixWorld.clone().invert(), scale = new THREE.Matrix4().makeScale(atlas.metresPerUnit, atlas.metresPerUnit, atlas.metresPerUnit);
  const list = skinMeshes(root, o => !skip(o)), desc = describeSkinMeshes(list, kind, root, { materials });
  let mapped = 0, transferred = 0;
  const meshes = list.map(({ mesh, key }, i) => {
    const sig = geometrySignature(mesh.geometry), candidates = atlas.entries.get(key) ?? [];
    let entry = candidates.find(e => sameSignature(e.sig, sig)) ?? null, geometry;
    if (entry) geometry = skinGeometry(mesh.geometry, entry);
    else if ((entry = candidates.find(e => e.pos && closeSignature(e.sig, sig)) ?? null)) { geometry = transferGeometry(mesh.geometry, entry); transferred++; }
    else geometry = unmappedGeometry(mesh.geometry, scale.clone().multiply(inv).multiply(mesh.matrixWorld));
    if (entry) mapped++;
    geometry.computeBoundingBox();
    const box = new THREE.Box3().setFromBufferAttribute(geometry.attributes.skinPos);
    const centre = box.getCenter(new THREE.Vector3()), half = box.getSize(new THREE.Vector3()).multiplyScalar(0.5);
    const side = centre.x < -0.002 ? 'R' : centre.x > 0.002 ? 'L' : 'C'; // side R at −X in every model frame (front +Z)
    const n = geometry.attributes.position.count;
    geometry.setAttribute('skinInfo', new THREE.BufferAttribute(new Float32Array(4 * n), 4));
    geometry.setAttribute('skinCentre', new THREE.BufferAttribute(new Float32Array(3 * n).map((_, j) => centre.getComponent(j % 3)), 3));
    return { mesh, key, entry, geometry, desc: { ...desc[i], side: desc[i].side ?? side }, mirror: side === 'R' ? -1 : 1, half: Math.max(half.y, 1e-4) };
  });
  if (mapped < meshes.length) console.warn(`Skin ${atlas.model}: ${meshes.length - mapped} of ${meshes.length} meshes without atlas entry (painted without maps)`);
  if (transferred) console.info(`Skin ${atlas.model}: ${transferred} meshes differ slightly from the bake, UVs transferred`);
  state = { root, kind, atlas, meshes, mapped, transferred, materials: new Map(), active: null };
  prepared.set(root, state);
  return state;
}

// Show skin `key` on the prepared meshes (null: restore the flat geometry and material they had when the skin was applied).
export function applySkin(state, key) {
  if (state.active) for (const m of state.meshes) { m.mesh.geometry = m.flat.geometry; m.mesh.material = m.flat.material; }
  state.active = key;
  if (!key) return 0;
  const recipe = SKIN_RECIPES.skins[key];
  if (!recipe) throw new Error(`Unknown skin ${JSON.stringify(key)}; expected ${Object.keys(SKIN_RECIPES.skins).join(', ')}`);
  if (!state.materials.has(key)) state.materials.set(key, skinMaterial(key, recipe, state.atlas.texture));
  const material = state.materials.get(key);
  for (const m of state.meshes) {
    m.flat = { geometry: m.mesh.geometry, material: m.mesh.material };
    const info = m.geometry.attributes.skinInfo, mask = skinLayerMask(recipe, m.desc);
    for (let i = 0; i < info.count; i++) info.setXYZW(i, mask, m.mirror, m.entry ? 1 : 0, m.half);
    info.needsUpdate = true;
    m.mesh.geometry = m.geometry;
    m.mesh.material = material;
  }
  return state.meshes.length;
}

// Free the prepared geometry of a root (helmet replaced or rebuilt); the meshes keep their current geometry if no skin is shown.
export function releaseSkin(root) {
  const state = prepared.get(root);
  if (!state) return;
  if (state.active) applySkin(state, null);
  for (const m of state.meshes) m.geometry.dispose();
  for (const mat of state.materials.values()) mat.dispose();
  prepared.delete(root);
}
export const skinState = root => prepared.get(root) ?? null;

// Texture bake of the active skin of a prepared root in its atlas: { basecolor, orm, emissive } as ImageData (size², gutters
// filled from the nearest texel, alpha 255), rendered in UV space with the mixer itself.
export function bakeSkinTextures(renderer, state, size = 2048) {
  const recipe = SKIN_RECIPES.skins[state.active];
  if (!recipe) throw new Error('bakeSkinTextures: no skin shown');
  const material = skinBakeMaterial(recipe, state.atlas.texture), scene = new THREE.Scene();
  for (const m of state.meshes) if (m.entry) scene.add(new THREE.Mesh(m.geometry, material));
  const target = new THREE.WebGLRenderTarget(size, size, { type: THREE.UnsignedByteType, colorSpace: THREE.NoColorSpace });
  const camera = new THREE.Camera(), out = {}, prev = { target: renderer.getRenderTarget(), tone: renderer.toneMapping, color: renderer.getClearColor(new THREE.Color()), alpha: renderer.getClearAlpha() };
  renderer.toneMapping = THREE.NoToneMapping;
  try {
    for (const [i, kind] of ['basecolor', 'orm', 'emissive'].entries()) {
      material.userData.output.value = i;
      renderer.setRenderTarget(target);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(scene, camera);
      const px = new Uint8ClampedArray(size * size * 4);
      renderer.readRenderTargetPixels(target, 0, 0, size, size, px);
      out[kind] = new ImageData(fillGutters(px, size, 8), size, size);
    }
  } finally {
    renderer.setRenderTarget(prev.target);
    renderer.toneMapping = prev.tone;
    renderer.setClearColor(prev.color, prev.alpha);
    target.dispose();
    material.dispose();
  }
  return out;
}

// Gutters (alpha 0) take the colour of the nearest covered texel within radius px; everything ends opaque.
export function fillGutters(px, size, radius) {
  let front = [];
  for (let k = 0; k < size * size; k++) if (px[4 * k + 3]) front.push(k);
  const done = new Uint8Array(size * size);
  for (const k of front) done[k] = 1;
  for (let r = 0; r < radius && front.length; r++) {
    const next = [];
    for (const k of front) {
      const x = k % size, y = (k - x) / size;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
        const xx = x + dx, yy = y + dy, j = yy * size + xx;
        if (xx < 0 || yy < 0 || xx >= size || yy >= size || done[j]) continue;
        done[j] = 1;
        px.copyWithin(4 * j, 4 * k, 4 * k + 3);
        next.push(j);
      }
    }
    front = next;
  }
  for (let k = 0; k < size * size; k++) px[4 * k + 3] = 255;
  return px;
}

// Flat glTF stand-in of a recipe for a mesh without atlas (GLB export): the fill layers that select the mesh, without patterns.
export function flatSkinMaterial(key, desc) {
  const recipe = SKIN_RECIPES.skins[key], mask = skinLayerMask(recipe, desc);
  const m = new THREE.MeshStandardMaterial({ name: `skin_${key}_flat`, color: 0x000000, roughness: 0.6, metalness: 0 });
  recipe.layers.forEach((L, i) => {
    if (L.type !== 'fill' || L.facing || !(Math.floor(mask / 2 ** i) % 2)) return;
    if (L.color) m.color.set(L.color);
    if ('rough' in L) m.roughness = L.rough;
    if ('metal' in L) m.metalness = L.metal;
    if (L.emit) { m.emissive.set(L.emit); m.emissiveIntensity = (L.emit_strength ?? 1) * (recipe.emissive_intensity ?? 1); }
  });
  return m;
}

// Baked textures as glTF material on the mapped meshes, flat stand-ins on the others (for the GLB export); returns a function
// that restores the live skin on every mesh that still wears its export material (a skin changed meanwhile stays).
export function useBakedMaterial(state, textures) {
  const tex = img => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d').putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c); t.flipY = false; return t; };
  const map = tex(textures.basecolor), orm = tex(textures.orm), emissive = tex(textures.emissive);
  map.colorSpace = emissive.colorSpace = THREE.SRGBColorSpace;
  const recipe = SKIN_RECIPES.skins[state.active];
  const baked = new THREE.MeshStandardMaterial({ name: `skin_${state.active}_${state.atlas.model}`, map, aoMap: orm, roughnessMap: orm, metalnessMap: orm,
    emissiveMap: emissive, emissive: 0xffffff, emissiveIntensity: recipe.emissive_intensity ?? 1, roughness: 1, metalness: 1 });
  const before = state.meshes.map(m => m.mesh.material), flats = [];
  for (const m of state.meshes) m.mesh.material = m.entry ? baked : flats[flats.push(flatSkinMaterial(state.active, m.desc)) - 1];
  const exported = state.meshes.map(m => m.mesh.material);
  // the viewer's skin attributes stay out of the GLB: same attributes, without skinPos/skinNor/skinInfo/skinCentre
  const geometryBefore = state.meshes.map(m => m.mesh.geometry), exportGeometry = state.meshes.map(m => {
    const g = new THREE.BufferGeometry();
    for (const [name, attr] of Object.entries(m.mesh.geometry.attributes)) if (!name.startsWith('skin')) g.setAttribute(name, attr);
    g.setIndex(m.mesh.geometry.index);
    for (const group of m.mesh.geometry.groups) g.addGroup(group.start, group.count, group.materialIndex);
    m.mesh.geometry = g;
    return g;
  });
  return () => {
    state.meshes.forEach((m, i) => { if (m.mesh.material === exported[i]) m.mesh.material = before[i]; });
    state.meshes.forEach((m, i) => { if (m.mesh.geometry === exportGeometry[i]) m.mesh.geometry = geometryBefore[i]; });
    for (const t of [map, orm, emissive, baked, ...flats]) t.dispose();
  };
}
