# Lauf 2: Bauschritte für den Helm „Scout v3“. Jede Funktion ist ein sichtbarer Arbeitsschritt.
# Aufruf in Blender: B = H['build']; B['name']()
import bpy, bmesh, math, time, os
import numpy as np
from mathutils import Vector, Matrix, Euler
from mathutils.bvhtree import BVHTree

H = bpy.app.driver_namespace['H']
L = H['lib']
D = os.path.join(os.environ['SCOUT_DIR'], '')  # set by run.py (blender/scout)
SCR = os.path.join(os.environ['SCOUT_RUNS'], '')  # set by run.py
DARK, WHITE, OLIVE, MET = (0.10, 0.105, 0.115, 1), (0.85, 0.84, 0.81, 1), (0.27, 0.26, 0.21, 1), (0.45, 0.45, 0.46, 1)
P = H.setdefault('P', {
    'cap': dict(c=0.36, zc=0.64, a=0.37, bf=0.62, bb=0.44, yc=0.10, ex=2.0, eyf=2.6, eyb=1.7),
    'xk': [0.0, 0.16, 0.28, 0.35],
    'side_yr': (-0.24, -0.16),   # Hinterkante der dunklen Seitenplatte bei Z 0.25 / 0.70
    'jut': 0.035,
    # Lauf 2 (aus Meshy v2 gemessen): zwei Stirnfacetten, je (Punkt unten, Punkt oben) im YZ-Mittelschnitt
    'P1': ((-0.482, 0.62), (-0.378, 0.78)),
    'P2': ((-0.378, 0.78), (-0.12, 0.955)),
    'chin_recede': 0.17,   # untere Maske: y_front = -0.48 + (0.46 - z) * k
    # Lauf 2b (Meshy v2, Draufsicht): Gesicht als Keil. yc = Frontmitte je Höhe, dy = Rücksprung je |x|
    'yc_tab': [(0.0, -0.38), (0.20, -0.36), (0.25, -0.375), (0.35, -0.41), (0.45, -0.446), (0.58, -0.487), (0.62, -0.485)],
    'dy_tab': [(0.0, 0.0), (0.08, 0.015), (0.20, 0.13), (0.30, 0.27), (0.36, 0.42), (0.42, 0.62)],
    'pod_y': 0.10,
})

def fixn(o):
    bm = bmesh.new(); bm.from_mesh(o.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(o.data); bm.free()

def setmat(o, m):
    o.data.materials.clear(); o.data.materials.append(bpy.data.materials[m])

def sharp(o, deg=30):
    L['smooth'](o)
    with bpy.context.temp_override(object=o, active_object=o, selected_editable_objects=[o], selected_objects=[o]):
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(deg))

def cyl(r, h, n=24, dome=0.0):
    v, f = [], []
    for z in (0.0, h):
        for i in range(n):
            a = 2 * math.pi * i / n; v.append((r * math.cos(a), r * math.sin(a), z))
    for i in range(n):
        f.append((i, (i + 1) % n, n + (i + 1) % n, n + i))
    f.append(tuple(range(n - 1, -1, -1)))
    if dome > 0:
        c = len(v); v.append((0, 0, h + dome)); f += [(n + i, n + (i + 1) % n, c) for i in range(n)]
    else:
        f.append(tuple(range(n, 2 * n)))
    return v, f

def stack(parts):
    V, F = [], []
    for (v, f), z0 in parts:
        o = len(V); V += [(x, y, z + z0) for x, y, z in v]; F += [tuple(i + o for i in fc) for fc in f]
    return V, F

def place(name, vf, loc, axis, mat, col):
    v, f = vf
    o = L['mesh_obj'](name, v, f)
    o.matrix_world = Matrix.Translation(loc) @ Vector((0, 0, 1)).rotation_difference(Vector(axis).normalized()).to_matrix().to_4x4()
    setmat(o, mat); o.color = col; L['smooth'](o)
    return o

def bez(name, splines, depth, mat, col, res=20, poly=False):
    old = bpy.data.objects.get(name)
    if old: bpy.data.objects.remove(old, do_unlink=True)
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'
    cu.bevel_depth = depth; cu.bevel_resolution = 3; cu.use_fill_caps = True; cu.resolution_u = res
    for pts in splines:
        if poly:
            sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
            for p, q in zip(sp.points, pts): p.co = (*q, 1)
        else:
            sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(pts) - 1)
            for bp, p in zip(sp.bezier_points, pts):
                bp.co = p; bp.handle_left_type = bp.handle_right_type = 'AUTO'
    o = bpy.data.objects.new(name, cu); L['coll']('HELM_V3').objects.link(o); o.parent = bpy.data.objects['HELM_ROOT']
    o.data.materials.append(bpy.data.materials[mat]); o.color = col
    return o

