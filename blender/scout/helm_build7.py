# Lauf 2e: Hinterkopf (Hut, Rückbox) und Kinnleiste an die Meshy-Vorlage.
import bpy, bmesh, math
from mathutils import Vector
SCHILD = 'Kappe'
H = bpy.app.driver_namespace['H']; L = H['lib']; B = H['build']; P = B['P']
DARK, WHITE = (0.10, 0.105, 0.115, 1), (0.85, 0.84, 0.81, 1)

def ss(v): v = max(0.0, min(1.0, v)); return v * v * (3 - 2 * v)

def krempe_flach(off=0.022, hut=0.0):
    """Krempe nur als schmales Band seitlich/hinten; kein hochgezogener Hut (Vorlage hat dort nur die Kuppel)."""
    B['remove']('Krempe')
    N = 96
    pa = L['shell_params'](0.72)
    outer = L['ring'](0, pa[0] + off, pa[1] + off, pa[2] + off, pa[3], pa[4], N)
    pb = L['shell_params'](0.70); pt = L['shell_params'](0.765)
    ib = L['ring'](0, pb[0] - 0.004, pb[1] - 0.004, pb[2] - 0.004, pb[3], pb[4], N)
    it = L['ring'](0, pt[0] - 0.004, pt[1] - 0.004, pt[2] - 0.004, pt[3], pt[4], N)
    idx = [i for i in range(N) if outer[i][1] > -0.06]
    start = next(k for k, i in enumerate(idx) if (idx[k - 1] + 1) % N != i); idx = idx[start:] + idx[:start]
    V, Fc = [], []
    for i in idx:
        x, y, _ = outer[i]; fr = ss((y - 0.20) / 0.14)
        zb = 0.725 + 0.01 * fr; zt = 0.765 + hut * fr      # Kritik R2: schlanke Hinterkante
        V += [(ib[i][0], ib[i][1], zb), (x, y, zb), (x, y, zt), (it[i][0], it[i][1], zt + 0.005)]
    M = len(idx)
    for k in range(M - 1):
        for j in range(4):
            j2 = (j + 1) % 4; Fc.append((4 * k + j, 4 * k + j2, 4 * (k + 1) + j2, 4 * (k + 1) + j))
    Fc.append((3, 2, 1, 0)); e = 4 * (M - 1); Fc.append((e, e + 1, e + 2, e + 3))
    kr = L['mesh_obj']('Krempe', V, Fc); B['fixn'](kr); kr.color = DARK; B['setmat'](kr, 'MAT_Dunkel'); B['sharp'](kr, 34)
    L['bevel'](kr, width=0.003, seg=2, angle=30); L['wnormal'](kr)

def rueckbox_versetzen(dy=-0.015):
    moved = []
    for o in bpy.data.objects:
        if o.users_collection and o.users_collection[0].name == 'AUSGEBAUT': continue
        p = o.matrix_world.translation
        isbox = o.name.startswith('Rueckbox') and o.name != 'Rueckbox_Trapezpanel'
        isscrew = o.name.startswith('Schraube_') and p.y > 0.55 and 0.5 < p.z < 0.8 and abs(p.x) < 0.2
        if isbox or isscrew:
            o.location.y += dy; moved.append(o.name)
    for c in ('Cut_Rueckbox_Platte', 'Cut_Rueckbox_Kratzer'):
        o = bpy.data.objects.get(c)
        if o: o.location.y += dy
    return moved

def kinn_kontur(zs=(0.12, 0.17)):
    bt = H['vtree'][0]; mw = bpy.data.objects['Vorlage_Meshy_v2'].matrix_world; inv = mw.inverted()
    def vhit(o, d):
        h = bt.ray_cast(inv @ Vector(o), (inv.to_3x3() @ Vector(d)).normalized()); return None if h[0] is None else mw @ h[0]
    pts = []
    for k in range(25):
        th = math.radians(-90 + (k - 12) * 6.5); d = Vector((math.cos(th), math.sin(th), 0))
        acc = []
        for z in zs:
            h = vhit(Vector((0, 0.05, z)) + d * 1.5, -d)
            if h: acc.append(Vector((h.x, h.y, 0)))
        if acc: pts.append(sum(acc, Vector()) / len(acc))
    # symmetrisieren und glätten
    pts = sorted(pts, key=lambda p: p.x)
    sym = [Vector(((p.x - q.x) / 2, (p.y + q.y) / 2, 0)) for p, q in zip(pts[::-1], pts)]
    sym = sorted(sym, key=lambda p: p.x)
    for _ in range(3):
        sym = [sym[0]] + [(sym[i - 1] + 2 * sym[i] + sym[i + 1]) / 4 for i in range(1, len(sym) - 1)] + [sym[-1]]
    return sym

