# Lauf 2: Materialien, Studio, Licht, Turntable, Präsentation, Cycles-Standbild.
import os, bpy, math, time
from mathutils import Vector

H = bpy.app.driver_namespace['H']; L = H['lib']; B = H['build']

def materialien():
    L['build_material']('MAT_Weiss', '#D7D5CF', 0.65, 0.0, wear_col='#8E8C86', wear_rough=0.5, wear_thr=1.12, ns=6, bump=0.06, scratches=True)
    L['build_material']('MAT_Dunkel', '#26282B', 0.55, 0.10, wear_col='#4A4C50', wear_rough=0.38, wear_thr=1.15, ns=7, bump=0.10, edge_sheen=0.15)
    L['build_material']('MAT_Pod', '#5A574D', 0.60, 0.20, wear_col='#7A7668', wear_rough=0.42, wear_thr=1.15, ns=9, bump=0.10)
    L['build_material']('MAT_Metall', '#6E6E6E', 0.30, 1.0, ns=25, bump=0.05)
    L['build_material']('MAT_Kabel', '#1C1C1C', 0.45, 0.0, ns=30, bump=0.25, rvar=0.15)
    L['build_material']('MAT_Hals', '#2B2B2D', 0.80, 0.0, ns=40, bump=0.08, rvar=0.1)
    L['build_material']('MAT_Gurt', '#77766F', 0.9, 0.0, ns=60, bump=0.35, rvar=0.06)
    L['build_material']('MAT_Kabel_Huelse', '#CFCBC2', 0.38, 0.0, ns=20, bump=0.05)
    L['build_material']('MAT_Leucht', '#1A2E2D', 0.3, 0.0, ns=10, bump=0.0, emission=('#7FE6E0', 2.2))

def abrieb():
    ng = bpy.data.node_groups.get('GN_Kantenabrieb') or bpy.data.node_groups.new('GN_Kantenabrieb', 'GeometryNodeTree')
    ng.nodes.clear()
    if not ng.interface.items_tree:
        ng.interface.new_socket('Geometry', in_out='INPUT', socket_type='NodeSocketGeometry')
        ng.interface.new_socket('Geometry', in_out='OUTPUT', socket_type='NodeSocketGeometry')
    N = ng.nodes; Lk = ng.links
    gi = N.new('NodeGroupInput'); go = N.new('NodeGroupOutput'); ea = N.new('GeometryNodeInputMeshEdgeAngle')
    mr = N.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = 0.26; mr.inputs['From Max'].default_value = 0.32
    st = N.new('GeometryNodeStoreNamedAttribute'); st.data_type = 'FLOAT'; st.domain = 'FACE'; st.inputs['Name'].default_value = 'wear'
    Lk.new(ea.outputs['Signed Angle'], mr.inputs['Value']); Lk.new(gi.outputs[0], st.inputs['Geometry'])
    Lk.new(mr.outputs['Result'], st.inputs['Value']); Lk.new(st.outputs['Geometry'], go.inputs[0])
    for o in bpy.data.objects:
        if o.type != 'MESH' or 'Bevel' not in o.modifiers or o.name == 'Krempe' or 'Kantenabrieb' in o.modifiers: continue
        if not o.data.materials or o.data.materials[0].name not in ('MAT_Weiss', 'MAT_Dunkel', 'MAT_Pod'): continue
        m = o.modifiers.new('Kantenabrieb', 'NODES'); m.node_group = ng
        names = [x.name for x in o.modifiers]
        with bpy.context.temp_override(object=o, active_object=o):
            bpy.ops.object.modifier_move_to_index(modifier='Kantenabrieb', index=names.index('Bevel') + 1)

