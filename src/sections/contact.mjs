import { esc, arrow, mailto } from '../lib-html.mjs';

export default function contact(site) {
  return `<section id="kontakt" class="section contact theme-blue" data-theme="blue" data-section data-label="Kontakt" aria-labelledby="kontakt-title">
  <div class="wrap">
    <div class="contact-grid">
      <p class="label" data-reveal>Lass uns über deine Aufgabe sprechen</p>
      <h2 id="kontakt-title" data-reveal="mask">Was möchtest du<br>leichter machen?</h2>
      <div class="contact-body" data-reveal>
        <p class="lead">Eine Website, ein eigener Ablauf oder eine Idee für Software: Schreib mir, was du brauchst. Wir schauen gemeinsam, was sinnvoll ist.</p>
        <div class="contact-actions">
          <a class="button" href="${esc(mailto(site))}">E-Mail vorbereiten ${arrow}</a>
          <button class="button button--ghost" type="button" data-copy-email="${esc(site.email)}" hidden>Adresse kopieren</button>
        </div>
        <p class="contact-direct muted">Oder direkt an <a class="text-link" href="mailto:${esc(site.email)}">${esc(site.email)}</a>. „E-Mail vorbereiten“ öffnet nur deinen Entwurf, abschicken musst du ihn selbst.</p>
        <p class="status" role="status" aria-live="polite"></p>
      </div>
    </div>
  </div>
</section>`;
}
