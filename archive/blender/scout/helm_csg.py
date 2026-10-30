# Lauf 4: Formkonstruktion nach critic (upperHelmet.js / lowerArmor.js) in Blender.
# Alles wird in critic-Koordinaten gebaut (+Y oben, +Z vorn) und am Ende mit M_ACHSEN in unsere Achsen gedreht
# (x, y_c, z_c) -> (x, Y0 - z_c, y_c + Z0). Parameter: helm_params.json.
import os, bpy, bmesh, json, math
from mathutils import Vector, Matrix

D = os.path.join(os.environ['SCOUT_DIR'], '')  # set by run.py (blender/scout)
PRM = json.load(open(D + 'helm_params.json'))
Y0, Z0 = PRM['achsen']['y0'], PRM['achsen']['z0']
M_ACHSEN = Matrix(((1, 0, 0, 0), (0, 0, -1, Y0), (0, 1, 0, Z0), (0, 0, 0, 1)))
H = bpy.app.driver_namespace['H']; L = H['lib']
DEG = math.pi / 180
TMP = 'CSG_TMP'

def _coll(name):
    c = bpy.data.collections.get(name)
    if c is None:
        c = bpy.data.collections.new(name); bpy.context.scene.collection.children.link(c)
    return c

def _obj(name, V, F):
    old = bpy.data.objects.get(name)
    if old: bpy.data.objects.remove(old, do_unlink=True)
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in V], [], F); me.update()
    o = bpy.data.objects.new(name, me); _coll(TMP).objects.link(o)
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
    return o

_n = [0]
def _name(p):
    _n[0] += 1; return f'{p}_{_n[0]}'

# ---------------------------------------------------------------- Grundkörper (critic-Koordinaten)
def volumen(inflate=1.0, dome=True, rows=72, n=64):
    vol = {}; exec(open(D + 'helm_volumen.py').read(), vol)
    P = PRM['profil']; w, zf, zb = vol['profil_fn'](P['front']), vol['profil_fn'](P['sideFront']), vol['profil_fn'](P['sideBack'])
    ring = vol['umriss'](P['topHalf'], n); ss = vol['ss']
    yTop = min(P['front'][0][1], P['sideFront'][0][1], P['sideBack'][0][1])
    yBot = max(P['front'][-1][1], P['sideFront'][-1][1], P['sideBack'][-1][1])
    R, DM = PRM['crownRounding'], PRM['crownDome']; ex = DM.get('expX', 2.0)
    V = []
    for j in range(rows + 1):
        t = j / rows; y = yBot + (yTop - yBot) * math.sin(t * math.pi / 2)
        hw, f, b = max(w(y), 1e-4), zf(y), zb(y)
        rnd = R['strength'] * ss(R['startY'], R['endY'], y)
        if dome:
            mix = ss(DM['startY'], DM['endY'], y); h = max(0.0, min(1.0, (y - DM['baseY']) / (yTop - DM['baseY'])))
            rad = math.sqrt(max(0.0, 1 - h * h)); radx = max(0.0, 1 - h ** ex) ** (1 / ex)
            hw += (max(DM['radiusX'] * radx, 1e-4) - hw) * mix
            f += (DM['radiusFront'] * rad - f) * mix; b += (-DM['radiusBack'] * rad - b) * mix; rnd += (1 - rnd) * mix
        for p in ring:
            Lp = max(p.length, 1e-9); ru = p.x + (p.x / Lp - p.x) * rnd; rv = p.y + (p.y / Lp - p.y) * rnd
            V.append(Vector((ru * hw, y, b + (rv + 1) / 2 * (f - b))))
    F = []
    for j in range(rows):
        for i in range(n): F.append((j * n + i, j * n + (i + 1) % n, (j + 1) * n + (i + 1) % n, (j + 1) * n + i))
    cb = len(V); V.append(sum(V[:n], Vector()) / n); ct = len(V); V.append(sum(V[rows * n:rows * n + n], Vector()) / n)
    for i in range(n): F.append((cb, (i + 1) % n, i)); F.append((ct, rows * n + i, rows * n + (i + 1) % n))
    c = Vector((0, 0.1, 0))
    V = [c + (v - c) * inflate for v in V]
    return _obj(_name('Vol'), V, F)

def prisma(outline, ebene, tiefe=4.0, pos=(0, 0, 0)):
    """outline in der Ebene 'xy' (Extrusion z), 'zy' (Extrusion x, Punkte (z,y)) oder 'xz' (Extrusion y, Punkte (x,z))."""
    n = len(outline); V = []
    for d in (-tiefe / 2, tiefe / 2):
        for a, b in outline:
            if ebene == 'xy': V.append(Vector((a, b, d)))
            elif ebene == 'zy': V.append(Vector((d, b, a)))
            else: V.append(Vector((a, d, b)))
    V = [v + Vector(pos) for v in V]
    F = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    return _obj(_name('Prisma'), V, F)

