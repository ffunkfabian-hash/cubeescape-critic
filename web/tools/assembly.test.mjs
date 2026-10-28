import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { resolveAssemblyOptions } from '../src/assemblyOptions.js';
import { assemblyInventory, configureHelmetAssembly, createExplodedAssembly, assemblyDescription } from '../src/assembly.js';

test('assembly options preserve the legacy body alias and reject invalid values', () => {
  assert.deepEqual(resolveAssemblyOptions(), { headset:'on', body:'none', exploded:0 });
  assert.equal(resolveAssemblyOptions({ body:'1' }).body, 'legacy');
  assert.equal(resolveAssemblyOptions({ body:'shoulders', headset:'off', exploded:'.5' }).exploded,.5);
  for (const options of [{headset:'none'},{body:'all'},{exploded:'NaN'},{exploded:2},{exploded:-1},{exploded:''}]) assert.throws(()=>resolveAssemblyOptions(options));
});

test('label anchors apply translated, rotated and scaled model transforms exactly once', () => {
  const model = new THREE.Group();
  model.position.set(3, -2, 5); model.rotation.set(.2, .7, -.3); model.scale.set(2, 1.3, .8);
  const geometry = new THREE.BoxGeometry(.4, .7, .2), material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material); mesh.name = 'Crown'; mesh.position.set(.5, .8, -.1); model.add(mesh);
  const expected = assemblyInventory(model)[0].center;
  const anchor = new THREE.Vector3(...assemblyDescription(model)[0].center).applyMatrix4(model.matrixWorld);
  assert.ok(anchor.distanceTo(new THREE.Vector3(...expected)) < 1e-9);
  geometry.dispose(); material.dispose();
});

test('headset removal and exploded assembly preserve every retained source mesh', async () => {
  const server = await createServer({ root:fileURLToPath(new URL('../',import.meta.url)), logLevel:'error', server:{middlewareMode:true,hmr:false} });
  const materials = new Map(); let model;
  const palette=new Proxy({}, {get:(_,name)=>{if(!materials.has(name))materials.set(name,new THREE.MeshStandardMaterial({name}));return materials.get(name);}});
  try {
    const {buildHelmet}=await server.ssrLoadModule('/src/helmet.js');
    model=buildHelmet(palette); const original=assemblyInventory(model);
    assert.equal(original.length,104);
    const ids=new Set(original.map(e=>e.id));
    const expected={Crown:'H01',Brim:'H02',Shell:'H03',Visor_R:'H04A',Visor_L:'H04B',Cheek_R:'H05A',Cheek_L:'H05B',Mouth_Insert:'H06',
      Chin:'H07',Jaw_R:'H08A',Jaw_L:'H08B',Core:'H09',Collar:'H10',RadioModule:'H12',RadioModule_B:'H13',HeadBand:'H15',BackBox:'H16',
      NeckRing:'H19',ForeheadPlate_R:'H20',ForeheadPlate_L:'H21',Screws_Upper:'F01',Screws_Chin:'F02',Screws_Side:'F03',NeckCore:'P01'};
    for(const [name,id] of Object.entries(expected)) assert.equal(original.find(e=>e.mesh.name===name)?.id,id,name);
    for(const id of ['H15A','H15B']) assert.equal(original.filter(e=>e.id===id&&e.mesh.userData.assemblyRole==='headset-bail').length,2);
    // Reordering a bail cannot silently change its category or explosion offset.
    const comms=model.getObjectByName('RightComms_And_Tube'), bail=comms.children.find(o=>o.userData.assemblyRole==='headset-bail');
    const order=comms.children.indexOf(bail);comms.children.splice(order,1);comms.children.unshift(bail);
    assert.equal(assemblyInventory(model).find(e=>e.mesh===bail).id,'H15A');
    comms.children.shift();comms.children.splice(order,0,bail);
    for(let i=1;i<=21;i++) assert.ok([...ids].some(id=>id.startsWith(`H${String(i).padStart(2,'0')}`)), `missing H${i}`);
    const snapshots=new Map(original.map(e=>[e.path,{mesh:e.mesh,matrix:[...e.mesh.matrixWorld.elements],position:[...e.mesh.position],geometry:e.mesh.geometry,material:e.mesh.material}]));
    for(const amount of [0,1]) {
      const exploded=createExplodedAssembly(model,amount); exploded.updateMatrixWorld(true);
      assert.equal(exploded.children.length,104); assert.equal(assemblyInventory(exploded).length,104);
      const described=assemblyDescription(exploded);
      assert.equal(described.reduce((n,g)=>n+g.meshes.length,0),104);
      for(const mesh of exploded.children) {
        const source=snapshots.get(mesh.userData.sourcePath); assert.ok(source);
        assert.equal(mesh.geometry,source.geometry); assert.equal(mesh.material,source.material);
        const wanted=new THREE.Matrix4().fromArray(source.matrix), offset=mesh.userData.explosionOffset;
        wanted.elements[12]+=offset[0]*amount;wanted.elements[13]+=offset[1]*amount;wanted.elements[14]+=offset[2]*amount;
        mesh.matrixWorld.elements.forEach((value,i)=>assert.ok(Math.abs(value-wanted.elements[i])<1e-9,mesh.name));
        assert.deepEqual(source.mesh.matrixWorld.elements,source.matrix);
        assert.deepEqual([...source.mesh.position],source.position);
      }
    }
    const stripped=configureHelmetAssembly(model,{headset:'off',body:'none'});
    const retained=assemblyInventory(stripped); assert.equal(retained.length,64);
    assert.ok(stripped.getObjectByName('BackBox_Group'));
    for(const name of ['RadioModule','RadioModule_B','HeadBand','HeadBand_Stripe','Yoke','Yoke_B','Antenna','Antenna_B','Hose','Hose_B']) assert.equal(stripped.getObjectByName(name),undefined,name);
    for(const entry of retained) {
      const before=snapshots.get(entry.path); assert.ok(before,entry.path);
      assert.equal(entry.mesh.geometry,before.geometry);assert.equal(entry.mesh.material,before.material);
      assert.deepEqual(entry.mesh.matrixWorld.elements,before.matrix);
    }
    configureHelmetAssembly(stripped,{headset:'off',body:'shoulders'});
    assert.equal(stripped.getObjectByName('Neck'),undefined);assert.equal(assemblyInventory(stripped).length,58);
    const {buildShoulderStudy}=await server.ssrLoadModule('/src/parts/shoulderStudy.js');
    stripped.add(buildShoulderStudy(palette));
    const withBody=assemblyInventory(stripped);assert.equal(withBody.length,80);
    assert.equal(withBody.filter(e=>e.id.startsWith('B')).length,22);
    assert.equal(assemblyDescription(createExplodedAssembly(stripped,1)).reduce((n,g)=>n+g.meshes.length,0),80);
  } finally {
    model?.traverse(o=>o.geometry?.dispose());for(const material of materials.values())material.dispose();await server.close();
  }
});
