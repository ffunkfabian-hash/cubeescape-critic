# Helm „Scout v3“ – reproduzierbarer Aufbau aus leerer Blender-Datei (Stand Lauf 3b).
# Aufruf in Blender (Textblock oder MCP):  über run.py geladen (Pfade aus SCOUT_DIR/SCOUT_REF/SCOUT_RUNS): helm_bauen.py → bauen()
# Stil und Regeln: STIL_SCOUT_V3.md
import os, bpy, math, time
from mathutils import Vector
D = os.path.join(os.environ['SCOUT_DIR'], '')  # set by run.py (blender/scout)

def lade():
    H = bpy.app.driver_namespace.setdefault('H', {}); H['calls'] = H.get('calls', 0); H.pop('P', None)
    ns = {}; exec(open(D + 'helm_lib.py').read(), ns); H['lib'] = ns
    for f in ('helm_build.py', 'helm_build2.py', 'helm_build3.py', 'helm_build4.py', 'helm_build5.py', 'helm_build6.py',
              'helm_build7.py', 'helm_build8.py'):
        exec(open(D + f).read(), {})
    B = H['build']
    B['SCR'] = bpy.app.tempdir; B['D'] = D; B['PXH'] = 535.0; B['RID'] = math.tan(math.radians(6)) * 0.38
    B['REFS'] = {'front': ('cam_front', 'helm_000.png', 0), 'right': ('cam_right', 'helm_090.png', 90),
                 'back': ('cam_back', 'helm_180.png', 180), 'left': ('cam_left', 'helm_270.png', -90)}
    B['P']['cap'].update(c=0.36, zc=0.64, a=0.39, bf=0.59, bb=0.485, yc=0.10, ex=2.4, eyf=2.3, eyb=2.6)   # Kritik R1/R2: vorn gewölbt, hinten flach abfallend
    B['P'].update(kinn_w=0.16, box_dy=-0.015, kinn_band=True, auslauf=0.08,
                  kinn_taper=0.35,
                  eye=(0.105, 0.235, 0.505, 0.518, 0.575, 0.550))   # Kritik R2: kleiner, flacher geneigt
    return H, ns, B

def bauen(speichern=None):
    t0 = time.time()
    H, L, B = lade()
    schritte = [
        ('Szene', lambda: (B['setup_scene'](), B['cameras_and_refs'](), B['vorlage_v2']())),
        ('Weiße Unterschale (konisch, ohne Kragen)', lambda: (B['schale_querschnitte'](), B['schale_loft'](), B['schale_kurz'](), B['schale_mods']())),
        ('Trägerhülle', lambda: B['maske_huelle']()),
        ('Haube+Gesicht (ein Guss)', lambda: B['guss']()),
        ('Krempe', lambda: B['krempe_flach']()),
        ('Mittelstück (schmal, gestuft)', lambda: B['nase']()),
        ('Kinnrand (flaches V, Basis)', lambda: B['kinnrand']()),
        ('Rückmodul', lambda: (B['rueckbox'](), B['rueckbox_platte'](), B['rueckbox_versetzen'](B['P']['box_dy']), B['rueckmodul']())),
        ('Hals', lambda: B['hals']()),
        ('Hilfsteile (werden ausgebaut)', lambda: (B['buegel'](), B['laschen_sockel'](), B['kopfgurt']())),
        ('Vertiefungen', lambda: (B['schale_nuten'](), B['augenhoehlen'](), B['fugen']())),
        ('Seitenteile', lambda: B['seitenteile']()),
        ('Schläfenpanzer', lambda: B['schlaefenpanzer']()),
        ('Ohrmodule+Antennen', lambda: B['ohrmodule']()),
        ('Spiralschlauch', lambda: B['schlauch']()),
        ('Schrauben', lambda: (B['schrauben'](), B['kinnschrauben_weg']())),
        ('Mikrodetails', lambda: (B['krempe_naht'](), B['kennungen']())),
        ('Ausbau', lambda: B['ausbauen']()),
        ('Material', lambda: (B['materialien'](), B['material_matt'](), B['schmutz'](), B['abrieb']())),
        ('Abrieb nur an Anbauteilen', lambda: [o.modifiers.remove(o.modifiers['Kantenabrieb']) for o in bpy.data.objects
                                               if o.name in ('Kappe', 'Maske_Nase', 'Maske_Nase_Stufe', 'Schale', 'Kinnleiste') and 'Kantenabrieb' in o.modifiers]),
        ('Studio+Licht', lambda: (B['studio'](), B['licht']())),
        ('Turntable', lambda: B['turntable_keys']()),
    ]
    log = []
    for name, fn in schritte:
        t = time.time(); fn(); log.append((name, round(time.time() - t, 2)))
    bpy.context.scene.frame_set(1)
    if speichern: bpy.ops.wm.save_as_mainfile(filepath=speichern)
    return {'schritte': log, 'sekunden': round(time.time() - t0, 1)}

