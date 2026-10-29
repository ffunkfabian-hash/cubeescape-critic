import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import cuirassParams from './fixtures/cuirass.json' with {type:'json'};
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { buildShoulderStudy, SHOULDER_STUDY_PARTS, shoulderStudyParams } from '../src/parts/shoulderStudy.js';

const palette = Object.fromEntries(['blackRubber', 'whiteArmor', 'darkArmor', 'darkMetal', 'whiteTextured']
  .map(name => [name, new THREE.MeshStandardMaterial({ name })]));

function triangles(geometry) {
  const p = geometry.attributes.position;
  const indices = geometry.index ? Array.from(geometry.index.array) : Array.from({ length: p.count }, (_, i) => i);
  return Array.from({ length: indices.length / 3 }, (_, i) => indices.slice(i * 3, i * 3 + 3)
    .map(j => new THREE.Vector3().fromBufferAttribute(p, j)));
}

test('upper-body proposal stays a short independently editable bust and reuses the accepted palette', () => {
  const body = buildShoulderStudy(palette);
  assert.equal(body.name, 'ShoulderStudy');
  assert.equal(body.children.length, Object.keys(SHOULDER_STUDY_PARTS).length);
  assert.equal(new Set(body.children.map(part => part.geometry)).size, body.children.length);
  assert.equal(new Set(body.children.map(part => part.userData.partId)).size, body.children.length);
  for (const part of body.children) {
    assert.equal(part.name, SHOULDER_STUDY_PARTS[part.userData.partId]);
    assert.ok(Object.values(palette).includes(part.material));
    assert.equal(part.material.emissiveIntensity, 1);
    assert.equal(part.material.emissive.getHex(), 0);
  }
  const bounds = new THREE.Box3().setFromObject(body);
  assert.ok(bounds.min.y >= -1.53 + shoulderStudyParams.placement.upperBodyRise && bounds.max.y <= -0.33,
    `${bounds.min.y}..${bounds.max.y}`);
  assert.ok(bounds.max.x < 1.18 && bounds.min.x > -1.18);
  assert.ok(bounds.max.x - bounds.min.x >= 1.85 && bounds.max.x - bounds.min.x < 2.1, 'shoulders wrap closer to the sturdy torso');
  // Bastion intentionally projects the chest to Z=0.6435; Cuirass ended near 0.505.
  assert.ok(bounds.max.z < 0.68 && bounds.min.z > -0.46);
  const core = new THREE.Box3().setFromObject(body.getObjectByName('UpperTorsoCore'));
  assert.ok(core.max.z - core.min.z > 0.69 && core.max.z - core.min.z < 0.75, 'sturdy torso depth');
});

test('all new solids have finite UVs, nondegenerate faces, outward volume and closed triangle edges', () => {
  const body = buildShoulderStudy(palette);
  const key = p => p.toArray().map(value => Math.round(value * 1e6)).join(',');
  for (const part of body.children) {
    for (const attribute of ['position', 'normal', 'uv']) {
      assert.ok(part.geometry.attributes[attribute]?.array.every(Number.isFinite), `${part.name}.${attribute}`);
    }
    let volume = 0;
    const edges = new Map(), directions = new Map();
    for (const [a, b, c] of triangles(part.geometry)) {
      const area = b.clone().sub(a).cross(c.clone().sub(a)).length();
      assert.ok(area > 1e-10, `${part.name}: degenerate face`);
      volume += a.dot(b.clone().cross(c)) / 6;
      for (const [u, v] of [[a, b], [b, c], [c, a]]) {
        const pair = [key(u), key(v)].sort().join('|');
        edges.set(pair, (edges.get(pair) ?? 0) + 1);
        directions.set(pair, (directions.get(pair) ?? 0) + (key(u) < key(v) ? 1 : -1));
      }
    }
    assert.ok(volume > 1e-7, `${part.name}: nonpositive volume ${volume}`);
    for (const [edge, count] of edges) assert.equal(count, 2, `${part.name}: edge ${edge}`);
    for (const [edge, direction] of directions) assert.equal(direction, 0, `${part.name}: inconsistent winding ${edge}`);
  }
});

