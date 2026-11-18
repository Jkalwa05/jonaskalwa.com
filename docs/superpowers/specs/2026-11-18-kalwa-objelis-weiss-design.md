# Kalwa Software: Objelis in Weiß und Blau (Design-Spezifikation)

Stand: 18.11.2026 · Freigegeben im Gespräch von Jonas · Nur lokal (127.0.0.1:4173), kein Deployment, kein Push (AGENTS.md).

## Ziel
Kalwa Software ist die Dachmarke für Kundenprojekte (Websites, individuelle Software, Automatisierung/KI) und eigene Produkte (objelis). Die Website übernimmt das Objelis-Corporate-Design, aber invertiert: weißer Grund statt Schwarz, ein Blau statt Hologramm-Grün. Sie darf nicht nach KI-Vorlage aussehen. Erfolgskriterium nach Jonas: Die Seite ist handwerklich so stark, dass niemand an der Qualität des Anbieters zweifelt. Animationen sind sehr sauber, nie "TikTok-Overhype".

Der bisherige Entwurf „Passung“ wird in der Komposition vollständig ersetzt. Der Inhalt bleibt weitgehend erhalten (`docs/content-strategy.md`), Technik (Tokens, lokale Schriften, Build, Tests, Serve-Skript) wird weiterverwendet.

## Ausdrücklich entfernt
Aufklappbare Leistungen und aufklappbarer Lebenslauf (`details`), kleine Zusatznotizen ohne Informationswert, blaugetöntes Zitatband, Themen-Chip-Formular, Karten-in-Karten, Three.js/WebGL-Szene.

## Look (Tokens, ein Theme)
- Grund `#FFFFFF`, Schrift `#101214`, Zweitschrift/Dritt in abgestuftem Grau (Kontrast ≥ 4.5:1), Blau `#2857EB` nur für Linien, Punkte, Fokus, Chips, aktive Zustände. Nie als Fläche, nie als Fließtext.
- Haarlinien: Schriftfarbe bei 12 % und 22 %.
- Cabinet Grotesk 800 (Headlines, sehr groß, eng), Switzer 400–700 (Text, Bedienelemente), Tabular (Mono-Labels, Maße). Lokal gehostet.
- Pill-Buttons (primär schwarz mit weißer Schrift, sekundär Outline), Radius 20/8 px, 4-px-Raster. Keine Schatten, Verläufe, Glas, Emojis.
- Mono-Labels in Versalien (z. B. SCHEMA, ZIEL, BEISPIEL) und Maß-Chips (Pille, Haarlinie, Mono) wie bei Objelis.

## Seiten
- `/` Startseite (unten), `/lebenslauf/` (eigene Seite, alles sichtbar), `/impressum/`, `/datenschutz/`, 404. `/design-system/` bleibt als interne Referenz (noindex).
- Navigation: Wortmarke links; rechts Leistungen, Projekte, Über mich, Lebenslauf, Pill „Projekt besprechen“. Unter 960 px ein Menü mit Escape/Fokus-Verhalten wie bisher.

## Startseite (Abschnitte, alle offen sichtbar)
1. **Hero:** Headline „Software, die für dich arbeitet.“ (Wortlaut bleibt, Feinschliff erlaubt), kurzer Text, zwei Buttons. Rechts großer echter AK-Website-Screenshot mit blauen Maßlinien (Breite, Höhe) und Mono-Chips (z. B. „1440 px“). Mobil steht die Kontaktaktion vor dem Bild.
2. **Leistungen:** drei Blöcke im Objelis-Muster: Linien-Schema in Blau, Label, Titel, Text, Zeile „Ziel“. Websites und Sichtbarkeit · Individuelle Software · Automatisierungen und KI. Auf großen Bildschirmen bleibt die Zeichnung links sticky und wechselt mit dem Text rechts (natives `position: sticky`).
3. **Aus der Praxis (AK rund ums Haus):** echte Belege: Desktop, Mobil, Visitenkarte, mit Maß-Annotationen und einer sachlichen Aussage zur lokalen Sichtbarkeit. Keine Zusagen zu Rankings.
4. **objelis:** ruhiger Abschnitt, eigenes Produkt in Entwicklung. Keine Zusagen zu Messgenauigkeit, keine Kundenerfolge, die es nicht gibt (Pöppelmann ist eine Testmöglichkeit, kein Kunde).
5. **Über mich:** Porträt, Jonas' Text in seiner Stimme, Eckdaten als sichtbare Tabelle (Studium, Arbeit, GitHub, LinkedIn). Quellen: `LinkedIn Profil.md`, `Kalwa_Software_Meine_Vision.md`.
6. **Kontakt:** „Was möchtest du leichter machen?“ E-Mail als Hauptaktion: „E-Mail vorbereiten“ (mailto mit Entwurf) und Adresse kopieren. Kein Formular, kein Tracking, kein Backend.

