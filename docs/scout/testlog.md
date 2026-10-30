> Übernommen aus dem Arbeitsordner `trialanderror` (Stand D29, 29.10.2026). Dateinamen ohne Pfad beziehen sich jetzt auf `archive/blender/scout/` (seit 0.18 archiviert; `guss_2h.npz` und `helm_params.json` in `web/src/robotgen/data/`); Bilder auf `assets/helmet-scout/`; `durchlaeufe/` und Marker-Exporte blieben im Arbeitsordner.

# Messprotokoll Helm-Live-Test (Scout v3)

Format: ISO-Zeit | Stufe | MCP-Aufrufe bisher | Notiz

2026-10-28T13:03:03+01:00 | Setup | 6 | Szene, Einheiten (1 BU = H = 0,30 m), Referenzbilder, 5 Kameras, Meshy-Vorlage (versteckt)
2026-10-28T13:04:34+01:00 | A Blocking | 15 | Schale+Kragen, Kappe+Krempe, Maskenmasse, Kinnleiste, Pods L/R, Rueckbox, Antenne R, Hals; Beauty-Check cam_front: Pod-Lage/Breite passt zur Referenz
2026-10-28T13:13:41+01:00 | B Sekundärformen | 52 | Schale geloftet (10 Superellipsen), Kragenstufe, Nuten/Fenster; Kappe Kuppel+Krempe/Visier/Hut; Maske 4 Platten Shrinkwrap+Dachknick, Augenschlitze+Einlagen, Wange/Nase/Kinn-Vertiefungen, Kinn_Panel; Pods+Platten; Rueckbox; Hals. Fix: Normalen der Schneidekörper
2026-10-28T13:16:42+01:00 | C Mechanik | 64 | Lugs, Pod-Sockel (L mit Deckel), Antenne_R (Mutter/Hülse/Ring/Stab), Bügel+Fußplatten, Stecker, Rückbox-Anschlüsse, Spiralkabel L/R (Helix 54 Wdg., Hülsen), Gelenkscheiben, Maskenhalter; Kabelabstand zur Schale 0,019 H
2026-10-28T13:19:32+01:00 | D Tertiärdetails | 74 | 22 Schrauben-Instanzen (ein Mesh, Kreuzschlitz), Pod-Taste+Dreieck, Rückboxplatte (Vertiefung, Kratzer, Hebel), Trapezpanel, Griffpanels+Schlitz, Wartungsklappen; Fix: Dreieck-Schneidekörper tiefer (Subdivision schrumpft Pod)
2026-10-28T13:20:39+01:00 | E Mikrodetails | 79 | Krempen-Naht, Kennungen SCOUT V3 / SV3-07 (Shrinkwrap), Integritätscheck 69,5k Flächen: keine losen Verts; Pod-Platten Doppelpunkte bereinigt; Rest degeneriert = unsichtbare Text-/Bevel-Nullflächen
2026-10-28T13:24:46+01:00 | Materialien | 90 | PBR prozedural (Object-Koordinaten): Rauheitsvariation, Mikro-Bump, Kantenabrieb per GN-Attribut wear (Flächendomäne nach Bevel), Kratzer (Voronoi-Kanten, maskiert), Staub per AO; Fix: Abrieb zuerst flächig -> Domäne/Schwelle korrigiert, Krempe ohne Abrieb
2026-10-28T13:30:52+01:00 | Umgebung + Licht | 114 | Hohlkehle #8A8C90 mit sphärischem Verlauf/Vignette, Welt 0,18; Key vorn-oben-links, Fill hinten, Oben, Kante rechts; EEVEE Raytracing an. Fix: Körnung durch Fast GI -> Fast GI aus, Ansicht konvergiert sauber
2026-10-28T13:31:22+01:00 | Turntable | 115 | HELM_ROOT: Halt 1–36, Ease-in 36–72, konstant 1,5°/Frame 72–276, Ease-out 276–312, Halt bis 336 (24 fps, 360° in 10 s); Antenne_R gedämpftes Nachschwingen ±1,6°
2026-10-28T13:48:02+01:00 | Formdurchgang (Nutzerhinweis) | 145 | Kuppel als vertikale Superellipse neu (steile Flanken, flaches Dach) + Stirnfacette per Bisect mit Bevel-Kante; Lattice-Versuch verworfen (zu weich, Gitter erst falsch skaliert); Maske_Seite L/R diagonal; Kinnleiste +0,035 vorgezogen; Kopfgurt mit Schnalle/Haltern
2026-10-28T13:48:52+01:00 | Endpräsentation | 146 | cam_praesentation, EEVEE Rendered, 4 s Halt, Turntable 336 Frames, Stopp auf Endbild (Front)
2026-10-28T13:50:17+01:00 | Abschluss | 148 | Turntable bis Frame 336 abgespielt, Halt auf Front; gespeichert helm_live_test.blend (+ _A.._E, _Form)

## Abnahme (gemessen in Blender)
| Kriterium | Soll | Ist | Status |
|---|---|---|---|
| Objektliste Bauplan §2 | alle, exakte Namen | alle vorhanden (+ Hals, Maske_Seite, Kopfgurt, Detailteile) | ok |
| Schrauben-Instanzen | ≥ 18 | 22 (ein Mesh, Kreuzschlitz) | ok |
| Höhe Z | 1,00 ± 0,01 | 1,008 | ok |
| Breite X Schale/Krempe | 0,80 ± 0,02 | 0,80 (Krempe ±0,40); mit Pods/Bügeln 1,01 | ok |
| Tiefe Y (ohne Antenne/Kabel) | 1,06 ± 0,03 | 1,12 | Abweichung: Kinnleiste nach Nutzerhinweis +0,035 vorgezogen |
| Antenne nur rechts, Länge | 0,45 ± 0,03 | 0,450 | ok |
| Pods spiegelgleich | ± 0,005 | 0,000 | ok |
| Kabelabstand Schale/Pod/Box | ≥ 0,015 | 0,030 / 0,060 / 0,040 | ok |
| Turntable | Ease-in, 360° ~10 s, Ease-out, Halt | 1,5°/Frame konstant, 24 fps, Halt Front | ok |
| EEVEE only, kein Offline-Render | – | nur Viewport | ok |

