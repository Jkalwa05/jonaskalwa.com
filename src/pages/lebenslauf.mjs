import { esc } from '../lib-html.mjs';

export function lebenslauf(site, cv) {
  const entry = e => `<li class="entry"><p class="label">${esc(e.period)}</p><div><h3>${esc(e.title)}</h3>${e.text ? `<p class="muted">${esc(e.text)}</p>` : ''}</div></li>`;
  const group = g => `<section class="cv-group" aria-labelledby="cv-${g.title.length}-${esc(g.title.split(' ')[0].toLowerCase())}">
    <hr class="hairline hairline-draw" data-reveal="line">
    <div class="split"><div class="split__head"><h2 id="cv-${g.title.length}-${esc(g.title.split(' ')[0].toLowerCase())}" data-reveal>${esc(g.title)}</h2></div>
    <ol class="split__body timeline" data-reveal>${g.entries.map(entry).join('')}</ol></div></section>`;
  const extras = `<section class="cv-group" aria-label="Weitere Angaben"><hr class="hairline hairline-draw" data-reveal="line"><div class="split"><div class="split__head"><h2 data-reveal>Weitere Angaben</h2></div>
    <dl class="split__body facts" data-reveal>${cv.extras.map(x => `<div><dt class="label">${esc(x.title)}</dt><dd>${esc(x.text)}</dd></div>`).join('')}</dl></div></section>`;
  return `<div class="wrap cv">
  <header class="cv-head">
    <p class="label" data-reveal>Stand November 2026</p>
    <h1 data-reveal="mask">Lebenslauf</h1>
    <p class="lead" data-reveal>Jonas Kalwa · Entwickler, Wirtschaftsinformatik-Student und Gründer von ${esc(site.name)}.</p>
  </header>
  ${cv.groups.map(group).join('\n  ')}
  ${extras}
</div>`;
}
