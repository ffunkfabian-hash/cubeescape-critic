# Explosionsansicht mit festen Teilekennungen S01–S13 (Arbeitsweise wie cubeescape-critic HELM_TEILE.md).
# Aufruf in Blender (nach bauen_lauf6b):  über run.py geladen (Pfade aus SCOUT_DIR/SCOUT_REF/SCOUT_RUNS): helm_explosion.py → explosion(pfad, grad)
# Seiten: R = +X, L = −X – bestimmt aus der Lage, nicht aus den Objektnamen (Kiefer_L liegt z. B. bei +X). Teile werden nur für das Bild verschoben und danach zurückgesetzt.
import os, bpy, math
from mathutils import Vector

# ID, Name, Objekt-Präfixe, Versatz (x, y, z) – y negativ = nach vorn, z = oben; 'seitig' = je Seite eigenes Etikett, x gespiegelt
TEILE = [
    ('S01', 'Haube (Guss)',       ['Kappe'],                                   (0, 0, 0.30),     False),
    ('S02', 'Augen',              ['Auge_', 'Augenhoehle_'],                   (0, -0.10, 0.30), False),
    ('S03', 'Gelenkscheibe',      ['Maske_Gelenk_'],                           (0.10, 0, 0.30),  True),
    ('S04', 'Krempe',             ['Krempe'],                                  (0, 0, 0.16),     False),
    ('S05', 'Mundvertiefung',     ['Mund_Vertiefung'],                         (0, -0.32, 0.04), False),
    ('S06', 'Kinnblock',          ['Kinnblock'],                               (0, -0.34, -0.14),False),
    ('S07', 'Kieferstück',        ['Kiefer_'],                                 (0.28, -0.12, -0.14), True),
    ('S08', 'Seitenschale (Kern)',['Kern'],                                    (0, 0, 0),        False),
    ('S09', 'Kragen',             ['Kragen'],                                  (0, 0.05, -0.30), False),
    ('S10', 'Funkmuschel',        ['Ohrmodul_'],                               (0.34, 0, 0),     True),
    ('S11', 'Antenne',            ['Antenne_'],                                (0.34, 0, 0.10),  True),
    ('S12', 'Rückmodul',          ['Rueckmodul'],                              (0, 0.40, 0),     False),
    ('S13', 'Spiralkabel',        ['Kabel_', 'Schlauch_'],                     (0.20, 0.22, -0.05), True),
]

def _seite(n):
    s = n.rstrip('0123456789')
    return 'R' if s.endswith('_R') else ('L' if s.endswith('_L') else None)

def _gruppen():
    vis = [o for o in bpy.data.objects if o.visible_get() and o.users_collection and o.users_collection[0].name == 'HELM_V3'
           and o.type in ('MESH', 'CURVE') and o.name != 'Hals']
    out = []; Ri = bpy.data.objects['HELM_ROOT'].matrix_world.inverted()   # Seite im Helm-System, auch bei gedrehter Ansicht
    for tid, name, pre, off, seitig in TEILE:
        objs = [o for o in vis if o.name.startswith(tuple(pre))]
        if not objs: continue
        if seitig:
            for s, sx in (('R', 1), ('L', -1)):   # Seite aus der Lage (R = +X), nicht aus dem Namen – die Namen sind nicht einheitlich
                g = [o for o in objs if (sum((Ri @ o.matrix_world @ Vector(c)).x for c in o.bound_box) > 0) == (s == 'R')]
                if g: out.append((f'{tid} {name} {s}', g, Vector((off[0] * sx, off[1], off[2]))))
        else:
            out.append((f'{tid} {name}', objs, Vector(off)))
    return out

def _mitte(objs):
    pts = [o.matrix_world @ Vector(c) for o in objs for c in o.bound_box]
    return sum(pts, Vector()) / len(pts)