## Nicht erreicht / offen
- IoU-Silhouettenprüfung des Bauplans (§13) nicht gerechnet: der Brief verbietet Offline-Renders; Abgleich nur visuell über die Referenzbilder an den vier Kameras.
- Leichte Restkörnung in tief verschatteten Bereichen (Kragen unter der Kinnleiste) im Rendered-Viewport.
- Kabel ohne Sekundärbewegung im Turntable (nur Antenne schwingt nach).
- OBS lief nicht (Nutzerentscheid „OBS ist egal“) – keine Timelapse-Aufnahme.
- Formsprache anfangs zu zylindrisch (Bauplan-Superellipsen); Facetten/Seitenplatten/Kinn/Gurt erst nach Nutzerhinweis ergänzt.
2026-10-28T14:09:26+01:00 | Formdurchgang 2 | 162 | Maske auf Tangenten-Trägerhülle (Facetten: Mittelgrat, Wange, Schläfe), Schrauben/Gelenke per Raycast nachgesetzt; Pod-Halterarme als Gabel vom Kopfgurt; Kragenblenden L/R mit gestufter Oberkante + 4 Schrauben; AO-Staub auf Weiß/Oliv entfernt. Befund: Viewport-Körnung = fehlende Redraws im Hintergrund, nicht Shader
2026-10-28T14:13:56+01:00 | Endpräsentation 2 | 173 | Fix: Schneidekörper/Trägerhüllen an HELM_ROOT gehängt (drehten nicht mit); Turntable per Echtzeit-Timer abgespielt (~24 fps), Endframe 336, Halt auf Front; gespeichert

## Nachtrag Formdurchgang 2 und Befunde
- Maske auf Tangenten-Trägerhülle: Mittelgrat-, Wangen- und Schläfenfacetten mit Knickkanten; Schrauben/Gelenke per Raycast nachgesetzt (Versatz ≈ 2 mm).
- Pod-Halterarme als Gabel vom Kopfgurt, Gelenkbolzen am Pod; Kragenblenden L/R mit gestufter Oberkante (vorn 0,27, hinten 0,21, 45°) und 4 Schrauben.
- Befund 1: Schneidekörper und Trägerhüllen hingen nicht an HELM_ROOT – beim Turntable wären Nuten/Schlitze/Maskenprojektion verrutscht. Behoben (Parenting bei Rotation 0); Mesh-Signaturen bei 0° und 180° identisch, Frame-Auswertung ~0,12 s.
- Befund 2: „Körnung“ im Rendered-Viewport kam überwiegend von fehlenden Redraws, solange Blender im Hintergrund lief (EEVEE sammelt dann keine Samples). Mit erzwungenen Redraws konvergiert das Bild sauber. Fast GI war zusätzlich eine echte Rauschquelle (aus).
- Befund 3: `screen.animation_play` aus einem Timer im Hintergrund startete nicht zuverlässig; Turntable deshalb per Echtzeit-Timer (frame_set, 24 fps) abgespielt.
- Befund 4 (korrigiert): Die Sitzung lief laut Nutzer mit Opus 5.5 „hoch“. Meine frühere Angabe „niedriger“ war eine unbelegte Vermutung und ist falsch. Der Hinweis von blendermcp.org (Standard „medium“) bleibt nur als Startprüfung relevant.

## Vorschlag LESSONS.md (nicht geschrieben – Testrahmen verbietet Repo-Änderungen)
- Blender-MCP-Livebau: Form zuerst gegen die Referenz-Silhouetten prüfen (Facetten/Kanten), nicht nur Bauplan-Maße; Hilfsobjekte (Cutter, Shrinkwrap-Ziele) immer an den Animations-Root hängen; Viewport im Hintergrund braucht Redraw-Timer.

## Vergleich mit dem Spinnen-Workflow (Google-Dokument + YouTube-Short)
- Die Spinnenbilder im Dokument sind Midjourney-Konzepte (Eingabe), nicht das Blender-Ergebnis. Das Blender-Ergebnis im Short ist einfacher als die Konzepte, aber formsicher.
- Unterschiede zum Helm-Lauf: (1) dort konsistentes Mehransichten-Blatt aus Midjourney als Vorlage, hier AI-Turntable-Frames mit Widersprüchen; (2) dort weiche Schalenformen (Subdivision-freundlich), hier facettierte Hard-Surface-Form, die ich zuerst aus Bauplan-Superellipsen statt aus der Silhouette gebaut habe; (3) dort Cycles-Endrender mit Tiefenunschärfe und Nahaufnahmen, hier nur EEVEE-Viewport; (4) dort geschnittener Short, hier ungeschnittener Lauf. (Denkaufwand war laut Nutzer „hoch“ – keine Ursache.)
- Konsequenz: Brief um Abschnitt „Lehren aus Lauf 1“ ergänzt (Rangfolge Referenz > Bauplan, Formstudie, Silhouetten-Abnahme, Modellierweise, Root-Parenting, EEVEE-Fallen, Denkaufwand, optionaler Cycles-Standbild-Render); START_TEST.md um Denkaufwand-Prüfung und Vordergrund-Hinweis ergänzt. Globale Regeln (Nexogen) unverändert – die Lehren sind testspezifisch.

---

# Lauf 2 (gleiche Sitzung, Brief mit „Lehren aus Lauf 1“)
Lauf-1-Dateien liegen in `lauf1/`. Denkaufwand laut Nutzer: Opus 5.5 hoch.

