document.addEventListener('DOMContentLoaded', function() {
    // Inject header and footer content directly
    injectHeader();
    injectFooter();
    
    // Initialize other functions after header/footer are loaded
    setTimeout(function() {
        initializeMobileMenu();
        initializeChat();
        initializeScrollReveal();
        initializeStatsCounter();
        initializeFormValidation();
        detectLocationAndAdaptContent();
        prefillContactForm();
    }, 100);
});

// Header content as JavaScript string
function injectHeader() {
    const headerContent = `
    <header class="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <nav class="container mx-auto px-6 py-4">
            <div class="flex justify-between items-center">
                <a href="index.html" class="flex items-center">
                    <img src="../images/logo.svg" alt="Smart Hotline Agency" class="h-10 mr-2">
                    <span class="text-xl font-bold text-primary-600">Smart Hotline</span>
                </a>
                
                <div class="hidden md:flex space-x-8">
                    <a href="index.html" class="text-gray-700 hover:text-primary-600 transition-colors" data-i18n="nav.home">Accueil</a>
                    <a href="services.html" class="text-gray-700 hover:text-primary-600 transition-colors" data-i18n="nav.services">Services</a>
                    <a href="pricing.html" class="text-gray-700 hover:text-primary-600 transition-colors" data-i18n="nav.pricing">Tarifs</a>
                    <a href="blog.html" class="text-gray-700 hover:text-primary-600 transition-colors" data-i18n="nav.blog">Blog</a>
                    <a href="about.html" class="text-gray-700 hover:text-primary-600 transition-colors" data-i18n="nav.about">À propos</a>
                    <a href="contact.html" class="text-gray-700 hover:text-primary-600 transition-colors" data-i18n="nav.contact">Contact</a>
                </div>
                
                <div class="flex items-center space-x-4">
                    <a href="../en/index.html" class="text-gray-700 hover:text-primary-600 transition-colors">
                        <i class="fas fa-globe"></i> EN
                    </a>
                    <button id="mobile-menu-toggle" class="md:hidden text-gray-700">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
            
            <!-- Mobile Menu -->
            <div id="mobile-menu" class="hidden md:hidden mt-4 pb-4">
                <a href="index.html" class="block py-2 text-gray-700 hover:text-primary-600 transition-colors" data-i18n="nav.home">Accueil</a>
                <a href="services.html" class="block py-2 text-gray-700 hover:text-primary-600 transition-colors" data-i18n="nav.services">Services</a>
                <a href="pricing.html" class="block py-2 text-gray-700 hover:text-primary-600 transition-colors" data-i18n="nav.pricing">Tarifs</a>
                <a href="blog.html" class="block py-2 text-gray-700 hover:text-primary-600 transition-colors" data-i18n="nav.blog">Blog</a>
                <a href="about.html" class="block py-2 text-gray-700 hover:text-primary-600 transition-colors" data-i18n="nav.about">À propos</a>
                <a href="contact.html" class="block py-2 text-gray-700 hover:text-primary-600 transition-colors" data-i18n="nav.contact">Contact</a>
            </div>
        </nav>
    </header>`;
    
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = headerContent;
    }
}

