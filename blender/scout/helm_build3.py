# Lauf 2, Stufen C–E: Mechanik, Details, Mikrodetails (Anbauteile per Raycast auf die echten Flächen).
import bpy, bmesh, math
from mathutils import Vector, Matrix, Euler
from mathutils.bvhtree import BVHTree

SCHILD = 'Kappe'   # Lauf 2e: Haube und Gesichtsschild sind ein Teil
H = bpy.app.driver_namespace['H']; L = H['lib']; B = H['build']; P = B['P']
DARK, WHITE, OLIVE, MET = (0.10, 0.105, 0.115, 1), (0.85, 0.84, 0.81, 1), (0.27, 0.26, 0.21, 1), (0.45, 0.45, 0.46, 1)
fixn, setmat, sharp, cyl, stack, place, bez, raycast, remove = (B[k] for k in ('fixn', 'setmat', 'sharp', 'cyl', 'stack', 'place', 'bez', 'raycast', 'remove'))

def onto(names, p, n_out, lift=0.0):
    """Punkt p entlang Außennormale n_out auf die Fläche der Objekte projizieren."""
    h = raycast(names, Vector(p) + Vector(n_out) * 0.3, -Vector(n_out))
    if h is None: return Vector(p), Vector(n_out).normalized()
    nn = h[1] if h[1].dot(Vector(n_out)) > 0 else -h[1]
    return h[0] + nn * lift, nn

def boxmesh(name, c, n, up, w, hh, d_in, d_out, mat, col, bev=0.002):
    v, f = L['surface_box'](c, n, up, w, hh, d_in, d_out)
    o = L['mesh_obj'](name, [tuple(x) for x in v], f); fixn(o); setmat(o, mat); o.color = col
    L['bevel'](o, width=bev, seg=2, angle=30); L['smooth'](o); return o

# ---------------------------------------------------------------- C: Mechanik
def laschen_sockel():
    for side, sx in (('R', 1), ('L', -1)):
        p, n = onto(['Kappe'], (sx * 0.17, 0.05, 0.95), (sx * 0.4, 0, 1))
        o = boxmesh('Lug_' + side, Vector((0, 0, 0)), (0, 0, 1), (0, 1, 0), 0.04, 0.03, 0.0, 0.02, 'MAT_Pod', OLIVE)
        o.matrix_world = Matrix.Translation(p - n * 0.004) @ Vector((0, 0, 1)).rotation_difference(n).to_matrix().to_4x4()
        place('Pod_Sockel_' + side, cyl(0.0175, 0.032, 24), Vector((sx * 0.43, P['pod_y'], 0.662)), (0, 0, 1), 'MAT_Pod', OLIVE)
    place('Pod_Sockel_Deckel_L', cyl(0.019, 0.004, 24, 0.002), Vector((-0.43, P['pod_y'], 0.694)), (0, 0, 1), 'MAT_Metall', MET)

def antenne():
    remove('Blk_Antenne')
    V, F = stack([(cyl(0.012, 0.012, 6), 0.0), (cyl(0.009, 0.12, 20), 0.012), (cyl(0.0105, 0.006, 20), 0.128), (cyl(0.007, 0.45 - 0.134, 16), 0.134)])
    an = L['mesh_obj']('Antenne_R', V, F)
    an.location = (0.43, P['pod_y'], 0.694); an.rotation_euler = Euler((math.radians(12), math.radians(5), 0))
    setmat(an, 'MAT_Dunkel'); an.color = DARK; sharp(an, 34); L['bevel'](an, width=0.0015, seg=2, angle=30)

def buegel():
    for side, sx in (('R', 1), ('L', -1)):
        y0_, y1_ = P['pod_y'] - 0.13, P['pod_y'] + 0.13
        f0 = Vector((L['shell_side_x'](y0_, 0.44, sx), y0_, 0.44)); f1 = Vector((L['shell_side_x'](y1_, 0.44, sx), y1_, 0.44))
        pts = [f0 + Vector((sx * 0.006, 0, 0)), Vector((sx * 0.47, P['pod_y'] - 0.115, 0.60)), Vector((sx * 0.50, P['pod_y'], 0.69)),
               Vector((sx * 0.47, P['pod_y'] + 0.115, 0.60)), f1 + Vector((sx * 0.006, 0, 0))]
        bez('Pod_Buegel_' + side, [pts], 0.006, 'MAT_Metall', MET)
        for k, f in enumerate((f0, f1)):
            boxmesh(f'Pod_Buegel_Fuss_{side}{k}', f, L['shell_normal'](f), (0, 0, 1), 0.026, 0.03, 0.002, 0.008, 'MAT_Pod', OLIVE)

