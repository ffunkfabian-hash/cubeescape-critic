// Procedural robot from the model sheet: every part is the intersection of its front, side (and top) silhouette
// with a rounded super-ellipsoid; the sheet drawing is projected onto it from the views that show this part.
import * as THREE from 'three';
import sheet from './sheet.json';
import { brush, csg, prism, superEllipsoid, INTERSECTION } from '../geo.js';

const VIEW_ORDER = ['front', 'back', 'right', 'left', 'top'];

// Projection material: diffuse colour from the sheet, blended over the views by how squarely each looks at the
// surface, and only where the label map assigns the sheet pixel to this part.
export function sheetMaterial(maps, partId, base = 0xd8dde2) {
  // Unlit base with a soft key/fill term: keeps the sheet's own toon colours, adds just enough form shading.
  const mat = new THREE.MeshBasicMaterial({ color: base });
  const [W, H] = sheet.size;
  const views = VIEW_ORDER.map((k) => sheet.views[k]);
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.sheetMap = { value: maps.color };
    sh.uniforms.labelMap = { value: maps.label };
    sh.uniforms.partId = { value: partId };
    sh.uniforms.vO = { value: views.map((v) => new THREE.Vector2(v.ox / W, v.oy / H)) };
    sh.uniforms.vU = { value: views.map((v) => new THREE.Vector3(...v.U).multiplyScalar(sheet.scale / W)) };
    sh.uniforms.vV = { value: views.map((v) => new THREE.Vector3(...v.V).multiplyScalar(sheet.scale / H)) };
    sh.uniforms.vD = { value: views.map((v) => new THREE.Vector3(...v.D)) };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vModelPos;\nvarying vec3 vModelNormal;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvModelPos = position;\nvModelNormal = normal;');
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec3 vModelPos;
varying vec3 vModelNormal;
uniform sampler2D sheetMap;
uniform sampler2D labelMap;
uniform float partId;
uniform vec2 vO[5];
uniform vec3 vU[5];
uniform vec3 vV[5];
uniform vec3 vD[5];`,
      )
      .replace(
        '#include <map_fragment>',
        `{
  vec3 n = normalize(vModelNormal);
  vec3 acc = vec3(0.0);
  float wsum = 0.0;
  for (int k = 0; k < 5; k++) {
    float w = pow(max(dot(n, vD[k]), 0.0), 3.0);
    if (w < 1e-3) continue;
    vec2 uv = vec2(vO[k].x + dot(vModelPos, vU[k]), 1.0 - (vO[k].y - dot(vModelPos, vV[k])));
    float id = texture2D(labelMap, uv).r * 255.0;
    if (abs(id - partId) > 0.5) continue;
    acc += w * texture2D(sheetMap, uv).rgb;
    wsum += w;
  }
  if (wsum > 1e-3) diffuseColor.rgb = acc / wsum;
  float key = max(dot(n, normalize(vec3(-0.45, 0.6, 0.65))), 0.0);
  diffuseColor.rgb *= 0.8 + 0.28 * key;
}`,
      );
  };
  mat.customProgramCacheKey = () => 'sheet-projection';
  return mat;
}

// Inverted-hull toon outline.
export function outlineOf(mesh, width = 0.0035) {
  const mat = new THREE.MeshBasicMaterial({ color: 0x050608, side: THREE.BackSide });
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>\ntransformed += normalize(normal) * ${width.toFixed(4)};`);
  };
  const o = new THREE.Mesh(mesh.geometry, mat);
  o.name = mesh.name + '_Outline';
  return o;
}

function bbox(pts) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
}

export function buildPart(def, maps) {
  const [fx0, fx1, fy0, fy1] = bbox(def.front);
  const [sz0, sz1] = bbox(def.side);
  const cx = (fx0 + fx1) / 2, cy = (fy0 + fy1) / 2, cz = (sz0 + sz1) / 2;
  const r = [(fx1 - fx0) / 2 * 1.08, (fy1 - fy0) / 2 * 1.08, (sz1 - sz0) / 2 * 1.08];
  let b = csg(
    brush(superEllipsoid(...r, def.round[0], def.round[1], 64, 48), { pos: [cx, cy, cz] }),
    [INTERSECTION, brush(prism(def.front, 'xy', 3))],
    [INTERSECTION, brush(prism(def.side, 'zy', 3))],
  );
  if (def.top) b = csg(b, [INTERSECTION, brush(prism(def.top, 'xz', 3))]);
  const geo = b.geometry;
  geo.computeBoundingSphere();
  const mesh = new THREE.Mesh(geo, sheetMaterial(maps, def.id));
  mesh.name = def.name;
  return mesh;
}

export async function buildRobot() {
  const loader = new THREE.TextureLoader();
  const [color, label] = await Promise.all([loader.loadAsync('/robot/sheet.png'), loader.loadAsync('/robot/sheet_label.png')]);
  color.colorSpace = THREE.SRGBColorSpace;
  color.anisotropy = 8;
  label.minFilter = label.magFilter = THREE.NearestFilter;
  label.generateMipmaps = false;
  const maps = { color, label };
  const model = new THREE.Group();
  model.name = 'SciFiRobot';
  for (const def of sheet.parts) {
    const mesh = buildPart(def, maps);
    model.add(mesh, outlineOf(mesh));
  }
  return model;
}
