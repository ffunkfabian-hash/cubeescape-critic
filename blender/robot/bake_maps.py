"""Skin maps of a robot body (0.13 "Skins"): bakes the geometry of the delivered GLB into its UV template once, so skins can be
mixed from these maps in seconds (blender/robot/skin_compose.py) instead of baking a material per skin (about an hour at 4096²).

Reads assets/robot-bodies/<name>/assembled/<name>.glb (UV template from export_robot.py) and writes to --out:

  geometry.npz   position (world metres, glTF axes: Y up, front +Z) and shading normal per texel (float16, size²×3),
                 object index (uint16, 0 = no surface; 1… = mesh objects sorted by name) and role index (uint8)
  ao.png         ambient occlusion (8 bit, --ao-size², distance --ao-distance m), for dirt in cavities
  maps.json      size, objects (index → name, asm, part, side), roles (index → name)

Emission bakes with one sample and no margin (texel centres, so ids stay exact); AO with margin. Run headless, GPU lock:

  blender -b --factory-startup -P blender/robot/bake_maps.py -- --glb assets/robot-bodies/waechter/assembled/waechter.glb --out runs/robot/maps/waechter
"""
import json
import os
import sys
import time

import bpy
import numpy as np


def args():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    o = dict(glb=None, out=None, size='4096', ao_size='2048', ao_samples='32', ao_distance='0.015', device='GPU')
    for k in o:
        flag = '--' + k.replace('_', '-')
        if flag in a:
            o[k] = a[a.index(flag) + 1]
    if not o['glb'] or not o['out']:
        sys.exit('bake_maps: --glb and --out required')
    o['glb'], o['out'] = os.path.abspath(o['glb']), os.path.abspath(o['out'])
    for k in ('size', 'ao_size', 'ao_samples'):
        o[k] = int(o[k])
    o['ao_distance'] = float(o['ao_distance'])
    return o


def log(msg, t0=[time.time()]):
    print(f'[bake_maps {time.time() - t0[0]:6.1f}s] {msg}', flush=True)


def role_of(material):
    """MT_<role>_color (export_robot.py, flat Ballon role materials) → role."""
    n = material.name
    return n[3:-6] if n.startswith('MT_') and n.endswith('_color') else n


def setup_device(sc, device):
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    if device == 'GPU':
        prefs = bpy.context.preferences.addons['cycles'].preferences
        prefs.compute_device_type = 'METAL'
        prefs.get_devices()
        for d in prefs.devices:
            d.use = d.type != 'CPU'
        if any(d.use for d in prefs.devices):
            sc.cycles.device = 'GPU'
    sc.cycles.use_denoising = False


def bake_target(materials, image, emission=None):
    """Active image node in every material; with emission(nodes, links) → socket, the surface emits that socket instead."""
    for m in materials:
        nt = m.node_tree
        N, L = nt.nodes, nt.links
        out = next((n for n in N if n.type == 'OUTPUT_MATERIAL'), None) or N.new('ShaderNodeOutputMaterial')
        for n in [n for n in N if n.get('bake_tmp')]:
            N.remove(n)
        if emission:
            em = N.new('ShaderNodeEmission')
            em['bake_tmp'] = True
            em.inputs['Strength'].default_value = 1.0
            L.new(emission(N, L), em.inputs['Color'])
            L.new(em.outputs['Emission'], out.inputs['Surface'])
        tex = N.new('ShaderNodeTexImage')
        tex['bake_tmp'] = True
        tex.image = image
        for n in N:
            n.select = False
        tex.select = True
        N.active = tex


def tmp(node):
    node['bake_tmp'] = True
    return node


def pixels(image, channels):
    a = np.empty(image.size[0] * image.size[1] * 4, dtype=np.float32)
    image.pixels.foreach_get(a)
    return a.reshape(image.size[1], image.size[0], 4)[::-1, :, :channels]  # Blender stores rows bottom-up