def stecker():
    ax = Vector((0, -math.sin(math.radians(30)), -math.cos(math.radians(30))))
    H['cable_start'] = {}
    for side, sx in (('R', 1), ('L', -1)):
        place('Pod_Stecker_' + side, stack([(cyl(0.015, 0.03, 24), 0.0), (cyl(0.0165, 0.008, 24), 0.008), (cyl(0.010, 0.025, 16), 0.03)]),
              Vector((sx * 0.43, P['pod_y'] - 0.06, 0.445)), ax, 'MAT_Metall', MET)
        H['cable_start'][side] = Vector((sx * 0.43, P['pod_y'] - 0.06, 0.445)) + ax * 0.055
        place('Rueckbox_Anschluss_' + side, stack([(cyl(0.02, 0.04, 24), 0.0), (cyl(0.022, 0.012, 6), 0.012)]),
              Vector((sx * 0.15, 0.52, 0.60)), (sx, 0, 0), 'MAT_Metall', MET)

def catmull(Pp, n=400):
    Pp = [Pp[0]] + Pp + [Pp[-1]]; pts = []
    for i in range(1, len(Pp) - 2):
        p0, p1, p2, p3 = Pp[i - 1], Pp[i], Pp[i + 1], Pp[i + 2]
        for k in range(20):
            t = k / 20
            pts.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    pts.append(Pp[-2]); d = [0.0]
    for a, b in zip(pts, pts[1:]): d.append(d[-1] + (b - a).length)
    out, j = [], 0
    for i in range(n + 1):
        s = d[-1] * i / n
        while j < len(d) - 2 and d[j + 1] < s: j += 1
        t = (s - d[j]) / max(d[j + 1] - d[j], 1e-9); out.append(pts[j].lerp(pts[j + 1], t))
    return out, d[-1]

def kabel_pfad():
    H['cable_paths'] = {}
    for side, sx in (('R', 1), ('L', -1)):
        s0 = H['cable_start'][side]
        ctrl = [s0, s0 + Vector((0, -0.015, -0.026)), Vector((sx * 0.465, P['pod_y'] - 0.03, 0.30)), Vector((sx * 0.475, P['pod_y'] + 0.12, 0.245)),
                Vector((sx * 0.45, 0.38, 0.30)), Vector((sx * 0.385, 0.50, 0.45)), Vector((sx * 0.29, 0.545, 0.585)),
                Vector((sx * 0.235, 0.52, 0.60)), Vector((sx * 0.19, 0.52, 0.60))]
        pts, length = catmull(ctrl); H['cable_paths'][side] = (pts, length)
        o = bez('Kabel_Pfad_' + side, [[tuple(p) for p in pts]], 0.002, 'MAT_Kabel', (1, 0.5, 0.1, 1), poly=True)
        for c in list(o.users_collection): c.objects.unlink(o)
        L['coll']('CUTTER').objects.link(o)

def kabel_spirale():
    for side in ('R', 'L'):
        pts, length = H['cable_paths'][side]
        n = len(pts) - 1; ds = length / n
        T = [(pts[min(i + 1, n)] - pts[max(i - 1, 0)]).normalized() for i in range(n + 1)]
        Nv = T[0].orthogonal().normalized(); fr = []
        for i in range(n + 1):
            if i: Nv = (Nv - T[i] * Nv.dot(T[i])).normalized()
            fr.append((T[i], Nv, T[i].cross(Nv)))
        R_, pitch, s0, s1 = 0.022, 0.018, 0.07, 0.08
        out = []; steps = int(length / (pitch / 14))
        for k in range(steps + 1):
            s = length * k / steps; f = s / ds; i = min(int(f), n - 1); t = f - i
            p = pts[i].lerp(pts[i + 1], t); Tt, Nn, Bb = fr[i]
            r = R_ * max(0.0, min(1.0, (s - s0) / pitch, (length - s1 - s) / pitch)); th = 2 * math.pi * (s - s0) / pitch
            out.append(tuple(p + r * (math.cos(th) * Nn + math.sin(th) * Bb)))
        bez('Kabel_' + side, [out], 0.006, 'MAT_Kabel', (0.03, 0.03, 0.03, 1), poly=True)
        for k, s in enumerate((0.07 - 0.012, length - 0.08 - 0.012)):
            i = int(s / length * n)
            place(f'Kabel_Huelse_{side}{k}', cyl(0.012, 0.024, 20), pts[i], fr[i][0], 'MAT_Kabel_Huelse', WHITE)
        bpy.data.objects['Kabel_Pfad_' + side].hide_set(True)

