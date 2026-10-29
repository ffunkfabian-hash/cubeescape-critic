import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createMaterials, applyArmorFinish, applyArmorAccents } from '../src/materials.js';
import { FINISH_PRESETS, ACCENT_PRESETS, resolveFinish, resolveAccents } from '../src/finishPresets.js';

// Texture generation needs pixel storage, not a renderer, for this contract check.
function canvasDocument() {
  return { createElement() {
    const canvas = {};
    const context = {
      createImageData: (width, height) => ({ data: new Uint8ClampedArray(width * height * 4) }),
      putImageData: image => { canvas.pixels = image.data; },
      fillRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, fill() {}, stroke() {},
    };
    canvas.getContext = () => context;
    return canvas;
  } };
}

test('finish selection defaults to original and rejects unrecognized names', () => {
  assert.equal(resolveFinish(), FINISH_PRESETS.original);
  for (const name of ['original', 'metal', 'graphite']) assert.equal(resolveFinish(name).name, name);
  for (const name of ['', 'chrome', 'toString', '__proto__', 'METAL', null]) {
    assert.throws(() => resolveFinish(name), /Unknown finish/);
  }
});

test('accent selection is independent and rejects unrecognized names', () => {
  assert.equal(resolveAccents(), ACCENT_PRESETS.original);
  for (const name of ['original', 'light-fasteners', 'white-strips', 'contrast-strips']) assert.equal(resolveAccents(name).name, name);
  for (const name of ['', 'white', 'contrast', 'metal', '__proto__', 'toString', null]) {
    assert.throws(() => resolveAccents(name), /Unknown accents/);
  }
});

test('accent choices change only upper screws and optionally both forehead strips for every finish', () => {
  const previous = globalThis.document;
  globalThis.document = canvasDocument();
  const geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01);
  try {
    for (const finish of Object.keys(FINISH_PRESETS)) for (const accents of Object.keys(ACCENT_PRESETS)) {
      const materials = createMaterials(finish, accents), model = new THREE.Group();
      for (const name of ['Screws_Upper', 'Screws_Lower', 'Screws_Comms']) {
        const mesh = new THREE.InstancedMesh(geometry, materials.darkMetal, 2);
        mesh.name = name;
        model.add(mesh);
      }
      for (const name of ['ForeheadPlate_L', 'ForeheadPlate_R', 'Shell', 'HeadBand']) {
        const mesh = new THREE.Mesh(geometry, materials.darkArmor);
        mesh.name = name;
        model.add(mesh);
      }
      applyArmorFinish(model, materials);
      const before = model.children.map(object => ({ object, material: object.material,
        geometry: object.geometry, position: [...object.geometry.attributes.position.array],
        instances: object.instanceMatrix && [...object.instanceMatrix.array] }));
      applyArmorAccents(model, materials, accents);
      assert.equal(model.children.length, before.length);
      for (const state of before) {
        const object = state.object;
        assert.equal(object.geometry, state.geometry);
        assert.deepEqual([...object.geometry.attributes.position.array], state.position);
        assert.deepEqual(object.instanceMatrix && [...object.instanceMatrix.array], state.instances);
        const expected = accents !== 'original' && object.name === 'Screws_Upper' ? materials.lightFastener
          : accents === 'white-strips' && object.name.startsWith('ForeheadPlate_') ? materials.whiteArmor
            : accents === 'contrast-strips' && object.name.startsWith('ForeheadPlate_') ? materials.contrastStrip : state.material;
        assert.equal(object.material, expected, `${finish}/${accents}/${object.name}`);
      }
      if (accents === 'original') assert.equal(materials.lightFastener, undefined);
      else {
        assert.equal(materials.lightFastener.color.getHex(), materials.whiteArmor.color.getHex());
        assert.equal(materials.lightFastener.roughness, 0.6);
        assert.equal(materials.lightFastener.metalness, 0.05);
        assert.equal(materials.lightFastener.map, null, 'Tiny fasteners must not receive grime');
      }
      if (accents === 'contrast-strips') {
        const strip = materials.contrastStrip, profile = resolveAccents(accents).stripProfiles[finish];
        assert.equal(strip.color.getHex(), 0x41474d);
        assert.equal(strip.roughness, finish === 'metal' ? 0.7 : 0.58);
        assert.equal(strip.metalness, finish === 'metal' ? 0.55 : 0.2);
        assert.equal(strip.envMapIntensity, finish === 'metal' ? 0.6 : 0.45);
        assert.deepEqual(strip.normalScale.toArray(), [profile.normalScale, profile.normalScale]);
        assert.equal(profile.normalScale, finish === 'metal' ? 0.1 : 0.15);
        assert.equal(strip.map, null);
        assert.equal(strip.bumpMap, null);
        assert.equal(strip.normalMap, materials.crownArmor.normalMap);
        assert.equal(strip.roughnessMap, materials.darkArmor.roughnessMap);
        if (finish === 'graphite') assert.ok(strip.roughness < materials.darkArmor.roughness);
        if (finish === 'metal') assert.ok(strip.roughness > materials.darkArmor.roughness);
      } else assert.equal(materials.contrastStrip, undefined);
    }
  } finally {
    geometry.dispose();
    globalThis.document = previous;
  }
});

