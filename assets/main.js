// =============================================================================
// Main.js - Handles all interactive elements for Smart Hotline Agency
// =============================================================================

// --- DOM Elements (will be initialized after includes are loaded) ---
let langToggle, langDropdown, mobileMenuToggle, mobileMenu, chatButton;

// --- State ---
let currentLang = 'fr'; // Default language

// --- Core Functions ---

/**
 * Fetches and injects the header and footer HTML into the page.
 * This is the main function that sets up the page structure.
 */
function loadIncludes() {
    // Determine the correct relative path to 'includes' and 'assets'
    // This allows the same script to work from /fr/, /en/, or root
    const pathDepth = window.location.pathname.split('/').length - 3;
    let basePath = '';
    for (let i = 0; i < pathDepth; i++) {
        basePath += '../';
    }

    // Load Header
    fetch(`${basePath}includes/header.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            let processedHtml = html;
            // If we are on the root page (pathDepth is 0), correct links that assume a subdirectory
            if (pathDepth === 0) {
                processedHtml = processedHtml.replace(/href="\.\.\//g, 'href="');
                processedHtml = processedHtml.replace(/src="\.\.\//g, 'src="');
            }
            document.getElementById('header-placeholder').innerHTML = processedHtml;
            // After header is in the DOM, initialize its specific scripts
            initializeHeaderScripts(basePath);
        })
        .catch(error => console.error('Error loading header:', error));

    // Load Footer
    fetch(`${basePath}includes/footer.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            let processedHtml = html;
            // If we are on the root page (pathDepth is 0), correct links that assume a subdirectory
            if (pathDepth === 0) {
                processedHtml = processedHtml.replace(/href="\.\.\//g, 'href="');
                processedHtml = processedHtml.replace(/src="\.\.\//g, 'src="');
            }
            document.getElementById('footer-placeholder').innerHTML = processedHtml;
            // After footer is in the DOM, initialize its specific scripts
            initializeFooterScripts();
        })
        .catch(error => console.error('Error loading footer:', error));
}

/**
 * Initializes event listeners and logic for the header after it's loaded.
 * @param {string} basePath - The relative path to the root directory.
 */
function initializeHeaderScripts(basePath) {
    langToggle = document.getElementById('langToggle');
    langDropdown = document.getElementById('langDropdown');
    mobileMenuToggle = document.getElementById('mobileMenuToggle');
    mobileMenu = document.getElementById('mobileMenu');

    // Set current language in the dropdown
    currentLang = document.documentElement.lang;
    const currentLangSpan = document.getElementById('currentLang');
    if (currentLangSpan) {
        currentLangSpan.textContent = currentLang.toUpperCase();
    }

    // Language Selector Toggle
    if (langToggle) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('hidden');
        });
    }

    // Mobile Menu Toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Close dropdowns/menus when clicking outside
    document.addEventListener('click', (e) => {
        if (langToggle && !langToggle.contains(e.target)) {
            langDropdown.classList.add('hidden');
        }
    });
}

/**
 * Initializes event listeners and logic for the footer after it's loaded.
 */
function initializeFooterScripts() {
    chatButton = document.getElementById('chatButton');

    // Chat Button Functionality
    if (chatButton) {
        chatButton.addEventListener('click', () => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const message = encodeURIComponent("Bonjour, je souhaite en savoir plus sur vos services. Pouvez-vous m'aider ?");
            
            if (isMobile) {
                window.open(`https://wa.me/15148190559?text=${message}`, '_blank');
            } else {
                window.location.href = `mailto:direction@smart-hotline.com?subject=Demande d'information - Smart Hotline&body=${message}`;
            }
        });
    }
}

// --- Page-specific Animations ---

/**
 * Initializes the animated statistics counters.
 */
function initCounters() {
    const counters = document.querySelectorAll('.stats-counter');
    if (!counters.length) return;

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

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Initializes the scroll-reveal animations.
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    if (!reveals.length) return;

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

    reveals.forEach(element => observer.observe(element));
}

// --- Main Execution ---

// Wait for the DOM to be fully loaded before running the main script
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load the header and footer
    loadIncludes();

    // 2. Initialize animations that don't depend on the includes
    initCounters();
    initScrollReveal();
});
