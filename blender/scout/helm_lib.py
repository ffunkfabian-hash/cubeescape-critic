# Hilfsbibliothek für den Helm-Live-Test (Scout v3). Maße in H = 1.0 (Szene: 1 BU = 0.30 m).
import os, bpy, bmesh, math, time, datetime
from mathutils import Vector, Quaternion, Euler, Matrix

H = bpy.app.driver_namespace.setdefault('H', {'calls': 0})
LOG = os.path.join(os.environ['SCOUT_RUNS'], 'testlog.md')  # set by run.py

# ---------- Protokoll ----------
def log(stage, note):
    t = datetime.datetime.now().astimezone().isoformat(timespec='seconds')
    with open(LOG, 'a') as f:
        f.write(f"{t} | {stage} | {H['calls']} | {note}\n")

# ---------- Viewport ----------
def view3d():
    for w in bpy.context.window_manager.windows:
        for a in w.screen.areas:
            if a.type == 'VIEW_3D':
                return w, a, a.spaces.active, a.spaces.active.region_3d
    return None, None, None, None

def view_quat(elev, azim):
    # azim 0 = Kamera vorn (-Y), 90 = Kamera rechts (+X); elev in Grad
    return Euler((math.radians(90 - elev), 0, math.radians(azim)), 'XYZ').to_quaternion()

def nav(target=(0, 0, 0.5), dist=3.0, elev=12, azim=30, dur=1.4):
    w, a, sp, r = view3d()
    if r is None:
        return
    if r.view_perspective == 'CAMERA':
        r.view_perspective = 'PERSP'
    q0, l0, d0 = r.view_rotation.copy(), r.view_location.copy(), r.view_distance
    q1, l1, d1 = view_quat(elev, azim), Vector(target), dist
    t0 = time.time()
    H['nav_id'] = H.get('nav_id', 0) + 1
    my = H['nav_id']

    def step():
        if H.get('nav_id') != my:
            return None
        k = min(1.0, (time.time() - t0) / dur)
        e = k * k * (3 - 2 * k)  # smoothstep
        r.view_rotation = q0.slerp(q1, e)
        r.view_location = l0.lerp(l1, e)
        r.view_distance = d0 + (d1 - d0) * e
        a.tag_redraw()
        return None if k >= 1.0 else 1 / 60
    bpy.app.timers.register(step, first_interval=0.01)

def cam_view(cam_name):
    w, a, sp, r = view3d()
    bpy.context.scene.camera = bpy.data.objects[cam_name]
    r.view_perspective = 'CAMERA'
    a.tag_redraw()

def remember_view():
    w, a, sp, r = view3d()
    H['saved_view'] = (r.view_rotation.copy(), r.view_location.copy(), r.view_distance)

def restore_view():
    w, a, sp, r = view3d()
    r.view_perspective = 'PERSP'
    q, l, d = H['saved_view']
    r.view_rotation, r.view_location, r.view_distance = q, l, d
    a.tag_redraw()

# ---------- Sammlungen / Objekte ----------
def coll(name, parent=None):
    c = bpy.data.collections.get(name)
    if c is None:
        c = bpy.data.collections.new(name)
        (parent or bpy.context.scene.collection).children.link(c)
    return c

def put(obj, cname, parent_root=True):
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    coll(cname).objects.link(obj)
    root = bpy.data.objects.get('HELM_ROOT')
    if parent_root and root and obj is not root and obj.parent is None:
        obj.parent = root
    return obj

def mesh_obj(name, verts, faces, cname='HELM_V3'):
    old = bpy.data.objects.get(name)
    if old:
        bpy.data.objects.remove(old, do_unlink=True)
    me = bpy.data.meshes.get(name)
    if me:
        bpy.data.meshes.remove(me)
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], faces)
    me.validate()
    me.update()
    ob = bpy.data.objects.new(name, me)
    coll(cname).objects.link(ob)
    root = bpy.data.objects.get('HELM_ROOT')
    if root and cname in ('HELM_V3', 'CUTTER'):
        ob.parent = root   # Lehre Lauf 1: auch Hilfsobjekte am Root, sonst verrutschen sie im Turntable
    return ob

