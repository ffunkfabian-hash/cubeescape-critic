# Changelog

## 0.19.0 „Whetstone“ – 2026-10-30 (Generator: Normalen Länge 1, Aufbau schneller, Formtests statt Blender-Gleichheit)

- Normalen: Nullnormalen an entarteten Dreiecken (Körper: Maske, Schienbeinschalen, Schulterpanzer; Scout: 12 022 flächenlose
  Guss-Flächen der Haube) nehmen das Mittel der Nachbarflächen; alle |n| = 1 ± 5·10⁻⁸, Live-Aufbau = Export bis in die Normalen
  (Test). Alle vier Pakete neu exportiert, Atlanten neu gebacken.
- Aufbau in Node 2–3-mal schneller, bytegleich: Zahlen-Hashes statt Text-Schlüssel (`mesh.js`), Blockboxen im BSP-Baum (`bsp.js`),
  Schattierung ohne Zwischenarrays (`scoutMesh.js`); `robotgen_speed.test.mjs` vergleicht mit den 0.18-Fassungen,
  `robotgen_bench.mjs` meldet Median, Spanne und Last.
- Tests gegen das eigene Paket (`robotgen_form.test.mjs`: Teileliste, Segmente, Boxen, Öffnungen, Normalen, Determinismus) statt
  gegen die Blender-Referenz; deren Abstand zeigt der Bericht `robotgen_reference.mjs` (`--iou` mit Umriss-IoU).

## 0.18.0 „Prefab“ – 2026-10-30 (Generator als Export-Programm, Blender nur noch Cycles-Render)

- `web/tools/robotgen_export.mjs` baut Wächter, Paladin, Mechanik und Scout mit dem three.js-Generator vorab und schreibt Lieferpakete
  im bisherigen Format (`assets/robot-bodies-three/`, `assets/helmet-scout-three/`: GLB, `parts.json`, `manifest.json` mit Eingaben-Hash
  und Digest je Mesh); der Viewer lädt sie standardmäßig (`&gen=three` live, `&gen=blender` eingefrorene Referenz). Test
  `robotgen_export.test.mjs`: Eingaben, Manifest und frischer Export bytegleich (auf anderer Plattform Meshes und Boxen).
- Ein Skin-Atlas je Modell, gebacken aus den exportierten GLBs (passt auch zum Live-Aufbau); `atlasName` und `--gen` entfallen.
- Blender-Generatoren nach `archive/blender/`; Generator-Eingaben (`guss_2h.npz`, `helm_params.json`, `SOURCE.json`) in
  `web/src/robotgen/data/`; optionaler Cycles-Render aus exportierten GLBs `blender/cycles_render.py`.

## 0.17.0 „Outrider“ – 2026-10-30 (Scout im three.js-Generator, Ladezeit der Masken-Schnitte, Schultern als Baugruppe)

- Scout entsteht ohne Blender in `web/src/robotgen/scout.js` (`?model=scout&gen=three`, auch als Helm; Navigation „Quelle“): Guss aus
  `guss_2h.npz`, Unterhelm per BSP-Booleans (`bsp.js`), Anbauten; 44/44 Meshes, Box je Objekt ≤ 0,09 mm, IoU 0,9990–0,9997;
  eigener Skin-Atlas `scout-three`.
- Masken-Schnitte: geprüfte Schneider-Stufentabelle `cutStages.json` statt Suche bei jedem Laden (Node: Paladin 9,6 → 4,5 s, Mechanik 12,0 → 4,0 s); Mess-Werkzeug
  `robotgen_bench.mjs`.
- Schultern sind im Viewer eine eigene Baugruppe (Explosion, Etiketten, Bauteilbaum); `skin_swatches.py --decals` für Motivbögen auf
  Schwarz, SciPy in `web/requirements.txt`. 124 Node-Tests.

## 0.16.0 „Swatch“ – 2026-10-30 (Skins Bronze und Schrott aus Nutzerbildern, Prompts für Nano Banana Pro)

- Neue Skins Bronze und Schrott: Material je Rolle und leuchtende Linienmotive aus den generierten Bildern des Nutzers
  (`web/tools/skin_swatches.py`), aufgelegt im Modellraum über die neuen Mischer-Schichten `tex` und `decal`; Helme mit eigenem Platz (`kinds`).