test('body parameters reproduce geometry and isolated edits leave the opposite shoulder intact', () => {
  const first = buildShoulderStudy(palette), second = buildShoulderStudy(palette);
  for (const part of first.children) assert.deepEqual(part.geometry.attributes.position.array,
    second.getObjectByName(part.name).geometry.attributes.position.array, part.name);
  const params = structuredClone(shoulderStudyParams);
  params.neck.top -= 0.03;
  const changed = buildShoulderStudy(palette, params);
  assert.notDeepEqual(first.getObjectByName('NeckFlex').geometry.attributes.position.array,
    changed.getObjectByName('NeckFlex').geometry.attributes.position.array);
  assert.deepEqual(first.getObjectByName('ShoulderFront_L').geometry.attributes.position.array,
    changed.getObjectByName('ShoulderFront_L').geometry.attributes.position.array);
});

test('front and rear armor remain outside the support rather than disappearing inside it', () => {
  const body = buildShoulderStudy(palette);
  body.updateMatrixWorld(true);
  // The former x=0.3 probe now belongs to the new center; x=0.4 probes the side segment.
  for (const [x, y, z, name] of [[0.15, -1.41, 2, 'ChestInsert_L'],
    [-0.12, -1.42, 2, 'ChestInsert_R'], [0.4, -1, 2, 'ClavicleArmor_L'],
    [0.15, -1, -2, 'ScapulaArmor_L'], [0, -1.35, -2, 'BackSpineInsert']]) {
    const ray = new THREE.Raycaster(new THREE.Vector3(x, y + shoulderStudyParams.placement.upperBodyRise, z),
      new THREE.Vector3(0, 0, -Math.sign(z)));
    const hits = ray.intersectObject(body, true);
    assert.equal(hits[0]?.object.name, name, `${x},${y},${z}`);
    const backing = hits.find(hit => hit.object.name === 'UpperTorsoCore');
    assert.ok(backing && backing.distance - hits[0].distance > 0.01, `${name}: armor has no clear outer face`);
  }
});

test('lower angular shoulders retain the short neck, helmet anchor, outer downturn and front notch', () => {
  const body = buildShoulderStudy(palette, cuirassParams);
  const neck = new THREE.Box3().setFromObject(body.getObjectByName('NeckFlex'));
  assert.ok(Math.abs(neck.max.y - shoulderStudyParams.neck.top) < 1e-6);
  assert.ok(neck.max.y - neck.min.y <= 0.32, 'neck must be shorter than the original 0.49-unit proposal');
  const shoulder = body.getObjectByName('ShoulderFront_L');
  const position = shoulder.geometry.attributes.position;
  const inner = [], outer = [];
  for (let i = 0; i < position.count; i++) {
    if (position.getX(i) < 0.5) inner.push(position.getY(i));
    // Cuirass wraps within X=0.995; the former 1.1 selector would select no vertices.
    if (position.getX(i) > 0.92) outer.push(position.getY(i));
  }
  assert.ok(inner.length && outer.length, 'both shoulder regions must contain vertices');
  assert.ok(Math.max(...inner) - Math.max(...outer) > 0.12, 'outer shoulder cap must still turn down');
  assert.ok(new THREE.Box3().setFromObject(shoulder).max.y < -0.58, 'avoid the previous raised shoulder hump');
  const plain = structuredClone(cuirassParams);
  plain.collar.frontNotchDepth = 0;
  const unnotched = buildShoulderStudy(palette, plain);
  const topAtCenter = root => {
    root.updateMatrixWorld(true);
    const ray = new THREE.Raycaster(new THREE.Vector3(0, 0, 0.32), new THREE.Vector3(0, -1, 0));
    return ray.intersectObject(root.getObjectByName('CollarFront'))[0].point.y;
  };
  assert.ok(topAtCenter(unnotched) - topAtCenter(body) > 0.03, 'the front V must lower the physical rim');
});

