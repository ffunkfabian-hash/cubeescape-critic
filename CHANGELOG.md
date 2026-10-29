# Changelog

## 0.9.0 „Vanguard“ – 2026-10-29 (einfacher Gesamtkörper)

- Körperoption `body=full`: Bastion-Oberkörper unverändert, dazu 27 Teile B32–B58 – drei dunkle Bauchlamellen,
  weißer Beckengurt mit Hüftplatten, Arme mit Ellbogen und Fäustlingshänden, Beine mit Hüft-/Kniegelenk, Knieschutz und Füßen.
- Blockformen aus facettierten Lofts und gefasten Platten in `fullBodyParams.json`; Explosionswege je Gliedkette, 80 Beschriftungen.
- `body=shoulders` bleibt bytegleich zur 0.7-Lieferung; 65 Tests, Ansichten, GLBs und Explosionsübersicht.

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
