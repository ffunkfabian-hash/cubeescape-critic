# Auftrag: Helm „Scout v3“ in Blender nachbauen

## 0. Was sich gegenüber v1/v2 geändert hat
Dies ist ein **neues Design** (Turntable-Referenz), nicht mehr das weiche Ei aus v2. Die Formsprache ist jetzt **Hard-Surface**: eine zylindrische weiße Schale, darauf eine dunkle Kappe mit Visierkante und eine dunkle, facettierte Gesichtsmaske. Ebene Flächen, Panel-Linien und Bevel-Kanten sind hier **erwünscht**. Alles aus v1/v2 ist hinfällig; nur diese Datei gilt.

Die Referenz `ref_helm_v3.png` enthält **vier echte 90°-Ansichten** (Kamera auf Augenhöhe), nebeneinander, je 720 × 720 px:
1. Front (0°) · 2. rechte Seite des Trägers (+90°) · 3. Rücken (180°) · 4. linke Seite des Trägers (−90°)
Das Tuch unten im Bild gehört nicht zum Helm und wird nicht gebaut.

**Verbindliche Entscheidung zur Referenz:** In `ref_helm_v3.png` zeigen die beiden Seitenansichten unterschiedliche Pods (eckig mit Gitter vs. rund mit Spiralkabel). Gebaut wird **beidseitig der runde Pod aus Ansicht 4**, gespiegelt. Die Antenne existiert nur rechts (+X).

Zweite Referenz `ref_helm_v3b.png` (gleicher Helm, flach schattiert, gleiche vier Ansichten): bestätigt die runden Pods auf **beiden** Seiten und dient nur als Gegenprüfung für Pod-Position, Kabelverlauf und Kappenform. Bei Widersprüchen zwischen beiden Blättern gilt `ref_helm_v3.png`; die IoU-Prüfung in Abschnitt 13 läuft ausschließlich gegen `ref_helm_v3.png`.

---

## 1. Rolle, Rahmen, Regeln
Blender-Modelling-Agent per CLI (`blender --background --python build_helm_v3.py`) oder MCP. Ergebnis: `helm_v3.blend`, reproduzierbares `build_helm_v3.py`, Kontroll-Renders, `REPORT.md`. Nur Blender-Bordmittel.

1. Einheiten Metric; alle Maße in **Helmhöhe H = 1,0** (= 0,30 m real; vor Verwendung × 0,30). In der Referenz ist H = 520 px (Kappenscheitel bis Unterkante Kinnleiste).
2. Koordinaten: +Z oben, −Y vorn (Gesicht), +X rechts vom Träger. Z = 0 Unterkante Schale (= Unterkante Kinnleiste), Z = 1,0 Kappenscheitel. Y = 0 Mitte der Schalentiefe. Symmetrie X = 0.
3. Mirror-Modifier (X, Clipping) für alles außer Abschnitt 11.
4. Alle Werte verbindlich, keine Rückfragen.
5. Skript idempotent, eine Funktion pro Abschnitt, nach jedem Abschnitt speichern.
6. **Formsprache:** Kanten per Bevel-Modifier (Width 0,006, 2 Segmente, Angle 30°, Harden Normals). Panel-Linien per Boolean (Nut 0,006 breit, 0,003 tief) oder Inset. Keine Subdivision auf Hartteilen; Subdivision nur auf der Kappenkuppel und den Pods.
7. Zwei Phasen mit Stop-Kriterium (Abschnitt 13).

---