test('historical high and low shoulder profiles remain reproducible with wrapping disabled', () => {
  assert.equal(createHash('sha256').update(readFileSync(new URL('./fixtures/cuirass.json',import.meta.url))).digest('hex'),
    '4dac2752c6cb11b2ee35e925cb2342f36a4ff00f61a0e45475763aec3c5bc5fb', 'historical fixture must match source commit 8bd048c');
  const historical = structuredClone(cuirassParams);
  historical.shoulder.wrap.enabled = false;
  // Keep the historical cap thickness/chamfer instead of inheriting Cuirass values.
  Object.assign(historical.shoulder, { thickness:0.1, bevel:0.014 });
  Object.assign(historical.shoulder, { archHeight:0.23, curveSubdivisions:2, slope:0.31, outerDrop:0.14 });
  const blocky = structuredClone(historical);
  Object.assign(blocky.shoulder, { archHeight:0.04, curveSubdivisions:0, slope:0.16, outerDrop:0.085 });
  const body = buildShoulderStudy(palette, historical), current = buildShoulderStudy(palette, blocky);
  const previous = structuredClone(historical);
  previous.shoulder.archHeight = 0;
  previous.shoulder.thickness = 0.078;
  previous.shoulder.baseDrop = 0.07;
  previous.shoulder.baseThickness = 0.19;
  const flatter = buildShoulderStudy(palette, previous);
  for (const name of ['ShoulderFront_R', 'ShoulderRear_R', 'ShoulderFront_L', 'ShoulderRear_L']) {
    const raised = new THREE.Box3().setFromObject(body.getObjectByName(name));
    const before = new THREE.Box3().setFromObject(flatter.getObjectByName(name));
    assert.ok(raised.max.y - before.max.y > 0.14, `${name}: upper silhouette must rise clearly`);
    assert.ok(raised.max.y < -0.45, `${name}: leave vertical space below the helmet`);
    assert.equal(raised.min.x, before.min.x);
    assert.equal(raised.max.x, before.max.x);
    assert.ok(raised.min.y < -1.01, `${name}: keep the downward outer cap`);
    const lower = current.getObjectByName(name);
    assert.ok(raised.max.y - new THREE.Box3().setFromObject(lower).max.y > 0.1, `${name}: lower crown`);
    assert.ok(lower.geometry.attributes.position.count * 8 < body.getObjectByName(name).geometry.attributes.position.count,
      `${name}: broad facets instead of a finely subdivided dome`);
  }
  for (const name of ['NeckFlex', 'NeckRibs', 'CollarFront', 'CollarRear', 'UpperTorsoCore']) {
    assert.deepEqual(body.getObjectByName(name).geometry.attributes.position.array,
      flatter.getObjectByName(name).geometry.attributes.position.array, `${name}: shoulder arch moved an unrelated part`);
  }
});

test('separate lower lames wrap around a visible dark shoulder joint', () => {
  const body = buildShoulderStudy(palette, cuirassParams); body.updateMatrixWorld(true);
  for (const [side, suffix] of [[1,'L'],[-1,'R']]) {
    const main = new THREE.Box3().setFromObject(body.getObjectByName(`ShoulderFront_${suffix}`));
    const lame = new THREE.Box3().setFromObject(body.getObjectByName(`ShoulderLame_${suffix}`));
    assert.ok(lame.min.y < main.min.y - .08, 'secondary plate extends below primary shell');
    const ray = new THREE.Raycaster(new THREE.Vector3(side * 2, -1.10, .08), new THREE.Vector3(-side,0,0));
    const hits = ray.intersectObject(body,true);
    assert.equal(hits[0]?.object.name, `ShoulderLame_${suffix}`);
    assert.ok(hits.some(hit=>hit.object.name===`ShoulderJoint_${suffix}`), 'joint supports the shoulder plates');
    const upper = new THREE.Raycaster(new THREE.Vector3(side * 2, -.76, .13), new THREE.Vector3(-side,0,0));
    assert.equal(upper.intersectObject(body,true)[0]?.object.name, `ShoulderFront_${suffix}`,
      'dark joint must stay behind the white upper shell');
  }
});

