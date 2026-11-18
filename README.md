# Kalwa Software, lokale Website

Objelis-Corporate-Design in Weiß und Blau für Kalwa Software. Details: `DESIGN.md`.

```sh
npm install
npm run build   # Tokens, Seiten, CSS, JS nach dist/ und statische Prüfung
npm run dev     # nur http://127.0.0.1:4173
npm test        # Playwright-Prüfungen gegen einen lokalen Testserver (Port 4181)
```

Der Testbrowser kommt aus dem Playwright-Cache; bei Bedarf `CHROME_PATH` auf eine Chromium-Binärdatei setzen.

Alle Arbeiten bleiben unter diesem Ordner. Keine Veröffentlichung ohne ausdrückliche Freigabe.