def studio():
    Z0 = -0.36; R = 1.2; YW = 2.2
    prof = [(-5.0, Z0), (-2.5, Z0), (0.0, Z0), (YW - R, Z0)]
    for i in range(1, 13):
        a = math.radians(90 * i / 12); prof.append((YW - R + R * math.sin(a), Z0 + R - R * math.cos(a)))
    prof += [(YW, Z0 + 3.0), (YW, Z0 + 5.5)]
    xs = [-6 + 12 * i / 16 for i in range(17)]; W = len(xs)
    V = [(x, y, z) for (y, z) in prof for x in xs]
    F = [(j * W + i, j * W + i + W, j * W + i + W + 1, j * W + i + 1) for j in range(len(prof) - 1) for i in range(W - 1)]
    cyc = L['mesh_obj']('Studio_Hohlkehle', V, F, cname='UMGEBUNG'); B['fixn'](cyc)
    if cyc.data.polygons[0].normal.z < 0:
        for p in cyc.data.polygons: p.flip()
    L['smooth'](cyc); L['add_mod'](cyc, 'SUBSURF', 'Subdivision', levels=1, render_levels=2)
    m = bpy.data.materials.get('MAT_Studio') or bpy.data.materials.new('MAT_Studio'); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; Lk = nt.links; N.clear()
    out = N.new('ShaderNodeOutputMaterial'); bs = N.new('ShaderNodeBsdfPrincipled'); tc = N.new('ShaderNodeTexCoord')
    mp = N.new('ShaderNodeMapping'); mp.vector_type = 'TEXTURE'
    mp.inputs['Location'].default_value = (0.0, 2.0, 0.6); mp.inputs['Scale'].default_value = (2.0, 2.4, 1.6)
    gr = N.new('ShaderNodeTexGradient'); gr.gradient_type = 'SPHERICAL'; cr = N.new('ShaderNodeValToRGB')
    cr.color_ramp.elements[0].color = L['hexcolor']('#4A4C4F'); cr.color_ramp.elements[1].color = L['hexcolor']('#A3A5A9')
    cr.color_ramp.elements[1].position = 0.85; cr.color_ramp.interpolation = 'EASE'
    Lk.new(tc.outputs['Object'], mp.inputs['Vector']); Lk.new(mp.outputs['Vector'], gr.inputs['Vector'])
    Lk.new(gr.outputs['Fac'], cr.inputs['Fac']); Lk.new(cr.outputs['Color'], bs.inputs['Base Color'])
    bs.inputs['Roughness'].default_value = 0.92; bs.inputs['Specular IOR Level'].default_value = 0.2; Lk.new(bs.outputs[0], out.inputs[0])
    B['setmat'](cyc, 'MAT_Studio')
    w = bpy.context.scene.world or bpy.data.worlds.new('World'); bpy.context.scene.world = w; w.use_nodes = True
    bg = w.node_tree.nodes.get('Background') or w.node_tree.nodes.new('ShaderNodeBackground')
    if not bg.outputs[0].links:
        wo = w.node_tree.nodes.get('World Output') or w.node_tree.nodes.new('ShaderNodeOutputWorld'); w.node_tree.links.new(bg.outputs[0], wo.inputs[0])
    bg.inputs['Color'].default_value = L['hexcolor']('#8A8C90'); bg.inputs['Strength'].default_value = 0.18

