// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollReveal();
    initStatsCounter();
    initChatButton();
    initWhatsAppButton();
    initLocationDetection();
    initFormHandling();
    loadHeader();
    loadFooter();
});

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Change navbar style on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Scroll Reveal Animation
function initScrollReveal() {
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

// Stats Counter Animation
function initStatsCounter() {
    const counters = document.querySelectorAll('.stats-counter');
    const speed = 200;
    
    function startCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;
        
        function updateCount() {
            const count = +counter.innerText;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        }
        
        updateCount();
    }
    
    // Use Intersection Observer to start counter when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Chat Button
function initChatButton() {
    const chatButton = document.getElementById('chatButton');
    
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            // Open chat widget or redirect to chat page
            window.open('https://smart-hotline.com/fr/chat', '_blank');
        });
    }
}

// WhatsApp Button
function initWhatsAppButton() {
    const whatsappButton = document.getElementById('whatsappButton');
    
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function() {
            // Open WhatsApp with pre-filled message
            const phoneNumber = '+1234567890'; // Replace with actual WhatsApp number
            const message = encodeURIComponent('Bonjour, je souhaite en savoir plus sur vos services.');
            window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        });
    }
}

// Location Detection
function initLocationDetection() {
    // Detect user location and adapt content
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            const currency = data.currency;
            
            // Update prices based on location
            updatePrices(country, currency);
            
            // Update phone numbers based on location
            updatePhoneNumbers(country);
            
            // Store location data for form submission
            localStorage.setItem('userLocation', JSON.stringify({
                country: country,
                currency: currency,
                city: data.city,
                region: data.region
            }));
        })
        .catch(error => {
            console.error('Error detecting location:', error);
            // Default to Canada if detection fails
            updatePrices('CA', 'CAD');
        });
}

// Update prices based on location
function updatePrices(country, currency) {
    const priceElements = document.querySelectorAll('[data-price]');
    
    priceElements.forEach(element => {
        const basePrice = parseFloat(element.getAttribute('data-price'));
        let convertedPrice = basePrice;
        let currencySymbol = '$';
        
        // Convert price based on currency
        if (currency === 'EUR') {
            convertedPrice = basePrice * 0.68; // Approximate conversion rate
            currencySymbol = '€';
        } else if (currency === 'GBP') {
            convertedPrice = basePrice * 0.58; // Approximate conversion rate
            currencySymbol = '£';
        }
        
        // Update price display
        element.textContent = `${currencySymbol}${convertedPrice.toFixed(2)}`;
    });
}

// Update phone numbers based on location
function updatePhoneNumbers(country) {
    const phoneElements = document.querySelectorAll('[data-phone]');
    
    phoneElements.forEach(element => {
        let phoneNumber = '+1 (555) 123-4567'; // Default Canadian number
        
        if (country === 'US') {
            phoneNumber = '+1 (555) 987-6543'; // US number
        } else if (country === 'FR') {
            phoneNumber = '+33 1 23 45 67 89'; // French number
        } else if (country === 'GB') {
            phoneNumber = '+44 20 7946 0958'; // UK number
        }
        
        element.textContent = phoneNumber;
        element.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
    });
}

// Form Handling
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const formDataObj = {};
            
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Add location data if available
            const locationData = localStorage.getItem('userLocation');
            if (locationData) {
                formDataObj.location = JSON.parse(locationData);
            }
            
            // Submit form to Netlify
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formDataObj).toString()
            })
            .then(response => {
                if (response.ok) {
                    // Show success message
                    showFormMessage(form, 'Merci! Votre message a été envoyé avec succès.', 'success');
                    form.reset();
                } else {
                    // Show error message
                    showFormMessage(form, 'Une erreur est survenue. Veuillez réessayer.', 'error');
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                showFormMessage(form, 'Une erreur est survenue. Veuillez réessayer.', 'error');
            });
        });
    });
    
    // Pre-fill form based on URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('service')) {
        const serviceField = document.querySelector('#service');
        if (serviceField) {
            serviceField.value = urlParams.get('service');
        }
    }
    
    if (urlParams.has('package')) {
        const packageField = document.querySelector('#package');
        if (packageField) {
            packageField.value = urlParams.get('package');
        }
    }
}

