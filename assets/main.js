// DOM Elements
let langToggle, langDropdown, currentLangSpan, langOptions, mobileMenuToggle, mobileMenu, chatButton, statsCounters;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Load components
    loadComponents();
});

// Load header and footer
function loadComponents() {
    // Load header
    fetch('../includes/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            
            // Set up event listeners for header after it's loaded
            setupHeaderEventListeners();
            
            // Set active navigation
            setActiveNavigation();
        })
        .catch(error => console.error('Error loading header:', error));
    
    // Load footer
    fetch('../includes/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Set up event listeners for header
function setupHeaderEventListeners() {
    langToggle = document.getElementById('langToggle');
    langDropdown = document.getElementById('langDropdown');
    currentLangSpan = document.getElementById('currentLang');
    langOptions = document.querySelectorAll('.lang-option');
    mobileMenuToggle = document.getElementById('mobileMenuToggle');
    mobileMenu = document.getElementById('mobileMenu');
    
    // Language selector
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
    if (langOptions) {
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                if (lang === 'en') {
                    window.location.href = '../en/';
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
    
    // Set up chat button
    setupChatButton();
    
    // Initialize animations
    initCounters();
    initScrollReveal();
}

// Set active navigation based on current page
function setActiveNavigation() {
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
        case 'pricing.html':
            activeId = 'nav-pricing';
            break;
        case 'faq.html':
            activeId = 'nav-faq';
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
            activeId = 'nav-services';
            break;
    }
    
    // Set active class
    if (activeId) {
        document.getElementById(activeId)?.classList.add('active');
        document.getElementById(`mobile-${activeId}`)?.classList.add('active');
    }
}

// Initialize counters
function initCounters() {
    statsCounters = document.querySelectorAll('.stats-counter');
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

// Initialize scroll reveal
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

// Set up event listeners for chat button
function setupChatButton() {
    chatButton = document.getElementById('chatButton');
    
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