def gelenk_halter():
    for side, sx in (('R', 1), ('L', -1)):
        p, n = onto([SCHILD], (sx * 0.33, -0.20, 0.585), (sx * 0.8, -0.6, 0), -0.001)
        g = place('Maske_Gelenk_' + side, stack([(cyl(0.036, 0.012, 32), 0.0), (cyl(0.022, 0.006, 32), 0.012), (cyl(0.008, 0.004, 6), 0.018)]),
                  p, n, 'MAT_Dunkel', DARK)
        L['bevel'](g, width=0.0015, seg=2, angle=30)
        q, m = onto([SCHILD], (sx * 0.28, -0.18, 0.25), (sx * 0.6, -0.8, 0), -0.004)
        boxmesh('Maske_Halter_' + side, q, m, (0, 0, 1), 0.035, 0.03, 0.0, 0.026, 'MAT_Dunkel', DARK, 0.003)

def kopfgurt():
    remove('Blk_Gurt')
    dg = bpy.context.evaluated_depsgraph_get(); Y = P['pod_y'] + 0.05; C = Vector((0, Y, 0.70)); path, nrms = [], []
    for i in range(41):
        th = math.radians(-84 + 168 * i / 40); d = Vector((math.sin(th), 0, math.cos(th)))
        h = raycast(['Kappe', 'Krempe'], C + d * 1.2, -d)
        if h:
            n = Vector((h[1].x, 0, h[1].z)).normalized()
            if n.dot(d) < 0: n = -n
            path.append(h[0] + n * 0.002); nrms.append(n)
    v, f = L['sweep']('g', path, width=0.05, d_in=0.0, d_out=0.006, normals=nrms)
    g = L['mesh_obj']('Kopfgurt', [tuple(x) for x in v], f); fixn(g); setmat(g, 'MAT_Gurt'); g.color = (0.47, 0.46, 0.43, 1)
    sharp(g, 40); L['bevel'](g, width=0.0015, seg=1, angle=30)
    k = 30; boxmesh('Gurt_Schnalle', path[k], nrms[k], (path[k + 1] - path[k - 1]).normalized(), 0.064, 0.05, 0.0, 0.012, 'MAT_Metall', MET)
    for side, idx in (('R', -1), ('L', 0)):
        boxmesh('Gurt_Halter_' + side, path[idx], nrms[idx], (0, 0, 1), 0.06, 0.04, 0.004, 0.012, 'MAT_Pod', OLIVE)
    H['gurt_ends'] = (path[0], path[-1])

def halterarme():
    for side, sx in (('R', 1), ('L', -1)):
        spl = []
        py = P['pod_y']
        for y0, y1 in ((py + 0.032, py - 0.055), (py + 0.068, py + 0.055)):
            spl.append([Vector((sx * 0.408, y0, 0.74)), Vector((sx * 0.452, (y0 + y1) / 2, 0.70)), Vector((sx * 0.437, y1, 0.642))])
            place(f'Pod_Gelenk_{side}{0 if y1 < 0 else 1}', stack([(cyl(0.010, 0.010, 20), 0.0), (cyl(0.006, 0.004, 6), 0.010)]),
                  Vector((sx * 0.430, y1, 0.642)), (sx, 0, 0.25), 'MAT_Metall', MET)
        bez('Pod_Halterarm_' + side, spl, 0.005, 'MAT_Metall', MET, res=16)