def licht():
    def area(name, loc, size, power, color=(1, 1, 1), shape='RECTANGLE', sy=None):
        ld = bpy.data.lights.get(name) or bpy.data.lights.new(name, 'AREA')
        ld.shape = shape; ld.size = size; ld.size_y = sy or size; ld.energy = power; ld.color = color
        o = bpy.data.objects.get(name) or bpy.data.objects.new(name, ld)
        if not o.users_collection: L['coll']('LICHT').objects.link(o)
        o.location = loc; o.rotation_euler = (Vector((0, 0, 0.5)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    area('Licht_Key', (-2.6, -2.0, 2.3), 1.4, 420, (1.0, 0.98, 0.95))
    area('Licht_Fill_Hinten', (2.0, 2.4, 1.7), 2.2, 220, (0.95, 0.97, 1.0))
    area('Licht_Oben', (0.0, -0.3, 3.4), 3.0, 35, shape='DISK')
    area('Licht_Kante_Rechts', (2.6, -0.6, 0.9), 0.8, 110, sy=2.4)
    sc = bpy.context.scene; ee = sc.eevee
    ee.use_raytracing = True; ee.use_fast_gi = False; ee.taa_samples = 64; ee.use_shadow_jitter_viewport = True; ee.shadow_ray_count = 2
    ee.ray_tracing_options.resolution_scale = '1'
    sc.view_settings.view_transform = 'AgX'; sc.view_settings.exposure = -0.35

def redraw(sec=12):
    w, a, sp, r = L['view3d'](); t0 = time.time()
    def k():
        a.tag_redraw(); return None if time.time() - t0 > sec else 0.05
    bpy.app.timers.register(k, first_interval=0.05)

def turntable_keys():
    import math as m
    sc = bpy.context.scene; sc.render.fps = 24; sc.frame_start = 1; sc.frame_end = 336; sc.frame_set(1)
    root = bpy.data.objects['HELM_ROOT']; root.animation_data_clear(); root.rotation_euler = (0, 0, 0)
    for f, deg in [(1, 0.0), (36, 0.0), (72, 27.0), (276, 333.0), (312, 360.0), (336, 360.0)]:
        root.rotation_euler[2] = m.radians(deg); root.keyframe_insert('rotation_euler', index=2, frame=f)
    act = root.animation_data.action
    fcs = act.fcurves if hasattr(act, 'fcurves') else act.layers[0].strips[0].channelbags[0].fcurves
    fc = [c for c in fcs if c.data_path == 'rotation_euler'][0]; w = m.radians(1.5)
    for kp in fc.keyframe_points:
        f = kp.co.x; kp.interpolation = 'BEZIER'; kp.handle_left_type = kp.handle_right_type = 'FREE'
        if f in (1, 36, 312, 336): kp.handle_left = (f - 12, kp.co.y); kp.handle_right = (f + 12, kp.co.y)
        if f in (72, 276): kp.handle_left = (f - 12, kp.co.y - 12 * w); kp.handle_right = (f + 12, kp.co.y + 12 * w)
        if f == 72: kp.interpolation = 'LINEAR'
        if f == 1: kp.interpolation = 'CONSTANT'
    fc.update()
    an = bpy.data.objects.get('Antenne_R')
    if an is None or (an.users_collection and an.users_collection[0].name == 'AUSGEBAUT'):
        sc.frame_set(1); return {'speed_deg_per_frame': round(m.degrees(fc.evaluate(151) - fc.evaluate(150)), 3)}
    an.animation_data_clear()
    for f, d in [(1, 0), (36, 0), (47, 1.6), (58, -0.8), (69, 0.4), (80, -0.15), (92, 0), (276, 0), (291, -1.4), (303, 0.9), (315, -0.55), (326, 0.25), (336, 0)]:
        an.rotation_euler[0] = m.radians(12 + d); an.keyframe_insert('rotation_euler', index=0, frame=f)
    an.rotation_euler[0] = m.radians(12); sc.frame_set(1)
    return {'speed_deg_per_frame': round(m.degrees(fc.evaluate(151) - fc.evaluate(150)), 3)}

def turntable_play(hold=3.0):
    sc = bpy.context.scene; sc.frame_set(1); w, a, sp, r = L['view3d'](); st = {'t0': time.time() + hold}
    def tick():
        a.tag_redraw(); el = time.time() - st['t0']
        if el < 0: return 0.05
        f = 1 + int(el * sc.render.fps)
        if f >= sc.frame_end:
            if sc.frame_current != sc.frame_end: sc.frame_set(sc.frame_end)
            st.setdefault('end', time.time()); return None if time.time() - st['end'] > 8 else 0.05
        if f != sc.frame_current: sc.frame_set(f)
        return 1 / sc.render.fps
    bpy.app.timers.register(tick, first_interval=0.05); H['tt_state'] = st

def cycles_standbild(path, samples=96):
    sc = bpy.context.scene; old = (sc.render.engine, sc.camera, sc.render.filepath, sc.frame_current)
    sc.frame_set(1); sc.render.engine = 'CYCLES'; sc.cycles.samples = samples; sc.cycles.use_denoising = True
    try:
        sc.cycles.device = 'GPU'
    except Exception:
        pass
    cam = bpy.data.objects['cam_praesentation']; sc.camera = cam
    cam.data.dof.use_dof = True; cam.data.dof.focus_distance = 3.2 - 0.45; cam.data.dof.aperture_fstop = 5.6
    for o in bpy.data.objects:
        if o.users_collection and o.users_collection[0].name in ('REFERENZ', 'CUTTER'): o.hide_render = True
    sc.render.resolution_x = sc.render.resolution_y = 1080; sc.render.filepath = path
    t0 = time.time(); bpy.ops.render.render(write_still=True); dt = time.time() - t0
    sc.render.engine, sc.camera, sc.render.filepath = old[0], old[1], old[2]; cam.data.dof.use_dof = False
    return {'sekunden': round(dt, 1), 'datei': path}

for k, v in list(globals().items()):
    if callable(v) and not k.startswith('_'):
        B[k] = v

def vergleich(view, N=540):
    """Referenz (ausgerichtet) links, Modell im aktuellen Viewport-Shading rechts – als PNG in den Scratchpad."""
    import numpy as np
    cam, img, az = B['REFS'][view]
    sc = bpy.context.scene; w, a, sp, r = L['view3d']()
    st = (sp.overlay.show_overlays, r.view_perspective, sc.camera, sc.render.resolution_x, sc.render.resolution_y, sc.render.filepath, sc.frame_current)
    sc.frame_set(1); hid = [o for o in bpy.data.objects if not o.hide_get() and o.users_collection and o.users_collection[0].name in ('REFERENZ', 'CUTTER')]
    for o in hid: o.hide_set(True)
    sp.overlay.show_overlays = False; sc.camera = bpy.data.objects[cam]; r.view_perspective = 'CAMERA'
    sc.render.resolution_x = sc.render.resolution_y = N; path = B['SCR'] + f'mod_{view}.png'; sc.render.filepath = path
    with bpy.context.temp_override(window=w, area=a, region=[x for x in a.regions if x.type == 'WINDOW'][0]):
        bpy.ops.render.opengl(write_still=True, view_context=True)
    (sp.overlay.show_overlays, r.view_perspective, sc.camera, sc.render.resolution_x, sc.render.resolution_y, sc.render.filepath, f) = st
    for o in hid: o.hide_set(False)
    im = bpy.data.images.load(path, check_existing=False); px = np.empty(N * N * 4, dtype=np.float32); im.pixels.foreach_get(px); bpy.data.images.remove(im)
    mod = px.reshape(N, N, 4)[::-1]
    ri = bpy.data.images.load(os.path.join(os.environ['SCOUT_REF'], img), check_existing=True); rw, rh = ri.size
    rp = np.empty(rw * rh * 4, dtype=np.float32); ri.pixels.foreach_get(rp); rp = rp.reshape(rh, rw, 4)[::-1]
    tr, u0 = H['refcal'][view]; s = N / 1.355; PX = B['PXH']
    # Modell-Kamerageometrie: Z 1.0 liegt bei Zeile 270 - 0.5*s, Bildmitte horizontal = Weltmitte
    Y, X = np.mgrid[0:N, 0:N]
    zrow0 = 270 - 0.5 * s
    v = np.clip(((Y - zrow0) / s * PX + tr).astype(int), 0, rh - 1); u = np.clip(((X - 270) / s * PX + u0).astype(int), 0, rw - 1)
    ref = rp[v, u]
    out = np.concatenate([ref, mod], axis=1)
    di = bpy.data.images.new(f'cmp_{view}', 2 * N, N, alpha=True); di.pixels.foreach_set(out[::-1].ravel())
    di.filepath_raw = B['SCR'] + f'cmp_{view}.png'; di.file_format = 'PNG'; di.save(); bpy.data.images.remove(di)
    return B['SCR'] + f'cmp_{view}.png'

B['vergleich'] = vergleich