def mats_basic():
    for n, c, r, m in [('MAT_Dunkel', '#26282B', 0.55, 0.10), ('MAT_Weiss', '#D7D5CF', 0.65, 0.0), ('MAT_Pod', '#5A574D', 0.60, 0.2),
                       ('MAT_Kabel', '#1C1C1C', 0.45, 0.0), ('MAT_Metall', '#6E6E6E', 0.30, 1.0), ('MAT_Leucht', '#7FE6E0', 0.3, 0.0),
                       ('MAT_Hals', '#2B2B2D', 0.8, 0.0), ('MAT_Gurt', '#77766F', 0.9, 0.0), ('MAT_Kabel_Huelse', '#CFCBC2', 0.38, 0.0),
                       ('MAT_Modul', '#6E6D68', 0.62, 0.15)]:
        mt = bpy.data.materials.get(n) or bpy.data.materials.new(n)
        mt.use_nodes = True; b = mt.node_tree.nodes.get('Principled BSDF')
        b.inputs['Base Color'].default_value = L['hexcolor'](c); b.inputs['Roughness'].default_value = r; b.inputs['Metallic'].default_value = m
        mt.diffuse_color = L['hexcolor'](c)

def raycast(names, origin, direction):
    dg = bpy.context.evaluated_depsgraph_get()
    best = None
    for n in names:
        o = bpy.data.objects[n]
        mw = o.matrix_world; inv = mw.inverted()
        t = BVHTree.FromObject(o, dg)   # Objektraum
        h = t.ray_cast(inv @ Vector(origin), (inv.to_3x3() @ Vector(direction)).normalized())
        if h[0] is not None:
            p = mw @ h[0]; n_ = (mw.to_3x3() @ h[1]).normalized(); d = (p - Vector(origin)).length
            if best is None or d < best[2]: best = (p, n_, d)
    return best

# ---------------------------------------------------------------- Szene
def setup_scene():
    for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
    for c in list(bpy.data.collections): bpy.data.collections.remove(c)
    sc = bpy.context.scene
    sc.unit_settings.system = 'METRIC'; sc.unit_settings.scale_length = 0.30
    sc.render.engine = 'BLENDER_EEVEE'
    for n in ['HELM_V3', 'REFERENZ', 'KAMERAS', 'LICHT', 'UMGEBUNG', 'CUTTER']: L['coll'](n)
    root = bpy.data.objects.new('HELM_ROOT', None); root.empty_display_size = 0.15
    L['coll']('HELM_V3').objects.link(root)
    mats_basic()
    w, a, sp, r = L['view3d']()
    sp.shading.type = 'SOLID'; sp.shading.light = 'STUDIO'; sp.shading.color_type = 'OBJECT'
    sp.clip_start = 0.01; sp.overlay.show_relationship_lines = False
    reg = [x for x in a.regions if x.type == 'WINDOW'][0]
    if not w.screen.name.endswith('nonnormal'):
        with bpy.context.temp_override(window=w, area=a, region=reg):
            bpy.ops.screen.screen_full_area(use_hide_panels=False)
    w, a, sp, r = L['view3d'](); sp.show_region_toolbar = False; sp.show_region_ui = False
    r.view_rotation = L['view_quat'](10, 25); r.view_location = (0, 0, 0.45); r.view_distance = 4.0
    return {'ok': True}

REFS = {'front': ('cam_front', 'helm_000.png', 0), 'right': ('cam_right', 'helm_090.png', 90),
        'back': ('cam_back', 'helm_180.png', 180), 'left': ('cam_left', 'helm_270.png', -90)}
PXH = 535.0   # Referenz: Pixel pro Helmhöhe (960er Bilder)