// Footer content as JavaScript string
function injectFooter() {
    const footerContent = `
    <footer class="bg-dark-900 text-white pt-16 pb-8">
        <div class="container mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div class="flex items-center mb-4">
                        <img src="../images/logo-white.svg" alt="Smart Hotline Agency" class="h-10 mr-2">
                        <span class="text-xl font-bold">Smart Hotline</span>
                    </div>
                    <p class="text-gray-400 mb-4" data-i18n="footer.description">
                        Votre partenaire de confiance pour tous vos besoins en communication téléphonique.
                    </p>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">
                            <i class="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4" data-i18n="footer.servicesTitle">Services</h3>
                    <ul class="space-y-2">
                        <li><a href="reception.html" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.reception">Réception d'appels</a></li>
                        <li><a href="emission.html" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.emission">Émission d'appels</a></li>
                        <li><a href="support.html" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.support">Support client</a></li>
                        <li><a href="crm-lists.html" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.crm">CRM & Listes</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4" data-i18n="footer.companyTitle">Entreprise</h3>
                    <ul class="space-y-2">
                        <li><a href="about.html" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.about">À propos</a></li>
                        <li><a href="blog.html" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.blog">Blog</a></li>
                        <li><a href="pricing.html" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.pricing">Tarifs</a></li>
                        <li><a href="conditions-generales.html" class="text-gray-400 hover:text-white transition-colors" data-i18n="footer.terms">Conditions générales</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4" data-i18n="footer.contactTitle">Contact</h3>
                    <ul class="space-y-2 text-gray-400">
                        <li class="flex items-start">
                            <i class="fas fa-map-marker-alt mt-1 mr-2"></i>
                            <span data-i18n="footer.address">123 Rue de la Communication, Montréal, QC H3A 1A1</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-phone mr-2"></i>
                            <span data-i18n="footer.phone">+1 (514) 123-4567</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-envelope mr-2"></i>
                            <span data-i18n="footer.email">contact@smart-hotline.com</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p data-i18n="footer.copyright">&copy; 2023 Smart Hotline Agency. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
    
    <!-- WhatsApp Button -->
    <a href="https://wa.me/15141234567" target="_blank" class="whatsapp-button">
        <i class="fab fa-whatsapp text-2xl"></i>
    </a>`;
    
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = footerContent;
    }
}

// Initialize mobile menu
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Initialize chat
function initializeChat() {
    const chatButton = document.getElementById('chatButton');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatButton && chatWindow) {
        chatButton.addEventListener('click', function() {
            chatWindow.classList.toggle('active');
        });
    }
    
    if (chatClose && chatWindow) {
        chatClose.addEventListener('click', function() {
            chatWindow.classList.remove('active');
        });
    }
    
    if (chatSend && chatInput && chatMessages) {
        chatSend.addEventListener('click', function() {
            const message = chatInput.value.trim();
            if (message) {
                // Add user message
                const userMessage = document.createElement('div');
                userMessage.className = 'mb-4';
                userMessage.innerHTML = `
                    <div class="flex justify-end">
                        <div class="bg-primary-600 text-white rounded-lg py-2 px-4 max-w-xs">
                            ${message}
                        </div>
                    </div>
                `;
                chatMessages.appendChild(userMessage);
                
                // Clear input
                chatInput.value = '';
                
                // Simulate bot response
                setTimeout(function() {
                    const botMessage = document.createElement('div');
                    botMessage.className = 'mb-4';
                    botMessage.innerHTML = `
                        <div class="flex justify-start">
                            <div class="bg-gray-200 text-gray-800 rounded-lg py-2 px-4 max-w-xs">
                                Merci pour votre message. Un de nos agents vous répondra sous peu.
                            </div>
                        </div>
                    `;
                    chatMessages.appendChild(botMessage);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
        
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                chatSend.click();
            }
        });
    }
}

// Initialize scroll reveal animation
function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    function reveal() {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add('active');
            }
        }
    }
    
    window.addEventListener('scroll', reveal);
    reveal();
}

// Initialize stats counter
function initializeStatsCounter() {
    const counters = document.querySelectorAll('.stats-counter');
    const speed = 200;
    
    const countUp = function() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(countUp, 1);
            } else {
                counter.innerText = target;
            }
        });
    };
    
    // Intersection Observer for Stats Counter
    const statsSection = document.querySelector('.stats-counter');
    if (statsSection) {
        const observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                countUp();
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
}

