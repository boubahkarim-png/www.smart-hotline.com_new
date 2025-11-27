  // assets/main.js
// Main JavaScript for Smart Hotline Agency

document.addEventListener('DOMContentLoaded', function() {
    // Create and insert header
    createHeader();
    
    // Create and insert footer
    createFooter();
    
    // Initialize mobile menu toggle
    initializeMobileMenu();
    
    // Initialize language selector
    initializeLanguageSelector();
    
    // Initialize scroll reveal animation
    initializeScrollReveal();
    
    // Initialize stats counter animation
    initializeStatsCounter();
    
    // Initialize chat button
    initializeChatButton();
});

// Function to create and insert header
function createHeader() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        const currentPath = window.location.pathname;
        const isFrench = currentPath.includes('/fr/') || currentPath.endsWith('/fr');
        const isEnglish = currentPath.includes('/en/') || currentPath.endsWith('/en');
        
        const homeLink = isEnglish ? '../en/index.html' : (isFrench ? '../fr/index.html' : 'index.html');
        const servicesLink = isEnglish ? '../en/services.html' : (isFrench ? '../fr/services.html' : 'services.html');
        const pricingLink = isEnglish ? '../en/pricing.html' : (isFrench ? '../fr/pricing.html' : 'pricing.html');
        const aboutLink = isEnglish ? '../en/about.html' : (isFrench ? '../fr/about.html' : 'about.html');
        const blogLink = isEnglish ? '../en/blog.html' : (isFrench ? '../fr/blog.html' : 'blog.html');
        const contactLink = isEnglish ? '../en/contact.html' : (isFrench ? '../fr/contact.html' : 'contact.html');
        
        const frenchLink = isEnglish ? '../fr/index.html' : (isFrench ? '../fr/index.html' : '../fr/index.html');
        const englishLink = isEnglish ? '../en/index.html' : (isFrench ? '../en/index.html' : '../en/index.html');
        
        const logoSrc = isEnglish || isFrench ? '../images/logo.png' : 'images/logo.png';
        
        const currentLang = isEnglish ? 'EN' : 'FR';
        
        const navHome = isEnglish ? 'Home' : 'Accueil';
        const navServices = isEnglish ? 'Services' : 'Services';
        const navPricing = isEnglish ? 'Pricing' : 'Tarifs';
        const navAbout = isEnglish ? 'About' : 'À Propos';
        const navBlog = isEnglish ? 'Blog' : 'Blog';
        const navContact = isEnglish ? 'Contact' : 'Contact';
        
        headerContainer.innerHTML = `
            <header class="bg-white shadow-sm sticky top-0 z-50">
                <div class="container mx-auto px-6 py-4">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <a href="${homeLink}" class="flex items-center">
                                <img src="${logoSrc}" alt="Smart Hotline Agency" class="h-10 mr-3">
                                <span class="text-xl font-bold text-primary-600">Smart Hotline Agency</span>
                            </a>
                        </div>
                        
                        <nav class="hidden md:flex space-x-8">
                            <a href="${homeLink}" class="text-gray-700 hover:text-primary-600 font-medium transition-colors" data-i18n="nav.home">${navHome}</a>
                            <a href="${servicesLink}" class="text-gray-700 hover:text-primary-600 font-medium transition-colors" data-i18n="nav.services">${navServices}</a>
                            <a href="${pricingLink}" class="text-gray-700 hover:text-primary-600 font-medium transition-colors" data-i18n="nav.pricing">${navPricing}</a>
                            <a href="${aboutLink}" class="text-gray-700 hover:text-primary-600 font-medium transition-colors" data-i18n="nav.about">${navAbout}</a>
                            <a href="${blogLink}" class="text-gray-700 hover:text-primary-600 font-medium transition-colors" data-i18n="nav.blog">${navBlog}</a>
                            <a href="${contactLink}" class="text-gray-700 hover:text-primary-600 font-medium transition-colors" data-i18n="nav.contact">${navContact}</a>
                        </nav>
                        
                        <div class="flex items-center space-x-4">
                            <div class="relative language-selector">
                                <button id="language-toggle" class="flex items-center text-gray-700 hover:text-primary-600 transition-colors">
                                    <i class="fas fa-globe mr-2"></i>
                                    <span id="current-language">${currentLang}</span>
                                    <i class="fas fa-chevron-down ml-1 text-xs"></i>
                                </button>
                                <div id="language-dropdown" class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 hidden">
                                    <a href="${frenchLink}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Français</a>
                                    <a href="${englishLink}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">English</a>
                                </div>
                            </div>
                            
                            <button id="mobile-menu-toggle" class="md:hidden text-gray-700 hover:text-primary-600">
                                <i class="fas fa-bars text-xl"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Mobile Menu -->
                    <div id="mobile-menu" class="md:hidden mt-4 pb-4 hidden">
                        <nav class="flex flex-col space-y-2">
                            <a href="${homeLink}" class="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2" data-i18n="nav.home">${navHome}</a>
                            <a href="${servicesLink}" class="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2" data-i18n="nav.services">${navServices}</a>
                            <a href="${pricingLink}" class="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2" data-i18n="nav.pricing">${navPricing}</a>
                            <a href="${aboutLink}" class="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2" data-i18n="nav.about">${navAbout}</a>
                            <a href="${blogLink}" class="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2" data-i18n="nav.blog">${navBlog}</a>
                            <a href="${contactLink}" class="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2" data-i18n="nav.contact">${navContact}</a>
                        </nav>
                    </div>
                </div>
            </header>
        `;
    }
}

