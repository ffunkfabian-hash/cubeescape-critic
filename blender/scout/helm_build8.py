# Lauf 3: Überarbeitung nach Mehransichten-Referenz (Proportionen, Maskenpanels, Ohrmodule, Rückmodul, Schlauch, Material).
import bpy, bmesh, math
from mathutils import Vector, Matrix, Euler
SCHILD = 'Kappe'
H = bpy.app.driver_namespace['H']; L = H['lib']; B = H['build']; P = B['P']
DARK, WHITE, GREY = (0.10, 0.105, 0.115, 1), (0.85, 0.84, 0.81, 1), (0.42, 0.42, 0.40, 1)
fixn, setmat, sharp, cyl, stack, place, bez, raycast, remove = (B[k] for k in ('fixn', 'setmat', 'sharp', 'cyl', 'stack', 'place', 'bez', 'raycast', 'remove'))

def ss(v): v = max(0.0, min(1.0, v)); return v * v * (3 - 2 * v)

def phi(x, y): return math.degrees(math.atan2(abs(x), -(y - 0.05)))

# ---------------------------------------------------------------- 1. Kinnrand v3: kompakt, flaches kantiges V, nah an der Maske
def basis_z(x, y):
    """Unterkante der weißen Unterschale: vorn 0,04, hinten 0,16 (Seitenreferenz)."""
    return 0.04 + 0.12 * ss((phi(x, y) - 60.0) / 100.0)

def band_oben(x, y):
    """Front: flaches V (Mitte 0,15 → Kieferecke 0,30 bei φ 58°); seitlich/hinten Basisband 0,13 über der Unterkante."""
    f = phi(x, y)
    v = 0.15 + 0.15 * max(0.0, min(1.0, (f - 12.0) / 46.0))
    return v + (basis_z(x, y) + 0.13 - v) * ss((f - 58.0) / 34.0)

def band_kanten_xy(x, y):
    zt = band_oben(x, y)
    zb = min(basis_z(x, y), zt - 0.06)
    return zb, zt

def verjuengung_aktiv():
    return True

def guss_unterkante(x, y):
    """Schwarzer Guss: vorn auf dem Rand, ab der Kieferecke die Diagonale zur Schläfe hinauf."""
    f = phi(x, y); u = ss((f - 48.0) / 18.0)
    diag = 0.29 + (0.644 - 0.29) * max(0.0, min(1.0, (y + 0.20) / 0.26))      # Kritik R1: Maske reicht weiter nach hinten
    return (1 - u) * (band_oben(x, y) - 0.012) + u * diag

def band_kanten(y): return band_kanten_xy(0.37, y)

def schale_punkt(i, z, N):
    pts = L['ring'](z, *L['shell_params'](z), N=N)
    x, y, _ = pts[i]
    if y < 0.2: y = max(y, B['F'](x, z) + 0.035)
    return Vector((x, y, z))