def ansichten(prefix, samples=48):
    """Vier Vergleichsansichten wie die Referenz: vorn, rechts (90°), dreiviertel, hinten."""
    H = bpy.app.driver_namespace['H']; B = H['build']
    sc = bpy.context.scene; sc.frame_set(1); root = bpy.data.objects['HELM_ROOT']
    ad = root.animation_data.action if root.animation_data else None
    if ad: root.animation_data.action = None
    out = {}
    for deg, nm in ((0, 'front'), (-90, 'seite'), (-40, 'dreiviertel'), (180, 'hinten')):
        root.rotation_euler[2] = math.radians(deg)
        out[nm] = B['cycles_standbild'](f'{prefix}_{nm}.png', samples=samples)['sekunden']
    root.rotation_euler[2] = 0
    if ad: root.animation_data.action = ad
    sc.frame_set(1)
    return out

ALT_L3 = ('Kappe', 'Krempe', 'Maske_Nase', 'Maske_Nase_Stufe', 'Schale', 'Kinnleiste', 'Kinn_Panel', 'Kinn_Einsatz', 'Auge_', 'Augenhoehle_',
          'Schlaefe', 'Kennung', 'Schale_', 'Schraube_', 'Kopfvolumen', 'Ohrmodul')

def bauen_lauf4(speichern=None):
    """Lauf 4: Grundaufbau (Szene, Material, Licht, Rückmodul, Antennen) aus bauen(), Grundteile dann nach critic (helm_csg.py)."""
    r = bauen()
    H = bpy.app.driver_namespace['H']; L = H['lib']
    for o in list(L['coll']('HELM_V3').objects):
        if o.name.startswith(ALT_L3): bpy.data.objects.remove(o, do_unlink=True)
    ns = {}; exec(open(D + 'helm_csg.py').read(), ns); H['csg'] = ns
    r['teile'] = ns['aufbau']()
    bpy.context.scene.frame_set(1)
    if speichern: bpy.ops.wm.save_as_mainfile(filepath=speichern)
    return r


# ---------------------------------------------------------------- Lauf 6: dunkler Guss, Augen, Mund wie Lauf 2h
AUSBAU_2H = ('Pod_', 'Kabel_', 'Rueckbox_Anschluss_', 'Antenne_R', 'Cut_Pod_Dreieck_', 'Kopfgurt', 'Gurt_', 'Lug_', 'Maske_Halter_')

def lade_2h():
    """Wie lade(), aber mit den Parametern von Lauf 2h (helm_live_test_2h.blend, Textblock helm_bauen.py) und der 2h-Nase."""
    H, L, B = lade()
    B['P']['cap'].update(c=0.36, zc=0.64, a=0.39, bf=0.59, bb=0.485, yc=0.10, ex=2.0, eyf=2.3, eyb=1.7)
    for k in ('kinn_taper', 'eye'): B['P'].pop(k, None)               # 2h: keine Gesichtsverjüngung, Augen-Standardwert
    B['P'].update(kinn_w=0.16, box_dy=-0.015, kinn_band=True, kinn_z=0.08, kinn_h=0.07, nase_zb=0.15, auslauf=0.08)
    # helm_build8 überschreibt nase() (Lauf 3, schmal gestuft) – die 2h-Nase aus helm_build2 getrennt holen
    orig = H['build']; kopie = dict(orig); H['build'] = kopie
    try: exec(open(D + 'helm_build2.py').read(), {})
    finally: H['build'] = orig
    B['nase_2h'] = kopie['nase']
    B['ausbauen'].__globals__['AUSBAU'] = AUSBAU_2H                   # 2h: Gelenkscheiben bleiben
    return H, L, B

