# Kalwa Software

Statische Unternehmenswebsite von Jonas Kalwa. Website, Software und Automatisierungen mit echten Referenzen von AK rund ums Haus, Einblick in objelis und aktuellem Werdegang.

## Lokal starten

```sh
npm run dev
```

Öffnet einen Server unter `http://localhost:4173`. Es sind keine Laufzeitpakete nötig. Seiten, CSS, JavaScript und Bilder stehen vollständig in `dist/`.

```sh
npm run build
```

Prüft sämtliche lokalen Verweise und die zentralen Inhaltsanforderungen. `npm test` führt Browserprüfungen aus; benötigt Playwright und axe-core, lokal wird die vorhandene UX-Kit-Installation erkannt. `CHROME_PATH` kann einen vorhandenen Chromium angeben.

## Inhalte und Rechtliches

- Kontaktdaten und Firmierung aus der Gewerbeanmeldung vom 15.11.2026. Keine GmbH.
- Werdegang aus `Jkalwa05/jonaskalwa.com` (Ausgangsstand `6ce9025492aea0647414dfd6621acc902727469c`) und der LinkedIn-Abschrift vom 15.11.2026. IBM AI Developer ist gemäß neuerer Quelle seit September 2026 abgeschlossen. Geplante Weiterbildungen werden nicht als Abschlüsse geführt. Studium aktuell Wirtschaftsinformatik; kein bereits erlangter Bachelor.
- Der ursprüngliche CV wurde in die Sektion „Über mich / Mein Werdegang“ integriert. `/cv.html` führt dort hin.
- Die Anfrage erstellt einen E-Mail-Entwurf. Es gibt keinen Formularserver, keine automatische Nachricht und keine Speicherung im Browser.
- Keine Analytics, externen Fonts oder Social-Embeds. Externe Links werden erst beim Anklicken aufgerufen.
- Objelis ist als eigenes Produkt in Entwicklung gekennzeichnet. Keine Kundenbehauptung oder Partnerschaft mit dem Arbeitgeber.
- Die Karten-Vorderseite ist ein Foto-Nachbau; die Rückseite ist noch nicht vorhanden.
- Private Quelldokumente und Gewerbeanmeldung werden nicht mit der Website ausgeliefert oder in die öffentlichen Git-Repositories kopiert.
- Bei einem Wechsel der endgültigen Domain müssen Canonical, Open Graph, Sitemap und Hostingangaben aktualisiert werden. Die jetzigen Datenschutzhinweise unterscheiden Vercel und die private Sites-Vorschau. Hostingvertrag, technische Aufbewahrungsfristen und eventuelle weitere Pflichtkennungen des Unternehmens sind vor einem späteren Hosterwechsel zu prüfen.

Quellen der sachlichen Rechtstexte: [§ 5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html), [DSGVO](https://eur-lex.europa.eu/eli/reg/2016/679/oj/deu), [Vercel](https://vercel.com/legal/privacy-policy), [OpenAI Europa](https://openai.com/policies/eu-privacy-policy/).

Designentscheidungen in `DESIGN.md`, Bildquellen und Prüfungen unter `qa/`. Schriftlizenz unter `dist/assets/fonts/FFL.txt`.