def kinnrand(N=192, NV=10, vor=0.070, fase=0.012):   # Kritik R2: Kinnschutz kragt deutlicher vor
    remove('Kinnleiste', 'Kinn_Panel', 'Cut_Kinn', 'Cut_Kinn_Schlitze', 'Kinn_Einsatz')
    ring0 = L['ring'](0.15, *L['shell_params'](0.15), N=N)
    cols = []
    for i in range(N):
        zb, zt = band_kanten_xy(ring0[i][0], ring0[i][1])
        zs = [zb + (zt - zb) * j / NV for j in range(NV + 1)]
        pts = [schale_punkt(i, z, N) for z in zs]
        q0 = schale_punkt((i - 1) % N, zs[0], N); q1 = schale_punkt((i + 1) % N, zs[0], N)
        t = q1 - q0; n = Vector((t.y, -t.x, 0)).normalized()
        if n.dot(Vector((pts[0].x, pts[0].y - 0.05, 0))) < 0: n = -n
        base = max(p.dot(n) for p in pts)
        front = ss((80.0 - phi(pts[0].x, pts[0].y)) / 40.0)
        cols.append([pts, n, base, 0.006 + vor * front, front, zb, zt])          # Kritik R1: hinten/seitlich eng anliegend
    extra = [c[3] for c in cols]                                   # nur den Überstand glätten (nicht den absoluten Abstand)
    for i in range(N):
        cols[i][3] = sum(extra[(i + k) % N] for k in range(-6, 7)) / 13
    S = []
    for pts, n, base, ex, front, zb, zt in cols:
        b0 = Vector((pts[0].x, pts[0].y, 0)); din = base - 0.004; dout = base + ex
        def P_(d, z): return Vector((b0.x, b0.y, z)) + n * (d - b0.dot(n))
        f = fase * (0.6 + 0.6 * front)
        mid = zb + (zt - zb) * 0.45                                  # Stufe in der Außenfläche (gegliederter Rand)
        S.append([P_(din, zb), P_(dout - f, zb), P_(dout, zb + f), P_(dout, mid), P_(dout - 0.008, mid + 0.006),
                  P_(dout - 0.008, zt - f), P_(dout - 0.008 - f, zt), P_(din, zt)])
    M = len(S[0]); V = [tuple(v) for s in S for v in s]; Fc = []
    for i in range(N):
        i2 = (i + 1) % N
        for j in range(M):
            j2 = (j + 1) % M; Fc.append((i * M + j, i2 * M + j, i2 * M + j2, i * M + j2))
    k = L['mesh_obj']('Kinnleiste', V, Fc); fixn(k)
    setmat(k, 'MAT_Weiss'); k.color = WHITE; sharp(k, 35)
    L['bevel'](k, width=0.0025, seg=2, angle=35); L['wnormal'](k)
    for s in ('R', 'L'):
        o = bpy.data.objects.get('Schale_Griffpanel_' + s)
        if o: o.hide_set(True); o.hide_render = True
    # hellgrauer Einsatz direkt unter dem Mittelstück, Vorderfläche darunter geschlossen
    zt = band_oben(0, -0.4)
    hm = raycast(['Maske_Nase'], Vector((0, -1, zt + 0.02)), Vector((0, 1, 0)))
    y0 = (hm[0].y if hm else -0.48) + 0.002
    tv = [(-0.055, zt - 0.005), (0.055, zt - 0.005), (0.04, zt + 0.03), (-0.04, zt + 0.03)]
    V2 = [(x, y0, z) for x, z in tv] + [(x, y0 + 0.06, z) for x, z in tv]
    e = L['mesh_obj']('Kinn_Einsatz', V2, [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)])
    fixn(e); setmat(e, 'MAT_Modul'); L['bevel'](e, width=0.004, seg=2); L['smooth'](e)
    H['kinn_y'] = min((k.matrix_world @ v.co).y for v in k.data.vertices)
    return {'vorn': round(band_oben(0, -0.4), 3), 'seite': round(band_oben(0.37, -0.1), 3)}

# ---------------------------------------------------------------- 2. Weiße Schale endet am Rand (kein Halskragen)
def schale_kurz():
    """Weiße Schale endet an der Unterkante des Basisbands (kein sichtbarer Halskragen)."""
    s = bpy.data.objects['Schale']; me = s.data
    bm = bmesh.new(); bm.from_mesh(me)
    kill = []
    for f in bm.faces:
        c = s.matrix_world @ f.calc_center_median()
        zb, zt = band_kanten_xy(c.x, c.y)
        if c.z < basis_z(c.x, c.y) + 0.01: kill.append(f)
    bmesh.ops.delete(bm, geom=kill, context='FACES')
    bm.to_mesh(me); bm.free(); me.update()
    return {'entfernt': len(kill)}

def hals_dunkel():
    h = bpy.data.objects.get('Hals')
    if h: h.scale = (1.06, 1.06, 1.0); h.location.z = 0.0

