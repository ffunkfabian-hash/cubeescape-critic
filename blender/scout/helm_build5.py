# Lauf 2c: „Sei die Vorlage“ – Hauptflächen per Shrinkwrap auf die geglättete Meshy-Form, Details danach neu.
import bpy, math
from mathutils import Vector, Matrix
H = bpy.app.driver_namespace['H']; L = H['lib']; B = H['build']

def wrap(name, limit, offset=0.0, group=None, index=0):
    o = bpy.data.objects[name]
    m = o.modifiers.get('Vorlage') or o.modifiers.new('Vorlage', 'SHRINKWRAP')
    m.target = bpy.data.objects['Vorlage_Form']; m.wrap_method = 'PROJECT'
    m.use_project_x = m.use_project_y = m.use_project_z = False
    m.use_negative_direction = True; m.use_positive_direction = True; m.cull_face = 'OFF'
    m.project_limit = limit; m.offset = offset; m.wrap_mode = 'ON_SURFACE'
    if group: m.vertex_group = group
    names = [x.name for x in o.modifiers]
    with bpy.context.temp_override(object=o, active_object=o):
        bpy.ops.object.modifier_move_to_index(modifier='Vorlage', index=index)
    return m

def gruppe(name, fn):
    o = bpy.data.objects[name]; vg = o.vertex_groups.get('Vorlage') or o.vertex_groups.new(name='Vorlage')
    mw = o.matrix_world
    for v in o.data.vertices:
        vg.add([v.index], fn(mw @ v.co, v.index), 'REPLACE')
    return 'Vorlage'

def anpassen():
    # Haube und Schild: ganze Fläche
    wrap('Kappe', 0.06)
    wrap('Maske_Schild', 0.05)
    # Krempe: nur Außenflächen (Ringe 1 und 2 von 4 je Station)
    wrap('Krempe', 0.06, group=gruppe('Krempe', lambda p, i: 1.0 if i % 4 in (1, 2) else 0.0))
    # Schale: ohne Rückbox-Bereich und ohne Pod-Zone (dort sitzen Anbauteile in der Vorlage)
    def w_schale(p, i):
        if p.y > 0.40 and 0.48 < p.z < 0.80 and abs(p.x) < 0.20: return 0.0
        if abs(p.x) > 0.30 and abs(p.y - B['P']['pod_y']) < 0.13 and 0.40 < p.z < 0.70: return 0.0
        return 1.0
    wrap('Schale', 0.035, group=gruppe('Schale', w_schale))
    # Kinnleiste: Außenseite (Profilpunkte 1–4 je Station von 6)
    wrap('Kinnleiste', 0.12, group=gruppe('Kinnleiste', lambda p, i: 1.0 if i % 6 in (1, 2, 3, 4) else 0.0))
    # Augen und Nase direkt an die Vorlage statt an die Trägerhülle
    for n, off in (('Auge_R', -0.008), ('Auge_L', -0.008), ('Maske_Nase', 0.012)):
        o = bpy.data.objects[n]
        for m in o.modifiers:
            if m.type == 'SHRINKWRAP': m.target = bpy.data.objects['Vorlage_Form']; m.offset = off
            if m.type == 'DISPLACE': m.show_viewport = m.show_render = False