def kinnleiste_vorlage():
    B['remove']('Kinnleiste', 'Kinn_Panel', 'Cut_Kinn', 'Cut_Kinn_Schlitze')
    K = kinn_kontur()
    # auf gleichmäßige Bogenlänge
    d = [0.0]
    for a, b in zip(K, K[1:]): d.append(d[-1] + (b - a).length)
    pts, j = [], 0
    for i in range(96):
        s = d[-1] * i / 95
        while j < len(d) - 2 and d[j + 1] < s: j += 1
        t = (s - d[j]) / max(d[j + 1] - d[j], 1e-9); pts.append(K[j].lerp(K[j + 1], t))
    prof = []
    for i, p in enumerate(pts):
        q0 = pts[max(i - 1, 0)]; q1 = pts[min(i + 1, len(pts) - 1)]
        tg = (q1 - q0).normalized(); n = Vector((tg.y, -tg.x, 0))
        if n.dot(Vector((p.x, p.y + 0.05, 0))) < 0: n = -n
        f = ss((0.22 - abs(p.x)) / 0.06)
        zb, zt = 0.06, 0.13 + 0.07 * f; lip = 0.012 * f
        sec = [(-0.030, zb), (0.0 + lip, zb), (0.0 + lip, zb + 0.022), (0.0, zb + 0.032), (0.0, zt), (-0.030, zt)]
        prof.append([tuple(p + n * dd + Vector((0, 0, z))) for dd, z in sec])
    M = 6; V = [v for s in prof for v in s]; Fc = []
    for i in range(len(prof) - 1):
        for jj in range(M):
            j2 = (jj + 1) % M; Fc.append((i * M + jj, i * M + j2, (i + 1) * M + j2, (i + 1) * M + jj))
    last = (len(prof) - 1) * M; Fc.append(tuple(range(M - 1, -1, -1))); Fc.append(tuple(range(last, last + M)))
    k = L['mesh_obj']('Kinnleiste', V, Fc); B['fixn'](k); B['setmat'](k, 'MAT_Weiss'); k.color = WHITE
    B['sharp'](k, 34); L['bevel'](k, width=0.004, seg=2, angle=30); L['wnormal'](k)
    B['kinn_panel']()
    return {'front_y': round(min(p.y for p in pts), 3), 'breite': round(max(p.x for p in pts) * 2, 3)}

for k_, v in list(globals().items()):
    if callable(v) and not k_.startswith('_'): B[k_] = v

def kinn_band_messen(side=1):
    """Höhe des Kinn-Wulsts entlang des Kopfes: je y die Z-Lage der größten seitlichen Ausladung zwischen Z 0,05 und 0,45."""
    bt = H['vtree'][0]; mw = bpy.data.objects['Vorlage_Meshy_v2'].matrix_world; inv = mw.inverted()
    def vhit(o, d):
        h = bt.ray_cast(inv @ Vector(o), (inv.to_3x3() @ Vector(d)).normalized()); return None if h[0] is None else mw @ h[0]
    out = []
    for i in range(17):
        y = -0.30 + i * 0.05
        best = None; prof = []
        for k in range(41):
            z = 0.05 + k * 0.01
            h = vhit((side * 2, y, z), (-side, 0, 0))
            if h:
                prof.append((z, abs(h.x)))
        # lokale Ausladung gegenüber dem gleitenden Mittel (Wulst)
        if len(prof) > 10:
            xs = [p[1] for p in prof]
            bump = [(prof[j][0], xs[j] - (xs[max(j - 6, 0)] + xs[min(j + 6, len(xs) - 1)]) / 2) for j in range(len(xs))]
            zb, b = max(bump, key=lambda t: t[1])
            out.append((round(y, 2), round(zb, 3), round(b, 3), round(max(xs), 3)))
    return out

