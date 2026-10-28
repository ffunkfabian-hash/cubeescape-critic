# Helm im Browser – alle Durchläufe

Jeder Durchlauf = Änderung am Generator, `npm run verify` (vier Ansichten, Umriss-IoU), Sichtvergleich mit dem Video.
Zwei Messungen: **A** = ganzes Bild inklusive Schal (Runde 1), **B** = nur oberhalb der Schalkante der Vorlage (ab Runde 2,
seit der Schal entfernt ist). Zwischenstände innerhalb einer Runde sind nicht einzeln committet; abrufbar sind die
Rundenenden (Commit in der letzten Spalte).

## Runde 1 – Erstaufbau (27.10.2026, Messung A)

| # | Änderung | front | left | back | right | Mittel | Ergebnis |
|---|---|---|---|---|---|---|---|
| 1 | Erstaufbau: Superellipsoid-Kuppel, Frontplatte aus Silhouetten, Kiefer, Ohrkappe, Funkmodul, Rippenschlauch, Schal | 0,937 | 0,898 | 0,914 | 0,882 | 0,908 | behalten |
| 2 | Frontplatte schmaler (weiße Kieferseiten sichtbar), Helm vorn länger, Bloom gedämpft, Schal glatter | 0,937 | 0,897 | 0,917 | 0,896 | **0,912** | behalten |
| 3 | Erhabene Frontplatte, Kinn weiter vor, Kamerawinkel links 64°/rechts 298° | 0,938 | 0,891 | 0,918 | 0,889 | 0,909 | behalten |
| 4 | Kuppel geneigt, Schal mit Längsfalten, Augen gedimmt | 0,938 | 0,887 | 0,919 | 0,886 | 0,907 | Neigung verworfen (verschob Visier/Mund – Ursache später: CSG-Fehler) |
| 5 | Neigung zurück | 0,938 | 0,885 | 0,916 | 0,885 | 0,906 | behalten |
| 6 | Kantigere Kuppel (Exponenten 0,55/0,45) | 0,930 | 0,875 | 0,911 | 0,878 | 0,899 | verworfen |
| 7 | Exponenten 0,65/0,55 | 0,939 | 0,887 | 0,918 | 0,887 | 0,908 | Stand Runde 1 (`eb8bb58`, Version 0.0.2) |

## Runde 2 – Profil, Facetten, ohne Schal (28.10.2026)

| # | Änderung | front | left | back | right | Mittel | Ergebnis |
|---|---|---|---|---|---|---|---|
| 8 | CSG-Fix (Transformation einbacken) + Kuppelmitte auf Ursprung, Messung A | 0,939 | 0,888 | 0,918 | 0,888 | 0,908 | behalten |
| 9 | Grundform als Schnitt dreier Profile + großer Superellipsoid, Messung A | 0,905 | 0,850 | 0,896 | 0,862 | 0,878 | verworfen („Kiste“) |
| 10 | Grundform als Loft aus drei Profilen; Schal und Büste entfernt; ab hier Messung B | 0,890 | 0,872 | 0,856 | 0,861 | 0,870 | Form behalten, rundum ~2–3 cm zu groß |
| – | Vergleichswert: Stand Runde 1 mit Messung B | 0,926 | 0,921 | 0,896 | 0,884 | 0,907 | Referenz |
| 11 | Profile oben eingezogen | 0,922 | 0,911 | 0,885 | 0,896 | 0,904 | behalten |
| 12 | Frontplatte reicht an der Wange zurück, Ohrkappe +30 %, Spiralkabel, graue Strukturflächen, Weiß grauer, Augen ruhiger | 0,923 | 0,910 | 0,881 | 0,898 | 0,903 | behalten |
| 13 | Kiefer vorn nur als Steg, größere Schläfenplatten | 0,923 | 0,910 | 0,881 | 0,898 | 0,903 | behalten |
| 14 | Rückplatte um die Heck-Box, Kragenkerben, dünnere Ohrkappe | 0,923 | 0,910 | 0,881 | 0,898 | 0,903 | behalten |
| 15 | Ebene Facetten der Frontplatte, Augen ohne Bloom | 0,923 | 0,910 | 0,881 | 0,898 | 0,903 | behalten |
| 16 | Material: Anthrazit statt Schwarz, Weiß mit Gebrauchsspuren | 0,923 | 0,910 | 0,881 | 0,898 | 0,903 | behalten |
| 17 | Strukturflächen grauer, Funkmuschel runder, Fugen an der Kuppelseite | 0,922 | 0,910 | 0,882 | 0,897 | 0,903 | Stand Runde 2 (`0c4008b`) |

## Runde 3 – Augenhöhlen, spitze Front, Fasen (28.10.2026, Messung B)

Rückmeldung: Augen saßen in Runde 1 schöner in ihren Kerben, die Details von Runde 2 gefallen; Front läuft im Video
spitzer zu; bessere Übergänge zwischen den Formen.

| # | Änderung | front | left | back | right | Mittel | Ergebnis |
|---|---|---|---|---|---|---|---|
| 18 | Augenhöhlen (Pyramidenstumpf), Fugen unter den Augen, Mundschlitz, sechseckige Schläfenplatten | 0,922 | 0,910 | 0,882 | 0,896 | 0,903 | teilweise: Nasengrat-Fugen falsch, Schläfenplatte zu groß, Leuchten zu weiß |
| 19 | Leuchten sattes Cyan, schmalere Fassung, Fugen und Schläfenplatte korrigiert | 0,922 | 0,909 | 0,882 | 0,896 | 0,902 | behalten |
| 20 | Front aus zwei Ebenen mit Mittelgrat, Fasen an allen Facettenkanten | 0,923 | 0,918 | 0,882 | 0,893 | **0,904** | behalten |
| 21 | Augenhöhle an der V-Front ausgerichtet und verlängert, Wangenmarkierungen, Schraubenreihen, Nieten | 0,923 | 0,917 | 0,882 | 0,893 | 0,904 | Stand Runde 3 (`966721d`) |

## Offen

Seitenfläche neben dem Auge zu flach mit harter Hell-Dunkel-Grenze; weißer Block zwischen Schläfenplatte und Ohrkappe
klotzig; Hinterkopf schlichter als im Video.
