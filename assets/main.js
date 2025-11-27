// assets/main.js
// Main JavaScript for Smart Hotline Agency

document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer
    loadPartial('header-container', '../fr/partials/header.html');
    loadPartial('footer-container', '../fr/partials/footer.html');
    
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

// Function to load partial HTML files
function loadPartial(elementId, filePath) {
    const element = document.getElementById(elementId);
    if (element) {
        fetch(filePath)
            .then(response => response.text())
            .then(html => {
                element.innerHTML = html;
                
                // Re-initialize language selector after loading header
                if (elementId === 'header-container') {
                    initializeLanguageSelector();
                    initializeMobileMenu();
                }
            })
            .catch(error => console.error('Error loading partial:', error));
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