def bauen_lauf6(speichern=None):
    """Lauf 6: Schritte von Lauf 2h (Guss, Augen, Nase, Fugen, Gelenkscheiben, Kinnleiste mit Gitter) + Anbau aus Lauf 5
    (Ohrmodule auf der Schale, Rückmodul nach critic backBox, Spiralschlauch, Antennen)."""
    t0 = time.time()
    H, L, B = lade_2h()
    schritte = [
        ('Szene', lambda: (B['setup_scene'](), B['cameras_and_refs'](), B['vorlage_v2']())),
        ('Schale', lambda: (B['schale_querschnitte'](), B['schale_loft'](), B['schale_mods']())),
        ('Trägerhülle', lambda: B['maske_huelle']()),
        ('Haube+Gesicht (ein Guss)', lambda: B['guss']()),
        ('Krempe', lambda: B['krempe_flach']()),
        ('Nase (2h)', lambda: B['nase_2h']()),
        ('Kinnrand (massiv, flaches V, trägt den Schirm)', lambda: B['kinnrand']()),
        ('Rückbox (Platzhalter)', lambda: (B['rueckbox'](), B['rueckbox_platte'](), B['rueckbox_versetzen'](B['P']['box_dy']))),
        ('Hals', lambda: B['hals']()),
        ('Hilfsteile (werden ausgebaut)', lambda: (B['buegel'](), B['laschen_sockel'](), B['kopfgurt']())),
        ('Vertiefungen', lambda: (B['schale_nuten'](), B['augenhoehlen'](), B['schild_fugen'](), B['maske_vertiefungen']())),
        ('Seitenteile', lambda: B['seitenteile']()),
        ('Gelenke', lambda: B['gelenk_halter']()),
        ('Schrauben', lambda: B['schrauben']()),
        ('Mikrodetails', lambda: (B['krempe_naht'](), B['kennungen']())),
        ('Ausbau', lambda: B['ausbauen']()),
        ('Material', lambda: (B['materialien'](), B['abrieb']())),
        ('Abrieb nur an Anbauteilen', lambda: [o.modifiers.remove(o.modifiers['Kantenabrieb']) for o in bpy.data.objects
                                               if o.name in ('Kappe', 'Maske_Nase', 'Schale', 'Kinnleiste') and 'Kantenabrieb' in o.modifiers]),
        ('Antennen (Lauf 3)', lambda: (B['ohrmodule'](), [bpy.data.objects.remove(o, do_unlink=True) for o in list(bpy.data.objects)
                                                         if o.name.startswith('Ohrmodul')])),
        ('Anbau Lauf 5', lambda: anbau_lauf5()),
        ('Studio+Licht', lambda: (B['studio'](), B['licht']())),
        ('Turntable', lambda: B['turntable_keys']()),
    ]
    log = []
    for name, fn in schritte:
        t = time.time(); fn(); log.append((name, round(time.time() - t, 2)))
    bpy.context.scene.frame_set(1)
    if speichern: bpy.ops.wm.save_as_mainfile(filepath=speichern)
    return {'schritte': log, 'sekunden': round(time.time() - t0, 1)}

def anbau_lauf5():
    H = bpy.app.driver_namespace['H']
    ns = {}; exec(open(D + 'helm_csg.py').read(), ns); H['csg'] = ns
    H['traeger'] = 'Schale'
    bpy.context.scene.frame_set(1)
    ns['ohrmodule_neu'](); ns['rueckmodul_neu'](); H['build']['schlauch']()
    return True


# ---------------------------------------------------------------- Lauf 6b: Hybrid – oben 2h-Haube + Augen, unten Lauf 5
GUSS_2H = D + 'guss_2h.npz'

def guss_2h_export(pfad=GUSS_2H):
    """Nach bauen_lauf6(): Haube, Augen, Augenhöhlen, Gelenkscheiben, Krempe, Nase als ausgewertete Meshes (Root-Koordinaten) sichern."""
    import numpy as np
    root = bpy.data.objects['HELM_ROOT']; bpy.context.scene.frame_set(1); dg = bpy.context.evaluated_depsgraph_get(); data = {}
    for o in [o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith(('Kappe', 'Auge', 'Augenhoehle', 'Maske_Gelenk', 'Krempe', 'Maske_Nase'))]:
        oe = o.evaluated_get(dg); me = oe.to_mesh(); M = root.matrix_world.inverted() @ o.matrix_world
        data[o.name + '__V'] = np.array([tuple(M @ v.co) for v in me.vertices], np.float32)
        data[o.name + '__L'] = np.array([len(p.vertices) for p in me.polygons], np.int32)
        data[o.name + '__I'] = np.array([i for p in me.polygons for i in p.vertices], np.int32)
        data[o.name + '__S'] = np.array([p.use_smooth for p in me.polygons], bool)
        data[o.name + '__MAT'] = np.array([o.data.materials[0].name if o.data.materials else 'MAT_Dunkel'])
        oe.to_mesh_clear()
    np.savez_compressed(pfad, **data)
    return sorted({k.split('__')[0] for k in data})