def smooth(ob, on=True):
    for p in ob.data.polygons:
        p.use_smooth = on

def add_mod(ob, kind, name=None, **kw):
    m = ob.modifiers.new(name or kind.title(), kind)
    for k, v in kw.items():
        setattr(m, k, v)
    return m

def bevel(ob, width=0.006, seg=2, angle=30, harden=True, clamp=True, limit='ANGLE'):
    m = add_mod(ob, 'BEVEL', 'Bevel', width=width, segments=seg, limit_method=limit,
                use_clamp_overlap=clamp, harden_normals=harden)
    if limit == 'ANGLE':
        m.angle_limit = math.radians(angle)
    return m

def wnormal(ob):
    return add_mod(ob, 'WEIGHTED_NORMAL', 'WeightedNormal', keep_sharp=True)

# ---------- Formen ----------
SHELL = [  # z, a, b_v, b_h, n_v, n_h   (Lauf 3b: nach Rückreferenz unten breiter, oben schmaler – kein Zylinder)
    (0.00, 0.378, 0.44, 0.52, 3.0, 2.2),     # Kritik R2: unten weniger ausgestellt
    (0.15, 0.378, 0.44, 0.52, 3.0, 2.2),
    (0.31, 0.372, 0.437, 0.515, 3.0, 2.2),
    (0.55, 0.362, 0.45, 0.52, 3.0, 2.2),
    (0.72, 0.352, 0.44, 0.51, 2.8, 2.2),
    (0.765, 0.348, 0.43, 0.50, 2.7, 2.2),   # Lauf 2: endet unter der Krempe
]

def shell_params(z, table=SHELL):
    if z <= table[0][0]:
        return table[0][1:]
    for r0, r1 in zip(table, table[1:]):
        if r0[0] <= z <= r1[0]:
            k = (z - r0[0]) / (r1[0] - r0[0]) if r1[0] > r0[0] else 0
            return tuple(p0 + (p1 - p0) * k for p0, p1 in zip(r0[1:], r1[1:]))
    return table[-1][1:]

def sgn(v):
    return -1.0 if v < 0 else 1.0

def ring(z, a, bv, bh, nv, nh, N=64, yc=0.0):
    pts = []
    for i in range(N):
        t = 2 * math.pi * i / N
        c, s = math.cos(t), math.sin(t)
        front = s < 0
        n = nv if front else nh
        b = bv if front else bh
        x = a * sgn(c) * abs(c) ** (2 / n)
        y = b * sgn(s) * abs(s) ** (2 / n) + yc
        pts.append((x, y, z))
    return pts

def shell_front_y(x, z):
    a, bv, bh, nv, nh = shell_params(z)
    u = min(abs(x) / a, 0.999)
    return -bv * (1 - u ** nv) ** (1 / nv)

def loft(name, rings, close_ring=True, cname='HELM_V3', cap=None):
    verts, faces = [], []
    N = len(rings[0])
    for r in rings:
        verts += r
    for j in range(len(rings) - 1):
        for i in range(N if close_ring else N - 1):
            i2 = (i + 1) % N
            faces.append((j * N + i, j * N + i2, (j + 1) * N + i2, (j + 1) * N + i))
    if cap == 'top':
        c = len(verts)
        top = rings[-1]
        verts.append((sum(p[0] for p in top) / N, sum(p[1] for p in top) / N, top[0][2]))
        j = len(rings) - 1
        for i in range(N):
            faces.append((j * N + i, j * N + (i + 1) % N, c))
    return mesh_obj(name, verts, faces, cname)

