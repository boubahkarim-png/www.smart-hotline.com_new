document.addEventListener("DOMContentLoaded", function () {
    // 1. Detect Language
    const currentLang = document.documentElement.lang || 'en';
    const includePath = '../includes/';

    // 2. Load Header
    fetch(includePath + 'header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            
            // Fixes
            setupMobileMenu();
            setupLanguageDropdown();
            updateLanguageUrls(); // <--- FIXES THE URL ISSUE
            applyLanguageVisibility(currentLang);
            
            // Force re-rendering of Tailwind classes if needed (rarely needed but safe)
            document.getElementById('header-placeholder').classList.add('loaded');
        });

    // 3. Load Footer
    fetch(includePath + 'footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            applyLanguageVisibility(currentLang);
        });

    // 4. Init Utilities
    initScrollReveal();
    setupChatButton();
});

function updateLanguageUrls() {
    // Get current filename (e.g., "reception.html")
    let fileName = window.location.pathname.split('/').pop();
    if (!fileName || fileName === '') fileName = 'index.html'; // Default to index

    // Get the switch buttons
    const btnFr = document.getElementById('switch-to-fr');
    const btnEn = document.getElementById('switch-to-en');

    // Set relative paths to sibling folders
    // If we are in /en/, ../fr/file.html goes to French
    // If we are in /fr/, ../en/file.html goes to English
    if (btnFr) btnFr.setAttribute('href', '../fr/' + fileName);
    if (btnEn) btnEn.setAttribute('href', '../en/' + fileName);
}

function applyLanguageVisibility(lang) {
    // Controls which text shows up in Header/Footer
    const enElements = document.querySelectorAll('.lang-en');
    const frElements = document.querySelectorAll('.lang-fr');

    if (lang === 'fr') {
        enElements.forEach(el => el.style.display = 'none');
        frElements.forEach(el => el.style.display = ''); 
        const currentLangSpan = document.getElementById('currentLang');
        if(currentLangSpan) currentLangSpan.textContent = 'FR';
    } else {
        frElements.forEach(el => el.style.display = 'none');
        enElements.forEach(el => el.style.display = '');
        const currentLangSpan = document.getElementById('currentLang');
        if(currentLangSpan) currentLangSpan.textContent = 'EN';
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