def details_neu():
    sc = bpy.context.scene; sc.frame_set(1)
    for obj, mods in (('Maske_Schild', ('Fugen', 'Wangendetails')), ('Maske_Nase', ('Nasendetails',)), ('Schale', ('Nuten_Mitte', 'Nuten_Seite')),
                      ('Kinnleiste', ('Kinnaussparung',))):
        o = bpy.data.objects[obj]
        for m in mods:
            if m in o.modifiers: o.modifiers.remove(o.modifiers[m])
    B['remove']('Cut_Schild_Fugen', 'Cut_Wange', 'Cut_Nase', 'Cut_Schale_Mitte', 'Cut_Schale_Seite', 'Cut_Kinn', 'Cut_Kinn_Schlitze', 'Kinn_Panel',
                'Lug_R', 'Lug_L', 'Kopfgurt', 'Gurt_Schnalle', 'Gurt_Halter_R', 'Gurt_Halter_L', 'Pod_Sockel_R', 'Pod_Sockel_L', 'Pod_Sockel_Deckel_L',
                'Maske_Gelenk_R', 'Maske_Gelenk_L', 'Maske_Halter_R', 'Maske_Halter_L', 'Schraube_Basis')
    for o in [o for o in bpy.data.objects if o.name.startswith('Schraube_')]: bpy.data.objects.remove(o, do_unlink=True)
    bpy.context.evaluated_depsgraph_get().update()
    B['schild_fugen'](); B['maske_vertiefungen'](); B['schale_nuten'](); B['kinn_panel']()
    B['laschen_sockel'](); B['kopfgurt'](); B['gelenk_halter']()
    # Seitenteile der Schale um die lokale Verschiebung der Schalenfläche nachführen
    moved = {}
    for o in list(bpy.data.objects):
        if not o.name.startswith(('Schale_Griffpanel', 'Schale_Wartungsklappe', 'Schale_Kragenblende', 'Rueckbox_Trapezpanel', 'Pod_Buegel_Fuss')): continue
        vs = [o.matrix_world @ v.co for v in o.data.vertices]; c = sum(vs, Vector()) / len(vs)
        n = Vector((c.x, c.y, 0)).normalized()
        h = B['raycast'](['Schale'], c + n * 0.3, -n)
        if h:
            d = (h[0] - c).dot(n) + 0.003
            o.location += n * d; moved[o.name] = round(d, 3)
    return {'schrauben': B['schrauben'](), 'verschoben': moved}

B['wrap'] = wrap; B['gruppe'] = gruppe; B['anpassen'] = anpassen; B['details_neu'] = details_neu

def vorlage_glatt(iters=40):
    src = bpy.data.objects['Vorlage_Form']
    old = bpy.data.objects.get('Vorlage_Glatt')
    if old: bpy.data.objects.remove(old, do_unlink=True)
    o = bpy.data.objects.new('Vorlage_Glatt', src.data.copy()); L['coll']('REFERENZ').objects.link(o)
    s = o.modifiers.new('Glatt', 'LAPLACIANSMOOTH'); s.iterations = iters; s.lambda_factor = 0.8; s.use_volume_preserve = True
    with bpy.context.temp_override(object=o, active_object=o):
        bpy.ops.object.modifier_apply(modifier='Glatt')
    o.display_type = 'WIRE'; o.hide_render = True; o.hide_select = True; o.hide_set(True)
    return o

def ss(v): v = max(0.0, min(1.0, v)); return v * v * (3 - 2 * v)

def anpassen2():
    tgt = vorlage_glatt()
    for n in ('Schale', 'Kinnleiste'):
        o = bpy.data.objects[n]
        if 'Vorlage' in o.modifiers: o.modifiers.remove(o.modifiers['Vorlage'])
    def nachglaetten(name, idx):
        o = bpy.data.objects[name]
        m = o.modifiers.get('Nachglaetten') or o.modifiers.new('Nachglaetten', 'SMOOTH'); m.factor = 0.6; m.iterations = 8
        with bpy.context.temp_override(object=o, active_object=o):
            bpy.ops.object.modifier_move_to_index(modifier='Nachglaetten', index=idx)
    # Haube: vorn nur oberhalb der Schild-Oberkante
    g = B['gruppe']('Kappe', lambda p, i: 1.0 if p.y > -0.05 else ss((p.z - 0.775) / 0.03))
    m = B['wrap']('Kappe', 0.05, group=g); m.target = tgt; nachglaetten('Kappe', 1)
    # Schild: Augenfenster aussparen
    def w_schild(p, i):
        ax, az = abs(p.x), p.z
        if 0.08 < ax < 0.29 and 0.51 < az < 0.63: return 0.0
        return 1.0
    g = B['gruppe']('Maske_Schild', w_schild)
    m = B['wrap']('Maske_Schild', 0.04, group=g); m.target = tgt; nachglaetten('Maske_Schild', 1)
    m = bpy.data.objects['Krempe'].modifiers['Vorlage']; m.target = tgt
    for n in ('Auge_R', 'Auge_L', 'Maske_Nase'):
        for mm in bpy.data.objects[n].modifiers:
            if mm.type == 'SHRINKWRAP': mm.target = tgt
    # Hilfsobjekte am Root (Turntable-Lehre)
    root = bpy.data.objects['HELM_ROOT']
    for n in ('Vorlage_Form', 'Vorlage_Glatt'):
        o = bpy.data.objects[n]
        if o.parent is None:
            mw = o.matrix_world.copy(); o.parent = root; o.matrix_parent_inverse = root.matrix_world.inverted(); o.matrix_world = mw