## Formstudie (vor dem Blocking, ohne Blender)
**Kappe** – Flächen: flaches, leicht nach hinten fallendes Dach; vorn große schräge Stirnfacette (~45°), seitlich steile Flanken; von vorn Schildform. Kanten: harte Kante Dach/Stirnfacette mit kleinem Radius, Krempe mit scharfer Unterkante. Übergänge: Stirnfacette läuft vorn direkt in die Maske, hinten hochgezogener dunkler „Hut“ über der weißen Schale.
**Maske** – Flächen: Ebenen statt Rundung – Mittelgrat, Wangen- und Schläfenfacetten; Nasenmodul eine Stufe vorgesetzt. Kanten: Knickkanten zwischen den Facetten, Plattenränder gefast; Augenschlitze trapezförmig, außen höher. Übergänge: dunkle Seitenflächen laufen diagonal bis knapp vor die Pods unter die weiße Schale; Fugen 0,006 zwischen den Platten.
**Schale** – Flächen: fast ebene Seiten, runder Hinterkopf, unten abgesetzter Kragen. Kanten: Kragenstufe scharf, Panel-Nuten, Fenster. Übergänge: weiße Kragenblenden mit gestufter Oberkante, Rückbox sitzt auf der Hinterseite.
**Kinnleiste** – Flächen: breites weißes Kieferband, vorn deutlich vorspringend, Unterseite schräg. Kanten: gefaste Ecken, Lippe unten. Übergänge: läuft seitlich als Steg nach hinten, eingesetztes Kinnpanel mit drei Schlitzen.
**Pod** – Flächen: ovale gewölbte Kapsel, flache Halteplatte. Kanten: weicher Rand (Subdivision), Taste und Dreiecksmulde. Übergänge: Gabel vom Kopfgurt, Drahtbügel, Stecker unten-vorn mit Spiralkabel.
**Rückbox** – Flächen: flacher Kasten, Achteckplatte mit Vertiefung und Hebel. Kanten: Bevel 0,006, Fasen 45°. Übergänge: seitliche Anschlüsse, Kabel steigen von unten-seitlich zu.

## Messprotokoll Lauf 2
2026-10-28T14:30:21+01:00 | L2 Setup | 1 | leere Szene, Referenzen kalibriert {'front': {'top': 110, 'u0': 482.2}, 'right': {'top': 109, 'u0': 495.1}, 'back': {'top': 108, 'u0': 470.0}, 'left': {'top': 108, 'u0': 478.8}}, Meshy-Vorlage als Geist (Drahtgitter), Kameras
- Meshy v2 (Nutzer, 2 Mio. Flächen) ausgemessen per Raycast: Vorlage liegt +0,155 H zu weit vorn (korrigiert). Mittelprofil nach Korrektur: Front Augenhöhe y −0,48 (Z 0,55–0,62), darüber Stirn kippt zurück (Z 0,70 → −0,42; Z 0,80 → −0,33), Dach-Facette bis Z ≈ 1,0 bei y ≈ +0,05; untere Maske weicht zurück (Z 0,30 → −0,39; Z 0,20 → −0,36); vorn keine umlaufende Krempe. Breite bei y −0,25: x ≈ 0,32–0,33. Folge: zwei Stirnfacetten P1 (Z 0,62→0,78) und P2 (Z 0,78→0,95) mit Knickkante, Krempe nur seitlich/hinten.
2026-10-28T14:35:04+01:00 | L2 A Blocking 1 | 6 | Vorlage v2 als Drahtgitter-Geist; Schale+Kragen als Zylinder
2026-10-28T14:38:55+01:00 | L2 A Blocking-Abnahme | 15 | IoU (Dach bis Kragen) {'front': 0.879, 'right': 0.851, 'back': 0.809, 'left': 0.884}; Kuppel: Superellipsoid a .35, Scheitel y +.10, Rücken fällt ab; Stirnfacetten P1/P2 aus Meshy-Profil
2026-10-28T14:42:51+01:00 | L2 B Sekundärformen | 32 | Schale (unter Stirn zurückgeschnitten), Kuppel dicht + Facetten P1/P2, Krempe mit Stirnband, Maske auf Facettenhülle, Augen, Seitenplatten, Kinnleiste mit Vorsprung + Panel, Pods, Platten, Rückbox, Hals. IoU {'front': 0.874, 'right': 0.852, 'back': 0.814, 'left': 0.891}. Fix: Krempen-Front an P1 abschneiden statt hinziehen; Kuppelbasis auf Krempenoberkante
2026-10-28T14:45:13+01:00 | L2 C Mechanik | 40 | Laschen (Raycast auf Kuppel), Sockel, Antenne_R, Bügel+Füße, Stecker, Anschlüsse, Kabel L/R (Abstand Schale ≥ 0,030, Pod ≥ 0,061, Box ≥ 0,040), Gelenkscheiben/Halter per Raycast, Kopfgurt+Schnalle+Halter, Halterarme
2026-10-28T14:45:15+01:00 | L2 D Tertiärdetails | 44 | Nuten/Fenster Schale, Wangen-/Nasendetails per Raycast, Pod-Taste+Dreieck, Rückboxplatte+Hebel+Trapez, Griffpanels, Wartungsklappen, Kragenblenden, 26 Schrauben (Raycast)
2026-10-28T14:48:04+01:00 | L2 E Mikrodetails | 52 | Krempen-Naht, Kennungen. Fix: Wangenplatten verschwanden durch Boolean (EXACT ohne Self) – use_self=True als Standard; Schneidekörper je Insel volumenorientiert; Schrauben neu (26)
2026-10-28T14:48:06+01:00 | L2 Materialien + Umgebung + Licht | 53 | PBR prozedural, Abrieb nach Bevel (Flächendomäne), kein AO-Staub; Hohlkehle mit Vignette; Key vorn-oben-links, Fill hinten; EEVEE Raytracing, Fast GI aus
2026-10-28T14:48:42+01:00 | L2 Turntable + Endabnahme Silhouette | 54 | Turntable {'speed_deg_per_frame': 1.5}; IoU final {'front': 0.866, 'right': 0.845, 'back': 0.803, 'left': 0.883}
2026-10-28T14:49:28+01:00 | L2 Cycles-Standbild | 57 | helm_lauf2_cycles.png, 1080², 96 Samples, Blende 5.6, 12,8 s
2026-10-28T14:50:08+01:00 | L2 Abschluss | 58 | Turntable abgespielt bis Frame 336; Hüllbox ohne Anbauteile [0.82, 1.122, 1.0]; fehlend []; ohne Root []; gespeichert

