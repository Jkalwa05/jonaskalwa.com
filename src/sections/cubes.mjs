import { esc } from '../lib-html.mjs';

/** Würfel-Navigation: ein kleiner abgerundeter Würfel pro Abschnitt der Startseite. */
export function cubes(sections) {
  const items = sections.map(s => `<li><a class="cube" href="#${s.id}"><span class="cube__label">${esc(s.label)}</span></a></li>`).join('');
  return `<nav class="cubes" aria-label="Abschnitte"><ol>${items}</ol></nav>`;
}