def halbraum(p, nrm, S=4.0):
    """Bereich (x - p)·n <= 0 als großer Quader."""
    n_ = Vector(nrm).normalized(); p = Vector(p)
    t = n_.orthogonal().normalized(); b = n_.cross(t)
    c = p - n_ * S
    V = [c + n_ * sx * S + t * sy * S + b * sz * S for sx in (-1, 1) for sy in (-1, 1) for sz in (-1, 1)]
    F = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
    return _obj(_name('HR'), V, F)

def quader(gr, pos=(0, 0, 0), rot=(0, 0, 0)):
    from mathutils import Euler
    Mr = Euler(rot, 'XYZ').to_matrix()
    V = [Vector(pos) + Mr @ Vector((sx * gr[0] / 2, sy * gr[1] / 2, sz * gr[2] / 2)) for sx in (-1, 1) for sy in (-1, 1) for sz in (-1, 1)]
    F = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
    return _obj(_name('Q'), V, F)

def ellzylinder(rx, rz, y0, y1, cz, seg=96, top_scale=1.0):
    V = []
    for y, s in ((y0, 1.0), (y1, top_scale)):
        for i in range(seg):
            a = 2 * math.pi * i / seg; V.append(Vector((rx * s * math.cos(a), y, cz + rz * s * math.sin(a))))
    F = [tuple(range(seg - 1, -1, -1)), tuple(range(seg, 2 * seg))] + [(i, (i + 1) % seg, seg + (i + 1) % seg, seg + i) for i in range(seg)]
    return _obj(_name('EZ'), V, F)

def csg(a, *ops):
    """ops: ('I'|'U'|'D', objekt). Wendet nacheinander exakte Booleans an und löscht die Werkzeuge."""
    for op, b in ops:
        m = a.modifiers.new('B', 'BOOLEAN'); m.solver = 'EXACT'; m.object = b
        m.operation = {'I': 'INTERSECT', 'U': 'UNION', 'D': 'DIFFERENCE'}[op]
        with bpy.context.temp_override(object=a, active_object=a):
            bpy.ops.object.modifier_apply(modifier=m.name)
        bpy.data.objects.remove(b, do_unlink=True)
    return a

def kopie(o):
    c = o.copy(); c.data = o.data.copy(); c.name = _name(o.name.split('_')[0]); _coll(TMP).objects.link(c); return c

def treffer(o, p, d):
    from mathutils.bvhtree import BVHTree
    dg = bpy.context.evaluated_depsgraph_get(); t = BVHTree.FromObject(o, dg)
    h = t.ray_cast(Vector(p), Vector(d).normalized())
    return (h[0], h[1]) if h[0] is not None else (None, None)

# ---------------------------------------------------------------- Teile
def facetten(off):
    """Ebene Gesichtsfacetten + Fasen + Schläfenrundung als Halbräume (critic facets/facetBevels/templeRound)."""
    planes = [(Vector(n).normalized(), Vector(n).normalized().dot(Vector(p)) + off) for p, n in PRM['facets']]
    out = [halbraum(u * c, u) for u, c in planes]
    TR = PRM['templeRound']
    for a, b in PRM.get('facetBevels', [[0, 1], [0, 2], [1, 3], [0, 4], [1, 4], [0, 5], [1, 5], [2, 4], [3, 4]]):
        if TR['radius'] > 0 and ((a, b) in ((0, 2), (1, 3))):
            (ua, ca), (ub, cb) = planes[a], planes[b]; r = TR['radius']
            det = ua.x * ub.z - ub.x * ua.z; ca2, cb2 = ca - r, cb - r
            cen = Vector(((ca2 * ub.z - cb2 * ua.z) / det, 0, (ua.x * cb2 - ub.x * ca2) / det))
            s0, s1 = math.atan2(ua.x, ua.z), math.atan2(ub.x, ub.z)
            for i in range(1, TR['segments']):
                ang = s0 + (s1 - s0) * i / TR['segments']; nn = Vector((math.sin(ang), 0, math.cos(ang)))
                out.append(halbraum(cen + nn * r, nn))
            continue
        s = planes[a][0] + planes[b][0]; ln = s.length
        cb = (planes[a][1] + planes[b][1]) / ln - PRM.get('bevelWidth', 0.002); u = s / ln
        out.append(halbraum(u * cb, u))
    return out