## 2. Objekte (Collection `HELM_V3`)
```
HELM_V3
├─ Schale               (weiße Grundschale, Zylinder mit Kragen)
├─ Kappe                (dunkle Kuppel + umlaufende Krempe, ein Objekt)
├─ Maske_Stirn          (dunkle Stirnplatte mit Augenschlitzen)
├─ Auge_L / _R          (Leuchteinlagen)
├─ Maske_Wange_L / _R   (dunkle Wangenplatten)
├─ Maske_Nase           (zentrales Nasen-/Mundmodul)
├─ Kinnleiste           (weiße Kinn-/Kieferleiste)
├─ Kinn_Panel           (eingesetzte Platte mit Schlitzen)
├─ Pod_L / _R           (ovale Kapsel + Halteplatte, join)
├─ Pod_Buegel_L / _R    (Drahtbügel über dem Pod)
├─ Pod_Stecker_L / _R   (Kabelabgang unten am Pod)
├─ Kabel_L / _R         (Spiralkabel Pod → Rückbox)
├─ Rueckbox             (Box + Sechseckplatte, join)
├─ Rueckbox_Anschluss_L / _R
├─ Antenne_R            (nur rechts)
├─ Lug_L / _R           (kleine Laschen oben an der Kappe)
└─ Schraube_*           (Instanzen)
```

---

## 3. Schale (weiß) – Grundkörper
Vertikale Schale, von oben gesehen eine Superellipse mit stumpfer Front und rundem Hinterkopf, nach unten leicht verjüngt, mit einem abgesetzten Kragen unten. Oben offen (die Kappe schließt), unten offen (Halsöffnung). Solidify 0,015 nach innen.

### 3.1 Querschnitte (Superellipse: `x = a·|cos t|^(2/n)·sgn`, `y = ±b·|sin t|^(2/n)`; vorn b_v, hinten b_h)
| Z | a | b_v | b_h | n_v | n_h | Bemerkung |
|---|---|---|---|---|---|---|
| 0,00 | 0,33 | 0,38 | 0,46 | 3,0 | 2,2 | Kragen-Unterkante |
| 0,30 | 0,34 | 0,39 | 0,47 | 3,0 | 2,2 | Kragen-Oberkante |
| 0,31 | 0,37 | 0,44 | 0,52 | 3,0 | 2,2 | **Stufe** 0,03 nach außen (Kragenabsatz) |
| 0,55 | 0,38 | 0,46 | 0,54 | 3,0 | 2,2 | breiteste Stelle |
| 0,72 | 0,38 | 0,45 | 0,53 | 2,8 | 2,2 | Oberkante sichtbare Schale |
| 0,80 | 0,36 | 0,42 | 0,50 | 2,6 | 2,2 | verschwindet unter der Kappe |

- 64 Punkte pro Ring, `bridge_edge_loops`, der Ring bei Z 0,30 und 0,31 erzeugt die horizontale Stufe (scharfe Kante, Bevel 0,004).
- Die Front (Y < −0,30) ist in der Realität von der Maske verdeckt; trotzdem vollständig bauen.
- Material `MAT_Weiss`.

### 3.2 Panel-Linien auf der Schale (Nuten 0,006 × 0,003)
1. Horizontale Nut 0,02 unter der Kragenstufe (Z 0,28) rundum.
2. Vertikale Nut hinten mittig von Z 0,31 bis 0,72.
3. Je Seite eine L-förmige Nut: von (±0,37 / +0,10 / 0,70) senkrecht nach unten bis Z 0,40, dann nach hinten bis Y +0,40.
4. Je Seite eine rechteckige, 0,003 erhabene Fläche (Griffstruktur, „Leder-Panel“) an der Wange unterhalb des Pods: 0,20 × 0,08 (Y × Z), Zentrum (±0,37 / −0,05 / 0,36). Mittig darin ein Schlitz 0,10 × 0,015.
5. Hinten links/rechts je ein kleines Rechteck-Fenster 0,05 × 0,04, 0,004 tief, bei (±0,30 / +0,42 / 0,45).
6. 6 Schrauben Ø 0,012 auf der Rückseite: ±0,22 bei Z 0,75 und 0,45; ±0,10 bei Z 0,32.

---

## 4. Kappe (dunkel)
Ein Objekt aus zwei Teilen (join): **Kuppel** und **Krempe**.

