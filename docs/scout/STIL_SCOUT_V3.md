> Übernommen aus dem Arbeitsordner `trialanderror` (Stand D29, 29.10.2026). Dateinamen ohne Pfad beziehen sich jetzt auf `archive/blender/scout/` (seit 0.18 archiviert; `guss_2h.npz` und `helm_params.json` in `web/src/robotgen/data/`); Bilder auf `assets/helmet-scout/`; `durchlaeufe/` und Marker-Exporte blieben im Arbeitsordner.

# Stilbeschreibung „Scout v3“ (Stand Lauf 6, 28.10.2026)

> **Ab Lauf 4 gilt die Formkonstruktion nach cubeescape-critic** (`helm_csg.py`, Parameter `helm_params.json`):
> 1. **Ein Kopfvolumen** als Loft aus drei gezeichneten Profilen – Frontbreite `front`, Vorderkante `sideFront`,
>    Hinterkante `sideBack` – über einem normierten Draufsicht-Umriss `topHalf` mit gefasten Frontecken.
>    Front- und Seitensilhouette sind damit exakt die Profile. Gebaut in critic-Achsen, dann eine Drehung
>    `(x, y_c, z_c) → (x, 0,01 − z_c, y_c + 0,493)`.
> 2. **Teile werden aus dem Volumen geschnitten** (exakte Booleans): Haube = Volumen über der geneigten Brauenebene;
>    Gesichtsschale = Volumen ×1,022 ∩ Front-Prisma ∩ Seiten-Prisma ∩ unter der Braue ∩ sechs ebene Facetten
>    (V-Front, Seitenfasen mit Schläfenrundung, Braue, zurückgeneigte Unterseite) + Fasenebenen;
>    Augen = Pyramidenstumpf-Sockel + Schlitz, gekippt/gegiert; Mund-Trapez + Schlitz; Schläfenmulden.
> 3. **Weiß**: Kern (elliptischer Zylinder ∩ Volumen ×0,985, Nähte), Kragen (Ring mit Fase, vorn verjüngt, hinten
>    Absenkung, geneigt), Halsring, **Kinnblock + Kiefer** als Schnitt aus Front-, Seiten- und Draufsicht-Prisma.
> 4. Kuppel-Rundung von critic (`crownDomeAn`) ist **aus**: das Video zeigt eine flachere Schildhaube.
> 5. Anbau: Ohrmodule nach `earR`, Antennen, Rückmodul, Spiralschlauch (Lauf 3).
> **Lauf 6 (Nutzerentscheidung, D15–D19) – gilt vor Lauf 4/5 für Haube, Augen und Gesicht.** Teilekennungen S01–S13:
> `HELM_TEILE_SCOUT.md`, Explosionsansicht `helm_explosion_vorn/hinten.png` (`helm_explosion.py`).
> 17. **Haube + Augen + Gesichtsplatte = Lauf 2h** (S01–S04): runde Guss-Kuppel, lange Trapez-Augenschlitze in Höhlen,
>     Gelenkscheiben, waagerechte Gesichtsfugen und Schlitze, Krempe. Quelle `bauen_lauf6()` (2h-Parameter in `lade_2h()`,
>     2h-Nase aus `helm_build2`), gesichert als `guss_2h.npz` (`guss_2h_export()`), eingesetzt mit `guss_2h_einsetzen()`
>     (`guss2h.modus = 'voll'`). Die 2h-Hülle ist offen → **kein Boolean**: Schnitte per `bisect`, Innenschicht oben entfernt.
> 18. **Mitte = Lauf-5-Mundvertiefung** (S05): Trapez-Umriss `mouth.outline` per bisect sauber ausgeschnitten, Wanne 0,035 tief.
> 19. **Unten = Lauf 5**: Kinnblock + Kiefer (S06/S07), Kinnleiste starr 0,055 angehoben (`jaw.lift`, oben an der alten Kante
>     geschnitten) – schließt an die Gesichtsplatte an; Kieferstreifen seitlich bis hinter die Gesichtskante (`jaw.side_top`).
>     Kern vorn schräg (`core.frontZ/frontKnickY/frontZTop/frontTopY`), damit er die schmalere 2h-Haube nicht durchstößt.
>     **Halsring entfällt** (`neckRing.aus`) – er war der dunkle „Zylinder“ unter der Gesichtsplatte.
>     D20–D22 (Nutzer): Kinnleiste nach hinten und oben gesetzt (`jaw.zurueck` 0,05, `jaw.lift` 0,064), sodass die Vorderecke
>     der Gesichtsplatte unten (Z 0,212 / y −0,320) genau auf der Vorderecke der Kinnleiste oben sitzt (durchgehende Schräge);
>     Zipfel der Gesichtsplatte unter der Mundvertiefung entfernt. Spalt Haubenrand ↔ Ohr geschlossen (Kern vorn schräg,
>     `core.frontZ` 0,10 / `frontZTop` 0,08 bei y 0,25, oben schlanker `inflate` 0,95 / `topScale` 0,92).
>     D23/D24: Die alte critic-Kerbe im Kinnblock lag schief unter der Mundvertiefung. Ersetzt durch eine Kerbe, deren Flanken die
>     Schrägen der Mundvertiefung fortsetzen (`jaw.kerbeUmriss`, Tiefe `kerbeZ` 0,345 = Wannenboden, vor lift/zurück gerechnet);
>     die dunkle Wanne reicht bis Z 0,175 (`guss2h.mundUntenZ`). Ergebnis: Vertiefung läuft als Schacht in die Kinnleiste,
>     helle Stufe als Abschluss (vom Nutzer so gewählt; dunkel gefärbte Kerbe war schlechter).
>     D25: Lücke zwischen Gesichtsplatte und Kieferstück geschlossen – Vorderkante von S07 (`jaw.side_top`) folgt der gemessenen
>     Hinterkante der 2h-Gesichtsplatte in der Seitenansicht (y −0,234 bei Z 0,20 … −0,044 bei Z 0,50), 0,025 darunter geschoben.
>     D26: Seitenteile der Kinnleiste bis an die Haubenkante hochgezogen (`jaw.top` 0,25 → Oberkante Z 0,74); ihre Vorderkante folgt
>     oberhalb Z 0,50 der Haubenkante (y −0,044 … +0,08). Der Kern bleibt schmal (wie D25) – ihn zu verbreitern stieß durch die Haube.
>     D27: Oberkante der Seitenplatte knapp unter der Krempe (`jaw.top` 0,235 → Z 0,728; höher ragt sie über die Krempe), Kragen
>     vorn bis unter die Platte (`collarFront` −0,03 / 0,00) – schließt die dunkle Kerbe hinten unten.
>     D28 (Marker 1–6 aus dem Markierbogen): Vorderkante S07 oben 0,02 tiefer unter den Haubenrand, Krempe S04 vorn bis zur
>     Plattenecke gekürzt (`guss2h.krempeVornY` 0,07), Kragen S09 schmaler als die Platte (`collar.rx` 0,36), Seitenplatte unten
>     ohne Breitensprung (`jaw.frontHalb`) und ohne critic-Seitennuten (`jaw.seitenNuten`), Augenrahmen hart (`guss2h.augenKantig`).
>     Verworfen: Platte oben schmaler (legt den zerfaserten 2h-Haubenrand frei), Kragen vorn zurückschneiden (reißt eine Lücke).
>     D29 (Marker D28-1): Vor dem Krempenende (y < 0,07) läuft die Oberkante der Seitenplatte entlang der Haubenkante bis
>     Z 0,755 (`jaw.top` 0,262, Stufe in `jaw.side_top`), dahinter bleibt sie bei Z 0,728 unter der Krempe – schließt das Loch
>     zwischen Haube, Krempenende und Platte (war schon Marker 1 der Runde D27, damals falsch verortet).
> **Lauf 5 (Kritik R9–R13, Durchläufe 10–14)** – ersetzt in Punkt 6 und 10 die Werte von Lauf 4b:
> 11. **Stirn = gerade Keilschräge** (`sideFront` von z 0,06/y 0,49 gerade bis 0,48/0,19; vorher voll gerundet, bei z 0,3 um 0,11 H
>     zu hoch). Frontprofil oben wieder critic-Form (Scheitel schmal, nur abgesenkt). **Frontfacetten 6° zurückgeneigt**
>     (Unterkante weicht zurück, Seitenreferenz ≈ 0,05 H Augen→Kinn).
> 12. **Augen** (Nutzervorgabe): weiter außen in der Schläfenrundung (x 0,19), breit und flach (0,165 × 0,046), Gieren 30°,
>     Neigung 10°, tiefe Sockel (0,055) mit breitem Rahmen. Kein separates Seitenfenster (Lauf 4b war Fehldeutung: die
>     Seitenreferenz ist ≈ 65–70° gedreht, nicht 90°).
> 13. **Gesichtsgliederung nach critic**: Wangenplatten `Wangenplatte_L/R` per V-Fuge (y −0,115, Spalt 0,003) abgetrennt,
>     dunkle Maskenfuge an der Hinterkante (`maskGap`, Rohr r 0,0065), 10 Schrauben (`maskScrews`).
> 14. **Kinnbalken** nicht vor der Maske: vorn z 0,41, Unterkante y −0,47 … −0,45.
> 15. **Ohrmodule** auf der Kernfläche (Raycast, Abstand 0,012) bei z −0,19, eckiger (`exV` 5, `exH` 6), Bügel bis unter die Haube.
> 16. **Rückmodul** rechteckig nach critic `backBox` (0,30 × 0,24, Platte, gefastes Achteckfeld, Hebel, 4 Schrauben, x +0,03,
>     y_c 0,14); altes Achteckmodul und Rückbox-Antenne entfallen.
> Abschnitte unten beschreiben Lauf 2/3 (Keilfunktion) und gelten nur noch für Material, Licht und die Fehlerliste.
>
> **Lauf 4b (Kritik R5–R8, Durchläufe 06–09)** – alle Werte in `helm_params.json`, critic-Achsen (y oben, z vorn):
> 6. **Haube als Keil**: Profile oben abgesenkt (Scheitel y 0,49 statt 0,507), Scheitelpunkt bei z +0,05; Oberseite
>    flach und nach hinten leicht fallend (`sideBack` −0,25 → 0,458, −0,44 → 0,418), senkrechte Rückwand bis y 0,385;
>    vorn Stirnfase (`sideFront` 0,2 → 0,468, 0,375 → 0,34). Frontprofil oben breiter (flacher Scheitelbogen).
> 7. **Kappenkante getrennt von der Braue**: `capEdgeY` 0,28 (Seite/hinten, Referenz Z ≈ 0,77), Braue der Maske bleibt
>    `crownTransition.browY` 0,33 – sonst schneidet die Braue in die Augensockel.
> 8. **Weiß schlanker, mit Stufe unter der Haube**: Kern rx 0,33 / rz 0,42, ∩ Volumen ×0,965, oben verjüngt
>    (`topScale` 0,93); Kragen rx 0,395 / rz 0,465, unten verjüngt (`bottomScale` 0,94), vorn steil abgeschnitten
>    (`collarFront` −0,10 → −0,03). **Halsring dunkel** (Referenz: dort Tuch/Dunkles; weiß wirkte er als zweiter Sockel).
> 9. **Maske seitlich bis zum Kinnbalken**: Seitenprisma `maskSide` (Hinterkante z 0,03, unten bis y −0,345);
>    Kiefer seitlich nur noch Rückstreifen + Kinnbalken (`jaw.side_top`) – der alte Keil verdeckte die Maske.
>    **Wangenmodul** `Wange_L/R` (Block mit drei Rillen) an der Maskenhinterkante (`cheek`).
> 10. **Augen**: kleiner und flacher (0,12 × 0,05, Neigung 8°, Gieren 22°, x 0,152); zusätzlich **Seitenfenster** auf der
>    Schläfenfase (`visor.side`, Gieren 68°) – Auge im Profil sichtbar.