def ref_mask(img_name):
    im = bpy.data.images.load(os.environ['SCOUT_REF'] + '/' + img_name, check_existing=True)
    w, h = im.size
    px = np.empty(w * h * 4, dtype=np.float32); im.pixels.foreach_get(px)
    px = px.reshape(h, w, 4)[::-1]             # oben zuerst
    lum = px[..., :3] @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    # Hintergrund als quadratische Fläche aus Rand-Pixeln (oben 12 %, seitlich 7 % in der oberen Bildhälfte)
    yy, xx = np.mgrid[0:h, 0:w]
    sel = (yy < 0.12 * h) | (((xx < 0.07 * w) | (xx > 0.93 * w)) & (yy < 0.5 * h))
    X = np.stack([np.ones(sel.sum()), xx[sel], yy[sel], xx[sel] ** 2, yy[sel] ** 2, xx[sel] * yy[sel]], 1) / np.array([1, w, h, w * w, h * h, w * h])
    c, *_ = np.linalg.lstsq(X, lum[sel], rcond=None)
    A = np.stack([np.ones(h * w), xx.ravel(), yy.ravel(), xx.ravel() ** 2, yy.ravel() ** 2, (xx * yy).ravel()], 1) / np.array([1, w, h, w * w, h * h, w * h])
    bg = (A @ c).reshape(h, w)
    return np.abs(lum - bg) > 0.045

def top_row(m, minw=60):
    rows = np.where(m.sum(1) > minw)[0]
    return int(rows[0]) if len(rows) else 0

def cameras_and_refs():
    for n, (cam, img, az) in REFS.items():
        cd = bpy.data.cameras.new(cam); cd.lens = 85; cd.sensor_width = 36; cd.clip_start = 0.05; cd.clip_end = 50
        c = bpy.data.objects.new(cam, cd); t = math.radians(az)
        c.location = (3.2 * math.sin(t), -3.2 * math.cos(t), 0.5); c.rotation_euler = (math.radians(90), 0, t)
        L['coll']('KAMERAS').objects.link(c)
    cd = bpy.data.cameras.new('cam_praesentation'); cd.lens = 85; cd.sensor_width = 36
    c = bpy.data.objects.new('cam_praesentation', cd); c.location = (0, -3.2, 0.5); c.rotation_euler = (math.radians(90), 0, 0)
    L['coll']('KAMERAS').objects.link(c); bpy.context.scene.camera = c
    sc = bpy.context.scene; sc.render.resolution_x = sc.render.resolution_y = 1080
    # Referenzbilder kalibriert: Oberkante Helm = Z 1.0, Maßstab 535 px/H, horizontal Schwerpunkt der oberen Hälfte
    info = {}
    Dd = 4.2; k = Dd / 3.2
    for n, (cam, img, az) in REFS.items():
        m = ref_mask(img); tr = top_row(m)
        band = m[tr:tr + int(0.5 * PXH)]
        cols = np.where(band.sum(0) > 0)[0]
        u0 = float((band.sum(0) * np.arange(m.shape[1])).sum() / max(band.sum(), 1))
        info[n] = {'top': tr, 'u0': round(u0, 1)}
        H.setdefault('refcal', {})[n] = (tr, u0)
        im = bpy.data.images.load(os.environ['SCOUT_REF'] + '/' + img, check_existing=True)
        e = bpy.data.objects.new('Ref_' + n, None); e.empty_display_type = 'IMAGE'; e.data = im
        e.empty_display_size = 960 / PXH * k
        # Bildmitte (480,480) liegt in Weltkoordinaten bei z = 1.0 - (480 - tr)/PXH, horizontal (480 - u0)/PXH vom Helmschwerpunkt
        zc = 1.0 - (480 - tr) / PXH; hc = (480 - u0) / PXH
        t = math.radians(az); right = Vector((math.cos(t), math.sin(t), 0)); back = Vector((-math.sin(t), math.cos(t), 0))
        e.location = right * (hc * k) + back * (Dd - 3.2) + Vector((0, 0, 0.5 + (zc - 0.5) * k))
        e.rotation_euler = (math.radians(90), 0, t)
        e.empty_image_side = 'FRONT'; e.use_empty_image_alpha = True; e.color[3] = 0.5
        e.hide_select = True; L['coll']('REFERENZ').objects.link(e); e.hide_set(True)
    return info

def show_ref(name=None):
    for n in REFS:
        bpy.data.objects['Ref_' + n].hide_set(n != name)