### 4.1 Kuppel
- Ellipsoid-Kappe über der Schale: Halbachsen a 0,40 (X), b 0,52 (Y, Zentrum bei Y +0,02), c 0,30 (Z), Zentrum Z 0,72 → Scheitel Z 1,02, nach Solidify-Innenseite Scheitel außen bei 1,00.
- Unten bei Z 0,76 abgeschnitten (horizontaler Schnitt rundum).
- Vorn ist die Kuppel **nicht rund**, sondern läuft in eine leicht gewölbte Stirnfläche über: zwischen Y −0,30 und −0,46 ist die Oberfläche in X fast gerade (n = 3,2 nur für den vorderen Bereich). Resultat von vorn: oben rund, zu den Schläfen hin breite, fast senkrechte Flanken.
- Subdivision 2 auf der Kuppel, dann Solidify 0,015.

### 4.2 Krempe (Visierkante)
- Umlaufendes Band unter der Kuppel, Höhe 0,06 (Z 0,70–0,76), steht 0,02 über die Schale hinaus, Unterkante scharf (Bevel 0,003).
- Vorn wird die Krempe zur **Visierkante**: zwischen X −0,36 und +0,36 ist die Krempe 0,025 nach vorn verlängert und läuft als Grat in die Stirnplatte (Abschnitt 5) über, mit einem leichten Knick nach unten (Vorderkante bei Z 0,69, hinten Z 0,72 → wirkt wie ein Schirm).
- Hinten (Y > +0,30) ist die Krempe 0,02 höher (Z 0,72–0,78) und hat eine zusätzliche dunkle Fläche, die bis Z 0,84 hochzieht (sichtbar in Ansicht 3 als dunkler „Hut“ über der weißen Schale).
- Zwei **Lugs** `Lug_L/R`: kleine Laschen 0,04 × 0,03 × 0,02 auf der Kuppel bei (±0,20 / −0,05 / 0,93), Material `MAT_Pod`.
- Material `MAT_Dunkel`.

---

## 5. Gesichtsmaske (dunkel, auf der Schalenfront, 0,02 vor der Schale)
Alle Maskenteile liegen auf einer gemeinsamen gewölbten Fläche (Shrinkwrap auf die Schale, Offset 0,020, Dicke 0,012 nach innen).

### 5.1 Maske_Stirn
- Umriss von vorn: Trapez – Oberkante Z 0,70 (Breite 0,72, geht in die Visierkante über), Unterkante Z 0,46 (Breite 0,64), Seiten leicht nach innen.
- Zwischen den Augen ein nach unten zeigender **Keil** (Nasenansatz): die Unterkante hat mittig eine Spitze bis Z 0,40, Breite der Spitze oben 0,14.
- Mittig vertikal ein leichter Dachknick (6°), X = 0 vorderste Linie.
- 2 Schrauben Ø 0,012 bei (±0,30 / Z 0,52).
- Material `MAT_Dunkel`.

### 5.2 Auge_L / _R (in der Stirnplatte)
- Trapezförmige Schlitze: Zentrum X ±0,19 / Z 0,58; Länge 0,16; Höhe innen 0,05, außen 0,065 (äußeres Ende höher und höher gezogen, Oberkante steigt nach außen um 0,02).
- Ecken R 0,006. Boolean 0,008 tief; Einlage 0,002 unter der Oberfläche, Material `MAT_Leucht`.

### 5.3 Maske_Wange_L / _R
- Dunkle Platte unter der Stirnplatte, links/rechts des Nasenmoduls: Umriss – oben Z 0,46 (bündig an Stirnplatte, Spalt 0,006), innen entlang des Nasenmoduls (Abstand 0,006), außen bei X ±0,33 (oben) → ±0,27 (unten), unten Z 0,22.
- Horizontale Panel-Nut bei Z 0,36 über die ganze Platte.
- Kleines Rechteck-Fenster 0,04 × 0,02, 0,004 tief, bei (±0,24 / Z 0,42).
- 1 Schraube Ø 0,012 bei (±0,30 / Z 0,30).
- Material `MAT_Dunkel`.