def grid_panel(name, zb, zt, xl, xr, nu=16, nv=10, y=-0.7, cname='HELM_V3'):
    """Quad-Raster einer Maskenplatte, flach bei y. zb(u)/zt(u): Unter-/Oberkante je Spalte u,
    xl(z)/xr(z): linke/rechte Kante je Höhe."""
    verts, faces = [], []
    for j in range(nv + 1):
        v = j / nv
        for i in range(nu + 1):
            u = i / nu
            z = zb(u) + (zt(u) - zb(u)) * v
            x = xl(z) + (xr(z) - xl(z)) * u
            verts.append((x, y, z))
    for j in range(nv):
        for i in range(nu):
            a = j * (nu + 1) + i
            faces.append((a, a + 1, a + nu + 2, a + nu + 1))
    return mesh_obj(name, verts, faces, cname)

def hexcolor(h, a=1.0):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return (*lin, a)

def apply_all(ob, keep=()):
    """Modifikatoren anwenden (außer Namen in keep)."""
    dg = bpy.context.evaluated_depsgraph_get()
    for m in list(ob.modifiers):
        if m.name in keep:
            continue
        with bpy.context.temp_override(object=ob, active_object=ob, selected_objects=[ob]):
            bpy.ops.object.modifier_apply(modifier=m.name)

H['lib_loaded'] = time.time()

# ---------- Oberflächen-Schneidekörper ----------
def shell_side_x(y, z, sx=1):
    a, bv, bh, nv, nh = shell_params(z)
    b, n = (bv, nv) if y < 0 else (bh, nh)
    u = min(abs(y) / b, 0.999)
    return sx * a * (1 - u ** n) ** (1 / n)

def shell_normal(p):
    a, bv, bh, nv, nh = shell_params(p[2])
    b, n = (bv, nv) if p[1] < 0 else (bh, nh)
    gx = n * abs(p[0]) ** (n - 1) / a ** n * sgn(p[0])
    gy = n * abs(p[1]) ** (n - 1) / b ** n * sgn(p[1])
    return Vector((gx, gy, 0)).normalized()

def sweep(name, path, width=0.006, d_in=0.003, d_out=0.03, normals=None, cname='CUTTER'):
    """Rechteckprofil entlang eines Pfads auf der Schale (Nut-Schneidekörper)."""
    P = [Vector(p) for p in path]
    verts, faces = [], []
    for i, p in enumerate(P):
        n = normals[i] if normals else shell_normal(p)
        t = (P[min(i + 1, len(P) - 1)] - P[max(i - 1, 0)]).normalized()
        w = t.cross(n).normalized() * (width / 2)
        verts += [p - n * d_in - w, p - n * d_in + w, p + n * d_out + w, p + n * d_out - w]
    for i in range(len(P) - 1):
        for j in range(4):
            j2 = (j + 1) % 4
            faces.append((4 * i + j, 4 * i + j2, 4 * (i + 1) + j2, 4 * (i + 1) + j))
    faces.append((3, 2, 1, 0)); k = 4 * (len(P) - 1); faces.append((k, k + 1, k + 2, k + 3))
    return verts, faces

def surface_box(center, normal, up, w, h, d_in, d_out):
    """Quader auf einer Oberfläche: w entlang (up x normal), h entlang up."""
    n = Vector(normal).normalized(); u = Vector(up)
    u = (u - n * u.dot(n)).normalized(); r = u.cross(n).normalized()
    c = Vector(center); verts = []
    for d in (-d_in, d_out):
        for sx, sz in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
            verts.append(c + n * d + r * (sx * w / 2) + u * (sz * h / 2))
    faces = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    return verts, faces

def merge_parts(parts):
    V, F = [], []
    for v, f in parts:
        o = len(V); V += [tuple(x) for x in v]; F += [tuple(i + o for i in fc) for fc in f]
    return V, F

