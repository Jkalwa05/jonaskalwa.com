import { themeAt, centerX, centerY } from './theme.js';

// Zustand der Würfel aus der nativen Scrollposition: aktiv ist der letzte Abschnitt, dessen Oberkante die Fenstermitte erreicht hat.
export function initCubes(root = document) {
  const nav = root.querySelector('nav.cubes');
  if (!nav) return;
  const cubes = [...nav.querySelectorAll('.cube')];
  const sections = cubes.map(c => root.querySelector(c.getAttribute('href')));
  let current = -1;
  let timer;
  let ticking = false;

  const pick = () => {
    const nearEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
    if (nearEnd) return sections.length - 1;
    let idx = 0;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= innerHeight * 0.45) idx = i; });
    return idx;
  };
  // Jeder Würfel richtet sich nach dem Hintergrund an seiner eigenen Stelle, auch an Bereichsgrenzen.
  const paint = () => cubes.forEach(c => { c.dataset.on = themeAt(centerY(c), centerX(c), true); });
  const apply = () => {
    ticking = false;
    paint();
    const idx = pick();
    if (idx === current) return;
    const first = current === -1;
    current = idx;
    cubes.forEach((c, i) => {
      c.classList.toggle('is-active', i === idx);
      c.classList.toggle('is-passed', i < idx);
      if (i === idx) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current');
      if (i !== idx) c.classList.remove('is-announced');
    });
    if (!first) {
      cubes[idx].classList.add('is-announced');
      clearTimeout(timer);
      timer = setTimeout(() => cubes[idx].classList.remove('is-announced'), 1800);
    }
  };
  const schedule = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('hashchange', schedule);
  addEventListener('pageshow', schedule);
  addEventListener('kalwa:layout', schedule); // Hero-Auftritt bewegt Geräte ohne Scrollen
  apply();
}