B['kinn_band_messen'] = kinn_band_messen

# ---------------------------------------------------------------- Kinnleiste als schräges, umlaufendes Band
def band_kanten(y):
    """Unter-/Oberkante des Bandes je y (aus Seitenreferenz): vorn flach am Kinn, Stufe am Kiefer, dann schräg nach hinten oben."""
    zb = 0.06 + 0.04 * ss((y + 0.30) / 0.20) + 0.10 * ss((y + 0.08) / 0.58)
    zt = 0.20 + 0.05 * ss((y + 0.14) / 0.06) + 0.04 * ss((y + 0.08) / 0.58)
    return zb, min(zt, 0.292)                         # auf dem Kragen bleiben (Stufe der Schale bei 0,30)

def schale_punkt(i, z, N):
    pts = L['ring'](z, *L['shell_params'](z), N=N)
    x, y, _ = pts[i]
    if y < 0.2: y = max(y, B['F'](x, z) + 0.035)
    return Vector((x, y, z))

def kinnleiste_band(N=192, NV=8, off=0.004, dicke=0.018):
    B['remove']('Kinnleiste', 'Kinn_Panel', 'Cut_Kinn', 'Cut_Kinn_Schlitze')
    for s in ('R', 'L'):
        o = bpy.data.objects.get('Schale_Kragenblende_' + s)
        if o: bpy.data.objects.remove(o, do_unlink=True)
    grid = []
    for i in range(N):
        y0 = L['ring'](0.15, *L['shell_params'](0.15), N=N)[i][1]
        zb, zt = band_kanten(y0)
        col = []
        for j in range(NV + 1):
            z = zb + (zt - zb) * j / NV
            p = schale_punkt(i, z, N); q0 = schale_punkt((i - 1) % N, z, N); q1 = schale_punkt((i + 1) % N, z, N)
            t = (q1 - q0); n = Vector((t.y, -t.x, 0)).normalized()
            if n.dot(Vector((p.x, p.y - 0.05, 0))) < 0: n = -n
            front = ss((0.24 - abs(p.x)) / 0.06) * (1.0 if p.y < 0 else 0.0)
            lip = 0.012 * front * (1 - j / 2) if j < 2 else 0.0    # Lippe nur unten vorn
            col.append(p + n * (off + lip))
        grid.append(col)
    V = [tuple(v) for col in grid for v in col]; W = NV + 1; Fc = []
    for i in range(N):
        i2 = (i + 1) % N
        for j in range(NV): Fc.append((i * W + j, i2 * W + j, i2 * W + j + 1, i * W + j + 1))
    k = L['mesh_obj']('Kinnleiste', V, Fc); B['fixn'](k)
    c = sum((Vector(v) for v in V), Vector()) / len(V)
    p0 = k.data.polygons[0]
    if (p0.center - Vector((0, 0.05, p0.center.z))).dot(p0.normal) < 0:
        for p in k.data.polygons: p.flip()
    B['setmat'](k, 'MAT_Weiss'); k.color = WHITE; B['sharp'](k, 40)
    L['add_mod'](k, 'SOLIDIFY', 'Solidify', thickness=dicke, offset=1, use_even_offset=False, thickness_clamp=1.0)
    L['bevel'](k, width=0.004, seg=2, angle=30); L['wnormal'](k)
    B['kinn_panel']()
    return {'faces': len(k.data.polygons)}

B['band_kanten'] = band_kanten; B['kinnleiste_band'] = kinnleiste_band

# ---------------------------------------------------------------- Lauf 2g: Kinnband schließt den schwarzen Schirm unten ab
def band_kanten(y):
    """Oberkante = Unterkante des schwarzen Gusses (+ kleine Überlappung), danach weiter in den Hinterkopf."""
    if y < -0.02:
        zt = B['unterkante_guss'](y) + 0.012
    else:
        zt = B['unterkante_guss'](-0.02) * 0 + 0.432 + 0.03 * ss((y + 0.02) / 0.30)   # hinter der Schläfe flach auslaufend
    zt = min(zt, 0.432 + 0.03 * ss((y + 0.02) / 0.30)) if y > -0.12 else zt
    h = 0.155 - 0.065 * ss((y + 0.32) / 0.22)                                        # vorn hoch (Kinn), seitlich schmaler
    return zt - h, zt

