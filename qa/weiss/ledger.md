# Ledger: plan docs/superpowers/plans/2026-11-18-kalwa-objelis-weiss.md

Pre-flight: shared interfaces checked (site.json, SECTIONS, motion-core, harness) - consistent.
Ruling: no worktree, no commits - AGENTS.md local-only, dirty nested repo, user did not ask for commits - cost if wrong: none (backup in qa/legacy-passung)
Ruling: ledger lives in qa/weiss/ledger.md instead of .superpowers/sdd - no git workflow in use
Task 1: complete (tests: node --test scripts/tests/01-foundation.test.mjs -> 4/4 pass)
Task 1: Ruling: brand/tokens.json komplett neu geschrieben (58 statt 95 Tokens, Objelis-Maße) - alte Tokens gehörten zum abgelehnten Look - cost: none
Task 1: Ruling: chrome.css als vierte CSS-Datei, src/lib-html.mjs als Helfer - sauberere Trennung - cost: none
Task 1: Ruling: legale Texte jetzt schon nach src/pages/legal.mjs übernommen; Absatz 'Projektanfrage' an entferntes Formular angepasst (Wahrheitspflicht) - cost: Jonas prüft Wortlaut vor Veröffentlichung
Task 2: complete (tests: npm test -> hero 6/6 + foundation 4/4)
Task 3: complete (tests: npm test -> 17/17 pass; services 7/7)
Task 3: Ruling: Zeichen-Draw bei Aktivierung statt ScrollTrigger-Scrub, Sticky-Bühne per CSS-Grid + IntersectionObserver - robust bei Anker-Sprüngen - cost: weniger spektakulär als Scrub; Tweaks später möglich
Task 3: Ruling: kein vector-effect non-scaling-stroke - bricht stroke-dash mit pathLength - cost: Strichstärke skaliert leicht mit Breite
Task 4: complete (tests: npm test -> 21/21 pass; praxis/objelis 4/4)
Task 4: Ruling: Praxis zeigt akDetail statt akDesktop (Hero zeigt akDesktop, Doppelung vermieden)
Task 4: Ruling: lokale Sichtbarkeit als Arbeitsbeschreibung formuliert ('Ausrichtung: Suchanfragen aus Vechta und Umgebung'), die beobachtete Google-Platzierung aus der Vision NICHT behauptet - unbelegt, keine Ranking-Zusagen - cost: Jonas kann eine belegte Aussage ergänzen
Task 5: complete (tests: 6/6 pass)
Task 6: complete (tests: cubes 10/10; services 7/7 after refactor)
Task 6: Ruling: Würfel-Label nur 1,8 s nach Wechsel sowie bei Hover/Fokus sichtbar, nicht dauerhaft - ein dauerhaftes Label würde Inhalt in schmalen Rändern überdecken - cost: Spec sagt 'aktiv mit kurzem Label'; bleibt erfüllt
Task 3/6: Ruling: Sticky-Bühne per Media-Query (html.js) statt JS-Klasse, erste Zeichnung im HTML aktiv - JS-Layoutwechsel verschob Deep-Link-Ziele - cost: none
Task 6: Ruling: Fonts vorgeladen (5 Dateien) und Hash nach dem Laden einmal ausgerichtet (nur ohne Nutzereingabe) - cost: gering
Task 7: complete (tests: pages 5/5)
Task 8: complete (tests: motion 8/8). Ruling: viewTransitionName-Prüfung entfernt (Chrome meldet immer root) - Abschaltung über CSS-Regel-Test abgedeckt
Task 9: Jonas-Feedback 18.11. 13:43-13:44 -> Spec-Nachtrag: Maße/Mono-Chips raus, Switzer-Eyebrows, farbige Flächen, Gerätebühne im Hero, Würfel themenfarbig
Ruling: Blau jetzt auch als Fläche (Hero, Kontakt) und Nachtblau (objelis, Fuß) - ausdrücklicher Wunsch von Jonas, überschreibt Spec-Zeile 'Blau nie als Fläche' - cost: Rückbau einfach (Theme-Klassen)
Task 9 (Feedback-Runde): Würfel pro Würfel themenfarbig (Grenzfall Weiß/Nachtblau behoben), Header als abgerundete Pille mit Farbwelt-Anpassung (data-on), theme.js gemeinsam
Task 9: Doku (DESIGN.md, README.md) geschrieben, Altdokus mit Hinweis. Alte scripts/verify*.mjs NICHT gelöscht (Datenschutz-Plugin blockierte rm wegen Kontaktdaten in den Dateien); sie laufen nicht mehr über npm test
Task 9 (Kritik-Runde): Design-Critic lehnte ab (12 Punkte). Umgesetzt: Hero-Laptop zeigt akDetail, größer, Würfel über Gerätebild per data-deep blau, Header nur nach Bereich; Mobil nur Smartphone; Praxis ohne Layout-Satz, ohne Nachbau-Karte, Laptop volle Rasterbreite; Zeichnungswechsel an Überschrift; Block-Höhe 60vh; objelis mit Drahtgittermodell statt Screenshot mit mm-Chips; Pille 160ms; Porträt rund; Arbeitsschritte mit Satz ('So arbeite ich mit dir'); Leistungs-H2 'Was ich für dich baue.'; Trennlinien auf Wunsch von Jonas entfernt; T-Linie unter Leistungs-Kopf.
Ruling: neue Arbeitsschritt-Sätze und Leistungs-H2 sind von mir formuliert (Critic-Punkt 11/12), Jonas soll sie prüfen
Ruling: Würfel-Farbe live per Layout-Event aus dem Hero statt nur bei Scroll - cost: minimal
Final: Karte zeigt jetzt akCardDesign (digitales Bild, auf Wunsch von Jonas statt Karton-Foto); Maßwerte am objelis-Modell als schlichter Text (146,7 / 71,5 / 7,8 mm, Werte von der objelis-Seite); Fix: Würfel hören auf kalwa:layout
