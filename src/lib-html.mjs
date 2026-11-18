// Kleine HTML-Helfer für die Seitenvorlagen.
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function img(asset, { className = '', loading = 'lazy', priority = false, sizes = '' } = {}) {
  const cls = className ? ` class="${className}"` : '';
  const load = priority ? ' fetchpriority="high"' : ` loading="${loading}"`;
  const sz = sizes ? ` sizes="${sizes}"` : '';
  return `<img${cls} src="${asset.src}" width="${asset.width}" height="${asset.height}" alt="${esc(asset.alt)}" decoding="async"${load}${sz}>`;
}

export const arrow = '<span aria-hidden="true">↗</span>';

/** mailto-Link mit vorbereitetem Entwurf; öffnet nur das Mailprogramm der besuchenden Person. */
export function mailto(site, subject = 'Projektanfrage', body = 'Hallo Jonas,\n\nich möchte mit dir über folgende Aufgabe sprechen:\n\n\n\nViele Grüße') {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