- Vorlagenkarten je Atlas (`web/tools/skin_guide.py`) und Prompts für Nano Banana Pro in `docs/SKINS.md`.
- Glut/Ornat: Brustsonne um das Medaillon zentriert (Emblem-Anker). 106 Node-Tests.

## 0.15.0 „Anvil“ – 2026-10-30 (Paladin und Mechanik als three.js-Generator, Skin-Atlas aus dem Generator)

- Paladin und Mechanik entstehen ohne Blender in `web/src/robotgen/` (`?model=paladin|mechanik&gen=three`); gemessen gegen die GLBs:
  Teilelisten identisch, Boxen je Objekt ≤ 0,87 mm, Umriss-IoU 0,9985–0,9994 in vier Ansichten.
- CSG-Splitter an der Maske: Schnitt mit minimal größeren Schneidern wiederholen, bis das Mesh geschlossen ist; Meshes indiziert wie im GLB.
- Eigene Skin-Atlanten der generierten Körper (`assets/skins/<körper>-three/`, `skin_bake.mjs --gen three`); `verify` prüft alle drei
  mit `&gen=three` (408/408, 383/383, 380/380). 103 Node-Tests.

## 0.14.0 „Foundry“ – 2026-10-29 (Roboterkörper als three.js-Generator, Etappe 1: Wächter)

- Der Wächter entsteht ohne Blender in `web/src/robotgen/`: Übertragung von Ballons Formbaukasten (`forms.py`, `shapes.py`, `body.py`,
  `helmet.py`, Arm v3) mit Fasen als Geometrie, Fugen per CSG, Teile-IDs, Extras, Segmentwurzeln und Rollenmaterialien wie im GLB.
- Viewer: `?model=waechter&gen=three` (GLB-Fassung bleibt Standard); Helm H/Scout, Farbschemata, Altern und Explosion laufen unverändert.
- Gemessen gegen den Blender-GLB: Teileliste identisch, Boxen je Objekt ≤ 0,65 mm, Umriss-IoU 0,9988–0,9995 in vier Ansichten; neues
  Vergleichswerkzeug `web/tools/robotgen_compare.mjs`, 7 neue Tests (74 Node-Tests).

## 0.13.0 „Skins“ – 2026-10-29 (Lackierungen Rost, Glut, Ornat für Körper und Helme, ohne Blender)

- Skins nach dem Referenzbild des Nutzers für Wächter, Paladin, Mechanik, Helm H und Scout, auf dem Roboter und beim Helm allein (`&skin=`).
- Werkzeugkette in three.js/Node statt Blender: UV-Atlas mit xatlas (WASM, deterministisch), Karten im UV-Raum, Kantenabstand und AO mit
  three-mesh-bvh (`web/tools/skin_bake.mjs`, Ablage `assets/skins/`); Mischer als Shader nach `web/src/skins.json`, Texturexport per Knopf.
- Navigation „Lackierung“: Farbschema oder Skin für Körper und Helm zusammen. Blender-Fassung der Skins (UV-Vorlage, Bake, Python-Mischer)
  entfernt; Körper-GLBs wieder ohne Blender-UVs wie in 0.12.

## 0.12.0 „Fusion“ – 2026-10-29 (Helme auf den Robotern, Navigation links)

- Ein Werkzeug: Körper Wächter, Paladin, Mechanik tragen Helm H (Standard, Varianten 80–88, Kopfhörer an/aus) oder Scout, eingepasst im Kopfsegment am Halsanker (`robotHelmet.js`).
- Zwei einheitliche, gealterte Farbschemata für Körper und Helme, auch für Helme allein: „Creme“ (Körperpalette) und „Weiß-Graphit“ (Originalfarben von Helm H), dazu Original (`&colors=body|helmet|original`).
- Alte three.js-Körperstudien 0.5–0.9 entfernt (Code, Schalter `body=`, Tests); Lieferpakete und Berichte bleiben Archiv. Studienhelm im Archiv (`&helmet=study`).
- Navigation links: Modelle und Varianten, Ansichten mit Nahansichten, Bauteilbaum (hervorheben, ausblenden, isolieren, zoomen), Look & Material.
- Rendern nur bei Änderungen, Schattenkarte statisch, AO beim Ziehen optional aus: kein Ruckeln mehr (p95 33 → 17 ms).
- 67 Node-Tests (neu: Helmwahl, Farben, Varianten, Shader-Maßstab; entfernt mit ihrem Code: Tests der alten Körper); Kameraabstände für schmale Fenster.

