// What a skin recipe selects on (0.13 "Skins"): role, part, assembly and side of every mesh of a robot body or helmet.
// Bodies carry glTF extras asm/part/side and Ballon role materials MT_<role>_color (also bodies built elsewhere, e.g. in three.js,
// as long as they follow that convention). Helmets keep their own materials and part ids: roles come from
// robotHelmetColors.json (as for the colour schemes), part ids are mapped to the recipes' part names by skins.json › aliases.
import COLORS from './robotHelmetColors.json' with { type: 'json' };
import SKINS from './skins.json' with { type: 'json' };
import { assemblyInventory } from './assembly.js';

export const SKIN_RECIPES = SKINS;

const roleOfName = name => /^MT_(.+)_color$/.exec(name ?? '')?.[1] ?? null;

export function skinRole(material, kind, finish = 'original') {
  const own = roleOfName(material?.name);
  if (own || kind === 'body') return own;
  const entry = COLORS[kind]?.[material?.name];
  return (typeof entry === 'object' ? entry?.[finish] : entry) ?? null;
}

// Part ids of a helmet: Helm H by assembly inventory (H01–H21, F, P; exploded meshes carry partId), Scout by extras part_id.
function helmetIds(root, kind) {
  const ids = new Map();
  if (kind === 'critic') {
    const exploded = []; root.traverse(o => { if (o.isMesh && o.userData.partId) exploded.push(o); });
    if (exploded.length) for (const m of exploded) ids.set(m, m.userData.partId);
    else for (const e of assemblyInventory(root)) ids.set(e.mesh, e.id);
  } else if (kind === 'scout') root.traverse(o => {
    if (!o.isMesh) return;
    const id = o.userData.part_id ?? o.parent?.userData?.part_id;
    if (id) ids.set(o, id);
  });
  return ids;
}

// meshes: [{ mesh, key }] (skinAtlas.skinMeshes); kind 'body' | 'critic' | 'scout'; materials: optional Map mesh → material to
// judge instead of the current one (flat material of an aged mesh). Returns [{ role, part, asm, side }] in the same order.
export function describeSkinMeshes(meshes, kind, root, { materials = null, finish = root.userData?.finish ?? 'original' } = {}) {
  const ids = kind === 'body' ? null : helmetIds(root, kind), alias = SKINS.aliases[kind] ?? {};
  return meshes.map(({ mesh }) => {
    const material = materials?.get(mesh) ?? mesh.material, x = mesh.userData;
    const id = ids?.get(mesh);
    return { role: skinRole(Array.isArray(material) ? material[0] : material, kind, finish),
      part: x.part ?? (id ? alias[id] ?? id.toLowerCase() : mesh.name), asm: x.asm ?? 'head', side: x.side ?? null };
  });
}
