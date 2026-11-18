# Kalwa Software: Objelis in Weiß und Blau, Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Kalwa-Software-Website im invertierten Objelis-Design (Weiß/Blau) neu aufbauen, ohne Aufklapper, mit sauberer Animation und dem Abschnitts-Würfel-Fortschritt am rechten Rand.

**Architecture:** Quellen liegen neu unter `src/` (HTML als JS-Template-Funktionen, CSS in Modulen, JS in ES-Modulen), `scripts/build-site.mjs` erzeugt daraus `dist/` (Seiten, `styles.css`, `app.js`) per esbuild. Tokens kommen weiter aus `brand/tokens.json` → `dist/tokens.css`. Bilder und Schriften in `dist/assets/` bleiben unverändert liegen und werden nie vom Build gelöscht. Tests sind Playwright-Dateien mit `node:test` gegen einen lokal gestarteten Server.

**Tech Stack:** Node ≥ 22, esbuild 0.28.2, GSAP 3.13.0 (inkl. ScrollTrigger, SplitText, CustomEase), Playwright 1.63.0, axe-core 4.10.2. Three.js wird entfernt.

**Spec:** `docs/superpowers/specs/2026-11-18-kalwa-objelis-weiss-design.md` (Executor liest sie zuerst.)

## Global Constraints

- Nur lokal: Server ausschließlich auf `127.0.0.1` (Dev: Port 4173, Tests: Port 4181). Kein Deployment, kein Push, kein Vercel, keine Änderung an `../jonaskalwa.com` (AGENTS.md). Keine Commits, solange Jonas nicht darum bittet; Checkpoint ist jeweils die grüne Testausgabe.
- Farben: Grund `#FFFFFF`, Schrift `#101214`, Blau `#2857EB` nur für Linien, Punkte, Fokus, Chips, aktive Zustände; nie Fläche, nie Fließtext. Haarlinien: Schriftfarbe bei 12 % und 22 %. Graustufen für Zweittext erreichen ≥ 4.5:1.
- Schriften lokal: Cabinet Grotesk 800 (Headlines), Switzer 400–700 (Text), Tabular (Mono-Labels/Maße).
- Pill-Buttons (primär schwarz/weiß, sekundär Outline), Radius 20 px und 8 px, 4-px-Raster. Keine Schatten, Verläufe, Glas, Emojis, keine `<details>`/Akkordeons.
- Bewegung: eine Ease-Familie (`cubic-bezier(0.2,0.7,0.2,1)`), Dauern 200/400/800 ms, Hero-Auftritt unter 1,4 s, nur `transform`/`opacity`, natives Scrollen, kein Scroll-Hijack, keine Inhalte hinter Animation, `prefers-reduced-motion` und fehlendes JS zeigen die fertige statische Fassung.
- Sprache Deutsch, Anrede „du“, `lang="de"`, keine Gedankenstriche in eigenen Texten, keine Fremdmarken-Logos. Keine erfundenen Referenzen, Preise, Fristen oder Zahlen; objelis ist „in Entwicklung“, Pöppelmann ist Arbeitgeber, keine Kundenreferenz.
- Kontaktdaten, Adresse, Telefon und Lebenslauf-Einträge werden aus dem bisherigen `dist/index.html` und `scripts/generate-pages.mjs` unverändert in `src/content/*.json` übernommen, nicht neu formuliert.
- Alles bleibt unter `website/`. Keine Cookies, kein Tracking, kein Backend, keine externen Requests.
- Kein Playwright-Browser ist installiert, der zur Version passt: Tests laufen mit `CHROME_PATH=~/Library/Caches/ms-playwright/chromium_headless_shell-1254/chrome-headless-shell-mac-arm64/chrome-headless-shell`.

## Review Focus

- Ohne JavaScript: Jeder Inhalt, jede Zeichnung und jeder Link ist sichtbar und benutzbar (nichts startet unsichtbar, solange `html.js` fehlt).
- `prefers-reduced-motion: reduce`: keine laufenden Animationen, alle Inhalte sofort sichtbar, Würfel springen ohne Übergang.
- Deep Link `/#kontakt` und Zurück-Taste: Ziel liegt nicht unter dem festen Kopf, der passende Würfel ist beim Laden aktiv.
- Kurze oder schmale Fenster (1024×600, 320 px breit, 200 % Zoom): Sticky-Zeichnung verdeckt keinen Text, kein horizontales Scrollen, Würfel überlappen keinen Inhalt.
- Zwischenablage nicht verfügbar oder verweigert: „Adresse kopieren“ zeigt eine verständliche Meldung, die Adresse bleibt als Link nutzbar.