## Ergebnis Lauf 2 (Kurzfassung)
| Kriterium | Lauf 1 | Lauf 2 |
|---|---|---|
| Silhouetten-IoU (Dach bis Kragen) vorn / rechts / hinten / links | nicht gemessen | 0,866 / 0,845 / 0,803 / 0,883 |
| Formzüge Referenz | erst nach Nutzerhinweis | von Anfang an: Stirnfacetten P1/P2 aus Meshy-Profil, schmale Kuppel mit Krempenabsatz, facettierte Maske, diagonale Seitenplatten, Kinnvorsprung, Kopfgurt+Gabel, Kragenblenden |
| MCP-Aufrufe (execute) | ≈ 175 | 58 (Baubibliothek helm_build*.py) |
| Hüllbox ohne Anbauteile X/Y/Z | 1,01 / 1,12 / 1,008 | 0,82 / 1,12 / 1,00 |
| Hilfsobjekte am Root | erst nachträglich | von Anfang an (geprüft: keine ohne Root) |
| Cycles-Standbild | – | helm_lauf2_cycles.png (12,8 s) |

Neue Fehler in Lauf 2 (behoben): Krempen-Front hingezogen statt abgeschnitten; Kuppellippe vor dem Stirnband; Wangenplatten durch EXACT-Boolean ohne Self-Modus komplett gelöscht (→ use_self Standard, Schneidekörper je Insel orientiert); Referenzmaske zuerst durch Studio-Vignette verfälscht (→ Hintergrund-Fit).
Offen: weiße Schale von vorn nur als schmaler Streifen sichtbar (Referenz zeigt mehr Weiß neben der Maske); Stirnband wirkt von vorn als eigener Balken; Tiefe 1,12 > Bauplan 1,06 (Kinnvorsprung, gewollt).

## Lauf 2b (Neuaufbau: Gesichtskeil, Pods hinten, Maskenschild aus einem Guss)
2026-10-28T15:00:42+01:00 | L2b Setup | 1 | neue Szene, Referenzen kalibriert, Meshy v2 (verschoben +0,155)
2026-10-28T15:01:01+01:00 | L2b A Blocking | 2 | Blocking mit Pods bei y +0,10
2026-10-28T15:02:45+01:00 | L2b B Sekundärformen | 14 | Gesichtskeil aus Meshy-Draufsicht, Maskenschild aus einem Guss + Fugen, Nase aufgesetzt, Kuppel auf Keil geklemmt, Krempe nur seitlich/hinten, Pods y +0,10. Fix: Schale explodierte (Solidify even offset + Klemmbereich) → clamp. IoU {'front': 0.852, 'right': 0.869, 'back': 0.784, 'left': 0.873}
2026-10-28T15:03:03+01:00 | L2b C Mechanik | 17 | Laschen, Sockel, Antenne, Bügel, Stecker, Kabel (Schale ≥0,030, Pod ≥0,061, Box ≥0,040, Schild ≥0,115), Gelenke/Halter auf Schild, Kopfgurt, Halterarme
2026-10-28T15:03:12+01:00 | L2b D Tertiärdetails | 19 | Nuten, Schild-/Nasendetails, Pod-Details, Rückboxplatte, Griffpanels/Klappen/Kragenblenden hinter die Pods verlegt, 26 Schrauben; leere Objekte nach Booleans: []
2026-10-28T15:04:27+01:00 | L2b E + Haube | 22 | Krempen-Naht (offener Bogen), Kennungen; Nutzerwunsch Haube glatter: Kuppel neu als eine Fläche, Front per smooth-max in den Gesichtskeil (k 0,07), Subdivision 1, keine harten Schnitte
2026-10-28T15:05:52+01:00 | L2b Abnahme | 25 | IoU {'front': 0.872, 'right': 0.865, 'back': 0.785, 'left': 0.888}; Turntable {'speed_deg_per_frame': 1.5}; Cycles {'sekunden': 11.8, 'datei': '/Users/ffunk/trialanderror/helm_lauf2b_cycles.png'}
2026-10-28T15:07:22+01:00 | L2b Cycles + Turntable | 28 | helm_lauf2b_cycles.png (vorn), helm_lauf2b_cycles_seite.png (−60°); Abrieb von Schild/Nase/Schale/Kinn entfernt (graue Flecken); Turntable abgespielt

## Ergebnis Lauf 2b
| Kriterium | Lauf 2 | Lauf 2b |
|---|---|---|
| IoU vorn / rechts / hinten / links | 0,866 / 0,845 / 0,803 / 0,883 | 0,872 / 0,865 / 0,785 / 0,888 |
| Gesicht | vier Platten + Seitenplatten | ein Schild aus einem Guss (Loft über Gesichtskeil aus Meshy-Draufsicht), Fugen eingeschnitten, Nase aufgesetzt |
| Haube | Facetten per Bisect, harte Kante | eine glatte Fläche, Front per smooth-max (k 0,07) in den Keil, Subdivision 1 |
| Pods | y −0,04 | y +0,10 (wie Referenz/Meshy), Anbauteile mitgeführt |
| Krempe | umlaufend inkl. Stirnband | nur Seiten/Rücken |
| MCP-Aufrufe | 58 | ≈ 40 |
Fehler 2b (behoben): Schale explodierte auf 30 H (Klemmung an F auch hinten + Solidify even offset) → Klemmbereich und thickness_clamp; Krempen-Naht-Index nach Umbau auf offenen Bogen; graue Flecken durch Kantenabrieb an Fugen → Abrieb nur noch an Anbauteilen.
Offen: Hinterkopf-IoU 0,785 (Rückbox/Hut); hinterer „Hut“ der Krempe wirkt als Block; Stufe zwischen Schild-Oberkante und Haube.
2026-10-28T15:10:48+01:00 | L2c Stirnlinie | 33 | Mittellinie Kinn–Stirn–Scheitel als eine Hermite-Kurve durch Meshy-Messpunkte; Grat läuft weich aus (0,56→0,82); Abweichung zur Vorlage Z 0,44–0,92 ≤ 0,007 H; vorher Bauch +0,03 und Knick bei 0,60–0,64
2026-10-28T15:16:05+01:00 | L2c Vorlage | 41 | Shrinkwrap auf Meshy getestet und verworfen (Beulen, Z-Fighting Haube/Schild); stattdessen Kuppelparameter per Koordinatensuche an Vorlage gefittet (Median+0,5·P80: 0,0159 → 0,0097 H); Details neu gesetzt. IoU {'front': 0.88, 'right': 0.884, 'back': 0.786, 'left': 0.897}; Cycles {'front': 9.1, 'seite': 8.7, 'profil': 8.9}