# ---------------------------------------------------------------- 3. Maske: Mittelstück schmal und gestuft, Panels trapezförmig
def nase():
    remove('Maske_Nase', 'Maske_Nase_Stufe', 'Cut_Nase')
    hf = bpy.data.objects['Maske_Traegerhuelle']
    def plate(name, z0, z1, w0, w1, off, th):
        nu, nv = 6, 10; V = []; Fc = []
        for j in range(nv + 1):
            z = z0 + (z1 - z0) * j / nv; hw = w0 + (w1 - w0) * (z - z0) / (z1 - z0)
            for i in range(nu + 1): V.append((-hw + 2 * hw * i / nu, -0.40, z))
        for j in range(nv):
            for i in range(nu):
                a = j * (nu + 1) + i; Fc.append((a, a + 1, a + nu + 2, a + nu + 1))
        o = L['mesh_obj'](name, V, Fc); o.color = DARK; setmat(o, 'MAT_Dunkel')
        L['add_mod'](o, 'SHRINKWRAP', 'Shrinkwrap', wrap_method='PROJECT', use_project_y=True, use_negative_direction=False,
                     use_positive_direction=True, target=bpy.data.objects[SCHILD], offset=off, wrap_mode='OUTSIDE_SURFACE')
        o.modifiers['Shrinkwrap'].use_negative_direction = True; o.modifiers['Shrinkwrap'].cull_face = 'OFF'
        L['add_mod'](o, 'SOLIDIFY', 'Solidify', thickness=th, offset=-1, use_even_offset=False, thickness_clamp=1.0)
        L['bevel'](o, width=0.004, seg=2, angle=30); L['wnormal'](o); L['smooth'](o)
        return o
    zt = band_oben(0, -0.4) + 0.02
    plate('Maske_Nase', zt - 0.015, 0.44, 0.080, 0.032, 0.008, 0.016)          # Kritik R2: Keil bis zum Kinnrand
    plate('Maske_Nase_Stufe', zt + 0.01, 0.37, 0.050, 0.022, 0.022, 0.014)

def fugen():
    remove('Cut_Schild_Fugen', 'Cut_Wange')
    k = bpy.data.objects[SCHILD]
    for mn in ('Fugen', 'Wangendetails'):
        if mn in k.modifiers: k.modifiers.remove(k.modifiers[mn])
    bpy.context.evaluated_depsgraph_get().update()
    def proj(pts):
        hs = [raycast([SCHILD], Vector((x, -1.2, z)), Vector((0, 1, 0))) for x, z in pts]
        hs = [h for h in hs if h]
        return [h[0] for h in hs], [(-h[1] if h[1].y > 0 else h[1]) for h in hs]
    def lin(a, b, n): return [a + (b - a) * i / n for i in range(n + 1)]
    paths = []
    for sx in (1, -1):
        # Fuge unter den Augen: vom Mittelstück waagerecht nach außen, dann schräg der Kieferlinie folgend nach unten
        a = [(sx * x, 0.468) for x in lin(0.075, 0.25, 8)] + [(sx * (0.25 + 0.06 * t), 0.468 - 0.11 * t) for t in lin(0.05, 1.0, 6)]
        paths.append(proj(a))
        # untere Panelgrenze: vom Mittelstück schräg nach außen-oben (trapezförmige Seitenpanels)
        paths.append(proj([(sx * (0.075 + 0.20 * t), 0.24 + 0.13 * t) for t in lin(0, 1, 12)]))
        # senkrechte Fuge neben dem Mittelstück
        paths.append(proj([(sx * 0.072, z) for z in lin(band_oben(0, -0.4) + 0.02, 0.468, 10)]))
        # Schläfe: Fuge zwischen Gesicht und seitlichem Panzerteil
        paths.append(proj([(sx * (0.315 + 0.03 * t), 0.47 + 0.20 * t) for t in lin(0, 1, 10)]))
    parts = [L['sweep']('f', p, width=0.005, d_in=0.003, d_out=0.03, normals=n) for p, n in paths if len(p) > 2]
    c = L['cutter']('Cut_Schild_Fugen', parts); setmat(c, 'MAT_Dunkel')
    L['boolean'](k, c, 'Fugen'); c.hide_set(True)

def schlaefenpanzer():
    """Ersetzt die runden Scheiben: kantige seitliche Befestigungsteile neben den Augen (vertikal, abgestuft)."""
    remove('Maske_Gelenk_R', 'Maske_Gelenk_L', 'Schlaefe_R', 'Schlaefe_L', 'Schlaefe_Klemme_R', 'Schlaefe_Klemme_L')
    for side, sx in (('R', 1), ('L', -1)):
        h = raycast([SCHILD], Vector((sx * 0.8, -0.24, 0.56)), Vector((-sx, 0, 0)))
        if not h: continue
        p, n = h[0], (h[1] if h[1].x * sx > 0 else -h[1])
        up = Vector((0, 0.18, 1)).normalized()
        v, f = L['surface_box'](p, n, up, 0.038, 0.12, 0.004, 0.016)   # Kritik R2: kleiner
        o = L['mesh_obj']('Schlaefe_' + side, [tuple(x) for x in v], f); fixn(o); setmat(o, 'MAT_Dunkel'); o.color = DARK
        L['bevel'](o, width=0.006, seg=2, angle=30); L['wnormal'](o); L['smooth'](o)
        v2, f2 = L['surface_box'](p + n * 0.022 + up * 0.03, n, up, 0.035, 0.05, 0.0, 0.012)
        o2 = L['mesh_obj']('Schlaefe_Klemme_' + side, [tuple(x) for x in v2], f2); fixn(o2); setmat(o2, 'MAT_Dunkel')
        L['bevel'](o2, width=0.003, seg=2, angle=30); L['smooth'](o2)