# ---------------------------------------------------------------- B2/D: Vertiefungen und Details
def schale_nuten():
    yb = H['yback']; s = bpy.data.objects['Schale']
    ring = L['ring'](0.28, *L['shell_params'](0.28), N=96); ring = ring + [ring[0]]
    teile = [L['sweep']('v', [(0.0, yb(0.0, 0.31 + 0.41 * i / 12), 0.31 + 0.41 * i / 12) for i in range(13)])]
    if not P.get('kinn_band'): teile.insert(0, L['sweep']('r', ring))      # Lauf 3b: keine umlaufende Kragennut mehr
    c1 = L['cutter']('Cut_Schale_Mitte', teile)
    path = [(L['shell_side_x'](0.25, 0.70 - 0.30 * i / 10), 0.25, 0.70 - 0.30 * i / 10) for i in range(10)]
    path += [(L['shell_side_x'](0.25 + 0.18 * i / 10, 0.40), 0.25 + 0.18 * i / 10, 0.40) for i in range(11)]
    c = (L['shell_side_x'](0.42, 0.45), 0.42, 0.45)
    c2 = L['cutter']('Cut_Schale_Seite', [L['sweep']('l', path), L['surface_box'](c, L['shell_normal'](Vector(c)), (0, 0, 1), 0.05, 0.04, 0.004, 0.03)], mirror=True)
    for cc in (c1, c2): setmat(cc, 'MAT_Weiss')
    L['boolean'](s, c1, 'Nuten_Mitte'); L['boolean'](s, c2, 'Nuten_Seite'); c1.hide_set(True); c2.hide_set(True)

def maske_vertiefungen():
    parts_w = []
    for x in (0.24,):
        p, n = onto([SCHILD], (x, -0.5, 0.42), (0, -1, 0)); parts_w.append(L['surface_box'](p, n, (0, 0, 1), 0.04, 0.02, 0.004, 0.03))
    seg = []
    for i in range(15):
        x = 0.065 + (0.31 - 0.065) * i / 14; p, n = onto([SCHILD], (x, -0.5, 0.36), (0, -1, 0)); seg.append((p, n))
    parts_w.append(L['sweep']('w', [p for p, n in seg], normals=[n for p, n in seg], d_in=0.003, d_out=0.03))
    cw = L['cutter']('Cut_Wange', parts_w, mirror=True); setmat(cw, 'MAT_Dunkel')
    pn, nn = onto(['Maske_Nase'], (0, -0.6, 0.36), (0, -1, 0))
    zz = [0.34 - 0.10 * i / 8 for i in range(9)]; mpts = [onto(['Maske_Nase'], (0, -0.6, z), (0, -1, 0))[0] for z in zz]
    cn = L['cutter']('Cut_Nase', [L['surface_box'](pn, nn, (0, 0, 1), 0.06, 0.025, 0.006, 0.03),
                                  L['sweep']('n', mpts, width=0.004, d_in=0.002, normals=[Vector((0, -1, 0))] * 9)]); setmat(cn, 'MAT_Dunkel')
    for t, c, nm in ((SCHILD, cw, 'Wangendetails'), ('Maske_Nase', cn, 'Nasendetails')):
        b = L['boolean'](bpy.data.objects[t], c, nm); b.material_mode = 'TRANSFER'
    cw.hide_set(True); cn.hide_set(True)

def pod_details():
    for side, sx in (('R', 1), ('L', -1)):
        p, n = onto(['Pod_' + side], (sx * 0.43, P['pod_y'] + 0.02, 0.55), (sx, 0, 0))
        b = place('Pod_Taste_' + side, stack([(cyl(0.015, 0.006, 32), -0.002), (cyl(0.012, 0.002, 32), 0.004)]), p, n, 'MAT_Metall', MET)
        q, m = onto(['Pod_' + side], (sx * 0.43, P['pod_y'] + 0.02, 0.50), (sx, 0, 0))
        up = Vector((0, 0, 1)); up = (up - m * up.dot(m)).normalized(); rt = up.cross(m).normalized()
        tri = [q + rt * (-0.02) + up * 0.015, q + rt * 0.02 + up * 0.015, q + up * (-0.015)]
        V = [t - m * 0.004 for t in tri] + [t + m * 0.03 for t in tri]
        c = L['cutter']('Cut_Pod_Dreieck_' + side, [(V, [(0, 1, 2), (5, 4, 3), (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)])])
        setmat(c, 'MAT_Pod'); bo = bpy.data.objects['Pod_' + side].modifiers.new('Dreieck', 'BOOLEAN'); bo.object = c; bo.solver = 'EXACT'
        c.hide_set(True)