## Ergebnis Lauf 2c (Stirnlinie, Vorlage)
| Kriterium | 2b | 2c |
|---|---|---|
| IoU vorn / rechts / hinten / links | 0,872 / 0,865 / 0,785 / 0,888 | 0,880 / 0,884 / 0,786 / 0,897 |
| Mittellinie Kinn–Stirn–Scheitel vs. Meshy | Bauch +0,03 (Z 0,40–0,60), Knick 0,60–0,64 | eine Hermite-Kurve, Abweichung Z 0,44–0,92 ≤ 0,007 H |
| Kuppel vs. Meshy (Median + 0,5·P80) | 0,0159 H | 0,0097 H (Parameterfit) |
| Haube/Schild-Abstand zur Vorlage (Median) | ≈ 0,010 H | Haube ≈ 0,002–0,010 H, Schild ≈ 0,001–0,010 H |
Verworfen: direkter Shrinkwrap auf Meshy (Beulen aus Gurt/Laschen/Rauschen, Z-Fighting Haube/Schild, verzerrte Augeneinlagen) – Vorlage dient als Maß, Fläche bleibt parametrisch.
Offen: Hinterkopf (IoU 0,786; Rückbox/Hut), Kinnleiste liegt 0,07 H vor der Vorlage (bewusst nach Referenzbild), Schalenseiten 0,02 H.
2026-10-28T15:55:13+01:00 | L2d Linie + Augenhöhlen | 50 | Kopfhörer/Kabel/Antenne in AUSGEBAUT (ausgeblendet); Haube bis Brauenlinie 0,648, Unterkante als glatte Kurve (spaltenweise), polynomiales smooth-max k 0,05, Kuppel neu gefittet; Profil 20–60° ±0,001 H zur Vorlage; Augenhöhlen 0,026 tief mit Schrägwand; IoU {'front': 0.837, 'right': 0.892, 'back': 0.811, 'left': 0.884}

## Ergebnis Lauf 2d (eine Linie, Augenhöhlen, ohne Kopfhörer)
- Kopfhörer, Bügel, Stecker, Halterarme, Kabel, Hülsen, Anschlüsse, Antenne, Sockel und Fußschrauben in Sammlung AUSGEBAUT (ausgeschlossen, nicht gelöscht).
- Haube reicht vorn bis zur Brauenlinie Z 0,648; Unterkante als glatte Kurve (Kuppel spaltenweise auf die Kante parametrisiert, keine Treppen); Schild endet an der Braue.
- Ursache der Delle an der Braue: weiches Maximum (sqrt-Variante) drückt um bis zu k/2 nach hinten → polynomiales smooth-max (wirkt nur an der Schnittlinie), Kuppel inkl. Brauenzone neu gefittet (0,013 → 0,0122).
- Profil auf Bogen Kinn→Scheitel: 20–60° Abweichung zur Vorlage ≤ 0,001 H (vorher Delle 0,016 H bei 25°).
- Augenhöhlen: Schrägwand 0,016 breit, 0,026 tief, Leuchteinlage am Boden; Schild per Frustum-Boolean ausgeschnitten.
- IoU vorn / rechts / hinten / links: 0,837 / 0,892 / 0,811 / 0,884 (vorn niedriger, weil die Kopfhörer der Referenz fehlen).
2026-10-28T16:05:11+01:00 | L2e Guss + Hinterkopf + Kinn | 57 | Haube und Gesichtsschild als EINE Fläche (Kappe, Unterkante folgt Schild-Hinterkante); Augenhöhlen/Fugen/Wangendetails in Kappe; Gurt/Laschen ausgebaut; Krempe ohne Hut (Off 0,01); Rückbox −0,015; Kinnleiste aus Meshy-Kontur (Front −0,342, Breite 0,595), Panel 0,16; 26 Schrauben; IoU {'front': 0.836, 'right': 0.895, 'back': 0.81, 'left': 0.883}
2026-10-28T16:25:05+01:00 | L2e Nachbau | 0 | helm_bauen.py aus leerer Datei: IoU identisch 0,836/0,895/0,810/0,883, sichtbare Teile identisch; Skripte als Textblöcke in der .blend
2026-10-28T16:29:23+01:00 | L2f Kinnleiste | 0 | Kinnleiste als geschlossenes schräges Band: vorn Z 0,06–0,20, Stufe am Kiefer (y −0,14), hinten Z 0,16–0,29 auf dem Kragen; Kragenblenden entfallen; Maskenhalter ausgebaut; IoU {'front': 0.836, 'right': 0.895, 'back': 0.81, 'left': 0.883}

