// assets/partials.js - simplified loader that uses root-absolute partial paths

document.addEventListener('DOMContentLoaded', function() {
    loadPartial('header-container', '/partials/header.html');
    loadPartial('footer-container', '/partials/footer.html');
});

function loadPartial(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    fetch(url)
        .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(html => el.innerHTML = html)
        .catch(err => console.error('Partial load failed:', url, err));
}
