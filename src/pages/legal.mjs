import { esc } from '../lib-html.mjs';

export function impressum(site) {
  const a = site.address;
  return `<div class="wrap prose-page"><p class="label">${esc(site.name)}</p><h1>Impressum</h1>
<h2>Anbieter</h2><address>Jonas Kalwa<br>${esc(site.name)}<br>${esc(a.street)}<br>${esc(a.city)}<br>${esc(a.country)}</address>
<p>${esc(site.name)} ist die Geschäftsbezeichnung des nicht eingetragenen Einzelunternehmens von Jonas Kalwa.</p>
<h2>Kontakt</h2><p>E-Mail: <a href="mailto:${site.email}">${esc(site.email)}</a><br>Telefon: <a href="tel:${site.phone.replace(/\s/g, '')}">${esc(site.phone)}</a></p>
<h2>Informationen zum Anbieter</h2><p>Die Anbieterinformationen werden gemäß <a href="https://www.gesetze-im-internet.de/ddg/__5.html" target="_blank" rel="noopener noreferrer">§ 5 Digitale-Dienste-Gesetz<span class="sr-only"> (öffnet in neuem Tab)</span></a> bereitgestellt.</p></div>`;
}

export function datenschutz(site) {
  const a = site.address;
  return `<div class="wrap prose-page"><p class="label">${esc(site.name)}</p><h1>Datenschutz</h1><p>Stand: November 2026</p>
<h2>Verantwortlicher</h2><address>Jonas Kalwa · ${esc(site.name)}<br>${esc(a.street)}, ${esc(a.city)}, ${esc(a.country)}<br><a href="mailto:${site.email}">${esc(site.email)}</a></address>
<h2>Hosting</h2><p>Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, gehostet. Beim Abruf verarbeitet der Hostinganbieter technisch notwendige Verbindungsdaten wie IP-Adresse, Datum und Uhrzeit, die angeforderte Adresse und Angaben zu deinem Browser in Server-Protokollen, damit die Seite ausgeliefert und sicher betrieben werden kann. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Dabei kann eine Übermittlung von Daten in die USA stattfinden. Hierfür gelten die Garantien nach Kapitel V DSGVO, die der Anbieter in seinen Datenschutzbestimmungen beschreibt.</p>
<h2>Schriftarten, Bilder und Analyse</h2><p>Die Schriftarten und Bilder werden zusammen mit dieser Website ausgeliefert. Diese Website bindet keine Analyse- oder Marketingdienste und keine externen Social-Media-Widgets ein. Der Website-Code setzt keine Cookies und speichert keine Besucherdaten im lokalen Browserspeicher.</p>
<h2>Projektanfrage per E-Mail</h2><p>Die Schaltfläche „E-Mail vorbereiten“ öffnet dein eigenes Mailprogramm mit einem vorbereiteten Entwurf. Dabei wird nichts an einen Formularserver übertragen. Erst wenn du die E-Mail selbst abschickst, erhalte ich deine Angaben.</p>
<p>Wenn du mich kontaktierst, verarbeite ich deine E-Mail-Adresse und die mitgeteilten Informationen zur Bearbeitung deiner Anfrage. Bei vorvertraglichen Anfragen ist die Rechtsgrundlage Art. 6 Abs. 1 lit. b DSGVO, bei anderen Anfragen Art. 6 Abs. 1 lit. f DSGVO. Die Daten werden gelöscht, wenn sie zur Bearbeitung nicht mehr benötigt werden und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
<h2>Externe Links</h2><p>Links zu GitHub, LinkedIn und Projektwebsites öffnen die jeweils verlinkten Angebote. Erst beim Aufruf dieser Links wird eine Verbindung zu deren Anbietern hergestellt. Für die weitere Verarbeitung dort gelten deren Datenschutzhinweise.</p>
<h2>Deine Rechte</h2><p>Du hast nach Maßgabe der DSGVO Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit. Soweit die Verarbeitung auf berechtigten Interessen beruht, kannst du aus Gründen deiner besonderen Situation widersprechen. Eine erteilte Einwilligung kann für die Zukunft widerrufen werden.</p>
<p>Du kannst dich bei einer Datenschutzaufsichtsbehörde beschweren, insbesondere bei der <a href="https://www.lfd.niedersachsen.de/" target="_blank" rel="noopener noreferrer">Landesbeauftragten für den Datenschutz Niedersachsen<span class="sr-only"> (öffnet in neuem Tab)</span></a>. Für Fragen zu deinen Daten erreichst du mich über die oben genannte E-Mail-Adresse.</p></div>`;
}
