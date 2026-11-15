document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(returnFocus = false) {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Menü öffnen');
  navigation.classList.remove('is-open');
  if (returnFocus) menuButton.focus();
}
menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Menü öffnen' : 'Menü schließen');
  navigation.classList.toggle('is-open', !isOpen);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
matchMedia('(min-width: 640px)').addEventListener('change', () => closeMenu());

function openCVFromLink() {
  if (location.hash === '#lebenslauf') {
    const cv = document.querySelector('#lebenslauf');
    if (cv) cv.open = true;
  }
}
openCVFromLink();
window.addEventListener('hashchange', openCVFromLink);

const form = document.querySelector('.project-form');
const status = form?.querySelector('.form-status');
document.querySelectorAll('[data-interest]').forEach(link => link.addEventListener('click', () => {
  const option = [...form.querySelectorAll('input[name="interest"]')].find(input => input.value === link.dataset.interest);
  if (option) option.checked = true;
}));

form?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const interest = data.get('interest') || 'Eine Idee';
  const description = String(data.get('body') || '').trim();
  const subject = `Projektanfrage: ${interest}`;
  const body = `Hallo Jonas,\n\nich möchte mit dir über ${interest} sprechen.\n\n${description}\n\nViele Grüße`;
  const mailto = `mailto:kalwajonas@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  status.textContent = 'Dein Mailprogramm wurde angefragt. Falls es sich nicht öffnet, schreibe direkt an kalwajonas@gmail.com. Deine Eingaben bleiben hier stehen.';
});

const copyButton = document.querySelector('[data-copy-email]');
if (copyButton && navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('kalwajonas@gmail.com');
      status.textContent = 'E-Mail-Adresse kopiert: kalwajonas@gmail.com';
    } catch {
      status.textContent = 'Kopieren ist in diesem Browser nicht möglich. Die Adresse lautet kalwajonas@gmail.com.';
    }
  });
}

// Nur der Leitsatz wird beim Scrollen hervorgehoben; Inhalte bleiben ohne JS vollständig sichtbar.
if (document.querySelector('[data-moment]')) import('/assets/moments/moments.js').catch(() => {});
