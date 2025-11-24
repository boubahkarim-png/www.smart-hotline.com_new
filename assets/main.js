// DOM Elements
let langToggle, langDropdown, currentLangSpan, langOptions, mobileMenuToggle, mobileMenu, chatButton, statsCounters, scrollRevealElements;

// State
let currentLang = 'fr';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements after DOM is loaded
    langToggle = document.getElementById('langToggle');
    langDropdown = document.getElementById('langDropdown');
    currentLangSpan = document.getElementById('currentLang');
    langOptions = document.querySelectorAll('.lang-option');
    mobileMenuToggle = document.getElementById('mobileMenuToggle');
    mobileMenu = document.getElementById('mobileMenu');
    chatButton = document.getElementById('chatButton');
    statsCounters = document.querySelectorAll('.stats-counter');
    scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    // Detect user's language based on geolocation
    detectUserLanguage();
    
    // Initialize counters
    initCounters();
    
    // Initialize scroll reveal
    initScrollReveal();
    
    // Set up event listeners
    setupEventListeners();
});

// Function to load header and footer
function loadIncludes() {
    // Load header
    fetch('../includes/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Re-initialize event listeners after header is loaded
            setupEventListeners();
        })
        .catch(error => console.error('Error loading header:', error));
    
    // Load footer
    fetch('../includes/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            // Re-initialize event listeners after footer is loaded
            setupEventListeners();
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Detect user language based on geolocation
function detectUserLanguage() {
    // Check browser language first
    const browserLang = navigator.language || navigator.userLanguage;
    
    // Check if it's a French-speaking region
    const frenchRegions = ['fr', 'fr-FR', 'fr-CA', 'fr-BE', 'fr-CH'];
    
    if (frenchRegions.includes(browserLang)) {
        setLanguage('fr');
    } else {
        // Try to get geolocation (this requires user permission)
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    // In a real implementation, you would send coordinates to a geocoding service
                    // For this demo, we'll just use browser language detection
                },
                error => {
                    // If geolocation is denied, fall back to browser language
                    console.log('Geolocation denied:', error);
                }
            );
        }
    }
}

// Set language
function setLanguage(lang) {
    currentLang = lang;
    if (currentLangSpan) {
        currentLangSpan.textContent = lang.toUpperCase();
    }
}

// Initialize counters
function initCounters() {
    if (!statsCounters || statsCounters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    statsCounters.forEach(counter => {
        observer.observe(counter);
    });
}

// Initialize scroll reveal
function initScrollReveal() {
    if (!scrollRevealElements || scrollRevealElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    scrollRevealElements.forEach(element => {
        observer.observe(element);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Re-initialize elements
    langToggle = document.getElementById('langToggle');
    langDropdown = document.getElementById('langDropdown');
    currentLangSpan = document.getElementById('currentLang');
    langOptions = document.querySelectorAll('.lang-option');
    mobileMenuToggle = document.getElementById('mobileMenuToggle');
    mobileMenu = document.getElementById('mobileMenu');
    chatButton = document.getElementById('chatButton');
    
    // Language selector
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            if (langDropdown) {
                langDropdown.classList.toggle('hidden');
            }
        });
    }
    
    // Close language dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (langToggle && !langToggle.contains(e.target) && langDropdown && !langDropdown.contains(e.target)) {
            langDropdown.classList.add('hidden');
        }
    });
    
    // Language options
    if (langOptions) {
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                if (lang === 'en') {
                    window.location.href = '../en/index.html';
                }
                if (langDropdown) {
                    langDropdown.classList.add('hidden');
                }
            });
        });
    }
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
            }
        });
    }
    
    // Close mobile menu when clicking a link
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
    
    // Chat functionality
    if (chatButton) {
        chatButton.addEventListener('click', () => {
            // Detect if mobile or desktop
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                // Open WhatsApp on mobile
                window.open('https://wa.me/15148190559?text=Bonjour,%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services.%20Pouvez-vous%20m\'aider%3F', '_blank');
            } else {
                // Open email client on desktop
                window.location.href = 'mailto:direction@smart-hotline.com?subject=Demande%20d\'information%20-%20Smart%20Hotline&body=Bonjour,%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services.%20Pouvez-vous%20m\'aider%3F';
            }
        });
    }
}
