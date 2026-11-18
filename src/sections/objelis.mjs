import { esc, img, arrow, mailto } from '../lib-html.mjs';

export default function objelis(site) {
  return `<section id="objelis" class="section objelis theme-night" data-theme="night" data-section data-label="objelis" aria-labelledby="objelis-title">
  <div class="wrap">
    <div class="objelis-grid">
      <div class="objelis-copy">
        <p class="label" data-reveal>Eigenes Produkt · In Entwicklung</p>
        <h2 id="objelis-title" data-reveal="mask">Von einem Objekt<br>zur digitalen Form.</h2>
        <p class="lead" data-reveal>Mit objelis entwickle ich eine KI-gestützte Software, die physische Objekte erkennen, vermessen und modellieren soll. Ein eigenes Produkt, an dem ich Computer Vision und 3D zusammenbringe.</p>
        <dl class="facts" data-reveal>
          <div><dt class="label">Stand</dt><dd>In Entwicklung, noch kein fertiges Produkt</dd></div>
          <div><dt class="label">Schwerpunkt</dt><dd>Computer Vision, Vermessung und 3D-Modelle</dd></div>
        </dl>
        <div data-reveal><a class="text-link" href="${esc(mailto(site, 'objelis', 'Hallo Jonas,\n\nich möchte mit dir über objelis sprechen.\n\nViele Grüße'))}">Über objelis sprechen ${arrow}</a></div>
      </div>
      <figure class="objelis-visual" data-reveal>
        ${img(site.assets.objelisModel, { sizes: '(min-width: 960px) 636px, 92vw' })}
        <span class="model-dim model-dim--h">146,7 mm</span>
        <span class="model-dim model-dim--w">71,5 mm</span>
        <span class="model-dim model-dim--d">7,8 mm</span>
      </figure>
    </div>
  </div>
</section>`;
}
