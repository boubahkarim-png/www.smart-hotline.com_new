/**
 * Main JavaScript functionality for Smart Hotline Agency
 */

// DOM Elements
const langToggle = document.getElementById('langToggle');
const langDropdown = document.getElementById('langDropdown');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const chatButton = document.getElementById('chatButton');
const statsCounters = document.querySelectorAll('.stats-counter');
const currentLang = document.body.getAttribute('data-lang') || 'fr';

/**
 * Sets the 'active' class on navigation links based on the current page path.
 */
function setActiveNavigation() {
    // Determine the current page filename (e.g., 'index.html', 'services.html')
    const pathSegments = window.location.pathname.split('/');
    const currentPage = pathSegments.pop() || 'index.html'; // Gets filename or 'index.html' for trailing /

    // Get the page name without extension for comparison (e.g., 'index')
    const pageName = currentPage.split('.')[0];
    
    // Define a map of page names to their corresponding nav link IDs
    const navMap = {
        'index': 'nav-home',
        'pricing': 'nav-pricing',
        'faq': 'nav-faq',
        'blog': 'nav-blog',
        'contact': 'nav-contact',
        'services': 'nav-services',
        'reception': 'nav-services', // Sub-page falls under the main service link
        'emission': 'nav-services',
        'support': 'nav-services'
    };
    
    const activeId = navMap[pageName] || (pageName === 'index' ? 'nav-home' : null);

    // Remove active class from all nav links
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Set active class on the determined ID
    if (activeId) {
        // Desktop nav link/button
        document.getElementById(activeId)?.classList.add('active');
        
        // Mobile nav link (requires a separate selector as the nav structure is different)
        document.querySelector(`.mobile-nav-link[data-nav-link="${pageName}"]`)?.classList.add('active');
        
        // Ensure the main 'Services' link is active for sub-pages in mobile view
        if (['reception', 'emission', 'support'].includes(pageName)) {
            document.querySelector(`.mobile-nav-link[data-nav-link="services"]`)?.classList.add('active');
        }
    }
}

/**
 * Initializes the counter animation when the stats section is in view.
 */
function initCounters() {
    if (!statsCounters.length) return;
    
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

/**
 * Initializes the scroll reveal animation for elements with class .scroll-reveal.
 */
function initScrollReveal() {
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    if (!scrollRevealElements.length) return;
    
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

/**
 * Sets up all general event listeners (menu toggles, chat button).
 */
function setupEventListeners() {
    // Language selector dropdown toggle
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            langDropdown.classList.toggle('hidden');
        });
    }
    
    // Close language dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (langToggle && !langToggle.contains(e.target) && langDropdown && !langDropdown.contains(e.target)) {
            langDropdown.classList.add('hidden');
        }
    });
    
    // Language options
    // Note: The actual redirection is handled by the anchor's href attribute in header.html
    
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
    
    // Chat functionality (WhatsApp/Email)
    if (chatButton) {
        chatButton.addEventListener('click', () => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            const whatsappMessageFR = "Bonjour, je souhaite en savoir plus sur vos services. Pouvez-vous m'aider?";
            const whatsappMessageEN = "Hello, I would like to know more about your services. Can you help me?";
            const emailSubjectFR = "Demande d'information - Smart Hotline";
            const emailSubjectEN = "Information Request - Smart Hotline";
            const emailBodyFR = "Bonjour, je souhaite en savoir plus sur vos services. Pouvez-vous m'aider?";
            const emailBodyEN = "Hello, I would like to know more about your services. Can you help me?";

            const message = currentLang === 'fr' ? whatsappMessageFR : whatsappMessageEN;
            const subject = currentLang === 'fr' ? emailSubjectFR : emailSubjectEN;
            const body = currentLang === 'fr' ? emailBodyFR : emailBodyEN;
            
            if (isMobile) {
                window.open(`https://wa.me/15148190559?text=${encodeURIComponent(message)}`, '_blank');
            } else {
                window.location.href = `mailto:direction@smart-hotline.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }
        });
    }
}


// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialise animations and interactive components
    setActiveNavigation();
    initCounters();
    initScrollReveal();
    setupEventListeners();
});
