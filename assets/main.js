document.addEventListener("DOMContentLoaded", function () {
    // 1. Detect Language
    const currentLang = document.documentElement.lang || 'en';
    
    // 2. Define path to includes (We are in /fr/ or /en/, so we go back one level)
    const includePath = '../includes/';

    // 3. Load Header
    fetch(includePath + 'header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            
            // Fix header image paths (add ../)
            fixPaths('header-placeholder');
            
            // Setup Logic
            setupMobileMenu();
            setupLanguageDropdown();
            updateLanguageLinks(); // <--- THIS FIXES YOUR URL ISSUE
            applyLanguage(currentLang);
        });

    // 4. Load Footer
    fetch(includePath + 'footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            applyLanguage(currentLang);
            fixPaths('footer-placeholder');
        });

    // 5. Initialize Page Effects
    initScrollReveal();
    setupChatButton();
});

function updateLanguageLinks() {
    // Get the current file name (e.g., "reception.html")
    let fileName = window.location.pathname.split('/').pop();
    
    // Default to index.html if root
    if (!fileName || fileName === '') fileName = 'index.html';

    // Target the English and French links in the header
    const frLink = document.getElementById('lang-link-fr');
    const enLink = document.getElementById('lang-link-en');

    // Set them to point to the sibling folder with the same filename
    if (frLink) frLink.setAttribute('href', '../fr/' + fileName);
    if (enLink) enLink.setAttribute('href', '../en/' + fileName);
}

function applyLanguage(lang) {
    const enElements = document.querySelectorAll('.lang-en');
    const frElements = document.querySelectorAll('.lang-fr');

    if (lang === 'fr') {
        enElements.forEach(el => el.style.display = 'none');
        frElements.forEach(el => el.style.display = ''); 
    } else {
        frElements.forEach(el => el.style.display = 'none');
        enElements.forEach(el => el.style.display = ''); 
    }

    const currentLangSpan = document.getElementById('currentLang');
    if(currentLangSpan) currentLangSpan.textContent = lang.toUpperCase();
}

function fixPaths(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        // Only fix if it's a relative path starting with 'images/'
        if (src && !src.startsWith('http') && !src.startsWith('../') && !src.startsWith('/')) {
            img.setAttribute('src', '../' + src);
        }
    });
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
