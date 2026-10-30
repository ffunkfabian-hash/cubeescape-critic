# Lauf 2, Stufen B–E: Fortsetzung von helm_build.py (gleicher Namensraum über H['build']).
import bpy, bmesh, math, time
from mathutils import Vector, Matrix, Euler
from mathutils.bvhtree import BVHTree

SCHILD = 'Kappe'   # Lauf 2e: Haube und Gesichtsschild sind ein Teil
H = bpy.app.driver_namespace['H']; L = H['lib']; B = H['build']; P = B['P']
DARK, WHITE, OLIVE, MET = (0.10, 0.105, 0.115, 1), (0.85, 0.84, 0.81, 1), (0.27, 0.26, 0.21, 1), (0.45, 0.45, 0.46, 1)
fixn, setmat, sharp, cyl, stack, place, bez, raycast = (B[k] for k in ('fixn', 'setmat', 'sharp', 'cyl', 'stack', 'place', 'bez', 'raycast'))
plane_from, plane_y = B['plane_from'], B['plane_y']
F, F_inv_x, face_yc, interp = B['F'], B['F_inv_x'], B['face_yc'], B['interp']

def ss(v): v = max(0.0, min(1.0, v)); return v * v * (3 - 2 * v)

def remove(*names):
    for n in names:
        o = bpy.data.objects.get(n)
        if o: bpy.data.objects.remove(o, do_unlink=True)

def orient(o, loc, n, up=None):
    o.matrix_world = Matrix.Translation(loc) @ Vector((0, 0, 1)).rotation_difference(Vector(n)).to_matrix().to_4x4()

# ---------------------------------------------------------------- Schale
def schale_querschnitte():
    remove('Blk_Schale', 'Blk_Kragen')
    ZS = [0.0, 0.15, 0.30, 0.31, 0.43, 0.55, 0.64, 0.72, 0.765]; H['shell_z'] = ZS
    V, E = [], []
    for z in ZS:
        pts = L['ring'](z, *L['shell_params'](z)); b = len(V); V += pts
        E += [(b + i, b + (i + 1) % len(pts)) for i in range(len(pts))]
    me = bpy.data.meshes.new('Schale_Querschnitte'); me.from_pydata(V, E, [])
    o = bpy.data.objects.new('Schale_Querschnitte', me); o.color = (1, 0.6, 0.1, 1); o.show_in_front = True
    L['coll']('HELM_V3').objects.link(o); o.parent = bpy.data.objects['HELM_ROOT']

def shell_ring(z, N=96):
    pts = L['ring'](z, *L['shell_params'](z), N=N)
    return [(x, max(y, F(x, z) + 0.035) if y < 0.2 else y, zz) for x, y, zz in pts]

def schale_loft():
    remove('Schale_Querschnitte')
    rings = [shell_ring(z) for z in H['shell_z']]
    s = L['loft']('Schale', rings); s.color = WHITE; setmat(s, 'MAT_Weiss')
    sharp(s, 34)

def schale_mods():
    s = bpy.data.objects['Schale']
    L['add_mod'](s, 'SOLIDIFY', 'Solidify', thickness=0.015, offset=-1, use_even_offset=False, thickness_clamp=1.0)
    L['bevel'](s, width=0.004, seg=2, angle=30); L['wnormal'](s)

# ---------------------------------------------------------------- Kappe + Krempe
def kappe():
    remove('Blk_Kappe')
    bm = B['dome_mesh'](128, 30)
    me = bpy.data.meshes.get('Kappe') or bpy.data.meshes.new('Kappe'); bm.to_mesh(me); bm.free()
    k = bpy.data.objects.new('Kappe', me); L['coll']('HELM_V3').objects.link(k); k.parent = bpy.data.objects['HELM_ROOT']
    k.color = DARK; setmat(k, 'MAT_Dunkel'); sharp(k, 70)

def kappe_mods():
    # Nutzerwunsch: Haube deutlich weicher – breite, runde Übergänge an den Stirnfacetten statt harter Kanten
    k = bpy.data.objects['Kappe']
    b = L['bevel'](k, width=0.045, seg=8, angle=12, harden=False); b.profile = 0.5
    L['add_mod'](k, 'SOLIDIFY', 'Solidify', thickness=0.015, offset=-1, use_even_offset=False, thickness_clamp=1.0)
    L['add_mod'](k, 'SMOOTH', 'Glaetten', factor=0.5, iterations=4)