## Abschnitts-Würfel (Scroll-Fortschritt)
- Am rechten Rand, vertikal mittig, fest positioniert: ein kleiner, sauber abgerundeter Würfel pro Abschnitt der Startseite (6 Stück).
- Gestaltung: flache, abgerundete Quadrate (ca. 10 px, Radius 3 px), keine Schatten. Ausstehend: Haarlinie. Bereits passiert: blau gefüllt. Aktiv: größer (ca. 14 px), blau, mit kurzem Mono-Label (Abschnittsname).
- Verhalten: Zustand folgt der nativen Scrollposition (IntersectionObserver). Klick/Tastatur springt zum Abschnitt (Anker). Übergänge 200–400 ms mit der gemeinsamen Ease.
- Zugänglichkeit: `nav` mit Beschriftung, Links mit Namen, `aria-current="true"` am aktiven Würfel, sichtbarer Fokus. Unter 960 px ausgeblendet. Er darf Inhalt und Kontrast nie stören.
- Auf Unterseiten (Lebenslauf, Rechtliches) nicht vorhanden.

## Animation (GSAP + ScrollTrigger, vorhanden im Projekt)
- Hero-Auftritt unter 1,4 s: Headline zeilenweise aus Maske, danach zeichnen sich die Maßlinien (stroke-draw), Chips nacheinander.
- Scroll: Haarlinien zeichnen sich von links, Überschriften mit Maskenreveal, Schemas zeichnen sich beim Scrollen. Leistungen mit Sticky-Wechsel.
- Mikro: Button-Füllung, durchlaufende Link-Unterstreichung, Navigations-Haarlinie ab 8 px Scroll. Seitenwechsel mit View Transitions, soweit der Browser sie kennt.
- Regeln: eine Ease-Familie, Dauer 200/400/800 ms. Natives Scrollen, kein Scroll-Hijack, keine Inhalte hinter Animationen, Animation pausierbar. `prefers-reduced-motion` und fehlendes JS zeigen die vollständige statische Fassung. Nur `transform`/`opacity` animieren.

## Inhalt und Wahrheit
Keine erfundenen Referenzen, Preise, Fristen oder Zahlen. Deutsch, Anrede „du“ (wie im bisherigen Entwurf und in Jonas' Stimme). Keine Gedankenstriche in eigenen Texten und keine Markennamen Dritter als Logos. Arbeitgeber/Zertifikat gelten als Hintergrund, nicht als Kundenreferenz.

## Nicht-Ziele
Kein Deployment, keine Änderung an `jonaskalwa.com`, kein Backend, keine Cookies, kein Tracking, kein CMS, keine neue Domain-Konfiguration, keine hostingabhängigen Texte.

## Prüfung vor „fertig“
`npm run build`, `npm test`, `npm run test:motion`, `npm run test:design` (Tests werden an den neuen Aufbau angepasst, nicht abgeschwächt). Echte Screenshots bei 390, 768 und 1440 px, axe ohne Verstöße, Kontrast, Tastaturbedienung, 200-%-Reflow, Reduced-Motion-Fassung, Performance-Messung. Danach harte Kritik durch den Design-Critic-Agenten und Behebung seiner Punkte. Ergebnisse in `qa/`.

## Änderungen nach Feedback von Jonas (18.11.2026, nach Sichtung des Zwischenstands)
Diese Punkte ersetzen widersprechende Stellen oben.
- **Keine Maße:** Maßlinien, Pixel-Chips, „ak-rundum.com“-Tag und Mono-Chips entfallen überall. Sie wirkten „vibecodet“.
- **Schrift:** Die Mono-Schrift (Tabular) entfällt für Labels. Eyebrows und Beschriftungen stehen in Switzer, Satzschreibung, ohne Sperrung und ohne Versalien. Cabinet Grotesk bleibt für Headlines.
- **Farbe und Trennung:** Die Seite arbeitet mit farbigen Flächen statt nur Weiß und Schwarz. Reihenfolge: Hero Blau, Leistungen Weiß, Praxis helles Blau, objelis Nachtblau, Über mich Weiß, Kontakt Blau, Fuß Nachtblau. Blau ist damit auch Fläche. Haarlinien trennen keine Bereiche mehr, nur noch Listen.
- **Hero:** große, angeschnittene Gerätebühne (Laptop und Smartphone) mit den echten AK-Screenshots, auf Blau, mit sanfter scrollgekoppelter Bewegung (nur transform). Keine Maße, keine Linien.
- **Würfel:** passen ihre Farbe an den Abschnitt darunter an (hell, blau, nachtblau).
