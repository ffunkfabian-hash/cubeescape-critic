# Scout v3 export: manifest (objects, vertex counts, part IDs) and GLB files (assembled, exploded) from the built scene.
# Loaded by run.py; parts and explosion offsets come from helm_explosion.py (TEILE, _gruppen), so the GLB and the
# exploded renders use the same grouping. Exported meshes carry extras: part_id, part_label, side, source_object.
import os, json, math, hashlib
import bpy
from mathutils import Vector

_EXPL = {}
exec(open(os.path.join(os.environ['SCOUT_DIR'], 'helm_explosion.py')).read(), _EXPL)


def _rest_pose():
    """Frame 1 with the turntable action detached and HELM_ROOT unrotated; returns a restore function."""
    sc = bpy.context.scene; sc.frame_set(1); root = bpy.data.objects['HELM_ROOT']
    ad = root.animation_data.action if root.animation_data else None
    if ad: root.animation_data.action = None
    rz = root.rotation_euler[2]; root.rotation_euler[2] = 0; bpy.context.view_layer.update()
    def restore():
        root.rotation_euler[2] = rz
        if ad: root.animation_data.action = ad
        sc.frame_set(1)
    return restore


def _parts():
    """[(part_id, label, side, [objects], offset)] in TEILE order; label e.g. 'S07 Kieferstück R'."""
    out = []
    for label, objs, off in _EXPL['_gruppen']():
        pid = label.split()[0]; side = label.split()[-1] if label.split()[-1] in ('R', 'L') else ''
        out.append((pid, label, side, sorted(objs, key=lambda o: o.name), off))
    return out


def manifest():
    restore = _rest_pose(); dg = bpy.context.evaluated_depsgraph_get(); objs = []
    try:
        for pid, label, side, group, _ in _parts():
            for o in group:
                me = o.evaluated_get(dg).to_mesh()
                co = [o.matrix_world @ v.co for v in me.vertices]
                lo = [round(min(c[i] for c in co), 4) for i in range(3)] if co else []
                hi = [round(max(c[i] for c in co), 4) for i in range(3)] if co else []
                objs.append({'name': o.name, 'part': label, 'verts': len(me.vertices), 'faces': len(me.polygons),
                             'bbox': [lo, hi]})
                o.evaluated_get(dg).to_mesh_clear()
    finally:
        restore()
    return {'objects': objs, 'count': len(objs), 'verts': sum(o['verts'] for o in objs)}


def _scalar(sock, fallback=0.6):
    """Representative value of a float socket that may be driven by a procedural chain (Map Range / Mix)."""
    if not sock.is_linked: return float(sock.default_value)
    n = sock.links[0].from_node
    if n.type == 'MAP_RANGE': return (n.inputs['To Min'].default_value + n.inputs['To Max'].default_value) / 2
    vals = [float(i.default_value) for i in n.inputs if i.name in ('A', 'B') and i.type == 'VALUE' and i.enabled and not i.is_linked]
    return sum(vals) / len(vals) if vals else fallback


_GLB_MATS = {}

def _glb_material(m):
    """Flat glTF stand-in: the procedural base colour (noise, dirt, wear) does not survive glTF, so use the material's
    viewport colour (diffuse_color, set by the generator to the mean colour) and representative roughness/metallic."""
    if m is None: return None
    if m.name in _GLB_MATS: return _GLB_MATS[m.name]
    bs = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None) if m.node_tree else None
    g = bpy.data.materials.new(m.name + '_glb'); g.use_nodes = True; g.diffuse_color = m.diffuse_color   # Blender ≥ 4 (Emission Color)
    gb = g.node_tree.nodes.get('Principled BSDF')
    gb.inputs['Base Color'].default_value = m.diffuse_color
    if bs:
        gb.inputs['Roughness'].default_value = _scalar(bs.inputs['Roughness'])
        gb.inputs['Metallic'].default_value = _scalar(bs.inputs['Metallic'], 0.0)
        for k in ('Emission Color', 'Emission Strength'):
            s = bs.inputs[k]
            if not s.is_linked: gb.inputs[k].default_value = s.default_value
    _GLB_MATS[m.name] = g
    return g


def _bake_collection(name, exploded):
    """Evaluated mesh copies of every part (world transform baked into the object matrix) in a temporary collection."""
    dg = bpy.context.evaluated_depsgraph_get()
    col = bpy.data.collections.new(name); bpy.context.scene.collection.children.link(col)
    for pid, label, side, group, off in _parts():
        for o in group:
            me = bpy.data.meshes.new_from_object(o.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg)
            for i, m in enumerate(me.materials): me.materials[i] = _glb_material(m)
            c = bpy.data.objects.new(o.name, me); c.matrix_world = o.matrix_world.copy()
            if exploded: c.matrix_world.translation += off
            c['part_id'] = pid; c['part_label'] = label; c['side'] = side; c['source_object'] = o.name
            col.objects.link(c)
    return col


def _export_glb(col, path):
    vl = bpy.context.view_layer
    for o in vl.objects: o.select_set(False)
    for o in col.objects: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_extras=True,
                              export_apply=True, export_yup=True, export_cameras=False, export_lights=False)


def _drop(col):
    for o in list(col.objects):
        me = o.data; bpy.data.objects.remove(o, do_unlink=True)
        if me and me.users == 0: bpy.data.meshes.remove(me)
    bpy.data.collections.remove(col)


def _sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


def export_all(out_dir):
    """assembled/scout.glb, exploded/scout_exploded.glb, parts.json and manifest.json in out_dir."""
    restore = _rest_pose(); res = {}
    try:
        for sub, fn, ex in (('assembled', 'scout.glb', False), ('exploded', 'scout_exploded.glb', True)):
            os.makedirs(os.path.join(out_dir, sub), exist_ok=True); p = os.path.join(out_dir, sub, fn)
            col = _bake_collection('SCOUT_EXPORT', ex)
            try: _export_glb(col, p)
            finally: _drop(col)
            res[f'{sub}/{fn}'] = {'bytes': os.path.getsize(p), 'sha256': _sha(p)}
        parts = []
        for pid, label, side, group, off in _parts():
            parts.append({'id': pid, 'label': label, 'side': side, 'objects': [o.name for o in group],
                          'exploded_offset': [round(v, 4) for v in off]})
        json.dump({'units': 'Blender units, helmet height H = 1.0 (≈ 30 cm); glTF Y up, front = +Z',
                   'side_rule': 'R = +X in helmet space (right in the front view); object names are not reliable for the side',
                   'parts': parts}, open(os.path.join(out_dir, 'parts.json'), 'w'), indent=1, ensure_ascii=False)
    finally:
        restore()
    for g in _GLB_MATS.values(): bpy.data.materials.remove(g)
    _GLB_MATS.clear()
    json.dump(manifest(), open(os.path.join(out_dir, 'manifest.json'), 'w'), indent=1, ensure_ascii=False)
    res['parts'] = len(parts)
    return res