def krempe():
    remove('Blk_Krempe')
    N = 96
    pa = L['shell_params'](0.72)
    outer = L['ring'](0, pa[0] + 0.02, pa[1] + 0.02, pa[2] + 0.02, pa[3], pa[4], N)
    pb = L['shell_params'](0.70); pt = L['shell_params'](0.765)
    ib = L['ring'](0, pb[0] - 0.004, pb[1] - 0.004, pb[2] - 0.004, pb[3], pb[4], N)
    it = L['ring'](0, pt[0] - 0.004, pt[1] - 0.004, pt[2] - 0.004, pt[3], pt[4], N)
    # nur Seiten und Rücken (y > -0.10): offener Bogen, vorn übernimmt die Kappe
    idx = [i for i in range(N) if outer[i][1] > -0.10]
    start = next(k for k, i in enumerate(idx) if (idx[k - 1] + 1) % N != i)
    idx = idx[start:] + idx[:start]
    R = [[], [], [], []]
    for i in idx:
        x, y, _ = outer[i]; fr = ss((y - 0.20) / 0.14)
        zb = 0.70 + 0.02 * fr; zt = 0.765 + 0.08 * fr
        R[0].append((ib[i][0], ib[i][1], zb)); R[1].append((x, y, zb)); R[2].append((x, y, zt)); R[3].append((it[i][0], it[i][1], zt + 0.005))
    M = len(idx); V = []; Fc = []
    for k in range(M):
        V += [R[0][k], R[1][k], R[2][k], R[3][k]]
    for k in range(M - 1):
        for j in range(4):
            j2 = (j + 1) % 4; Fc.append((4 * k + j, 4 * k + j2, 4 * (k + 1) + j2, 4 * (k + 1) + j))
    Fc.append((3, 2, 1, 0)); e = 4 * (M - 1); Fc.append((e, e + 1, e + 2, e + 3))
    kr = L['mesh_obj']('Krempe', V, Fc); fixn(kr)
    kr.color = DARK; setmat(kr, 'MAT_Dunkel'); sharp(kr, 34)
    L['bevel'](kr, width=0.003, seg=2, angle=30); L['wnormal'](kr)

# ---------------------------------------------------------------- Maske
def mask_front_fn(z):
    a, bv, bh, nv, nh = L['shell_params'](z, H['huelle'])
    tl = []
    for xk in P['xk']:
        u = xk / a; y = -bv * (1 - u ** nv) ** (1 / nv)
        m = 0.0 if xk == 0 else bv * (1 - u ** nv) ** (1 / nv - 1) * u ** (nv - 1) / a
        tl.append((xk, y, m))
    rec = max(0.0, 0.46 - z) * P['chin_recede']
    def f(x):
        y = max(yy + m * (abs(x) - xk) for xk, yy, m in tl)
        w = ss((0.37 - abs(x)) / 0.08)
        y += rec * w
        if z > 0.60:
            y = max(y, plane_y(P['P1'], z) + 0.02 * w - (1 - w) * 0.5)
        return y
    return f

def maske_huelle():
    T = [r for r in L['SHELL'] if r[0] >= 0.31]; T = [(0.0,) + T[0][1:]] + T
    H['huelle'] = T
    rings = []
    for z in [0.0, 0.15, 0.22, 0.31, 0.40, 0.46, 0.55, 0.60, 0.64, 0.68, 0.72, 0.765]:
        pts = L['ring'](z, *L['shell_params'](z, T), N=160)
        rings.append([(x, max(y, F(x, z) + 0.02) if y < 0.2 else y, zz) for x, y, zz in pts])
    hf = L['loft']('Maske_Traegerhuelle', rings, cname='CUTTER')
    hf.display_type = 'WIRE'; hf.hide_render = True; hf.hide_set(True)

def panel(us, nv, zb, zt, xl, xr, y=-0.80):
    V, F = [], []; nu = len(us) - 1
    for j in range(nv + 1):
        v = j / nv
        for u in us:
            z = zb(u) + (zt(u) - zb(u)) * v; x = xl(z) + (xr(z) - xl(z)) * u; V.append((x, y, z))
    for j in range(nv):
        for i in range(nu):
            a = j * (nu + 1) + i; F.append((a, a + 1, a + nu + 2, a + nu + 1))
    return V, F

def lin(a, b, n): return [a + (b - a) * i / n for i in range(n + 1)]

def maske_platten_flach():
    remove('Blk_Maske', 'Blk_Seite_R', 'Blk_Seite_L')
    ZT = 0.635
    hb = lambda z: 0.32 + (z - 0.46) / (ZT - 0.46) * 0.04
    us = lin(0, 0.391, 10)[:-1] + lin(0.391, 0.5, 4)[:-1] + lin(0.5, 0.609, 4)[:-1] + lin(0.609, 1, 10)
    def zb_st(u):
        x = -0.32 + 0.64 * u; return 0.46 - 0.06 * max(0.0, 1 - abs(x) / 0.07)
    def mk(name, vf, mirror=False):
        v, f = vf
        if mirror: v = [(-x, y, z) for x, y, z in v]; f = [tuple(reversed(p)) for p in f]
        o = L['mesh_obj'](name, v, f); o.color = DARK; setmat(o, 'MAT_Dunkel'); return o
    mk('Maske_Stirn', panel(us, 14, zb_st, lambda u: ZT, lambda z: -hb(z), lambda z: hb(z)))
    nh = lambda z: 0.06 + (0.394 - z) / 0.188 * 0.05
    mk('Maske_Nase', panel(lin(0, 1, 8), 10, lambda u: 0.206, lambda u: 0.394, lambda z: -nh(z), lambda z: nh(z)))
    kh = lambda z: 0.07 * max(0.0, (z - 0.40) / 0.06)
    inner = lambda z: max(nh(z), kh(z)) + 0.006
    outer = lambda z: 0.27 + (z - 0.22) / 0.234 * 0.06
    vf = panel(lin(0, 1, 10), 12, lambda u: 0.22, lambda u: 0.454, inner, outer)
    mk('Maske_Wange_R', vf); mk('Maske_Wange_L', vf, mirror=True)
    H['mask_edge'] = (hb, outer)