def guss_2h_laden(name, neu_name=None, pfad=GUSS_2H):
    import numpy as np
    H = bpy.app.driver_namespace['H']; L = H['lib']; z = np.load(pfad)
    V = z[name + '__V']; Ls = z[name + '__L']; I = z[name + '__I']; F = []; k = 0
    for n in Ls: F.append(tuple(int(i) for i in I[k:k + n])); k += n
    o = L['mesh_obj'](neu_name or name, [tuple(map(float, v)) for v in V], F)
    o.data.polygons.foreach_set('use_smooth', z[name + '__S'])
    m = str(z[name + '__MAT'][0]); o.data.materials.append(bpy.data.materials[m])
    o.color = {'MAT_Leucht': (0.5, 0.9, 0.88, 1)}.get(m, (0.10, 0.105, 0.115, 1))
    return o

def schneiden(o, p0, nrm, ys):
    """Mesh an der Ebene (p0, nrm) teilen und den Teil unter der Ebene vorn (y < ys) entfernen."""
    import bmesh
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=p0, plane_no=nrm, dist=1e-6)
    weg = [f for f in bm.faces if (f.calc_center_median() - p0).dot(nrm) < 0 and f.calc_center_median().y < ys]
    bmesh.ops.delete(bm, geom=weg, context='FACES')
    bm.to_mesh(o.data); bm.free(); o.data.update()

def kontur_vorn(objs, z, xs):
    """Vorderste Fläche (kleinstes y) je |x| auf Höhe z, per Raycast von vorn."""
    import numpy as np
    from mathutils.bvhtree import BVHTree
    dg = bpy.context.evaluated_depsgraph_get(); out = np.full(len(xs), np.nan)
    for o in objs:
        t = BVHTree.FromObject(o, dg); Mi = o.matrix_world.inverted(); M = o.matrix_world
        for i, x in enumerate(xs):
            for sx in (1, -1):
                hp = t.ray_cast(Mi @ Vector((sx * x, -2, z)), Mi.to_3x3() @ Vector((0, 1, 0)))[0]
                if hp is not None:
                    y = (M @ hp).y
                    if np.isnan(out[i]) or y < out[i]: out[i] = y
    return out

def unten_anpassen(zc, zb, namen):
    """Lauf-5-Maske oben weich auf die 2h-Frontkontur ziehen: Versatz Δy(|x|) an der Fuge, zum Kinn (zb) auslaufend.
    Die Maske wird vorher fein unterteilt (sie besteht aus wenigen ebenen Facetten)."""
    import numpy as np
    objs = [bpy.data.objects[n] for n in namen if n in bpy.data.objects]
    xs = np.linspace(0, 0.36, 37)
    y2h = kontur_vorn([bpy.data.objects['Kappe']], zc + 0.006, xs)
    yl5 = kontur_vorn(objs, zc - 0.004, xs)
    dy = y2h - yl5; ok = ~np.isnan(dy)
    dy = np.interp(xs, xs[ok], dy[ok]) if ok.any() else np.zeros_like(xs)
    # Breite: seitlich gemessen (größtes |x| über die Tiefe), an der Fuge auf die 2h-Breite skalieren
    def breite(ob, z):
        from mathutils.bvhtree import BVHTree
        dg = bpy.context.evaluated_depsgraph_get(); w = 0.0
        for o in ob:
            t = BVHTree.FromObject(o, dg); Mi = o.matrix_world.inverted(); M = o.matrix_world
            for y in np.linspace(-0.45, 0.0, 24):
                for sx in (1, -1):
                    hp = t.ray_cast(Mi @ Vector((sx * 2, y, z)), Mi.to_3x3() @ Vector((-sx, 0, 0)))[0]
                    if hp is not None: w = max(w, abs((M @ hp).x))
        return w
    sxf = breite([bpy.data.objects['Kappe']], zc + 0.006) / max(breite(objs, zc - 0.004), 1e-6)
    for o in objs:
        m = o.modifiers.new('Fein', 'SUBSURF'); m.subdivision_type = 'SIMPLE'; m.levels = m.render_levels = 3
        with bpy.context.temp_override(object=o, active_object=o):
            bpy.ops.object.modifier_apply(modifier=m.name)
        M = o.matrix_world; Mi = M.inverted()
        for v in o.data.vertices:
            p = M @ v.co
            if p.z <= zb: continue
            t = min(1.0, (p.z - zb) / (zc - zb)); w = t * t * (3 - 2 * t)
            p.y += float(np.interp(abs(p.x), xs, dy)) * w
            p.x *= 1 + (sxf - 1) * w
            v.co = Mi @ p
        o.data.update()
    return {'dy': [round(float(v), 3) for v in dy[::6]], 'sx': round(sxf, 3)}