def oberhelm():
    CT = PRM['crownTransition']; cap = PRM['capEdgeY']; zb = PRM.get('maskBackZ', 0.02)
    brow = Vector((0, CT.get('browY', cap), CT['anchorZ'])); sl = CT['slope']   # Braue (Gesicht) getrennt von der Kappenkante (Seite/hinten)
    # Haube H01: Volumen minus (unter der Braue ∩ unter der Kappenkante)
    crown = volumen(1.0, PRM.get('crownDomeAn', True))
    unter = csg(halbraum(brow, (0, 1, sl)), ('I', halbraum((0, cap, 0), (0, 1, 0))))
    crown = csg(crown, ('D', unter)); crown.name = 'Kappe'
    # Gesichtsschale H02–H06
    mf = PRM.get('maskFront', [[0.6, 0.16], [0.38, 0.01], [0.205, -0.35]])   # Halbumriss der Gesichtsplatte (x, y) von oben nach unten
    front = prisma([[-0.6, 0.8]] + [[-x, y] for x, y in mf] + [[x, y] for x, y in reversed(mf)] + [[0.6, 0.8]], 'xy')
    side = prisma(PRM.get('maskSide', [[zb - 0.02, 0.8], [0.8, 0.8], [0.8, 0.05], [0.49, -0.335], [0.16, -0.335], [0.1, -0.29], [0.0, -0.2], [zb + 0.02, 0.05]]), 'zy')
    shell = volumen(1.022, False)
    shell = csg(shell, ('I', front), ('I', side), ('I', halbraum(brow, (0, 1, sl))), *[('I', h) for h in facetten(0.011)])
    shell.name = 'Maske'
    return crown, shell

