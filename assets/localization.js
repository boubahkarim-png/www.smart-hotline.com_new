// Localization management
class Localization {
    constructor() {
        this.currentLang = this.getCurrentLanguage();
        this.translations = {
            fr: {
                // Navigation
                'nav.home': 'Accueil',
                'nav.services': 'Services',
                'nav.pricing': 'Tarifs',
                'nav.faq': 'FAQ',
                'nav.blog': 'Blog',
                'nav.contact': 'Contact',
                
                // Services dropdown
                'services.all': 'Tous nos services',
                'services.reception': 'Réception d\'Appels',
                'services.emission': 'Émission d\'Appels',
                'services.support': 'Support Client',
                'services.crm': 'CRM & Listes',
                
                // Hero section
                'hero.title': 'Services de Communication Sur Mesure',
                'hero.description': 'Externalisez votre relation client et concentrez-vous sur votre croissance avec nos solutions adaptées aux entrepreneurs et PME.',
                'hero.cta.demo': 'Demander une Démo Gratuite',
                'hero.cta.services': 'Découvrir Nos Services',
                
                // Trust badges
                'trust.title': 'De confiance pour 500+ PME et entreprises en croissance',
                'trust.secure': 'Sécurisé & Confidentiel',
                'trust.availability': 'Disponibilité 24/7',
                'trust.professional': 'Agents Professionnels',
                'trust.cost': 'Rentable',
                
                // Add more translations as needed
            },
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.services': 'Services',
                'nav.pricing': 'Pricing',
                'nav.faq': 'FAQ',
                'nav.blog': 'Blog',
                'nav.contact': 'Contact',
                
                // Services dropdown
                'services.all': 'All our services',
                'services.reception': 'Call Reception',
                'services.emission': 'Outbound Calls',
                'services.support': 'Customer Support',
                'services.crm': 'CRM & Lists',
                
                // Hero section
                'hero.title': 'Custom Communication Services',
                'hero.description': 'Outsource your customer relations and focus on your growth with our solutions tailored for entrepreneurs and SMEs.',
                'hero.cta.demo': 'Request a Free Demo',
                'hero.cta.services': 'Discover Our Services',
                
                // Trust badges
                'trust.title': 'Trusted by 500+ SMEs and growing businesses',
                'trust.secure': 'Secure & Confidential',
                'trust.availability': '24/7 Availability',
                'trust.professional': 'Professional Agents',
                'trust.cost': 'Cost Effective',
                
                // Add more translations as needed
            }
        };
    }

    getCurrentLanguage() {
        const path = window.location.pathname;
        if (path.startsWith('/en/')) return 'en';
        if (path.startsWith('/fr/')) return 'fr';
        return 'fr'; // default
    }

    translate(key) {
        return this.translations[this.currentLang][key] || key;
    }

    updatePageLanguage() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });

        // Update all elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
        });

        // Update current language indicator
        if (currentLangSpan) {
            currentLangSpan.textContent = this.currentLang.toUpperCase();
        }
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        this.updatePageLanguage();
        // You can also save the preference in localStorage
        localStorage.setItem('preferred-language', lang);
    }
}

// Initialize localization
const localization = new Localization();

// Update page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    localization.updatePageLanguage();
});
