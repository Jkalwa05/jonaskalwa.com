import { esc, img, arrow } from '../lib-html.mjs';

const ext = (href, text) => `<a class="text-link" href="${href}" target="_blank" rel="noopener noreferrer">${esc(text)}<span class="sr-only"> (öffnet in neuem Tab)</span> ${arrow}</a>`;

export default function about(site) {
  return `<section id="ueber-mich" class="section about theme-light" data-theme="light" data-section data-label="Über mich" aria-labelledby="ueber-mich-title">
  <div class="wrap">
    <div class="split about-grid">
      <div class="split__head about-head">
        <p class="label" data-reveal>Der Mensch hinter Kalwa Software</p>
        <h2 id="ueber-mich-title" data-reveal="mask">Ich baue Software,<br>weil ich es<br>gerne tue.</h2>
        <figure class="portrait" data-reveal>
          <div class="portrait__img">${img(site.assets.portrait, { sizes: '(min-width: 960px) 420px, 70vw' })}</div>
          <figcaption class="label">Jonas Kalwa · Vechta / Osnabrück</figcaption>
        </figure>
      </div>
      <div class="split__body about-body" data-reveal>
        <p class="lead">Ich bin Jonas. Entwickler, Wirtschaftsinformatik-Student und Gründer von Kalwa Software.</p>
        <p class="muted">Mich interessiert, was Software für einen Menschen verändern kann: ein Betrieb wird gefunden, ein umständlicher Ablauf wird kürzer, eine Idee wird zu einer nutzbaren Anwendung.</p>
        <p class="muted">Neben dem Studium entwickle ich bei Pöppelmann als Werkstudent im Bereich Marketing &amp; KI interne Anwendungen und Automatisierungen. Mit Kalwa Software und objelis baue ich meine eigenen Projekte auf.</p>
        <p class="muted balance">Ich möchte mit dir sprechen, deine Aufgabe verstehen und die Lösung selbst entwickeln. Mit einem direkten Ansprechpartner von der ersten Idee bis zur Umsetzung.</p>
        <dl class="facts about-facts">
          <div><dt class="label">Ausbildung</dt><dd>Industriekaufmann</dd></div>
          <div><dt class="label">Studium</dt><dd>Wirtschaftsinformatik · Universität Osnabrück</dd></div>
          <div><dt class="label">Arbeit</dt><dd>Werkstudent Marketing &amp; KI · Pöppelmann</dd></div>
          <div><dt class="label">Zertifikat · September 2026</dt><dd>IBM AI Developer</dd></div>
          <div><dt class="label">LinkedIn</dt><dd>${ext(site.links.linkedin, 'linkedin.com/in/jonas-kalwa')}</dd></div>
          <div><dt class="label">GitHub</dt><dd>${ext(site.links.github, 'github.com/Jkalwa05')}</dd></div>
        </dl>
        <div><a class="button button--ghost" href="/lebenslauf/">Lebenslauf ansehen ${arrow}</a></div>
      </div>
    </div>
    <div class="steps-block" data-reveal>
      <p class="label">So arbeite ich mit dir</p>
      <ol class="steps">
        <li><span class="label">01</span><h3>Aufgabe verstehen</h3><p class="muted">Du erzählst mir, was dich Zeit kostet oder was fehlt. Ich frage nach, bis die Aufgabe klar ist.</p></li>
        <li><span class="label">02</span><h3>Lösung entwickeln</h3><p class="muted">Ich baue die Lösung selbst und zeige dir früh, was schon funktioniert.</p></li>
        <li><span class="label">03</span><h3>Gemeinsam ausprobieren</h3><p class="muted">Du testest im Alltag, ich passe nach, bis es zu deiner Arbeit passt.</p></li>
      </ol>
    </div>
  </div>
</section>`;
}