def rueckbox_platte():
    def octo(w, h, ch, cx=0.0, cz=0.0):
        a, b = w / 2, h / 2
        return [(cx - a + ch, cz - b), (cx + a - ch, cz - b), (cx + a, cz - b + ch), (cx + a, cz + b - ch),
                (cx + a - ch, cz + b), (cx - a + ch, cz + b), (cx - a, cz + b - ch), (cx - a, cz - b + ch)]
    def prism(ol, y0, y1):
        n = len(ol); V = [(x, y0, z) for x, z in ol] + [(x, y1, z) for x, z in ol]
        F = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, n + i, n + (i + 1) % n, (i + 1) % n) for i in range(n)]
        return V, F
    V, F = prism(octo(0.22, 0.16, 0.04, 0, 0.65), 0.565, 0.582)
    pl = L['mesh_obj']('Rueckbox_Platte', V, F); fixn(pl); setmat(pl, 'MAT_Pod'); pl.color = (0.30, 0.29, 0.24, 1)
    c = L['cutter']('Cut_Rueckbox_Platte', [prism(octo(0.16, 0.10, 0.025, 0, 0.65), 0.578, 0.60)])
    c2 = L['cutter']('Cut_Rueckbox_Kratzer', [L['surface_box']((-0.03, 0.578, 0.662), (0, 1, 0), (math.sin(0.6), 0, math.cos(0.6)), 0.003, 0.07, 0.002, 0.03),
                                              L['surface_box']((0.035, 0.578, 0.640), (0, 1, 0), (math.sin(0.6), 0, math.cos(0.6)), 0.003, 0.05, 0.002, 0.03)])
    L['boolean'](pl, c, 'Vertiefung'); L['boolean'](pl, c2, 'Kratzer')
    L['bevel'](pl, width=0.002, seg=2, angle=30); L['wnormal'](pl); L['smooth'](pl); c.hide_set(True); c2.hide_set(True)
    place('Rueckbox_Hebel', stack([(cyl(0.014, 0.006, 24), 0.0), (cyl(0.006, 0.012, 16), 0.006)]), Vector((0.0, 0.574, 0.655)), (0, 1, 0), 'MAT_Metall', MET)
    boxmesh('Rueckbox_Hebel_Arm', Vector((0.012, 0.588, 0.635)), (0, 1, 0), (math.sin(0.5), 0, math.cos(0.5)), 0.010, 0.05, 0.003, 0.003, 'MAT_Metall', MET)
    yb = H['yback']; tv = [(-0.05, 0.48), (0.05, 0.48), (0.035, 0.52), (-0.035, 0.52)]
    V = [(x, yb(x, z) - 0.002, z) for x, z in tv] + [(x, yb(x, z) + 0.003, z) for x, z in tv]
    tp = L['mesh_obj']('Rueckbox_Trapezpanel', V, [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)])
    fixn(tp); setmat(tp, 'MAT_Pod'); L['bevel'](tp, width=0.0015, seg=2); L['smooth'](tp)

def side_patch(name, y0, y1, z0, z1, d_in, d_out, sx, ny=10, nz=4, ztop=None):
    W = ny + 1; V = []
    for d in (d_in, d_out):
        for j in range(nz + 1):
            for i in range(ny + 1):
                y = y0 + (y1 - y0) * i / ny; zt = ztop(y) if ztop else z1; z = z0 + (zt - z0) * j / nz
                p = Vector((L['shell_side_x'](y, z, sx), y, z)); V.append(tuple(p + L['shell_normal'](p) * d))
    off = (nz + 1) * W; F = []
    for j in range(nz):
        for i in range(ny):
            a = j * W + i; F.append((a, a + 1, a + W + 1, a + W)); F.append((off + a, off + a + W, off + a + W + 1, off + a + 1))
    ring = [(i, 0) for i in range(ny)] + [(ny, j) for j in range(nz)] + [(i, nz) for i in range(ny, 0, -1)] + [(0, j) for j in range(nz, 0, -1)]
    for q in range(len(ring)):
        i0, j0 = ring[q]; i1, j1 = ring[(q + 1) % len(ring)]; a, b = j0 * W + i0, j1 * W + i1; F.append((a, off + a, off + b, b))
    o = L['mesh_obj'](name, V, F); fixn(o); return o