test('the two breastplate halves form a raised central ridge and the collar flares toward the chest', () => {
  const body=buildShoulderStudy(palette, cuirassParams);body.updateMatrixWorld(true);
  const hitAt=x=>new THREE.Raycaster(new THREE.Vector3(x,-.9,2),new THREE.Vector3(0,0,-1)).intersectObject(body,true)[0];
  const center=hitAt(.035), outer=hitAt(.32);
  assert.equal(center.object.name,'ClavicleArmor_L');assert.equal(outer.object.name,'ClavicleArmor_L');
  assert.ok(center.point.z - outer.point.z > .08, 'physical midrib must rise above the side face');
  const p=shoulderStudyParams.collar;
  assert.ok(p.outerRz < .37 && p.outerRz+p.baseFlareZ >= .42, 'compact top and broader chest-side collar');
});


test('Bastion has a single uninterrupted central breastplate and separate exposed flanks', () => {
  const body=buildShoulderStudy(palette);body.updateMatrixWorld(true);
  for(const x of [-.2,0,.2]) {
    const hit=new THREE.Raycaster(new THREE.Vector3(x,-.8,2),new THREE.Vector3(0,0,-1)).intersectObject(body,true)[0];
    assert.equal(hit?.object.name,'BreastplateCenter','no center seam or exposed torso through the breastplate');
  }
  for(const [side,suffix] of [[1,'L'],[-1,'R']]) {
    const hits=new THREE.Raycaster(new THREE.Vector3(side*2,-1.12,0),new THREE.Vector3(-side,0,0))
      .intersectObjects([body.getObjectByName(`FlankArmor_${suffix}`),body.getObjectByName('UpperTorsoCore')]);
    assert.equal(hits[0]?.object.name,`FlankArmor_${suffix}`);
    assert.ok(hits.find(h=>h.object.name==='UpperTorsoCore').distance-hits[0].distance>.015);
  }
});

test('Bastion shoulder roofs enclose depth above recessed joints and a separate lower layer', () => {
 const body=buildShoulderStudy(palette);body.updateMatrixWorld(true);
 for(const [side,suffix] of [[1,'L'],[-1,'R']]) {
   const roof=body.getObjectByName(`ShoulderRoof_${suffix}`), bounds=new THREE.Box3().setFromObject(roof);
   assert.ok(bounds.max.y<-.58,'keep shoulders below the short neck');
   assert.ok(bounds.max.z-bounds.min.z>.55,'housing must have depth');
   for(const z of [-.18,.18]) {
     const hit=new THREE.Raycaster(new THREE.Vector3(side*.75,1,z),new THREE.Vector3(0,-1,0)).intersectObject(body,true)[0];
     assert.equal(hit?.object.name,roof.name);
   }
   const hit=new THREE.Raycaster(new THREE.Vector3(side*2,-1.1,.08),new THREE.Vector3(-side,0,0)).intersectObject(body,true)[0];
   assert.equal(hit?.object.name,`ShoulderLame_${suffix}`);
 }
 const disabled=structuredClone(shoulderStudyParams);disabled.shoulder.box.enabled=false;
 const curved=buildShoulderStudy(palette,disabled);
 assert.equal(curved.getObjectByName('ShoulderRoof_L'),undefined);
 assert.notDeepEqual(curved.getObjectByName('ShoulderFront_L').geometry.attributes.position.array,
   body.getObjectByName('ShoulderFront_L').geometry.attributes.position.array);
});


test('Bastion chest relief creates deliberate physical volume while retaining the perimeter', () => {
 const raised=buildShoulderStudy(palette);const flatParams=structuredClone(shoulderStudyParams);delete flatParams.chest.relief;
 const flat=buildShoulderStudy(palette,flatParams);raised.updateMatrixWorld(true);flat.updateMatrixWorld(true);
 const probe=root=>new THREE.Raycaster(new THREE.Vector3(0,-.90,2),new THREE.Vector3(0,0,-1))
   .intersectObject(root.getObjectByName('BreastplateCenter'))[0].point.z;
 assert.ok(probe(raised)-probe(flat)>.15,'visible forward volume rather than just a texture');
 const a=new THREE.Box3().setFromObject(raised.getObjectByName('BreastplateCenter'));
 const b=new THREE.Box3().setFromObject(flat.getObjectByName('BreastplateCenter'));
 assert.equal(a.min.x,b.min.x);assert.equal(a.max.x,b.max.x);assert.equal(a.min.y,b.min.y);assert.equal(a.max.y,b.max.y);
});
