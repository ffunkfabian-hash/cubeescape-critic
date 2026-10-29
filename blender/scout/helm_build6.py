# Lauf 2d: Kopfhörer/Kabel ausbauen, Haube bis zur Braue (Stirn–Scheitel = eine Fläche), Augenhöhlen.
import bpy, bmesh, math
from mathutils import Vector
SCHILD = 'Kappe'   # Lauf 2e: Haube und Gesichtsschild sind ein Teil
H = bpy.app.driver_namespace['H']; L = H['lib']; B = H['build']; P = B['P']
DARK = (0.10, 0.105, 0.115, 1)

AUSBAU = ('Pod_', 'Rueckbox_Anschluss_', 'Antenne_R', 'Cut_Pod_Dreieck_', 'Kopfgurt', 'Gurt_', 'Lug_', 'Maske_Halter_', 'Maske_Gelenk_')

def ausbauen():
    c = bpy.data.collections.get('AUSGEBAUT')
    if c is None:
        c = bpy.data.collections.new('AUSGEBAUT'); bpy.context.scene.collection.children.link(c)
    fuss = [o.matrix_world.translation.copy() for o in bpy.data.objects if o.name.startswith('Pod_Buegel_Fuss')]
    moved = []
    for o in list(bpy.data.objects):
        hit = o.name.startswith(AUSBAU)
        if o.name.startswith('Schraube_') and any((o.matrix_world.translation - f).length < 0.03 for f in fuss): hit = True
        if hit and c not in o.users_collection:
            for cc in list(o.users_collection): cc.objects.unlink(o)
            c.objects.link(o); moved.append(o.name)
    lc = bpy.context.view_layer.layer_collection.children.get('AUSGEBAUT')
    if lc: lc.exclude = True
    return len(moved)

BROW = 0.648   # Brauenlinie: Schild endet hier, darüber nur noch Haube

def kappe_unterkante(y):
    """Unterkante der Haube je y: vorn auf Brauenhöhe bis zur Schild-Hinterkante, dann weich zur Krempe."""
    v = max(0.0, min(1.0, (y + 0.03) / 0.12)); s = v * v * (3 - 2 * v)
    return BROW - 0.004 + (0.765 - BROW + 0.004) * s

def psmax(a, b, k):
    h = max(k - abs(a - b), 0.0) / k
    return max(a, b) + h * h * k * 0.25