Reproduzierbar: `helm_bauen.py` baut den Stand Lauf 6 aus einer leeren Blender-Datei
(`exec(open('/Users/ffunk/trialanderror/helm_bauen.py').read()); bauen_lauf6b()`, ≈ 4,5 min; Endstand D19),
`ansichten(prefix)` rendert die vier Vergleichsansichten vorn / Seite / Dreiviertel / hinten.
Geprüft: Nachbau = Arbeitsstand (IoU 0,836 / 0,895 / 0,810 / 0,883, gleiche 51 sichtbaren Teile, ≈ 2 min).

## 1. Leitidee
Ein kompakter Hard-Surface-Helm aus **zwei Farbwelten**: ein **dunkler Guss** (Haube + Gesicht) und eine
**weiße Schale** (Kragen, Kinnleiste, Seitenpanels). Das Dunkle wirkt wie aus einem Stück gegossen –
keine Querfuge zwischen Stirn und Haube. Weiß trägt die Technik (Panels, Nuten, Schrauben).

## 2. Maßstab und Achsen
- H = 1,0 = 0,30 m (Szene: `unit scale 0.30`). +Z oben, −Y vorn (Gesicht), +X rechts vom Träger.
- Z 0 = Unterkante Schale/Kinnleiste, Scheitel Z 1,0.
- **Formquelle ist die Meshy-Vorlage** (`referenz/meshy_v2.glb`, Lage: Maßstab 1/3,12, y +0,145).
  Der Bauplan liefert nur Namen, Bauteilliste und Grobmaße. Bei Widerspruch gilt die Vorlage.
  Die Vorlage dient als **Maß**, nicht als Fläche (kein Shrinkwrap – siehe 7).