def explosion(pfad, grad=-40, samples=24, faktor=1.0, linse=0.55):
    """Teile versetzen, Kamera weiter (Brennweite × linse), Etiketten auf einer Ebene vor der Kamera am Bildrand mit Linien."""
    from bpy_extras.object_utils import world_to_camera_view
    H = bpy.app.driver_namespace['H']; B = H['build']
    sc = bpy.context.scene; sc.frame_set(1); root = bpy.data.objects['HELM_ROOT']; cam = bpy.data.objects['cam_praesentation']
    ad = root.animation_data.action if root.animation_data else None
    if ad: root.animation_data.action = None
    root.rotation_euler[2] = 0; bpy.context.view_layer.update()
    hals = bpy.data.objects.get('Hals'); hals_r = hals.hide_render if hals else None
    if hals: hals.hide_render = True
    lens0 = cam.data.lens; cam.data.lens = lens0 * linse
    sc.render.resolution_x = sc.render.resolution_y = 1080
    mat = bpy.data.materials.get('MAT_Etikett') or bpy.data.materials.new('MAT_Etikett')
    mat.use_nodes = True; bs = mat.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value = (0.0, 0.0, 0.0, 1); bs.inputs['Emission Color'].default_value = (0.55, 0.02, 0.02, 1)
    bs.inputs['Emission Strength'].default_value = 1.0
    alt, gruppen = {}, []
    for label, objs, off in _gruppen():
        off = off * faktor
        for o in objs:
            if o.name not in alt: alt[o.name] = o.matrix_world.copy(); o.matrix_world.translation += off
        gruppen.append((label, objs))
    root.rotation_euler[2] = math.radians(grad); bpy.context.view_layer.update()
    # Ebene vor der Kamera
    Mc = cam.matrix_world; fwd = -(Mc.to_3x3() @ Vector((0, 0, 1))).normalized()
    dist_helm = (Mc.translation - root.matrix_world.translation).length; tiefe = dist_helm * 0.45
    fr = [Vector(v) for v in cam.data.view_frame(scene=sc)]           # tr, br, bl, tl (lokal, z < 0)
    def uv_welt(u, v):
        p = fr[3].lerp(fr[0], u); q = fr[2].lerp(fr[1], u); lp = q.lerp(p, v); lp = lp * (tiefe / -lp.z)
        return Mc @ lp
    eintraege = []
    for label, objs in gruppen:
        pts = [o.matrix_world @ Vector(c) for o in objs for c in o.bound_box]; c = sum(pts, Vector()) / len(pts)
        uv = world_to_camera_view(sc, cam, c); eintraege.append((label, c, uv))
    # links/rechts sortiert verteilen
    neu = []
    for seite in (0, 1):
        g = sorted([e for e in eintraege if (e[2].x >= 0.5) == bool(seite)], key=lambda e: -e[2].y)
        for k, (label, c, uv) in enumerate(g):
            v = 0.92 - k * (0.84 / max(len(g) - 1, 1)) if len(g) > 1 else uv.y
            neu.append((label, c, uv, (0.79 if seite else 0.21), v, seite))
    objekte = []
    groesse = 0.030 * tiefe / dist_helm * 1.45
    for label, c, uv, u2, v2, seite in neu:
        cu = bpy.data.curves.new('Etikett', 'FONT'); cu.body = label; cu.size = groesse
        cu.align_x = 'LEFT' if seite else 'RIGHT'; cu.align_y = 'CENTER'; cu.materials.append(mat)
        t = bpy.data.objects.new('Etikett', cu); sc.collection.objects.link(t)
        t.matrix_world = Mc.to_3x3().to_4x4(); t.location = uv_welt(u2 + (0.01 if seite else -0.01), v2)
        z = uv_welt(uv.x, uv.y); a = uv_welt(u2 - (0.005 if seite else -0.005), v2)
        lc = bpy.data.curves.new('Linie', 'CURVE'); lc.dimensions = '3D'; lc.bevel_depth = groesse * 0.04
        sp = lc.splines.new('POLY'); sp.points.add(1); sp.points[0].co = (*a, 1); sp.points[1].co = (*z, 1); lc.materials.append(mat)
        l = bpy.data.objects.new('Linie', lc); sc.collection.objects.link(l)
        objekte += [t, l]
    import time
    alt_r = (sc.render.engine, sc.camera, sc.render.filepath, cam.data.dof.use_dof)
    sc.render.engine = 'CYCLES'; sc.cycles.samples = samples; sc.cycles.use_denoising = True; sc.camera = cam
    cam.data.dof.use_dof = False                                   # Etiketten liegen nah an der Kamera – keine Tiefenunschärfe
    for o in bpy.data.objects:
        if o.users_collection and o.users_collection[0].name in ('REFERENZ', 'CUTTER'): o.hide_render = True
    sc.render.filepath = pfad; t0 = time.time(); bpy.ops.render.render(write_still=True); r = {'sekunden': round(time.time() - t0, 1)}
    sc.render.engine, sc.camera, sc.render.filepath, cam.data.dof.use_dof = alt_r
    # zurücksetzen
    for o in objekte:
        d = o.data; bpy.data.objects.remove(o, do_unlink=True)
        (bpy.data.curves.remove(d) if d.users == 0 else None)
    cam.data.lens = lens0
    root.rotation_euler[2] = 0; bpy.context.view_layer.update()
    for n, m in alt.items(): bpy.data.objects[n].matrix_world = m
    if hals: hals.hide_render = hals_r
    if ad: root.animation_data.action = ad
    sc.frame_set(1)
    return {'datei': pfad, 'sekunden': r['sekunden'], 'teile': [e[0] for e in neu]}


