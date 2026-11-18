# Passung: implementierte Markenbasis

Quelle: `tokens.json` (Primitivwerte → semantische Rollen → Komponententokens). `font-faces.css` hält die lokalen Schriftdefinitionen. Build: `npm run build`. Die erzeugte `dist/tokens.css` nicht manuell bearbeiten.

- Grund #FFFFFF, Text #101214, Aktion/Verbindung #2857EB.
- Nebengrund #F5F6F8, Sekundärtext #505760, ruhige Beschriftung #606975.
- Hover #2857EB, aktiv #1A3CB4, Fokus #2857EB.
- Erfolg #236540, Warnung #805900, Fehler #A82132; nur bei entsprechendem Zustand verwenden, mit Text statt Farbe allein.
- Cabinet Grotesk 800: Display. Switzer: Prosa und UI. Tabular: Nummern und Daten. Lokale Fontshare-Dateien und Lizenzhinweise unter `dist/assets/fonts/`.
- 4px-Rhythmus, Stufenmodul 24/48px, Kontrollradius 4px, Medienradius 12px. Ausgewählte Arbeitsflächen haben den versetzten Anschluss. Keine Formkontrolle wird beschnitten.
- Kubische Bewegung mit 200/400/800ms. Eine dekorative Szene, sichtbarer Pausezustand und kompletter statischer Fallback.

`monogram.svg`: k mit kleinem hochgestelltem s, als Cabinet-Glyphenpfade. Gleiche Marke in Kopf, Fuß und Favicon. Eine rechtliche Markenfreigabe wird damit nicht behauptet.

Anwendbare Komponenten und Farben werden lokal unter http://localhost:4173/design-system/ tatsächlich gerendert.