## 3. Formsprache – die Regeln
1. **Ein Guss, eine Linie.** Haube und Gesichtsschild sind *ein* Objekt (`Kappe`). Die Mittellinie
   Kinn → Stirn → Scheitel ist eine Hermite-Kurve durch Messpunkte der Vorlage (`CENTER` in
   `helm_build.py`); Abweichung Braue–Scheitel ≤ 0,001 H.
2. **Gesicht = Keil.** Die Front ist ein Keil `F(x,z) = Mittellinie(z) + Rücksprung(|x|)`
   (`dy_tab`, aus Draufsicht der Vorlage). Mittelgrat 6°, läuft zwischen Z 0,56 und 0,82 weich aus.
3. **Übergänge weich, nie geschnitten.** Kuppel und Keil werden mit polynomialem Smooth-Max (k 0,05)
   vereinigt – wirkt nur an der Schnittlinie. Keine Bisect-Schnitte, keine Lattice.
4. **Kanten als Fugen, nicht als Teile.** Gliederung des dunklen Gusses nur durch eingeschnittene Fugen
   (0,005 breit, 0,003 tief): Stirnkeil mit Spitze, Wangenfuge Z 0,36, Seitenfuge. Nasenmodul als
   einziges aufgesetztes Teil (+0,012 vor dem Guss).
