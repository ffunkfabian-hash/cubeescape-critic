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
  const {buildForeheadPlates}=await server.ssrLoadModule('/src/parts/foreheadPlates.js');
  const palette=new Proxy({},{get:(_,name)=>{if(!materials.has(name))materials.set(name,new THREE.MeshStandardMaterial());return materials.get(name)}});
  const warn=console.warn;let emitted=false;let model;
  try{console.warn=(...args)=>{if(String(args[0]).includes('maxLeafSize')){if(emitted)return;emitted=true;}warn(...args)};model=buildUpperHelmet(palette);}finally{console.warn=warn;}
  model.updateMatrixWorld(true);
  for (const name of ['Crown', 'Shell', 'Cheek_L', 'Cheek_R', 'Mouth_Insert']) {
   const part = model.getObjectByName(name);
   assert.ok(part?.isMesh, `Missing separate part ${name}`);
   assert.ok(part.geometry.attributes.position.array.every(Number.isFinite), name);
  }
  // Both transverse and longitudinal roof sections must curve continuously:
  // slopes get steeper away from the apex, with no flat shoulder at the band.
  const crown = model.getObjectByName('Crown');
  const plates = buildForeheadPlates(crown, palette);
  model.add(plates); model.updateMatrixWorld(true);
  assert.equal(plates.children.length, 2);
  for (const side of [-1, 1]) {
   const part = plates.getObjectByName(side > 0 ? 'ForeheadPlate_L' : 'ForeheadPlate_R');
   assert.ok(part?.isMesh, 'Each forehead plate must remain independently exportable');
   for (const attr of Object.values(part.geometry.attributes)) assert.ok(attr.array.every(Number.isFinite));
   assert.equal(part.material, palette.darkArmor);
   for (const y of [0.22, 0.29, 0.36]) for (const x of [0.08, 0.11, 0.14]) {
    const ray = new THREE.Raycaster(new THREE.Vector3(side * x, y, 2), new THREE.Vector3(0, 0, -1));
    const support = ray.intersectObject(crown)[0], surface = ray.intersectObject(part)[0];
    assert.ok(support && surface, 'Missing plate surface or supporting crown');
    const offset = surface.point.z - support.point.z;
    assert.ok(offset > 0.002 && offset < 0.012, `Floating or buried forehead plate: ${offset}`);
   }
  }
  for (const y of [0.2, 0.3, 0.4])
   assert.equal(new THREE.Raycaster(new THREE.Vector3(0, y, 2), new THREE.Vector3(0, 0, -1))
    .intersectObject(plates, true).length, 0, 'Keep the centre strip open');

  for (const section of [t => [t, -0.12], t => [0, t], t => [0, -t]]) {
   const heights = Array.from({length: 11}, (_, i) => {
    const [x, z] = section(i * 0.03);
    const hit = new THREE.Raycaster(new THREE.Vector3(x, 2, z), new THREE.Vector3(0, -1, 0)).intersectObject(crown)[0];
    assert.ok(hit, 'Missing crown roof');
    return hit.point.y;
   });
   for (let i = 1; i < heights.length - 1; i++)
    assert.ok(heights[i - 1] - 2 * heights[i] + heights[i + 1] < 0, 'Crown roof has a flat or inverted shoulder');
  }
  // The user now wants a visually closed joint, while preserving separate parts.
  const face = model.getObjectByName('Shell'), slope = D.crownTransition.slope;
  const centre = D.capEdgeY + slope * D.crownTransition.anchorZ;
  for (const degrees of [-25, -15, 15, 25]) {
   const angle = degrees * Math.PI / 180;
   const direction = new THREE.Vector3(Math.sin(angle), -slope * Math.cos(angle), Math.cos(angle));
   for (const t of [-0.001, 0.003, 0.01]) {
    const ray = new THREE.Raycaster(new THREE.Vector3(0, centre + t, 0).addScaledVector(direction, 2), direction.clone().normalize().negate());
    const hit = ray.intersectObjects([crown, face, plates], true)[0];
    assert.ok(hit?.object.name.startsWith('ForeheadPlate_'), `Crown strip separates plate from mask at ${degrees}, ${t}`);
    const mask = ray.intersectObject(face)[0];
    if (mask) assert.ok(Math.abs(hit.distance - mask.distance) < 0.006, 'Plate lip stands too far off the mask');
   }
  }

  for (const degrees of [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75]) {
   const angle = degrees * Math.PI / 180;
   const direction = new THREE.Vector3(Math.sin(angle), -slope * Math.cos(angle), Math.cos(angle));
   const cast = t => new THREE.Raycaster(new THREE.Vector3(0, centre + t, 0).addScaledVector(direction, 2), direction.clone().normalize().negate());
   const below = cast(-0.001).intersectObject(face)[0], above = cast(0.0015).intersectObject(crown)[0];
   assert.ok(below && above, `Missing brow surface at ${degrees} degrees`);
   const radius = point => Math.hypot(point.x, point.z);
   assert.ok(Math.abs(radius(above.point) - radius(below.point)) < 0.002, 'Raised ledge remains at crown/mask joint');
   for (const t of [-0.00025, 0, 0.00025])
    assert.ok(cast(t).intersectObjects([crown, face]).some(hit => radius(hit.point) > radius(below.point) - 0.005),
     `Open crown/mask seam at ${degrees} degrees, offset ${t}`);
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