def main():
    o = args()
    os.makedirs(o['out'], exist_ok=True)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=o['glb'])
    obs = sorted((ob for ob in sc.objects if ob.type == 'MESH'), key=lambda ob: ob.name)
    materials = sorted({s.material for ob in obs for s in ob.material_slots if s.material}, key=lambda m: m.name)
    roles = sorted({role_of(m) for m in materials})
    for m in materials:
        m.pass_index = roles.index(role_of(m)) + 1
    meta_objects = [dict(name=ob.name, asm=ob.get('asm'), part=ob.get('part'), side=ob.get('side')) for ob in obs]
    # Cycles bakes object by object (scene sync each time, ≈ 3 min per pass for 400 objects): join them into one mesh and keep
    # the object index as a face attribute.
    for i, ob in enumerate(obs, 1):
        if ob.data.users > 1:
            ob.data = ob.data.copy()
        attr = ob.data.attributes.new('obj_id', 'FLOAT', 'FACE')
        attr.data.foreach_set('value', np.full(len(ob.data.polygons), float(i), dtype=np.float32))
    bpy.ops.object.select_all(action='DESELECT')
    for ob in obs:
        ob.select_set(True)
    bpy.context.view_layer.objects.active = obs[0]
    bpy.ops.object.join()
    log(f'{len(obs)} objects joined, roles {roles}')
    setup_device(sc, o['device'])

    # glTF import turns Y up into Blender Z up; maps keep glTF axes (x, z, −y) like the viewer.
    def position(N, L):
        g, s, c = tmp(N.new('ShaderNodeNewGeometry')), tmp(N.new('ShaderNodeSeparateXYZ')), tmp(N.new('ShaderNodeCombineXYZ'))
        neg = tmp(N.new('ShaderNodeMath'))
        neg.operation = 'MULTIPLY'
        neg.inputs[1].default_value = -1.0
        L.new(g.outputs['Position'], s.inputs[0])
        L.new(s.outputs['X'], c.inputs['X'])
        L.new(s.outputs['Z'], c.inputs['Y'])
        L.new(s.outputs['Y'], neg.inputs[0])
        L.new(neg.outputs[0], c.inputs['Z'])
        return c.outputs[0]

    def normal(N, L):
        g, s, c = tmp(N.new('ShaderNodeNewGeometry')), tmp(N.new('ShaderNodeSeparateXYZ')), tmp(N.new('ShaderNodeCombineXYZ'))
        neg = tmp(N.new('ShaderNodeMath'))
        neg.operation = 'MULTIPLY'
        neg.inputs[1].default_value = -1.0
        L.new(g.outputs['Normal'], s.inputs[0])
        L.new(s.outputs['X'], c.inputs['X'])
        L.new(s.outputs['Z'], c.inputs['Y'])
        L.new(s.outputs['Y'], neg.inputs[0])
        L.new(neg.outputs[0], c.inputs['Z'])
        return c.outputs[0]

    def ids(N, L):
        info, c = tmp(N.new('ShaderNodeObjectInfo')), tmp(N.new('ShaderNodeCombineXYZ'))
        at = tmp(N.new('ShaderNodeAttribute'))
        at.attribute_type = 'GEOMETRY'
        at.attribute_name = 'obj_id'
        L.new(at.outputs['Fac'], c.inputs['X'])
        L.new(info.outputs['Material Index'], c.inputs['Y'])
        c.inputs['Z'].default_value = 1.0
        return c.outputs[0]

    sc.cycles.samples = 1
    sc.cycles.filter_width = 0.01  # texel centres only: no blending of ids across triangle borders
    maps = {}
    for key, fn in (('ids', ids), ('position', position), ('normal', normal)):
        img = bpy.data.images.new(f'bake_{key}', o['size'], o['size'], alpha=False, float_buffer=True)
        img.colorspace_settings.name = 'Non-Color'
        bake_target(materials, img, fn)
        bpy.ops.object.bake(type='EMIT', margin=0, use_clear=True)
        maps[key] = pixels(img, 3)
        bpy.data.images.remove(img)
        log(f'baked {key}')

    covered = maps['ids'][..., 2] > 0.5
    obj = np.where(covered, np.rint(maps['ids'][..., 0]), 0).astype(np.uint16)
    role = np.where(covered, np.rint(maps['ids'][..., 1]), 0).astype(np.uint8)
    np.savez_compressed(os.path.join(o['out'], 'geometry.npz'), position=maps['position'].astype(np.float16),
                        normal=maps['normal'].astype(np.float16), object=obj, role=role)
    log(f'coverage {covered.mean():.4f}')

    world = bpy.data.worlds.new('bake_world')
    sc.world = world
    world.light_settings.distance = o['ao_distance']
    sc.cycles.samples = o['ao_samples']
    sc.cycles.filter_width = 1.5
    ao = bpy.data.images.new('bake_ao', o['ao_size'], o['ao_size'], alpha=False)
    ao.colorspace_settings.name = 'Non-Color'
    bake_target(materials, ao)
    bpy.ops.object.bake(type='AO', margin=8, margin_type='EXTEND', use_clear=True)
    ao.filepath_raw = os.path.join(o['out'], 'ao.png')
    ao.file_format = 'PNG'
    ao.save()
    log('baked ao')

    meta = dict(glb=os.path.relpath(o['glb'], os.getcwd()), size=o['size'], ao_size=o['ao_size'], ao_samples=o['ao_samples'],
                ao_distance=o['ao_distance'], device=sc.cycles.device, blender=bpy.app.version_string, roles=['none', *roles],
                objects=['none', *meta_objects])
    json.dump(meta, open(os.path.join(o['out'], 'maps.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    log('done')


main()