5. **Augen in Höhlen.** Trapezschlitze (außen höher), umlaufende Schrägwand 0,016, Tiefe 0,026,
   Leuchteinlage am Boden.
6. **Unterkante des Gusses** als stetige Kurve über y: Kinn 0,215 → Wange 0,42 → Schläfe 0,644
   (Brauenhöhe) → Krempe 0,765. Die Kuppel wird spaltenweise auf diese Kante parametrisiert (keine Treppen).
7. **Weiße Schale** analytisch (Superellipsen-Querschnitte), vorn an den Keil geklemmt (Abstand 0,035),
   Kragenstufe Z 0,30/0,31. Krempe nur als schmales Band seitlich/hinten (Z 0,70–0,765, kein Hut).
8. **Weiße Unterschale + Kinnrand.** Die weiße Schale läuft seitlich und hinten ohne Kragenstufe bis zur
   Basis (Z 0) – sie ist die große Seitenfläche, kein Halskragen. Der Rand (`band_oben`, φ = Winkel um den Kopf):
   vorn **flaches, kantiges V** – Mittelstück Z 0,15 (φ < 12°), gerade Flanken bis Z 0,30 an der Kieferecke (φ 58°);
   danach fällt er seitlich/hinten auf eine **niedrige Basis** Z 0,02–0,16. Vorn 0,04 vor der Maske, Außenfläche
   mit Stufe und Fasen. Vorderfläche geschlossen (kein Lüftungsgitter); hellgrauer Trapez-Einsatz direkt unter dem
   Mittelstück. **Guss-Unterkante** (`guss_unterkante`): vorn Rand − 0,012, ab φ 48–66° in die Diagonale zur
   Schläfe (Z 0,29 → 0,644). Übergang schwarz → weiß: Guss-Kante gerundet (Bevel 0,007).
