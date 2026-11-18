import { initNav } from './nav.js';
import { initReveal } from './motion-core.js';
import { initHero } from './hero.js';
import { initServices } from './services.js';
import { initContact } from './contact.js';
import { initCubes } from './cubes.js';

/** Nach dem Laden einmal auf die Sprungmarke ausrichten, falls sich das Layout durch Schriften oder Zeichnungen verschoben hat. */
function realignHash() {
  if (!location.hash) return;
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!target) return;
  let moved = false;
  const stop = () => { moved = true; };
  for (const t of ['wheel', 'touchstart', 'keydown', 'pointerdown']) addEventListener(t, stop, { once: true, passive: true });
  requestAnimationFrame(() => { if (!moved) target.scrollIntoView({ behavior: 'instant', block: 'start' }); });
}

initNav();
document.fonts.ready.then(() => {
  initHero();
  initServices();
  initContact();
  initCubes();
  initReveal();
  realignHash();
  clearTimeout(window.__motionGuard);
});
