import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { fitHelmet } from '../src/shapeFit.js';

const close = (a,b) => assert.ok(Math.abs(a-b)<1e-6, `${a} != ${b}`);
test('lower-face fit preserves crown and shortens connected lower geometry',()=>{
 const model=new THREE.Group();const mesh=new THREE.Mesh(new THREE.BoxGeometry(1,2,1),new THREE.MeshStandardMaterial());model.add(mesh);
 fitHelmet(model,{lowerFaceScale:.86,lowerFaceAnchor:0});
 const box=new THREE.Box3().setFromObject(model);close(box.max.y,1);close(box.min.y,-.86);
 const normal=mesh.geometry.attributes.normal;for(const n of normal.array)assert.ok(Number.isFinite(n));
});
test('instanced fasteners follow the same fit as their supporting plates',()=>{
 const model=new THREE.Group();const material=new THREE.MeshStandardMaterial();
 const geo=new THREE.BoxGeometry(.02,.02,.02);const screws=new THREE.InstancedMesh(geo,material,2);screws.name='Fasteners';
 screws.setMatrixAt(0,new THREE.Matrix4().makeTranslation(.3,-.5,0));screws.setMatrixAt(1,new THREE.Matrix4().makeTranslation(-.3,.5,0));model.add(screws);
 fitHelmet(model,{lowerFaceScale:.8,lowerFaceAnchor:0});
 const mesh=model.getObjectByName('Fasteners');assert.equal(mesh.material,material);
 const box=new THREE.Box3().setFromObject(mesh);close(box.min.y,-.408);close(box.max.y,.51);
 close(new THREE.Box3().setFromBufferAttribute(geo.attributes.position).min.y,-.01);
});
test('identity fit leaves geometry unchanged and invalid fitting values fail',()=>{
 const model=new THREE.Group();const mesh=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial());model.add(mesh);const geo=mesh.geometry;
 fitHelmet(model);assert.equal(mesh.geometry,geo);
 for(const scale of [0,2,NaN,Infinity])assert.throws(()=>fitHelmet(model,{lowerFaceScale:scale}));
});
