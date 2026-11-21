(() => {
  const $ = (s) => document.querySelector(s);
  const menuButton = $('.menu-toggle');
  const nav = $('#main-navigation');
  const dialog = $('#booking-dialog');
  const form = $('#booking-form');
  const courseSelect = $('#course-select');
  const status = $('#form-status');
  const email = (typeof GOLDEN_FOX_CONFIG !== 'undefined' && GOLDEN_FOX_CONFIG.email || '').trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !email.includes('beispiel');
  $('#year').textContent = new Date().getFullYear();
  $('#contact-email').textContent = validEmail ? email : 'E-Mail wird vor Veröffentlichung ergänzt';
  menuButton.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(opened));
    menuButton.setAttribute('aria-label', opened ? 'Menü schließen' : 'Menü öffnen');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
  document.querySelectorAll('[data-open-booking]').forEach(button => button.addEventListener('click', () => {
    const course = button.dataset.course;
    if (course) courseSelect.value = course;
    status.textContent = '';
    dialog.showModal();
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
  $('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(form);
    const subject = `Golden Fox – Anfrage: ${formData.get('course')}`;
    const body = `Name: ${formData.get('name')}\nE-Mail: ${formData.get('email')}\nInteresse: ${formData.get('course')}\n\nNachricht:\n${formData.get('message') || '(keine weitere Nachricht)'}`;
    if (!validEmail) {
      status.textContent = 'Demo-Modus: Bitte zuerst deine Geschäfts-E-Mail in config.js ergänzen. Es wurde nichts gesendet.';
      return;
    }
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Dein E-Mail-Programm wird geöffnet. Bitte die Nachricht dort noch absenden.';
  });
  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, {rootMargin:'-20% 0px -70% 0px'});
    sections.forEach(s => observer.observe(s));
  }
})();