def innen_weg(o, zmin, C=Vector((0, 0.02, 0.55))):
    """Innenschicht (Solidify) der 2h-Haube über zmin entfernen: sie durchstößt an der Schläfe die Außenhaut (helles Dreieck)."""
    import bmesh
    bm = bmesh.new(); bm.from_mesh(o.data); bm.normal_update()
    weg = [f for f in bm.faces if f.calc_center_median().z > zmin and f.normal.dot(f.calc_center_median() - C) < -0.2]
    bmesh.ops.delete(bm, geom=weg, context='FACES'); bm.to_mesh(o.data); bm.free(); o.data.update()
    return len(weg)

def mund_vertiefung(kappe, outline, tiefe, z0, ymax=-0.15, zb_fest=None):
    """Lauf-5-Mundvertiefung (Trapez) in die 2h-Gesichtsplatte: Umriss per bisect sauber ausschneiden, Wanne mit Wänden und Boden.
    outline: (x, y_critic) → Z = y + z0; unterhalb der Gesichtskante wird abgeschnitten."""
    import bmesh
    from mathutils.bvhtree import BVHTree
    dg = bpy.context.evaluated_depsgraph_get(); t = BVHTree.FromObject(kappe, dg)
    def vorn(x, z):
        h = t.ray_cast(Vector((x, -2, z)), Vector((0, 1, 0)))[0]
        return h if h is not None and h.y < ymax else None
    zb = zb_fest
    for i in range(0 if zb_fest else 200):                                       # Unterkante der Gesichtsplatte in der Mitte
        z = 0.6 - i * 0.003
        if vorn(0.0, z) is None: zb = z + 0.012; break
    P = [Vector((x, 0, y + z0)) for x, y in outline]
    # an der Unterkante abschneiden (Sutherland-Hodgman, Halbebene z >= zb)
    Q = []
    for a, b in zip(P, P[1:] + P[:1]):
        ia, ib = a.z >= zb, b.z >= zb
        if ia: Q.append(a)
        if ia != ib: Q.append(a.lerp(b, (zb - a.z) / (b.z - a.z)))
    # Umriss fein unterteilen, damit die Wand der Fläche folgt
    R = []
    for a, b in zip(Q, Q[1:] + Q[:1]):
        n = max(1, int((b - a).length / 0.008))
        R += [a.lerp(b, k / n) for k in range(n)]
    # Rand der Wanne auf der noch unversehrten Fläche vermessen (nach dem Löschen fehlt sie dort);
    # Punkte ohne Treffer übernehmen das y des Nachbarn statt eines festen Ersatzwerts
    rand = []
    for p in R:
        h = vorn(p.x, p.z); rand.append(Vector((p.x, h.y, p.z)) if h else None)
    for i in range(len(rand)):
        if rand[i] is None:
            j = next((rand[(i + k) % len(rand)] for k in range(1, len(rand)) if rand[(i + k) % len(rand)] is not None), None)
            rand[i] = Vector((R[i].x, j.y if j else -0.32, R[i].z))
    # 1) Fläche entlang der Umrisskanten teilen (senkrechte Ebenen), 2) Innenflächen vorn löschen
    bm = bmesh.new(); bm.from_mesh(kappe.data)
    for a, b in zip(Q, Q[1:] + Q[:1]):
        d = b - a; nrm = Vector((-d.z, 0, d.x)).normalized()
        bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=a, plane_no=nrm, dist=1e-6)
    def innen(p):
        ok = True
        for a, b in zip(Q, Q[1:] + Q[:1]):
            if (b.x - a.x) * (p.z - a.z) - (b.z - a.z) * (p.x - a.x) > 1e-6: ok = False
        return ok
    if not innen(sum(Q, Vector()) / len(Q)):               # Umlaufsinn prüfen
        innen_alt = innen
        def innen(p): return all((b.x - a.x) * (p.z - a.z) - (b.z - a.z) * (p.x - a.x) <= 1e-6 for a, b in zip(Q[::-1], (Q[::-1])[1:] + (Q[::-1])[:1]))
    # unterhalb der Wanne den restlichen Zipfel der Gesichtsplatte im (ungekürzten) Umriss mit entfernen
    def im_umriss(p):
        P2 = P if sum((b.x - a.x) * (b.z + a.z) for a, b in zip(P, P[1:] + P[:1])) < 0 else P[::-1]
        return all((b.x - a.x) * (p.z - a.z) - (b.z - a.z) * (p.x - a.x) >= -1e-6 for a, b in zip(P2, P2[1:] + P2[:1]))
    weg = [f for f in bm.faces if f.calc_center_median().y < ymax and (innen(f.calc_center_median())
           or (f.calc_center_median().z < zb and im_umriss(f.calc_center_median())))]
    bmesh.ops.delete(bm, geom=weg, context='FACES'); bm.to_mesh(kappe.data); bm.free(); kappe.data.update()
    # Wanne (Rand wurde vor dem Ausschneiden vermessen)
    boden = [p + Vector((0, tiefe, 0)) for p in rand]; n = len(rand)
    V = [tuple(p) for p in rand + boden]
    F = [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)] + [tuple(range(2 * n - 1, n - 1, -1))]
    H = bpy.app.driver_namespace['H']; L = H['lib']; B = H['build']
    o = L['mesh_obj']('Mund_Vertiefung', V, F); B['fixn'](o); B['setmat'](o, 'MAT_Dunkel'); o.color = (0.08, 0.08, 0.09, 1)
    return {'unterkante': round(zb, 3), 'punkte': n, 'geloescht': len(weg)}