# ---------------------------------------------------------------- 4. Ohrmodule, Antennen
def ohrmodule():
    remove(*[f'{n}_{s}' for n in ('Ohrmodul', 'Ohrmodul_Ring', 'Ohrmodul_Kappe', 'Ohrmodul_Halter', 'Antenne', 'Antenne_Stummel') for s in 'RL'])
    PY, PZ = 0.04, 0.60
    for side, sx in (('R', 1), ('L', -1)):
        h = raycast(['Schale', 'Kappe'], Vector((sx * 1.0, PY, PZ)), Vector((-sx, 0, 0)))
        x0 = abs(h[0].x) if h else 0.39
        # länglicher Körper: Superellipsoid-Kapsel, Achse senkrecht
        N, R = 32, 14; V = []; Fc = []
        a, b, c = 0.032, 0.055, 0.10                                        # Kritik R1/R2: kleiner, flacher
        for j in range(R + 1):
            t = -1 + 2 * j / R; zz = c * t; s = (1 - abs(t) ** 2.6) ** (1 / 2.6)
            for i in range(N):
                th = 2 * math.pi * i / N; cs, sn = math.cos(th), math.sin(th)
                V.append((sx * (x0 + 0.028 + a * s * L['sgn'](cs) * abs(cs) ** (2 / 2.4)), PY + b * s * L['sgn'](sn) * abs(sn) ** (2 / 2.4), PZ + zz))
        for j in range(R):
            for i in range(N):
                f_ = (j * N + i, j * N + (i + 1) % N, (j + 1) * N + (i + 1) % N, (j + 1) * N + i); Fc.append(f_ if sx > 0 else tuple(reversed(f_)))
        o = L['mesh_obj']('Ohrmodul_' + side, V, Fc); fixn(o); setmat(o, 'MAT_Modul'); o.color = GREY
        bm = bmesh.new(); bm.from_mesh(o.data); bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5); bm.to_mesh(o.data); bm.free()
        L['smooth'](o); L['add_mod'](o, 'SUBSURF', 'Subdivision', levels=1, render_levels=2)
        # dunkle Kreisdetails außen
        outer = Vector((sx * (x0 + 0.028 + a), PY, PZ))
        place('Ohrmodul_Ring_' + side, stack([(cyl(0.032, 0.008, 40), -0.006), (cyl(0.022, 0.006, 40), 0.002)]), outer + Vector((0, 0, 0.03)), (sx, 0, 0), 'MAT_Dunkel', DARK)
        place('Ohrmodul_Kappe_' + side, cyl(0.016, 0.006, 32, 0.003), outer + Vector((0, 0.0, -0.06)), (sx, 0, 0), 'MAT_Dunkel', DARK)
        # Halter zur Schale
        v, f = L['surface_box'](Vector((sx * (x0 + 0.01), PY, PZ + 0.10)), Vector((sx, 0, 0)), (0, 0, 1), 0.05, 0.06, 0.0, 0.04)
        hb = L['mesh_obj']('Ohrmodul_Halter_' + side, [tuple(x) for x in v], f); fixn(hb); setmat(hb, 'MAT_Dunkel'); L['bevel'](hb, width=0.004, seg=2); L['smooth'](hb)
    # Antennen: links lang, rechts kurzer Stummel (Frontreferenz)
    top = Vector((-(0.39 + 0.028), PY - 0.01, PZ + 0.11))
    V, Fc = stack([(cyl(0.012, 0.03, 16), 0.0), (cyl(0.008, 0.10, 16), 0.03), (cyl(0.0055, 0.36, 12), 0.13)])
    an = L['mesh_obj']('Antenne_L', V, Fc); an.location = top; an.rotation_euler = Euler((0, math.radians(-4), 0))
    setmat(an, 'MAT_Dunkel'); an.color = DARK; sharp(an, 34)
    V, Fc = stack([(cyl(0.018, 0.02, 20), 0.0), (cyl(0.014, 0.16, 20), 0.02), (cyl(0.016, 0.012, 20), 0.18)])
    st = L['mesh_obj']('Antenne_Stummel_R', V, Fc); st.location = Vector((0.39 + 0.028, PY + 0.02, PZ + 0.11))
    setmat(st, 'MAT_Dunkel'); st.color = DARK; sharp(st, 34)
    H['ohr'] = (PY, PZ)

