> Übernommen aus dem Arbeitsordner `trialanderror` (Stand D29, 29.10.2026). Dateinamen ohne Pfad beziehen sich jetzt auf `archive/blender/scout/` (seit 0.18 archiviert; `guss_2h.npz` und `helm_params.json` in `web/src/robotgen/data/`); Bilder auf `assets/helmet-scout/`; `durchlaeufe/` und Marker-Exporte blieben im Arbeitsordner.

# Stände des Helms Scout v3

Jeder Durchlauf ist ein Stand **D<nr>**. Je Stand gibt es mindestens `durchlaeufe/<nr>/` mit Vergleichsbildern Referenz|Render
(`cmp_*.png`, `bogen.png`) und `messung.json` (Notiz, IoU). Ab **D28** wird zusätzlich der komplette Generator eingefroren
(`durchlaeufe/<nr>/stand/`: Code, `helm_params.json`, Endansichten, Teilekarte, Explosionsansicht, Marker, `stand.json`) –
damit ist jeder Stand exakt nachbaubar. Ältere Stände sind nur über die Notiz und die genannten .blend-Sicherungen erhalten.

**Markierungsseiten:** je Stand eine eigene Seite mit eigenem Marker-Protokoll.

| Stand | Seite | Inhalt |
| --- | --- | --- |
| D29 | https://claude.ai/code/artifact/ed7adda2-7ca2-4166-804e-5a49b7d027b4 | **aktuell** – neue Marker hier setzen |
| D28 → D29 | https://claude.ai/code/artifact/fda08327-df9d-4246-860a-775f2cfc20be | Runde 2: 1 Marker (Loch vor dem Krempenende), in D29 umgesetzt (Archiv) |
| D27 → D28 | https://claude.ai/code/artifact/791d0ff6-b79e-46f7-9a4d-003e055a75b9 | Runde 1: 6 Marker auf D27, alle in D28 umgesetzt (Archiv) |

**Ablauf je neuem Stand:** Durchlauf → Nachbau aus leerer Datei → `python3 stand_sichern.py <nr> <seiten-url>` →
neue Markierungsseite (`markierbogen_daten()` in Blender, Assets hochladen, `markierbogen_bauen.py`, veröffentlichen) → Zeile hier.