def kinnleiste_band(N=192, NV=10, dicke=0.022):
    B['remove']('Kinnleiste', 'Kinn_Panel', 'Cut_Kinn', 'Cut_Kinn_Schlitze')
    for s in ('R', 'L'):
        for n in ('Schale_Kragenblende_' + s,):
            o = bpy.data.objects.get(n)
            if o: bpy.data.objects.remove(o, do_unlink=True)
    ring0 = L['ring'](0.15, *L['shell_params'](0.15), N=N)
    grid = []
    for i in range(N):
        zb, zt = band_kanten(ring0[i][1])
        zs = [zb + (zt - zb) * j / NV for j in range(NV + 1)]
        pts = [schale_punkt(i, z, N) for z in zs]
        q0 = schale_punkt((i - 1) % N, zs[0], N); q1 = schale_punkt((i + 1) % N, zs[0], N)
        t = q1 - q0; n = Vector((t.y, -t.x, 0)).normalized()
        if n.dot(Vector((pts[0].x, pts[0].y - 0.05, 0))) < 0: n = -n
        dmax = max(p.dot(n) for p in pts)                                             # über die Kragenstufe glatt hinweg
        front = ss((0.26 - abs(pts[0].x)) / 0.08) * (1.0 if pts[0].y < 0 else 0.0)
        off = 0.010 + 0.045 * front                                                  # vorn vor den schwarzen Schirm treten
        col = []
        for j, p in enumerate(pts):
            lip = 0.010 * front * max(0.0, 1 - j / 2)
            col.append(p + n * (dmax - p.dot(n) + off + lip))
        grid.append(col)
    W = NV + 1; V = [tuple(v) for col in grid for v in col]; Fc = []
    for i in range(N):
        i2 = (i + 1) % N
        for j in range(NV): Fc.append((i * W + j, i2 * W + j, i2 * W + j + 1, i * W + j + 1))
    k = L['mesh_obj']('Kinnleiste', V, Fc); B['fixn'](k)
    p0 = k.data.polygons[0]
    if (p0.center - Vector((0, 0.05, p0.center.z))).dot(p0.normal) < 0:
        for p in k.data.polygons: p.flip()
    B['setmat'](k, 'MAT_Weiss'); k.color = WHITE; B['sharp'](k, 40)
    L['add_mod'](k, 'SOLIDIFY', 'Solidify', thickness=dicke, offset=-1, use_even_offset=False, thickness_clamp=1.0, use_rim=True)
    L['bevel'](k, width=0.005, seg=3, angle=30); L['wnormal'](k)
    for s in ('R', 'L'):                                                             # Griffpanels liegen unter dem Band
        o = bpy.data.objects.get('Schale_Griffpanel_' + s)
        if o: o.hide_set(True); o.hide_render = True
    B['kinn_panel']()
    return {'faces': len(k.data.polygons)}

B['band_kanten'] = band_kanten; B['kinnleiste_band'] = kinnleiste_band


# ---------------------------------------------------------------- Lauf 2g (Referenz-Front): U-förmiges Kinnband, Schirm sitzt darauf
def phi(x, y):
    return math.degrees(math.atan2(abs(x), -(y - 0.05)))           # 0° vorn Mitte, 90° Seite, 180° hinten

def band_oben(x, y):
    f = phi(x, y)
    return 0.14 + 0.28 * ss(f / 75.0) + 0.03 * ss((f - 75.0) / 60.0)

def band_kanten_xy(x, y):
    zt = band_oben(x, y); h = 0.12 - 0.035 * ss(phi(x, y) / 75.0)
    return zt - h, zt