# ---------------------------------------------------------------- 5. Rückmodul und Spiralschlauch
def rueckmodul(sx=1.0, sy=1.25, sz=1.0):
    """Rückmodul als eigenständiger, aufgesetzter Körper: um die eigene Mitte vergrößert und nach außen versetzt."""
    o = bpy.data.objects['Rueckbox']
    vs = [o.matrix_world @ v.co for v in o.data.vertices]
    c = Vector((0, sum(v.y for v in vs) / len(vs), sum(v.z for v in vs) / len(vs)))
    yfront = min(v.y for v in vs)
    M = Matrix.Translation(c) @ Matrix.Diagonal((sx, sy, sz, 1.0)) @ Matrix.Translation(-c)
    o.data.transform(M); o.data.update()
    vs2 = [v.co for v in o.data.vertices]; dy = yfront - min(v.y for v in vs2)
    o.data.transform(Matrix.Translation((0, dy, 0)))
    yback = max(v.co.y for v in o.data.vertices); old_back = max(v.y for v in vs)
    for n in ('Rueckbox_Platte', 'Rueckbox_Hebel', 'Rueckbox_Hebel_Arm', 'Cut_Rueckbox_Platte', 'Cut_Rueckbox_Kratzer'):
        ob = bpy.data.objects.get(n)
        if not ob: continue
        if ob.type == 'MESH':
            ob.data.transform(Matrix.Translation((0, 0, c.z)) @ Matrix.Diagonal((sx, 1, sz, 1)) @ Matrix.Translation((0, 0, -c.z)))
        ob.location.y += yback - old_back
    remove('Rueckbox_Antenne')
    V, Fc = stack([(cyl(0.010, 0.02, 16), 0.0), (cyl(0.005, 0.40, 12), 0.02)])
    a = L['mesh_obj']('Rueckbox_Antenne', V, Fc); a.location = (0.13, yback - 0.03, c.z + 0.12 * sz)
    a.rotation_euler = Euler((math.radians(-10), math.radians(6), 0)); setmat(a, 'MAT_Dunkel'); sharp(a, 34)
    H['box'] = (c, yback)
    return {'mitte': [round(v, 3) for v in c], 'hinten': round(yback, 3)}

