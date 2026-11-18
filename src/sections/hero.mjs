import { esc, img, arrow, mailto } from '../lib-html.mjs';

export default function hero(site) {
  const laptop = site.assets.akDetail;
  const phone = site.assets.akMobile;
  return `<section id="start" class="hero theme-blue" data-section data-label="Start" data-theme="blue" aria-labelledby="hero-title">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <h1 id="hero-title" data-hero="mask">Software, die<br>für dich<br>arbeitet.</h1>
      <p class="lead" data-hero="fade">Ich entwickle Websites, individuelle Anwendungen und Automatisierungen. Für Menschen und Betriebe, die eine konkrete Aufgabe lösen wollen.</p>
      <div class="hero-actions" data-hero="fade">
        <a class="button" href="${esc(mailto(site))}">Projekt besprechen ${arrow}</a>
        <a class="button button--ghost" href="#praxis">Projekte ansehen <span aria-hidden="true">↓</span></a>
      </div>
    </div>
  </div>
  <div class="hero-stage">
    <div class="hero-devices">
      <figure class="device device--laptop" data-hero="device" data-theme="light" data-deep>${img(laptop, { priority: true, sizes: '(min-width: 960px) 58vw, 118vw' })}</figure>
      <figure class="device device--phone" data-hero="device" data-theme="light" data-deep>${img(phone, { priority: true, sizes: '(min-width: 960px) 15vw, 32vw' })}</figure>
    </div>
  </div>
</section>`;
}