def cutter(name, parts, mirror=False):
    V, F = merge_parts(parts)
    o = mesh_obj(name, V, F, cname='CUTTER')
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    # jede Insel einzeln auf positives Volumen prüfen (dünne Sweeps kippen sonst nach innen)
    seen = set()
    for f0 in bm.faces:
        if f0.index in seen: continue
        isl, stack_ = [], [f0]; seen.add(f0.index)
        while stack_:
            f = stack_.pop(); isl.append(f)
            for e in f.edges:
                for g in e.link_faces:
                    if g.index not in seen: seen.add(g.index); stack_.append(g)
        vol = 0.0
        for f in isl:
            vs = [v.co for v in f.verts]
            for i in range(1, len(vs) - 1): vol += vs[0].dot(vs[i].cross(vs[i + 1])) / 6.0
        if vol < 0:
            bmesh.ops.reverse_faces(bm, faces=isl)
    bm.to_mesh(o.data); bm.free()
    o.display_type = 'WIRE'; o.hide_render = True
    if mirror:
        add_mod(o, 'MIRROR', 'Mirror', use_axis=(True, False, False))
    return o

def boolean(target, cut, name, before='Bevel', op='DIFFERENCE'):
    b = target.modifiers.new(name, 'BOOLEAN'); b.operation = op; b.object = cut; b.solver = 'EXACT'
    b.use_self = True   # Lehre Lauf 2: dünne, verformte Platten liefern sonst ein leeres Ergebnis
    names = [m.name for m in target.modifiers]
    if before in names:
        with bpy.context.temp_override(object=target, active_object=target):
            bpy.ops.object.modifier_move_to_index(modifier=name, index=names.index(before))
    return b

# ---------- Prozedurale PBR-Materialien (EEVEE) ----------
def _sock(node, name, out=False):
    socks = node.outputs if out else node.inputs
    for s in socks:
        if s.name == name and s.enabled:
            return s
    return socks[name]

