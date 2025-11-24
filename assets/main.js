// Function to load HTML components
function loadIncludes() {
    // Load header
    fetch('../includes/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            
            // After header is loaded, adjust links based on current language
            const currentLang = detectLanguageFromURL();
            adjustHeaderLinks(currentLang);
            
            // Update language
            updateLanguage(currentLang);
            
            // Initialize header functionality
            initializeHeader();
        })
        .catch(error => console.error('Error loading header:', error));
    
    // Load footer
    fetch('../includes/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            
            // Update language
            const currentLang = detectLanguageFromURL();
            updateLanguage(currentLang);
            
            // Initialize footer functionality
            initializeFooter();
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Function to initialize header functionality
function initializeHeader() {
    // Language selector
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');
    
    if (langToggle && langDropdown) {
        langToggle.addEventListener('click', () => {
            langDropdown.classList.toggle('hidden');
        });
        
        // Close language dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.add('hidden');
            }
        });
    }
    
    // Language options
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = option.getAttribute('data-lang');
            
            if (lang === 'en') {
                window.location.href = 'en/index.html';
            } else if (lang === 'fr') {
                window.location.href = '../index.html';
            }
            
            if (langDropdown) {
                langDropdown.classList.add('hidden');
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// Function to initialize footer functionality
function initializeFooter() {
    // Chat functionality
    const chatButton = document.getElementById('chatButton');
    
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

// Function to initialize counters
function initCounters() {
    const statsCounters = document.querySelectorAll('.stats-counter');
    
    if (statsCounters.length === 0) return;
    
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

// Function to initialize scroll reveal
function initScrollReveal() {
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    if (scrollRevealElements.length === 0) return;
    
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

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load header and footer
    loadIncludes();
    
    // Initialize counters
    initCounters();
    
    // Initialize scroll reveal
    initScrollReveal();
});
