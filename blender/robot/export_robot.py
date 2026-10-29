"""Export of the three robot body studies from cubeescape-ballon (round 5) as GLB delivery packages for the Critic viewer.

The generator stays in cubeescape-ballon: basic/robot/studies/ + tools/robot_build.py at the commit pinned in SOURCE.json
(branch claude/ballon-0-23-gauntlet-runde5-b524af). This script only builds a study there (pose idle, no weapon, flat 'color'
materials) and writes per study:

  <out>/<name>/assembled/<name>.glb          assembled body (glTF: Y up, front +Z, metres, standing on y = 0)
  <out>/<name>/parts.json                    assemblies → parts (id, German name, side, objects)
  <out>/<name>/manifest.json                 per object: assembly, part, side, vertices, triangles, bounding box; anchor gaps

Every mesh carries glTF extras asm, part, part_de, side, study. The segment empties (SEG_*, ARM_*) are the GLB's root nodes with
extras asm and side; the viewer explodes the body by moving them by explode_mm from parts.json (as robot_build.explode: world mm,
x mirrored for side R), so no second GLB is needed. Run once per study, headless:

  blender -b --factory-startup -P blender/robot/export_robot.py -- --src <ballon checkout> --study a_waechter --out assets/robot-bodies
"""
import json
import math
import os
import sys

import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from uv_template import UV_MARGIN, uv_template  # noqa: E402

STUDIES = {'a_waechter': 'waechter', 'b_paladin': 'paladin', 'c_mechanik': 'mechanik'}


def args():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    o = dict(src=None, study=None, out=None)
    for k in o:
        if f'--{k}' not in a:
            sys.exit(f'export_robot: --{k} missing (usage: -- --src <ballon> --study <{"|".join(STUDIES)}> --out <dir>)')
        o[k] = a[a.index(f'--{k}') + 1]
    if o['study'] not in STUDIES:
        sys.exit(f"export_robot: unknown study {o['study']} (expected {list(STUDIES)})")
    o['src'], o['out'] = os.path.abspath(o['src']), os.path.abspath(o['out'])
    return o


def part_names(RB):
    """(asm, part id) → German name for every part of the active study, arms included."""
    return {(asm, p[0]): p[1] for asm, p in RB.parts()}


def describe(F, names, study):
    """Copy the build's custom properties into glTF extras; return the manifest rows."""
    dg = bpy.context.evaluated_depsgraph_get()
    rows = []
    for ob in sorted(F['obs'].values(), key=lambda o: o.name):
        asm, pid, side = ob['asm'], ob['part'], ob['side']
        ob['part_de'] = names.get((asm, pid), pid)
        ob['study'] = study
        ob.data['asm'] = asm  # keeps the assembly on the mesh as well (glTF exports mesh extras separately)
        e = ob.evaluated_get(dg)
        me = e.to_mesh()
        me.calc_loop_triangles()
        W = [e.matrix_world @ v.co for v in me.vertices]
        lo = [round(min(v[i] for v in W), 4) for i in range(3)]
        hi = [round(max(v[i] for v in W), 4) for i in range(3)]
        rows.append(dict(name=ob.name, asm=asm, part=pid, part_de=ob['part_de'], side=side, verts=len(me.vertices),
                         tris=len(me.loop_triangles), bbox=[lo, hi]))
        e.to_mesh_clear()
    return rows


def export(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', export_apply=True, export_extras=True, export_yup=True,
                              export_cameras=False, export_lights=False, export_animations=False)


def main():
    o = args()
    sys.argv = [sys.argv[0]]  # robot_build parses its own flags only in main(); keep ours away from it
    sys.path.insert(0, o['src'])
    sys.path.insert(0, os.path.join(o['src'], 'tools'))
    import robot_build as R  # noqa: E402  (ballon tools/robot_build.py; imports basic.* from o['src'])
    RB = R.RB
    name = STUDIES[o['study']]
    out = os.path.join(o['out'], name)
    RB.use(o['study'])
    names = part_names(RB)

    R.kit.reset_scene()
    F = R.build('idle', mode='color')
    rows = describe(F, names, o['study'])
    gaps = R.anchor_gaps(F['obs'])
    measured = R.measure(F['obs'])
    area3d, coverage = uv_template(sorted(F['obs'].values(), key=lambda ob: ob.name))
    uv = dict(surface_m2=round(area3d, 4), coverage=round(coverage, 4), margin=UV_MARGIN,
              mm_per_px={str(s): round(math.sqrt(area3d / (coverage * s * s)) * 1000, 3) for s in (2048, 4096)})
    export(os.path.join(out, 'assembled', f'{name}.glb'))

    groups = {}
    for r in rows:
        g = groups.setdefault((r['asm'], r['part'], r['side']), dict(asm=r['asm'], part=r['part'], part_de=r['part_de'],
                                                                     side=r['side'], objects=[]))
        g['objects'].append(r['name'])
    assemblies = [dict(id=a['id'], de=a['de'], en=a['en'], explode_mm=list(RB.EXPLODE[a['id']]),
                       parts=[g for g in groups.values() if g['asm'] == a['id']]) for a in RB.ASSEMBLIES]
    json.dump(dict(study=o['study'], name=name, assemblies=assemblies), open(os.path.join(out, 'parts.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)

    src = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'SOURCE.json'), encoding='utf-8'))
    manifest = dict(study=o['study'], name=name, source=src, blender=bpy.app.version_string, pose='idle', materials='color',
                    measured=measured, uv=uv, anchor_gap_mm={k: round(v, 2) for k, v in gaps.items()},
                    totals=dict(objects=len(rows), verts=sum(r['verts'] for r in rows), tris=sum(r['tris'] for r in rows)),
                    objects=rows)
    json.dump(manifest, open(os.path.join(out, 'manifest.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"[export_robot] {name}: {len(rows)} objects, {manifest['totals']['tris']} triangles, "
          f"{measured['height_mm']} × {measured['width_mm']} × {measured['depth_mm']} mm → {out}")


main()
