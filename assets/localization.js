// Localization data
const translations = {
    fr: {
        nav: {
            home: "Accueil",
            services: "Services",
            pricing: "Tarifs",
            faq: "FAQ",
            blog: "Blog",
            contact: "Contact"
        },
        services: {
            all: "Tous nos services",
            all_desc: "Découvrir notre gamme complète",
            reception: "Réception d'Appels",
            reception_desc: "Ne manquez aucun appel",
            emission: "Émission d'Appels",
            emission_desc: "Développez votre clientèle",
            support: "Support Client",
            support_desc: "Améliorez la satisfaction",
            crm: "CRM & Listes",
            crm_desc: "Maximisez vos ventes"
        },
        footer: {
            description: "Services de communication téléphonique adaptés aux entrepreneurs et PME.",
            services: "Services",
            company: "Entreprise",
            contact: "Contact",
            about: "À Propos",
            careers: "Carrières",
            copyright: "© 2023 Smart Hotline Agency. Tous droits réservés."
        },
        common: {
            learn_more: "En savoir plus",
            get_started: "Commencer",
            request_demo: "Demander une Démo",
            discover_offers: "Découvrir Nos Offres",
            contact_us: "Contactez-nous"
        }
    },
    en: {
        nav: {
            home: "Home",
            services: "Services",
            pricing: "Pricing",
            faq: "FAQ",
            blog: "Blog",
            contact: "Contact"
        },
        services: {
            all: "All Services",
            all_desc: "Discover our complete range",
            reception: "Call Reception",
            reception_desc: "Never miss a call",
            emission: "Outbound Calls",
            emission_desc: "Grow your customer base",
            support: "Customer Support",
            support_desc: "Improve satisfaction",
            crm: "CRM & Lists",
            crm_desc: "Maximize your sales"
        },
        footer: {
            description: "Phone communication services adapted for entrepreneurs and SMEs.",
            services: "Services",
            company: "Company",
            contact: "Contact",
            about: "About",
            careers: "Careers",
            copyright: "© 2023 Smart Hotline Agency. All rights reserved."
        },
        common: {
            learn_more: "Learn More",
            get_started: "Get Started",
            request_demo: "Request a Demo",
            discover_offers: "Discover Our Offers",
            contact_us: "Contact Us"
        }
    }
};

// Current language
let currentLang = 'fr';

// Initialize localization
function initLocalization() {
    // Detect language from URL or browser
    const path = window.location.pathname;
    
    if (path.includes('/en/')) {
        currentLang = 'en';
    } else if (path.includes('/fr/')) {
        currentLang = 'fr';
    } else {
        // Default to French or use browser language
        currentLang = 'fr';
    }
    
    // Update language selector
    updateLanguageSelector();
    
    // Apply translations
    applyTranslations();
}

// Update language selector UI
function updateLanguageSelector() {
    const currentLangSpan = document.getElementById('currentLang');
    if (currentLangSpan) {
        currentLangSpan.textContent = currentLang.toUpperCase();
    }
}

// Apply translations to elements with data-translate attribute
function applyTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getTranslation(key);
        
        if (translation) {
            element.textContent = translation;
        }
    });
}

// Get translation for a key
function getTranslation(key) {
    const keys = key.split('.');
    let value = translations[currentLang];
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            return null;
        }
    }
    
    return value;
}

// Switch language
function switchLanguage(lang) {
    if (lang === currentLang) return;
    
    // Get current path
    const currentPath = window.location.pathname;
    
    // Determine new path based on language
    if (lang === 'en' && !currentPath.includes('/en/')) {
        // Switch to English
        if (currentPath.endsWith('/')) {
            window.location.href = currentPath + 'en/index.html';
        } else {
            const pathParts = currentPath.split('/');
            const filename = pathParts[pathParts.length - 1];
            window.location.href = currentPath.replace(filename, 'en/' + filename);
        }
    } else if (lang === 'fr' && currentPath.includes('/en/')) {
        // Switch to French
        window.location.href = currentPath.replace('/en/', '/fr/');
    }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', initLocalization);
