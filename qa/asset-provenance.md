# Referenzbilder

Erstellt und visuell kontrolliert am 15.11.2026. Alle Bilder zeigen tatsächliche vorhandene Websites oder vom Nutzer bereitgestelltes Material. Keine nachgezeichnete Website, keine erfundenen Kundenbilder und keine Stockfotos.

| Datei in `dist/assets/` | Maße | Quelle und Inhalt |
| --- | --- | --- |
| `ak-website-desktop.webp` | 1440 × 1000 | Screenshot der öffentlichen Startseite https://ak-rundum.com/; Desktop-Hero, aufgenommen mit Chromium. Die Seite antwortete mit HTTP 200. |
| `ak-website-mobile.webp` | 780 × 1688 | Dieselbe Live-Startseite bei 390 × 844 CSS-Pixeln und Pixeldichte 2; Smartphoneansicht inklusive vorhandener Kontaktleiste. |
| `ak-website-detail.webp` | 1440 × 1000 | Live-Screenshot des Abschnitts „Was wir für Sie übernehmen“; Überschrift und Leistungskarten. |
| `ak-visitenkarten-foto.webp` | 1200 × 1102 | Fotografischer Ausschnitt aus `/Users/jonaskalwa/Downloads/PHOTO-2026-06-09-20-22-55.jpg`. Zeigt drei Stapel tatsächlich gedruckter Vorderseiten im Karton. Ausschnitt x=118, y=482, Breite=880, Höhe=808; auf 1200 px Breite exportiert. Beine und Fußboden sind nicht im Ausschnitt. |
| `ak-visitenkarte-design.webp` | 1205 × 780 | WebP-Export von `/Users/jonaskalwa/AI Developing/AK-Rundum/visitenkarte-vorderseite-nachbau.png`. Dies ist der am 15.11.2026 anhand des Fotos erstellte Nachbau, keine wiedergefundene Original-Druckdatei. Für die Referenz besser das echte Foto verwenden oder den Nachbau eindeutig kennzeichnen. |
| `objelis-website.webp` | 1440 × 1000 | Screenshot der vorhandenen gebauten objelis-Website aus `/Users/jonaskalwa/AI Developing/Object-Intelligence/site/dist`, separat und vorübergehend auf Port 8492 bereitgestellt. Hero zeigt die tatsächliche Wortmarke, Überschrift und Smartphone-Geometrie. Dies ist der lokale Entwicklungsstand und kein Nachweis einer öffentlichen Veröffentlichung oder Produktverfügbarkeit. |
| `objelis-modell.webp` | 1200 × 1200 | Unveränderte Kopie von `/Users/jonaskalwa/AI Developing/Object-Intelligence/site/public/img/hero-still.webp`. Tatsächlich im objelis-Projekt vorhandenes Smartphone-Linienmodell; als Produkt in Entwicklung einzuordnen. |

Aufnahmebedingungen: Headless Chromium über `playwright-core`, echte installierte Chrome-Version aus `CHROME_PATH`, `prefers-reduced-motion: reduce`, Schriftladevorgang abgewartet. Bilder als WebP mit Qualität 90 exportiert, der Karten-Nachbau mit Qualität 95. Die Live-Seite wurde nur öffentlich gelesen; keine Adminseite oder Kundeninformationen aufgerufen. Der objelis-App-Port 8766 wurde nicht aufgerufen. Der eigens gestartete statische Server auf Port 8492 wurde nach den Aufnahmen beendet. Sämtliche sieben Ergebnisbilder wurden mit `view_image` geöffnet und inhaltlich geprüft.
