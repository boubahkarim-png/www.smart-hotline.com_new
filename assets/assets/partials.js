// assets/assets/partials.js - loads partials and provides safe fallbacks

document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer using root-absolute paths so they resolve on /, /fr/, /en/
    loadPartial('header-container', '/partials/header.html');
    loadPartial('footer-container', '/partials/footer.html');

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
                                        <a href="/" class="flex items-center">
                                            <img src="/images/logo.png" alt="Smart Hotline Agency" class="h-10 mr-3">
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
                                        <a href="/en/" class="text-gray-700 hover:text-primary-600 transition-colors">
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
                                            <img src="/images/logo-white.png" alt="Smart Hotline Agency" class="h-10 mr-3">
                                            <span class="text-xl font-bold">Smart Hotline Agency</span>
                                        </div>
                                        <p class="text-sm text-gray-300">Services de communication téléphonique adaptés aux entrepreneurs et PME.</p>
                                    </div>
                                    <div>
                                        <h4 class="text-white font-semibold mb-3">Services</h4>
                                        <ul class="text-gray-300 text-sm space-y-2">
                                            <li><a href="services.html">Services</a></li>
                                            <li><a href="reception.html">Réception d'appels</a></li>
                                            <li><a href="emission.html">Prospection</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="text-gray-400 text-sm">© 2026 Smart Hotline Agency. Tous droits réservés.</div>
                            </div>
                        </footer>
                    `;
                }
            });
    }
}

function initializeFunctionality() {
    // minimal safe init for fallback
    const toggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (toggle && mobileMenu) {
        toggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}
