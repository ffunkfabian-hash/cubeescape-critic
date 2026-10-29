// Fusion 0.12: a chosen helmet replaces the study helmet in the robot's head segment, fitted to its box; the neck stays.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { HELMETS, HELMET_COLORS, CRITIC_VARIANTS, COLOR_SCHEMES, NECK_PARTS, boxIn, dressBody, fitHelmet, helmetShellBox, matchRobotColors, paletteMaterials, schemePalette, setRobotHelmet } from '../src/robotHelmet.js';
import { FINISH_PRESETS, ACCENT_PRESETS } from '../src/finishPresets.js';
import { wearMaterial } from '../src/robotWear.js';

const rolesOf = kind => Object.entries(HELMET_COLORS[kind]).flatMap(([, e]) => typeof e === 'object' ? Object.values(e) : [e]);

const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-6, `${msg}: ${a} vs ${b}`);

// Minimal robot like loadRobot: model → inner (fit scale) → SEG_head (head frame) → study meshes with asm/part.
function robot() {
  const mesh = (part, w, h, y) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), new THREE.MeshStandardMaterial());
    m.position.y = y; m.userData = { asm: 'head', part };
    return m;
  };
  const seg = new THREE.Group(); seg.name = 'SEG_head'; seg.position.set(0.02, 1.44, -0.03); seg.rotation.y = 0.3;
  seg.add(mesh('neck', 0.09, 0.1, 0.01), mesh('neck_ring', 0.1, 0.012, 0.008), mesh('neck_trim', 0.1, 0.003, 0.017),
    mesh('cap', 0.2, 0.22, 0.15), mesh('mask', 0.18, 0.1, 0.12), mesh('antenna', 0.005, 0.5, 0.4));
  const inner = new THREE.Group(); inner.scale.setScalar(3.18); inner.add(seg);
  const model = new THREE.Group(); model.add(inner);
  return { model, seg };
}
// Helmet in the Critic frame: shell 0.8 high from the chin (−0.41), an antenna group above.
function helmet() {
  const h = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.9), new THREE.MeshStandardMaterial()); shell.position.y = -0.01; shell.name = 'Crown';
  const ant = new THREE.Group(); ant.name = 'Antenna_B';
  const rod = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.4, 0.02), new THREE.MeshStandardMaterial()); rod.position.y = 0.6; ant.add(rod);
  h.add(shell, ant);
  return h;
}

test('fitHelmet: equal height, bottom and x/z centre after the half turn', () => {
  const study = new THREE.Box3(new THREE.Vector3(-0.1, 0.04, -0.12), new THREE.Vector3(0.1, 0.26, 0.1));
  const shell = new THREE.Box3(new THREE.Vector3(-0.4, -0.41, -0.45), new THREE.Vector3(0.4, 0.39, 0.52));
  const { scale, position } = fitHelmet(study, shell);
  near(scale, 0.22 / 0.8, 'scale');
  const placed = shell.clone().applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(...position),
    new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI), new THREE.Vector3(scale, scale, scale)));
  near(placed.min.y, study.min.y, 'bottom'); near(placed.max.y, study.max.y, 'top');
  const pc = placed.getCenter(new THREE.Vector3()), sc = study.getCenter(new THREE.Vector3());
  near(pc.x, sc.x, 'x'); near(pc.z, sc.z, 'z');
});

test('helmetShellBox leaves antennas out', () => {
  const box = helmetShellBox(helmet());
  near(box.max.y, 0.39, 'shell top'); near(box.min.y, -0.41, 'chin');
});

test('setRobotHelmet: helmet in the head segment on the study box, study helmet hidden, neck kept, lossless switch back', () => {
  const { model, seg } = robot();
  const studyShell = boxIn(seg, seg, o => !NECK_PARTS.includes(o.userData.part) && o.userData.part !== 'antenna');
  const h = helmet();
  const fit = setRobotHelmet(model, 'critic', h);
  assert.ok(fit && fit.scale > 0);
  const holder = seg.children.find(c => c.userData.robotHelmet === 'critic');
  assert.ok(holder && h.parent === holder, 'helmet hangs in SEG_head');
  near(holder.rotation.y, Math.PI, 'half turn: Critic front +Z to the face −Z');
  const placed = boxIn(seg, h, o => o.name === 'Crown');
  near(placed.min.y, studyShell.min.y, 'bottom'); near(placed.max.y, studyShell.max.y, 'top');
  for (const o of seg.children.filter(c => c.isMesh)) assert.equal(o.visible, NECK_PARTS.includes(o.userData.part), o.userData.part);
  h.traverse(o => { if (o.isMesh) assert.deepEqual([o.userData.asm, o.userData.helmet], ['head', 'critic']); });
  assert.equal(model.userData.helmet, 'critic');
  setRobotHelmet(model, 'scout', helmet());
  assert.equal(seg.children.filter(c => c.userData.robotHelmet).length, 1, 'previous helmet removed');
  setRobotHelmet(model, 'study', null);
  assert.equal(seg.children.filter(c => c.userData.robotHelmet).length, 0);
  for (const o of seg.children) assert.ok(o.visible, `${o.userData.part} visible again`);
  assert.equal(model.userData.helmet, 'study');
});

