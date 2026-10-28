import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import * as THREE from 'three';
import { fileURLToPath } from 'node:url';

test('rounded forehead does not lower the dark cap over the rear housing', async()=>{
 const server=await createServer({root:fileURLToPath(new URL('../',import.meta.url)),logLevel:'error',server:{middlewareMode:true,hmr:false}});
 const materials=new Map();
 try {
  const {buildUpperHelmet}=await server.ssrLoadModule('/src/parts/upperHelmet.js');
  const {D}=await server.ssrLoadModule('/src/params.js');
  const palette=new Proxy({},{get:(_,name)=>{if(!materials.has(name))materials.set(name,new THREE.MeshStandardMaterial());return materials.get(name)}});
  const warn=console.warn;let emitted=false;let model;
  try{console.warn=(...args)=>{if(String(args[0]).includes('maxLeafSize')){if(emitted)return;emitted=true;}warn(...args)};model=buildUpperHelmet(palette);}finally{console.warn=warn;}
  model.updateMatrixWorld(true);
  for (const name of ['Crown', 'Shell', 'Cheek_L', 'Cheek_R', 'Mouth_Insert']) {
   const part = model.getObjectByName(name);
   assert.ok(part?.isMesh, `Missing separate part ${name}`);
   assert.ok(part.geometry.attributes.position.array.every(Number.isFinite), name);
  }
  // Preserve the user-approved H04 geometry and keep the openings unobstructed.
  for (const s of [-1, 1]) {
   const eye = model.getObjectByName(s > 0 ? 'Visor_L' : 'Visor_R');
   assert.ok(Math.abs(eye.position.x - s * 0.15563515398032193) < 1e-6);
   assert.ok(Math.abs(eye.position.y - 0.08) < 1e-6);
   assert.ok(Math.abs(eye.position.z - 0.44764433) < 1e-6);
   assert.equal(eye.geometry.parameters.width, 0.168);
   assert.equal(eye.geometry.parameters.height, 0.054);
   assert.ok(Math.abs(eye.rotation.y - s * 20 * Math.PI / 180) < 1e-6);
   assert.ok(Math.abs(eye.rotation.z - s * 17 * Math.PI / 180) < 1e-6);
   const axis = new THREE.Vector3(0, 0, 1).applyQuaternion(eye.quaternion);
   const ray = new THREE.Raycaster(eye.position.clone().addScaledVector(axis, 0.2), axis.clone().negate());
   assert.equal(ray.intersectObject(model, true)[0]?.object.name, eye.name, 'Eye opening is blocked');
  }
  const mouthRay = new THREE.Raycaster(new THREE.Vector3(0, -0.25, 2), new THREE.Vector3(0, 0, -1));
  assert.equal(mouthRay.intersectObject(model, true)[0]?.object.name, 'Mouth_Insert', 'Recess must expose its insert at the lower face');
  for(const x of [-.15,0,.15]){
   const ray=new THREE.Raycaster(new THREE.Vector3(x,.2,-2),new THREE.Vector3(0,0,1));
   const hit=ray.intersectObject(model,true)[0];
   assert.ok(hit,'Front mask must still exist');
   assert.ok(hit.point.z >= D.maskBackZ-.025,`Cap intrudes over rear housing at ${hit.point.toArray()}`);
  }
  model.traverse(o=>o.geometry?.dispose());
 }finally{for(const material of materials.values())material.dispose();await server.close();}
});