### 5.4 Maske_Nase (zentrales Modul)
- Trapez von vorn: oben Breite 0,12 bei Z 0,46 (schließt an die Keilspitze der Stirnplatte an), unten Breite 0,22 bei Z 0,20.
- Liegt 0,010 **vor** den Wangenplatten (eigene Stufe).
- Oben ein rechteckiger Lüftungsschlitz 0,06 × 0,025, 0,006 tief, bei Z 0,42.
- Mittig vertikal eine schmale Nut 0,004 × 0,002 von Z 0,38 bis 0,24.
- Unterkante geht in die Kinnleiste über (Spalt 0,006).
- Material `MAT_Dunkel`.

---

## 6. Kinnleiste (weiß) und Kinn_Panel
### 6.1 Kinnleiste
- Weißes Band vorn unten, Z 0,06–0,20, von X −0,34 bis +0,34, folgt der Schalenfront (Shrinkwrap Offset 0,025, Dicke 0,015).
- Unterkante vorn: leicht nach vorn vorgezogen (Lippe 0,015), Ecken bei X ±0,34 abgeschrägt (Fase 0,04).
- Seitlich läuft die Leiste als schmaler Steg (Höhe 0,06) bis Y +0,05 nach hinten und endet dort stumpf.
- Material `MAT_Weiss`.

### 6.2 Kinn_Panel
- Eingesetzte Platte 0,20 × 0,10 (X × Z), 0,004 vertieft, Zentrum (0 / Front / Z 0,13).
- Darin drei horizontale Schlitze 0,12 × 0,012, 0,006 tief, Abstand 0,02.
- Material `MAT_Weiss` (Schlitzboden `MAT_Dunkel`).

---

## 7. Pods, Bügel, Antenne (beidseitig, Antenne nur rechts)

### 7.1 Pod_L / _R
- Ovale Kapsel: Ellipsoid-Hälfte, Halbachsen 0,10 (Y) × 0,125 (Z) × 0,06 (X, Höhe nach außen), Zentrum (±0,41 / −0,04 / 0,55), Außenfläche gewölbt, Rand Fillet 0,015, Subdivision 2.
- Halteplatte 0,16 × 0,20 (Y × Z), Dicke 0,012, Ecken R 0,02, Shrinkwrap Unterseite auf die Schale. Join.
- Auf der Außenfläche: eine kleine runde Taste Ø 0,03 (0,004 erhaben) bei Pod-Mitte +0,02 in Y, und eine dreieckige Vertiefung 0,04 × 0,03, 0,003 tief, darunter.
- Oberseite des Pods: Zylinder-Sockel Ø 0,035, Höhe 0,02 (Antennenfuß, beidseitig vorhanden; links ohne Antenne, mit Deckel).
- Material `MAT_Pod` (olivgrau, siehe Materialien).

### 7.2 Pod_Buegel_L / _R
- Drahtbügel Ø 0,012 (Bezier, 4 Punkte), der über den Pod gespannt ist: Fußpunkte auf der Halteplatte vorn-unten (±0,42 / −0,15 / 0,44) und hinten-unten (±0,42 / +0,07 / 0,44), Scheitel 0,04 über dem Pod bei (±0,50 / −0,04 / 0,68).
- Material `MAT_Metall`.

### 7.3 Pod_Stecker_L / _R
- Zylinder Ø 0,03, Länge 0,03, unten-vorn am Pod (±0,43 / −0,10 / 0,43), Achse nach unten-vorn geneigt (30°). Von hier geht das Kabel ab. Material `MAT_Metall`.

