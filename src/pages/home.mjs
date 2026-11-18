import { esc } from '../lib-html.mjs';
import hero from '../sections/hero.mjs';
import services from '../sections/services.mjs';
import praxis from '../sections/praxis.mjs';
import objelis from '../sections/objelis.mjs';
import about from '../sections/about.mjs';
import contact from '../sections/contact.mjs';

// Reihenfolge und Beschriftung der Abschnitte; die Würfel-Navigation liest dieselbe Liste.
export const SECTIONS = [
  { id: 'start', label: 'Start' },
  { id: 'leistungen', label: 'Leistungen' },
  { id: 'praxis', label: 'Praxis' },
  { id: 'objelis', label: 'objelis' },
  { id: 'ueber-mich', label: 'Über mich' },
  { id: 'kontakt', label: 'Kontakt' },
];

const frame = (s, inner, tag = 'h2') => `<section id="${s.id}" class="section" data-section data-label="${esc(s.label)}" aria-labelledby="${s.id}-title"><div class="wrap"><${tag} id="${s.id}-title">${esc(s.label)}</${tag}>${inner}</div></section>`;

// Jede Sektion liefert ihr eigenes Markup; solange eine fehlt, steht ein beschrifteter Rahmen.
const renderers = { start: hero, leistungen: services, praxis, objelis, 'ueber-mich': about, kontakt: contact };

export function home(site) {
  return SECTIONS.map(s => (renderers[s.id] ? renderers[s.id](site) : frame(s, '', 'h2'))).join('\n');
}