def schlauch():
    remove('Kabel_R', 'Kabel_L', 'Kabel_Huelse_R0', 'Kabel_Huelse_R1', 'Kabel_Huelse_L0', 'Kabel_Huelse_L1', 'Kabel_Pfad_R', 'Kabel_Pfad_L',
           'Schlauch_Stecker_R', 'Schlauch_Stecker_L', 'Schlauch_Anschluss_R', 'Schlauch_Anschluss_L')
    PY, PZ = H['ohr']
    H['cable_start'] = {}; ends = {}
    for side, sx in (('R', 1), ('L', -1)):
        s0 = Vector((sx * 0.44, PY + 0.02, PZ - 0.13))
        place('Schlauch_Stecker_' + side, stack([(cyl(0.014, 0.03, 24), 0.0), (cyl(0.010, 0.02, 16), 0.03)]), s0 + Vector((0, 0, 0.03)), (0, 0, -1), 'MAT_Metall', (0.45, 0.45, 0.46, 1))
        H['cable_start'][side] = s0 - Vector((0, 0, 0.02))
        c, yb = H['box']; e = Vector((sx * 0.19, yb - 0.06, c.z - 0.03))
        place('Schlauch_Anschluss_' + side, stack([(cyl(0.02, 0.03, 24), 0.0), (cyl(0.022, 0.01, 6), 0.01)]), e, (sx, 0, 0), 'MAT_Metall', (0.45, 0.45, 0.46, 1))
        ends[side] = e + Vector((sx * 0.03, 0, 0))
    H['cable_paths'] = {}
    for side, sx in (('R', 1), ('L', -1)):
        s0 = H['cable_start'][side]; e = ends[side]
        ctrl = [s0, s0 + Vector((0, 0.01, -0.04)), Vector((sx * 0.43, 0.16, 0.40)), Vector((sx * 0.41, 0.34, 0.44)),
                Vector((sx * 0.33, 0.50, 0.52)), Vector((sx * 0.25, 0.57, 0.58)), e + Vector((sx * 0.04, 0, 0)), e]   # Kritik R1: eng an der Schale
        pts, length = B['catmull'](ctrl); H['cable_paths'][side] = (pts, length)
        pf = bez('Kabel_Pfad_' + side, [[tuple(p) for p in pts]], 0.002, 'MAT_Kabel', (1, 0.5, 0.1, 1), poly=True)
        for cc in list(pf.users_collection): cc.objects.unlink(pf)
        L['coll']('CUTTER').objects.link(pf)
    B['kabel_spirale']()
    for o in bpy.data.objects:
        if o.name.startswith('Kabel_') and o.type == 'CURVE':
            o.data.materials.clear(); o.data.materials.append(bpy.data.materials['MAT_Kabel'])

# ---------------------------------------------------------------- 6. Material
def material_matt():
    L['build_material']('MAT_Dunkel', '#2B2D30', 0.74, 0.05, wear_col='#4A4C50', wear_rough=0.6, wear_thr=1.15, ns=7, bump=0.12, rvar=0.08)
    b = bpy.data.materials['MAT_Dunkel'].node_tree.nodes.get('Principled BSDF')
    if b: b.inputs['Specular IOR Level'].default_value = 0.32
    L['build_material']('MAT_Weiss', '#D3D1CB', 0.70, 0.0, wear_col='#8E8C86', wear_rough=0.5, wear_thr=1.12, ns=6, bump=0.06, scratches=True)
    L['build_material']('MAT_Modul', '#5E5C50', 0.62, 0.15, wear_col='#8C8A82', wear_rough=0.45, wear_thr=1.15, ns=9, bump=0.08)
    L['build_material']('MAT_Kabel', '#141414', 0.5, 0.0, ns=30, bump=0.25, rvar=0.12)

def schmutz():
    """Zurückhaltende Gebrauchsspuren auf Weiß: großflächige Noise-Verschmutzung (kein AO – rauscht)."""
    m = bpy.data.materials['MAT_Weiss']; nt = m.node_tree; N = nt.nodes; Lk = nt.links
    bs = N.get('Principled BSDF'); src = bs.inputs['Base Color'].links[0].from_socket
    tc = N.new('ShaderNodeTexCoord'); nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 3.5; nz.inputs['Detail'].default_value = 8
    Lk.new(tc.outputs['Object'], nz.inputs['Vector'])
    mr = N.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = 0.55; mr.inputs['From Max'].default_value = 0.75
    mr.inputs['To Max'].default_value = 0.12; Lk.new(nz.outputs['Fac'], mr.inputs['Value'])   # Kritik R2: weniger fleckig
    mx = N.new('ShaderNodeMix'); mx.data_type = 'RGBA'
    Lk.new(mr.outputs['Result'], mx.inputs['Factor'])
    Lk.new(src, [s for s in mx.inputs if s.name == 'A' and s.enabled][0])
    [s for s in mx.inputs if s.name == 'B' and s.enabled][0].default_value = L['hexcolor']('#9D988C')
    Lk.new([s for s in mx.outputs if s.name == 'Result' and s.enabled][0], bs.inputs['Base Color'])

def kinnschrauben_weg():
    n = 0
    for o in list(bpy.data.objects):
        p = o.matrix_world.translation
        if o.name.startswith('Schraube_') and p.y < -0.35 and p.z < 0.20 and abs(p.x) < 0.15:
            bpy.data.objects.remove(o, do_unlink=True); n += 1
    return n

for k_, v in list(globals().items()):
    if callable(v) and not k_.startswith('_'): B[k_] = v