---

### Task 1: Fundament (Build, Tokens, Layout-Gerüst, Testharness)

**Files:**
- Create: `scripts/build-site.mjs`, `scripts/lib/harness.mjs`, `scripts/tests/01-foundation.test.mjs`, `src/content/site.json`, `src/layout.mjs`, `src/pages/home.mjs`, `src/css/main.css`, `src/css/base.css`, `src/css/layout.css`, `src/css/components.css`, `src/js/main.js`, `src/js/motion-core.js`, `src/js/nav.js`
- Modify: `package.json` (Skripte, `three` entfernen), `brand/tokens.json` (Tokens ergänzen), `scripts/check-static.mjs`
- Delete: `src/assembly.js`, `scripts/build-motion.mjs`, `scripts/generate-pages.mjs`, `scripts/generate-system.mjs` (Inhalte vorher nach `src/content/site.json` und `src/pages/legal.mjs` in Task 7 übernehmen), `dist/motion.js`, `dist/assets/moments/`, alte `scripts/verify*.mjs` (am Ende von Task 9)
- Reference only: `qa/legacy-passung/` (Kopie von `dist/index.html`, `dist/styles.css`, `dist/app.js`, `src/assembly.js`, `scripts/generate-pages.mjs`, vor dem ersten Löschen anlegen)

**Interfaces:**
- Produces: `src/content/site.json` mit `{name, tagline, email, phone, address:{street,city,country}, links:{linkedin,github,ak,objelis}, nav:[{href,label}], assets:{<name>:{src,width,height,alt}}}`; `assets` enthält die echte Pixelgröße jedes verwendeten Bildes.
- Produces: `layout.mjs` exportiert `document({title, description, path, body, cubes}): string`, `header(path): string`, `footer(): string`. `home.mjs` exportiert `SECTIONS: {id, label}[]` (Reihenfolge: `start` „Start“, `leistungen` „Leistungen“, `praxis` „Praxis“, `objelis` „objelis“, `ueber-mich` „Über mich“, `kontakt` „Kontakt“) und `home(site): string`.
- Produces: `motion-core.js` exportiert `EASE` (CustomEase `kalwa`), `reducedMotion(): boolean`, `initReveal(root = document)` (animiert `[data-reveal]` als Maskenreveal bzw. Fade, setzt `data-revealed`), `drawLines(root)` (animiert `.draw` und `.hairline-draw`). Alle tun nichts, wenn `!document.documentElement.classList.contains('js')` oder `reducedMotion()`.
- Produces: `harness.mjs` exportiert `withSite(fn: ({origin, browser, newPage(opts?), axe(page)}) => Promise<void>): Promise<void>` (startet `scripts/serve.mjs` mit `PORT=4181`, wartet auf Antwort, startet Chromium mit `CHROME_PATH`, räumt auf).
- Produces: `npm run build` ruft nacheinander `build-tokens.mjs`, `build-site.mjs`, `check-static.mjs`; `npm test` führt `node --test scripts/tests/`.