def kinnleiste_u(N=192, NV=10, dicke=0.022, vor=0.060, glatt=9):
    B['remove']('Kinnleiste', 'Kinn_Panel', 'Cut_Kinn', 'Cut_Kinn_Schlitze')
    for s in ('R', 'L'):
        o = bpy.data.objects.get('Schale_Kragenblende_' + s)
        if o: bpy.data.objects.remove(o, do_unlink=True)
    ring0 = L['ring'](0.15, *L['shell_params'](0.15), N=N)
    cols = []
    for i in range(N):
        zb, zt = band_kanten_xy(ring0[i][0], ring0[i][1])
        zs = [zb + (zt - zb) * j / NV for j in range(NV + 1)]
        pts = [schale_punkt(i, z, N) for z in zs]
        q0 = schale_punkt((i - 1) % N, zs[0], N); q1 = schale_punkt((i + 1) % N, zs[0], N)
        t = q1 - q0; n = Vector((t.y, -t.x, 0)).normalized()
        if n.dot(Vector((pts[0].x, pts[0].y - 0.05, 0))) < 0: n = -n
        front = ss((90.0 - phi(pts[0].x, pts[0].y)) / 40.0)
        cols.append([pts, n, max(p.dot(n) for p in pts) + 0.010 + vor * front, front])
    # Außenfläche je Spalte rundum glätten (keine Sprünge an der Kragenstufe)
    raw = [c[2] for c in cols]
    for i in range(N):
        cols[i][2] = max(raw[i], sum(raw[(i + k) % N] for k in range(-glatt, glatt + 1)) / (2 * glatt + 1))
    grid = []
    for pts, n, dout, front in cols:
        col = []; b0 = pts[0]
        for j, p in enumerate(pts):
            lip = 0.012 * front * max(0.0, 1 - j / 2)
            b = Vector((b0.x, b0.y, p.z))                                           # senkrechtes Band: keine Zacken an der Kragenstufe
            col.append(b + n * (dout - b.dot(n) + lip))
        grid.append(col)
    W = NV + 1; V = [tuple(v) for col in grid for v in col]; Fc = []
    for i in range(N):
        i2 = (i + 1) % N
        for j in range(NV): Fc.append((i * W + j, i2 * W + j, i2 * W + j + 1, i * W + j + 1))
    k = L['mesh_obj']('Kinnleiste', V, Fc); B['fixn'](k)
    p0 = k.data.polygons[0]
    if (p0.center - Vector((0, 0.05, p0.center.z))).dot(p0.normal) < 0:
        for p in k.data.polygons: p.flip()
    B['setmat'](k, 'MAT_Weiss'); k.color = WHITE; L['smooth'](k)
    L['add_mod'](k, 'SOLIDIFY', 'Solidify', thickness=dicke, offset=-1, use_even_offset=False, thickness_clamp=1.0, use_rim=True)
    L['bevel'](k, width=0.005, seg=3, angle=30); L['wnormal'](k)
    for s in ('R', 'L'):
        o = bpy.data.objects.get('Schale_Griffpanel_' + s)
        if o: o.hide_set(True); o.hide_render = True
    B['kinn_panel']()
    return {'vorn_oben': round(band_oben(0, -0.4), 3), 'ecke_oben': round(band_oben(0.3, -0.35), 3), 'seite_oben': round(band_oben(0.37, -0.1), 3)}

def band_kanten(y):
    return band_kanten_xy(0.37, y)          # für Schraubenpositionen an der Seite

B['phi'] = phi; B['band_oben'] = band_oben; B['band_kanten_xy'] = band_kanten_xy; B['band_kanten'] = band_kanten; B['kinnleiste_u'] = kinnleiste_u

# ---------------------------------------------------------------- Lauf 2h: massiver Kinnrand nach Beschreibung (flaches V, Ablage, gestufte Basis)
def band_oben(x, y):
    f = phi(x, y)
    v = 0.14 + 0.27 * max(0.0, min(1.0, (f - 12.0) / 66.0))        # kurzes waagerechtes Mittelstück, dann gerade V-Flanken
    v = v + (0.41 - v) * ss((f - 66.0) / 24.0) if f > 66 else v      # weich in die Seite
    return v + 0.03 * ss((f - 90.0) / 60.0)

def band_kanten_xy(x, y):
    f = phi(x, y); zt = band_oben(x, y)
    h = 0.12 - 0.03 * ss(f / 70.0) + 0.06 * ss((f - 110.0) / 50.0)  # vorn 0,12, seitlich 0,09, hinten breiter 0,15
    return zt - h, zt