## 0.11.0 „Patina“ – 2026-10-29 (gealterte Materialien der Roboterkörper)

- Viewer zeigt Wächter, Paladin und Mechanik gealtert wie Ballons Cycles-Material „aaa“: Kantenabrieb im Radius 4 mm, Rauheitsschwankung,
  Feinrelief und feine Kratzer je Materialrolle (`robotWear.js`, Parameter `robotWearParams.json`); `&wear=off` bleibt flach.
- Abriebkanten nach Schattierungsnormalen (Normalensprung oder Fasenstreifen) beim Laden bestimmt; GLBs aus 0.10 unverändert.
- Acht neue Tests (73 Node-Tests), Vergleich gegen die Ballon-Cycles-Bilder in `docs/bilder/patina_vergleich.jpg`.

## 0.10.0 „Roster“ – 2026-10-29 (drei Roboterkörper aus Ballon)

- Die drei Körperstudien aus `cubeescape-ballon` Roboter Runde 5 (Commit `14bd78d`) als eigene Modelle: Wächter, Paladin, Mechanik.
- Export `blender/robot/export_robot.py` mit gepinnter Quelle `SOURCE.json`; Lieferpaket `assets/robot-bodies/` mit GLB, Baugruppen und Manifest je Körper.
- Viewer: `?model=waechter|paladin|mechanik`, im Rahmen des Gesamtkörpers, Explosion 0–1 über die Ballon-Anker, Etiketten, Studienwahl in der GUI.
- Doku `docs/ROBOTER_BALLON.md`; neun Tests in `robotBodies.test.mjs`, insgesamt 65 Node-Tests grün.

## 0.9.1 – 2026-10-29 (Patch: Lamellen-Testmatcher)

- `fullBody.test.mjs` prüft beim Ablehnen einer falschen Lamellenzahl jetzt die Meldung `waist.lamellae needs N bands`
  statt nur irgendeinen Fehler (Restbefund der 0.9-Prüfung). Nur Test und Version; Generator und Lieferung 0.9 unverändert.

## 0.9.0 „Vanguard“ – 2026-10-29 (einfacher Gesamtkörper)

- Körperoption `body=full`: Bastion-Oberkörper unverändert, dazu 27 Teile B32–B58 – drei dunkle Bauchlamellen,
  weißer Beckengurt mit Hüftplatten, Arme mit Ellbogen und Fäustlingshänden, Beine mit Hüft-/Kniegelenk, Knieschutz und Füßen.
- Blockformen aus facettierten Lofts und gefasten Platten in `fullBodyParams.json`; Explosionswege je Gliedkette, 80 Beschriftungen.
- `body=shoulders` bleibt bytegleich zur 0.7-Lieferung; 66 Tests, Ansichten, GLBs und Explosionsübersicht.

## 0.8.0 „Scout“ – 2026-10-29 (zweiter Helm aus Blender)

- Scout v3 (Stand D29 aus dem Arbeitsordner `trialanderror`) als eigener Helm: Blender-Generator `blender/scout/` mit `run.py`
  (Nachbau headless, GLB-Export, Ansichten), gebackene 2h-Haube `guss_2h.npz`, Vorlagen `reference/scout/`.
- Lieferpaket `assets/helmet-scout/`: montierter und explodierter GLB mit Teile-IDs S01–S13, Teileliste, Manifest, vier Ansichten.
- Viewer: `?model=scout` (auch `&exploded=1` mit Etiketten) lädt den GLB; three.js-Helm unverändert.
- Doku `docs/HELM_SCOUT.md` mit Ständen D01–D29, Stil, Teilen und Marker-System; Nachbau aus dem Repo identisch zu D29.

## 0.7.1 – 2026-10-29 (Patch: Markierbogen)

