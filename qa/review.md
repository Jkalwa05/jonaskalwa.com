# Prüfung der Kalwa-Software-Website

Stand: 16. November 2026. Ergebnisse gelten für die lokal geprüfte statische Website, nicht für reale Endgeräte oder gemessene Nutzerdaten im Feld.

| Dimension | Ergebnis | Evidenz |
| --- | --- | --- |
| Funktion | PASS | Navigation, native Leistungs-Disclosure, thematischer E-Mail-Entwurf, Eingaben bleiben erhalten, mobile Escape-/Fokus-Rückgabe, CV-Deep-Link; `results.json` |
| Barrierefreiheit | PASS für automatisierte Prüfungen | axe-core WCAG 2.2 A/AA: 0 Verstöße auf Startseite bei 390/1440 sowie Impressum, Datenschutz und 404; Tastaturpfad gesondert getestet |
| Responsive | PASS | 320, 390, 768, 1024, 1440: keine horizontale Überbreite und keine defekten Bilder; Screenshots erstellt und angesehen |
| Visuelles Design | überprüft | Hero, Projektstrecke, reale Druckkarten, Objelis, Porträt, Kontaktschluss und Footer bei Desktop/Mobil angesehen; überlappende Hero-Bildnotiz entfernt, abgeschnittenen Objelis-Screenshot korrigiert |
| Fallback | PASS | Ohne Website-JavaScript alle Texte, Bilder, Navigation und Kontakt sichtbar; nativer CV aufklappbar. Bei reduzierter Bewegung keine laufenden Animationen |
| Performance | lokale Plausibilitätsprüfung | Kleine WebP-Dateien, lokale Schriften, Lazy Loading, keine Laufzeit-Bibliothek oder Drittanbieteranfrage. Lokale CLS-/LCP-Messwerte in `results.json`; keine Aussage über Feld-p75 oder INP |

Eine unabhängige Codeprüfung fand keine wichtigen oder kritischen Fehler. Der einzige konkrete kleine Befund war das fehlende Social-Share-Bild; dieses wurde ergänzt.

Die vollständige `accuracy_report.mjs` des UX-Kits prüft dessen mitgelieferte Demo- und Komponenten-Bibliothek. Sie wäre keine Messung dieser Website. Deshalb werden hier nur tatsächlich auf den eigenen Seiten ausgeführte Browser- und Inhaltsprüfungen als Nachweis verwendet. Taste-Gate-Ausgabe separat in `taste-gate.txt`; eventuelle formale Stilabweichungen werden dort nicht als Produktfunktion gewertet oder verborgen.

Nicht gemessen: reale Mobilgeräte, Safari auf iOS, Screenreader-Praxis, Feld-Core-Web-Vitals. Die integrierte Browseransicht konnte wegen eines nicht verfügbaren Browser-Hosts nicht geöffnet werden; Headless-Chromium für die Prüfungen war verfügbar.

## Baseline und bewusster Ersatz

Das Original von `Jkalwa05/jonaskalwa.com` hatte `/` und `/cv.html`, einen EN/DE-Umschalter mit `localStorage.lang`, E-Mail-/LinkedIn-Links und einen dekorativen Mauszeiger. Vor dem Ersatz wurden beide Routen bei 390 und 1440 aufgenommen. Der Nutzer hat ausdrücklich den Ersatz des alten CV-Auftritts durch Kalwa Software beauftragt. Die neue Seite spricht Deutsch, integriert den aktuellen CV, erhält die Kontaktwege und leitet den alten CV-Pfad weiter. Das Original bleibt unter Commit `6ce9025492aea0647414dfd6621acc902727469c` erreichbar.
