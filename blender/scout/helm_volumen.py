# Lauf 4: Kopfvolumen nach critic-Prinzip (headVolume.js) – ein Loft aus drei gezeichneten Profilen.
# Achsen: critic (+Y oben, +Z vorn)  →  hier (+Z oben, −Y vorn):  x = x,  y = Y0 − z_c,  z = y_c + Z0.
import os, bpy, bmesh, json, math
from mathutils import Vector

D = os.path.join(os.environ['SCOUT_DIR'], '')  # set by run.py (blender/scout)
PRM = json.load(open(D + 'helm_params.json'))
Y0, Z0 = PRM['achsen']['y0'], PRM['achsen']['z0']

def ss(e0, e1, x):
    t = max(0.0, min(1.0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t)

def catmull(pts, n=200):
    """Centripetaler Catmull-Rom durch pts (Liste [a, y]) → dichte Punktliste."""
    P = [Vector((a, y)) for a, y in pts]; P = [P[0] + (P[0] - P[1])] + P + [P[-1] + (P[-1] - P[-2])]
    out = []
    seg = len(P) - 3; per = max(2, n // seg)
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        def tj(ti, a, b): return ti + max((b - a).length, 1e-9) ** 0.5
        t0 = 0.0; t1 = tj(t0, p0, p1); t2 = tj(t1, p1, p2); t3 = tj(t2, p2, p3)
        for k in range(per):
            t = t1 + (t2 - t1) * k / per
            a1 = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1
            a2 = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2
            a3 = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3
            b1 = (t2 - t) / (t2 - t0) * a1 + (t - t0) / (t2 - t0) * a2
            b2 = (t3 - t) / (t3 - t1) * a2 + (t - t1) / (t3 - t1) * a3
            out.append((t2 - t) / (t2 - t1) * b1 + (t - t1) / (t2 - t1) * b2)
    out.append(P[-2])
    return out

def profil_fn(pts):
    s = sorted(((p.x, p.y) for p in catmull(pts)), key=lambda q: q[1])
    def f(y):
        if y <= s[0][1]: return s[0][0]
        if y >= s[-1][1]: return s[-1][0]
        lo, hi = 0, len(s) - 1
        while hi - lo > 1:
            m = (lo + hi) // 2
            if s[m][1] < y: lo = m
            else: hi = m
        (a0, y0), (a1, y1) = s[lo], s[hi]
        return a0 + (a1 - a0) * (y - y0) / max(y1 - y0, 1e-9)
    return f

def umriss(half, n=64):
    full = half + [(-u, v) for u, v in reversed(half[1:-1])]
    pts = catmull(full + [full[0]], n * 4)[:-1]
    # gleichabständig n Punkte
    d = [0.0]
    for a, b in zip(pts, pts[1:] + pts[:1]): d.append(d[-1] + (b - a).length)
    out, j = [], 0
    for i in range(n):
        s = d[-1] * i / n
        while d[j + 1] < s: j += 1
        t = (s - d[j]) / max(d[j + 1] - d[j], 1e-9); a = pts[j]; b = pts[(j + 1) % len(pts)]
        out.append(a.lerp(b, t))
    return out

def loft_punkte(rows=72, n=64, inflate=1.0):
    P = PRM['profil']
    w, zf, zb = profil_fn(P['front']), profil_fn(P['sideFront']), profil_fn(P['sideBack'])
    ring = umriss(P['topHalf'], n)
    yTop = min(P['front'][0][1], P['sideFront'][0][1], P['sideBack'][0][1])
    yBot = max(P['front'][-1][1], P['sideFront'][-1][1], P['sideBack'][-1][1])
    R, DM = PRM['crownRounding'], PRM['crownDome']
    rows_out = []
    for j in range(rows + 1):
        t = j / rows; yc = yBot + (yTop - yBot) * math.sin(t * math.pi / 2)
        hw, f, b = max(w(yc), 1e-4), zf(yc), zb(yc)
        rnd = R['strength'] * ss(R['startY'], R['endY'], yc)
        mix = ss(DM['startY'], DM['endY'], yc)
        h = max(0.0, min(1.0, (yc - DM['baseY']) / (yTop - DM['baseY']))); rad = math.sqrt(max(0.0, 1 - h * h))
        hw = hw + (max(DM['radiusX'] * rad, 1e-4) - hw) * mix
        f = f + (DM['radiusFront'] * rad - f) * mix; b = b + (-DM['radiusBack'] * rad - b) * mix
        rnd = rnd + (1 - rnd) * mix
        ring_pts = []
        for p in ring:
            L = max(p.length, 1e-9); ru = p.x + (p.x / L - p.x) * rnd; rv = p.y + (p.y / L - p.y) * rnd
            xc, zc = ru * hw, b + (rv + 1) / 2 * (f - b)
            # aufblasen um Kopfmitte (critic: scale)
            xc *= inflate; zc *= inflate; yy = PRM['achsen']['mitte_yc'] + (yc - PRM['achsen']['mitte_yc']) * inflate
            ring_pts.append(Vector((xc, Y0 - zc, yy + Z0)))
        rows_out.append(ring_pts)
    return rows_out

def kopfvolumen(name='Kopfvolumen', inflate=1.0, rows=72, n=64, coll='CUTTER'):
    H = bpy.app.driver_namespace['H']; L = H['lib']
    rings = loft_punkte(rows, n, inflate)
    V = [tuple(p) for r in rings for p in r]; F = []
    for j in range(len(rings) - 1):
        for i in range(n): F.append((j * n + i, j * n + (i + 1) % n, (j + 1) * n + (i + 1) % n, (j + 1) * n + i))
    cb = len(V); V.append(tuple(sum(rings[0], Vector()) / n))
    ct = len(V); V.append(tuple(sum(rings[-1], Vector()) / n))
    k = len(rings) - 1
    for i in range(n):
        F.append((cb, (i + 1) % n, i)); F.append((ct, k * n + i, k * n + (i + 1) % n))
    o = L['mesh_obj'](name, V, F, cname=coll)
    bm = bmesh.new(); bm.from_mesh(o.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(o.data); bm.free()
    return o