def seitenteile():
    def ss(v): v = max(0, min(1, v)); return v * v * (3 - 2 * v)
    def ztop(y): return 0.21 + 0.06 * (1 - ss((y - 0.12) / 0.08)) - 0.04 * ss((y - 0.32) / 0.06)
    for side, sx in (('R', 1), ('L', -1)):
        if P.get('kinn_band'):
            g = None
        else:
            g = side_patch('Schale_Griffpanel_' + side, 0.0, 0.18, 0.32, 0.40, -0.002, 0.003, sx)
        if g is not None:
            setmat(g, 'MAT_Weiss'); g.color = WHITE
            p = Vector((L['shell_side_x'](0.09, 0.36, sx), 0.09, 0.36))
            c = L['cutter']('Cut_Griff_' + side, [L['surface_box'](p, L['shell_normal'](p), (0, 0, 1), 0.10, 0.015, 0.004, 0.02)]); setmat(c, 'MAT_Dunkel')
            b = L['boolean'](g, c, 'Schlitz'); b.material_mode = 'TRANSFER'; c.hide_set(True)
            L['bevel'](g, width=0.0015, seg=2, angle=30); L['wnormal'](g); L['smooth'](g)
        k = side_patch('Schale_Wartungsklappe_' + side, 0.27, 0.41, 0.575, 0.635, -0.002, 0.004, sx, ny=8, nz=3)
        setmat(k, 'MAT_Dunkel'); k.color = DARK
        p = Vector((L['shell_side_x'](0.34, 0.605, sx), 0.34, 0.605))
        c = L['cutter']('Cut_Klappe_' + side, [L['surface_box'](p, L['shell_normal'](p), (0, 0, 1), 0.10, 0.03, -0.002, 0.02)])
        L['boolean'](k, c, 'Griffmulde'); c.hide_set(True); L['bevel'](k, width=0.002, seg=2, angle=30); L['wnormal'](k); L['smooth'](k)
        if not P.get('kinn_band'):
            kb = side_patch('Schale_Kragenblende_' + side, -0.02, 0.38, 0.13, 0.27, -0.002, 0.012, sx, ny=30, nz=4, ztop=ztop)
            setmat(kb, 'MAT_Weiss'); kb.color = WHITE; sharp(kb, 30); L['bevel'](kb, width=0.0025, seg=2, angle=30); L['wnormal'](kb)