def vorlage_v2():
    path = os.path.join(os.environ['SCOUT_REF'], 'meshy_v2.glb')
    if not os.path.exists(path): return {'ok': False, 'skipped': 'meshy_v2.glb not in reference/scout (49 MB, not in git)'}
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    m = [o for o in bpy.data.objects if o not in before][0]; m.name = 'Vorlage_Meshy_v2'
    for c in list(m.users_collection): c.objects.unlink(m)
    L['coll']('REFERENZ').objects.link(m)
    e = bpy.data.objects.new('Vorlage_v2', None); L['coll']('REFERENZ').objects.link(e)
    s = 1 / 3.12; e.scale = (s, s, s); e.location = (0, -0.01 + 0.155, 0.11 * s); m.parent = e
    m.hide_select = True; m.display_type = 'WIRE'; m.color = (0.25, 0.75, 1.0, 1); m.hide_set(True)
    dg = bpy.context.evaluated_depsgraph_get(); H['vtree'] = (BVHTree.FromObject(m, dg), None, None)
    return {'ok': True}

def vorlage():
    path = os.path.join(os.environ['SCOUT_REF'], 'helmet_vorlage_leicht.glb')   # old Meshy reference, not in git
    if not os.path.exists(path): return {'teile': 0, 'skipped': path}
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    e = bpy.data.objects.new('Vorlage_Meshy', None); L['coll']('REFERENZ').objects.link(e)
    s = 1 / 3.12; e.scale = (s, s, s); e.location = (0, -0.01, 0.11 * s)
    for o in new:
        for c in list(o.users_collection): c.objects.unlink(o)
        L['coll']('REFERENZ').objects.link(o)
        if o.parent is None: o.parent = e
        o.hide_select = True
        if o.type == 'MESH':
            o.display_type = 'WIRE'; o.color = (0.2, 0.7, 1.0, 1)
        if '01_Stofftuch' in o.name: o.hide_set(True)
    return {'teile': len(new)}

def ghost(on=True):
    for o in L['coll']('REFERENZ').objects:
        if o.type == 'MESH' and 'Stofftuch' not in o.name: o.hide_set(not on)

# ---------------------------------------------------------------- Silhouetten-Prüfung (Viewport-Aufnahme)
def sil_check(view):
    cam, img, az = REFS[view]
    sc = bpy.context.scene; w, a, sp, r = L['view3d']()
    st = (sp.shading.type, sp.shading.light, sp.shading.color_type, tuple(sp.shading.single_color), sp.shading.background_type,
          tuple(sp.shading.background_color), sp.overlay.show_overlays, r.view_perspective, sc.camera, sc.render.resolution_x,
          sc.render.resolution_y, sc.render.filepath, sp.shading.show_shadows, sp.shading.show_cavity)
    hid = [o for o in bpy.data.objects if not o.hide_get() and (o.users_collection[0].name in ('REFERENZ', 'UMGEBUNG', 'CUTTER') or o.name == 'Hals')]
    for o in hid: o.hide_set(True)
    sp.shading.type = 'SOLID'; sp.shading.light = 'FLAT'; sp.shading.color_type = 'SINGLE'; sp.shading.single_color = (0, 0, 0)
    sp.shading.background_type = 'VIEWPORT'; sp.shading.background_color = (1, 1, 1); sp.overlay.show_overlays = False
    sp.shading.show_shadows = False; sp.shading.show_cavity = False
    sc.camera = bpy.data.objects[cam]; r.view_perspective = 'CAMERA'
    N = 540; sc.render.resolution_x = sc.render.resolution_y = N
    path = SCR + f'sil_{view}.png'; sc.render.filepath = path
    with bpy.context.temp_override(window=w, area=a, region=[x for x in a.regions if x.type == 'WINDOW'][0]):
        bpy.ops.render.opengl(write_still=True, view_context=True)
    (sp.shading.type, sp.shading.light, sp.shading.color_type, sc1, sp.shading.background_type, bc, sp.overlay.show_overlays,
     r.view_perspective, sc.camera, sc.render.resolution_x, sc.render.resolution_y, sc.render.filepath, sp.shading.show_shadows,
     sp.shading.show_cavity) = st
    sp.shading.single_color = sc1; sp.shading.background_color = bc
    for o in hid: o.hide_set(False)
    im = bpy.data.images.load(path, check_existing=False)
    px = np.empty(N * N * 4, dtype=np.float32); im.pixels.foreach_get(px); bpy.data.images.remove(im)
    mm = px.reshape(N, N, 4)[::-1, :, 0] < 0.5
    s = N / 1.355                                  # px pro H im Kamerabild
    # Referenz in Kamera-Pixel abbilden: Oberkante ↔ Oberkante, horizontal Schwerpunkt ↔ Schwerpunkt
    rm = ref_mask(img); tr, u0 = H['refcal'][view]
    mt = top_row(mm, minw=int(60 * s / PXH))
    band = mm[mt:mt + int(0.5 * s)]
    x0 = float((band.sum(0) * np.arange(N)).sum() / max(band.sum(), 1))
    Y, X = np.mgrid[0:N, 0:N]
    v = np.clip(((Y - mt) / s * PXH + tr).astype(int), 0, 959); u = np.clip(((X - x0) / s * PXH + u0).astype(int), 0, 959)
    rr = rm[v, u]
    lim = (Y < mt + int(0.70 * s))                # Dach bis Kragenhöhe (Z ≈ 0.30): dort kein Tuch
    a_, b_ = mm & lim, rr & lim
    iou = (a_ & b_).sum() / max((a_ | b_).sum(), 1)
    # Differenzbild: weiß = beide, rot = nur Referenz, blau = nur Modell
    out = np.ones((N, N, 4), dtype=np.float32)
    out[a_ & b_] = (0.15, 0.15, 0.15, 1); out[b_ & ~a_] = (0.9, 0.2, 0.2, 1); out[a_ & ~b_] = (0.2, 0.4, 0.95, 1)
    di = bpy.data.images.new(f'diff_{view}', N, N, alpha=True); di.pixels.foreach_set(out[::-1].ravel())
    di.filepath_raw = SCR + f'diff_{view}.png'; di.file_format = 'PNG'; di.save(); bpy.data.images.remove(di)
    prof = {}
    for z in (0.97, 0.93, 0.88, 0.82, 0.75, 0.65, 0.55, 0.45, 0.35):
        row = int(mt + (1.0 - z) * s)
        if 0 <= row < N:
            def ext(m):
                c = np.where(m[row])[0]
                return (round(float((c[0] - x0) / s), 3), round(float((c[-1] - x0) / s), 3)) if len(c) else None
            prof[z] = {'ref': ext(rr), 'mod': ext(mm)}
    return {'view': view, 'iou': round(float(iou), 3), 'nur_ref': int((b_ & ~a_).sum()), 'nur_modell': int((a_ & ~b_).sum()), 'profil': prof}