def maske_aufwickeln():
    hf = bpy.data.objects['Maske_Traegerhuelle']
    for n, off in [('Maske_Stirn', 0.02), ('Maske_Wange_R', 0.02), ('Maske_Wange_L', 0.02), ('Maske_Nase', 0.03)]:
        o = bpy.data.objects[n]
        L['add_mod'](o, 'SHRINKWRAP', 'Shrinkwrap', wrap_method='PROJECT', use_project_y=True, use_negative_direction=False,
                     use_positive_direction=True, target=hf, offset=off, wrap_mode='OUTSIDE_SURFACE')

def maske_fertig():
    for n in ['Maske_Stirn', 'Maske_Wange_R', 'Maske_Wange_L', 'Maske_Nase']:
        o = bpy.data.objects[n]
        vg = o.vertex_groups.new(name='Dachknick')
        for v in o.data.vertices: vg.add([v.index], max(0.0, 1 - abs(v.co.x) / 0.38) * (1.0 if v.co.z < 0.60 else max(0.0, 1 - (v.co.z - 0.60) / 0.06)), 'REPLACE')
        L['add_mod'](o, 'DISPLACE', 'Dachknick', direction='Y', strength=-math.tan(math.radians(6)) * 0.38, vertex_group='Dachknick', mid_level=0.0)
        L['add_mod'](o, 'SOLIDIFY', 'Solidify', thickness=0.012, offset=-1, use_even_offset=True)
        L['bevel'](o, width=0.005, seg=2, angle=14); L['wnormal'](o); L['smooth'](o)

