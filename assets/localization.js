// assets/localisation.js
// Localization system for Smart Hotline Agency

document.addEventListener('DOMContentLoaded', function() {
    // Language data
    const translations = {
        fr: {
            // Navigation
            "nav.home": "Accueil",
            "nav.services": "Services",
            "nav.pricing": "Tarifs",
            "nav.about": "À Propos",
            "nav.blog": "Blog",
            "nav.contact": "Contact",
            
            // Home page
            "home.title": "Smart Hotline Agency | Services de Communication pour PME",
            "home.description": "Solutions de communication téléphonique adaptées pour les entrepreneurs et PME. Secrétaire à distance, télémarketing, support client externalisé et CRM personnalisé.",
            "home.keywords": "secrétaire à distance, secrétaire virtuelle, télémarketing, support client externalisé, CRM PME, centre d'appels externalisé",
            "home.heroTitle": "Services de Communication Personnalisés",
            "home.heroDescription": "Externalisez vos relations clients et concentrez-vous sur votre croissance avec nos solutions adaptées aux entrepreneurs et PME.",
            "home.requestDemo": "Demander une Démo Gratuite",
            "home.discoverServices": "Découvrir Nos Services",
            "home.trustedBy": "Approuvé par plus de 500 PME et entreprises en croissance",
            "home.secure": "Sécurisé & Confidentiel",
            "home.availability": "Disponibilité 24/7",
            "home.professional": "Agents Professionnels",
            "home.costEffective": "Rentable",
            "home.ourSolutions": "Nos Solutions Complètes",
            "home.solutionsDescription": "Une gamme complète de services pour répondre à tous vos besoins de communication téléphonique",
            "home.callReception": "Réception d'Appels",
            "home.receptionDescription": "Ne manquez plus jamais un appel important avec notre service de réception dédié.",
            "home.callMaking": "Appels Sortants",
            "home.makingDescription": "Développez votre clientèle avec nos campagnes d'appels ciblées.",
            "home.customerSupport": "Support Client",
            "home.supportDescription": "Améliorez la satisfaction de vos clients avec un support réactif et professionnel.",
            "home.crmLists": "CRM & Listes",
            "home.crmDescription": "CRM complet avec listes qualifiées et autocomposeur pour maximiser vos ventes.",
            "home.learnMore": "En savoir plus →",
            "home.howItWorks": "Comment Ça Marche",
            "home.processDescription": "Commencez avec nos services en seulement 4 étapes simples",
            "home.consultation": "Consultation",
            "home.consultationDescription": "Nous analysons vos besoins commerciaux et vos défis de communication",
            "home.customization": "Personnalisation",
            "home.customizationDescription": "Nous adaptons nos services à votre marque et à vos exigences",
            "home.implementation": "Implémentation",
            "home.implementationDescription": "Nous mettons en place votre solution de communication dédiée",
            "home.support": "Support",
            "home.supportDescription": "Nous fournissons un support continu et un suivi des performances",
            "home.tryServices": "Essayez Nos Services Sans Risque",
            "home.trialDescription": "Découvrez les avantages des services de communication professionnels avec notre essai de 2 semaines. Aucun engagement requis.",
            "home.trialIncludes": "Ce qui est inclus dans l'essai :",
            "home.trialFeature1": "Accès complet à notre service de réception d'appels",
            "home.trialFeature2": "Gestion professionnelle du support client",
            "home.trialFeature3": "Gestionnaire de compte dédié",
            "home.trialFeature4": "Rapports de performance et aperçus",
            "home.trialDuration": "2 Semaines",
            "home.trialText": "Essai Sans Engagement",
            "home.provenResults": "Résultats Prouvés",
            "home.resultsDescription": "Découvrez comment nos services transforment les PME comme la vôtre",
            "home.satisfiedSMEs": "PME Satisfaites",
            "home.smeDescription": "Nous soutenons déjà",
            "home.satisfactionRate": "Taux de Satisfaction",
            "home.satisfactionDescription": "De nos clients",
            "home.timeSavings": "Gain de Temps",
            "home.timeDescription": "Pour nos clients",
            "home.availability": "Disponibilité",
            "home.availabilityDescription": "De nos services",
            "home.clientTestimonials": "Ce Que Disent Nos Clients",
            "home.testimonialsDescription": "Découvrez comment nos solutions ont aidé des entrepreneurs comme vous à développer leur entreprise",
            "home.readyToTransform": "Prêt à Transformer Votre Communication?",
            "home.ctaDescription": "Rejoignez des centaines d'entrepreneurs et PME qui ont déjà optimisé leurs relations clients avec nos solutions.",
            "home.requestDemoBtn": "Demander une Démo Gratuite",
            "home.discoverOffers": "Découvrir Nos Offres",
            
            // Footer
            "footer.description": "Solutions de communication téléphonique adaptées pour les entrepreneurs et PME.",
            "footer.services": "Services",
            "footer.callReception": "Réception d'Appels",
            "footer.callMaking": "Appels Sortants",
            "footer.customerSupport": "Support Client",
            "footer.crmLists": "CRM & Listes",
            "footer.company": "Entreprise",
            "footer.about": "À Propos",
            "footer.blog": "Blog",
            "footer.pricing": "Tarifs",
            "footer.contact": "Contact",
            "footer.address": "123 rue de la République, Montréal, QC H3A 2B4",
            "footer.copyright": "© 2023 Smart Hotline Agency. Tous droits réservés.",
            "footer.terms": "Conditions Générales",
            "footer.privacy": "Politique de Confidentialité"
        },
        en: {
            // Navigation
            "nav.home": "Home",
            "nav.services": "Services",
            "nav.pricing": "Pricing",
            "nav.about": "About",
            "nav.blog": "Blog",
            "nav.contact": "Contact",
            
            // Home page
            "home.title": "Smart Hotline Agency | Communication Services for SMEs",
            "home.description": "Telephone communication solutions tailored for entrepreneurs and SMEs. Remote secretary, telemarketing, outsourced customer support and customized CRM.",
            "home.keywords": "remote secretary, virtual secretary, telemarketing, outsourced customer support, SME CRM, outsourced call center",
            "home.heroTitle": "Personalized Communication Services",
            "home.heroDescription": "Outsource your customer relations and focus on your growth with our solutions adapted for entrepreneurs and SMEs.",
            "home.requestDemo": "Request a Free Demo",
            "home.discoverServices": "Discover Our Services",
            "home.trustedBy": "Trusted by over 500 SMEs and growing businesses",
            "home.secure": "Secure & Confidential",
            "home.availability": "24/7 Availability",
            "home.professional": "Professional Agents",
            "home.costEffective": "Cost-Effective",
            "home.ourSolutions": "Our Complete Solutions",
            "home.solutionsDescription": "A complete range of services to meet all your telephone communication needs",
            "home.callReception": "Call Reception",
            "home.receptionDescription": "Never miss an important call again with our dedicated reception service.",
            "home.callMaking": "Outbound Calls",
            "home.makingDescription": "Grow your clientele with our targeted call campaigns.",
            "home.customerSupport": "Customer Support",
            "home.supportDescription": "Improve your customer satisfaction with responsive and professional support.",
            "home.crmLists": "CRM & Lists",
            "home.crmDescription": "Complete CRM with qualified lists and autodialer to maximize your sales.",
            "home.learnMore": "Learn more →",
            "home.howItWorks": "How It Works",
            "home.processDescription": "Get started with our services in just 4 simple steps",
            "home.consultation": "Consultation",
            "home.consultationDescription": "We analyze your business needs and communication challenges",
            "home.customization": "Customization",
            "home.customizationDescription": "We adapt our services to your brand and requirements",
            "home.implementation": "Implementation",
            "home.implementationDescription": "We set up your dedicated communication solution",
            "home.support": "Support",
            "home.supportDescription": "We provide ongoing support and performance monitoring",
            "home.tryServices": "Try Our Services Risk-Free",
            "home.trialDescription": "Discover the benefits of professional communication services with our 2-week trial. No commitment required.",
            "home.trialIncludes": "What's included in the trial:",
            "home.trialFeature1": "Full access to our call reception service",
            "home.trialFeature2": "Professional customer support management",
            "home.trialFeature3": "Dedicated account manager",
            "home.trialFeature4": "Performance reports and insights",
            "home.trialDuration": "2 Weeks",
            "home.trialText": "No-Commitment Trial",
            "home.provenResults": "Proven Results",
            "home.resultsDescription": "Discover how our services transform SMEs like yours",
            "home.satisfiedSMEs": "Satisfied SMEs",
            "home.smeDescription": "Already supporting",
            "home.satisfactionRate": "Satisfaction Rate",
            "home.satisfactionDescription": "Of our clients",
            "home.timeSavings": "Time Savings",
            "home.timeDescription": "For our clients",
            "home.availability": "Availability",
            "home.availabilityDescription": "Of our services",
            "home.clientTestimonials": "What Our Clients Say",
            "home.testimonialsDescription": "Discover how our solutions have helped entrepreneurs like you grow their business",
            "home.readyToTransform": "Ready to Transform Your Communication?",
            "home.ctaDescription": "Join hundreds of entrepreneurs and SMEs who have already optimized their customer relations with our solutions.",
            "home.requestDemoBtn": "Request a Free Demo",
            "home.discoverOffers": "Discover Our Offers",
            
            // Footer
            "footer.description": "Telephone communication solutions tailored for entrepreneurs and SMEs.",
            "footer.services": "Services",
            "footer.callReception": "Call Reception",
            "footer.callMaking": "Outbound Calls",
            "footer.customerSupport": "Customer Support",
            "footer.crmLists": "CRM & Lists",
            "footer.company": "Company",
            "footer.about": "About",
            "footer.blog": "Blog",
            "footer.pricing": "Pricing",
            "footer.contact": "Contact",
            "footer.address": "123 Republic Street, Montreal, QC H3A 2B4",
            "footer.copyright": "© 2023 Smart Hotline Agency. All rights reserved.",
            "footer.terms": "Terms of Service",
            "footer.privacy": "Privacy Policy"
        }
    };

    // Get current language from URL or default to French
    function getCurrentLanguage() {
        const path = window.location.pathname;
        if (path.includes('/en/')) {
            return 'en';
        }
        return 'fr';
    }

    // Apply translations to elements with data-i18n attribute
    function applyTranslations(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'META') {
                    element.setAttribute('content', translations[lang][key]);
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        
        // Update language indicator
        const languageIndicator = document.getElementById('current-language');
        if (languageIndicator) {
            languageIndicator.textContent = lang.toUpperCase();
        }
    }

    // Initialize localization
    const currentLang = getCurrentLanguage();
    applyTranslations(currentLang);
    
    // Make function available globally
    window.changeLanguage = function(lang) {
        // Update URL without page reload
        const currentPath = window.location.pathname;
        let newPath;
        
        if (lang === 'en') {
            if (currentPath.includes('/fr/')) {
                newPath = currentPath.replace('/fr/', '/en/');
            } else {
                newPath = '/en/' + currentPath.substring(currentPath.lastIndexOf('/') + 1);
            }
        } else {
            if (currentPath.includes('/en/')) {
                newPath = currentPath.replace('/en/', '/fr/');
            } else {
                newPath = '/fr/' + currentPath.substring(currentPath.lastIndexOf('/') + 1);
            }
        }
        
        window.location.href = newPath;
    };
});
