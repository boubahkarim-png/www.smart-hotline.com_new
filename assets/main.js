document.addEventListener("DOMContentLoaded", function () {
    // 1. Detect Language
    const currentLang = document.documentElement.lang || 'en';
    
    // We assume pages are in /en/ or /fr/, so includes are one level up
    const includePath = '../includes/';

    // 2. Load Header
    fetch(includePath + 'header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            
            // Re-initialize all scripts for the injected header
            setupMobileMenu();
            setupLanguageDropdown();
            updateLanguageUrls();
            applyLanguageVisibility(currentLang);
            fixPaths('header-placeholder');
        });

    // 3. Load Footer
    fetch(includePath + 'footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            applyLanguageVisibility(currentLang);
            fixPaths('footer-placeholder');
        });

    // 4. Initialize Page Specifics
    initScrollReveal();
    setupChatButton();
});

function updateLanguageUrls() {
    // This function ensures that switching language keeps you on the same page name
    let fileName = window.location.pathname.split('/').pop();
    if (!fileName || fileName === '') fileName = 'index.html';

    const btnFr = document.getElementById('switch-to-fr');
    const btnEn = document.getElementById('switch-to-en');

    // If we are in /en/, go to ../fr/filename
    // If we are in /fr/, go to ../en/filename
    if (btnFr) btnFr.setAttribute('href', '../fr/' + fileName);
    if (btnEn) btnEn.setAttribute('href', '../en/' + fileName);
}

function applyLanguageVisibility(lang) {
    const enElements = document.querySelectorAll('.lang-en');
    const frElements = document.querySelectorAll('.lang-fr');

    if (lang === 'fr') {
        enElements.forEach(el => el.style.display = 'none');
        frElements.forEach(el => el.style.display = ''); // show
        
        // Update Label
        const label = document.getElementById('currentLang');
        if(label) label.textContent = 'FR';
    } else {
        frElements.forEach(el => el.style.display = 'none');
        enElements.forEach(el => el.style.display = ''); // show
        
        // Update Label
        const label = document.getElementById('currentLang');
        if(label) label.textContent = 'EN';
    }
}

function setupLanguageDropdown() {
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');

    if (langToggle && langDropdown) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.add('hidden');
            }
        });
    }
}

function setupMobileMenu() {
    const btn = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');
    if(btn && menu) {
        btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    }
}

function fixPaths(containerId) {
    // Ensures images loaded via AJAX point to ../images/
    const container = document.getElementById(containerId);
    if (!container) return;
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('../') && !src.startsWith('/')) {
            img.setAttribute('src', '../' + src);
        }
    });
}

function setupChatButton() {
    const chatButton = document.getElementById('chatButton');
    if (chatButton) {
        chatButton.addEventListener('click', () => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobile) {
                window.open('https://wa.me/15148190559', '_blank');
            } else {
                window.location.href = 'mailto:direction@smart-hotline.com';
            }
        });
    }
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}