- Markierbogen in 3D: Nadeln und Stiftstriche direkt auf Helm und Oberkörper 0.7, Teil (H01–H21, B01–B31) und Seite A/B
  werden aus dem getroffenen Mesh erkannt; gemeinsamer Speicher im Artefakt, Antworten des Umsetzers am Marker.
- Werkzeuge zum Bauen, Prüfen und Rendern der Marker aus ihrer Kamera; Ablauf und Bezug zum Kritiker-Vertrag in `docs/MARKER.md`.

## 0.7.0 „Bastion“ – 2026-10-28 (Oberkörperstudie)

- Tiefe kantige Schultergehäuse mit eigenen Dächern und unterer Panzerlage; zentrale Brust und separate Flanken.
- 31 Körperteile; Helm, kurzer Hals, Kragen, Rumpfkern und vorhandene Materialien erhalten.
- Neue Nutzerreferenzen und Stil dokumentiert; 59 Tests, reproduzierbare Ansichten, GLBs und Explosionsübersicht.

## 0.6.0 „Cuirass“ – 2026-10-28 (Oberkörperstudie)

- Umschließende Schulterpanzer mit separaten unteren Lamellen und dunklen Gelenkkörpern; 26 stabile Körperteile.
- Breite Brusthälften mit physischem Mittelgrat, engerer Kragen mit Weitung zur Brust; Helm, kurzer Hals und tiefer Rumpfkern erhalten.
- Nutzerinspiration, Parameter und Stil dokumentiert; 56 Tests, Ansichten und Export-/Explosionsprüfung.

## 0.5.1 – 2026-10-28 (Patch)

- Rumpfkern 36 % tiefer, Brust/Rücken und Kragen angepasst; niedrigere, deutlich facettierte Schultern bei gleicher Breite und Dicke.
- 22 separate Körperteile, kurzer Hals und Helm erhalten; 54 Tests, Build und vier Ansichten geprüft, Vergleich und Export gesichert.

## 0.5.0 „Assembly“ – 2026-10-28 (Aufbaustudie)

- Beschriftete Explosionsansicht mit vollständiger Meshzuordnung und offenen Montageverbindungen; GLB erhält Teilemetadaten.
- Beide Headsets mit Bügeln, Kabeln und Antennen optional ausblendbar; Heckmodul und bestehende Helmform bleiben erhalten.
- 22 separate Hals-/Oberkörperteile, nach Nutzerfeedback kürzerer Hals sowie breitere, höhere und dickere Schulterkappen.
- Ergänzende Titan-Recherche mit Quellstatus dokumentiert; 54 Tests, Build und reproduzierbare Ansichten/Exporte.

## 0.4.0 „Continuity“ – 2026-10-28 (Material- und Formversuch)

- Breitere gerundete Maskenübergänge neben unveränderten Augen; zwei separate Stirnstreifen bis zum Hinterkopf.
- Vergleichbare Presets `original`, `metal`, `graphite` auf identischer Geometrie; technische Anbauten erhalten.
- Separate Akzentwahl: helle Befestigungspunkte auf dunkler Rüstung, zusätzlich weiße Stirn-/Scheitelstreifen als Probe.
- Getrennte reproduzierbare Exporte, Materialparameter und vier feste Ansichten je Preset; Nutzerwahl steht aus.
- Anthrazitfarbene Kontraststreifen für Metall und Graphit; optionale Haube ohne H20/H21, einschließlich stabiler Auswahl beim Zurücksetzen.
- Winkel-, Hexagon- und Technikmuster nach Probe 89–91 auf Nutzerwunsch vollständig entfernt; nur als verworfene Historie dokumentiert.
- Neun aktive Varianten 80–88; 45 verbleibende Tests und Build bestanden. Aufbau, Stil, Reproduktion und visuelle Einschätzung dokumentiert.

## 0.3.0 „Sidework“ – 2026-10-28 (offener Entwurf)

