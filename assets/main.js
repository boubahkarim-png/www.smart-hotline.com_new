// DOM Elements
let langToggle, langDropdown, currentLangSpan, langOptions;
let mobileMenuToggle, mobileMenu;
let chatButton;
let statsCounters;
let scrollRevealElements;

// Current language
let currentLang = 'fr';

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Detect current language from URL
    detectLanguage();
    
    // Load header and footer
    loadComponents();
    
    // Initialize functionality
    initializeElements();
    initializeCounters();
    initializeScrollReveal();
    setupEventListeners();
});

// Detect current language from URL
function detectLanguage() {
    const path = window.location.pathname;
    if (path.includes('/en/')) {
        currentLang = 'en';
    } else if (path.includes('/fr/')) {
        currentLang = 'fr';
    } else {
        // Default to French
        currentLang = 'fr';
    }
    
    // Set language on body for CSS targeting
    document.body.setAttribute('data-lang', currentLang);
}

// Load header and footer components
function loadComponents() {
    // Load header
    fetch('../partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            
            // After loading header, initialize its elements
            initializeElements();
            setupHeaderEventListeners();
            setActiveNavigation();
            
            // Apply language to newly loaded content
            applyLanguageToContent();
        })
        .catch(error => console.error('Error loading header:', error));
    
    // Load footer
    fetch('../partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
            
            // After loading footer, initialize its elements
            setupFooterEventListeners();
            
            // Apply language to newly loaded content
            applyLanguageToContent();
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Initialize DOM elements
function initializeElements() {
    langToggle = document.getElementById('langToggle');
    langDropdown = document.getElementById('langDropdown');
    currentLangSpan = document.getElementById('currentLang');
    langOptions = document.querySelectorAll('.lang-option');
    mobileMenuToggle = document.getElementById('mobileMenuToggle');
    mobileMenu = document.getElementById('mobileMenu');
    chatButton = document.getElementById('chatButton');
    statsCounters = document.querySelectorAll('.stats-counter');
    scrollRevealElements = document.querySelectorAll('.scroll-reveal');
}

// Apply language to content
function applyLanguageToContent() {
    // Update language selector
    if (currentLangSpan) {
        currentLangSpan.textContent = currentLang.toUpperCase();
    }
    
    // Hide all language-specific content
    document.querySelectorAll('[data-lang]').forEach(element => {
        element.style.display = 'none';
    });
    
    // Show content for current language
    document.querySelectorAll(`[data-lang="${currentLang}"]`).forEach(element => {
        // Determine the appropriate display value based on the element
        const tagName = element.tagName.toLowerCase();
        let displayValue = 'inline';
        
        // Block elements
        if (['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'li', 'section', 'article', 'header', 'footer'].includes(tagName)) {
            displayValue = 'block';
        }
        
        // Flex elements
        if (element.classList.contains('mobile-nav-group') || 
            element.classList.contains('footer-grid') ||
            element.classList.contains('social-links')) {
            displayValue = 'flex';
        }
        
        element.style.display = displayValue;
    });
    
    // Apply translations using localization.js
    if (typeof applyTranslations === 'function') {
        applyTranslations();
    }
}

// Set active navigation based on current page
function setActiveNavigation() {
    if (!document.getElementById('nav-home')) return; // Header not loaded yet
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Set active class based on current page
    let activeId = '';
    switch(currentPage) {
        case 'index.html':
            activeId = 'nav-home';
            break;
        case 'services.html':
            activeId = 'nav-services';
            break;
        case 'price.html':
            activeId = 'nav-price';
            break;
        case 'blog.html':
            activeId = 'nav-blog';
            break;
        case 'contact.html':
            activeId = 'nav-contact';
            break;
        case 'reception.html':
        case 'emission.html':
        case 'support.html':
        case 'crm-lists.html':
            activeId = 'nav-services';
            break;
    }
    
    // Set active class
    if (activeId) {
        document.getElementById(activeId)?.classList.add('active');
        document.getElementById(`mobile-${activeId}`)?.classList.add('active');
    }
}

// Initialize counters animation
function initializeCounters() {
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
                const duration = 2000;
                const increment = target / (duration / 16);
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

// Initialize scroll reveal animation
function initializeScrollReveal() {
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

// Set up event listeners for header
function setupHeaderEventListeners() {
    // Language selector
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            langDropdown.classList.toggle('hidden');
        });
    }
    
    // Close language dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (langToggle && !langToggle.contains(e.target) && 
            langDropdown && !langDropdown.contains(e.target)) {
            langDropdown.classList.add('hidden');
        }
    });
    
    // Language options
    if (langOptions) {
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                
                // Get current path
                const currentPath = window.location.pathname;
                
                // Determine new path based on language
                if (lang === 'en' && !currentPath.includes('/en/')) {
                    // Switch to English
                    if (currentPath.endsWith('/')) {
                        window.location.href = currentPath + 'en/index.html';
                    } else {
                        const pathParts = currentPath.split('/');
                        const filename = pathParts[pathParts.length - 1];
                        window.location.href = currentPath.replace(filename, 'en/' + filename);
                    }
                } else if (lang === 'fr' && currentPath.includes('/en/')) {
                    // Switch to French
                    window.location.href = currentPath.replace('/en/', '/fr/');
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
            mobileMenu.classList.toggle('hidden');
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
}

// Set up event listeners for footer
function setupFooterEventListeners() {
    // Chat functionality
    if (chatButton) {
        chatButton.addEventListener('click', () => {
            // Detect if mobile or desktop
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                // Open WhatsApp with language-specific message
                const message = currentLang === 'fr' 
                    ? 'Bonjour,%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services.%20Pouvez-vous%20m\'aider%3F'
                    : 'Hello,%20I%20would%20like%20to%20know%20more%20about%20your%20services.%20Can%20you%20help%20me%3F';
                    
                window.open(`https://wa.me/15148190559?text=${message}`, '_blank');
            } else {
                // Open email client with language-specific subject
                const subject = currentLang === 'fr' 
                    ? 'Demande%20d\'information%20-%20Smart%20Hotline'
                    : 'Information%20Request%20-%20Smart%20Hotline';
                    
                const body = currentLang === 'fr' 
                    ? 'Bonjour,%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services.%20Pouvez-vous%20m\'aider%3F'
                    : 'Hello,%20I%20would%20like%20to%20know%20more%20about%20your%20services.%20Can%20you%20help%20me%3F';
                    
                window.location.href = `mailto:direction@smart-hotline.com?subject=${subject}&body=${body}`;
            }
        });
    }
}

// Set up all event listeners
function setupEventListeners() {
    // This will be called after components are loaded
    // Individual component event listeners are set in their respective functions
}