def build_material(name, base, rough, metal, wear_col=None, wear_rough=None, wear_thr=1.15, ns=8.0,
                   bump=0.15, dust=False, scratches=False, emission=None, rvar=0.12, coat=0.0, edge_sheen=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; Lk = nt.links
    N.clear()
    out = N.new('ShaderNodeOutputMaterial'); out.location = (900, 0)
    bs = N.new('ShaderNodeBsdfPrincipled'); bs.location = (600, 0)
    Lk.new(bs.outputs[0], out.inputs[0])
    tc = N.new('ShaderNodeTexCoord'); tc.location = (-1400, 0)
    def noise(scale, detail=6, rgh=0.55, loc=(0, 0), vec=None):
        n = N.new('ShaderNodeTexNoise'); n.location = loc
        n.inputs['Scale'].default_value = scale; n.inputs['Detail'].default_value = detail; n.inputs['Roughness'].default_value = rgh
        Lk.new(vec or tc.outputs['Object'], n.inputs['Vector']); return n
    def mrange(src, a, b, c, d, loc=(0, 0), clamp=True):
        r = N.new('ShaderNodeMapRange'); r.location = loc; r.clamp = clamp
        r.inputs['From Min'].default_value = a; r.inputs['From Max'].default_value = b
        r.inputs['To Min'].default_value = c; r.inputs['To Max'].default_value = d
        Lk.new(src, r.inputs['Value']); return r
    def mix(fac, a, b, loc=(0, 0)):
        x = N.new('ShaderNodeMix'); x.data_type = 'RGBA'; x.location = loc
        Lk.new(fac, x.inputs['Factor'])
        for s, v in ((_sock(x, 'A'), a), (_sock(x, 'B'), b)):
            if isinstance(v, tuple): s.default_value = v
            else: Lk.new(v, s)
        return _sock(x, 'Result', out=True)
    def mixf(fac, a, b, loc=(0, 0)):
        x = N.new('ShaderNodeMix'); x.data_type = 'FLOAT'; x.location = loc
        Lk.new(fac, x.inputs['Factor'])
        for s, v in ((_sock(x, 'A'), a), (_sock(x, 'B'), b)):
            if isinstance(v, float): s.default_value = v
            else: Lk.new(v, s)
        return _sock(x, 'Result', out=True)
    nA = noise(ns, 6, 0.55, (-1100, 300))
    rgh = mrange(nA.outputs['Fac'], 0.3, 0.7, rough - rvar / 2, rough + rvar / 2, (-800, 300)).outputs['Result']
    col = mix(mrange(nA.outputs['Fac'], 0.35, 0.65, 0.0, 1.0, (-800, 500)).outputs['Result'],
              hexcolor(base), tuple(c * 0.92 for c in hexcolor(base)[:3]) + (1.0,), (-500, 500))
    if wear_col:
        at = N.new('ShaderNodeAttribute'); at.attribute_name = 'wear'; at.location = (-1100, -100)
        nB = noise(45.0, 10, 0.65, (-1100, -300))
        ad = N.new('ShaderNodeMath'); ad.operation = 'MULTIPLY_ADD'; ad.location = (-850, -150)
        Lk.new(at.outputs['Fac'], ad.inputs[0]); ad.inputs[1].default_value = 1.3; Lk.new(nB.outputs['Fac'], ad.inputs[2])
        wm = mrange(ad.outputs[0], wear_thr, wear_thr + 0.08, 0.0, 1.0, (-650, -150)).outputs['Result']
        col = mix(wm, col, hexcolor(wear_col), (-300, 400))
        rgh = mixf(wm, rgh, float(wear_rough), (-300, 200))
    if scratches:
        mp = N.new('ShaderNodeMapping'); mp.location = (-1100, -600); mp.inputs['Scale'].default_value = (1.0, 1.0, 14.0)
        mp.inputs['Rotation'].default_value = (0.25, 0.4, 0.9)
        Lk.new(tc.outputs['Object'], mp.inputs['Vector'])
        vo = N.new('ShaderNodeTexVoronoi'); vo.feature = 'DISTANCE_TO_EDGE'; vo.location = (-900, -600)
        vo.inputs['Scale'].default_value = 9.0; Lk.new(mp.outputs['Vector'], vo.inputs['Vector'])
        sl = mrange(vo.outputs['Distance'], 0.0, 0.006, 1.0, 0.0, (-700, -600)).outputs['Result']
        nC = noise(4.0, 2, 0.5, (-900, -800))
        sm = mrange(nC.outputs['Fac'], 0.64, 0.68, 0.0, 1.0, (-700, -800)).outputs['Result']
        mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.location = (-500, -650)
        Lk.new(sl, mul.inputs[0]); Lk.new(sm, mul.inputs[1])
        col = mix(mul.outputs[0], col, hexcolor('#9A988F'), (-100, 400))
        rgh = mixf(mul.outputs[0], rgh, 0.45, (-100, 200))
    if dust:
        ao = N.new('ShaderNodeAmbientOcclusion'); ao.location = (-500, 800); ao.samples = 8
        ao.inputs['Distance'].default_value = 0.04
        dm = mrange(ao.outputs['AO'], 0.35, 0.9, 0.55, 0.0, (-300, 800)).outputs['Result']
        col = mix(dm, col, hexcolor('#A9A396'), (100, 500))
        rgh = mixf(dm, rgh, 0.85, (100, 250))
    Lk.new(col, bs.inputs['Base Color']); Lk.new(rgh, bs.inputs['Roughness'])
    bs.inputs['Metallic'].default_value = metal
    if coat:
        bs.inputs['Coat Weight'].default_value = coat; bs.inputs['Coat Roughness'].default_value = 0.35
    if edge_sheen:
        bs.inputs['Specular IOR Level'].default_value = 0.5 + edge_sheen
    nD = noise(ns * 9, 8, 0.6, (-500, -350))
    bp = N.new('ShaderNodeBump'); bp.location = (300, -300); bp.inputs['Strength'].default_value = bump
    bp.inputs['Distance'].default_value = 0.002
    Lk.new(nD.outputs['Fac'], bp.inputs['Height']); Lk.new(bp.outputs['Normal'], bs.inputs['Normal'])
    if emission:
        bs.inputs['Emission Color'].default_value = hexcolor(emission[0]); bs.inputs['Emission Strength'].default_value = emission[1]
    m.diffuse_color = hexcolor(base)
    return m