def augen_mund(shell):
    v = PRM['visor']; from mathutils import Euler
    glows = []
    def fenster(s, hp, yaw, breite, name):
        rot = Euler((0, s * yaw * DEG, s * v['angleDeg'] * DEG), 'XYZ'); ax = rot.to_matrix() @ Vector((0, 0, 1))
        at = lambda d: hp + ax * d
        # Sockel: vierseitiger Pyramidenstumpf (außen weit), dann Schlitz
        W, Hh = breite + v['socketMarginWidth'], v['height'] + v['socketMarginHeight']; dd = v['socketDepth'] + 0.03
        Rm = rot.to_matrix(); c0 = at(-v['socketDepth'] / 2 + 0.015)
        V = [c0 + Rm @ Vector((sx * W / 2 * k, sy * Hh / 2 * k, zz)) for zz, k in ((-dd / 2, 0.8), (dd / 2, 1.0)) for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
        sock = _obj(_name('Sockel'), V, [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)])
        slit = quader((breite, v['height'], 0.3), at(-v['socketDepth'] - v['slitDepth'] + 0.15), tuple(rot))
        csg(shell, ('D', sock), ('D', slit))
        g = quader((breite - 0.002, v['height'] - 0.002, 0.004), at(-v['socketDepth'] - 0.002), tuple(rot))
        g.name = name; glows.append(g)
    for s in (-1, 1):
        x = s * v['x']; hp, hn = treffer(shell, (x, v['y'], 2), (0, 0, -1)); z = hp.z if hp else 0.45
        p0 = Vector((x, v['y'], z))
        fenster(s, p0, v['yawDeg'], v['width'], 'Auge_' + ('L' if s > 0 else 'R'))
        sf = v.get('side')
        if sf:   # Seitenteil des Fensters: schließt am äußeren Ende an und läuft um die Schläfenfase (ein Fenster um die Ecke)
            R1 = Euler((0, s * v['yawDeg'] * DEG, s * v['angleDeg'] * DEG), 'XYZ').to_matrix()
            R2 = Euler((0, s * sf['yawDeg'] * DEG, s * v['angleDeg'] * DEG), 'XYZ').to_matrix()
            ende = p0 + R1 @ Vector((s * v['width'] / 2, 0, 0))
            mitte = ende + R2 @ Vector((s * (sf['len'] / 2 - sf.get('overlap', 0.01)), 0, 0)); n_ = R2 @ Vector((0, 0, 1))
            hp, _ = treffer(shell, mitte + n_ * 0.5, -n_)
            if hp: fenster(s, hp, sf['yawDeg'], sf['len'], 'Auge_' + ('L' if s > 0 else 'R') + '_Seite')
    # Mund-Aussparung (Trapez) + Schlitz
    mo = PRM['mouth']
    def sz(x, y):
        hp, _ = treffer(shell, (x, y, 2), (0, 0, -1)); return hp.z if hp else 0.4
    ft = min(sz(0, -0.07), sz(0.06, -0.07)) - 0.05; fb = min(sz(0, -0.335), sz(0.13, -0.335)) - 0.05
    n = len(mo['outline']); V = []
    for a, b in mo['outline']:
        fl = ft + (fb - ft) * (b + 0.07) / (-0.335 + 0.07); V.append(Vector((a, b, fl)))
    V += [Vector((a, b, 2.0)) for a, b in mo['outline']]
    F = [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    zm = sz(0, -0.2)
    csg(shell, ('D', _obj(_name('Mund'), V, F)), ('D', quader((mo['slotWidth'], 0.014, 0.2), (0, mo['slotY'], zm - mo['depth'] - 0.025 + 0.1))))
    # Schläfenmulden (Dreiecks-Stumpf)
    for s in (-1, 1):
        hp, _ = treffer(shell, (s * 2, 0.26, 0.15), (-s, 0, 0))
        if hp is None: continue
        bpy.ops.mesh.primitive_cylinder_add(vertices=3, radius=0.042, depth=0.05, location=hp)
        t = bpy.context.active_object; t.name = _name('Tri')
        for c in list(t.users_collection): c.objects.unlink(t)
        _coll(TMP).objects.link(t)
        t.rotation_euler = (0, s * 0.3, -s * math.pi / 2)
        csg(shell, ('D', t))
    return glows

def wangen(shell):
    """Wangenmodul (H-Seite): Block an der Maskenhinterkante mit Querrillen, auf die Maskenfläche gesetzt."""
    w = PRM.get('cheek'); out = []
    if not w: return out
    for s in (-1, 1):
        hp, hn = treffer(shell, (s * 2, w['y'], w['z']), (-s, 0, 0))
        if hp is None: continue
        ang = math.atan2(hn.x, hn.z); c = hp + hn * (w['t'] / 2 - 0.008)
        q = quader((w['w'], w['h'], w['t']), c, (0, ang, 0))
        t = Vector((math.cos(ang), 0, -math.sin(ang)))
        for k in range(w['rillen']):
            dy = (k - (w['rillen'] - 1) / 2) * w['h'] / (w['rillen'] + 1)
            csg(q, ('D', quader((w['w'] * 0.7, 0.012, 0.02), c + hn * (w['t'] / 2) + Vector((0, dy, 0)) - t * w['w'] * 0.08, (0, ang, 0))))
        q.name = 'Wange_' + ('L' if s > 0 else 'R'); out.append(q)
    return out

def wangenplatten(shell):
    """critic: Wangenplatten entlang einer flachen V-Fuge mit echtem Spalt vom Gesichtsschild trennen."""
    wp = PRM.get('cheekSeam')
    if not wp: return shell, []
    sm, gap = wp['y'], wp['gap']
    platten = []
    for s in (-1, 1):
        p = csg(kopie(shell), ('I', halbraum((0, sm - gap, 0), (-s * 0.23, 1, 0.05))), ('I', halbraum((0, 0, 0), (-s, 0, 0))))
        p.name = 'Wangenplatte_' + ('L' if s > 0 else 'R'); platten.append(p)
    csg(shell, ('I', halbraum((0, sm + gap, 0), (0.23, -1, -0.05))), ('I', halbraum((0, sm + gap, 0), (-0.23, -1, -0.05))))
    return shell, platten

def fugen_schrauben():
    """In unseren Achsen: dunkle Fuge hinter der Maskenkante (critic maskGap) und Schrauben auf dem Gesichtsschild."""
    B = H['build']; maske = bpy.data.objects['Maske']; out = []
    for n in [o.name for o in bpy.data.objects if o.name.startswith(('Maskenfuge_', 'Maske_Schraube_'))]:
        bpy.data.objects.remove(bpy.data.objects[n], do_unlink=True)
    ziele = [maske] + [o for o in bpy.data.objects if o.name.startswith('Wangenplatte_')]
    def hit(p, d):
        best = None
        for o in ziele:
            mi = o.matrix_world.inverted(); hp, hn = treffer(o, mi @ Vector(p), (mi.to_3x3() @ Vector(d)))
            if hp is not None:
                hp = o.matrix_world @ hp; dd = (hp - Vector(p)).length
                if best is None or dd < best[0]: best = (dd, hp, (o.matrix_world.to_3x3() @ hn).normalized())
        return best
    for s in (-1, 1):
        pts = []
        for z, y in PRM.get('maskGap', []):
            h = hit((s * 2, Y0 - z, y + Z0), (-s, 0, 0))
            if h: pts.append(tuple(h[1]))
        if len(pts) > 1:
            out.append(B['bez']('Maskenfuge_' + ('L' if s > 0 else 'R'), [pts], 0.0065, 'MAT_Dunkel', (0.06, 0.06, 0.065, 1)).name)
    for i, (x, y) in enumerate(PRM.get('maskScrews', [])):
        for s in (-1, 1):
            h = hit((s * x, Y0 - 2, y + Z0), (0, 1, 0))
            if h: out.append(B['place'](f'Maske_Schraube_{i}_{"L" if s > 0 else "R"}', B['cyl'](0.009, 0.006, 16, 0.003), h[1] - h[2] * 0.002, h[2], 'MAT_Metall', (0.45, 0.45, 0.46, 1)).name)
    return out

def unterhelm():
    c = PRM['core']; k = PRM['collar']; E = PRM['lowerArmorEdges']
    core = ellzylinder(c['rx'], c['rz'], c['y0'], c['y1'], c['cz'], E['radialSegments'], c.get('topScale', 1.0))   # oben verjüngt
    fz, ft, fk = c.get('frontZ', 0.15), c.get('frontZTop', c.get('frontZ', 0.15)), c.get('frontKnickY', 0.15)
    if c.get('frontKurve'):   # Vorderkante folgt der Haubenkante (Punkte (z_c, y_c) von unten nach oben)
        kv = c['frontKurve']
        core = csg(core, ('I', prisma([[-1, -1], [kv[0][0], -1]] + kv + [[kv[-1][0], 1], [-1, 1]], 'zy')))
    else:
        core = csg(core, ('I', prisma([[-1, -1], [fz, -1], [fz, fk], [ft, c.get('frontTopY', 0.2)], [ft, 1], [-1, 1]], 'zy')))   # Vorderkante: unten vorn, oben zurück (2h-Haube)
    for x in (-0.17, 0.17): csg(core, ('D', quader((0.006, 0.6, 0.2), (x, 0.1, -0.5))))
    csg(core, ('D', quader((0.2, 0.6, 0.006), (-0.42, 0.1, -0.2))), ('D', quader((0.2, 0.6, 0.006), (0.42, 0.1, -0.3))))
    csg(core, ('I', volumen(c.get('inflate', 0.985), PRM.get('crownDomeAn', True)))); core.name = 'Kern'
    # Kragen: Ring mit gefaster Oberkante, vorn offen, hinten Absenkung, nach vorn geneigt
    bs = k.get('bottomScale', 1.0)   # unten verjüngt
    ring = ellzylinder(k['rx'] * bs, k['rz'] * bs, k['y0'], k['y1'] - E['chamferHeight'] + 0.001, k['cz'], E['radialSegments'], 1 / bs)
    top = ellzylinder(k['rx'], k['rz'], k['y1'] - E['chamferHeight'], k['y1'], k['cz'], E['radialSegments'], E['topScale'])
    CF = PRM['collarFront']
    csg(ring, ('U', top), ('D', ellzylinder(k['rx'] * 0.86, k['rz'] * 0.86, k['y0'] - 0.1, k['y1'] + 0.1, k['cz'], E['radialSegments'])),
        ('D', prisma([[CF['topZ'], k['y1']], [CF['topZ'], k['y1'] + 0.2], [1, k['y1'] + 0.2], [1, k['y0'] - 0.2],
                      [CF['bottomZ'], k['y0'] - 0.2], [CF['bottomZ'], k['y0']]], 'zy')))
    dip = [[x, k['y1'] + dy] for x, dy in k['dip']]
    csg(ring, ('D', prisma(dip, 'xy', 1.0, (0, 0, -0.75))))
    ring.data.transform(Matrix.Rotation(k['tilt'], 4, 'X')); ring.name = 'Kragen'
    nr = PRM['neckRing']; neck = ellzylinder(nr['rx'], nr['rz'], nr['y0'], nr['y1'], -0.02); neck.name = 'Halsring'
    if nr.get('aus'): bpy.data.objects.remove(neck, do_unlink=True); neck = None   # Lauf 6: kein dunkler Zylinder unter der Kinnleiste
    # Kiefer: Schnitt aus Front-, Seiten- und Draufsicht-Silhouette
    t = PRM.get('jaw', {}).get('top', k['y1'])   # Oberkante Kiefer (Lauf 6: Seitenteile bis an die Haubenkante hochgezogen)
    fh = [[x, (t if y == 'top' else y)] for x, y in PRM.get('jaw', {}).get('frontHalb', [[0.37, 'top'], [0.37, -0.12], [0.4, -0.18], [0.4, -0.26],
                                                                               [0.3, -0.38], [0.24, -0.4], [0.17, -0.49]])]   # rechte Hälfte, oben → unten
    fr = prisma([[-x, y] for x, y in fh] + [[x, y] for x, y in reversed(fh)], 'xy')
    fb = PRM.get('jaw', {}).get('front_bar', [[0.44, -0.335], [0.475, -0.39], [0.475, -0.465], [0.43, -0.5], [0.16, -0.47]])
    sd = prisma(PRM.get('jaw', {}).get('side_top', [[-0.08, t], [0.0, t], [0.06, -0.16], [0.14, -0.25]]) + fb + [PRM.get('jaw', {}).get('hintenUnten', [-0.08, -0.3])], 'zy')
    tp = prisma([[-0.4, -0.12], [-0.4, 0.12], [-0.33, 0.24], [-0.2, 0.4], [-0.1, 0.475], [0.1, 0.475], [0.2, 0.4], [0.33, 0.24], [0.4, 0.12], [0.4, -0.12]], 'xz')
    jaw = csg(fr, ('I', sd), ('I', tp))
    for s in (-1, 1):
        csg(jaw, ('D', quader((0.006, 0.2, 0.3), (s * 0.175, -0.44, 0.4))))
        if not PRM.get('jaw', {}).get('seitenNuten', True): continue   # Lauf 6 (Marker 4): schräge Seitennut und Wangenschlitz aus
        csg(jaw, ('D', quader((0.3, 0.3, 0.006), (s * 0.4, -0.25, 0.3), (0.5, 0, 0))))
        sl = PRM.get('cheekSlot', {'x': 0.32, 'y': -0.33, 'w': 0.035, 'h': 0.1, 'tilt': 0.15})
        hp, _ = treffer(jaw, (s * sl['x'], sl['y'], 2), (0, 0, -1))
        if hp: csg(jaw, ('D', quader((sl['w'], sl['h'], 0.12), (s * sl['x'], sl['y'], hp.z), (0, 0, s * sl['tilt']))))
    J = PRM.get('jaw', {})
    if J.get('kerbe', True):   # Trapezkerbe oben im Kinnblock; Lauf 6: Flanken setzen die Mundvertiefung fort (vor lift/zurueck)
        csg(jaw, ('D', prisma(J.get('kerbeUmriss', [[-0.075, -0.32], [0.075, -0.32], [0.05, -0.365], [-0.05, -0.365]]), 'xy', 1.0,
                              (0, 0, J.get('kerbeZ', 0.3) + 0.5))))
    lift = PRM.get('jaw', {}).get('lift', 0.0)
    if lift:   # Kinnleiste starr anheben, oben an der alten Oberkante (Kragen) abschneiden
        jaw.data.transform(Matrix.Translation((0, lift, -PRM['jaw'].get('zurueck', 0.0)))); jaw.data.update()   # hoch und nach hinten
        if PRM['jaw'].get('liftSchnitt', False): csg(jaw, ('I', halbraum((0, t, 0), (0, 1, 0))))
    kinn = csg(kopie(jaw), ('I', halbraum((0.172, 0, 0), (1, 0, 0))), ('I', halbraum((-0.172, 0, 0), (-1, 0, 0)))); kinn.name = 'Kinnblock'
    kl = csg(kopie(jaw), ('I', halbraum((0.178, 0, 0), (-1, 0, 0)))); kl.name = 'Kiefer_L'
    kr = csg(jaw, ('I', halbraum((-0.178, 0, 0), (1, 0, 0)))); kr.name = 'Kiefer_R'
    return [o for o in (core, ring, neck, kinn, kl, kr) if o is not None]

def uebernehmen(objs, mats):
    """In unsere Achsen drehen, an HELM_ROOT hängen, Material setzen."""
    root = bpy.data.objects.get('HELM_ROOT'); out = []
    for o in objs:
        o.data.transform(M_ACHSEN); o.data.update()
        for c in list(o.users_collection): c.objects.unlink(o)
        L['coll']('HELM_V3').objects.link(o); o.parent = root
        basis = o.name.split('.')[0]
        m = mats.get(basis, mats.get(basis.split('_')[0]))
        if m:
            o.data.materials.clear(); o.data.materials.append(bpy.data.materials[m])
        for p in o.data.polygons: p.use_smooth = True
        with bpy.context.temp_override(object=o, active_object=o, selected_editable_objects=[o], selected_objects=[o]):
            bpy.ops.object.shade_smooth_by_angle(angle=math.radians(30))
        out.append(o.name)
    return out


def ohrmodule_neu():
    """Funkmuscheln nach critic earR: abgerundete Kapsel außen vor der Schale, mit Ring, Knöpfen, Halter; in unseren Achsen."""
    e = PRM['earR']; root = bpy.data.objects.get('HELM_ROOT'); out = []
    py, pz = Y0 - e['cz'], e['cy'] + Z0
    for side, sx in (('R', 1), ('L', -1)):
        for nm in ('Ohrmodul', 'Ohrmodul_Ring', 'Ohrmodul_Kappe', 'Ohrmodul_Halter', 'Ohrmodul_Buegel'):
            o = bpy.data.objects.get(f'{nm}_{side}')
            if o: bpy.data.objects.remove(o, do_unlink=True)
        N, R = 40, 16; V = []; F = []
        a, b, c = e['d'] / 2, e['w'] / 2, e['h'] / 2; x0 = e['outerX'] - e['d'] / 2
        if 'abstand' in e:   # Muschel sitzt auf der Kernfläche statt auf festem outerX (Kern ist hinten schmaler)
            hk, _ = treffer(bpy.data.objects[H.get('traeger', 'Kern')], (sx * 2, py, pz), (-sx, 0, 0))
            if hk: x0 = abs(hk.x) + e['abstand'] + a
        xs = x0 - a - e.get('abstand', 0.0); H['ohr_x'] = x0 + a
        for j in range(R + 1):
            t = -1 + 2 * j / R; s = (1 - abs(t) ** e.get('exV', 3.0)) ** (1 / e.get('exV', 3.0))
            for i in range(N):
                th = 2 * math.pi * i / N; cs, sn = math.cos(th), math.sin(th)
                eh = 2 / e.get('exH', 3.5); V.append(Vector((sx * (x0 + a * s * math.copysign(abs(cs) ** eh, cs)), py + b * s * math.copysign(abs(sn) ** eh, sn), pz + c * t)))
        for j in range(R):
            for i in range(N):
                f = (j * N + i, j * N + (i + 1) % N, (j + 1) * N + (i + 1) % N, (j + 1) * N + i); F.append(f if sx > 0 else tuple(reversed(f)))
        o = L['mesh_obj']('Ohrmodul_' + side, [tuple(v) for v in V], F)
        bm = bmesh.new(); bm.from_mesh(o.data); bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(o.data); bm.free()
        o.data.materials.append(bpy.data.materials['MAT_Modul']); o.color = (0.29, 0.29, 0.24, 1)
        for p in o.data.polygons: p.use_smooth = True
        o.parent = root; out.append(o.name)
        aus = Vector((sx * (x0 + a), py, pz))
        B = H['build']
        B['place']('Ohrmodul_Ring_' + side, B['stack']([(B['cyl'](0.045, 0.008, 40), -0.004), (B['cyl'](0.03, 0.006, 40), 0.004)]), aus + Vector((0, -0.01, 0.04)), (sx, 0, 0), 'MAT_Dunkel', (0.1, 0.1, 0.1, 1))
        B['place']('Ohrmodul_Kappe_' + side, B['cyl'](0.018, 0.008, 32, 0.004), aus + Vector((0, 0.03, -0.08)), (sx, 0, 0), 'MAT_Dunkel', (0.1, 0.1, 0.1, 1))
        v, f = L['surface_box'](Vector((sx * (x0 - a + 0.005), py, pz + c * 0.8)), Vector((sx, 0, 0)), (0, 0, 1), 0.05, 0.08, 0.02, 0.02)
        hb = L['mesh_obj']('Ohrmodul_Halter_' + side, [tuple(x) for x in v], f); B['fixn'](hb); B['setmat'](hb, 'MAT_Dunkel'); L['smooth'](hb)
        bg = e.get('buegel')
        if bg:   # Bügel: flacher Steg von der Muschel-Oberkante bis unter die Haubenkante
            z0, z1 = pz + c * 0.85, PRM['capEdgeY'] + Z0 + 0.02
            v, f = L['surface_box'](Vector((sx * (xs + 0.003), py + bg.get('dy', 0.0), (z0 + z1) / 2)), Vector((sx, 0, 0)), (0, 0, 1), bg['w'], z1 - z0, 0.004, bg['t'])
            bo = L['mesh_obj']('Ohrmodul_Buegel_' + side, [tuple(x) for x in v], f); B['fixn'](bo); B['setmat'](bo, 'MAT_Dunkel'); L['smooth'](bo)
    H['ohr'] = (py, pz)
    for n in ('Antenne_L', 'Antenne_Stummel_R'):
        o = bpy.data.objects.get(n)
        if o: o.location.x = math.copysign(H.get('ohr_x', e['outerX']) - 0.02, o.location.x); o.location.y = py; o.location.z = pz + e['h'] / 2 - 0.02
    return out

def rueckmodul_neu():
    """Rückmodul nach critic backBox: Montageplatte, Box mit abgeschrägt-eingelassenem Feld, Hebel, vier Eckschrauben.
    Ersetzt das achteckige Lauf-3-Modul (Rueckbox*); setzt H['box'] für den Spiralschlauch. In unseren Achsen."""
    bb = PRM.get('backBox'); B = H['build']
    if not bb: return []
    for o in list(bpy.data.objects):
        if o.name.startswith(('Rueckbox', 'Cut_Rueckbox', 'Rueckmodul')): bpy.data.objects.remove(o, do_unlink=True)
    kern = bpy.data.objects[H.get('traeger', 'Kern')]; Z = bb['cy'] + Z0   # Lauf 6: Träger ist die 2h-Schale
    hp, _ = treffer(kern, (bb['x'], 2, Z), (0, -1, 0))
    S = hp if hp else Vector((bb['x'], 0.45, Z)); n = Vector((0, 1, 0)); up = Vector((0, 0, 1)); r = Vector((-1, 0, 0))
    W, Hh = bb['w'], bb['h']; out = []
    def kasten(name, c, w, h, din, dout, mat):
        v, f = L['surface_box'](c, n, up, w, h, din, dout); o = L['mesh_obj'](name, [tuple(x) for x in v], f)
        B['fixn'](o); B['setmat'](o, mat); out.append(o); return o
    kasten('Rueckmodul_Platte', S, W + 0.03, Hh + 0.03, 0.03, 0.012, 'MAT_Dunkel')
    box = kasten('Rueckmodul', S + n * 0.012, W, Hh, 0.0, bb['d'], 'MAT_Modul')
    # eingelassenes Feld (Achteck mit Fasen), 0,012 tief
    rw, rh, ch = W * 0.31, Hh * 0.28, 0.022
    feld = [(-rw + ch, rh), (rw - ch, rh), (rw, rh - ch), (rw, -rh + ch), (rw - ch, -rh), (-rw + ch, -rh), (-rw, -rh + ch), (-rw, rh - ch)]
    fv = S + n * (0.012 + bb['d']); V = [fv + n * d + r * a + up * b for d in (-0.012, 0.05) for a, b in feld]; k = len(feld)
    F = [tuple(range(k - 1, -1, -1)), tuple(range(k, 2 * k))] + [(i, (i + 1) % k, k + (i + 1) % k, k + i) for i in range(k)]
    cut = L['mesh_obj']('Rueckmodul_Feld_cut', V, F); B['fixn'](cut); csg(box, ('D', cut))
    bv = box.modifiers.new('Fase', 'BEVEL'); bv.width = 0.005; bv.segments = 2; bv.limit_method = 'ANGLE'
    # Hebel im Feld: Drehpunkt + schräger Arm
    boden = fv - n * 0.012
    out.append(B['place']('Rueckmodul_Hebel', B['cyl'](0.014, 0.008, 24), boden, (0, 1, 0), 'MAT_Metall', (0.45, 0.45, 0.46, 1)))
    v, f = L['surface_box'](boden + n * 0.012 + (r * math.sin(0.5) + up * math.cos(0.5)) * 0.03, n, r * math.sin(0.5) + up * math.cos(0.5), 0.012, 0.07, 0.0, 0.006)
    arm = L['mesh_obj']('Rueckmodul_Hebel_Arm', [tuple(x) for x in v], f); B['fixn'](arm); B['setmat'](arm, 'MAT_Metall'); out.append(arm)
    for i, (sx, sy) in enumerate(((-1, -1), (1, -1), (1, 1), (-1, 1))):
        p = fv + r * (sx * (W / 2 - 0.025)) + up * (sy * (Hh / 2 - 0.025))
        out.append(B['place'](f'Rueckmodul_Schraube_{i}', B['cyl'](0.009, 0.006, 16, 0.003), p, (0, 1, 0), 'MAT_Metall', (0.45, 0.45, 0.46, 1)))
    H['box'] = (Vector((bb['x'], S.y, Z)), S.y + 0.012 + bb['d'])
    return [o.name for o in out]

TEILE = ('Kappe', 'Maske', 'Wangenplatte_L', 'Wangenplatte_R', 'Auge_L', 'Auge_R', 'Auge_L_Seite', 'Auge_R_Seite', 'Wange_L', 'Wange_R', 'Kern', 'Kragen', 'Halsring', 'Kinnblock', 'Kiefer_L', 'Kiefer_R')
MATS = {'Kappe': 'MAT_Dunkel', 'Maske': 'MAT_Dunkel', 'Wangenplatte': 'MAT_Dunkel', 'Wange': 'MAT_Dunkel', 'Auge': 'MAT_Leucht', 'Kern': 'MAT_Weiss', 'Kragen': 'MAT_Weiss',
        'Halsring': 'MAT_Weiss', 'Kinnblock': 'MAT_Weiss', 'Kiefer': 'MAT_Weiss'}
FARBEN = {'MAT_Dunkel': (0.10, 0.105, 0.115, 1), 'MAT_Weiss': (0.85, 0.84, 0.81, 1), 'MAT_Leucht': (0.5, 0.9, 0.88, 1)}

def aufbau(anbau=True):
    """Alle Grundteile neu aus dem Volumen bauen (Lauf 4). Anbauteile (Ohrmodule, Schlauch) optional neu setzen."""
    for n in TEILE:
        o = bpy.data.objects.get(n)
        if o: bpy.data.objects.remove(o, do_unlink=True)
    crown, shell = oberhelm(); glows = augen_mund(shell); wg = wangen(shell); shell, platten = wangenplatten(shell); unten = unterhelm()
    namen = uebernehmen([crown, shell] + platten + glows + wg + list(unten), MATS)
    for n in namen:
        o = bpy.data.objects[n]
        if o.name != o.name.split('.')[0] and o.name.split('.')[0] not in bpy.data.objects: o.name = o.name.split('.')[0]
        if o.name == 'Halsring' and PRM['neckRing'].get('mat'):   # Halsring liegt in der Referenz im Dunkeln (unter dem Tuch)
            o.data.materials.clear(); o.data.materials.append(bpy.data.materials[PRM['neckRing']['mat']])
        if o.data.materials: o.color = FARBEN.get(o.data.materials[0].name, (0.5, 0.5, 0.5, 1))
    tmp = bpy.data.collections.get(TMP)
    if tmp:
        for o in list(tmp.objects): bpy.data.objects.remove(o, do_unlink=True)
    if anbau:
        ohrmodule_neu(); rueckmodul_neu(); H['build']['schlauch'](); fugen_schrauben()
    return sorted(o.name for o in L['coll']('HELM_V3').objects if o.name.split('.')[0] in TEILE)
