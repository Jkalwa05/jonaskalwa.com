// Adresse kopieren: der Knopf erscheint nur, wenn der Browser die Zwischenablage anbietet.
export function initContact(root = document) {
  const button = root.querySelector('[data-copy-email]');
  const status = root.querySelector('#kontakt [role="status"]');
  if (!button || !status) return;
  const email = button.getAttribute('data-copy-email');
  if (!navigator.clipboard?.writeText) return;
  button.hidden = false;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = `E-Mail-Adresse kopiert: ${email}`;
    } catch {
      status.textContent = `Kopieren ist in diesem Browser nicht möglich. Die Adresse lautet ${email}.`;
    }
  });
}
