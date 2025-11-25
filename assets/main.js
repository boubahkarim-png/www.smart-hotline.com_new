document.addEventListener("DOMContentLoaded", function () {
    // 1. Detect Language (en or fr) based on the html tag
    const currentLang = document.documentElement.lang || 'en';
    const includePath = '../includes/';

    // 2. Load Header
    fetch(includePath + 'header.html')
        .then(response => response.text())
        .then(data => {
            const headerEl = document.getElementById('header-placeholder');
            headerEl.innerHTML = data;

            // FIX: Run these immediately after HTML is inserted
            fixRelativePaths(headerEl);     // Fix images
            setLanguageUrls();              // Fix Language Links (remove #)
            toggleLanguageContent(currentLang); // Show/Hide EN/FR menus
            setupMobileToggle();            // Enable Mobile Menu
        });

    // 3. Load Footer
    fetch(includePath + 'footer.html')
        .then(response => response.text())
        .then(data => {
            const footerEl = document.getElementById('footer-placeholder');
            footerEl.innerHTML = data;
            
            fixRelativePaths(footerEl);
            toggleLanguageContent(currentLang);
        });

    // 4. Chat Button Logic
    const chatButton = document.getElementById('chatButton');
    if (chatButton) {
        chatButton.addEventListener('click', () => {
            window.location.href = 'mailto:direction@smart-hotline.com';
        });
    }
});

// --- CORE FUNCTIONS ---

function setLanguageUrls() {
    // Get the current file name (e.g., 'reception.html')
    let fileName = window.location.pathname.split('/').pop();
    if (!fileName) fileName = 'index.html';

    // Find the switch buttons
    const linkToFr = document.getElementById('link-to-fr');
    const linkToEn = document.getElementById('link-to-en');

    // Force the HREFs. If we are in /en/, link to ../fr/file.html
    if (linkToFr) linkToFr.href = '../fr/' + fileName;
    if (linkToEn) linkToEn.href = '../en/' + fileName;
}

function toggleLanguageContent(lang) {
    // Simple CSS based toggle using classes
    const style = document.createElement('style');
    if (lang === 'fr') {
        style.innerHTML = `
            .lang-en { display: none !important; } 
            .lang-fr { display: block !important; }
            .lang-fr.flex { display: flex !important; }
        `;
        const langLabel = document.getElementById('currentLangLabel');
        if(langLabel) langLabel.textContent = 'FR';
    } else {
        style.innerHTML = `
            .lang-fr { display: none !important; } 
            .lang-en { display: block !important; }
            .lang-en.flex { display: flex !important; }
        `;
        const langLabel = document.getElementById('currentLangLabel');
        if(langLabel) langLabel.textContent = 'EN';
    }
    document.head.appendChild(style);
}

function fixRelativePaths(container) {
    // Adds "../" to images so they load from subfolders
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('../')) {
            img.setAttribute('src', '../' + src);
        }
    });
}

function setupMobileToggle() {
    const btn = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
    
    // Setup Lang Dropdown Toggle (Desktop)
    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');
    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', () => {
            langMenu.classList.add('hidden');
        });
    }
}
