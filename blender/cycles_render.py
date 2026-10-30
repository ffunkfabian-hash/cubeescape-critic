"""Optional Cycles render of an exported GLB (0.18 "Prefab"): presentation stills, turntable frames, templates for critic rounds.

Blender builds no geometry any more: bodies and Scout come from the three.js generator as GLB (web/tools/robotgen_export.mjs,
assets/robot-bodies-three/, assets/helmet-scout-three/). This script only reads such a GLB into an empty scene, frames it with a
fixed camera and a three-point light, and renders with Cycles. Materials are the flat ones of the GLB (no skins; those live in the
viewer). Not part of any check; run it under the GPU lock:

    ./ce lock gpu -- blender -b --factory-startup -P blender/cycles_render.py -- \
        --glb assets/robot-bodies-three/paladin/assembled/paladin.glb --out runs/cycles/paladin [--views front,left,back,right,three_quarter]
        [--turntable 72] [--samples 64] [--size 1024] [--device auto|cpu]

Writes <out>/<view>.png per view, or with --turntable N the frames <out>/turntable_000.png … (camera on a circle, the light rig
turns with it as in the viewer, docs/LESSONS.md). glTF axes (Y up, front +Z) arrive in Blender as Z up, front −Y.
"""
import argparse
import math
import os
import sys

import bpy
from mathutils import Vector

VIEWS = {'front': 0.0, 'left': 90.0, 'back': 180.0, 'right': 270.0, 'three_quarter': 35.0}   # camera angle around Z, front = −Y


def args():
    p = argparse.ArgumentParser(prog='cycles_render.py')
    p.add_argument('--glb', required=True)
    p.add_argument('--out', required=True)
    p.add_argument('--views', default='front,left,back,right,three_quarter')
    p.add_argument('--turntable', type=int, default=0, help='frames of a full turn instead of --views')
    p.add_argument('--samples', type=int, default=64)
    p.add_argument('--size', type=int, default=1024)
    p.add_argument('--device', choices=['auto', 'cpu'], default='auto')
    return p.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])


def scene_setup(o):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.samples = o.samples
    sc.cycles.use_denoising = True
    sc.render.resolution_x = sc.render.resolution_y = o.size
    sc.render.film_transparent = False
    sc.view_settings.view_transform = 'AgX'
    if o.device == 'auto':
        prefs = bpy.context.preferences.addons['cycles'].preferences
        for kind in ('METAL', 'OPTIX', 'CUDA', 'HIP'):
            try:
                prefs.compute_device_type = kind
            except TypeError:
                continue
            prefs.get_devices()
            if any(d.type == kind for d in prefs.devices):
                for d in prefs.devices:
                    d.use = d.type == kind
                sc.cycles.device = 'GPU'
                break
    world = bpy.data.worlds.new('studio')
    world.use_nodes = True
    bg = world.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (0.06, 0.065, 0.075, 1.0)
    bg.inputs['Strength'].default_value = 0.6
    sc.world = world
    return sc


def import_glb(path):
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(path))
    meshes = [ob for ob in bpy.context.scene.objects if ob.type == 'MESH']
    if not meshes:
        raise SystemExit(f'cycles_render: no meshes in {path}')
    lo = Vector((math.inf,) * 3)
    hi = Vector((-math.inf,) * 3)
    for ob in meshes:
        for c in ob.bound_box:
            w = ob.matrix_world @ Vector(c)
            lo = Vector(map(min, lo, w))
            hi = Vector(map(max, hi, w))
    return meshes, (lo + hi) / 2, hi - lo


def rig(sc, centre, size):
    """Camera and three area lights under one empty that turns around the model's vertical axis."""
    pivot = bpy.data.objects.new('rig', None)
    pivot.location = centre
    sc.collection.objects.link(pivot)
    cam_data = bpy.data.cameras.new('camera')
    cam_data.lens = 85
    cam = bpy.data.objects.new('camera', cam_data)
    sc.collection.objects.link(cam)
    sc.camera = cam
    fov = 2 * math.atan(cam_data.sensor_width / (2 * cam_data.lens))
    dist = 0.62 * max(size.z, size.x, size.y) / math.tan(fov / 2)
    cam.parent = pivot
    cam.location = (0, -dist, 0.08 * size.z)
    track = cam.constraints.new('TRACK_TO')
    track.target = pivot
    for name, loc, power, scale in (('key', (-0.8, -1.0, 0.7), 900, 1.0), ('fill', (1.0, -0.6, 0.2), 300, 1.4), ('rim', (0.3, 1.0, 0.9), 700, 0.8)):
        light = bpy.data.lights.new(name, 'AREA')
        light.energy = power * (dist / 4) ** 2
        light.size = scale * max(size.x, size.z)
        ob = bpy.data.objects.new(name, light)
        sc.collection.objects.link(ob)
        ob.parent = pivot
        ob.location = Vector(loc) * dist
        c = ob.constraints.new('TRACK_TO')
        c.target = pivot
    return pivot


def render(sc, path):
    sc.render.filepath = os.path.abspath(path)
    bpy.ops.render.render(write_still=True)
    print(f'[cycles_render] {path}')


def main():
    o = args()
    os.makedirs(o.out, exist_ok=True)
    sc = scene_setup(o)
    _, centre, size = import_glb(o.glb)
    pivot = rig(sc, centre, size)
    if o.turntable:
        for k in range(o.turntable):
            pivot.rotation_euler = (0, 0, 2 * math.pi * k / o.turntable)
            render(sc, os.path.join(o.out, f'turntable_{k:03d}.png'))
        return
    for view in o.views.split(','):
        if view not in VIEWS:
            raise SystemExit(f'cycles_render: unknown view {view} ({", ".join(VIEWS)})')
        pivot.rotation_euler = (0, 0, math.radians(VIEWS[view]))
        render(sc, os.path.join(o.out, f'{view}.png'))


main()
