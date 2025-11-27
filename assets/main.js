document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Chat Window
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
    
    // Scroll Reveal Animation
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
    
    // Stats Counter Animation
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
    const statsSection = document.querySelector('.stats-counter').parentElement.parentElement.parentElement;
    
    if (statsSection) {
        const observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                countUp();
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // Form Validation
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
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Location Detection and Content Adaptation
    detectLocationAndAdaptContent();
    
    // Pre-fill contact form based on URL parameters
    prefillContactForm();
});

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
