"""Skin template of a helmet (0.13 "Skins"): Helm H snapshot (web/tools/helmet_snapshot.mjs) or Scout GLB with the shared UV
template (uv_template.py) and flat role materials MT_<role>_color (roles from web/src/robotHelmetColors.json), so
blender/robot/bake_maps.py and skins.py treat it like a body. Geometry, node names and frame stay as in the source GLB.

  blender -b --factory-startup -P blender/robot/helmet_template.py -- --kind critic --glb runs/robot/helmets/critic_snapshot.glb \\
    --meters-per-unit 0.25 --out assets/helmet-skins/critic
Writes <out>/<kind>.glb and <out>/manifest.json (uv: surface in m², coverage, mm per pixel; meters_per_unit).
"""
import json
import math
import os
import sys

import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
from uv_template import UV_MARGIN, uv_template  # noqa: E402


def args():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    o = dict(kind=None, glb=None, out=None, meters_per_unit='1', variant='80')
    for k in o:
        flag = '--' + k.replace('_', '-')
        if flag in a:
            o[k] = a[a.index(flag) + 1]
    if not (o['kind'] and o['glb'] and o['out']):
        sys.exit('helmet_template: --kind, --glb and --out required')
    o['meters_per_unit'] = float(o['meters_per_unit'])
    return o


def main():
    o = args()
    colors = json.load(open(os.path.join(ROOT, 'web', 'src', 'robotHelmetColors.json'), encoding='utf-8'))[o['kind']]
    finish = None
    if o['kind'] == 'critic':
        finish = json.load(open(os.path.join(ROOT, 'web', 'src', 'criticHelmetVariants.json'), encoding='utf-8'))['variants'][o['variant']]['finish']
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(o['glb']))
    obs = sorted((ob for ob in bpy.context.scene.objects if ob.type == 'MESH'), key=lambda ob: ob.name)
    flat, unmapped = {}, set()
    for ob in obs:
        for slot in ob.material_slots:
            m = slot.material
            entry = colors.get(m.name) if m else None
            role = entry.get(finish) if isinstance(entry, dict) else entry
            if not role:
                unmapped.add(m.name if m else None)
                role = 'shell'
            if role not in flat:
                fm = bpy.data.materials.new(f'MT_{role}_color')
                fm.diffuse_color = m.diffuse_color if m else (0.8, 0.8, 0.8, 1)
                flat[role] = fm
            slot.material = flat[role]
    area, coverage = uv_template(obs, weld=True)
    area_m2 = area * o['meters_per_unit'] ** 2
    os.makedirs(o['out'], exist_ok=True)
    glb = os.path.join(o['out'], f"{o['kind']}.glb")
    bpy.ops.export_scene.gltf(filepath=glb, export_format='GLB', export_apply=True, export_extras=True, export_yup=True,
                              export_cameras=False, export_lights=False, export_animations=False)
    lo = [min((ob.matrix_world @ v.co)[i] for ob in obs for v in ob.data.vertices) for i in range(3)]
    hi = [max((ob.matrix_world @ v.co)[i] for ob in obs for v in ob.data.vertices) for i in range(3)]
    manifest = dict(kind=o['kind'], source=os.path.relpath(os.path.abspath(o['glb']), ROOT), variant=o['variant'] if finish else None,
                    finish=finish, meters_per_unit=o['meters_per_unit'], objects=len(obs), roles=sorted(flat),
                    unmapped_materials=sorted(n for n in unmapped if n), size_units=[round(h - l, 4) for l, h in zip(lo, hi)],
                    uv=dict(surface_m2=round(area_m2, 5), coverage=round(coverage, 4), margin=UV_MARGIN,
                            mm_per_px={str(s): round(math.sqrt(area_m2 / (coverage * s * s)) * 1000, 3) for s in (2048, 4096)}))
    json.dump(manifest, open(os.path.join(o['out'], 'manifest.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"[helmet_template] {o['kind']}: {len(obs)} objects, roles {sorted(flat)}, unmapped {manifest['unmapped_materials']}, "
          f"size {manifest['size_units']} units, uv {manifest['uv']} → {glb}", flush=True)


main()
