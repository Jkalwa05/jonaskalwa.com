import { esc, img, arrow } from '../lib-html.mjs';

export default function praxis(site) {
  const a = site.assets;
  return `<section id="praxis" class="section praxis theme-wash" data-theme="wash" data-section data-label="Praxis" aria-labelledby="praxis-title">
  <div class="wrap">
    <div class="split praxis-head">
      <div class="split__head">
        <p class="label" data-reveal>Aus der Praxis</p>
        <h2 id="praxis-title" data-reveal="mask">Handwerk braucht<br>einen guten Auftritt.</h2>
      </div>
      <div class="split__body" data-reveal>
        <h3>AK rund ums Haus</h3>
        <p class="muted">Für den Handwerksbetrieb meines Vaters habe ich die Website und die lokale Suchmaschinenoptimierung aufgebaut. Menschen sollen die passende Leistung finden und direkt Kontakt aufnehmen können.</p>
        <dl class="facts">
          <div><dt class="label">Aufgabe</dt><dd>Website und lokale Suchmaschinenoptimierung</dd></div>
          <div><dt class="label">Ausrichtung</dt><dd>Suchanfragen aus Vechta und Umgebung, Bedienung auf dem Smartphone</dd></div>
        </dl>
        <div><a class="text-link" href="${site.links.ak}" target="_blank" rel="noopener noreferrer">AK-Website besuchen<span class="sr-only"> (öffnet in neuem Tab)</span> ${arrow}</a></div>
      </div>
    </div>
    <figure class="proof proof--stage" data-reveal>
      <div class="device device--laptop proof__device">${img(a.akDesktop, { sizes: '(min-width: 960px) 1296px, 92vw' })}</div>
    </figure>
    <div class="print-grid">
      <div class="print-copy" data-reveal>
        <p class="label">Vom Bildschirm in die Hand</p>
        <h3>Auch auf Papier<br>wiedererkennbar.</h3>
        <p class="muted">Die gedruckten Visitenkarten gehören zum Auftritt des Betriebs. Logo, Leistungen und Kontakt bringen das Angebot auch außerhalb der Website zu den Menschen.</p>
      </div>
      <figure class="proof proof--photo" data-reveal>
        <div class="proof__frame">${img(a.akCardDesign, { sizes: '(min-width: 960px) 636px, 92vw' })}</div>
      </figure>
    </div>
  </div>
</section>`;
}
