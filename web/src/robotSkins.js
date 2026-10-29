// Skins of the robot bodies (0.13 "Skins", &skin=<key>): one texture set per skin in the body's fixed UV template
// (blender/robot/export_robot.py › uv_template), mixed by blender/robot/skins.py into assets/robot-bodies/<body>/skins/.
// A skin is a single material on every body mesh: base colour, ORM (R ambient occlusion, G roughness, B metalness, glTF order)
// and emission. Wear and dirt are baked into the textures, so the aged shader (robotWear.js) stays off while a skin is shown;
// a hung-in helmet (Helm H, Scout) keeps its own materials.
import * as THREE from 'three';

// skins.json of a body (index) + resolved file URLs → { key: { de, energy, emissive_intensity, urls: { basecolor, orm, emissive } } }
export function skinCatalog(index, urlOf) {
  if (!index) return {};
  return Object.fromEntries(Object.entries(index.skins).map(([key, s]) => [key, { ...s,
    urls: Object.fromEntries(Object.entries(s.files).map(([kind, file]) => {
      const url = urlOf(file);
      if (!url) throw new Error(`Skin ${key}: file ${file} missing`);
      return [kind, url];
    })) }]));
}

// glTF texture conventions: UV origin top left (no flip), colour maps in sRGB, ORM linear.
export function skinMaterial(key, entry, textures) {
  for (const [kind, t] of Object.entries(textures)) {
    t.flipY = false;
    t.colorSpace = kind === 'orm' ? THREE.NoColorSpace : THREE.SRGBColorSpace;
    t.anisotropy = 8;
    t.needsUpdate = true;
  }
  const m = new THREE.MeshStandardMaterial({
    name: `skin_${key}`, map: textures.basecolor, aoMap: textures.orm, roughnessMap: textures.orm, metalnessMap: textures.orm,
    emissiveMap: textures.emissive, emissive: 0xffffff, emissiveIntensity: entry.emissive_intensity ?? 1, roughness: 1, metalness: 1,
  });
  return m;
}

const loaded = new Map();
export function loadSkinMaterial(key, entry, loader = new THREE.TextureLoader()) {
  const id = `${entry.urls.basecolor}|${key}`;
  if (!loaded.has(id)) loaded.set(id, Promise.all(['basecolor', 'orm', 'emissive'].map(kind => loader.loadAsync(entry.urls[kind])))
    .then(([basecolor, orm, emissive]) => skinMaterial(key, entry, { basecolor, orm, emissive })));
  return loaded.get(id);
}

// Put the skin material on every body mesh (meshes of a hung-in helmet carry userData.helmet and stay). The flat and aged
// materials are restored by robotWear.setRobotWear, which the viewer calls before (skin off) or instead (skin on).
export function applySkin(model, material) {
  let count = 0;
  model.traverse(o => {
    if (!o.isMesh || o.userData.helmet) return;
    if (!o.geometry.attributes.uv) throw new Error(`Skin: mesh ${o.name} has no UV template (re-export with blender/robot/export_robot.py)`);
    o.material = material;
    count++;
  });
  return count;
}