// Function to create and insert footer
function createFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        const currentPath = window.location.pathname;
        const isFrench = currentPath.includes('/fr/') || currentPath.endsWith('/fr');
        const isEnglish = currentPath.includes('/en/') || currentPath.endsWith('/en');
        
        const receptionLink = isEnglish ? '../en/reception.html' : (isFrench ? '../fr/reception.html' : 'reception.html');
        const emissionLink = isEnglish ? '../en/emission.html' : (isFrench ? '../fr/emission.html' : 'emission.html');
        const supportLink = isEnglish ? '../en/support.html' : (isFrench ? '../fr/support.html' : 'support.html');
        const crmListsLink = isEnglish ? '../en/crm-lists.html' : (isFrench ? '../fr/crm-lists.html' : 'crm-lists.html');
        const aboutLink = isEnglish ? '../en/about.html' : (isFrench ? '../fr/about.html' : 'about.html');
        const blogLink = isEnglish ? '../en/blog.html' : (isFrench ? '../fr/blog.html' : 'blog.html');
        const pricingLink = isEnglish ? '../en/pricing.html' : (isFrench ? '../fr/pricing.html' : 'pricing.html');
        const contactLink = isEnglish ? '../en/contact.html' : (isFrench ? '../fr/contact.html' : 'contact.html');
        const termsLink = isEnglish ? '../en/terms.html' : (isFrench ? '../fr/conditions-generales.html' : 'conditions-generales.html');
        const privacyLink = isEnglish ? '../en/privacy.html' : (isFrench ? '../fr/politique-confidentialite.html' : 'politique-confidentialite.html');
        
        const logoSrc = isEnglish || isFrench ? '../images/logo-white.png' : 'images/logo-white.png';
        
        const servicesTitle = isEnglish ? 'Services' : 'Services';
        const callReception = isEnglish ? 'Call Reception' : 'Réception d\'Appels';
        const callMaking = isEnglish ? 'Outbound Calls' : 'Appels Sortants';
        const customerSupport = isEnglish ? 'Customer Support' : 'Support Client';
        const crmLists = isEnglish ? 'CRM & Lists' : 'CRM & Listes';
        
        const companyTitle = isEnglish ? 'Company' : 'Entreprise';
        const about = isEnglish ? 'About' : 'À Propos';
        const blog = isEnglish ? 'Blog' : 'Blog';
        const pricing = isEnglish ? 'Pricing' : 'Tarifs';
        const contact = isEnglish ? 'Contact' : 'Contact';
        
        const contactTitle = isEnglish ? 'Contact' : 'Contact';
        const address = isEnglish ? '123 Republic Street, Montreal, QC H3A 2B4' : '123 rue de la République, Montréal, QC H3A 2B4';
        
        const description = isEnglish ? 'Telephone communication solutions tailored for entrepreneurs and SMEs.' : 'Solutions de communication téléphonique adaptées pour les entrepreneurs et PME.';
        const copyright = isEnglish ? '© 2023 Smart Hotline Agency. All rights reserved.' : '© 2023 Smart Hotline Agency. Tous droits réservés.';
        const terms = isEnglish ? 'Terms of Service' : 'Conditions Générales';
        const privacy = isEnglish ? 'Privacy Policy' : 'Politique de Confidentialité';
        
        footerContainer.innerHTML = `
            <footer class="bg-dark-900 text-white pt-16 pb-8">
                <div class="container mx-auto px-6">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <div class="flex items-center mb-4">
                                <img src="${logoSrc}" alt="Smart Hotline Agency" class="h-10 mr-3">
                                <span class="text-xl font-bold">Smart Hotline Agency</span>
                            </div>
                            <p class="text-gray-400 mb-4" data-i18n="footer.description">${description}</p>
                            <div class="flex space-x-4">
                                <a href="https://www.facebook.com/smarthotline" class="text-gray-400 hover:text-white transition-colors">
                                    <i class="fab fa-facebook-f text-xl"></i>
                                </a>
                                <a href="https://www.linkedin.com/company/smart-hotline" class="text-gray-400 hover:text-white transition-colors">
                                    <i class="fab fa-linkedin-in text-xl"></i>
                                </a>
                                <a href="https://twitter.com/smarthotline" class="text-gray-400 hover:text-white transition-colors">
                                    <i class="fab fa-twitter text-xl"></i>
                                </a>
                                <a href="https://www.instagram.com/smarthotline" class="text-gray-400 hover:text-white transition-colors">
                                    <i class="fab fa-instagram text-xl"></i>
                                </a>
                            </div>
                        </div>
                        
                        <div>
                            <h3 class="text-lg font-semibold mb-4" data-i18n="footer.services">${servicesTitle}</h3>
                            <ul class="space-y-2">
                                <li><a href="${receptionLink}" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.callReception">${callReception}</a></li>
                                <li><a href="${emissionLink}" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.callMaking">${callMaking}</a></li>
                                <li><a href="${supportLink}" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.customerSupport">${customerSupport}</a></li>
                                <li><a href="${crmListsLink}" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.crmLists">${crmLists}</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-lg font-semibold mb-4" data-i18n="footer.company">${companyTitle}</h3>
                            <ul class="space-y-2">
                                <li><a href="${aboutLink}" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.about">${about}</a></li>
                                <li><a href="${blogLink}" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.blog">${blog}</a></li>
                                <li><a href="${pricingLink}" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.pricing">${pricing}</a></li>
                                <li><a href="${contactLink}" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.contact">${contact}</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-lg font-semibold mb-4" data-i18n="footer.contact">${contactTitle}</h3>
                            <ul class="space-y-2 text-gray-400">
                                <li class="flex items-start">
                                    <i class="fas fa-map-marker-alt mt-1 mr-3 text-primary-500"></i>
                                    <span data-i18n="footer.address">${address}</span>
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-phone mr-3 text-primary-500"></i>
                                    <span>+1-514-819-0559</span>
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-envelope mr-3 text-primary-500"></i>
                                    <span>contact@smart-hotline.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p class="text-gray-400 text-sm mb-4 md:mb-0" data-i18n="footer.copyright">${copyright}</p>
                        <div class="flex space-x-6 text-sm">
                            <a href="${termsLink}" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.terms">${terms}</a>
                            <a href="${privacyLink}" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.privacy">${privacy}</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

// Function to initialize mobile menu toggle
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Function to initialize language selector
function initializeLanguageSelector() {
    const languageToggle = document.getElementById('language-toggle');
    const languageDropdown = document.getElementById('language-dropdown');
    
    if (languageToggle && languageDropdown) {
        languageToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            languageDropdown.classList.add('hidden');
        });
    }
}

// Function to initialize scroll reveal animation
function initializeScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    function checkReveal() {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    // Check on load
    checkReveal();
    
    // Check on scroll
    window.addEventListener('scroll', checkReveal);
}

// Function to initialize stats counter animation
function initializeStatsCounter() {
    const counters = document.querySelectorAll('.stats-counter');
    const speed = 200; // The lower the slower
    
    function startCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => startCounter(counter), 10);
        } else {
            counter.innerText = target;
        }
    }
    
    function checkCounters() {
        counters.forEach(counter => {
            const windowHeight = window.innerHeight;
            const elementTop = counter.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible && counter.innerText === '0') {
                startCounter(counter);
            }
        });
    }
    
    // Check on load
    checkCounters();
    
    // Check on scroll
    window.addEventListener('scroll', checkCounters);
}

// Function to initialize chat button
function initializeChatButton() {
    const chatButton = document.getElementById('chatButton');
    
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            // Here you would typically open a chat widget
            // For now, we'll just show an alert
            alert('Chat feature coming soon! Please contact us at +1-514-819-0559 for immediate assistance.');
        });
    }
}                                      </ul>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-semibold mb-4">Entreprise</h3>
                                        <ul class="space-y-2">
                                            <li><a href="about.html" class="text-gray-400 hover:text-white transition-colors">À Propos</a></li>
                                            <li><a href="blog.html" class="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                                            <li><a href="pricing.html" class="text-gray-400 hover:text-white transition-colors">Tarifs</a></li>
                                            <li><a href="contact.html" class="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-semibold mb-4">Contact</h3>
                                        <ul class="space-y-2 text-gray-400">
                                            <li class="flex items-start">
                                                <i class="fas fa-map-marker-alt mt-1 mr-3 text-primary-500"></i>
                                                <span>123 rue de la République, Montréal, QC H3A 2B4</span>
                                            </li>
                                            <li class="flex items-center">
                                                <i class="fas fa-phone mr-3 text-primary-500"></i>
                                                <span>+1-514-819-0559</span>
                                            </li>
                                            <li class="flex items-center">
                                                <i class="fas fa-envelope mr-3 text-primary-500"></i>
                                                <span>contact@smart-hotline.com</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                                    <p class="text-gray-400 text-sm mb-4 md:mb-0">© 2023 Smart Hotline Agency. Tous droits réservés.</p>
                                    <div class="flex space-x-6 text-sm">
                                        <a href="conditions-generales.html" class="text-gray-400 hover:text-white transition-colors">Conditions Générales</a>
                                        <a href="politique-confidentialite.html" class="text-gray-400 hover:text-white transition-colors">Politique de Confidentialité</a>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    `;
                }
            });
    }
}

