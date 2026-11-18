import { themeAt, centerY, onFrame } from './theme.js';

// Kopf und Menü: Verhalten wie im geprüften Vorgänger (aria-expanded, Escape, Fokus, Breakpoint).
export function initNav() {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const isOpen = () => menuButton?.getAttribute('aria-expanded') === 'true';
  function setOpen(open, returnFocus = false) {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    navigation.classList.toggle('is-open', open);
    header?.classList.toggle('menu-open', open);
    if (!open && returnFocus) menuButton.focus();
  }
  menuButton?.addEventListener('click', () => setOpen(!isOpen()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) setOpen(false, true); });
  navigation?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  matchMedia('(min-width: 960px)').addEventListener('change', () => setOpen(false));
  document.addEventListener('pointerdown', e => { if (isOpen() && !header.contains(e.target)) setOpen(false); });
  header?.addEventListener('focusout', e => { if (isOpen() && e.relatedTarget && !header.contains(e.relatedTarget)) setOpen(false); });
  const bar = header?.querySelector('.header-bar');
  // Der Kopf wird ab 8 px Scroll zur abgerundeten Pille und übernimmt die Farbwelt des Bereichs darunter.
  onFrame(() => {
    if (!header) return;
    header.classList.toggle('scrolled', scrollY > 8);
    header.dataset.on = themeAt(centerY(bar));
  });
}
