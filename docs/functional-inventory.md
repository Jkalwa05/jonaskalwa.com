> **Teilweise überholt** (18.11.2026): Aufbau und Funktionen beschreiben den früheren Entwurf. Maßgeblich sind `DESIGN.md` und die Spezifikation vom 18.11.2026. Die Inhaltsrecherche in `content-strategy.md` gilt weiter.

# Erhaltener Funktionsumfang

## Seiten und Verknüpfung
Startseite mit Ankern `#leistungen`, `#projekte`, `#objelis`, `#ueber-mich`, `#lebenslauf`, `#kontakt`. `#lebenslauf` öffnet die CV-Details. `/cv.html` verweist lokal auf diesen Anker. `/impressum/`, `/datenschutz/` und die echte 404-Route teilen Kopf und Fuß. `/design-system/` ist eine neue interne Referenz derselben Komponenten, mit noindex und ohne öffentliche Navigation.

## Ereignisse und Zustände
| Selektor / Ereignis | Wirkung und Zustand |
|---|---|
| `.menu-toggle`, click | `aria-expanded`, zugänglicher Name, `.main-nav.is-open`, `.site-header.menu-open` |
| document, Escape | Menü schließen, Fokus zum Auslöser |
| `#navigation a`, click | Menü schließen, normaler Link bleibt erhalten |
| matchMedia min-width 960px, change | Menü beim Wechsel der Darstellungsform schließen |
| document, pointerdown außerhalb Kopf | Offenes Menü schließen |
| `.site-header`, focusout | Menü schließen, wenn Fokus den Kopf verlässt |
| window, scroll | Kopfkontur ab 8px; Animation über native Scrollposition |
| window, hashchange / Laden | `#lebenslauf` öffnet die nativen Details |
| `.service summary`, `#lebenslauf summary` | Natives details-Verhalten einschließlich Tastatur |
| `[data-interest]`, click | Das passende `input[name=interest]` auswählen |
| `.project-form`, submit | `interest` und `body` lesen, mailto-Betreff/Entwurf erzeugen, Status erklären; Eingaben nicht löschen |
| `[data-copy-email]`, click | Clipboard schreiben; Erfolg oder Kopierfehler im Live-Status erklären |
| Motion-Präferenz / load / fonts.ready | Dekorative Szene nach Laden und nur bei erlaubter Bewegung starten |
| `.pause-control`, click | Zeit der kontinuierlichen Bewegung anhalten/fortsetzen, `aria-pressed`, Name und Symbol aktualisieren |
| ResizeObserver / resize | Leistungsinhalt und verbleibenden Raum messen, bei Platzmangel normalen Seitenfluss verwenden |
| visibilitychange | Hintergrund-Rendering pausieren |
| canvas, webglcontextlost / Shaderfehler | Kontext aufräumen und vollständigen statischen Inhalt zeigen |

Zustand wird nur im DOM, den nativen Formfeldern, dem URL-Hash und temporär im Animationsmodul gehalten. Keine Cookies oder lokale Persistenz. Keine Authentifizierung, Konten, Zahlungen, Tracking- oder Kamera-/Mikrofonberechtigungen.

Die einzigen interaktiven Browser-APIs sind Clipboard und WebGL. Lokale GET-Anfragen laden HTML, CSS, JavaScript, Schriftdateien und echte Bilder. Es gibt keinen Formular-API-Aufruf. `mailto:` übergibt erst nach Nutzeraktion einen Entwurf an das Mailprogramm; der Besucher sendet ihn selbst.

## Prüfvertrag
Die vorhandenen `verify.mjs`- und `verify-motion.mjs`-Prüfungen wurden vor und nach dem Entwurf unverändert ausgeführt. `verify-genesis.mjs` ergänzt Zwischenbreiten, textliche Umbrüche, Browser-Geometrie, zusätzliche Seiten, Kontrastzustände, Tastaturbeginn, 200%-Reflow und Kontextverlust.

Änderungen an Layout und Navigations-Breakpoint gehören zur erhöhten Gestaltungsrisikostufe 2. Verträge, Datenschutzverhalten und Datensemantik bleiben unverändert. Der neue Kontextverlust-Fallback verbessert die Fehlersituation, ohne Produktfunktionen zu ersetzen.
