// Material library (values from the master prompt) with procedural canvas maps.
import * as THREE from 'three';
import { stippleMap, shellMaps, honeycombMaps, grimeMaps } from './textures.js';

export function createMaterials() {
  const stipple = stippleMap();
  stipple.repeat.set(9, 9);
  const [shellBump, shellRough] = shellMaps();
  const [honeyColor, honeyBump] = honeycombMaps();
  const [grime, grimeRough] = grimeMaps();

  return {
    darkArmor: new THREE.MeshPhysicalMaterial({
      name: 'darkArmor', color: 0x313438, roughness: 0.75, metalness: 0.15,
      roughnessMap: shellRough, bumpMap: shellBump, bumpScale: 0.03, envMapIntensity: 0.6,
    }),
    whiteArmor: new THREE.MeshPhysicalMaterial({ name: 'whiteArmor', color: 0xd6d7d5, roughness: 0.6, metalness: 0.05, map: grime, roughnessMap: grimeRough }),
    whiteTextured: new THREE.MeshStandardMaterial({
      name: 'whiteTextured', color: 0xa8a9a6, roughness: 0.8, metalness: 0.05, bumpMap: stipple, bumpScale: 0.6,
    }),
    ventPlate: new THREE.MeshStandardMaterial({
      name: 'ventPlate', color: 0xffffff, map: honeyColor, roughness: 0.75, metalness: 0.1, bumpMap: honeyBump, bumpScale: 0.5,
    }),
    oliveTech: new THREE.MeshStandardMaterial({ name: 'oliveTech', color: 0x4a493e, roughness: 0.6, metalness: 0.15 }),
    visorGlow: new THREE.MeshStandardMaterial({
      name: 'visorGlow', color: 0x5fe3d6, emissive: 0x5fe3d6, emissiveIntensity: 1.0, roughness: 0.2,
    }),
    blackRubber: new THREE.MeshStandardMaterial({ name: 'blackRubber', color: 0x141414, roughness: 0.75 }),
    darkMetal: new THREE.MeshStandardMaterial({ name: 'darkMetal', color: 0x1a1a1a, roughness: 0.3, metalness: 0.8 }),
    bandStripe: new THREE.MeshStandardMaterial({ name: 'bandStripe', color: 0x8d8e8b, roughness: 0.6, metalness: 0.2 }),
    bust: new THREE.MeshStandardMaterial({ name: 'bust', color: 0x1e1e1e, roughness: 0.8 }),
  };
}