test('helmet choices and the robot GLBs: SEG_head exists with the neck parts in every study', () => {
  assert.deepEqual(Object.keys(HELMETS), ['study', 'critic', 'scout']);
  for (const name of ['waechter', 'paladin', 'mechanik']) {
    const parts = JSON.parse(readFileSync(new URL(`../../assets/robot-bodies/${name}/parts.json`, import.meta.url)));
    const head = parts.assemblies.find(a => a.id === 'head').parts.map(p => p.part);
    for (const n of NECK_PARTS) assert.ok(head.includes(n), `${name}: ${n}`);
    const buf = readFileSync(new URL(`../../assets/robot-bodies/${name}/assembled/${name}.glb`, import.meta.url));
    const json = JSON.parse(buf.toString('utf8', 20, 20 + buf.readUInt32LE(12)));
    assert.ok(json.scenes[0].nodes.some(i => json.nodes[i].name === 'SEG_head'), `${name}: SEG_head is a root`);
  }
});

test('robot colours: listed helmet materials take the robot role material (shared), others stay; original keeps all', () => {
  const roles = new Map(['shell', 'anodized', 'dark_metal', 'rubber', 'trim', 'reticle_cyan'].map(r => [r, new THREE.MeshStandardMaterial({ name: `MT_${r}_color` })]));
  const make = () => {
    const h = helmet();
    h.children[0].material.name = 'whiteArmor';
    h.children[1].children[0].material.name = 'darkMetal';
    const extra = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshStandardMaterial({ name: 'unlisted' })); h.add(extra);
    return h;
  };
  const { model } = robot(); model.userData.roleMaterials = roles;
  const h = make(); setRobotHelmet(model, 'critic', h);
  assert.equal(h.children[0].material, roles.get('shell'));
  assert.equal(h.children[1].children[0].material, roles.get('dark_metal'));
  assert.equal(h.children[2].material.name, 'unlisted');
  const o = make(); setRobotHelmet(model, 'critic', o, 'original');
  assert.equal(o.children[0].material.name, 'whiteArmor');
  for (const kind of ['critic', 'scout']) for (const role of rolesOf(kind))
    assert.ok(['shell', 'anodized', 'graphite', 'dark_metal', 'rubber', 'trim', 'reticle_cyan', 'accent', 'energy'].includes(role), `${kind}: ${role}`);
  // every mapped role exists in all three robot GLBs
  for (const name of ['waechter', 'paladin', 'mechanik']) {
    const buf = readFileSync(new URL(`../../assets/robot-bodies/${name}/assembled/${name}.glb`, import.meta.url));
    const mats = JSON.parse(buf.toString('utf8', 20, 20 + buf.readUInt32LE(12))).materials.map(m => m.name);
    for (const kind of ['critic', 'scout']) for (const role of new Set(rolesOf(kind)))
      assert.ok(mats.includes(`MT_${role}_color`), `${name}: MT_${role}_color`);
  }
});

test('study GLBs: the face of every study looks along −Z in SEG_head (the half turn of the helmet holder)', () => {
  for (const name of ['waechter', 'paladin', 'mechanik']) {
    const buf = readFileSync(new URL(`../../assets/robot-bodies/${name}/assembled/${name}.glb`, import.meta.url));
    const json = JSON.parse(buf.toString('utf8', 20, 20 + buf.readUInt32LE(12)));
    const seg = json.nodes.find(n => n.name === 'SEG_head');
    const centre = part => {
      const node = seg.children.map(i => json.nodes[i]).find(n => n.extras?.part === part);
      assert.ok(node && !node.translation && !node.rotation, `${name}: ${part} directly in SEG_head without own transform`);
      const acc = json.accessors[json.meshes[node.mesh].primitives[0].attributes.POSITION];
      return acc.min.map((v, i) => (v + acc.max[i]) / 2);
    };
    const face = centre('mask'), back = centre('shell');
    assert.ok(face[2] < 0, `${name}: mask z ${face[2]}`);
    assert.ok(face[2] < back[2], `${name}: mask in front of the shell`);
  }
});

test('helmet H variants 80–88: valid finish/accents/strips; in a colour scheme the dark armour follows the finish', () => {
  const v = CRITIC_VARIANTS.variants;
  assert.deepEqual(Object.keys(v), ['80', '81', '82', '83', '84', '85', '86', '87', '88']);
  assert.ok(v[CRITIC_VARIANTS.default]);
  for (const [id, x] of Object.entries(v)) assert.ok(FINISH_PRESETS[x.finish] && ACCENT_PRESETS[x.accents] && ['on', 'off'].includes(x.strips), id);
  assert.deepEqual([v['87'].strips, v['88'].strips, v['83'].accents, v['86'].accents], ['off', 'off', 'white-strips', 'contrast-strips']);
  const armour = finish => {
    const h = new THREE.Group(); h.userData.finish = finish;
    h.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ name: 'darkArmor' })));
    matchRobotColors(h, 'critic', paletteMaterials());
    return h.children[0].material.name;
  };
  assert.deepEqual(['original', 'metal', 'graphite'].map(armour), ['MT_anodized_color', 'MT_dark_metal_color', 'MT_graphite_color']);
});

