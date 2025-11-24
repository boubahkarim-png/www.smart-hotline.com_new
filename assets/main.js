// =============================================================================
// Main.js - Handles all interactive elements for Smart Hotline Agency
// =============================================================================

// --- Localization Data ---
const translations = {
    fr: {
        'nav-home': 'Accueil',
        'nav-services': 'Services',
        'nav-all-services': 'Tous nos services',
        'nav-discover-range': 'Découvrir notre gamme complète',
        'nav-call-reception': 'Réception d\'Appels',
        'nav-never-miss-call': 'Ne manquez aucun appel',
        'nav-outbound-calls': 'Émission d\'Appels',
        'nav-grow-customer-base': 'Développez votre clientèle',
        'nav-customer-support': 'Support Client',
        'nav-improve-satisfaction': 'Améliorez la satisfaction',
        'nav-crm-lists': 'CRM & Listes',
        'nav-maximize-sales': 'Maximisez vos ventes',
        'nav-pricing': 'Tarifs',
        'nav-about': 'À Propos',
        'nav-blog': 'Blog',
        'nav-contact': 'Contact',
    },
    en: {
        'nav-home': 'Home',
        'nav-services': 'Services',
        'nav-all-services': 'All our services',
        'nav-discover-range': 'Discover our complete range',
        'nav-call-reception': 'Call Reception',
        'nav-never-miss-call': 'Never miss a call',
        'nav-outbound-calls': 'Outbound Calls',
        'nav-grow-customer-base': 'Grow your customer base',
        'nav-customer-support': 'Customer Support',
        'nav-improve-satisfaction': 'Improve satisfaction',
        'nav-crm-lists': 'CRM & Lists',
        'nav-maximize-sales': 'Maximize your sales',
        'nav-pricing': 'Pricing',
        'nav-about': 'About',
        'nav-blog': 'Blog',
        'nav-contact': 'Contact',
    }
};

// --- DOM Elements (will be initialized after includes are loaded) ---
let langToggle, langDropdown, mobileMenuToggle, mobileMenu, chatButton;

// --- State ---
let currentLang = 'fr'; // Default language

// --- Core Functions ---

/**
 * Fetches and injects the header and footer HTML into the page.
 */
function loadIncludes() {
    const pathDepth = window.location.pathname.split('/').length - 3;
    let basePath = '';
    for (let i = 0; i < pathDepth; i++) {
        basePath += '../';
    }

    // Load Header
    fetch(`${basePath}includes/header.html`)
        .then(response => response.text())
        .then(html => {
            let processedHtml = html;
            if (pathDepth === 0) {
                processedHtml = processedHtml.replace(/href="\.\.\//g, 'href="');
            }
            document.getElementById('header-placeholder').innerHTML = processedHtml;
            initializeHeaderScripts(basePath);
        })
        .catch(error => console.error('Error loading header:', error));

    // Load Footer
    fetch(`${basePath}includes/footer.html`)
        .then(response => response.text())
        .then(html => {
            let processedHtml = html;
            if (pathDepth === 0) {
                processedHtml = processedHtml.replace(/href="\.\.\//g, 'href="');
            }
            document.getElementById('footer-placeholder').innerHTML = processedHtml;
            initializeFooterScripts();
        })
        .catch(error => console.error('Error loading footer:', error));
}

/**
 * Initializes event listeners and logic for the header after it's loaded.
 * @param {string} basePath - The relative path to the root directory.
 */
function initializeHeaderScripts(basePath) {
    langToggle = document.getElementById('langToggle');
    langDropdown = document.getElementById('langDropdown');
    mobileMenuToggle = document.getElementById('mobileMenuToggle');
    mobileMenu = document.getElementById('mobileMenu');

    // Localize the header content
    localizeHeader(basePath);

    // Language Selector Toggle
    if (langToggle) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('hidden');
        });
    }

    // Mobile Menu Toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Close dropdowns/menus when clicking outside
    document.addEventListener('click', (e) => {
        if (langToggle && !langToggle.contains(e.target)) {
            langDropdown.classList.add('hidden');
        }
    });
}

/**
 * Updates the header text and links based on the current language and page.
 * @param {string} basePath - The relative path to the root directory.
 */
function localizeHeader(basePath) {
    // Determine current language and page from URL
    const pathParts = window.location.pathname.replace(/^\/|\/$/g, '').split('/');
    const isRootPage = pathParts.length === 1 && (pathParts[0] === '' || pathParts[0].endsWith('.html'));
    
    let lang = 'fr'; // Default to French
    let currentPage = 'index.html';

    if (!isRootPage) {
        lang = pathParts[0];
        currentPage = pathParts[1] || 'index.html';
    }

    currentLang = lang;
    const otherLang = lang === 'fr' ? 'en' : 'fr';

    // Update all text elements with data-lang-text attribute
    document.querySelectorAll('[data-lang-text]').forEach(element => {
        const key = element.getAttribute('data-lang-text');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update the current language indicator in the dropdown
    const currentLangSpan = document.getElementById('currentLang');
    if (currentLangSpan) {
        currentLangSpan.textContent = lang.toUpperCase();
    }

    // Update Home/Accueil link
    const homeLink = document.getElementById('home-link');
    const navHome = document.getElementById('nav-home');
    const navHomeMobile = document.getElementById('nav-home-mobile');
    const homeHref = isRootPage ? 'index.html' : `${basePath}index.html`;
    if(homeLink) homeLink.href = homeHref;
    if(navHome) navHome.href = homeHref;
    if(navHomeMobile) navHomeMobile.href = homeHref;

    // Update language switcher links
    const langFrLink = document.getElementById('lang-fr');
    const langEnLink = document.getElementById('lang-en');

    if (lang === 'fr') {
        if (langFrLink) langFrLink.href = '#'; // Stay on current page
        if (langEnLink) langEnLink.href = `${basePath}en/${currentPage}`;
    } else {
        if (langFrLink) langFrLink.href = `${basePath}fr/${currentPage}`;
        if (langEnLink) langEnLink.href = '#'; // Stay on current page
    }
}

/**
 * Initializes event listeners and logic for the footer after it's loaded.
 */
function initializeFooterScripts() {
    chatButton = document.getElementById('chatButton');

    if (chatButton) {
        chatButton.addEventListener('click', () => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const message = encodeURIComponent("Bonjour, je souhaite en savoir plus sur vos services. Pouvez-vous m'aider ?");
            
            if (isMobile) {
                window.open(`https://wa.me/15148190559?text=${message}`, '_blank');
            } else {
                window.location.href = `mailto:direction@smart-hotline.com?subject=Demande d'information - Smart Hotline&body=${message}`;
            }
        });
    }
}

// --- Page-specific Animations ---
function initCounters() { /* ... (same as before) ... */ }
function initScrollReveal() { /* ... (same as before) ... */ }

// --- Main Execution ---
document.addEventListener('DOMContentLoaded', () => {
    loadIncludes();
    initCounters();
    initScrollReveal();
});
