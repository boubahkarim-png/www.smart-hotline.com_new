// assets/main.js - minimal JS: partial loading fallback, mobile menu, language links

document.addEventListener('DOMContentLoaded', () => {
  // Load partials if placeholders are present
  function loadPartial(id, path) {
    const el = document.getElementById(id);
    if (!el) return Promise.resolve();
    return fetch(path)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(html => el.innerHTML = html)
      .catch(err => {
        console.warn('Partial failed to load:', path, err);
        el.style.display = 'none';
      });
  }

  // Try to load header and footer from /partials/; safe fallback if not present
  Promise.all([loadPartial('header-placeholder','/partials/header.html'), loadPartial('footer-placeholder','/partials/footer.html')])
    .then(() => initUI());

  // Initialize UI controls
  function initUI(){
    // mobile menu toggle
    const mobToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobToggle && mobileMenu) {
      mobToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
      });
    }

    // ensure images lazy by default
    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
    });

    // language links (if any elements use data-lang)
    document.querySelectorAll('[data-lang]').forEach(el => {
      el.addEventListener('click', (e) => {
        const lang = el.getAttribute('data-lang');
        if (!lang) return;
        if (lang === 'fr') window.location.href = '/fr/';
        if (lang === 'en') window.location.href = '/en/';
      });
    });
  }
});