- [ ] **Step 1: Sicherung und Aufräumen vorbereiten.** Alten Entwurf nach `qa/legacy-passung/` kopieren (siehe Reference only), `npm uninstall three`, `package.json`-Skripte setzen.
- [ ] **Step 2: Failing test** `01-foundation.test.mjs`, Tests: `build erzeugt index, lebenslauf, impressum, datenschutz, 404`; `index hat genau ein h1, lang=de und kein <details>`; `Seite lädt ohne Konsolenfehler und ohne horizontales Scrollen bei 320/768/1440`; `alle assets in site.json existieren und ihre naturalWidth/Height stimmen mit width/height überein`; `keine Requests außerhalb von 127.0.0.1`.
- [ ] **Step 3: Run:** `npm run build && CHROME_PATH=… node --test scripts/tests/01-foundation.test.mjs` → FAIL (build-site fehlt).
- [ ] **Step 4: Tokens ergänzen** (`brand/tokens.json`): `hair`, `hair-2` (Schriftfarbe 12 %/22 %), `ease-kalwa`, `dur-1/2/3` (200/400/800 ms), `radius-s` 8 px, `radius` 20 px, `cube-size` 10 px, `cube-size-active` 14 px, `gutter-right-cubes` 72 px. Nicht mehr benötigte Tokens (blue-wash, surface-Bänder) nur entfernen, wenn kein CSS sie nutzt.
- [ ] **Step 5: `build-site.mjs` implementieren:** Seiten aus `src/pages/*.mjs` schreiben, `src/css/main.css` per esbuild nach `dist/styles.css` und `src/js/main.js` nach `dist/app.js` (bundle, esm, minify, target es2022), `404.html` und `cv.html` (Weiterleitung auf `/lebenslauf/`) erzeugen, Assets nie anfassen.
- [ ] **Step 6: Layout-Gerüst:** `layout.mjs` (Dokumentrahmen mit Skip-Link, `<script>document.documentElement.classList.add("js")</script>`, Kopf mit Wortmarke und Navigation `Leistungen, Projekte, Über mich, Lebenslauf` plus Pill „Projekt besprechen“, Fuß mit Spalten wie bisher ohne Zusatznotizen), `base.css` (Reset, Typografie, Schriftgrößen `clamp` für Headline bis ca. 7.5 rem), `layout.css` (symmetrischer `.wrap`, Zweispalter 5/7, Haarlinie `.hairline`, 4-px-Raster), `components.css` (Pill-Buttons, `.chip` Mono-Pille, `.label` Mono-Versalien, `.text-link` mit durchlaufender Unterstreichung, Fokusring in Blau), `nav.js` (Menü-Verhalten aus `qa/legacy-passung/app.js` übernehmen: `aria-expanded`, Escape mit Fokus zurück, Klick außerhalb, `focusout`, Schließen bei Breakpoint 960 px und bei Link-Klick; Kopf-Haarlinie ab 8 px Scroll). Startseite vorerst nur mit leeren Abschnittsrahmen `<section id data-section data-label>` aus `SECTIONS`.
- [ ] **Step 7: Run:** gleiche Tests → PASS. `scripts/check-static.mjs` auf neue Pflichtinhalte umstellen (`lebenslauf/index.html` existiert, kein `<details>`, alle Hash-Anker auflösbar).
- [ ] **Step 8: Verification:** `npm run build` Ausgabe ohne Fehler; `npm run dev` zeigt Kopf und Fuß auf `http://127.0.0.1:4173/`.

### Task 2: Hero mit echtem Projekt und Maßlinien

**Files:**
- Create: `src/sections/hero.mjs`, `src/css/hero.css`, `src/js/hero.js`, `scripts/tests/02-hero.test.mjs`
- Modify: `src/pages/home.mjs`, `src/css/main.css`, `src/js/main.js`

**Interfaces:**
- Consumes: `site.assets` (Name `akDesktop`), `EASE`, `reducedMotion`, `initReveal`.
- Produces: `hero(site): string` mit `<section id="start" data-section data-label="Start">`; `initHero(root): void`.

- [ ] **Step 1: Failing test:** `h1 enthält „Software, die für dich arbeitet.“`; `zwei Buttons (Projekt besprechen als mailto-Link, Projekte ansehen als #praxis)`; `Screenshot ist das echte akDesktop-Asset mit alt`; `Chip-Texte entsprechen der echten Pixelgröße aus site.assets`; `bei 390 px steht der primäre Button im DOM und visuell vor dem Bild`; `nach 2 s sind alle Hero-Elemente sichtbar (opacity 1, Maßlinien scale 1)`; `bei reducedMotion sind sie sofort sichtbar und document.getAnimations() ist leer`; `bei JS aus ist alles sichtbar`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implementieren:** Zweispalter (Text links, Bild rechts). Maßlinien als HTML-Elemente (`.measure--w` unter, `.measure--h` rechts vom Bild, 1 px blau, Endmarken, `.chip` in Mono mit „W × H px“ aus den Asset-Werten). `hero.js`: SplitText-Zeilenmaske für h1, danach `.measure` per `scaleX/scaleY` von 0 zeichnen, Chips gestaffelt, Gesamtdauer < 1,4 s. Keine Endlosschleife.
- [ ] **Step 4: Run** → PASS. Screenshot 1440 und 390 in `qa/weiss/` ablegen und ansehen.

### Task 3: Leistungen mit Sticky-Zeichnungen