## Lauf 2e/2f (ein Guss, Hinterkopf, Kinnleiste, Reproduzierbarkeit)
- Haube + Gesichtsschild als EIN Objekt `Kappe`: Kuppel läuft vorn als dieselbe Fläche bis zum Kinn, Unterkante folgt der Schild-Hinterkante (spaltenweise parametrisiert) – keine Querfuge mehr an der Braue.
- Ausgebaut zusätzlich: Kopfgurt, Schnalle, Gurthalter, Laschen, Maskenhalter-Würfel.
- Hinterkopf: Krempe ohne hochgezogenen Hut (Vorlage hat dort nur die Kuppel: Z 0,80 Vorlage y 0,489, vorher 0,55); Rückbox −0,015.
- Kinnleiste 2e: Meshy-Kinnkontur (vorn −0,342). 2f: geschlossenes schräges Band (vorn Z 0,06–0,20, Stufe am Kiefer, hinten 0,16–0,29), Verlauf aus Seitenreferenz (Meshy unten vom Tuch verdeckt).
- Reproduzierbar: `helm_bauen.py` baut aus leerer Datei; Nachbau = Arbeitsstand (IoU 0,836/0,895/0,810/0,883 identisch, 51 sichtbare Teile identisch, 119 s). Stil: `STIL_SCOUT_V3.md`.
- Befund: Cycles nach Neuladen ≈ 4 min/Bild statt 9 s (Metal-Kernel neu kompiliert).

## Lauf 2g (Kinnband trägt den Schirm, weicher Übergang schwarz→weiß)
- Nutzerhinweis + Frontreferenz: Kinnband U-förmig (vorn tief Z 0,02–0,14, Kieferecke 0,28, Seite 0,41), 0,06 vorstehend; Schirm-Unterkante folgt dem Band.
- Seitlich/hinten läuft die schwarze Kante auf 0,08 Höhe auf die Schale aus (Vertices radial auf Schale+0,004 geblendet).
- Fix: Band zackte an der Kragenstufe → senkrechte Spalten + rundum geglätteter Abstand.

## Lauf 2h (massiver Kinnrand nach Codex-Beschreibung, Falte behoben)
- Kinnrand mit echtem Querschnitt, Oberkontur flaches V (Mittelstück Z 0,14, Flanken bis 0,37), vorn 0,075 vorgezogen, hinten breiter 0,15; Trapez-Einsatz mittig.
- Falte an der Kieferecke: Ursache 1 Sprung der Guss-Unterkante (0,07) → stetige Überblendung; Ursache 2 radiales Heranziehen an die Schale → nur hinter der Schläfe, Diagonale stattdessen gerundet (Bevel 0,007).

## Lauf 3 (Überarbeitung nach Mehransichten-Rückmeldung)
- Proportionen: Kragenstufe entfernt, weiße Seitenschale bis zur Basis; Kinnrand vorn flaches V, seitlich niedrige Basis; Rand näher an der Maske (0,04).
- Gesicht: Augen kleiner/tiefer (x 0,10–0,245, Z 0,505–0,578); Fugen trapezförmig statt horizontal; Mittelstück schmal + zweite Stufe; runde Scheiben → kantige Schläfenpanzer; Lüftungsgitter entfernt, Trapez-Einsatz.
- Neu: Ohrmodule (grau, Kapsel), Antenne links + Stummel rechts, Rückmodul vergrößert mit Antenne, Spiralschlauch Modul → Rückmodul.
- Material: Dunkel matt (Rauheit 0,74, Specular 0,32), Weiß mit großflächiger Verschmutzung.
- Fehler unterwegs: seitliche „Laschen“ (Überstand-Glättung), Nasenmodul hinter dem Guss (falsches Projektionsziel), Stirnschrauben durch Augenöffnung geschossen; alle behoben.
- Nachbau aus leerer Datei: 164 s, IoU 0,859 / 0,872 / 0,764 / 0,881 (hinten niedriger: Rückmodul/Antenne fehlen in der Referenz-Silhouettenmaske nicht, Kopfform hinten noch prüfen).

## Lauf 3b (Silhouette)
- Rückreferenz vermessen: dunkle Kappe hinten bis Z 0,76 (passte bereits), weiße Schale oben 0,68 H breit, unten 0,82 H → Schale jetzt konisch (a 0,395 unten → 0,348 oben), kein Kragen; Unterkante vorn 0,04 → hinten 0,16; Basisband hinten 0,018 ausgestellt.
- Altlasten entfernt: umlaufende Kragennut, Griffpanels.
- IoU 0,857 / 0,869 / 0,763 / 0,879 – hinten durch unscharfe Referenzmaske (helle Rückwand) und Schläuche begrenzt, Umriss deckt sich.
- Offen: Basisband seitlich hinten hängt als Lappen unter die Schale (sichtbar in der Rückansicht).

## Kritiker-Schleife (Arbeitsweise cubeescape-critic)
- D1 (Lauf 3b): IoU 0,842; Kritik R1: Kuppel zu hoch (large), Schale zu glatt/hoch (large), Kragen zu breit (large), Maske/Augen, Module/Rückmodul zu groß.
- D2 (R1 umgesetzt): IoU 0,856; Kritik R2: Maske zu breit/rechteckig, Schale zu hoch ohne Kinnvorsprung, Kuppel zu dick, Module, Keilsteg, Rückmodul, Augen, Material fleckig.
- D3 (R2 umgesetzt): IoU 0,859; Regression: seitliche Lappen an Schale/Kinnrand durch Gesichtsverjüngung (Teile an Keilfunktion gekoppelt).
- Befund: critic baut ein Kopfvolumen aus drei Profilen und schneidet alle Teile daraus → Übergabe Lauf 4 (UEBERGABE_LAUF4.md).

## Lauf 4 (Formkonstruktion nach critic)
- Kopfvolumen allein: IoU vorn 0,885 / Seite 0,884 – schon besser als das ganze Lauf-3-Modell.
- D4 (critic-Teile, Kuppel rund): IoU 0,906 / 0,863 / 0,815 / 0,870. Fehler: Haube/Augen ohne Material (Namenskollision `.001`) – behoben.
- Kritik R4: Haube zu rund/hoch (large), Seitenaufteilung (large), Augen zu groß, Kiefer massig, Ohrmodule zu klein, Maske ohne Panels, Rückseite, Material.
- D5 (Kuppelrundung aus, Augen kleiner, Kiefer schlanker, Ohrmodule nach critic earR): IoU 0,908 / 0,849 / 0,809 / 0,859.

