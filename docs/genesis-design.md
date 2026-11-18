> **Abgelöst** am 18.11.2026 durch `superpowers/specs/2026-11-18-kalwa-objelis-weiss-design.md`. Dieses Dokument beschreibt den früheren Entwurf „Passung“ und bleibt nur als Verlauf erhalten.

# Kalwa Software: Passung

Stand 16. November 2026. Nur lokale Entwicklung. Kein Push, kein Deployment.

## Auftrag und Produkt
Kalwa Software ist Jonas Kalwas Einzelunternehmen für Websites, individuelle Anwendungen und Automatisierungen. Die Website führt vom Angebot über echte Arbeitsproben zum persönlichen Kontakt. Sie ist keine SaaS-Anwendung. Es gibt weder Konten noch API-Formularversand, Tracking oder Zahlungsabläufe. objelis ist ein separates Produkt in Entwicklung, kein auslieferbares Feature dieser Website.

Ausgangsbasis: bestehende Texte und Arbeitsproben, Cabinet Grotesk und Switzer, weißer Grund, schwarze Typografie, blaue Akzente, k mit hochgestelltem s. Die öffentliche persönliche Website bleibt unverändert.

## Kreative Prüfung
- Werkstatt / technischer Bauplan: Bezug zur Entwicklung, aber technische Dekoration erschwert den Zugang für nicht technische Interessenten.
- Persönliches Journal: glaubwürdig und menschlich, aber die Softwarearbeit wird zu wenig sichtbar.
- Passung: reale Arbeitsflächen auf einem gemeinsamen Raster; ein versetzter Anschluss lässt die Teile zusammenfinden. Trägt Referenzbilder, Auswahlzustände und die vorhandene Ebenenanimation. Gewählt, weil die Idee direkt zur individuellen Entwicklung für konkrete Abläufe passt.

Die Geometrie ist eine rechtwinklige Stufe von einem Rastermodul. Sie erscheint selektiv in der Hero-Komposition, den Medienrahmen, der aktiven Leistungsnummer und der Kontaktfläche. Normale Texte und Bedienelemente bleiben rechteckig und vollständig lesbar. Keine Behauptung rechtlicher Exklusivität.

## Gestaltung
Editorialer Arbeitsindex, ergänzt um die vorhandene Software-Ebenenanimation. Weiß #FFFFFF, tiefe Druckfarbe #101214, Blau #2857EB. Nebengrund #F5F6F8, Sekundärtext #505760. Cabinet Grotesk 800 für Überschriften, Switzer für Prosa und UI, Tabular für tatsächliche Nummern und Daten. Vorhandene selbst gehostete Fontshare-Schriften mit Lizenzhinweisen bleiben erhalten.

4px-Rhythmus; Inhaltsabstände 8, 12, 16, 24, 32, 48, 64, 96px. Maximalbreite 1536px, gemeinsame symmetrische Außenkanten. Ein Stufenmodul 24px mobil / 48px groß. Radien 4px für Bedienelemente, 12px für funktionale Medien. Keine Schatten als Standard, keine Farbverläufe. Blau kennzeichnet Verbindung oder Zustand, nicht jeden Titel.

## Nutzung und Bewegung
Sichtbare native Leistungs- und CV-Disclosures erhalten die Erkennbarkeit. Kontakt bleibt ein einspaltiger Entwurf mit sichtbaren Themenoptionen und klarer Erklärung des Mailprogramms. Kein neuer zusätzlicher Schritt.

Eine gemeinsame kubische Kurve, 200/400/800ms. Kleine Verschiebungen rasten auf gemeinsame Achsen ein. Die vorhandene Three/GSAP-Ebenenanimation bleibt pausierbar und scrollt nativ. Ohne WebGL oder bei reduzierter Bewegung zeigt sich die komplette statische Arbeit. Keine Inhalte werden per Scroll-Reveal versteckt.

## Umsetzung und Prüfung
Stufe 1: Tokens, Komposition, Typografie, Metadaten, Medienrahmen und UI-Zustände. Stufe 2: Layout der interaktiven Bereiche und Bewegung mit unveränderten Regressionstests. Keine Stufe-3-Änderungen.
Baseline: `npm test` besteht vor Änderungen; Screenshots und Quellen unter `qa/genesis-baseline`.
Danach: Build, unveränderte Funktions- und Bewegungstests, zusätzliche Zwischenbreiten/Vergrößerung, axe, echte Screenshots, geometrische Checks, unabhängiger Designkritiker. Labormessungen sind keine Felddaten und kein Nachweis höherer Conversion.

## Informationsgrundlage
Vision, LinkedIn-Profil und aktueller lokaler Quellcode. Die übergebene Scan-Recherche wurde im vorhandenen `Object-Intelligence/docs/research/2026-11-14-generative-shape-prior-handoff.md` gefunden. Sie belegt Experimente und offene Fragen, keine fertige Scanqualität. Kein Code des separaten Projekts wird verändert.
