// assets/partials.js
// JavaScript for loading partials

document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer
    loadPartial('header-container', '../partials/header.html');
    loadPartial('footer-container', '../partials/footer.html');
    
    // Initialize functionality after partials are loaded
    setTimeout(initializeFunctionality, 500);
});

function loadPartial(elementId, filePath) {
    const element = document.getElementById(elementId);
    if (element) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                element.innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading partial:', error);
                // Fallback content in case of error
                if (elementId === 'header-container') {
                    element.innerHTML = `
                        <header class="bg-white shadow-sm sticky top-0 z-50">
                            <div class="container mx-auto px-6 py-4">
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center">
                                        <a href="index.html" class="flex items-center">
                                            <img src="../images/logo.png" alt="Smart Hotline Agency" class="h-10 mr-3">
                                            <span class="text-xl font-bold text-primary-600">Smart Hotline Agency</span>
                                        </a>
                                    </div>
                                    <nav class="hidden md:flex space-x-8">
                                        <a href="index.html" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">Accueil</a>
                                        <a href="services.html" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">Services</a>
                                        <a href="pricing.html" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">Tarifs</a>
                                        <a href="about.html" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">À Propos</a>
                                        <a href="blog.html" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">Blog</a>
                                        <a href="contact.html" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">Contact</a>
                                    </nav>
                                    <div class="flex items-center space-x-4">
                                        <a href="../en/index.html" class="text-gray-700 hover:text-primary-600 transition-colors">
                                            <i class="fas fa-globe mr-2"></i>EN
                                        </a>
                                        <button id="mobile-menu-toggle" class="md:hidden text-gray-700 hover:text-primary-600">
                                            <i class="fas fa-bars text-xl"></i>
                                        </button>
                                    </div>
                                </div>
                                <div id="mobile-menu" class="md:hidden mt-4 pb-4 hidden">
                                    <nav class="flex flex-col space-y-2">
                                        <a href="index.html" class="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2">Accueil</a>
                                        <a href="services.html" class="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2">Services</a>
                                        <a href="pricing.html" class="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2">Tarifs</a>
                                        <a href="about.html" class="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2">À Propos</a>
                                        <a href="blog.html" class="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2">Blog</a>
                                        <a href="contact.html" class="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2">Contact</a>
                                    </nav>
                                </div>
                            </div>
                        </header>
                    `;
                } else if (elementId === 'footer-container') {
                    element.innerHTML = `
                        <footer class="bg-dark-900 text-white pt-16 pb-8">
                            <div class="container mx-auto px-6">
                                <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                                    <div>
                                        <div class="flex items-center mb-4">
                                            <img src="../images/logo-white.png" alt="Smart Hotline Agency" class="h-10 mr-3">
                                            <span class="text-xl font-bold">Smart Hotline Agency</span>
                                        </div>
                                        <p class="text-gray-400 mb-4">Solutions de communication téléphonique adaptées pour les entrepreneurs et PME.</p>
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
                                        <h3 class="text-lg font-semibold mb-4">Services</h3>
                                        <ul class="space-y-2">
                                            <li><a href="reception.html" class="text-gray-400 hover:text-white transition-colors">Réception d'Appels</a></li>
                                            <li><a href="emission.html" class="text-gray-400 hover:text-white transition-colors">Appels Sortants</a></li>
                                            <li><a href="support.html" class="text-gray-400 hover:text-white transition-colors">Support Client</a></li>
                                            <li><a href="crm-lists.html" class="text-gray-400 hover:text-white transition-colors">CRM & Listes</a></li>
                                        </ul>
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

function initializeFunctionality() {
    // Initialize mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Initialize mobile services menu toggle
    const mobileServicesToggle = document.getElementById('mobile-services-toggle');
    const mobileServicesMenu = document.getElementById('mobile-services-menu');
    
    if (mobileServicesToggle && mobileServicesMenu) {
        mobileServicesToggle.addEventListener('click', function() {
            mobileServicesMenu.classList.toggle('hidden');
        });
    }
    
    // Initialize language selector
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
    
    // Initialize scroll reveal animation
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
    
    // Initialize stats counter animation
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
    
    // Initialize chat button
    const chatButton = document.getElementById('chatButton');
    
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            // Here you would typically open a chat widget
            // For now, we'll just show an alert
            alert('Chat feature coming soon! Please contact us at +1-514-819-0559 for immediate assistance.');
        });
    }
}