**Files:**
- Create: `src/sections/services.mjs`, `src/art/schemas.mjs`, `src/css/services.css`, `src/js/services.js`, `scripts/tests/03-services.test.mjs`
- Modify: `src/pages/home.mjs`, `src/css/main.css`, `src/js/main.js`

**Interfaces:**
- Produces: `services(site): string` (`id="leistungen"`, drei `article.service`, je `figure.schema` + Label + `h3` + Text + Zeile „Ziel“ + Textlink); `schemas.mjs` exportiert `schemaWebsite()`, `schemaSoftware()`, `schemaAutomation(): string` (Inline-SVG, viewBox `0 0 480 360`, jeder Pfad `class="draw"` `pathLength="1"`, `vector-effect="non-scaling-stroke"`, Strichstärke 1.5, blau; Beschriftungen als `.chip` in positioniertem Wrapper, nicht im SVG).
- Produces: `initServices(root): void` (zeichnet Schema beim Eintritt über ScrollTrigger, einmalig).

- [ ] **Step 1: Failing test:** `genau drei .service, Titel: „Websites & Sichtbarkeit“, „Individuelle Software“, „Automatisierungen & KI“, ihr Inhalt ist sichtbar ohne Klick`; `bei 1440×900 bleibt figure.schema sticky (top-Position bleibt gleich, während das Textende scrollt) und überlappt den Text nicht`; `bei 1024×600 und 390 px fällt es in den normalen Fluss (position static)`; `Schemas sind ohne JS vollständig gezeichnet (stroke-dashoffset 0)`; `axe ohne Verstöße im Abschnitt`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implementieren:** Pro `.service` ein Grid; ab 1100 px Breite und 720 px Höhe (`@media (min-width:1100px) and (min-height:720px)`) ist `figure` `position: sticky; top: calc(var(--header-h) + 32px); align-self: start`, `.service` hat `min-height` etwa 90 vh. Reines CSS-Sticky, kein JS-Zustand. Nur unter `html.js` startet `.draw` mit `stroke-dashoffset: 1`. Inhalte der Texte wörtlich aus `qa/legacy-passung/index.html`.
- [ ] **Step 4: Run** → PASS. Screenshots bei 1440/1024×600/390 ansehen.

### Task 4: Praxis (AK) und objelis

**Files:**
- Create: `src/sections/praxis.mjs`, `src/sections/objelis.mjs`, `src/css/praxis.css`, `src/css/objelis.css`, `scripts/tests/04-praxis-objelis.test.mjs`
- Modify: `src/pages/home.mjs`, `src/css/main.css`

**Interfaces:**
- Produces: `praxis(site)` (`id="praxis"`), `objelis(site)` (`id="objelis"`).

- [ ] **Step 1: Failing test:** `Praxis zeigt akDesktop, akMobile und Visitenkarte als echte Bilder mit alt und Maß-Chips`; `externer Link zu AK hat rel="noopener noreferrer" und target=_blank mit sichtbarem Hinweis „öffnet in neuem Tab“`; `objelis-Abschnitt enthält „in Entwicklung“ und weder „Genauigkeit“ noch „Kunde“ noch „Pöppelmann“`; `keine Wörter „garantiert“, „Ranking-Garantie“`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implementieren** im Objelis-Raster (Überschrift links, Text rechts, Haarlinien, Mono-Label „BEISPIEL“, „ZIEL“-Zeilen). Texte aus Legacy übernehmen, sachlich kürzen, „Dein direkter Ansprechpartner“-artige Notizen weglassen. objelis ohne Zusagen, Link wie vorhanden.
- [ ] **Step 4: Run** → PASS.

### Task 5: Über mich und Kontakt

**Files:**
- Create: `src/sections/about.mjs`, `src/sections/contact.mjs`, `src/css/about.css`, `src/css/contact.css`, `src/js/contact.js`, `scripts/tests/05-about-contact.test.mjs`
- Modify: `src/pages/home.mjs`, `src/css/main.css`, `src/js/main.js`

**Interfaces:**
- Produces: `about(site)` (`id="ueber-mich"`), `contact(site)` (`id="kontakt"`); `initContact(root)` (Kopierknopf mit `role="status"`-Meldung).

