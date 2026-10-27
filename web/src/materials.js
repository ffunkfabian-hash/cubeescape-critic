// Material library (values from the master prompt) with procedural canvas maps.
import * as THREE from 'three';
import { stippleMap, shellMaps, honeycombMaps, fabricMaps } from './textures.js';

export function createMaterials() {
  const stipple = stippleMap();
  stipple.repeat.set(9, 9);
  const [shellBump, shellRough] = shellMaps();
  const [honeyColor, honeyBump] = honeycombMaps();
  const [fabricBump, fabricRough] = fabricMaps();

  return {
    darkArmor: new THREE.MeshPhysicalMaterial({
      name: 'darkArmor', color: 0x222426, roughness: 0.7, metalness: 0.2,
      roughnessMap: shellRough, bumpMap: shellBump, bumpScale: 0.03, envMapIntensity: 0.6,
    }),
    whiteArmor: new THREE.MeshPhysicalMaterial({ name: 'whiteArmor', color: 0xdedede, roughness: 0.45, metalness: 0.1 }),
    whiteTextured: new THREE.MeshStandardMaterial({
      name: 'whiteTextured', color: 0xc8c8c5, roughness: 0.8, metalness: 0.05, bumpMap: stipple, bumpScale: 0.6,
    }),
    ventPlate: new THREE.MeshStandardMaterial({
      name: 'ventPlate', color: 0xffffff, map: honeyColor, roughness: 0.75, metalness: 0.1, bumpMap: honeyBump, bumpScale: 0.5,
    }),
    oliveTech: new THREE.MeshStandardMaterial({ name: 'oliveTech', color: 0x4a493e, roughness: 0.6, metalness: 0.15 }),
    visorGlow: new THREE.MeshStandardMaterial({
      name: 'visorGlow', color: 0x99fff6, emissive: 0x99fff6, emissiveIntensity: 1.2, roughness: 0.2,
    }),
    blackRubber: new THREE.MeshStandardMaterial({ name: 'blackRubber', color: 0x141414, roughness: 0.75 }),
    scarfFabric: new THREE.MeshStandardMaterial({
      name: 'scarfFabric', color: 0x686a63, roughness: 0.9, roughnessMap: fabricRough, bumpMap: fabricBump, bumpScale: 0.3,
    }),
    darkMetal: new THREE.MeshStandardMaterial({ name: 'darkMetal', color: 0x1a1a1a, roughness: 0.3, metalness: 0.8 }),
    bandStripe: new THREE.MeshStandardMaterial({ name: 'bandStripe', color: 0x8d8e8b, roughness: 0.6, metalness: 0.2 }),
    bust: new THREE.MeshStandardMaterial({ name: 'bust', color: 0x1e1e1e, roughness: 0.8 }),
  };
}
