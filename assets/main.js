// Main JavaScript for Smart Hotline Agency
document.addEventListener('DOMContentLoaded', function() {
    // Load includes first, then initialize everything
    Promise.all([
        fetch('../includes/header.html').then(response => response.text()),
        fetch('../includes/footer.html').then(response => response.text())
    ]).then(([headerHtml, footerHtml]) => {
        // Insert header and footer
        document.getElementById('header-container').innerHTML = headerHtml;
        document.getElementById('footer-container').innerHTML = footerHtml;
        
        // Now initialize all components after DOM is updated
        setTimeout(() => {
            initLanguageSelector();
            initMobileMenu();
            initScrollReveal();
            initChatButton();
            initSmoothScroll();
            initCounters();
            
            // Set active navigation
            setActiveNavigation();
            
            // Apply translations after everything is loaded
            if (typeof applyTranslations === 'function') {
                applyTranslations();
            }
        }, 100);
    }).catch(error => {
        console.error('Error loading includes:', error);
    });
});

// Language selector functionality
function initLanguageSelector() {
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');
    const currentLangSpan = document.getElementById('currentLang');
    const langOptions = document.querySelectorAll('.lang-option');
    
    if (!langToggle) return;
    
    // Set current language display
    const currentLang = getCurrentLanguage();
    if (currentLangSpan) {
        currentLangSpan.textContent = currentLang.toUpperCase();
    }
    
    // Update language links based on current page
    updateLanguageLinks();
    
    langToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        langDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        if (langDropdown) {
            langDropdown.classList.add('hidden');
        }
    });
    
    // Handle language selection
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            const href = this.getAttribute('href');
            
            if (href) {
                window.location.href = href;
            }
        });
    });
}

// Update language links based on current page
function updateLanguageLinks() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    const isFrench = currentPath.includes('/fr/');
    
    // Update French link
    const frLink = document.querySelector('.lang-option[data-lang="fr"]');
    if (frLink) {
        if (isFrench) {
            frLink.href = `../fr/${currentPage}`;
        } else {
            frLink.href = `../fr/${currentPage}`;
        }
    }
    
    // Update English link
    const enLink = document.querySelector('.lang-option[data-lang="en"]');
    if (enLink) {
        if (isFrench) {
            enLink.href = `../en/${currentPage}`;
        } else {
            enLink.href = `../en/${currentPage}`;
        }
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenuToggle) return;
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
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
        case 'price.html':
            activeId = 'nav-pricing';
            break;
        case 'about.html':
            activeId = 'nav-about';
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

// Scroll reveal animation
function initScrollReveal() {
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    if (scrollRevealElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
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

// Initialize counters
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

// Chat button functionality
function initChatButton() {
    const chatButton = document.getElementById('chatButton');
    
    if (!chatButton) return;
    
    chatButton.addEventListener('click', function() {
        // Detect if mobile or desktop
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Open WhatsApp on mobile
            window.open('https://wa.me/15148190559?text=Hello,%20I%20would%20like%20to%20know%20more%20about%20your%20services.%20Can%20you%20help%20me%3F', '_blank');
        } else {
            // Open email client on desktop
            window.location.href = 'mailto:direction@smart-hotline.com?subject=Information%20Request&body=Hello,%20I%20would%20like%20to%20know%20more%20about%20your%20services.%20Can%20you%20help%20me%3F';
        }
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Get current language from URL path
function getCurrentLanguage() {
    const path = window.location.pathname;
    if (path.includes('/fr/')) return 'fr';
    return 'en';
}

// Form validation helper
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else {
            clearError(input);
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showError(input, 'Please enter a valid email address');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Show error message
function showError(input, message) {
    clearError(input);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
    input.classList.add('border-red-500');
}

// Clear error message
function clearError(input) {
    const errorDiv = input.parentNode.querySelector('.text-red-500');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.classList.remove('border-red-500');
}

// Loading state for buttons
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Loading...';
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text') || 'Submit';
    }
}

// Utility function to format phone numbers
function formatPhoneNumber(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

// Utility function to debounce function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