## Lauf 4b (Kritik R5–R8, Durchläufe 06–09)
- D6 (R5 Punkte 1–3): Haube keilförmig (flache, nach hinten fallende Oberseite, Stirnfase, senkrechte Rückwand), Kappenkante 0,28 getrennt von der Braue 0,33, Kern/Kragen schlanker mit Stufe, Maske seitlich bis zum Kinnbalken (Kiefer-Keil entfernt), Wangenmodul, Augen-Seitenfenster. IoU 0,901 / 0,848 / 0,795 / 0,858. Kritik R6: keine „large“ mehr; Dach zu hoch, Augen zu groß, Schale zylindrisch, Kinn, Panels, Rückmodul (medium).
- D7 (R6): Dach flacher (Profile oben abgesenkt), Augen 0,14 / Neigung 8°, Kern oben verjüngt. IoU 0,897 / 0,841 / 0,787 / 0,850. Kritik R7: weiße Rückpartie zu klobig (large) – bestätigt: weißer Halsring wirkt als zweiter Sockel; „Dach hinten zu lang“ nicht bestätigt (Tiefe gleich).
- D8 (R7): Halsring dunkel, Kragen unten verjüngt, Augen 0,12 näher zur Mitte. IoU 0,895 / 0,837 / 0,786 / 0,847. Kritik R8 widerspricht R5/R7 (Weiß soll höher) – verworfen; bestätigt: Maske seitlich zu weit hinten, Kragen hinten zu hoch, Kinn „Schnabel“ (wiederkehrend, R5-Punkt 4).
- D9 (Messkorrektur ohne Kritikrunde, Kontingent 5/5 verbraucht): Maskenhinterkante z 0,03, Kragen unten −0,25, Wangenmodul z 0,07. IoU 0,896 / 0,836 / 0,786 / 0,847.
- IoU liegt etwas unter D5 (0,908/0,849/0,809/0,859): flachere Haube und schlankeres Weiß weichen vom unscharfen Referenzumriss (Gurt, Tuch, Antennen) ab; Kritik bewertet die Form besser (keine „large“ zu R5-Punkten 1–3 in R6).
- Nachbau: leere Datei → `bauen_lauf4()` 163 s, identisch mit D9 (IoU, 39 sichtbare Teile, 7399 Punkte). Fix unterwegs: `studio()` legte in einer Datei ohne Welt-Knoten keinen Background-Knoten an.
- Gespeichert: `helm_live_test.blend`, Sicherung `helm_live_test_5.blend`. Ansichten: `helm_lauf4b_{front,seite,dreiviertel,hinten}.png`.
- Offen (R5-Punkte 4–5, wiederkehrend): Kinnbalken kragt als „Schnabel“ vor, Kiefer mehrteilig; Ohrmodule eckiger mit Bügel; Rückmodul rechteckig (critic `rightComms.js`); Panels/Fugen/Schrauben an der Maske; Material.

## Lauf 5 (Kritik R9–R13, Durchläufe 10–14)
- D10: Augenfenster um die Ecke, Kinnbalken zurück (z 0,41), Ohrmodule weiter hinten/eckiger/Bügel, Rückmodul rechteckig nach critic backBox. IoU 0,893 / 0,864 / 0,798 / 0,862. R9: Kuppel vorn oben zu breit (bestätigt: 0,3 statt 0,2 H halb), Augen zu weit außen, Steg im Fenster.
- D11: Frontprofil oben zurück zur critic-Form, Augen x 0,135, Haubenüberstand kleiner. IoU 0,896 / 0,864 / 0,800 / 0,862. R10: „mehr Weiß hinten“ (wie R8, gegen R5/R7, Messung ohne Befund – verworfen).
- Nutzerhinweis Augen: Referenz vergrößert verglichen – Seitenfenster war Fehldeutung (Seitenreferenz ≈ 65–70° gedreht); Augen in tiefe Sockel mit breitem Rahmen.
- D12: dazu Wangenplatten mit V-Fuge, Maskenfuge, 10 Schrauben, Ohr z −0,19. IoU 0,897 / 0,865 / 0,803 / 0,861. R11: Stirn soll Keilschräge sein – bestätigt (Profil bei z 0,3 um 0,11 H zu hoch).
- D13: Stirn als gerade Schräge, Kinnbalken unten kürzer; Augen nach Nutzervorgabe weiter außen in der Schläfenrundung, breiter, flacher (x 0,19, 0,165 × 0,046, Gieren 30°). IoU 0,895 / 0,865 / 0,801 / 0,863. R12: Front zu senkrecht (3× large) – bestätigt (≈ 6°).
- D14: Frontfacetten 6° zurückgeneigt. IoU 0,895 / 0,866 / 0,801 / 0,864. R13 (letzte Runde): widersprüchlich zu R11/R12 (Kuppel „zu flach“, Kinn „zu weit vorn“); Augenabstand ist Nutzervorgabe. Offen: Kragen/Halsschale (wiederkehrend, Richtung schwankt), einseitiges Headset, Mikrofonarm, Antennen symmetrisch.
- Nachbau leere Datei → `bauen_lauf4()` 133 s, IoU identisch mit D14. Gespeichert `helm_live_test.blend` + Sicherung `helm_live_test_6.blend`. Ansichten `helm_lauf5_{front,seite,dreiviertel,hinten}.png`.