### 7.4 Antenne_R (nur rechts)
- Fuß auf dem Pod-Sockel (+0,43 / −0,04 / 0,68).
- Stab Ø 0,014, Länge 0,45, Neigung 12° nach vorn (−Y) und 5° nach außen (+X). Spitze flach.
- Unteres Drittel etwas dicker (Ø 0,018, Länge 0,12) als Hülse.
- Material `MAT_Dunkel`.

---

## 8. Kabel_L / _R (Spiralkabel)
- Verlauf (Bezier, 4 Kontrollpunkte, pro Seite gespiegelt):
  P0 Stecker (±0,43 / −0,10 / 0,42) → P1 (±0,47 / −0,05 / 0,28) → P2 (±0,46 / +0,30 / 0,24) → P3 Rückbox-Anschluss (±0,18 / +0,50 / 0,60)
- Das Kabel hängt in einem Bogen an der Seite herunter (Tiefpunkt Z ≈ 0,22) und steigt hinten zur Box auf; Abstand zur Schale überall ≥ 0,02.
- Spirale: Kern-Kurve Bevel Depth 0,006; darum eine Helix (Screw-Modifier auf einem kleinen Kreis Ø 0,012, Steigung 0,018, Spiralradius 0,022) entlang der Kurve (Curve-Modifier). Alternative: Array eines Torus-Rings Ø 0,044 / Rohr 0,006 entlang der Kurve mit 0,018 Abstand – optisch gleichwertig.
- Material `MAT_Kabel`.

---

## 9. Rückbox
### 9.1 Rueckbox
- Box 0,30 × 0,10 × 0,24 (X × Y × Z), Zentrum (0 / +0,52 / 0,66), Rückseite eben, Vorderseite per Shrinkwrap an die Schale, Kanten Bevel 0,006.
- Darauf zentriert eine **sechseckige Platte** 0,22 × 0,16 (X × Z), 0,012 erhaben, Ecken 45° abgeschrägt (0,04); darin eine zweite Sechseck-Vertiefung 0,16 × 0,10, 0,004 tief, mit zwei diagonalen Nuten (Kratzer-Optik, 0,003 × 0,002).
- 4 Schrauben Ø 0,012 an den Ecken der Box.
- Unter der Box ein kleines Trapez-Panel 0,10 × 0,04, 0,003 erhaben, bei Z 0,50.
- Material `MAT_Pod`.

### 9.2 Rueckbox_Anschluss_L / _R
- Zylinder Ø 0,04, Länge 0,04, an den seitlichen Stirnflächen der Box bei (±0,17 / +0,52 / 0,60), Achse in X; Kabelende endet darin. Material `MAT_Metall`.

---

## 10. Schrauben (Instanzen)
`Schraube` Basis-Mesh: Zylinder Ø 0,012, Höhe 0,003, Kuppel +0,002, Kreuzschlitz 0,001 tief. Alle oben genannten Positionen als Instanzen mit Shrinkwrap auf das jeweilige Zielobjekt. Gesamt ≥ 18.

## 11. Asymmetrien (nicht spiegeln)
- `Antenne_R` nur rechts (+X). Links trägt der Pod-Sockel einen flachen Deckel.
- Alles andere gespiegelt, auch beide Kabel und beide Anschlüsse.

---

## 12. Tuch
Nicht Teil dieses Auftrags. Keine Halsgeometrie unter Z 0.

---

## 13. Phasen und Stop-Kriterium