def Z0_CS(cs): return cs['Z0']

def guss_2h_einsetzen():
    """Haube + Augen von Lauf 2h auf den Lauf-5-Aufbau setzen: 2h oberhalb der Gesichtsfuge, Lauf-5-Maske darunter."""
    H = bpy.app.driver_namespace['H']; cs = H['csg']; PRM = cs['PRM']; g = PRM.get('guss2h', {})
    zc = g.get('fugeZ', 0.47); neig = g.get('fugeNeigung', 0.0)                   # Fugenebene: z = zc + neig·(y − y_vorn)
    for n in ('Kappe', 'Krempe', 'Auge_L', 'Auge_R', 'Wange_L', 'Wange_R', 'Maskenfuge_L', 'Maskenfuge_R'):
        o = bpy.data.objects.get(n)
        if o: bpy.data.objects.remove(o, do_unlink=True)
    teile = ['Kappe', 'Auge_L', 'Auge_R', 'Augenhoehle_L', 'Augenhoehle_R', 'Maske_Gelenk_L', 'Maske_Gelenk_R'] + g.get('extra', [])
    neu = [guss_2h_laden(n) for n in teile]
    innen_weg(bpy.data.objects['Kappe'], g.get('innenAbZ', 0.66))
    if g.get('krempeVornY') is not None and bpy.data.objects.get('Krempe'):   # Marker 1/2: Krempe endet an der Ecke der Seitenplatte
        kr = bpy.data.objects['Krempe']; ky = g['krempeVornY']
        import bmesh
        bm = bmesh.new(); bm.from_mesh(kr.data)
        bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, ky, 0), plane_no=(0, 1, 0), dist=1e-6)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.calc_center_median().y < ky], context='FACES')
        bm.to_mesh(kr.data); bm.free(); kr.data.update()
    if g.get('modus') == 'voll':   # Nutzer: Mundstruktur von Lauf 2 (ganze 2h-Gesichtsplatte) + Mittelvertiefung von Lauf 5
        for o in list(bpy.data.objects):
            if o.name in ('Maske', 'Wangenplatte_L', 'Wangenplatte_R', 'Mund_Vertiefung') or o.name.startswith(('Maske_Schraube_', 'Maskenfuge_')):
                bpy.data.objects.remove(o, do_unlink=True)
        mo = PRM['mouth']; zu = g.get('gesichtUnterkanteZ')
        if zu:   # Band unter der Gesichtsplatte (in 2h von der weißen Kinnleiste verdeckt) vorn abschneiden
            schneiden(bpy.data.objects['Kappe'], Vector((0, 0, zu)), Vector((0, 0, 1)), g.get('bandYHinten', -0.05))
        H['mund'] = mund_vertiefung(bpy.data.objects['Kappe'], mo['outline'], mo['depth'], Z0_CS(cs), zb_fest=g.get('mundUntenZ', (zu + 0.004) if zu else None))
        for o in neu:
            if o.name in ('Kappe', 'Krempe') or o.name.startswith('Maske_Gelenk'):
                with bpy.context.temp_override(object=o, active_object=o, selected_editable_objects=[o], selected_objects=[o]):
                    bpy.ops.object.shade_smooth_by_angle(angle=math.radians(30))
            if o.name.startswith('Augenhoehle') and g.get('augenKantig'):   # Marker 6: harte Kanten am Augenrand
                o.data.polygons.foreach_set('use_smooth', [False] * len(o.data.polygons)); o.data.update()
        if g.get('augenKantig'):   # auch die Haubenfläche direkt am Augenrand (2h-Fase) hart schattieren
            kp = bpy.data.objects['Kappe']; boxen = []
            for n in ('Augenhoehle_L', 'Augenhoehle_R'):
                ah = bpy.data.objects.get(n)
                if ah:
                    pts = [ah.matrix_world @ Vector(c) for c in ah.bound_box]; e = g.get('augenRand', 0.012)
                    boxen.append((Vector((min(p.x for p in pts) - e, min(p.y for p in pts) - e, min(p.z for p in pts) - e)),
                                  Vector((max(p.x for p in pts) + e, max(p.y for p in pts) + e, max(p.z for p in pts) + e))))
            Mk = kp.matrix_world
            for f in kp.data.polygons:
                c = Mk @ f.center
                if any(a.x <= c.x <= b.x and a.y <= c.y <= b.y and a.z <= c.z <= b.z for a, b in boxen): f.use_smooth = False
            kp.data.update()
        return [o.name for o in neu]
    nrm = Vector((0, -neig, 1)).normalized(); p0 = Vector((0, -0.5, zc))
    # Haube: alles unter der Fuge weg (nur im Gesichtsbereich vorn, y < y_schnitt)
    ys = g.get('yHinten', 0.05)
    schneiden(bpy.data.objects['Kappe'], p0, nrm, ys)   # 2h-Haube ist nicht geschlossen → bisect statt Boolean
    # Lauf-5-Maske: nur unterhalb der Fuge (plus Überlappung hinter der Haube)
    maske = bpy.data.objects['Maske']
    cs['csg'](maske, ('I', cs['halbraum'](p0 + nrm * g.get('ueberlapp', 0.0), tuple(nrm))))
    for o in list(bpy.data.objects):
        if o.name.startswith('Maske_Schraube_'): bpy.data.objects.remove(o, do_unlink=True)
    H['guss2h_anpassung'] = unten_anpassen(zc, g.get('auslaufZ', 0.2), ['Maske', 'Wangenplatte_L', 'Wangenplatte_R'])
    cs['fugen_schrauben']()   # Fuge/Schrauben auf die angepasste Maske neu setzen
    for o in neu:
        if o.name in ('Kappe', 'Krempe') or o.name.startswith('Maske_Gelenk'):
            with bpy.context.temp_override(object=o, active_object=o, selected_editable_objects=[o], selected_objects=[o]):
                bpy.ops.object.shade_smooth_by_angle(angle=math.radians(30))
    return [o.name for o in neu]

def bauen_lauf6b(speichern=None):
    r = bauen_lauf4()
    r['guss2h'] = guss_2h_einsetzen()
    bpy.context.scene.frame_set(1)
    if speichern: bpy.ops.wm.save_as_mainfile(filepath=speichern)
    return r