| Stand | Notiz | IoU Ø | Kritik | Generator gesichert | .blend |
| --- | --- | --- | --- | --- | --- |
| D01 | Ausgangsstand Lauf 3b | 0.842 | ✓ |  |  |
| D02 | Kritik R1 umgesetzt: flacher Schirm, enger Rand, Maske weiter hinten, Augen schräger, Module kleiner | 0.856 | ✓ |  |  |
| D03 | Kritik R2 umgesetzt (Verjüngung auf Messbereich begrenzt) | 0.859 |  |  |  |
| D04 | Lauf 4: Formkonstruktion nach critic (Profil-Loft, Facetten-Gesicht, Kern/Kragen/Kiefer aus Silhouetten), Anbauteile aus Lauf 3 | 0.863 | ✓ |  |  |
| D05 | Kritik R4: Haube ohne Kuppelrundung (Profilform), Augen kleiner, Kiefer schlanker, Ohrmodule nach critic earR | 0.856 | ✓ |  |  |
| D06 | Kritik R5: Haube Keil (flache Oberseite, tiefere Rückkante, Stufe über schlankerem Kern), Kragen kleiner, Maske seitlich bis Kinnbalken, … | 0.851 | ✓ |  |  |
| D07 | Kritik R6: Dach flacher (Front-/Seitenprofile oben abgesenkt, flache Oberseite), Augen kleiner und flacher geneigt (8°), Kern nach oben v… | 0.844 | ✓ |  |  |
| D08 | Kritik R7: Halsring dunkel (Referenz: dort Tuch/Dunkles), Kragen nach unten verjüngt (0,94), Augen schmaler/näher zur Mitte (0,12 breit, … | 0.841 | ✓ |  |  |
| D09 | Messkorrektur nach R8 (ohne Kritikrunde, Kontingent 5/5 verbraucht): Maskenhinterkante seitlich z 0,03 (Referenz vermessen), Kiefer-Rücks… | 0.841 |  |  | helm_live_test_5.blend |
| D10 | Lauf 5: Augenfenster um die Ecke (Seitenteil schließt an), Kinnbalken nicht mehr vorstehend (z 0,41), Ohrmodule weiter hinten auf der Ker… | 0.854 | ✓ |  |  |
| D11 | Kritik R9: Kuppel vorn oben schmaler (Frontprofil zurück zur critic-Form, abgesenkt), Augen näher zur Mitte (x 0,135), Seitenfenster mit … | 0.856 | ✓ |  |  |
| D12 | Kritik R10 + Nutzerhinweis Augen: Seitenfenster entfernt (Fehldeutung, Seitenreferenz ist ~65–70° gedreht), Augen höher 0,12×0,066 in tie… | 0.857 | ✓ |  |  |
| D13 | Kritik R11 + Nutzer: Stirn als gerade Keilschräge (sideFront), Kinnbalken unten kürzer; Augen nach Nutzerhinweis weiter außen in der Schl… | 0.856 | ✓ |  |  |
| D14 | Kritik R12: Frontfacetten 6° nach hinten geneigt (Unterkante zurück, Messung Seitenreferenz ≈ 0,05 H über Augen→Kinn) | 0.857 | ✓ |  | helm_live_test_6.blend |
| D15 | Lauf 6 (Nutzerwunsch): Haube + Augen + Gelenkscheiben + Krempe aus Lauf 2h (guss_2h.npz), darunter Mundstruktur und Kinnleiste aus Lauf 5… | 0.847 | ✓ |  |  |
| D16 | Nutzer: Mundstruktur Lauf 2 (ganze 2h-Gesichtsplatte mit Fugen/Schlitzen) + Mittelvertiefung Lauf 5 (Trapez-Wanne per bisect), Kinnleiste… | 0.849 | ✓ |  |  |
| D17 | Nutzer: schwarzes Band unter der Gesichtsplatte entfernt (Haube vorn bei Z 0,32 geschnitten), Kinnleiste starr 0,17 angehoben, Halsring w… | 0.847 | ✓ |  |  |
| D18 | Nutzer: zurück auf Stand D16, nur Halsring entfernt (dunkler Zylinder unter der Gesichtsplatte) | 0.849 |  |  | helm_live_test_7.blend |
| D19 | Nutzer: Kinnleiste 0,055 angehoben (starr, oben an der alten Kante geschnitten) – Spalt zur Gesichtsplatte geschlossen; sonst Stand D18 | 0.851 |  |  |  |
| D20 | Nutzer: Kinnleiste 0,055 nach hinten (bündig mit der schwarzen Gesichtsfront) | 0.85 |  |  |  |
| D21 | Nutzer-Markierung blau: Spalt Haubenrand–Ohr geschlossen (Kern vorn schräg: unten z 0,10, an der Schläfe 0,08; oben schlanker 0,95/0,92),… | 0.848 |  |  |  |
| D22 | Nutzer: Vorderecke Gesichtsplatte unten = Vorderecke Kinnleiste oben (Z 0,212 / y −0,320; jaw.lift 0,064, zurueck 0,05); Zipfel der 2h-Ge… | 0.848 |  |  |  |
| D23 | Nutzer-Markierung: Trapezkerbe oben im Kinnblock entfernt (jaw.kerbe = false) – Mundvertiefung endet sauber auf der Kinnleiste | 0.848 |  |  |  |
| D24 | Nutzer („sieht sehr gut aus“): Kerbe in der Kinnleiste setzt die Flanken der Mundvertiefung fort (kerbeUmriss, Tiefe kerbeZ 0,345), Wanne… | 0.848 |  |  | helm_live_test_8.blend |
| D25 | Nutzer: Lücke zwischen Gesichtsplatte und Kieferstück S07 geschlossen – S07-Vorderkante folgt der Hinterkante der 2h-Gesichtsplatte (+0,0… | 0.848 |  |  |  |
| D26 | Nutzer: Seitenteile der Kinnleiste (S07) bis an die Haubenkante hochgezogen (jaw.top 0,25 → Z 0,74; Vorderkante entlang Haubenkante + Ges… | 0.85 |  |  |  |
| D27 | Nutzer-Markierungen: Seitenplatte S07 oben bis knapp unter die Krempe (jaw.top 0,235 → Z 0,728, keine Lasche/kein Spalt); unten Kragen vo… | 0.851 |  |  |  |
| D28 | Marker 1–6 (Markierbogen): Seitenplatte S07 vorn 0,02 tiefer unter den Haubenrand, Krempe S04 endet an der Plattenecke (y 0,07), Kragen S… | 0.847 |  | ✓ |  |
| D29 | Marker D28-1 („immer noch ein Loch“): Seitenplatte S07 läuft vor dem Krempenende (y < 0,07) bis an die Haubenkante (Z 0,755), dahinter bl… | 0.847 |  | ✓ | helm_live_test.blend |
