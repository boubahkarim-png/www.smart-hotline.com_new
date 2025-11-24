// Localization data
const localization = {
    fr: {
        currency: '€',
        phone: '+1 514 819 0559',
        email: 'direction@smart-hotline.com',
        whatsapp: 'https://wa.me/15148190559?text=Bonjour,%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services.%20Pouvez-vous%20m\'aider%3F',
        meeting: 'https://calendly.com/boubah-karim/30min',
        prices: {
            basic: '99€',
            pro: '199€',
            enterprise: '399€'
        }
    },
    en: {
        currency: '$',
        phone: '+1 514 819 0559',
        email: 'direction@smart-hotline.com',
        whatsapp: 'https://wa.me/15148190559?text=Hello,%20I%20would%20like%20to%20know%20more%20about%20your%20services.%20Can%20you%20help%20me%3F',
        meeting: 'https://calendly.com/boubah-karim/30min',
        prices: {
            basic: '$99',
            pro: '$199',
            enterprise: '$399'
        }
    },
    ca: {
        currency: 'CAD $',
        phone: '+1 514 819 0559',
        email: 'direction@smart-hotline.com',
        whatsapp: 'https://wa.me/15148190559?text=Hello,%20I%20would%20like%20to%20know%20more%20about%20your%20services.%20Can%20you%20help%20me%3F',
        meeting: 'https://calendly.com/boubah-karim/30min',
        prices: {
            basic: 'CAD $129',
            pro: 'CAD $259',
            enterprise: 'CAD $519'
        }
    }
};

// Detect user's location and language
function detectUserLocale() {
    // Check browser language first
    const browserLang = navigator.language || navigator.userLanguage;
    
    // Default to French
    let locale = 'fr';
    
    // Check if it's an English-speaking region
    if (browserLang.startsWith('en')) {
        locale = 'en';
    }
    
    // Check if it's Canada (needs special handling for currency)
    if (browserLang.includes('CA') || browserLang.includes('Canada')) {
        locale = 'ca';
    }
    
    // Try to get geolocation (this requires user permission)
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                // In a real implementation, you would send coordinates to a geocoding service
                // For this demo, we'll just use browser language detection
                console.log('Geolocation detected:', position.coords);
            },
            error => {
                console.log('Geolocation denied:', error);
            }
        );
    }
    
    return locale;
}

// Apply localization to page
function applyLocalization() {
    const locale = detectUserLocale();
    const locData = localization[locale];
    
    // Update currency symbols
    document.querySelectorAll('[data-currency]').forEach(el => {
        el.textContent = locData.currency;
    });
    
    // Update phone numbers
    document.querySelectorAll('[data-phone]').forEach(el => {
        el.textContent = locData.phone;
        el.href = `tel:${locData.phone.replace(/\s/g, '')}`;
    });
    
    // Update email links
    document.querySelectorAll('[data-email]').forEach(el => {
        el.textContent = locData.email;
        el.href = `mailto:${locData.email}`;
    });
    
    // Update WhatsApp links
    document.querySelectorAll('[data-whatsapp]').forEach(el => {
        el.href = locData.whatsapp;
    });
    
    // Update meeting links
    document.querySelectorAll('[data-meeting]').forEach(el => {
        el.href = locData.meeting;
    });
    
    // Update prices
    document.querySelectorAll('[data-price]').forEach(el => {
        const priceType = el.getAttribute('data-price');
        if (locData.prices[priceType]) {
            el.textContent = locData.prices[priceType];
        }
    });
    
    // Update language selector
    const langSelector = document.getElementById('langSelector');
    if (langSelector) {
        langSelector.textContent = locale.toUpperCase();
    }
}

// Initialize localization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    applyLocalization();
});