def kappe_braue(N=128, R=40, k=0.05):
    B['remove']('Kappe')
    c = P['cap']
    def pt(i, t):
        z = c['zc'] + c['c'] * t
        ax = c['a'] * (1 - t ** c['ex']) ** (1 / c['ex'])
        byf = c['bf'] * (1 - t ** c['eyf']) ** (1 / c['eyf']); byb = c['bb'] * (1 - t ** c['eyb']) ** (1 / c['eyb'])
        th = 2 * math.pi * i / N; cs, sn = math.cos(th), math.sin(th)
        n_ = 2.6 if sn < 0 else 2.2; b = byf if sn < 0 else byb
        x = ax * L['sgn'](cs) * abs(cs) ** (2 / n_); y = b * L['sgn'](sn) * abs(sn) ** (2 / n_) + c['yc']
        if y < 0.15:
            y = psmax(y, B['F'](x, z) - 0.002 - B['RID'] * B['ridge_w'](z) * max(0.0, 1 - abs(x) / 0.38), k)
        return (x, y, z)
    V = []
    for i in range(N):
        lo, hi = 0.0, 0.999                                  # Spalte: Startparameter auf der Unterkante (Bisektion)
        for _ in range(40):
            mid = 0.5 * (lo + hi); x, y, z = pt(i, mid)
            if z < kappe_unterkante(y): lo = mid
            else: hi = mid
        t0 = hi
        for j in range(R):
            s = (j / (R - 1)) ** 0.85; V.append(pt(i, t0 + (0.999 - t0) * s))
    Fc = []
    for i in range(N):
        i2 = (i + 1) % N
        for j in range(R - 1):
            Fc.append((i * R + j, i2 * R + j, i2 * R + j + 1, i * R + j + 1))
    top = len(V); V.append((0, c['yc'], c['zc'] + c['c']))
    Fc += [(i * R + R - 1, ((i + 1) % N) * R + R - 1, top) for i in range(N)]
    me = bpy.data.meshes.get('Kappe') or bpy.data.meshes.new('Kappe'); me.clear_geometry(); me.from_pydata(V, [], Fc); me.update()
    o = bpy.data.objects.new('Kappe', me); L['coll']('HELM_V3').objects.link(o); o.parent = bpy.data.objects['HELM_ROOT']
    B['fixn'](o)
    if o.data.polygons[len(o.data.polygons) // 2].normal.z < -0.5:
        for p in o.data.polygons: p.flip()
    o.color = DARK; B['setmat'](o, 'MAT_Dunkel'); L['smooth'](o)
    L['add_mod'](o, 'SUBSURF', 'Subdivision', levels=1, render_levels=2)
    L['add_mod'](o, 'SOLIDIFY', 'Solidify', thickness=0.015, offset=-1, use_even_offset=False, thickness_clamp=1.0)
    return o

def schild_braue():
    B['remove']('Blk_Maske', 'Blk_Seite_R', 'Blk_Seite_L')
    ZS = [0.215, 0.25, 0.30, 0.36, 0.40, 0.42, 0.46, 0.50, 0.55, 0.60, 0.625, BROW]
    rings = [B['schild_ring'](z) for z in ZS]
    o = L['loft']('Maske_Schild', [[tuple(p) for p in r] for r in rings], close_ring=False); B['fixn'](o)
    if o.data.polygons[len(o.data.polygons) // 2].normal.y > 0:
        for pp in o.data.polygons: pp.flip()
    B['setmat'](o, 'MAT_Dunkel'); o.color = DARK; B['sharp'](o, 22)
    L['add_mod'](o, 'SOLIDIFY', 'Solidify', thickness=0.012, offset=-1, use_even_offset=False, thickness_clamp=1.0)
    L['bevel'](o, width=0.004, seg=2, angle=40); L['wnormal'](o)

# ---------------------------------------------------------------- Augenhöhlen
def eye_outline(m=0.0):
    e = P.get('eye', (0.11, 0.26, 0.530, 0.548, 0.608, 0.572))      # x_innen, x_außen, z_unten_innen, z_unten_außen, z_oben_außen, z_oben_innen
    xi, xo, zbi, zbo, zto, zti = e
    return [(xi - m, zbi - m), (xo + m, zbo - m), (xo + m, zto + m), (xi - m, zti + m)]

def sample_outline(ol, per=8):
    pts = []
    for i in range(4):
        (x0, z0), (x1, z1) = ol[i], ol[(i + 1) % 4]
        for k in range(per): t = k / per; pts.append((x0 + (x1 - x0) * t, z0 + (z1 - z0) * t))
    return pts

def augenhoehlen(depth=0.026, margin=0.016):
    sch = bpy.data.objects[SCHILD]
    for mn in ('Augenschlitze',):
        if mn in sch.modifiers: sch.modifiers.remove(sch.modifiers[mn])
    B['remove']('Cut_Auge', 'Auge_R', 'Auge_L', 'Augenhoehle_R', 'Augenhoehle_L', 'Cut_Augenhoehle')
    bpy.context.evaluated_depsgraph_get().update()
    outer = sample_outline(eye_outline(margin)); inner = sample_outline(eye_outline(0.0))
    def surf(x, z):
        h = B['raycast']([SCHILD], Vector((x, -1.2, z)), Vector((0, 1, 0)))
        n = h[1] if h[1].y < 0 else -h[1]; return h[0], n
    cut_parts = []
    for side, sx in (('R', 1), ('L', -1)):
        so = [surf(sx * x, z) for x, z in outer]; si = [surf(sx * x, z) for x, z in inner]
        nav = sum((n for p, n in so), Vector()).normalized()
        A = [p + nav * 0.002 for p, n in so]                    # Rand der Höhle (Oberfläche)
        Bd = [p - nav * depth for p, n in si]                   # Boden (Schlitzkontur, tief)
        V = [tuple(v) for v in A + Bd]; M = len(A); Fc = []
        for i in range(M):
            i2 = (i + 1) % M; Fc.append((i, i2, M + i2, M + i))
        o = L['mesh_obj']('Augenhoehle_' + side, V, Fc); B['fixn'](o)
        # Normalen nach innen-vorn (zur Kamera der Höhle hin) ausrichten
        cen = sum((Vector(v) for v in V), Vector()) / len(V)
        if o.data.polygons[0].normal.dot(-nav) < 0 and (o.data.polygons[0].center - cen).dot(nav) < 1:
            pass
        B['setmat'](o, 'MAT_Dunkel'); o.color = DARK; B['sharp'](o, 30)
        L['add_mod'](o, 'SOLIDIFY', 'Solidify', thickness=0.004, offset=1)
        # Leuchteinlage als Boden
        Vi = [tuple(p - nav * (depth - 0.001)) for p, n in si]
        ins = L['mesh_obj']('Auge_' + side, Vi, [tuple(range(len(Vi)))]); B['fixn'](ins)
        if ins.data.polygons[0].normal.dot(nav) < 0: ins.data.polygons[0].flip()
        B['setmat'](ins, 'MAT_Leucht'); ins.color = (0.5, 0.9, 0.88, 1)
        # Schneidekörper: Höhlenwand, nach außen verlängert, minimal größer
        Aout = [a + nav * 0.04 + (a - sum(A, Vector()) / M) * 0.03 for a in A]
        Ac = [a + (a - sum(A, Vector()) / M) * 0.01 for a in A]
        Bc = [b - nav * 0.006 + (b - sum(Bd, Vector()) / M) * 0.01 for b in Bd]
        Vc = [tuple(v) for v in Aout + Ac + Bc]; Fcc = []
        for r in range(2):
            for i in range(M):
                i2 = (i + 1) % M; Fcc.append((r * M + i, r * M + i2, (r + 1) * M + i2, (r + 1) * M + i))
        Fcc.append(tuple(range(M - 1, -1, -1))); Fcc.append(tuple(range(2 * M, 3 * M)))
        cut_parts.append((Vc, Fcc))
    c = L['cutter']('Cut_Augenhoehle', cut_parts); B['setmat'](c, 'MAT_Dunkel')
    L['boolean'](sch, c, 'Augenhoehlen'); c.hide_set(True)

for k, v in list(globals().items()):
    if callable(v) and not k.startswith('_'): B[k] = v
B['BROW'] = BROW

def kuppel_fit2(rounds=2):
    from mathutils.bvhtree import BVHTree
    dg = bpy.context.evaluated_depsgraph_get(); vf = bpy.data.objects['Vorlage_Form']
    tree = BVHTree.FromObject(vf, dg, deform=False); inv = vf.matrix_world.inverted()
    def pts(c):
        out = []; N, R = 48, 18
        for j in range(R):
            t = (j / R) ** 0.85; z = c['zc'] + c['c'] * t
            ax = c['a'] * (1 - t ** c['ex']) ** (1 / c['ex'])
            byf = c['bf'] * (1 - t ** c['eyf']) ** (1 / c['eyf']); byb = c['bb'] * (1 - t ** c['eyb']) ** (1 / c['eyb'])
            for x, y, zz in L['ring'](z, ax, byf, byb, 2.6, 2.2, N=N, yc=c['yc']):
                if y < 0.15: y = psmax(y, B['F'](x, z) - 0.002 - B['RID'] * B['ridge_w'](z) * max(0.0, 1 - abs(x) / 0.38), 0.05)
                if zz >= kappe_unterkante(y) and zz > 0.66: out.append(Vector((x, y, zz)))
        return out
    def cost(c):
        ds = sorted(tree.find_nearest(inv @ p)[3] for p in pts(c)); return ds[len(ds) // 2] + 0.5 * ds[int(len(ds) * 0.8)]
    c = dict(P['cap']); best = cost(c); start = best
    steps = {'c': 0.02, 'zc': 0.02, 'a': 0.02, 'bf': 0.04, 'bb': 0.03, 'yc': 0.02, 'ex': 0.3, 'eyf': 0.3, 'eyb': 0.3}
    for r in range(rounds):
        for k_, s in steps.items():
            for sgn in (1, -1):
                while True:
                    c2 = dict(c); c2[k_] = c[k_] + sgn * s
                    if abs(c2['zc'] + c2['c'] - 1.0) > 0.02: break
                    v = cost(c2)
                    if v < best - 1e-5: c, best = c2, v
                    else: break
        steps = {k_: s / 2 for k_, s in steps.items()}
    return c, round(start, 4), round(best, 4)

B['psmax'] = psmax; B['kuppel_fit2'] = kuppel_fit2

# ---------------------------------------------------------------- Lauf 2e: Haube + Gesichtsschild aus EINER Fläche
def unterkante_guss(y, x=None):
    def ss(v): v = max(0.0, min(1.0, v)); return v * v * (3 - 2 * v)
    if x is not None and 'guss_unterkante' in B and y < -0.02:
        return B['guss_unterkante'](x, y)
    if x is not None and 'band_oben' in B and y < -0.02:
        zb = B['band_oben'](x, y) - 0.012               # Schirm sitzt auf dem Kinnrand (Lauf 2g)
        if y < -0.16: return zb
        u = ss((y + 0.16) / 0.14)                       # stetig in die Schläfendiagonale übergehen (kein Sprung → keine Falte)
        zd = 0.42 + (BROW - 0.004 - 0.42) * max(0.0, (y + 0.12) / 0.10)
        return zb * (1 - u) + max(zb, zd) * u
    if y < -0.32: return 0.215
    if y < -0.12: return 0.215 + (0.42 - 0.215) * ss((y + 0.32) / 0.20)
    if y < -0.02: return 0.42 + (BROW - 0.004 - 0.42) * ((y + 0.12) / 0.10)
    return kappe_unterkante(y)

def guss(N=160, R=72, k=0.05):
    c = P['cap']; HU = H['huelle']
    def ss(v): v = max(0.0, min(1.0, v)); return v * v * (3 - 2 * v)
    def pt(i, u):
        if u >= 0:
            t = u; z = c['zc'] + c['c'] * t
            ax = c['a'] * (1 - t ** c['ex']) ** (1 / c['ex'])
            bf = c['bf'] * (1 - t ** c['eyf']) ** (1 / c['eyf']); bb = c['bb'] * (1 - t ** c['eyb']) ** (1 / c['eyb'])
            yc, nf = c['yc'], 2.6
        else:
            z = c['zc'] + u * (c['zc'] - 0.20)
            a_, bv, bh, nv, nh = L['shell_params'](z, HU)
            w = ss((u + 0.35) / 0.35)                        # weicher Übergang Schale+0.02 → Kuppel-Äquator
            ax = (a_ + 0.02) * (1 - w) + c['a'] * w; bf = (bv + 0.02) * (1 - w) + c['bf'] * w
            bb = (bh + 0.02) * (1 - w) + c['bb'] * w; yc = c['yc'] * w; nf = 3.0 * (1 - w) + 2.6 * w
        th = 2 * math.pi * i / N; cs, sn = math.cos(th), math.sin(th)
        n_ = nf if sn < 0 else 2.2; b = bf if sn < 0 else bb
        x = ax * L['sgn'](cs) * abs(cs) ** (2 / n_); y = b * L['sgn'](sn) * abs(sn) ** (2 / n_) + yc
        if y < 0.15:
            y = psmax(y, B['F'](x, z) - 0.002 - B['RID'] * B['ridge_w'](z) * max(0.0, 1 - abs(x) / 0.38), k)
        return (x, y, z)
    V = []
    for i in range(N):
        lo, hi = -1.0, 0.999
        for _ in range(48):
            mid = 0.5 * (lo + hi); x, y, z = pt(i, mid)
            if z < unterkante_guss(y, x): lo = mid
            else: hi = mid
        u0 = hi
        col = [Vector(pt(i, u0 + (0.999 - u0) * (j / (R - 1)))) for j in range(R)]
        z0 = col[0].z
        for p in col:
            seite = ss((p.y + 0.10) / 0.06) * (1.0 if p.y < 0.10 else 0.0)        # nur hinter der Schläfe (an der Diagonale faltet es)
            w = seite * (1 - ss((p.z - z0) / P.get('auslauf', 0.08)))
            if w > 0:
                d = Vector((p.x, p.y, 0)); r = d.length
                if r > 1e-6:
                    d /= r; a_, bv, bh, nv, nh = L['shell_params'](p.z)
                    b_, n_ = (bv, nv) if d.y < 0 else (bh, nh)
                    rs = 1.0 / ((abs(d.x) / a_) ** n_ + (abs(d.y) / b_) ** n_) ** (1.0 / n_)
                    s = d * rs; s.z = p.z
                    if s.y < 0.2: s.y = max(s.y, B['F'](s.x, p.z) + 0.035)
                    tgt = s + Vector((d.x, d.y, 0)) * 0.004
                    gap = (p - Vector((0, 0, p.z))).length - (tgt - Vector((0, 0, p.z))).length
                    if gap > 0:
                        p[:] = p.lerp(tgt, w * ss((0.03 - gap) / 0.015))   # nur wo der Guss nah an der Schale liegt (keine Falte)
            V.append(tuple(p))
    Fc = []
    for i in range(N):
        i2 = (i + 1) % N
        for j in range(R - 1): Fc.append((i * R + j, i2 * R + j, i2 * R + j + 1, i * R + j + 1))
    top = len(V); V.append((0, c['yc'], c['zc'] + c['c']))
    Fc += [(i * R + R - 1, ((i + 1) % N) * R + R - 1, top) for i in range(N)]
    me = bpy.data.meshes.new('Kappe_guss'); me.from_pydata(V, [], Fc); me.update()
    o = bpy.data.objects.new('Kappe', me); L['coll']('HELM_V3').objects.link(o); o.parent = bpy.data.objects['HELM_ROOT']
    B['fixn'](o)
    if o.data.polygons[len(o.data.polygons) // 2].normal.z < -0.5:
        for p in o.data.polygons: p.flip()
    o.color = DARK; B['setmat'](o, 'MAT_Dunkel'); L['smooth'](o)
    L['add_mod'](o, 'SUBSURF', 'Subdivision', levels=1, render_levels=2)
    L['add_mod'](o, 'SOLIDIFY', 'Solidify', thickness=0.014, offset=-1, use_even_offset=False, thickness_clamp=1.0)
    b = L['bevel'](o, width=0.007, seg=4, angle=50, harden=False); b.profile = 0.6   # Randkante rund: weicher Übergang schwarz → weiß
    return o

B['unterkante_guss'] = unterkante_guss; B['guss'] = guss