def augen():
    def outline(m=0.0):
        return [(0.11 - m, 0.530 - m), (0.26 + m, 0.548 - m), (0.26 + m, 0.608 + m), (0.11 - m, 0.572 + m)]
    o2 = outline()
    v = [(x, -0.75, z) for x, z in o2] + [(x, -0.30, z) for x, z in o2]
    f = [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    c = L['cutter']('Cut_Auge', [(v, f)], mirror=True); setmat(c, 'MAT_Dunkel')
    st = bpy.data.objects['Maske_Stirn']; L['boolean'](st, c, 'Augenschlitze')
    hf = bpy.data.objects['Maske_Traegerhuelle']; ol = outline(0.004)
    for side, sx in (('R', 1), ('L', -1)):
        V, F = [], []; nu, nv = 6, 3
        (x0, z0), (x1, z1), (x2, z2), (x3, z3) = ol
        for j in range(nv + 1):
            t = j / nv
            for i in range(nu + 1):
                u = i / nu; xb, zb = x0 + (x1 - x0) * u, z0 + (z1 - z0) * u; xt, zt = x3 + (x2 - x3) * u, z3 + (z2 - z3) * u
                V.append((sx * (xb + (xt - xb) * t), -0.8, zb + (zt - zb) * t))
        for j in range(nv):
            for i in range(nu):
                a = j * (nu + 1) + i; fc = (a, a + 1, a + nu + 2, a + nu + 1); F.append(fc if sx > 0 else tuple(reversed(fc)))
        o = L['mesh_obj']('Auge_' + side, V, F); o.color = (0.5, 0.9, 0.88, 1); setmat(o, 'MAT_Leucht')
        L['add_mod'](o, 'SHRINKWRAP', 'Shrinkwrap', wrap_method='PROJECT', use_project_y=True, use_negative_direction=False,
                     use_positive_direction=True, target=hf, offset=0.010, wrap_mode='OUTSIDE_SURFACE')
        vg = o.vertex_groups.new(name='Dachknick')
        for vv in o.data.vertices: vg.add([vv.index], max(0.0, 1 - abs(vv.co.x) / 0.38), 'REPLACE')
        L['add_mod'](o, 'DISPLACE', 'Dachknick', direction='Y', strength=-math.tan(math.radians(6)) * 0.38, vertex_group='Dachknick', mid_level=0.0)
        L['add_mod'](o, 'SOLIDIFY', 'Solidify', thickness=0.004, offset=-1)
    c.hide_set(True)

def seitenplatten():
    HU = H['huelle']; hb, outer_fn = H['mask_edge']
    def shell_x(y, z):
        a, bv, bh, nv, nh = L['shell_params'](z, HU); b, n = (bv, nv) if y < 0 else (bh, nh)
        u = min(abs(y) / b, 0.999); return a * (1 - u ** n) ** (1 / n)
    def sx_at(y, z): return min(shell_x(y, z), F_inv_x(y - 0.02, z))
    def edge_x(z): return hb(z) if z >= 0.457 else outer_fn(z)
    def yf(z): return F(edge_x(z) - 0.012, z) + 0.02
    def yr(z): return -0.12 + (z - 0.42) / 0.22 * 0.10
    nz, ny = 10, 8
    for side, sx in (('R', 1), ('L', -1)):
        V = []
        for d in (0.0, 0.006):
            for j in range(nz + 1):
                z = 0.42 + 0.215 * j / nz
                for i in range(ny + 1):
                    y = yf(z) + (yr(z) - yf(z)) * i / ny
                    x = sx_at(y, z); e = 0.002
                    dxdy = (sx_at(y + e, z) - sx_at(y - e, z)) / (2 * e)
                    n = Vector((1.0, -dxdy, 0)).normalized(); n.x *= sx
                    V.append(tuple(Vector((sx * x, y, z)) + n * d))
        W = ny + 1; off = (nz + 1) * W; Fc = []
        for j in range(nz):
            for i in range(ny):
                a = j * W + i; Fc.append((a, a + 1, a + W + 1, a + W)); Fc.append((off + a, off + a + W, off + a + W + 1, off + a + 1))
        ring = [(i, 0) for i in range(ny)] + [(ny, j) for j in range(nz)] + [(i, nz) for i in range(ny, 0, -1)] + [(0, j) for j in range(nz, 0, -1)]
        for q in range(len(ring)):
            i0, j0 = ring[q]; i1, j1 = ring[(q + 1) % len(ring)]
            a, b = j0 * W + i0, j1 * W + i1; Fc.append((a, off + a, off + b, b))
        o = L['mesh_obj']('Maske_Seite_' + side, V, Fc); fixn(o); setmat(o, 'MAT_Dunkel'); o.color = DARK
        sharp(o, 30); L['bevel'](o, width=0.003, seg=2, angle=30); L['wnormal'](o)

# ---------------------------------------------------------------- Kinnleiste
def kinnleiste():
    remove('Blk_Kinn')
    a, bv, bh, nv, nh = H['huelle'][0][1:]
    ts = [math.pi - 0.076 + (math.pi + 0.152) * i / 95 for i in range(96)]
    def cpt(t):
        c, s = math.cos(t), math.sin(t); n_ = nv if s < 0 else nh; b = bv if s < 0 else bh
        return Vector((a * L['sgn'](c) * abs(c) ** (2 / n_), b * L['sgn'](s) * abs(s) ** (2 / n_), 0))
    pts = [cpt(t) for t in ts]
    pts = [Vector((p.x, max(p.y, -0.37 + 0.6 * interp(P['dy_tab'], abs(p.x))) if p.y < 0 else p.y, 0)) for p in pts]
    prof = []; J = 0.02
    for i, p in enumerate(pts):
        q0 = pts[max(i - 1, 0)]; q1 = pts[min(i + 1, len(pts) - 1)]
        tg = (q1 - q0).normalized(); n = Vector((tg.y, -tg.x, 0))
        if n.dot(p) < 0: n = -n
        f = ss((0.34 - abs(p.x)) / 0.05); j = J * ss((0.32 - abs(p.x)) / 0.10)
        zb, zt = 0.06, 0.12 + 0.08 * f; lip = 0.015 * f
        sec = [(0.010, zb), (0.040 + lip + j, zb), (0.040 + lip + j, zb + 0.025), (0.040 + j, zb + 0.035), (0.040 + j * 0.6, zt), (0.010, zt)]
        prof.append([tuple(p + n * d + Vector((0, 0, z))) for d, z in sec])
    M = 6; V = [v for s in prof for v in s]; F = []
    for i in range(len(prof) - 1):
        for jj in range(M):
            j2 = (jj + 1) % M; F.append((i * M + jj, i * M + j2, (i + 1) * M + j2, (i + 1) * M + jj))
    last = (len(prof) - 1) * M; F.append(tuple(range(M - 1, -1, -1))); F.append(tuple(range(last, last + M)))
    k = L['mesh_obj']('Kinnleiste', V, F); fixn(k); setmat(k, 'MAT_Weiss'); k.color = WHITE
    sharp(k, 34); L['bevel'](k, width=0.004, seg=2, angle=30); L['wnormal'](k)

def kinn_panel():
    k = bpy.data.objects['Kinnleiste']
    KZ = P.get('kinn_z', 0.14); KH = P.get('kinn_h', 0.09)
    hit = raycast(['Kinnleiste'], (0, -1.0, KZ), (0, 1, 0)); yk = hit[0].y
    kc = L['surface_box']((0, yk, KZ), (0, -1, 0), (0, 0, 1), P.get('kinn_w', 0.20), KH, 0.010, 0.03)
    c = L['cutter']('Cut_Kinn', [kc]); setmat(c, 'MAT_Dunkel')
    b = L['boolean'](k, c, 'Kinnaussparung'); b.material_mode = 'TRANSFER'; c.hide_set(True)
    v, f = L['surface_box']((0, yk + 0.007, KZ), (0, -1, 0), (0, 0, 1), P.get('kinn_w', 0.20) - 0.006, KH - 0.006, 0.003, 0.003)
    kp = L['mesh_obj']('Kinn_Panel', [tuple(x) for x in v], f); fixn(kp); setmat(kp, 'MAT_Weiss'); kp.color = WHITE
    L['bevel'](kp, width=0.002, seg=2, angle=30); L['wnormal'](kp); L['smooth'](kp)
    parts = [L['surface_box']((0, yk + 0.007, KZ + dz), (0, -1, 0), (0, 0, 1), P.get('kinn_w', 0.20) * 0.6, 0.010, 0.01, 0.01) for dz in (-KH * 0.28, 0, KH * 0.28)]
    c2 = L['cutter']('Cut_Kinn_Schlitze', parts); setmat(c2, 'MAT_Dunkel')
    b2 = L['boolean'](kp, c2, 'Schlitze'); b2.material_mode = 'TRANSFER'; c2.hide_set(True)
    H['kinn_y'] = yk

# ---------------------------------------------------------------- Pods, Rückbox, Hals
def pods():
    for s in ('R', 'L'): remove('Blk_Pod_' + s)
    prof = [(0.394, 0.90), (0.405, 1.0), (0.41, 1.0), (0.425, 0.968), (0.44, 0.866), (0.455, 0.661), (0.465, 0.40), (0.469, 0.15)]
    for side, sx in (('R', 1), ('L', -1)):
        N = 32; V = []; F = []
        for x, s in prof:
            for i in range(N):
                th = 2 * math.pi * i / N; V.append((sx * x, P['pod_y'] + 0.10 * s * math.cos(th), 0.55 + 0.125 * s * math.sin(th)))
        R = len(prof)
        for j in range(R - 1):
            for i in range(N):
                f = (j * N + i, j * N + (i + 1) % N, (j + 1) * N + (i + 1) % N, (j + 1) * N + i); F.append(f if sx > 0 else tuple(reversed(f)))
        c = len(V); V.append((sx * 0.47, P['pod_y'], 0.55))
        for i in range(N):
            f = ((R - 1) * N + i, (R - 1) * N + (i + 1) % N, c); F.append(f if sx > 0 else tuple(reversed(f)))
        base = tuple(range(N - 1, -1, -1)); F.append(base if sx > 0 else tuple(reversed(base)))
        p = L['mesh_obj']('Pod_' + side, V, F); p.color = OLIVE; setmat(p, 'MAT_Pod'); L['smooth'](p)
        L['add_mod'](p, 'SUBSURF', 'Subdivision', levels=2, render_levels=2)

def pod_platten():
    pts, fc = [], []
    W_, H_, R_, nu, nv = 0.16, 0.20, 0.02, 8, 10
    for j in range(nv + 1):
        for i in range(nu + 1):
            y = (i / nu - 0.5) * W_; z = (j / nv - 0.5) * H_
            dy = max(abs(y) - (W_ / 2 - R_), 0); dz = max(abs(z) - (H_ / 2 - R_), 0); d = math.hypot(dy, dz)
            if d > R_: y = math.copysign(W_ / 2 - R_ + dy * R_ / d, y); z = math.copysign(H_ / 2 - R_ + dz * R_ / d, z)
            pts.append((y, z))
    for j in range(nv):
        for i in range(nu):
            a = j * (nu + 1) + i; fc.append((a, a + 1, a + nu + 2, a + nu + 1))
    for side, sx in (('R', 1), ('L', -1)):
        o = L['mesh_obj']('Pod_Platte_' + side, [(sx * 0.46, P['pod_y'] + y, 0.55 + z) for y, z in pts], fc if sx > 0 else [tuple(reversed(p)) for p in fc])
        bm = bmesh.new(); bm.from_mesh(o.data); bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
        bmesh.ops.dissolve_degenerate(bm, edges=bm.edges, dist=1e-5); bm.to_mesh(o.data); bm.free()
        setmat(o, 'MAT_Pod'); o.color = OLIVE
        L['add_mod'](o, 'SHRINKWRAP', 'Shrinkwrap', wrap_method='PROJECT', use_project_x=True, use_negative_direction=True,
                     use_positive_direction=True, target=bpy.data.objects['Schale'], offset=0.0, wrap_mode='OUTSIDE_SURFACE')
        L['add_mod'](o, 'SOLIDIFY', 'Solidify', thickness=0.012, offset=1, use_even_offset=True)
        L['bevel'](o, width=0.003, seg=2, angle=30); L['wnormal'](o); L['smooth'](o)

def yback(x, z):
    a, bv, bh, nv, nh = L['shell_params'](z); u = min(abs(x) / a, 0.999); return bh * (1 - u ** nh) ** (1 / nh)
H['yback'] = yback

def rueckbox():
    remove('Blk_Rueckbox')
    nx, nz = 10, 8; X0, X1, Z0, Z1, YB = -0.15, 0.15, 0.54, 0.76, 0.57
    V = []
    for face in (0, 1):
        for j in range(nz + 1):
            for i in range(nx + 1):
                x = X0 + (X1 - X0) * i / nx; z = Z0 + (Z1 - Z0) * j / nz
                V.append((x, yback(x, z) - 0.004 if face == 0 else YB, z))
    F = []; W = nx + 1; off = (nz + 1) * W
    for j in range(nz):
        for i in range(nx):
            a = j * W + i; F.append((a, a + W, a + W + 1, a + 1)); F.append((off + a, off + a + 1, off + a + W + 1, off + a + W))
    ring = [(i, 0) for i in range(nx)] + [(nx, j) for j in range(nz)] + [(i, nz) for i in range(nx, 0, -1)] + [(0, j) for j in range(nz, 0, -1)]
    for q in range(len(ring)):
        i0, j0 = ring[q]; i1, j1 = ring[(q + 1) % len(ring)]
        a, b = j0 * W + i0, j1 * W + i1; F.append((a, b, off + b, off + a))
    rb = L['mesh_obj']('Rueckbox', V, F); fixn(rb); setmat(rb, 'MAT_Pod'); rb.color = OLIVE
    sharp(rb, 34); L['bevel'](rb, width=0.006, seg=2, angle=30); L['wnormal'](rb)

def hals():
    remove('Hals')
    prof = [(-0.36, 0.33, 0.36), (-0.345, 0.335, 0.365), (-0.33, 0.33, 0.36), (-0.28, 0.29, 0.32), (-0.20, 0.26, 0.29),
            (-0.05, 0.25, 0.28), (0.10, 0.25, 0.28), (0.28, 0.255, 0.285)]
    h = L['loft']('Hals', [L['ring'](z, a, b, b, 2.0, 2.0, N=64, yc=0.03) for z, a, b in prof])
    h.color = (0.05, 0.05, 0.055, 1); setmat(h, 'MAT_Hals'); sharp(h, 40)
    L['add_mod'](h, 'SOLIDIFY', 'Solidify', thickness=0.012, offset=-1)

for k, v in list(globals().items()):
    if callable(v) and not k.startswith('_') and k not in ('ss',):
        B[k] = v

# ---------------------------------------------------------------- Lauf 2b: Maskenschild aus einem Guss
RID = math.tan(math.radians(6)) * 0.38

def schild_ring(z, M=120):
    """Außenkontur des Schilds auf Höhe z: Bogen der Trägerhülle (F bzw. Schale) vor der Hinterkante, +0.02 nach außen,
    mit Mittelgrat. Gibt M gleichabständige Punkte von rechts nach links zurück."""
    T = H['huelle']; pts = L['ring'](z, *L['shell_params'](z, T), N=400)
    hull = [Vector((x, max(y, F(x, z) + 0.02) if y < 0.2 else y, z)) for x, y, zz in pts]
    nrm = []
    for i, p in enumerate(hull):
        t = (hull[(i + 1) % 400] - hull[i - 1]); n = Vector((t.y, -t.x, 0)).normalized()
        if n.dot(Vector((p.x, p.y - 0.05, 0))) < 0: n = -n
        nrm.append(n)
    yb = schild_yb(z)
    outer = []
    for p, n in zip(hull, nrm):
        q = p + n * 0.02
        w = max(0.0, 1 - abs(q.x) / 0.38) * B['ridge_w'](z)
        q.y -= RID * w
        outer.append(q)
    # Bogen vorn (y < yb), Startpunkt rechts
    idx = [i for i in range(400) if outer[i].y < yb]
    start = next(k for k, i in enumerate(idx) if (idx[k - 1] + 1) % 400 != i)
    idx = idx[start:] + idx[:start]
    if outer[idx[0]].x < 0: idx = idx[::-1]
    arc = [outer[i] for i in idx]
    d = [0.0]
    for a_, b_ in zip(arc, arc[1:]): d.append(d[-1] + (b_ - a_).length)
    res, j = [], 0
    for k in range(M):
        s = d[-1] * k / (M - 1)
        while j < len(d) - 2 and d[j + 1] < s: j += 1
        tt = (s - d[j]) / max(d[j + 1] - d[j], 1e-9); res.append(arc[j].lerp(arc[j + 1], tt))
    return res

def schild_yb(z):
    """Hinterkante des Schilds je Höhe: unten Wangenkante, Mitte diagonal nach hinten, oben bis an die Krempe."""
    if z < 0.42:
        x = 0.27 + (z - 0.22) / 0.234 * 0.06
        return F(x, z) + 0.03
    if z < 0.64: return -0.12 + (z - 0.42) / 0.22 * 0.10
    if z < 0.70: return -0.02 + (z - 0.64) / 0.06 * (-0.08)
    return -0.10

def maske_schild():
    for n in ('Blk_Maske', 'Blk_Seite_R', 'Blk_Seite_L'): remove(n)
    ZS = [0.215, 0.25, 0.30, 0.36, 0.40, 0.42, 0.46, 0.50, 0.55, 0.60, 0.64, 0.67, 0.70, 0.735, 0.765]
    rings = [schild_ring(z) for z in ZS]
    o = L['loft']('Maske_Schild', [[tuple(p) for p in r] for r in rings], close_ring=False)
    fixn(o)
    if o.data.polygons[len(o.data.polygons) // 2].normal.y > 0:
        for pp in o.data.polygons: pp.flip()
    setmat(o, 'MAT_Dunkel'); o.color = DARK; sharp(o, 22)
    L['add_mod'](o, 'SOLIDIFY', 'Solidify', thickness=0.012, offset=-1, use_even_offset=False, thickness_clamp=1.0)
    L['bevel'](o, width=0.004, seg=2, angle=40); L['wnormal'](o)

def nase():
    nh = lambda z: 0.06 + (0.394 - z) / 0.188 * 0.05
    zb_n = P.get('nase_zb', 0.206)
    V, Fc = panel(lin(0, 1, 8), 10, lambda u: zb_n, lambda u: 0.40, lambda z: -nh(z), lambda z: nh(z))
    o = L['mesh_obj']('Maske_Nase', V, Fc); o.color = DARK; setmat(o, 'MAT_Dunkel')
    L['add_mod'](o, 'SHRINKWRAP', 'Shrinkwrap', wrap_method='PROJECT', use_project_y=True, use_negative_direction=False,
                 use_positive_direction=True, target=bpy.data.objects['Maske_Traegerhuelle'], offset=0.032, wrap_mode='OUTSIDE_SURFACE')
    vg = o.vertex_groups.new(name='Dachknick')
    for v in o.data.vertices: vg.add([v.index], max(0.0, 1 - abs(v.co.x) / 0.38) * B['ridge_w'](v.co.z), 'REPLACE')
    L['add_mod'](o, 'DISPLACE', 'Dachknick', direction='Y', strength=-RID, vertex_group='Dachknick', mid_level=0.0)
    L['add_mod'](o, 'SOLIDIFY', 'Solidify', thickness=0.014, offset=-1, use_even_offset=True)
    L['bevel'](o, width=0.004, seg=2, angle=30); L['wnormal'](o); L['smooth'](o)

def schild_fugen():
    """Panel-Fugen als schmale Nuten (0.005 × 0.003) im Schild: Stirnfuge mit Keil, Wangenfuge, Seitenfuge, Brauenfuge."""
    S = [SCHILD]
    def proj(pts):
        hits = [B['raycast'](S, Vector((x, -1.2, z)), Vector((0, 1, 0))) for x, z in pts]
        hits = [h for h in hits if h]; return [h[0] for h in hits], [(-h[1] if h[1].y > 0 else h[1]) for h in hits]
    paths = []
    outer = lambda z: 0.27 + (z - 0.22) / 0.234 * 0.06
    st = [(x, 0.456) for x in lin(-0.32, -0.075, 10)] + [(-0.04, 0.42), (0.0, 0.395), (0.04, 0.42)] + [(x, 0.456) for x in lin(0.075, 0.32, 10)]
    paths.append(proj(st))
    for sx in (1, -1):
        paths.append(proj([(sx * x, 0.36) for x in lin(0.12, 0.30, 8)]))
        paths.append(proj([(sx * (outer(z) - 0.004 if z < 0.454 else 0.32 + (z - 0.46) / 0.175 * 0.035), z) for z in lin(0.24, 0.62, 12)]))
    parts = [L['sweep']('f', p, width=0.005, d_in=0.003, d_out=0.03, normals=n) for p, n in paths if len(p) > 2]
    c = L['cutter']('Cut_Schild_Fugen', parts); setmat(c, 'MAT_Dunkel')
    b = L['boolean'](bpy.data.objects[SCHILD], c, 'Fugen'); c.hide_set(True)

def augen_schild():
    def outline(m=0.0):
        return [(0.11 - m, 0.530 - m), (0.26 + m, 0.548 - m), (0.26 + m, 0.608 + m), (0.11 - m, 0.572 + m)]
    o2 = outline()
    v = [(x, -0.75, z) for x, z in o2] + [(x, -0.20, z) for x, z in o2]
    f = [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    c = L['cutter']('Cut_Auge', [(v, f)], mirror=True); setmat(c, 'MAT_Dunkel')
    L['boolean'](bpy.data.objects[SCHILD], c, 'Augenschlitze')
    hf = bpy.data.objects['Maske_Traegerhuelle']; ol = outline(0.004)
    for side, sx in (('R', 1), ('L', -1)):
        V, Fc = [], []; nu, nv = 6, 3
        (x0, z0), (x1, z1), (x2, z2), (x3, z3) = ol
        for j in range(nv + 1):
            t = j / nv
            for i in range(nu + 1):
                u = i / nu; xb, zb = x0 + (x1 - x0) * u, z0 + (z1 - z0) * u; xt, zt = x3 + (x2 - x3) * u, z3 + (z2 - z3) * u
                V.append((sx * (xb + (xt - xb) * t), -0.8, zb + (zt - zb) * t))
        for j in range(nv):
            for i in range(nu):
                a = j * (nu + 1) + i; fc = (a, a + 1, a + nu + 2, a + nu + 1); Fc.append(fc if sx > 0 else tuple(reversed(fc)))
        o = L['mesh_obj']('Auge_' + side, V, Fc); o.color = (0.5, 0.9, 0.88, 1); setmat(o, 'MAT_Leucht')
        L['add_mod'](o, 'SHRINKWRAP', 'Shrinkwrap', wrap_method='PROJECT', use_project_y=True, use_negative_direction=False,
                     use_positive_direction=True, target=hf, offset=0.012, wrap_mode='OUTSIDE_SURFACE')
        vg = o.vertex_groups.new(name='Dachknick')
        for vv in o.data.vertices: vg.add([vv.index], max(0.0, 1 - abs(vv.co.x) / 0.38) * B['ridge_w'](vv.co.z), 'REPLACE')
        L['add_mod'](o, 'DISPLACE', 'Dachknick', direction='Y', strength=-RID, vertex_group='Dachknick', mid_level=0.0)
        L['add_mod'](o, 'SOLIDIFY', 'Solidify', thickness=0.004, offset=-1)
    c.hide_set(True)

def neu_mit_mods(name, builder):
    """Objekt neu aufbauen, aber bestehende Modifikatoren/Referenzen behalten (Mesh-Tausch)."""
    old = bpy.data.objects[name]; old.name = name + '_alt'; old.data.name = name + '_alt'
    builder(); new = bpy.data.objects[name]
    me = new.data; bpy.data.objects.remove(new, do_unlink=True)
    olddata = old.data; old.data = me; old.name = name; me.name = name
    if olddata.users == 0: bpy.data.meshes.remove(olddata)

for k, v in list(globals().items()):
    if callable(v) and not k.startswith('_') and k not in ('ss',):
        B[k] = v

def smax(a, b, k):
    return 0.5 * (a + b + math.sqrt((a - b) ** 2 + k * k))

def kappe_glatt(N=128, R=40, k=0.07):
    """Haube aus einem Guss: Superellipsoid, Front weich (smooth-max) in den Gesichtskeil F übergeblendet – keine harten Schnitte."""
    remove('Kappe')
    c = P['cap']; V = []; Fc = []
    for j in range(R):
        t = (j / R) ** 0.85
        z = c['zc'] + c['c'] * t
        ax = c['a'] * (1 - t ** c['ex']) ** (1 / c['ex'])
        byf = c['bf'] * (1 - t ** c['eyf']) ** (1 / c['eyf']); byb = c['bb'] * (1 - t ** c['eyb']) ** (1 / c['eyb'])
        for x, y, zz in L['ring'](z, ax, byf, byb, 2.6, 2.2, N=N, yc=c['yc']):
            if y < 0.15:
                y = smax(y, F(x, z) - 0.002 - RID * B['ridge_w'](z) * max(0.0, 1 - abs(x) / 0.38), k)
            V.append((x, y, zz))
    for j in range(R - 1):
        for i in range(N): Fc.append((j * N + i, j * N + (i + 1) % N, (j + 1) * N + (i + 1) % N, (j + 1) * N + i))
    top = len(V); tz = c['zc'] + c['c']; V.append((0, c['yc'], tz))
    Fc += [((R - 1) * N + i, (R - 1) * N + (i + 1) % N, top) for i in range(N)]
    bm = bmesh.new(); vs = [bm.verts.new(v) for v in V]
    for f in Fc: bm.faces.new([vs[i] for i in f])
    kill = [f for f in bm.faces if f.calc_center_median().z < 0.765 and f.calc_center_median().y > -0.06]
    bmesh.ops.delete(bm, geom=kill, context='FACES')
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.get('Kappe') or bpy.data.meshes.new('Kappe'); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new('Kappe', me); L['coll']('HELM_V3').objects.link(o); o.parent = bpy.data.objects['HELM_ROOT']
    o.color = DARK; setmat(o, 'MAT_Dunkel'); L['smooth'](o)
    if o.data.polygons[len(o.data.polygons) // 2].normal.z < -0.5:
        for p in o.data.polygons: p.flip()
    L['add_mod'](o, 'SUBSURF', 'Subdivision', levels=1, render_levels=2)
    L['add_mod'](o, 'SOLIDIFY', 'Solidify', thickness=0.015, offset=-1, use_even_offset=False, thickness_clamp=1.0)
    return o

B['kappe_glatt'] = kappe_glatt; B['smax'] = smax