test('finishes share armor maps, preserve original, and leave other parts unchanged', () => {
  const previous = globalThis.document;
  globalThis.document = canvasDocument();
  try {
    const original = createMaterials();
    const metal = createMaterials('metal'), graphite = createMaterials('graphite');
    assert.equal(original.darkArmor.color.getHex(), 0x313438);
    assert.equal(original.darkArmor.roughness, 0.75);
    assert.equal(original.darkArmor.metalness, 0.15);
    assert.ok(original.darkArmor.bumpMap);
    assert.equal(original.darkArmor.normalMap, null);
    assert.equal(original.crownArmor.roughness, 0.9);
    assert.notEqual(original.darkArmor.roughnessMap, original.crownArmor.roughnessMap);
    for (const [name, materials] of [['metal', metal], ['graphite', graphite]]) {
      const preset = resolveFinish(name);
      for (const slot of ['map', 'roughnessMap', 'normalMap']) {
        assert.equal(materials.darkArmor[slot], materials.crownArmor[slot]);
        if (slot === 'map' && name === 'metal') {
          assert.equal(materials.darkArmor.map, null, 'Metal must have a uniform graphite base color');
        } else {
          assert.ok(materials.darkArmor[slot]);
          const expected = slot === 'roughnessMap' && name === 'metal' ? original.darkArmor[slot] : original.crownArmor[slot];
          assert.deepEqual(materials.darkArmor[slot].image.pixels, expected.image.pixels);
        }
      }
      for (const material of [materials.darkArmor, materials.crownArmor]) {
        assert.equal(material.bumpMap, null);
        assert.equal(material.color.getHex(), preset.color);
        assert.equal(material.roughness, preset.roughness);
        assert.equal(material.metalness, preset.metalness);
        assert.equal(material.envMapIntensity, preset.envMapIntensity);
        assert.equal(material.specularIntensity, preset.specularIntensity);
        assert.deepEqual(material.normalScale.toArray(), [preset.normalScale, preset.normalScale]);
      }
      assert.equal(materials.accessoryArmor.color.getHex(), original.darkArmor.color.getHex());
      assert.equal(materials.accessoryArmor.roughness, original.darkArmor.roughness);
      assert.equal(materials.accessoryArmor.metalness, original.darkArmor.metalness);
      assert.deepEqual(materials.accessoryArmor.bumpMap.image.pixels, original.darkArmor.bumpMap.image.pixels);
      const model = new THREE.Group();
      for (const name of ['Shell', 'Cheek_L', 'ForeheadPlate_R', 'HeadBand', 'Yoke', 'Yoke_B', 'BandClip_L', 'Bracket', 'HingePlate']) {
        const mesh = new THREE.Mesh(new THREE.BufferGeometry(), materials.darkArmor);
        mesh.name = name;
        model.add(mesh);
      }
      applyArmorFinish(model, materials);
      for (const part of ['Shell', 'Cheek_L', 'ForeheadPlate_R']) {
        assert.equal(model.getObjectByName(part).material, materials.darkArmor);
      }
      for (const part of ['HeadBand', 'Yoke', 'Yoke_B', 'BandClip_L', 'Bracket', 'HingePlate']) {
        assert.equal(model.getObjectByName(part).material, materials.accessoryArmor);
      }
      for (const key of Object.keys(original).filter(key => !['darkArmor', 'crownArmor'].includes(key))) {
        for (const property of ['type', 'name', 'roughness', 'metalness', 'emissiveIntensity', 'bumpScale']) {
          assert.equal(materials[key][property], original[key][property], `${name}.${key}.${property}`);
        }
        assert.equal(materials[key].color.getHex(), original[key].color.getHex());
        assert.equal(materials[key].emissive?.getHex(), original[key].emissive?.getHex());
        for (const slot of ['map', 'bumpMap', 'roughnessMap']) {
          assert.deepEqual(materials[key][slot]?.image.pixels, original[key][slot]?.image.pixels);
        }
      }
    }
    assert.ok(metal.darkArmor.roughness < graphite.darkArmor.roughness);
    assert.ok(metal.darkArmor.metalness > graphite.darkArmor.metalness);
  } finally {
    globalThis.document = previous;
  }
});