def kinnrand(N=192, NV=10, vor=0.075, tiefe=0.05, fase=0.012):
    """Massiver Rand: Außenfläche vorn senkrecht und weit vor dem Schirm, Oberseite als Ablage zur Schale, Fasen an den Außenkanten."""
    B['remove']('Kinnleiste', 'Kinn_Panel', 'Cut_Kinn', 'Cut_Kinn_Schlitze', 'Kinn_Einsatz')
    ring0 = L['ring'](0.15, *L['shell_params'](0.15), N=N)
    cols = []
    for i in range(N):
        zb, zt = band_kanten_xy(ring0[i][0], ring0[i][1])
        zs = [zb + (zt - zb) * j / NV for j in range(NV + 1)]
        pts = [schale_punkt(i, z, N) for z in zs]
        q0 = schale_punkt((i - 1) % N, zs[0], N); q1 = schale_punkt((i + 1) % N, zs[0], N)
        t = q1 - q0; n = Vector((t.y, -t.x, 0)).normalized()
        if n.dot(Vector((pts[0].x, pts[0].y - 0.05, 0))) < 0: n = -n
        front = ss((95.0 - phi(pts[0].x, pts[0].y)) / 45.0)
        cols.append([pts, n, max(p.dot(n) for p in pts) + 0.012 + vor * front, front, zb, zt])
    raw = [c[2] for c in cols]
    for i in range(N):
        cols[i][2] = max(raw[i], sum(raw[(i + k) % N] for k in range(-9, 10)) / 19)
    # Querschnitt je Spalte (geschlossen): innen unten → außen unten (Fase) → außen oben (Fase) → innen oben
    S = []
    for pts, n, dout, front, zb, zt in cols:
        b0 = Vector((pts[0].x, pts[0].y, 0)); din = max(p.dot(n) for p in pts) - 0.004
        def P_(d, z): return Vector((b0.x, b0.y, z)) + n * (d - b0.dot(n))
        f = fase * (0.5 + front)
        S.append([P_(din, zb), P_(dout - f, zb), P_(dout, zb + f), P_(dout, zt - f), P_(dout - f, zt), P_(din, zt)])
    M = 6; V = [tuple(v) for s in S for v in s]; Fc = []
    for i in range(N):
        i2 = (i + 1) % N
        for j in range(M):
            j2 = (j + 1) % M; Fc.append((i * M + j, i2 * M + j, i2 * M + j2, i * M + j2))
    k = L['mesh_obj']('Kinnleiste', V, Fc); B['fixn'](k)
    B['setmat'](k, 'MAT_Weiss'); k.color = WHITE; B['sharp'](k, 35)
    L['bevel'](k, width=0.003, seg=2, angle=35); L['wnormal'](k)
    for s in ('R', 'L'):
        o = bpy.data.objects.get('Schale_Griffpanel_' + s)
        if o: o.hide_set(True); o.hide_render = True
    B['kinn_panel']()
    # hellgrauer Trapez-Einsatz mittig zwischen Maske und Rand
    yk = B['raycast'](['Kinnleiste'], Vector((0, -1, band_oben(0, -0.4) - 0.02)), Vector((0, 1, 0)))[0].y
    zt = band_oben(0, -0.4); tv = [(-0.07, zt), (0.07, zt), (0.05, zt + 0.035), (-0.05, zt + 0.035)]
    ym = B['raycast']([SCHILD, 'Maske_Nase'], Vector((0, -1, zt + 0.03)), Vector((0, 1, 0)))
    y0 = (ym[0].y if ym else yk) + 0.004
    V2 = [(x, y0, z) for x, z in tv] + [(x, y0 + 0.05, z) for x, z in tv]
    e = L['mesh_obj']('Kinn_Einsatz', V2, [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)])
    B['fixn'](e); B['setmat'](e, 'MAT_Gurt'); L['bevel'](e, width=0.003, seg=2); L['smooth'](e)
    return {'vorn': round(band_oben(0, -0.4), 3), 'ecke': round(band_oben(0.3, -0.35), 3), 'seite': round(band_oben(0.37, -0.1), 3), 'yk': round(yk, 3)}

B['band_oben'] = band_oben; B['band_kanten_xy'] = band_kanten_xy; B['kinnrand'] = kinnrand
