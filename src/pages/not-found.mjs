import { arrow } from '../lib-html.mjs';
export function notFound() {
  return `<div class="wrap not-found"><p class="label">Fehler 404</p><h1>Diese Seite<br>gibt es nicht.</h1><p>Die Startseite bringt dich zu meinen Leistungen und Projekten.</p><a class="button" href="/">Zur Startseite ${arrow}</a></div>`;
}