### Phase 1 – Grundmassen
Nur bauen: Schale (3.1, ohne Nuten), Kappe (4, ohne Lugs), Maskenfläche als eine Platte (Umriss = Vereinigung von 5.1, 5.3, 5.4, ohne Schlitze), Kinnleiste (6.1). Dann:
1. Vier Kameras nach Abschnitt 15, Workbench Flat/Single schwarz auf Weiß → `sil_<cam>.png`.
2. `ref_helm_v3.png` in vier Teile à 720 px schneiden. Maske pro Teil: Pixel = Helm, wenn Luminanz < Hintergrund − 12 (Hintergrund = Median der obersten 20 Zeilen) **und** oberhalb der Tuch-Oberkante (unterste Zeile, in der die Maske breiter als 0,85 × Bildbreite wird; darunter verwerfen). Antenne und Kabel aus der Referenzmaske morphologisch entfernen (Opening mit Kernel 9 px), weil Phase 1 sie noch nicht enthält.
3. Masken auf gleiche Höhe skalieren, Schwerpunkt ausrichten, IoU berechnen.
4. **Stop-Kriterium:** IoU ≥ 0,90 in Front und Rücken, ≥ 0,88 in beiden Seiten. Sonst Tabelle 3.1 / Kuppelmaße 4.1 anpassen (Schritte 0,01), neu bauen, max. 8 Iterationen, alles loggen.

### Phase 2 – Details
Reihenfolge 3.2 → 5 → 6.2 → 7 → 8 → 9 → 10. Nach 7 und 9 erneut IoU (jetzt ohne Opening); Pods und Box dürfen die Seiten-/Rücken-IoU nicht unter 0,86 drücken.

---

## 14. Materialien (Principled BSDF)
| Name | Base Color | Roughness | Metallic |
|---|---|---|---|
| MAT_Dunkel | #26282B | 0,55 | 0,10 |
| MAT_Weiss | #D7D5CF | 0,65 | 0,0 |
| MAT_Leucht | Emission #7FE6E0, Stärke 4 | – | – |
| MAT_Pod | #5A574D (olivgrau) | 0,60 | 0,2 |
| MAT_Kabel | #1C1C1C | 0,45 | 0,0 |
| MAT_Metall | #6E6E6E | 0,30 | 1,0 |
Optional ohne Bilddateien: Kantenabrieb auf MAT_Weiss per Pointiness → Mix mit #8E8C86.

---

## 15. Kameras und Abnahme-Renders
Brennweite 85 mm, Ziel (0 / 0 / 0,50), Abstand 3,2, Elevation 0° (Augenhöhe, wie die Referenz), Hintergrund #8A8C90, Area-Light vorn-oben-links, Fill hinten:
- `cam_front`: Azimut 0°
- `cam_right`: Azimut +90°
- `cam_back`: Azimut 180°
- `cam_left`: Azimut −90°
Renders `check_<cam>.png` 720 × 720 (EEVEE); `compare_<cam>.png` Referenz links / Render rechts.

## 16. Abnahmekriterien
1. IoU aus Phase 1 bestanden und protokolliert; Phase-2-IoU ≥ 0,86 überall.
2. Hüllbox (ohne Antenne/Kabel): 0,80 ± 0,02 × 1,06 ± 0,03 × 1,00 ± 0,01 (X × Y × Z).
3. Kragenstufe bei Z 0,30 ± 0,01 vorhanden (sichtbar in Seitenansicht).
4. Krempe steht rundum 0,02 ± 0,005 über die Schale.
5. Pods beidseitig identisch (Spiegelprüfung ± 0,005); Antenne nur rechts, Länge 0,45 ± 0,03.
6. Kabel berühren weder Schale noch Pod (Mindestabstand 0,015, Raycast-Stichprobe).
7. Alle Objekte aus Abschnitt 2 vorhanden, exakte Namen, je ein Material; ≥ 18 Schrauben-Instanzen.
8. `build_helm_v3.py` läuft aus leerer Datei fehlerfrei durch.

## 17. REPORT.md
- IoU-Tabelle pro Iteration und Ansicht
- Abnahmekriterien mit Messwerten
- Nicht erreichte Punkte mit Begründung
- Nur Listen/Tabellen

## 18. Verbote
- Keine Teile aus Ansicht 2 (eckiger Pod, Gitterplatte) bauen.
- Keine zweite Antenne, keinen Stab links.
- Keine Subdivision auf Maske, Kinnleiste, Rückbox.
- Kein Tuch, kein Hals.
- Keine Rückfragen.