def schrauben():
    v, f = cyl(0.006, 0.003, 24, 0.002)
    base = L['mesh_obj']('Schraube_Basis', v, f, cname='CUTTER'); setmat(base, 'MAT_Metall')
    cut = L['cutter']('Cut_Schraube', [L['surface_box']((0, 0, 0.005), (0, 0, 1), (1, 0, 0), 0.0012, 0.0112, 0.0012, 0.002),
                                       L['surface_box']((0, 0, 0.005), (0, 0, 1), (0, 1, 0), 0.0012, 0.0112, 0.0012, 0.002)])
    b = base.modifiers.new('Kreuzschlitz', 'BOOLEAN'); b.object = cut; b.solver = 'EXACT'
    with bpy.context.temp_override(object=base, active_object=base):
        bpy.ops.object.modifier_apply(modifier='Kreuzschlitz')
    bpy.data.objects.remove(cut, do_unlink=True); sharp(base, 34); base.data.name = 'Schraube'; base.hide_set(True)
    yb = H['yback']; spots = []
    for sx in (1, -1):
        for x, z in ((0.22, 0.66), (0.22, 0.45), (0.10, 0.32)):
            p = Vector((sx * x, yb(x, z), z)); spots.append(onto(['Schale'], p, L['shell_normal'](p)))
        spots.append(onto([SCHILD], (sx * 0.20, -0.6, 0.485), (sx * 0.3, -1, 0)))
        spots.append(onto([SCHILD], (sx * 0.22, -0.6, 0.29), (sx * 0.4, -1, 0)))
        for z in (0.555, 0.745): spots.append((Vector((sx * 0.13, 0.57 + P.get('box_dy', 0.0), z)), Vector((0, 1, 0))))
        for z in (P.get('kinn_z', 0.14) - P.get('kinn_h', 0.09) * 0.39, P.get('kinn_z', 0.14) + P.get('kinn_h', 0.09) * 0.39): spots.append((Vector((sx * (P.get('kinn_w', 0.20) / 2 - 0.013), H['kinn_y'] + 0.004, z)), Vector((0, -1, 0))))
        for y in (0.05, 0.32):
            zb, zt = B['band_kanten'](y) if 'band_kanten' in B else (0.15, 0.25); z = (zb + zt) / 2
            p = Vector((L['shell_side_x'](y, z, sx), y, z)); spots.append(onto(['Kinnleiste'], p, L['shell_normal'](p)))
    for s in 'RL':
        for k in range(2):
            o = bpy.data.objects[f'Pod_Buegel_Fuss_{s}{k}']; vv = [o.matrix_world @ x.co for x in o.data.vertices]
            c = sum(vv, Vector()) / len(vv); n = L['shell_normal'](c); spots.append((c + n * 0.004, n))
    me = bpy.data.meshes['Schraube']; root = bpy.data.objects['HELM_ROOT']
    for i, (p, n) in enumerate(spots):
        o = bpy.data.objects.new(f'Schraube_{i + 1:02d}', me); L['coll']('HELM_V3').objects.link(o); o.parent = root
        o.matrix_world = Matrix.Translation(p - n * 0.0005) @ Vector((0, 0, 1)).rotation_difference(n).to_matrix().to_4x4(); o.color = MET
    return len(spots)

# ---------------------------------------------------------------- E: Mikrodetails
def krempe_naht():
    kr = bpy.data.objects['Krempe']; V = kr.data.vertices; M = len(V) // 4
    path = [V[4 * k + 1].co.lerp(V[4 * k + 2].co, 0.45) for k in range(M)]
    nrm = [L['shell_normal'](Vector((p.x, p.y, 0.72))) for p in path]
    c = L['cutter']('Cut_Krempe_Naht', [L['sweep']('k', path, width=0.004, d_in=0.002, d_out=0.03, normals=nrm)]); setmat(c, 'MAT_Dunkel')
    L['boolean'](kr, c, 'Naht'); c.hide_set(True)

def kennungen():
    for name, text, sx, size in (('Kennung_L', 'SCOUT V3', -1, 0.032), ('Kennung_R', 'SV3-07', 1, 0.026)):
        cu = bpy.data.curves.new(name, 'FONT'); cu.body = text; cu.size = size; cu.align_x = 'CENTER'; cu.align_y = 'CENTER'; cu.extrude = 0.0004
        t = bpy.data.objects.new(name + '_txt', cu); L['coll']('HELM_V3').objects.link(t)
        t.location = (L['shell_side_x'](0.33, 0.47, sx) + sx * 0.01, 0.33, 0.47); t.rotation_euler = (math.radians(90), 0, math.radians(90 * sx))
        dg = bpy.context.evaluated_depsgraph_get(); me = bpy.data.meshes.new_from_object(t.evaluated_get(dg)); me.name = name
        o = bpy.data.objects.new(name, me); L['coll']('HELM_V3').objects.link(o); o.matrix_world = t.matrix_world.copy()
        o.parent = bpy.data.objects['HELM_ROOT']; bpy.data.objects.remove(t, do_unlink=True)
        L['add_mod'](o, 'SHRINKWRAP', 'Shrinkwrap', wrap_method='PROJECT', use_project_z=True, use_negative_direction=True,
                     use_positive_direction=True, target=bpy.data.objects['Schale'], offset=0.0006, wrap_mode='OUTSIDE_SURFACE')
        setmat(o, 'MAT_Dunkel')

for k, v in list(globals().items()):
    if callable(v) and not k.startswith('_'):
        B[k] = v
