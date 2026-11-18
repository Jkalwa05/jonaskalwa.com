import { arrow } from '../lib-html.mjs';

const swatch = (name, hex, token) => `<li class="ds-swatch"><span class="ds-chip" style="background:${hex}" aria-hidden="true"></span><span><strong>${name}</strong><br><span class="label">${hex} · ${token}</span></span></li>`;

/** Interne Referenz der Komponenten; nicht verlinkt, noindex. */
export function designSystem() {
  return `<div class="wrap ds">
  <p class="label">Intern · nicht öffentlich verlinkt</p>
  <h1>Design-System</h1>
  <p class="lead">Objelis in Weiß und Blau: ein Theme, ein Blau, Haarlinien statt Karten.</p>
  <section aria-labelledby="ds-farben"><h2 id="ds-farben">Farben</h2><ul class="ds-swatches">
    ${swatch('Grund', '#FFFFFF', '--bg')}${swatch('Schrift', '#101214', '--ink')}${swatch('Zweitschrift', '#505760', '--ink-2')}${swatch('Drittschrift', '#5D6670', '--ink-3')}${swatch('Akzent Blau', '#2857EB', '--accent')}${swatch('Akzent tief', '#1A3CB4', '--accent-deep')}${swatch('Fläche helles Blau', '#EDF1FB', '--ground-wash')}${swatch('Fläche Nachtblau', '#0B1020', '--ground-night')}
  </ul></section>
  <section aria-labelledby="ds-schrift"><h2 id="ds-schrift">Typografie</h2>
    <p class="ds-display">Cabinet Grotesk 800: Software, die für dich arbeitet.</p>
    <p class="lead">Switzer: Ich entwickle Websites, individuelle Anwendungen und Automatisierungen.</p>
    <p class="label">Eyebrow: Switzer 600, Satzschreibung</p>
  </section>
  <section aria-labelledby="ds-buttons"><h2 id="ds-buttons">Buttons</h2><div class="ds-row"><a class="button" href="#ds-buttons">Primär ${arrow}</a><a class="button button--ghost" href="#ds-buttons">Sekundär</a><a class="button button--small" href="#ds-buttons">Klein</a><a class="text-link" href="#ds-buttons">Textlink ${arrow}</a></div></section>
  <section aria-labelledby="ds-flaechen"><h2 id="ds-flaechen">Flächen</h2><div class="ds-themes">
    <div class="theme-blue ds-theme"><p class="label">Blau</p><p class="lead">Hero und Kontakt</p><a class="button" href="#ds-flaechen">Button</a></div>
    <div class="theme-wash ds-theme"><p class="label">Helles Blau</p><p class="lead">Praxis</p><a class="button" href="#ds-flaechen">Button</a></div>
    <div class="theme-night ds-theme"><p class="label">Nachtblau</p><p class="lead">objelis und Fuß</p><a class="button" href="#ds-flaechen">Button</a></div>
  </div></section>
  <section aria-labelledby="ds-wuerfel"><h2 id="ds-wuerfel">Würfel</h2><p class="muted">Offen, passiert, aktiv.</p>
    <div class="ds-row ds-cubes"><span class="cube" aria-hidden="true"></span><span class="cube is-passed" aria-hidden="true"></span><span class="cube is-active" aria-hidden="true"></span></div></section>
</div>`;
}