- [ ] **Step 1: Failing test:** `Porträt mit alt; Eckdaten (Ausbildung, Studium, Zertifikat, LinkedIn, GitHub) als sichtbare dl/Tabelle`; `Kontakt-h2 „Was möchtest du leichter machen?“`; `Hauptlink „E-Mail vorbereiten“ ist mailto mit Betreff und vorbefülltem Text`; `kein <form>, keine input-Felder`; `Kopieren schreibt die Adresse in die Zwischenablage und meldet Erfolg`; `bei verweigerter Zwischenablage (navigator.clipboard.writeText wirft) erscheint eine Fehlermeldung und der mailto-Link bleibt`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implementieren.** Über-mich-Text und Eckdaten wörtlich aus Legacy. Kontakt ohne Formular; der mailto-Link braucht kein JS.
- [ ] **Step 4: Run** → PASS.

### Task 6: Abschnitts-Würfel

**Files:**
- Create: `src/sections/cubes.mjs`, `src/css/cubes.css`, `src/js/cubes.js`, `scripts/tests/06-cubes.test.mjs`
- Modify: `src/layout.mjs` (nur Startseite rendert die Navigation), `src/css/main.css`, `src/js/main.js`

**Interfaces:**
- Consumes: `SECTIONS` aus `home.mjs`.
- Produces: `cubes(sections): string` → `<nav class="cubes" aria-label="Abschnitte"><ol><li><a class="cube" href="#id"><span class="cube__label">Label</span></a></li>…</ol></nav>`; `initCubes(root): void` setzt je Würfel `.is-passed` / `.is-active` und `aria-current="true"` am aktiven (IntersectionObserver, `rootMargin: "-45% 0px -45% 0px"`, initial anhand der aktuellen Position/Hash).

- [ ] **Step 1: Failing test:** `genau so viele .cube wie [data-section], gleiche Reihenfolge und Labels`; `ab 960 px sichtbar, am rechten Rand, vertikal mittig, position fixed`; `unter 960 px display none`; `nach Scroll zu #leistungen: Würfel 1 passed, 2 aktiv (aria-current=true), 3–6 weder noch`; `Klick auf den vierten Würfel springt zu #objelis und setzt ihn aktiv`; `direkt geladen mit /#kontakt: sechster aktiv, vorherige passed`; `Tastatur: Tab erreicht jeden Würfel, Enter springt, sichtbarer Fokus`; `bei 960, 1280, 1440 überlappt kein Würfel das Content-Rechteck von .wrap`; `Unterseiten (/lebenslauf/, /impressum/) haben keine .cubes`; `reducedMotion: transition-duration der Würfel ist 0s`; `JS aus: Würfel bleiben als Ankerlinks nutzbar`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implementieren.** Flache Quadrate 10 px, Radius 3 px, Haarlinie; passiert: blau gefüllt; aktiv: 14 px blau mit Mono-Label links daneben (Einblendung 200 ms, ohne Schatten). Auf Seiten mit Würfeln erhält `.wrap` ab 960 px `padding-inline-end: var(--gutter-right-cubes)`. `scroll-margin-top` der Abschnitte = Kopfhöhe + 16 px.
- [ ] **Step 4: Run** → PASS. Screenshot-Reihe (Scroll an 6 Positionen) in `qa/weiss/cubes-*.png` ansehen.

### Task 7: Lebenslauf, Rechtliches, 404, Design-System

**Files:**
- Create: `src/content/cv.json`, `src/pages/lebenslauf.mjs`, `src/pages/legal.mjs`, `src/pages/not-found.mjs`, `src/pages/design-system.mjs`, `src/css/cv.css`, `src/css/legal.css`, `scripts/tests/07-pages.test.mjs`
- Modify: `scripts/build-site.mjs`, `src/css/main.css`

**Interfaces:**
- Produces: `cv.json` `{groups:[{title, entries:[{period, title, text}]}], stack, languages}` mit allen Einträgen aus Legacy; `lebenslauf(site, cv)`, `legal(site)` (Impressum/Datenschutz-Texte wörtlich aus `qa/legacy-passung/generate-pages.mjs`), `notFound(site)`, `designSystem()` (Farben, Schrift, Buttons, Chips, Würfel; `noindex`, ohne Navigationslink).

