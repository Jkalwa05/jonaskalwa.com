// Linien-Schemas: blaue Hauptlinien, helle Strukturlinien, ohne Beschriftung.
// Alle Formen sind <path pathLength="1" class="draw">, damit sie sich per stroke-dashoffset zeichnen lassen.
const path = (d, soft = false) => `<path class="draw${soft ? ' draw--soft' : ''}" pathLength="1" d="${d}"/>`;
const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
const circle = (cx, cy, r) => `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}`;
const arrowH = (x1, x2, y) => `M${x1} ${y}H${x2}M${x2 - 7} ${y - 4}L${x2} ${y}L${x2 - 7} ${y + 4}`;
const svg = body => `<svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">${body}</svg>`;

export function schemaWebsite() {
  return svg([
    path(rr(40, 36, 400, 288, 12)),
    path('M40 72H440', true),
    path(circle(62, 54, 4), true), path(circle(78, 54, 4), true), path(circle(94, 54, 4), true),
    path(rr(124, 44, 232, 20, 10), true),
    path('M64 112H236M64 134H196'),
    path('M64 168H264M64 186H232M64 204H252', true),
    path(rr(64, 230, 96, 32, 16)),
    path(rr(292, 100, 128, 170, 10)),
    path('M356 214C356 214 330 184 330 164a26 26 0 0 1 52 0C382 184 356 214 356 214Z'),
    path(circle(356, 164, 8)),
    path('M310 236H402M322 252H390', true),
  ].join(''));
}

export function schemaSoftware() {
  return svg([
    path('M40 120a40 12 0 1 0 80 0a40 12 0 1 0 -80 0'),
    path('M40 120V200M120 120V200M40 200a40 12 0 0 0 80 0'),
    path('M40 148a40 12 0 0 0 80 0M40 174a40 12 0 0 0 80 0', true),
    path(arrowH(128, 192, 160)),
    path(rr(200, 100, 120, 120, 10)),
    path(rr(218, 124, 14, 14, 3), true), path('M244 131H300', true), path('M221 131l4 4 6 -8'),
    path(rr(218, 154, 14, 14, 3), true), path('M244 161H290', true),
    path(rr(218, 184, 14, 14, 3), true), path('M244 191H296', true),
    path(arrowH(328, 372, 160)),
    path(rr(380, 120, 64, 100, 8)),
    path('M392 140H432M392 156H424M392 172H432', true),
    path(rr(392, 192, 40, 14, 7)),
    path('M260 220V268', true), path(rr(200, 268, 120, 36, 8), true),
  ].join(''));
}

export function schemaAutomation() {
  return svg([
    path(rr(40, 140, 80, 56, 6)),
    path('M40 146L80 176L120 146', true),
    path(arrowH(128, 188, 168)),
    path('M240 120L288 168L240 216L192 168Z'),
    path('M240 120V84H318M311 80L318 84L311 88'),
    path(rr(326, 52, 72, 64, 6)),
    path('M340 72H384M340 88H376M340 100H368', true),
    path('M240 216V268H318M311 264L318 268L311 272'),
    path(rr(326, 236, 92, 64, 6)),
    path('M326 256H418M326 278H418M356 256V300', true),
    path(arrowH(296, 372, 168)),
    path(circle(404, 168, 22)),
    path('M394 168l7 7 12 -14'),
  ].join(''));
}