- Dokumentation/Stil: seitliche Maskenstreifen als Geometrie-/Lichtwirkung erklärt; weicheren Übergang als offenen Vorschlag festgehalten, Lieferstand 79 unverändert.
- Stand 79: Kopfhörer, Kabel, Halterung und Antenne von A nach B gespiegelt; gemeinsames Heckmodul erhalten.
- 18 neue Spiegelteile ersetzen das alte Ohrmodul samt Halter; 86 bisherige Meshes und alle Materialien unverändert.
- 33 Tests und Build bestehen; Spiegelpunkte, Flächenorientierung, positive Skalierung und vier Ansichten geprüft.

### Stirnanschluss 78

- Stand 78: Trapezblenden bis zur Augenmaske verlängert, mit flach auslaufendem Überlappungsrand.
- Nur H20/H21 geändert; übrige 89 Geometrien, alle Materialien und Texturen erhalten, Teile weiterhin separat.
- 32 Tests und Build bestehen; zwölf zusätzliche Anschlussproben, Negativkontrolle und vier Ansichten geprüft.

### Blendenstand 76

- Stand 76: zwei separate trapezförmige Stirnblenden nach Nutzerzeichnung, auf der runden Haube aufliegend.
- Alle bisherigen 89 Meshes, Materialien und Texturen erhalten; H20/H21 ergänzen zwei exportierbare Bauteile.
- 32 Tests und Build bestehen; Auflage/Mittelstreifen, Negativkontrolle, vier Ansichten und erweiterte Teilekarte geprüft.

### Hinterkopfstand 74

- Stand 74: helles Hinterkopfgehäuse und Nackenrahmen wieder glatt gerundet, einschließlich separater Taschenböden.
- Haube, verdeckter Maskenanschluss, Augen und Kiefer erhalten; 77/89 Geometrien sowie alle Materialien unverändert.
- 32 Tests und Build bestehen; zwölf Rundungsproben, Negativkontrolle und vier Videoansichten geprüft.

### Fugenstand 73

- Stand 73: helle Fugenlinie zwischen Haube und Augenmaske durch verdeckten Überlappungsrand deutlich reduziert.
- Teile bleiben getrennt; 87/89 Geometrien sowie alle Materialien und Texturen unverändert gegenüber 71.
- 31 Tests und Build bestehen; 33 Anschlussproben und Negativkontrolle prüfen den geschlossenen Rand.

### Strukturstand 71

- Stand 71: sichtbare feine Lackkörnung auf der Haube mit festen Farb-, Normalen- und Rauheitskarten (Seed 73).
- Alle 89 Geometrien/UVs, vier Silhouettenmasken und übrigen Materialien bleiben unverändert gegenüber 69.
- 31 Tests, Build und vier Ansichten geprüft; Normalenkarte auch im GLB enthalten.

### Materialstand 69

- Stand 69: Haube übernimmt Maskenfarbe und -texturkarten mit gedämpftem Glanz.
- Alle 89 Meshgeometrien/UVs und bisherigen Materialien unverändert; vier Silhouettenmasken bytegleich mit 68.
- 31 Tests, Build und vier Ansichten geprüft; Export und Dokumentation aktualisiert.

### Formstand 68

- Scheitel und Kopfbügel quer und längs gewölbt; Haubenrand weich zur Augenmaske geführt.
- Haube und Maske getrennt; 83/89 Meshes, einschließlich Augen, Maske und Kiefer, geometrisch unverändert.
- 31 Tests, Build und vier Ansichten geprüft; Export, Texturen und Dokumentation auf Stand 68 aktualisiert.

### Ausgangsstand 64

- Finale Auswahl 64: runde Haube und akzeptierte Augen, moderat kantiger heller Rahmen; eckige Hauben 62/63 verworfen.
- Generator, GLB mit 89 Meshes, fünf Textur-PNGs, Teileverzeichnis, Stilbeschreibung und Bildverlauf im Repo gebündelt.
- 31 Tests, Build, Vier-Ansichten-Prüfung und bytegleiche Wiederherstellung bestanden; [Prüfbericht](docs/versions/0.3.md).

## 0.2.0 „Fidelity“ – 2026-10-28 (lokal)

- Haube, Maske, Wangen und Kiefer getrennt; Heckmodul, Kabel, Einlagen und Befestigungen anhand des Videos überarbeitet.
- Augen erhalten; mittlere Silhouetten-IoU 0,9143 → 0,9152, mit Rückschritten in Front und Seite A.
- Feste Render-Seeds, Quellen-/Referenz-Hashes und reproduzierbarer Vergleich mit der ergänzenden Meshy-Referenz.
- [Prüfstand, Einschränkungen und Reproduktion](docs/versions/0.2.md).

