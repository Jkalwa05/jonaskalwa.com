import { esc, arrow, mailto } from '../lib-html.mjs';
import { schemaWebsite, schemaSoftware, schemaAutomation } from '../art/schemas.mjs';

export default function services(site) {
  const items = [
    { title: 'Websites & Sichtbarkeit', art: schemaWebsite(), text: 'Eine Website, auf der Menschen dein Angebot verstehen und den nächsten Schritt finden. Mit klaren Inhalten, guter Bedienung und Suchmaschinenoptimierung.', ziel: 'Dass dich Menschen finden, verstehen und ohne Umweg Kontakt aufnehmen.', tags: ['Unternehmenswebsites', 'Lokale SEO', 'Mobile Nutzung'], cta: { text: 'AK rund ums Haus ansehen', href: '#praxis' } },
    { title: 'Individuelle Software', art: schemaSoftware(), text: 'Eine Anwendung für deine Abläufe: etwa ein Kundenportal, ein internes Werkzeug oder eine Verwaltung, in der deine Daten zusammenkommen.', ziel: 'Deine Daten und Abläufe an einem Ort, passend zu deiner Arbeit.', tags: ['Webanwendungen', 'Interne Werkzeuge', 'Schnittstellen'], cta: { text: 'Softwareprojekt besprechen', href: mailto(site, 'Projektanfrage: Individuelle Software') } },
    { title: 'Automatisierungen & KI', art: schemaAutomation(), text: 'Wiederkehrende Aufgaben verbinden und vereinfachen. Zum Beispiel Anfragen vorsortieren, Daten übertragen oder Dokumente verarbeiten. KI dort, wo sie zur Aufgabe passt.', ziel: 'Weniger Handarbeit bei Wiederkehrendem, KI nur dort, wo sie wirklich hilft.', tags: ['Weniger Handarbeit', 'Verbundene Systeme', 'KI im Prozess'], cta: { text: 'Deinen Ablauf besprechen', href: mailto(site, 'Projektanfrage: Automatisierung & KI') } },
  ];
  const rows = items.map((s, i) => `<article class="service" data-service="${i}">
      <span class="service__node" aria-hidden="true"><span class="service__fill"></span></span>
      <figure class="schema${i === 0 ? ' is-active' : ''}" data-index="${i}" aria-hidden="true"><div class="schema__art">${s.art}</div></figure>
      <div class="service__body${i === 0 ? ' is-current' : ''}">
        <p class="label">Leistung 0${i + 1}</p>
        <h3>${esc(s.title)}</h3>
        <p class="muted">${esc(s.text)}</p>
        <ul class="tags" aria-label="Umfang">${s.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        <p class="ziel"><span class="label">Ziel</span>${esc(s.ziel)}</p>
        <a class="text-link" href="${esc(s.cta.href)}">${esc(s.cta.text)} ${arrow}</a>
      </div>
    </article>`).join('\n');
  return `<section id="leistungen" class="section services theme-light" data-theme="light" data-section data-label="Leistungen" aria-labelledby="leistungen-title">
  <div class="wrap">
    <hr class="hairline section-rule">
    <div class="split services-head">
      <div class="split__head">
        <p class="label" data-reveal>Leistungen</p>
        <h2 id="leistungen-title" data-reveal="mask">Was ich<br>für dich baue.</h2>
      </div>
      <div class="split__body" data-reveal>
        <p class="lead">Du brauchst keine fertige Spezifikation. Erzähl mir, was du vorhast, was dich Zeit kostet oder was deine jetzige Software nicht kann.</p>
        <div><a class="button" href="${esc(mailto(site))}">Deine Aufgabe besprechen ${arrow}</a></div>
      </div>
    </div>
    <div class="service-list">
${rows}
    </div>
  </div>
</section>`;
}
