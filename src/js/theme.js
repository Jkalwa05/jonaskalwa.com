// Welche Farbwelt liegt an einer Stelle des Fensters? Header und Würfel richten sich danach.
let cache;
const areas = () => cache || (cache = [...document.querySelectorAll('[data-theme]')]);

/**
 * Farbwelt an der Stelle (x, y). Das zuletzt passende Element liegt im DOM am tiefsten und gewinnt.
 * Elemente mit data-deep (z. B. ein weißes Gerätebild im blauen Hero) zählen nur mit deep = true:
 * die Würfel sehen den echten Untergrund, die Kopfleiste richtet sich nach dem Bereich.
 */
export function themeAt(y, x = null, deep = false) {
  let hit = 'light';
  for (const el of areas()) {
    if (!deep && el.hasAttribute('data-deep')) continue;
    const r = el.getBoundingClientRect();
    if (r.top <= y && y < r.bottom && (x === null || (r.left <= x && x <= r.right))) hit = el.dataset.theme;
  }
  return hit;
}
export const centerY = el => { const r = el.getBoundingClientRect(); return r.top + r.height / 2; };
export const centerX = el => { const r = el.getBoundingClientRect(); return r.left + r.width / 2; };

/** Ruft fn höchstens einmal pro Frame bei Scrollen, Größenänderung und Seitenwechsel auf. */
export function onFrame(fn) {
  let queued = false;
  const run = () => { queued = false; fn(); };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(run); } };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('hashchange', schedule);
  addEventListener('pageshow', schedule);
  addEventListener('kalwa:layout', schedule); // Bewegungen ohne Scrollen, z. B. der Hero-Auftritt
  fn();
  return schedule;
}