// Initialize form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous errors
            const errorElements = form.querySelectorAll('.form-error');
            errorElements.forEach(element => element.remove());
            
            let isValid = true;
            
            // Validate required fields
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    
                    const error = document.createElement('div');
                    error.className = 'form-error';
                    error.textContent = 'Ce champ est requis';
                    field.parentNode.appendChild(error);
                }
            });
            
            // Validate email
            const emailFields = form.querySelectorAll('[type="email"]');
            emailFields.forEach(field => {
                if (field.value.trim() && !isValidEmail(field.value.trim())) {
                    isValid = false;
                    
                    const error = document.createElement('div');
                    error.className = 'form-error';
                    error.textContent = 'Veuillez entrer une adresse email valide';
                    field.parentNode.appendChild(error);
                }
            });
            
            // If form is valid, submit it
            if (isValid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.textContent = 'Votre message a été envoyé avec succès. Nous vous contacterons sous peu.';
                form.prepend(successMessage);
                
                // Reset form
                form.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Location Detection and Content Adaptation
function detectLocationAndAdaptContent() {
    // Use browser's geolocation API to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // Get latitude and longitude
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Use a reverse geocoding API to get country and city
            fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`)
                .then(response => response.json())
                .then(data => {
                    const country = data.countryName;
                    const city = data.city;
                    
                    // Adapt content based on location
                    adaptContentForLocation(country, city);
                })
                .catch(error => {
                    console.error('Error getting location:', error);
                    // Fallback to IP-based location detection
                    detectLocationByIP();
                });
        }, function(error) {
            console.error('Error getting location:', error);
            // Fallback to IP-based location detection
            detectLocationByIP();
        });
    } else {
        // Fallback to IP-based location detection
        detectLocationByIP();
    }
}

function detectLocationByIP() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const country = data.country_name;
            const city = data.city;
            
            // Adapt content based on location
            adaptContentForLocation(country, city);
        })
        .catch(error => {
            console.error('Error getting location by IP:', error);
        });
}

function adaptContentForLocation(country, city) {
    // Store location in localStorage for later use
    localStorage.setItem('userCountry', country);
    localStorage.setItem('userCity', city);
    
    // Adapt currency based on country
    let currency = 'CAD'; // Default
    let currencySymbol = '$';
    
    if (country === 'France' || country === 'Belgium' || country === 'Switzerland') {
        currency = 'EUR';
        currencySymbol = '€';
    } else if (country === 'United States') {
        currency = 'USD';
        currencySymbol = '$';
    }
    
    // Update price displays
    const priceElements = document.querySelectorAll('.price-value');
    priceElements.forEach(element => {
        const basePrice = parseFloat(element.getAttribute('data-base-price'));
        
        // Convert price based on currency
        let convertedPrice = basePrice;
        if (currency === 'EUR') {
            convertedPrice = basePrice * 0.68; // Approximate conversion rate
        } else if (currency === 'USD') {
            convertedPrice = basePrice * 0.74; // Approximate conversion rate
        }
        
        // Update display
        element.textContent = `${currencySymbol}${convertedPrice.toFixed(2)}`;
    });
    
    // Update currency indicators
    const currencyIndicators = document.querySelectorAll('.currency-indicator');
    currencyIndicators.forEach(element => {
        element.textContent = currency;
    });
    
    // Adapt contact information based on location
    if (country === 'France' || country === 'Belgium' || country === 'Switzerland') {
        const phoneElements = document.querySelectorAll('.phone-number');
        phoneElements.forEach(element => {
            element.textContent = '+33 1 23 45 67 89';
        });
        
        const addressElements = document.querySelectorAll('.address');
        addressElements.forEach(element => {
            element.textContent = '123 Rue de la Communication, 75001 Paris, France';
        });
    }
    
    // Adapt content based on city if available
    if (city) {
        const cityElements = document.querySelectorAll('.city-specific');
        cityElements.forEach(element => {
            element.textContent = element.textContent.replace('[ville]', city);
        });
    }
}

// Pre-fill contact form based on URL parameters
function prefillContactForm() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    const package = urlParams.get('package');
    
    // If service parameter is present, pre-fill the form
    if (service) {
        const serviceField = document.getElementById('service');
        if (serviceField) {
            serviceField.value = service;
        }
        
        // Update form title based on service
        const formTitle = document.querySelector('.form-title');
        if (formTitle) {
            const serviceNames = {
                'reception': 'Réception d\'Appels',
                'emission': 'Émission d\'Appels',
                'support': 'Support Client',
                'crm': 'CRM & Listes'
            };
            
            if (serviceNames[service]) {
                formTitle.textContent = `Demande d'information - ${serviceNames[service]}`;
            }
        }
    }
    
    // If package parameter is present, pre-fill the form
    if (package) {
        const packageField = document.getElementById('package');
        if (packageField) {
            packageField.value = package;
        }
    }
}