## Lauf 6 (Nutzer: Haube/Augen/Mund wie Lauf 2h, Vertiefung + Kinnleiste wie Lauf 5; D15–D19, Kritik R14–R16)
- 2h-Stand aus den Textblöcken von `helm_live_test_2h.blend` rekonstruiert: Unterschiede nur Parameter (Kuppel ex 2,0/eyb 1,7, Standard-Augen) und Schrittfolge (schild_fugen, maske_vertiefungen, gelenk_halter, 2h-Nase). `bauen_lauf6()` baut reinen 2h-Stand (247 s, IoU 0,877/0,887/0,797/0,885).
- Hybrid `bauen_lauf6b()`: Lauf-5-Aufbau + `guss_2h.npz`. Fehler unterwegs: Boolean auf offener 2h-Hülle (Müllkörper) → bisect; weißes Dreieck an der Schläfe = Kern stößt durch die schmalere Haube → Kern vorn schräg zurück.
- D15: Fuge Z 0,47, Lauf-5-Maske unten auf 2h-Kontur verformt (Δy bis 0,32, Breite ×0,91). R14: Stufen am Ohr, graue Keile, Kabel.
- Nutzer: Mundstruktur von Lauf 2 + Mittelvertiefung Lauf 5 → ganze 2h-Gesichtsplatte, Trapez-Wanne per bisect (D16). R15: Kinn schwebt, Spalt Haube–Schale.
- D17 (Kinnleiste 0,17 hoch, Band geschnitten) vom Nutzer verworfen → zurück auf D16. Nutzer-Hinweis richtig: das dunkle „Zylinder“-Band war der Halsring → entfernt (D18, IoU = D16: 0,860/0,865/0,819/0,854).
- D19: Kinnleiste starr 0,055 angehoben, Spalt zur Gesichtsplatte zu. IoU 0,863/0,865/0,820/0,854.
- Explosionsansicht mit Kennungen S01–S13 (`helm_explosion.py`, `HELM_TEILE_SCOUT.md`) für gemeinsame Begriffe.
- Gespeichert `helm_live_test.blend` (D19), Sicherung `helm_live_test_7.blend` (D18).
- D20 (Nutzer): Kinnleiste 0,055 nach hinten – vorn bündig mit der schwarzen Front.
- D21 (Nutzer-Markierung blau): Spalt Haubenrand–Ohr zu; Kern vorn schräg (unten z 0,10, Schläfe 0,08), oben schlanker; keine Durchstoßstellen.
- D22 (Nutzer): Vorderecke Gesichtsplatte unten und Vorderecke Kinnleiste oben deckungsgleich (gemessen Z 0,212 / y −0,320; lift 0,064, zurück 0,05). Fehler gefunden: Wannenrand der Mundvertiefung wurde nach dem Ausschneiden vermessen (Ersatzwert y −0,40 → dunkle Nase); dazu stand ein Zipfel der 2h-Gesichtsplatte unter der Wanne vor – beides behoben. IoU 0,856/0,863/0,820/0,854.
- Ein Versuch, das Kieferstück S07 oben schräg zu schneiden, wurde ohne Nutzerauftrag gemacht und wieder verworfen.
- D23 (Nutzer-Markierung): Trapezkerbe oben im Kinnblock (critic) entfernt – sie lag nach dem Anheben genau unter der Mundvertiefung und wirkte als dunkler Keil mit Stufe. Endstand Lauf 6 = D23.
- D24 (Nutzer: „sieht sehr gut aus“): neue Kerbe im Kinnblock als Fortsetzung der Mundvertiefung (Flanken aus `mouth.outline` auf Höhe der Leiste +0,004, Boden 0,04 unter der Oberkante, Tiefe = Wannenboden), Wanne bis Z 0,175. Zwei Folgeversuche (Kerbe tiefer / Kerbenflächen dunkel per Zweitmaterial – Boolean setzt den Index ohne Slots zurück) verworfen, Code entfernt. Endstand Lauf 6 = D24.
- D25 (Nutzer-Markierung): Lücke zwischen Gesichtsplatte (S01) und Kieferstück (S07) in der Seitenansicht geschlossen – S07-Vorderkante entlang der vermessenen Hinterkante der Gesichtsplatte (+0,025 Überlappung). IoU unverändert 0,856/0,863/0,820/0,854.
- D26 (Nutzer: „Seitenteile einfach hochziehen“): Kieferstücke S07 bis Z 0,74 an die Haubenkante gezogen, Vorderkante entlang Haubenkante und Gesichtsplatte. Vorher verworfen: Kern verbreitern (rx 0,355) – schloss die Lücke, stieß aber oben an der Schläfe durch die Haube; Kern-Vorderkante als Kurve – wieder Spalt. Kern = D25.
- D27 (Nutzer-Markierungen oben/unten an S07): Oberkante knapp unter die Krempe (Z 0,765 ragte als Lasche über die Krempe, 0,755 ebenso – Platte ist 0,007 breiter als die Krempe); hintere Unterkante tiefer gezogen ergab einen hängenden Klotz → verworfen, stattdessen Kragen vorn bis unter die Platte. Rest: kleine helle Stufe Kragen/Platte.
- D28 (Markierbogen, Marker 1–6): M1/M2 Haube–Krempe–Seitenplatte verbunden (Platte vorn tiefer unter den Haubenrand, Krempe vorn gekürzt), M3/M5 Kragen schmaler (rx 0,36) statt Vorstand/Block, M4 Seitenplatte unten ohne Absatz und ohne Nuten, M6 Augenrahmen hart schattiert (nur am Rand, sonst sichtbarer Rahmen). Zwei Zwischenversuche verworfen (Platte oben schmaler, Kragen zurückschneiden).
- D29 (Markierungsseite D28, Marker 1 „immer noch ein Loch“): Ursache gemessen – Dreieck y 0,045–0,07 / Z 0,728–0,75 zwischen Plattenoberkante, Haubenrand und Krempenende, Blick auf den Kern. Platte vor dem Krempenende bis an die Haubenkante hochgezogen. Lehre: Lücken per Seitenstrahl vermessen (welches Teil liegt direkt unter der Haubenkante), nicht nach dem Bild schätzen.
