// Translation data
const translations = {
    fr: {
        nav: {
            home: "Accueil",
            services: "Services",
            allServices: "Tous nos services",
            allServicesDesc: "Découvrir notre gamme complète",
            reception: "Réception d'Appels",
            receptionDesc: "Ne manquez aucun appel",
            emission: "Émission d'Appels",
            emissionDesc: "Développez votre clientèle",
            support: "Support Client",
            supportDesc: "Améliorez la satisfaction",
            pricing: "Tarifs",
            faq: "FAQ",
            blog: "Blog",
            contact: "Contact"
        },
        footer: {
            description: "Services de communication téléphonique adaptés aux entrepreneurs et PME.",
            services: "Services",
            reception: "Réception d'Appels",
            emission: "Émission d'Appels",
            support: "Support Client",
            crm: "CRM & Listes",
            company: "Entreprise",
            about: "À Propos",
            blog: "Blog",
            contact: "Contact",
            careers: "Carrières",
            contactTitle: "Contact",
            copyright: "© 2023 Smart Hotline Agency. Tous droits réservés."
        }
    },
    en: {
        nav: {
            home: "Home",
            services: "Services",
            allServices: "All Services",
            allServicesDesc: "Discover our complete range",
            reception: "Call Reception",
            receptionDesc: "Never miss a call",
            emission: "Outbound Calls",
            emissionDesc: "Grow your customer base",
            support: "Customer Support",
            supportDesc: "Improve satisfaction",
            pricing: "Pricing",
            faq: "FAQ",
            blog: "Blog",
            contact: "Contact"
        },
        footer: {
            description: "Telephone communication solutions tailored for entrepreneurs and SMEs.",
            services: "Services",
            reception: "Call Reception",
            emission: "Outbound Calls",
            support: "Customer Support",
            crm: "CRM & Lists",
            company: "Company",
            about: "About",
            blog: "Blog",
            contact: "Contact",
            careers: "Careers",
            contactTitle: "Contact",
            copyright: "© 2023 Smart Hotline Agency. All rights reserved."
        }
    }
};

// Get current language from URL or default to French
function getCurrentLanguage() {
    const path = window.location.pathname;
    if (path.includes('/en/')) {
        return 'en';
    } else if (path.includes('/fr/')) {
        return 'fr';
    }
    return 'fr'; // Default to French
}

// Apply translations to elements with data-i18n attribute
function applyTranslations() {
    const lang = getCurrentLanguage();
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let translation = translations[lang];
        
        // Navigate through nested keys
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                translation = null;
                break;
            }
        }
        
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Update current language display
    const currentLangSpan = document.getElementById('currentLang');
    if (currentLangSpan) {
        currentLangSpan.textContent = lang.toUpperCase();
    }
}

// Initialize localization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    
    // Re-apply translations when header/footer are loaded
    const observer = new MutationObserver(() => {
        applyTranslations();
    });
    
    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');
    
    if (headerContainer) {
        observer.observe(headerContainer, { childList: true });
    }
    
    if (footerContainer) {
        observer.observe(footerContainer, { childList: true });
    }
});
