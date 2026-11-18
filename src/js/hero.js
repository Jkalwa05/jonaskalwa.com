import { gsap, ScrollTrigger, SplitText, EASE, motionOn } from './motion-core.js';

/** Hero-Auftritt unter 1,4 s: Headline aus der Maske, danach heben sich die Geräte ins Bild. Danach schieben sie sich beim Scrollen leicht auseinander. */
export function initHero(root = document) {
  const hero = root.querySelector('#start');
  if (!hero) return;
  const all = [...hero.querySelectorAll('[data-hero]')];
  const finish = () => { all.forEach(el => el.setAttribute('data-revealed', '')); window.__heroDoneAt = performance.now(); };
  window.__heroStartAt = performance.now();
  if (!motionOn()) { finish(); return; }
  const h1 = hero.querySelector('h1');
  const laptop = hero.querySelector('.device--laptop');
  const phone = hero.querySelector('.device--phone');
  const split = SplitText.create(h1, { type: 'lines', mask: 'lines' });
  h1.style.opacity = '1';
  const tl = gsap.timeline({ defaults: { ease: EASE }, onUpdate: () => dispatchEvent(new Event('kalwa:layout')), onComplete: () => { finish(); parallax(); dispatchEvent(new Event('kalwa:layout')); } });
  tl.from(split.lines, { yPercent: 110, duration: 0.8, stagger: 0.08 }, 0)
    .fromTo(hero.querySelectorAll('[data-hero="fade"]'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, clearProps: 'transform' }, 0.2)
    .fromTo(laptop, { opacity: 0, y: 110 }, { opacity: 1, y: 0, duration: 0.9 }, 0.15)
    .fromTo(phone, { opacity: 0, y: 170 }, { opacity: 1, y: 0, duration: 0.9 }, 0.3);

  function parallax() {
    const trigger = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to(laptop, { yPercent: -7, ease: 'none', scrollTrigger: trigger });
    gsap.to(phone, { yPercent: -22, ease: 'none', scrollTrigger: trigger });
  }
}
