import { esc, arrow } from './lib-html.mjs';

// Wird vor dem Laden von app.js ausgeführt: markiert JS und aktiviert die Einblend-Zustände nur,
// wenn Bewegung erlaubt ist. Springt app.js nicht an, werden die Inhalte nach 4 s trotzdem sichtbar.
const bootScript = `(function(d){var c=d.documentElement;c.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches){c.classList.add('motion');window.__motionGuard=setTimeout(function(){c.classList.remove('motion')},4000)}})(document)`;

export function header(site, path = '/') {
  const links = site.nav.map(l => {
    const current = l.href === path ? ' aria-current="page"' : '';
    return `<a href="${l.href}"${current}>${esc(l.label)}</a>`;
  }).join('');
  return `<header class="site-header" data-on="light">
  <div class="header-bar">
    <a class="brand" href="/" aria-label="${esc(site.name)}, Startseite"><img class="brand-symbol" src="/assets/kalwa-monogram.svg" width="64" height="64" alt=""><span class="brand-name">kalwa software</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" aria-label="Menü öffnen"><span></span><span></span></button>
    <nav id="navigation" class="main-nav" aria-label="Hauptnavigation">
      ${links}
      <a class="button button--small" href="/#kontakt">Projekt besprechen ${arrow}</a>
    </nav>
  </div>
</header>`;
}

export function footer(site) {
  const col = (title, items) => `<div class="footer-col"><h2 class="label">${esc(title)}</h2><ul>${items.map(([href, label, ext]) => `<li><a href="${href}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(label)}${ext ? '<span class="sr-only"> (öffnet in neuem Tab)</span>' : ''}</a></li>`).join('')}</ul></div>`;
  return `<footer class="site-footer theme-night" data-theme="night">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="brand" href="/" aria-label="${esc(site.name)}, Startseite"><img class="brand-symbol" src="/assets/kalwa-monogram.svg" width="64" height="64" alt=""><span class="brand-name">kalwa software</span></a>
        <p class="footer-tagline">${esc(site.tagline)}</p>
        <a class="text-link" href="mailto:${site.email}">${esc(site.email)}</a>
      </div>
      <div class="footer-cols">
        ${col('Leistungen', [['/#leistungen', 'Websites & Sichtbarkeit'], ['/#leistungen', 'Individuelle Software'], ['/#leistungen', 'Automatisierungen & KI']])}
        ${col('Projekte', [['/#praxis', 'AK rund ums Haus'], ['/#objelis', 'objelis']])}
        ${col('Über mich', [['/#ueber-mich', 'Jonas Kalwa'], ['/lebenslauf/', 'Lebenslauf'], [site.links.linkedin, 'LinkedIn', true], [site.links.github, 'GitHub', true]])}
        ${col('Rechtliches', [['/impressum/', 'Impressum'], ['/datenschutz/', 'Datenschutz']])}
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Jonas Kalwa · ${esc(site.name)}</span>
      <span>Vechta / Osnabrück</span>
      <a href="#top">Nach oben <span aria-hidden="true">↑</span></a>
    </div>
  </div>
</footer>`;
}

export function document({ site, title, description, path, body, cubes = '', bodyClass = '', noindex = false }) {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#ffffff">
${noindex ? '<meta name="robots" content="noindex,nofollow">\n' : ''}
<script>${bootScript}</script>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
${['cabinet-grotesk-800', 'switzer-400', 'switzer-500', 'switzer-600'].map(f => `<link rel="preload" href="/assets/fonts/${f}-normal.woff2" as="font" type="font/woff2" crossorigin>`).join('\n')}
<link rel="stylesheet" href="/tokens.css">
<link rel="stylesheet" href="/styles.css">
<script type="module" src="/app.js"></script>
</head>
<body id="top"${bodyClass ? ` class="${bodyClass}"` : ''}>
<a class="skip-link" href="#inhalt">Zum Inhalt springen</a>
${header(site, path)}
${cubes}
<main id="inhalt">
${body}
</main>
${footer(site)}
</body>
</html>
`;
}