- [ ] **Step 1: Failing test:** `/lebenslauf/` enthält alle Einträge aus `cv.json`, keine `<details>`, genau ein h1, „IBM AI Developer“ und „Seit November 2026“ sichtbar; `/cv.html` leitet auf `/lebenslauf/`; `Impressum/Datenschutz/404 mit axe ohne Verstöße bei 390 px`; `alle Unterseiten tragen noindex`; `Navigation markiert die aktuelle Seite mit aria-current="page"`; `/design-system/` existiert, ist noindex und in keiner Navigation verlinkt`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implementieren** im selben Raster (Gruppen als Zweispalter: Titel links, Einträge rechts, Haarlinien, Mono-Zeitraum).
- [ ] **Step 4: Run** → PASS.

### Task 8: Gesamt-Motion, Seitenübergänge, Fallbacks

**Files:**
- Create: `scripts/tests/08-motion.test.mjs`
- Modify: `src/css/base.css` (`@view-transition { navigation: auto; }` plus kurze Überblendung 200 ms, abgeschaltet bei reduced motion), `src/js/main.js` (Initialisierungsreihenfolge, `ScrollTrigger.refresh()` nach `document.fonts.ready`), alle Sektionen (`data-reveal`, `.hairline-draw` ergänzen, wo noch nicht geschehen)

- [ ] **Step 1: Failing test:** `nach dem Laden und 3 s Wartezeit laufen keine Animationen mehr (document.getAnimations läuft nicht, gsap.globalTimeline hat keine aktiven Tweens)`; `jede [data-reveal] ist nach vollständigem Scroll von oben nach unten sichtbar`; `reducedMotion: gleiche Seite, alle Elemente sofort opacity 1, keine laufenden Animationen`; `JS aus: kein Element mit opacity 0`; `keine Nicht-Transform/Opacity-Eigenschaft wird animiert (Stichprobe der Tweens)`; `Scrollposition bleibt nativ: window.scrollY ändert sich proportional zum Mausrad, kein Scroll-Lock (overflow auf html/body nie hidden)`.
- [ ] **Step 2: Run** → FAIL, dann Lücken schließen, **Run** → PASS.

### Task 9: Qualitätssicherung, Kritik, Doku

**Files:**
- Create: `scripts/tests/09-quality.test.mjs`, `qa/weiss/README.md` (Befunde)
- Modify: `DESIGN.md`, `README.md`, `docs/genesis-design.md` (Kopfzeile „abgelöst durch 2026-11-18-Spezifikation“), `package.json`
- Delete: `scripts/verify.mjs`, `scripts/verify-motion.mjs`, `scripts/verify-genesis.mjs`, `qa/genesis*`-Verweise in Doku (Dateien bleiben liegen)

- [ ] **Step 1: Test** `09-quality.test.mjs`: axe (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa) ohne Verstöße auf allen Seiten bei 390 und 1440; Kontrast aller Textpaare ≥ 4.5:1; kein horizontales Scrollen bei 320/390/768/1024/1440/2560; 200 %-Reflow (Viewport 640×450 bei Skalierung 2) ohne Überlauf; Tastaturdurchlauf erreicht alle interaktiven Elemente mit sichtbarem Fokus; LCP < 2.5 s und CLS < 0.1 lokal gemessen; Gesamtgröße `dist/app.js` < 180 KB.
- [ ] **Step 2: Run** `npm run build && npm test` → alles PASS.
- [ ] **Step 3: Screenshots** aller Seiten bei 390, 768, 1440 in `qa/weiss/` erzeugen und selbst ansehen (Rhythmus, Ränder, Würfel, Schemas, Kontrast).
- [ ] **Step 4: Harte Kritik:** Agent `ux-stack:design-critic` mit den Screenshots und dem Spec-Pfad beauftragen, Ziel: „Ablehnung begründen“. Befunde nach Priorität beheben, Test erneut ausführen, Ergebnis in `qa/weiss/README.md` festhalten (was behoben, was bewusst belassen).
- [ ] **Step 4b: Gegenprobe:** Auf versteckte Aufklapper, Zusatznotizen, Rest-Referenzen auf `three`/`assembly`/`details` prüfen (`grep -ri` in `src/` und `dist/*.html`) → keine Treffer.
- [ ] **Step 5: Dokumentation** aktualisieren (`DESIGN.md` beschreibt Look, Würfel, Motion-Regeln; `README.md` nennt Build, Tests, Dev-Server). Hinweis: Veröffentlichung weiterhin nur nach ausdrücklicher Freigabe durch Jonas.
- [ ] **Step 6: Verification:** `npm run build && npm test` Ausgabe in der Antwort an Jonas wiedergeben, dazu lokale Adresse `http://127.0.0.1:4173/` und der Hinweis, dass alles lokal bleibt.
