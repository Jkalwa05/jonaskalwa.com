import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger);
// Eine Ease-Familie für die ganze Seite (identisch mit --ease in den Tokens).
export const EASE = CustomEase.create('kalwa', '0.2,0.7,0.2,1');
export const DUR = { fast: 0.2, base: 0.4, slow: 0.8 };
export { gsap, ScrollTrigger, SplitText };

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const motionOn = () => document.documentElement.classList.contains('js') && !reducedMotion();

const done = el => { el.setAttribute('data-revealed', ''); };

/** Blendet [data-reveal] beim Eintritt ins Bild ein. Bereits passierte Elemente stehen sofort fertig. */
export function initReveal(root = document) {
  const items = [...root.querySelectorAll('[data-reveal]')];
  if (!motionOn()) { items.forEach(done); return; }
  const play = el => {
    if (el.hasAttribute('data-revealed')) return;
    const kind = el.getAttribute('data-reveal');
    if (kind === 'mask') {
      const split = SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true });
      gsap.from(split.lines, { yPercent: 110, duration: DUR.slow, ease: EASE, stagger: 0.08, onComplete: () => { done(el); } });
      el.style.opacity = '1';
    } else if (kind === 'line') {
      gsap.to(el, { scaleX: 1, duration: DUR.slow, ease: EASE, onComplete: () => done(el) });
    } else {
      gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: DUR.slow, ease: EASE, onComplete: () => { el.style.removeProperty('transform'); done(el); } });
    }
  };
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) { play(e.target); io.unobserve(e.target); }
      else if (e.boundingClientRect.top < 0) { done(e.target); gsap.set(e.target, { clearProps: 'all' }); io.unobserve(e.target); }
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
  items.forEach(el => io.observe(el));
}