# ---------------------------------------------------------------- Stufe A: Blocking
def blk(name, kind, loc, scale, col, rot=(0, 0, 0)):
    if kind == 'cube': bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    elif kind == 'cyl': bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=1, depth=1, location=loc)
    elif kind == 'sphere': bpy.ops.mesh.primitive_uv_sphere_add(segments=40, ring_count=20, radius=1, location=loc)
    o = bpy.context.active_object; o.name = name; o.data.name = name
    o.scale = scale; o.rotation_euler = [math.radians(x) for x in rot]; o.color = col
    L['put'](o, 'HELM_V3'); o.select_set(False)
    return o

def blk_schale():
    blk('Blk_Schale', 'cyl', (0, 0.04, 0.555), (0.38, 0.50, 0.49), WHITE)
    blk('Blk_Kragen', 'cyl', (0, 0.04, 0.15), (0.335, 0.425, 0.30), WHITE)

def dome_mesh(N=48, R=12):
    """Kuppel: Superellipsoid ab Z 0.64, vorn auf den Gesichtskeil F geklemmt, Mitte mit Stirnfacetten P1/P2;
    seitlich/hinten unterhalb 0.76 entfernt (dort sitzt die Krempe)."""
    c = P['cap']; V = []; F_ = []
    ts = [(i / R) ** 0.9 for i in range(R)]
    for t in ts:
        z = c['zc'] + c['c'] * t
        ax = c['a'] * (1 - t ** c['ex']) ** (1 / c['ex'])
        byf = c['bf'] * (1 - t ** c['eyf']) ** (1 / c['eyf']); byb = c['bb'] * (1 - t ** c['eyb']) ** (1 / c['eyb'])
        V += [(x, max(y, F(x, z)) if y < 0 else y, zz) for x, y, zz in L['ring'](z, ax, byf, byb, 2.6, 2.2, N=N, yc=c['yc'])]
    for j in range(R - 1):
        for i in range(N): F_.append((j * N + i, j * N + (i + 1) % N, (j + 1) * N + (i + 1) % N, (j + 1) * N + i))
    top = len(V); V.append((0, c['yc'], c['zc'] + c['c']))
    F_ += [((R - 1) * N + i, (R - 1) * N + (i + 1) % N, top) for i in range(N)]
    F_.append(tuple(range(N - 1, -1, -1)))
    bm = bmesh.new(); vs = [bm.verts.new(v) for v in V]
    for f in F_: bm.faces.new([vs[i] for i in f])
    for key in ('P1', 'P2'):
        p, n = plane_from(*P[key])
        bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], dist=1e-6, plane_co=p, plane_no=n, clear_outer=True)
        bnd = [e for e in bm.edges if e.is_boundary]
        if bnd: bmesh.ops.edgeloop_fill(bm, edges=bnd)
    zmin = min(v.co.z for v in bm.verts)
    for f in [f for f in bm.faces if len(f.verts) > 8 and all(abs(v.co.z - zmin) < 2e-3 for v in f.verts)]:
        bm.faces.remove(f)
    # seitlich/hinten unter der Krempen-Oberkante entfernen
    kill = [f for f in bm.faces if f.calc_center_median().z < 0.765]   # vorn trägt der Maskenschild bis 0.765
    bmesh.ops.delete(bm, geom=kill, context='FACES')
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm

def blk_kappe():
    bm = dome_mesh(32, 8)
    me = bpy.data.meshes.new('Blk_Kappe'); bm.to_mesh(me); bm.free()
    k = bpy.data.objects.new('Blk_Kappe', me); L['coll']('HELM_V3').objects.link(k); k.parent = bpy.data.objects['HELM_ROOT']; k.color = DARK
    blk('Blk_Krempe', 'cyl', (0, 0.06, 0.73), (0.40, 0.49, 0.06), DARK)

def blk_maske():
    # Maske als facettierter Keil: Front folgt dem gemessenen Profil (oben P1 zurückgekippt, unten zurückweichend)
    V = []
    for z, hw in ((0.66, 0.36), (0.55, 0.35), (0.46, 0.33), (0.21, 0.27)):
        yf = plane_y(P['P1'], z) if z > 0.62 else -0.482 + max(0.0, 0.46 - z) * P['chin_recede']
        V += [(-hw, -0.28, z), (-0.20, yf + 0.03, z), (0.0, yf, z), (0.20, yf + 0.03, z), (hw, -0.28, z)]
    F = []
    for j in range(3):
        for i in range(4):
            a = j * 5 + i; F.append((a, a + 5, a + 6, a + 1))
    o = L['mesh_obj']('Blk_Maske', V, F); o.color = DARK; fixn(o)
    L['add_mod'](o, 'SOLIDIFY', 'Solidify', thickness=0.03, offset=-1)
    for sx in (1, -1):
        Vs = [(sx * 0.37, -0.28, 0.70), (sx * 0.38, P['side_yr'][1], 0.70), (sx * 0.36, P['side_yr'][0], 0.25), (sx * 0.31, -0.34, 0.25)]
        f = [(0, 1, 2, 3)] if sx > 0 else [(3, 2, 1, 0)]
        s = L['mesh_obj']('Blk_Seite_' + ('R' if sx > 0 else 'L'), Vs, f); s.color = DARK
        L['add_mod'](s, 'SOLIDIFY', 'Solidify', thickness=0.02, offset=-1)

def blk_kinn():
    blk('Blk_Kinn', 'cube', (0, -0.47, 0.13), (0.68, 0.10, 0.14), WHITE)

def blk_pods_box_antenne():
    for sx, s in ((1, 'R'), (-1, 'L')):
        blk('Blk_Pod_' + s, 'sphere', (sx * 0.43, P['pod_y'], 0.55), (0.05, 0.10, 0.125), OLIVE)
    blk('Blk_Rueckbox', 'cube', (0, 0.52, 0.66), (0.30, 0.10, 0.24), OLIVE)
    a = blk('Blk_Antenne', 'cyl', (0, 0, 0), (0.007, 0.007, 0.45), DARK, rot=(12, 5, 0))
    a.location = Vector((0.43, P['pod_y'], 0.69)) + a.rotation_euler.to_matrix() @ Vector((0, 0, 0.225))
    blk('Blk_Gurt', 'cube', (0, P['pod_y'] + 0.05, 1.0), (0.82, 0.05, 0.012), (0.47, 0.46, 0.43, 1))