B['vorlage_glatt'] = vorlage_glatt; B['anpassen2'] = anpassen2

def wraps_aus():
    for n in ('Kappe', 'Maske_Schild', 'Krempe', 'Schale', 'Kinnleiste'):
        o = bpy.data.objects[n]
        for mn in ('Vorlage', 'Nachglaetten'):
            if mn in o.modifiers: o.modifiers.remove(o.modifiers[mn])
    hf = bpy.data.objects['Maske_Traegerhuelle']
    for n, off in (('Auge_R', 0.012), ('Auge_L', 0.012), ('Maske_Nase', 0.032)):
        for m in bpy.data.objects[n].modifiers:
            if m.type == 'SHRINKWRAP': m.target = hf; m.offset = off
            if m.type == 'DISPLACE': m.show_viewport = m.show_render = True

def kuppel_punkte(c, N=48, R=16):
    pts = []
    for j in range(R):
        t = (j / R) ** 0.85; z = c['zc'] + c['c'] * t
        ax = c['a'] * (1 - t ** c['ex']) ** (1 / c['ex'])
        byf = c['bf'] * (1 - t ** c['eyf']) ** (1 / c['eyf']); byb = c['bb'] * (1 - t ** c['eyb']) ** (1 / c['eyb'])
        for x, y, zz in L['ring'](z, ax, byf, byb, 2.6, 2.2, N=N, yc=c['yc']):
            if y < 0.15: y = B['smax'](y, B['F'](x, z) - 0.002, 0.07)
            if zz >= 0.78: pts.append(Vector((x, y, zz)))
    return pts

def kuppel_fit(rounds=3):
    from mathutils.bvhtree import BVHTree
    dg = bpy.context.evaluated_depsgraph_get(); tree = BVHTree.FromObject(bpy.data.objects['Vorlage_Form'], dg, deform=False)
    mw = bpy.data.objects['Vorlage_Form'].matrix_world; inv = mw.inverted()
    def cost(c):
        ds = sorted(tree.find_nearest(inv @ p)[3] for p in kuppel_punkte(c)); return ds[len(ds) // 2] + 0.5 * ds[int(len(ds) * 0.8)]
    c = dict(B['P']['cap']); best = cost(c); start = best
    steps = {'c': 0.02, 'zc': 0.02, 'a': 0.02, 'bf': 0.03, 'bb': 0.03, 'yc': 0.02, 'ex': 0.3, 'eyf': 0.3, 'eyb': 0.3}
    for r in range(rounds):
        for k, s in steps.items():
            for sgn in (1, -1):
                while True:
                    c2 = dict(c); c2[k] = c[k] + sgn * s
                    if abs(c2['zc'] + c2['c'] - 1.0) > 0.02: break
                    v = cost(c2)
                    if v < best - 1e-5: c, best = c2, v
                    else: break
        steps = {k: s / 2 for k, s in steps.items()}
    return c, round(start, 4), round(best, 4)

B['wraps_aus'] = wraps_aus; B['kuppel_fit'] = kuppel_fit