// Show form message
function showFormMessage(form, message, type) {
    // Remove any existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Add message styling
    messageElement.style.padding = '10px';
    messageElement.style.marginTop = '10px';
    messageElement.style.borderRadius = '4px';
    
    if (type === 'success') {
        messageElement.style.backgroundColor = '#d4edda';
        messageElement.style.color = '#155724';
    } else {
        messageElement.style.backgroundColor = '#f8d7da';
        messageElement.style.color = '#721c24';
    }
    
    // Add message to form
    form.appendChild(messageElement);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Load Header
function loadHeader() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        fetch('components/header.html')
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html;
                // Re-initialize navigation after loading header
                initNavigation();
            })
            .catch(error => {
                console.error('Error loading header:', error);
                // Fallback header if component fails to load
                headerContainer.innerHTML = `
                    <header class="navbar">
                        <div class="container">
                            <div class="nav-container">
                                <a href="index.html" class="nav-logo">Smart Hotline</a>
                                <ul class="nav-menu">
                                    <li class="nav-item"><a href="index.html" class="nav-link">Accueil</a></li>
                                    <li class="nav-item"><a href="services.html" class="nav-link">Services</a></li>
                                    <li class="nav-item"><a href="pricing.html" class="nav-link">Tarifs</a></li>
                                    <li class="nav-item"><a href="about.html" class="nav-link">À propos</a></li>
                                    <li class="nav-item"><a href="blog.html" class="nav-link">Blog</a></li>
                                    <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>
                                </ul>
                                <div class="nav-toggle">
                                    <i class="fas fa-bars"></i>
                                </div>
                            </div>
                        </div>
                    </header>
                `;
                initNavigation();
            });
    }
}

// Load Footer
function loadFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        fetch('components/footer.html')
            .then(response => response.text())
            .then(html => {
                footerContainer.innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                // Fallback footer if component fails to load
                footerContainer.innerHTML = `
                    <footer class="footer">
                        <div class="container">
                            <div class="footer-content">
                                <div class="footer-column">
                                    <h3 class="footer-title">Smart Hotline</h3>
                                    <p>Votre partenaire de confiance pour l'externalisation de la communication téléphonique.</p>
                                </div>
                                <div class="footer-column">
                                    <h3 class="footer-title">Services</h3>
                                    <ul class="footer-links">
                                        <li><a href="reception.html" class="footer-link">Réception d'appels</a></li>
                                        <li><a href="emission.html" class="footer-link">Émission d'appels</a></li>
                                        <li><a href="support.html" class="footer-link">Support client</a></li>
                                        <li><a href="crm-lists.html" class="footer-link">CRM & Listes</a></li>
                                    </ul>
                                </div>
                                <div class="footer-column">
                                    <h3 class="footer-title">Entreprise</h3>
                                    <ul class="footer-links">
                                        <li><a href="about.html" class="footer-link">À propos</a></li>
                                        <li><a href="blog.html" class="footer-link">Blog</a></li>
                                        <li><a href="conditions-generales.html" class="footer-link">Conditions générales</a></li>
                                        <li><a href="contact.html" class="footer-link">Contact</a></li>
                                    </ul>
                                </div>
                                <div class="footer-column">
                                    <h3 class="footer-title">Contact</h3>
                                    <p><i class="fas fa-phone"></i> <span data-phone>+1 (555) 123-4567</span></p>
                                    <p><i class="fas fa-envelope"></i> contact@smart-hotline.com</p>
                                    <p><i class="fas fa-map-marker-alt"></i> 123 rue du Commerce, Montréal, QC</p>
                                </div>
                            </div>
                            <div class="footer-bottom">
                                <p>&copy; 2023 Smart Hotline Agency. Tous droits réservés.</p>
                            </div>
                        </div>
                    </footer>
                `;
            });
    }
}