def blk_hals():
    blk('Hals', 'cyl', (0, 0.03, -0.04), (0.255, 0.285, 0.64), (0.05, 0.05, 0.055, 1))

def clear_blocking():
    for o in list(bpy.data.objects):
        if o.name.startswith('Blk_'): bpy.data.objects.remove(o, do_unlink=True)

def plane_from(pa, pb):
    (ya, za), (yb, zb) = pa, pb
    d = Vector((0, yb - ya, zb - za)).normalized()
    n = Vector((0, -d.z, d.y))           # nach vorn-oben zeigend
    return Vector((0, ya, za)), n

def plane_y(pl, z):
    (ya, za), (yb, zb) = pl
    return ya + (yb - ya) * (z - za) / (zb - za)

def interp(tab, x):
    if x <= tab[0][0]: return tab[0][1]
    for (x0, y0), (x1, y1) in zip(tab, tab[1:]):
        if x <= x1: return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
    (x0, y0), (x1, y1) = tab[-2], tab[-1]
    return y1 + (y1 - y0) * (x - x1) / (x1 - x0)

# Mittellinie Kinn–Stirn–Scheitel als EINE stetige Kurve (gemessen an Meshy v2, Lauf 2b)
CENTER = [(0.0, -0.38), (0.20, -0.36), (0.25, -0.375), (0.35, -0.41), (0.40, -0.428), (0.44, -0.443), (0.48, -0.456),
          (0.52, -0.470), (0.56, -0.481), (0.60, -0.479), (0.64, -0.458), (0.68, -0.432), (0.72, -0.402), (0.76, -0.366),
          (0.80, -0.327), (0.84, -0.286), (0.88, -0.239), (0.92, -0.175), (0.95, -0.105), (0.98, -0.02), (1.00, 0.06)]
RID = math.tan(math.radians(6)) * 0.38

def hermite(tab, x):
    xs = [a for a, b in tab]; ys = [b for a, b in tab]; n = len(tab)
    if x <= xs[0]: return ys[0]
    if x >= xs[-1]: return ys[-1]
    i = max(k for k in range(n - 1) if xs[k] <= x)
    def m(k):
        if k == 0: return (ys[1] - ys[0]) / (xs[1] - xs[0])
        if k == n - 1: return (ys[-1] - ys[-2]) / (xs[-1] - xs[-2])
        return (ys[k + 1] - ys[k - 1]) / (xs[k + 1] - xs[k - 1])
    h = xs[i + 1] - xs[i]; t = (x - xs[i]) / h
    h00, h10, h01, h11 = 2*t**3 - 3*t**2 + 1, t**3 - 2*t**2 + t, -2*t**3 + 3*t**2, t**3 - t**2
    return h00 * ys[i] + h10 * h * m(i) + h01 * ys[i + 1] + h11 * h * m(i + 1)

def ridge_w(z):
    """Gewicht des Mittelgrats: voll bis 0.56, weich auslaufend bis 0.82."""
    v = max(0.0, min(1.0, (z - 0.56) / 0.26)); return 1 - v * v * (3 - 2 * v)

def face_yc(z):
    # Gratspitze (x=0) liegt um RID*w vor der Fläche → Fläche entsprechend zurücksetzen, damit die Mittellinie = CENTER
    return hermite(CENTER, z) + RID * ridge_w(z)

def F(x, z):
    """Außenfläche des dunklen Gesichtsschilds (y) an Stelle x, Höhe z. Unten verjüngt (Kritik R2): Seiten weichen zum Kinn zurück."""
    k = 1.0 + P.get('kinn_taper', 0.0) * max(0.0, (0.50 - z) / 0.30)
    return face_yc(z) + interp(P['dy_tab'], min(abs(x) * k, max(abs(x), 0.40)))   # nicht über den Messbereich hinaus extrapolieren

def F_inv_x(y, z):
    """|x| auf der Keilfläche zu gegebenem y."""
    d = y - face_yc(z); inv = [(b, a) for a, b in P['dy_tab']]
    return interp(inv, max(0.0, d))

def vorlage_fix():
    e = bpy.data.objects.get('Vorlage_v2')
    if e: e.location.y = -0.01 + 0.155
    e1 = bpy.data.objects.get('Vorlage_Meshy')
    if e1: e1.location.y = -0.01 + 0.155
    return {'ok': True}

H['build'] = {k: v for k, v in globals().items() if callable(v) and not k.startswith('_')}
H['build']['P'] = P
