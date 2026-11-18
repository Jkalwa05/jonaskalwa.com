# Kalwa Software: Objelis in Weiß und Blau

Die Website übernimmt das Corporate Design von objelis (Cabinet Grotesk, Switzer, große enge Headlines, Zweispalter, Linien-Schemas) und kehrt es um: statt Schwarz und Grün jetzt Weiß und Blau, ergänzt um farbige Flächen. Spezifikation: `docs/superpowers/specs/2026-11-18-kalwa-objelis-weiss-design.md` (mit Nachtrag zum Feedback vom 18.11.2026). Plan: `docs/superpowers/plans/2026-11-18-kalwa-objelis-weiss.md`.

## Quellen und Build
- `src/`: Seiten (`pages/`, `sections/`), Inhalte (`content/site.json`, `content/cv.json`), Zeichnungen (`art/`), CSS-Module (`css/`), JS-Module (`js/`).
- `brand/tokens.json` ist die einzige Quelle der Tokens und wird zu `dist/tokens.css`.
- `npm run build` erzeugt `dist/` (Seiten, `styles.css`, `app.js`). `dist/assets/` (Bilder, Schriften) wird nie angefasst.
- `npm run dev` liefert ausschließlich auf `127.0.0.1:4173`. `npm test` führt alle Prüfungen in `scripts/tests/` aus.

## Look
- Flächen: Hero Blau `#2857EB`, Leistungen Weiß, Praxis helles Blau `#EDF1FB`, objelis Nachtblau `#0B1020`, Über mich Weiß, Kontakt Blau, Fuß Nachtblau. Jeder Abschnitt trägt eine Theme-Klasse (`theme-*` in `css/themes.css`), die `--bg`, `--ink`, `--hair`, `--accent` lokal überschreibt.
- Schrift: Cabinet Grotesk 800 (Headlines), Switzer (Text und Eyebrows in Satzschreibung). Keine Mono-Schrift, keine Versalien-Labels, keine Maße, keine Chips.
- Bausteine: Pill-Buttons (primär gefüllt, sekundär Outline), Textlink mit durchlaufender Unterstreichung, Haarlinien nur in Listen.
- Hero: große angeschnittene Gerätebühne (Laptop mit dem Foto-Ausschnitt der AK-Website, Smartphone, Rahmen in CSS). Mobil nur das Smartphone. Die Würfel über dem weißen Bild werden blau.
- Kopfleiste: schwebende abgerundete Pille, ab 8 px Scroll sichtbar, Farben folgen dem Bereich darunter (`data-on`, `js/theme.js`).
- Würfel: ein abgerundeter Würfel pro Abschnitt am rechten Rand; jeder Würfel ist blau auf hellen Flächen und weiß auf Blau und Nachtblau, live je nach Untergrund an seiner Stelle. Das Label erscheint 1,8 s nach einem Wechsel sowie bei Hover und Fokus.
- Leitende Achse (Leistungen): Linie unter dem Kopf, die sich von links und rechts zur Mitte blau füllt (T-Stück), darunter setzt die senkrechte Achse mit einem Punkt je Leistung an und füllt sich beim Scrollen. Die Zeichnung wechselt, wenn die Überschrift des nächsten Blocks die Fenstermitte erreicht.
- Keine festen Trennlinien zwischen den Bereichen: die Farbflächen trennen.
- objelis: Drahtgittermodell groß neben dem Text (ohne fremde Oberfläche). Praxis: Laptop über die volle Rasterbreite, ein Foto bündig in der rechten Spalte, keine Bildunterschriften.

## Bewegung
GSAP mit SplitText und ScrollTrigger. Eine Ease (`0.2,0.7,0.2,1`), Dauern 200/400/800 ms, Hero-Auftritt unter 1,4 s, danach sanfte Scroll-Kopplung der Geräte (nur `transform`). Natives Scrollen, kein Scroll-Hijack. Es gibt keine Endlosanimation. `prefers-reduced-motion` und fehlendes JS zeigen die fertige statische Fassung; fällt `app.js` aus, werden Inhalte nach 4 s trotzdem sichtbar.

## Prüfung
`npm run build && npm test`: Fundament, Hero, Leistungen, Praxis und objelis, Über mich und Kontakt, Würfel, Unterseiten, Bewegung, Qualität (axe WCAG 2.2 AA, Überlauf 320 bis 2560 px, Tastatur, LCP/CLS, Dateigrößen) und Look. Sichtprüfungen und Befunde: `qa/weiss/`.

## Grenzen
Nur lokal. Keine Veröffentlichung, kein Deployment, kein Push ohne ausdrückliche neue Freigabe durch Jonas (AGENTS.md). Die Rechtstexte sind für die lokale Vorschau formuliert und müssen vor einer späteren Veröffentlichung hostingabhängig ergänzt werden.