test('Farbschema 1 equals the role materials of all three body GLBs (colour, metalness, roughness, emission)', () => {
  const pal = paletteMaterials();
  for (const name of ['waechter', 'paladin', 'mechanik']) {
    const buf = readFileSync(new URL(`../../assets/robot-bodies/${name}/assembled/${name}.glb`, import.meta.url));
    const mats = JSON.parse(buf.toString('utf8', 20, 20 + buf.readUInt32LE(12))).materials;
    for (const g of mats) {
      const m = pal.get(/^MT_(.+)_color$/.exec(g.name)[1]), p = g.pbrMetallicRoughness;
      assert.ok(m, `${name}: ${g.name} in the palette`);
      const lin = m.color; // three keeps colours in linear working space
      p.baseColorFactor.slice(0, 3).forEach((c, i) => assert.ok(Math.abs(c - [lin.r, lin.g, lin.b][i]) < 1e-3, `${name} ${g.name} colour`));
      assert.ok(Math.abs((p.metallicFactor ?? 1) - m.metalness) < 1e-3 && Math.abs((p.roughnessFactor ?? 1) - m.roughness) < 1e-3, `${name} ${g.name} pbr`);
      if (g.emissiveFactor) g.emissiveFactor.forEach((c, i) => assert.ok(Math.abs(c - [m.emissive.r, m.emissive.g, m.emissive.b][i]) < 1e-3, `${name} ${g.name} emissive`));
    }
  }
});

test('Farbschema 2: every body role takes helmet H\'s original material values; dressBody switches body meshes and back', () => {
  assert.deepEqual(Object.keys(COLOR_SCHEMES), ['body', 'helmet', 'original']);
  // stand-in for createMaterials('original','original'): the helmet materials named in scheme2
  const src = Object.fromEntries([...new Set(Object.entries(HELMET_COLORS.scheme2).filter(([k]) => k !== 'note').map(([, n]) => n))]
    .map((n, i) => [n, new THREE.MeshStandardMaterial({ name: n, color: new THREE.Color(i / 10, 0.5, 0.2), roughness: 0.1 * i, metalness: 0.05 * i,
      emissive: n === 'visorGlow' ? new THREE.Color(0.3, 0.9, 0.8) : new THREE.Color(0, 0, 0), emissiveIntensity: n === 'visorGlow' ? 1.2 : 1 })]));
  const pal = schemePalette(src);
  for (const role of ['shell', 'anodized', 'graphite', 'dark_metal', 'rubber', 'trim', 'accent', 'reticle_cyan', 'energy']) {
    const m = pal.get(role), s = src[HELMET_COLORS.scheme2[role]];
    assert.equal(m.name, `MT_${role}_color`, 'role name kept for the wear shader');
    assert.ok(m.color.equals(s.color) && m.roughness === s.roughness && m.metalness === s.metalness, role);
    assert.ok(!m.map, `${role}: no helmet textures on the bodies`);
  }
  assert.ok(pal.get('energy').emissive.equals(src.visorGlow.emissive) && pal.get('energy').emissiveIntensity === 1.2);
  assert.throws(() => schemePalette({}), /missing/);
  assert.ok(!('keepColor' in pal.get('graphite').userData), 'viewer flag not in userData (glTF extras)');
  // aged in Farbschema 2, graphite and rubber keep the helmet's colour (no Ballon aaa colour swapped in)
  for (const role of ['graphite', 'rubber']) {
    const aged = wearMaterial(pal.get(role), role, 3);
    assert.ok(aged.color.equals(pal.get(role).color), `${role}: aged colour = scheme colour`);
  }
  assert.ok(!wearMaterial(new THREE.MeshStandardMaterial({ name: 'MT_graphite_color', color: 0xffffff }), 'graphite', 3).color.equals(new THREE.Color(0xffffff)), 'body palette: Ballon aaa colour');
  // dressBody: body meshes by role, helmet meshes untouched, back to the GLB materials
  const glb = new Map(['shell', 'rubber'].map(r => [r, new THREE.MeshStandardMaterial({ name: `MT_${r}_color` })]));
  const body = new THREE.Mesh(new THREE.BoxGeometry(), glb.get('shell')), cable = new THREE.Mesh(new THREE.BoxGeometry(), glb.get('rubber'));
  const helm = new THREE.Mesh(new THREE.BoxGeometry(), glb.get('shell')); helm.userData.helmet = 'critic';
  const robot = new THREE.Group(); robot.add(body, cable, helm);
  dressBody(robot, pal);
  assert.deepEqual([body.material, cable.material, helm.material], [pal.get('shell'), pal.get('rubber'), glb.get('shell')]);
  dressBody(robot, glb);
  assert.deepEqual([body.material, cable.material], [glb.get('shell'), glb.get('rubber')]);
});