// Function to initialize mobile menu toggle
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Function to initialize language selector
function initializeLanguageSelector() {
    const languageToggle = document.getElementById('language-toggle');
    const languageDropdown = document.getElementById('language-dropdown');
    
    if (languageToggle && languageDropdown) {
        languageToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            languageDropdown.classList.add('hidden');
        });
    }
}

// Function to initialize scroll reveal animation
function initializeScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    function checkReveal() {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    // Check on load
    checkReveal();
    
    // Check on scroll
    window.addEventListener('scroll', checkReveal);
}

// Function to initialize stats counter animation
function initializeStatsCounter() {
    const counters = document.querySelectorAll('.stats-counter');
    const speed = 200; // The lower the slower
    
    function startCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => startCounter(counter), 10);
        } else {
            counter.innerText = target;
        }
    }
    
    function checkCounters() {
        counters.forEach(counter => {
            const windowHeight = window.innerHeight;
            const elementTop = counter.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible && counter.innerText === '0') {
                startCounter(counter);
            }
        });
    }
    
    // Check on load
    checkCounters();
    
    // Check on scroll
    window.addEventListener('scroll', checkCounters);
}

// Function to initialize chat button
function initializeChatButton() {
    const chatButton = document.getElementById('chatButton');
    
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            // Here you would typically open a chat widget
            // For now, we'll just show an alert
            alert('Chat feature coming soon! Please contact us at +1-514-819-0559 for immediate assistance.');
        });
    }
}