9. **Hinterkopf**: Kuppel trägt die Rundung; **Rückmodul** als aufgesetzter Körper (1,2 × 1,5 × 1,15 der
   Grundbox, Achteckplatte, Hebel, eigene Antenne).
9a. **Gesichtsgliederung**: schmale Augenschlitze x 0,10–0,245, Z 0,505–0,578, außen höher, in Höhlen;
   Fugen: unter den Augen waagerecht, dann der Kieferlinie folgend; untere Panelgrenze schräg nach außen-oben
   (trapezförmige Seitenpanels); senkrechte Fugen neben dem Mittelstück; Schläfenfuge. **Mittelstück** schmal
   (0,10–0,14 breit) mit aufgesetzter zweiter Stufe. Statt runder Scheiben **kantige Schläfenpanzer** neben den Augen.
9b. **Ohrmodule** beidseitig: graue Superellipsoid-Kapseln (0,11 × 0,15 × 0,30) auf Ohrhöhe Z 0,60, mit dunklen
   Kreisdetails und Halter; links lange Antenne, rechts kurzer Stummel. **Spiralschlauch** vom Modul unten über die
   Seite zum Rückmodul (Abstand zur Schale ≥ 0,02).
10. **Anbauteile sitzen** per Raycast auf der echten Fläche (Schrauben, Gelenkscheiben, Halter).
11. **Hilfsobjekte** (Schneidekörper, Trägerhülle) hängen am `HELM_ROOT` – sonst verrutschen sie im Turntable.

## 4. Derzeit ausgebaut (Sammlung `AUSGEBAUT`, ausgeschlossen)
Alte olivgrüne Pods (ersetzt durch Ohrmodule), Platten, Bügel, Halterarme, Rückbox-Anschlüsse, alte Antenne,
Kopfgurt, Schnalle, Gurthalter, Laschen, Maskenhalter-Würfel, runde Gelenkscheiben. Wieder einbauen: Sammlung einschließen.

## 5. Materialien (prozedural, EEVEE/Cycles)
| Material | Farbe | Rauheit | Metall | Besonderheit |
|---|---|---|---|---|
| MAT_Dunkel | #2B2D30 | 0,74 | 0,05 | **matt** (Specular 0,32); kein Kantenabrieb auf dem Guss |
| MAT_Weiss | #D3D1CB | 0,70 | 0 | feine Kratzer + großflächige Verschmutzung (Noise) |
| MAT_Modul | #6E6D68 | 0,62 | 0,15 | Ohrmodule, Einsatz |
| MAT_Pod | #5A574D | 0,60 | 0,20 | Rückbox |
| MAT_Metall | #6E6E6E | 0,30 | 1,0 | Schrauben, Hebel |
| MAT_Leucht | Emission #7FE6E0, 2,2 | – | – | Augen |
Kantenabrieb (Geometry-Nodes-Attribut `wear`) nur an kleinen Anbauteilen – auf großen Flächen erzeugt er Flecken.

## 6. Licht und Bühne
Hohlkehle #8A8C90 mit sphärischem Verlauf (dunkle Vignette), Welt 0,18. Key vorn-oben-links 420 W,
Fill hinten 220 W, Oben 35 W, Kante rechts 110 W. AgX, Belichtung −0,35. EEVEE mit Raytracing,
**Fast GI aus** (rauscht). Präsentationskamera 85 mm, Abstand 3,2 H, Ziel Z 0,5.
Turntable: Halt 1–36, Ease-in bis 72, 1,5°/Frame, Ease-out bis 312, Halt bis 336 (24 fps).

