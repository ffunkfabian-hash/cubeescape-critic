> Übernommen aus dem Arbeitsordner `trialanderror` (Stand D29, 29.10.2026). Dateinamen ohne Pfad beziehen sich jetzt auf `archive/blender/scout/` (seit 0.18 archiviert; `guss_2h.npz` und `helm_params.json` in `web/src/robotgen/data/`); Bilder auf `assets/helmet-scout/`; `durchlaeufe/` und Marker-Exporte blieben im Arbeitsordner.

# Scout v3 – Teile und Kennungen (Stand Lauf 6, D28)

Feste Kennungen wie bei critic (`referenz/critic_quelle/HELM_TEILE.md`), damit Änderungswünsche eindeutig sind:
**Nummer, Seite, Richtung** – z. B. „S07 R schmaler“, „S05 tiefer“, „S10 L weiter nach hinten“.
Die Nummern bleiben über Modelländerungen hinweg gleich; neue Teile bekommen neue Nummern.

**Seiten:** R = +X, L = −X. In der Frontansicht liegt **R rechts im Bild**, L links (lange Antenne = L). Die Etiketten werden aus der Lage
bestimmt – die Objektnamen sind historisch nicht einheitlich (`Kiefer_L` und `Auge_L` liegen bei +X, also auf Seite R).

Bilder: `helm_explosion_vorn.png` (Dreiviertel vorn), `helm_explosion_hinten.png` (Dreiviertel hinten).
Erzeugt mit `helm_explosion.py` → `explosion(pfad, grad)`; die Teile werden nur fürs Bild verschoben.

| ID | Teil | Objekte in Blender | Herkunft / Generator |
| --- | --- | --- | --- |
| S01 | Haube (Guss) – Kuppel, Stirn, Gesichtsplatte mit Fugen und Schlitzen | `Kappe` | Lauf 2h (`guss_2h.npz`, aus `bauen_lauf6()`), eingesetzt in `helm_bauen.py` → `guss_2h_einsetzen()` |
| S02 | Augen – Leuchteinlage und Augenhöhle | `Auge_L/R`, `Augenhoehle_L/R` | Lauf 2h |
| S03 | Gelenkscheibe neben dem Auge (L/R) | `Maske_Gelenk_L/R` | Lauf 2h |
| S04 | Krempe – dunkles Band am Haubenrand | `Krempe` | Lauf 2h |
| S05 | Mundvertiefung – Trapez-Wanne mittig in der Gesichtsplatte | `Mund_Vertiefung` | Lauf 5 (`mouth` in `helm_params.json`), `mund_vertiefung()` |
| S06 | Kinnblock – mittlerer Teil der Kinnleiste, mit Kerbe als Fortsetzung von S05 | `Kinnblock` | Lauf 5 (`helm_csg.py` → `unterhelm()`, `jaw`) |
| S07 | Kieferstück (L/R) – seitliche Teile der Kinnleiste, als Seitenplatte bis an die Haubenkante | `Kiefer_L/R` | Lauf 5 |
| S08 | Seitenschale (Kern) – weiße Wand unter der Haube | `Kern` | Lauf 4/5 (`core`) |
| S09 | Kragen – weißer Ring unten, vorn offen | `Kragen` | Lauf 4/5 (`collar`) |
| S10 | Funkmuschel (L/R) mit Ring, Knopf, Halter, Bügel | `Ohrmodul_*_L/R` | Lauf 5 (`earR`), `ohrmodule_neu()` |
| S11 | Antenne (L lang, R Stummel) | `Antenne_L`, `Antenne_Stummel_R` | Lauf 3 |
| S12 | Rückmodul – Platte, Box mit Feld, Hebel, Schrauben | `Rueckmodul*` | Lauf 5 (`backBox`), `rueckmodul_neu()` |
| S13 | Spiralkabel (L/R) mit Stecker und Anschluss | `Kabel_*`, `Schlauch_*` | Lauf 3 (`schlauch()`) |

Nicht nummeriert: `Hals` (Präsentationsträger), Studio, Licht. Ausgebaut und reserviert: Halsring (bis D16 dunkler
Zylinder unter der Gesichtsplatte), Kopfgurt/Scheitelband, olivgrüne Pods, Laschen.

Teilekarte (Normalansichten mit Kennungen und Höhenlinien alle 3 cm, Helm = 30 cm): `helm_teilekarte.png`
(Einzelbilder `helm_teilekarte_vorn/seite/dreiviertel/hinten.png`), erzeugt mit `helm_explosion.py` → `teilekarte_bogen()`.

## Markierbogen (Werkzeug für Änderungswünsche)
die Markierungsseite des aktuellen Stands (Liste in `STAENDE.md`; je Stand eine eigene Seite mit eigenem Protokoll) – in eine der vier Ansichten klicken; Teil, Seite und Höhe (cm) werden
aus der Klickstelle vorgeschlagen (Raster je Ansicht aus `helm_explosion.py`), Stelle/Richtung/Betrag/Notiz ergänzen, speichern.
Claude liest die Sammlung `marker` (Felder: nr, ansicht, u, v, hoehe_cm, teil, seite, stelle, richtung, betrag, cm, notiz, satz, status, antwort)
und setzt nach der Umsetzung `status = umgesetzt` und eine kurze `antwort`. Vorlage: `markierbogen_vorlage.html` (Daten werden beim Bauen eingesetzt). Die Ansichtsbilder liegen im Asset-Speicher des
Artefakts (`/_blob/…`) – eingebettete data:-Bilder zeigt der claude.ai-Viewer nicht an.
