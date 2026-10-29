"""Skin UV template (0.13 "Skins"), shared by blender/robot/export_robot.py (bodies) and blender/robot/helmet_template.py (helmets)."""
import math

import bmesh
import bpy

UV_MARGIN = 0.001  # island gap as share of the atlas: ≈ 2 px at 2048², ≈ 4 px at 4096²


def uv_template(obs, weld=False):
    """Skin template (0.13): bevels applied, then one shared UV atlas over all objects at uniform texel density.

    weld: merge coincident vertices first (helmet snapshots from three.js). Smart UV Project cuts at 60° normal change, islands are scaled to the same density and packed together (concave shapes,
    free rotation). Every skin of a body paints into this layout, so it must stay stable: any change to it invalidates all skins.
    Returns 3D surface (m²) and UV coverage (share of the unit square)."""
    dg = bpy.context.evaluated_depsgraph_get()
    for ob in obs:
        me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg)
        ob.modifiers.clear()
        ob.data = me
        if not me.uv_layers:
            me.uv_layers.new(name='UVMap')
    bpy.ops.object.select_all(action='DESELECT')
    for ob in obs:
        ob.select_set(True)
    bpy.context.view_layer.objects.active = obs[0]
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    if weld:  # three.js exports (CSG) arrive as loose triangles: weld them, keep the shading as sharp edges from the normals
        bpy.ops.mesh.remove_doubles(threshold=1e-5, use_sharp_edge_from_normals=True)
        bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.0, scale_to_bounds=False)
    bpy.ops.uv.select_all(action='SELECT')
    bpy.ops.uv.average_islands_scale()
    bpy.ops.uv.pack_islands(rotate=True, rotate_method='ANY', margin_method='FRACTION', margin=UV_MARGIN, shape_method='CONCAVE')
    bpy.ops.object.mode_set(mode='OBJECT')
    area3d = uv = 0.0
    for ob in obs:
        bm = bmesh.new()
        bm.from_mesh(ob.data)
        bm.transform(ob.matrix_world)
        lay = bm.loops.layers.uv.active
        for f in bm.faces:
            area3d += f.calc_area()
            c = [lp[lay].uv for lp in f.loops]
            uv += abs(sum(c[i].x * c[i - 1].y - c[i - 1].x * c[i].y for i in range(len(c)))) / 2
        bm.free()
    return area3d, uv