# ---------------------------------------------------------------- Teilekarte: Normalansichten mit Kennungen und Höhenlinien
def teilekarte(pfad, grad=0, samples=24, titel='', hoehe_cm=30.0, schritt_cm=3.0, linse=0.75):
    """Teile an Ort und Stelle beschriften (Etikett am Rand, Linie zu einem sichtbaren Punkt des Teils) und Höhenlinien
    in cm (Z 0 = Unterkante, Helm = hoehe_cm) einzeichnen. Alles liegt auf einer Ebene vor der Kamera – nichts wird verdeckt."""
    import time
    from bpy_extras.object_utils import world_to_camera_view
    sc = bpy.context.scene; sc.frame_set(1); root = bpy.data.objects['HELM_ROOT']; cam = bpy.data.objects['cam_praesentation']
    ad = root.animation_data.action if root.animation_data else None
    if ad: root.animation_data.action = None
    lens0 = cam.data.lens; cam.data.lens = lens0 * linse
    sc.render.resolution_x = sc.render.resolution_y = 1080
    root.rotation_euler[2] = math.radians(grad); bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    def mat(name, farbe, staerke):
        m = bpy.data.materials.get(name) or bpy.data.materials.new(name); m.use_nodes = True
        b = m.node_tree.nodes.get('Principled BSDF'); b.inputs['Base Color'].default_value = (0, 0, 0, 1)
        b.inputs['Emission Color'].default_value = farbe; b.inputs['Emission Strength'].default_value = staerke; return m
    m_et = mat('MAT_Etikett', (0.55, 0.02, 0.02, 1), 1.0); m_hl = mat('MAT_Hoehenlinie', (0.05, 0.25, 0.6, 1), 0.8)
    Mc = cam.matrix_world; dist_helm = (Mc.translation - root.matrix_world.translation).length; tiefe = dist_helm * 0.45
    fr = [Vector(v) for v in cam.data.view_frame(scene=sc)]
    def uv_welt(u, v):
        p = fr[3].lerp(fr[0], u); q = fr[2].lerp(fr[1], u); lp = q.lerp(p, v); lp = lp * (tiefe / -lp.z)
        return Mc @ lp
    groesse = 0.030 * tiefe / dist_helm * 1.35
    objekte = []
    def text(body, pos, links):
        cu = bpy.data.curves.new('Etikett', 'FONT'); cu.body = body; cu.size = groesse
        cu.align_x = 'LEFT' if links else 'RIGHT'; cu.align_y = 'CENTER'; cu.materials.append(m_et if body[0] == 'S' else m_hl)
        t = bpy.data.objects.new('Etikett', cu); sc.collection.objects.link(t); t.matrix_world = Mc.to_3x3().to_4x4(); t.location = pos
        objekte.append(t)
    def linie(a, b, m, dicke):
        lc = bpy.data.curves.new('Linie', 'CURVE'); lc.dimensions = '3D'; lc.bevel_depth = dicke
        sp = lc.splines.new('POLY'); sp.points.add(1); sp.points[0].co = (*a, 1); sp.points[1].co = (*b, 1); lc.materials.append(m)
        l = bpy.data.objects.new('Linie', lc); sc.collection.objects.link(l); objekte.append(l)
    # Höhenlinien (in der Helmmitte gemessen)
    kalib = {'v0': round(world_to_camera_view(sc, cam, root.matrix_world @ Vector((0, 0, 0))).y, 5),
             'v1': round(world_to_camera_view(sc, cam, root.matrix_world @ Vector((0, 0, 1))).y, 5)}
    for k in range(int(hoehe_cm / schritt_cm) + 1):
        z = k * schritt_cm / hoehe_cm
        uv = world_to_camera_view(sc, cam, root.matrix_world @ Vector((0, 0, z)))
        if not 0.02 < uv.y < 0.98: continue
        linie(uv_welt(0.075, uv.y), uv_welt(0.98, uv.y), m_hl, groesse * 0.025)
        text(f'{k * schritt_cm:.0f} cm', uv_welt(0.07, uv.y), False)
    # Teile: sichtbaren Ankerpunkt suchen (Strahl von der Kamera trifft das Teil zuerst)
    eintraege = []
    for label, objs, _ in _gruppen():
        pts = []
        for o in objs:
            if o.type != 'MESH': 
                pts += [o.matrix_world @ Vector(c) for c in o.bound_box]; continue
            vs = o.data.vertices; schritt = max(1, len(vs) // 250)
            pts += [o.matrix_world @ vs[i].co for i in range(0, len(vs), schritt)]
        mitte = sum(pts, Vector()) / len(pts); uvm = world_to_camera_view(sc, cam, mitte)
        best = None
        for p in sorted(pts, key=lambda p: (world_to_camera_view(sc, cam, p).xy - uvm.xy).length):
            d = (p - Mc.translation); hit, loc, n, i, o, m = sc.ray_cast(dg, Mc.translation, d.normalized(), distance=d.length + 0.01)
            if hit and o in objs:
                best = loc; break
        if best is None: continue                                   # in dieser Ansicht nicht sichtbar
        uv = world_to_camera_view(sc, cam, best)
        if not (0 < uv.x < 1 and 0 < uv.y < 1): continue
        eintraege.append((label, uv))
    for seite in (0, 1):
        g = sorted([e for e in eintraege if (e[1].x >= 0.5) == bool(seite)], key=lambda e: -e[1].y)
        for k, (label, uv) in enumerate(g):
            v = 0.90 - k * (0.80 / max(len(g) - 1, 1)) if len(g) > 1 else uv.y
            u2 = 0.80 if seite else 0.20
            text(label, uv_welt(u2 + (0.01 if seite else -0.01), v), bool(seite))
            linie(uv_welt(u2 - (0.005 if seite else -0.005), v), uv_welt(uv.x, uv.y), m_et, groesse * 0.04)
    if titel: text(titel, uv_welt(0.5, 0.965), True)
    alt_r = (sc.render.engine, sc.camera, sc.render.filepath, cam.data.dof.use_dof)
    sc.render.engine = 'CYCLES'; sc.cycles.samples = samples; sc.cycles.use_denoising = True; sc.camera = cam; cam.data.dof.use_dof = False
    for o in bpy.data.objects:
        if o.users_collection and o.users_collection[0].name in ('REFERENZ', 'CUTTER'): o.hide_render = True
    sc.render.filepath = pfad; t0 = time.time(); bpy.ops.render.render(write_still=True); sek = round(time.time() - t0, 1)
    sc.render.engine, sc.camera, sc.render.filepath, cam.data.dof.use_dof = alt_r
    for o in objekte:
        d = o.data; bpy.data.objects.remove(o, do_unlink=True)
        if d.users == 0: bpy.data.curves.remove(d)
    cam.data.lens = lens0; root.rotation_euler[2] = 0
    if ad: root.animation_data.action = ad
    sc.frame_set(1)
    return {'datei': pfad, 'sekunden': sek, 'teile': [e[0] for e in eintraege], 'kalib': kalib}

def teilekarte_bogen(pfad=None):
    """Vier Ansichten (vorn, Seite R, Dreiviertel, hinten) beschriften und zu einem 2×2-Bogen zusammensetzen."""
    import numpy as np, os
    pfad = pfad or os.path.join(os.environ['SCOUT_RUNS'], 'helm_teilekarte.png')
    teile = {}; bilder = []
    for name, grad, titel in (('vorn', 0, 'VORN'), ('seite', -90, 'SEITE (R)'), ('dreiviertel', -40, 'DREIVIERTEL'), ('hinten', 180, 'HINTEN')):
        f = pfad.replace('.png', f'_{name}.png'); r = teilekarte(f, grad, titel=titel); teile[name] = {'teile': r['teile'], 'kalib': r['kalib']}; bilder.append(f)
    arr = []
    for f in bilder:
        im = bpy.data.images.load(f, check_existing=False); w, h = im.size
        a = np.empty(w * h * 4, np.float32); im.pixels.foreach_get(a); bpy.data.images.remove(im); arr.append(a.reshape(h, w, 4))
    h, w = arr[0].shape[:2]; rand = 8
    bog = np.ones((2 * h + rand, 2 * w + rand, 4), np.float32)
    # Blender-Pixel liegen unten-links zuerst: obere Bildreihe = höhere Zeilen
    bog[h + rand:, :w] = arr[0]; bog[h + rand:, w + rand:] = arr[1]; bog[:h, :w] = arr[2]; bog[:h, w + rand:] = arr[3]
    im = bpy.data.images.new('teilekarte', bog.shape[1], bog.shape[0], alpha=True); im.pixels.foreach_set(bog.ravel())
    im.filepath_raw = pfad; im.file_format = 'PNG'; im.save(); bpy.data.images.remove(im)
    return {'bogen': pfad, 'teile': teile}

def id_raster(N=160, linse=0.75):
    """Je Ansicht ein N×N-Raster der Teilekennungen (Zeichen 0-9a-z = Index in labels, 0 = nichts) für den Markierbogen."""
    sc = bpy.context.scene; root = bpy.data.objects['HELM_ROOT']; cam = bpy.data.objects['cam_praesentation']
    ad = root.animation_data.action if root.animation_data else None
    if ad: root.animation_data.action = None
    sc.frame_set(1); root.rotation_euler[2] = 0; bpy.context.view_layer.update()
    gr = _gruppen(); labels = [g[0] for g in gr]; obj2i = {}
    for i, (lab, objs, off) in enumerate(gr):
        for o in objs: obj2i[o.name] = i + 1
    lens0 = cam.data.lens; cam.data.lens = lens0 * linse; sc.render.resolution_x = sc.render.resolution_y = 1080
    zeichen = '0123456789abcdefghijklmnopqrstuvwxyz'; ansichten = {}
    for name, grad in (('vorn', 0), ('seite', -90), ('dreiviertel', -40), ('hinten', 180)):
        root.rotation_euler[2] = math.radians(grad); bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get()
        Mc = cam.matrix_world; fr = [Vector(v) for v in cam.data.view_frame(scene=sc)]; zeilen = []
        for j in range(N):
            v = 1 - (j + 0.5) / N; z = []
            for i in range(N):
                u = (i + 0.5) / N; p = fr[3].lerp(fr[0], u); q = fr[2].lerp(fr[1], u)
                d = (Mc.to_3x3() @ q.lerp(p, v)).normalized()
                hit, loc, n, idx, o, m = sc.ray_cast(dg, Mc.translation, d)
                z.append(zeichen[obj2i.get(o.name, 0)] if hit else '0')
            zeilen.append(''.join(z))
        ansichten[name] = zeilen
    cam.data.lens = lens0; root.rotation_euler[2] = 0
    if ad: root.animation_data.action = ad
    sc.frame_set(1)
    return {'labels': labels, 'N': N, 'views': ansichten}

def markierbogen_daten(scr):
    """Teilekarte (Bilder + Kalibrierung) und Raster erzeugen, JPEG-Fassungen für den Markierbogen in scr ablegen."""
    import json
    r = teilekarte_bogen(); g = id_raster()
    for n in ('vorn', 'seite', 'dreiviertel', 'hinten'):
        im = bpy.data.images.load(os.path.join(os.environ['SCOUT_RUNS'], f'helm_teilekarte_{n}.png'), check_existing=False)
        im.scale(760, 760); im.file_format = 'JPEG'; im.filepath_raw = scr + f'karte_{n}.jpg'; im.save(quality=82); bpy.data.images.remove(im)
    json.dump({'ok': True, 'r': r}, open(scr + 'bl/karte.json', 'w')); json.dump(dict(ok=True, **g), open(scr + 'bl/idgrid.json', 'w'))
    return True