## 0.1.0 „Contour“ – 2026-10-28

- Gesamtform gegen vier feste Referenzansichten angepasst: rundere Haube, kürzeres Untergesicht und angepasste Augen;
  Vorher-/Nachher-Vergleich und aktualisierte Teilekarte. Mittlere Silhouetten-IoU von 0,8982 auf 0,9090.
- Bestehendes Three.js-Modell weitergeführt: schräger Abschluss des Nackenrahmens, echte Seitenvertiefungen und
  zusätzliche kleine Felder mit zurückgesetzten Böden; vorhandene Materialien erhalten.
- Teilekarte mit stabilen H-Kennungen zur Besprechung von Geometrieänderungen, HTML/PNG/PDF-Ausgabe.
- Reproduzierbare Browserprüfung mit gespeichertem GLB-Export und Laufstatus; unvollständige Messungen schlagen fehl.
  Playwright und Python-Messabhängigkeiten gepinnt; Logiktests und Build in CI. Leuchtstärke-/Bloom-Doku korrigiert.

## 0.0.2 „Browser Helmet“ – 2026-10-27

- `web/`: Three.js-Nachbau des Helms ohne lokale 3D-Software – fünf benannte Bauteilgruppen (three-bvh-csg, Schal mit
  simplex-noise), Studio-Licht, GTAO, Bloom nur auf dem Visier, ACES, Canvas-Texturen.
- Ansichten Front/Left/Back/Right wie die Videobilder (`web/refs/`, per ffmpeg), Turntable, Onion-Overlay (Taste O),
  lil-gui auf `helmetParams.json`, GLB-Export `scifi_helmet.glb`.
- `npm run verify`: Playwright-Renders, Overlay- und Umrissbilder, Umriss-IoU je Ansicht (Mittel 0,908 nach 5 Durchläufen).
- Zweite Runde Helm: Grundform als Loft aus drei Profilen, Frontplatte mit ebenen Facetten, Kiefer als Steg unter der
  Platte, Spiralkabel, größere Ohrkappe, Rückplatte und Kragenkerben, mattes Anthrazit und Weiß mit Gebrauchsspuren,
  Augen ohne Lichthof; Schal entfernt, IoU nur oberhalb der Schalkante (Mittel 0,903, vorher 0,907 auf derselben
  Messung).
- Dritte Runde Helm: Front läuft mit Mittelgrat spitz zu (V aus zwei Ebenen), Fasen an allen Facettenkanten, tiefe
  Augenhöhlen mit schrägen Wänden (sattes Cyan, Auge zieht sich auf die Seitenfläche), Wangenmarkierungen,
  Schläfenplatten mit Rippen, Mundschlitz, Schraubenreihen an Krempe und Kiefersteg (IoU 0,904).
- Vierte Runde Helm nach einer Formbeschreibung (GPT 6 Astra): Kinnblock hinter der Braue, Mundaussparung mit Leisten
  und Querschlitz, Rücksprung-Fuge hinter der Maskenkante, Wangenschlitze, Rahmen-Absenkung hinten, dreieckige
  Schläfenvertiefungen, Seitenmodul B kantig, Heck-Box nach Maß, Kabel vom Box-Ausgang, Licht dreht mit der Kamera;
  Belege je Durchlauf unter `runs/helm/` (IoU 0,901).
- CSG-Fix in `geo.js`: Transformationen werden in die Geometrie eingebacken (three-bvh-csg rechnet im lokalen System
  des ersten Körpers; Position und Neigung der Kuppel gingen verloren).
- `check` überspringt `node_modules`, `dist`, `renders`.

## 0.0.1 „Scaffold“ – 2026-10-27

- Grundgerüst aus der Sightline-Sitzung: Regeln, Vorlage Helm (Video und 12 Einzelbilder), Kritiker-Prompt und JSON-Schema,
  Prüfung `check`, PR-Check, Lader `./ce` (Agent Tools 0.24; Bilder in `ce api` ab 0.25).