## 7. Was nicht funktioniert hat (nicht wiederholen)
- **Teile einzeln bauen und aneinander klemmen** (Keilfunktion F, Lauf 2/3) → Lappen, Falten, Sprünge. Ein Volumen, Teile daraus schneiden (Lauf 4).
- Bauplan-Superellipsen als Endform → generischer Zylinderhelm.
- Facetten per Bisect / Lattice → harte oder schwammige Kanten.
- Haube und Schild als zwei Teile → sichtbare Querfuge, auch bei deckungsgleicher Fläche.
- sqrt-Smooth-Max → Delle an der Braue (drückt um k/2 zurück).
- Shrinkwrap direkt auf Meshy → Beulen (Gurt, Rauschen), Z-Fighting.
- EXACT-Boolean ohne Self-Modus auf dünnen Platten → Objekt verschwindet.
- Klemmen der Schale an den Keil auch hinten → Schale „explodiert“.
- Kinnleiste als Bogen nur vorn + getrennte Kragenblenden → wirkt angesetzt; richtig ist ein umlaufendes Band.
- Band über die Kragenstufe (Z 0,30) ziehen → gezackte Oberkante; Band bleibt darunter.
- Dünnes Band mit Luft vor dem Schirm → wirkt wie ein Bügel; richtig ist ein massiver Rand mit Querschnitt.
- Guss-Unterkante stückweise (Rand / Diagonale) → Sprung 0,07 an der Kieferecke → Falte. Immer stetig überblenden.
- Guss-Rand radial auf die Schale ziehen, wo er weit davor steht → Falte; dort nur abrunden.
- Kinnrand seitlich hochziehen → wirkt als Bügel, Seitenschale zu klein. Richtig: Rand seitlich niedrig, Schale groß.
- Überstand beim Glätten als absoluten Abstand mitteln → seitliche „Laschen“; nur den Überstand glätten.
- Anbauteile auf Hilfsflächen projizieren, die hinter dem Guss liegen → verrutschen; direkt auf den Guss projizieren.
- Kappenkante absenken, ohne die Braue davon zu trennen → Brauenebene schneidet in die Augensockel (`browY` getrennt halten).
- Augenschlitz breiter + stärker gegiert, um ihn im Profil zu zeigen → vorn „wütende“, zu große Augen. Richtig: eigenes Seitenfenster.
- Maskenhinterkante nach Kritikerwort weit nach hinten (z −0,03) → Weiß seitlich zu schmal; Referenz vermessen: z ≈ 0,03.
- Kritiker-Urteile zur Weiß-Masse schwanken zwischen Runden (R5/R7 „zu viel“, R8 „zu wenig“) → nur umsetzen, was die Messung bestätigt.
- Seitenreferenz als exakte 90°-Ansicht lesen → falsches „Seitenfenster“ fürs Auge. Die Referenz ist ≈ 65–70° gedreht.
- Scheitel vorn verbreitern, um das Dach „flacher“ zu machen → Kuppel wirkt kastig; flach wird es über die gerade Stirnschräge.
- Exakter Boolean auf der exportierten 2h-Haube → riesiger Müllkörper (Hülle offen). Immer `bisect` + Flächen löschen.
- Lauf-5-Maske unter die 2h-Haube setzen → Stufe/Überstand an der Fuge und wieder die „Mulde“; Nutzer will die 2h-Gesichtsplatte ganz.
- Kinnleiste weich scheren → zerknitterte Facetten; starr anheben und oben schneiden.
- `read_homefile()` innerhalb eines `bpy.app.timers`-Jobs → Job wird abgeräumt, nichts passiert. Immer vorher direkt aufrufen.

## 8. Dateien
- `helm_bauen.py` – Reihenfolge der Bauschritte (Einstieg)
- `helm_lib.py` – Hilfsfunktionen (Loft, Superellipse, Materialien, Viewport)
- `helm_build.py` … `helm_build7.py` – Bauschritte; gültig sind die in `helm_bauen.py` aufgerufenen
- `testlog.md` – Messprotokoll aller Läufe
- `helm_live_test.blend` – aktueller Stand (aus `helm_bauen.py` gebaut, Skripte als Textblöcke), `helm_live_test_2f.blend` – Sicherung 2f
