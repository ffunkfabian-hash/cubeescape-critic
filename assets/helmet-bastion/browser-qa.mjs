// Reproduce the focused browser checks after `npm --prefix web ci`.
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=fileURLToPath(new URL('../../web/',import.meta.url));
const {createServer}=await import(pathToFileURL(path.join(root,'node_modules/vite/dist/node/index.js')));
const {chromium}=await import(pathToFileURL(path.join(root,'node_modules/playwright/index.mjs')));
import assert from 'node:assert/strict';
const server=await createServer({root,logLevel:'error',server:{host:'127.0.0.1',port:5203,strictPort:false}});let browser;
try {
 await server.listen();browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:1280,height:720}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(server.resolvedUrls.local[0]+'?ui=0&static=1&finish=graphite&accents=light-fasteners&strips=off&headset=off');
 await page.waitForFunction(()=>window.__ready===true,null,{timeout:180000});
 const result=await page.evaluate(async()=>{
  const THREE=await import('/node_modules/three/build/three.module.js');
  const summary=()=>{const m=window.scene.getObjectByName('SciFiHelmet');let count=0;m.traverse(o=>{if(o.isMesh)count++;});return {count,parts:window.assemblyParts.reduce((n,g)=>n+g.meshes.length,0),band:!!m.getObjectByName('HeadBand'),neck:!!m.getObjectByName('Neck'),body:window.presentationOptions.body};};
  const sequence=[summary()];
  Object.assign(window.presentationOptions,{headset:'on'});window.rebuild();sequence.push(summary());
  Object.assign(window.presentationOptions,{body:'shoulders'});window.rebuild();sequence.push(summary());
  Object.assign(window.presentationOptions,{headset:'off'});window.rebuild();sequence.push(summary());
  Object.assign(window.presentationOptions,{exploded:1});window.rebuild();window.setCameraView('assembly');window.renderFrame();sequence.push(summary());
  const frames={};
  for(const view of ['assembly','front','left','back','right']) {window.setCameraView(view);window.renderFrame();let maxX=0,maxY=0;
   window.scene.getObjectByName('SciFiHelmet').traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld).project(window.camera);maxX=Math.max(maxX,Math.abs(v.x));maxY=Math.max(maxY,Math.abs(v.y));}});frames[view]={maxX,maxY};
  }
  window.setCameraView('assembly');window.renderFrame();
  const leader=document.querySelector('#assembly-labels svg path');window.renderFrame();const leadersReused=leader===document.querySelector('#assembly-labels svg path');
  const labels=[...document.querySelectorAll('.assembly-label')].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};});
  const overlaps=labels.some((a,i)=>labels.slice(i+1).some(b=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y));
  const clipped=labels.some(r=>r.x<0||r.y<0||r.x+r.w>innerWidth||r.y+r.h>innerHeight);
  window.setMaskMode(true);window.renderFrame();const hidden=document.querySelector('#assembly-labels').hidden;
  window.setMaskMode(false);window.renderFrame();const shown=!document.querySelector('#assembly-labels').hidden;
  const {resetParams}=await import('/src/params.js');resetParams();window.rebuild();sequence.push(summary());
  Object.assign(window.presentationOptions,{body:'none',exploded:0,headset:'off'});window.rebuild();sequence.push(summary());
  return {frames,sequence,overlaps,clipped,hidden,shown,leadersReused,labels:labels.length,retainedStrips:window.helmetParams.foreheadPlates.enabled};
 });
 assert.ok(Object.values(result.frames).every(f=>f.maxX<.94&&f.maxY<.94),JSON.stringify(result.frames));
 assert.deepEqual(result.sequence.map(x=>x.count),[62,102,127,87,87,87,62]);
 assert.ok(result.sequence.every(x=>x.parts===x.count));assert.equal(result.overlaps,false);assert.equal(result.clipped,false);
 assert.equal(result.leadersReused,true);assert.equal(result.hidden,true);assert.equal(result.shown,true);assert.equal(result.retainedStrips,false);assert.deepEqual(errors,[]);
 console.log(JSON.stringify(result,null,2));console.log('Browser mode switches, reset, label bounds and mask exclusion: PASS');
}finally{await browser?.close();await server.close();}
