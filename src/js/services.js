import { gsap, EASE, motionOn } from './motion-core.js';
import { onFrame } from './theme.js';

const STAGE = '(min-width:1100px) and (min-height:700px)';

/** Leistungen: breite, hohe Fenster zeigen eine sticky Bühne, die mit dem Text wechselt; sonst normaler Fluss. */
export function initServices(root = document) {
  const list = root.querySelector('.service-list');
  if (!list) return;
  const figures = [...list.querySelectorAll('.schema')];
  const bodies = [...list.querySelectorAll('.service__body')];
  const nodes = [...list.querySelectorAll('.service__node')];
  const seen = new Set();
  const mq = matchMedia(STAGE);
  const animate = motionOn();
  let current = 0;

  function draw(fig) {
    if (fig.hasAttribute('data-drawn')) return;
    if (!animate) { fig.setAttribute('data-drawn', ''); return; }
    const paths = fig.querySelectorAll('.draw');
    gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
    fig.setAttribute('data-drawn', '');
    gsap.to(paths, { strokeDashoffset: 0, duration: 0.9, ease: EASE, stagger: 0.04 });
  }
  const tryDraw = fig => { if (seen.has(fig) && (!mq.matches || fig.classList.contains('is-active'))) draw(fig); };
  function setActive(i) {
    current = i;
    figures.forEach((f, k) => f.classList.toggle('is-active', k === i));
    bodies.forEach((b, k) => b.classList.toggle('is-current', k === i));
    tryDraw(figures[i]);
  }

  const figureIO = new IntersectionObserver(entries => {
    for (const e of entries) { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); if (e.isIntersecting) tryDraw(e.target); }
  }, { threshold: 0.3 });
  figures.forEach(f => figureIO.observe(f));

  function apply() {
    if (!mq.matches) {
      figures.forEach(f => f.classList.remove('is-active'));
      bodies.forEach(b => b.classList.remove('is-current'));
      figures.forEach(tryDraw);
      return;
    }
    setActive(0);
  }
  apply();
  mq.addEventListener('change', apply);

  onFrame(() => {
    if (!mq.matches) return;
    const mid = innerHeight * 0.5;
    // Wechsel erst, wenn die Überschrift des nächsten Blocks die Fenstermitte erreicht
    let idx = 0;
    bodies.forEach((b, i) => { if (b.getBoundingClientRect().top + innerHeight * 0.1 <= mid) idx = i; });
    if (idx !== current) setActive(idx);
    nodes.forEach(node => {
      const r = node.getBoundingClientRect();
      node.style.setProperty('--p', Math.min(1, Math.max(0, (mid - r.top) / r.height)).toFixed(3));
      node.classList.toggle('is-passed', mid >= r.top + innerHeight * 0.1 + 9);
    });
  });
}
