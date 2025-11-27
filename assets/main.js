// Main JavaScript file for Smart Hotline Agency

document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer components
    loadComponents();
    
    // Initialize scroll reveal animations
    initScrollReveal();
    
    // Initialize stats counter animation
    initStatsCounter();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize chat functionality
    initChat();
    
    // Initialize form handling
    initForms();
});

// Load header and footer components
function loadComponents() {
    // Load header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        const path = window.location.pathname;
        let langPath = '';
        
        if (path.includes('/en/')) {
            langPath = '../en/';
        } else if (path.includes('/fr/')) {
            langPath = '../fr/';
        }
        
        fetch(`${langPath}header.html`)
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html;
                
                // Re-initialize mobile menu after loading header
                initMobileMenu();
            })
            .catch(error => console.error('Error loading header:', error));
    }
    
    // Load footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        const path = window.location.pathname;
        let langPath = '';
        
        if (path.includes('/en/')) {
            langPath = '../en/';
        } else if (path.includes('/fr/')) {
            langPath = '../fr/';
        }
        
        fetch(`${langPath}footer.html`)
            .then(response => response.text())
            .then(html => {
                footerContainer.innerHTML = html;
            })
            .catch(error => console.error('Error loading footer:', error));
    }
}

// Initialize scroll reveal animations
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

// Initialize stats counter animation
function initStatsCounter() {
    const counters = document.querySelectorAll('.stats-counter');
    
    function startCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    }
    
    // Use Intersection Observer to start counter when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Initialize mobile menu
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Initialize chat functionality
function initChat() {
    const chatButton = document.getElementById('chatButton');
    
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            // Here you would typically open a chat widget
            // For now, we'll just show an alert
            alert('Chat functionality would be implemented here. Consider integrating a service like Tawk.to, Crisp, or LiveChat.');
        });
    }
}

// Initialize form handling
function initForms() {
    // Handle Netlify forms
    const forms = document.querySelectorAll('form[data-netlify="true"]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="spinner"></span> Sending...';
            submitButton.disabled = true;
            
            // Submit form using fetch
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Show success message
                    form.innerHTML = `
                        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            <strong>Success!</strong> Your message has been sent.
                        </div>
                    `;
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .catch(error => {
                // Show error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4';
                errorDiv.innerHTML = `<strong>Error:</strong> There was a problem sending your message. Please try again.`;
                form.appendChild(errorDiv);
                
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            });
        });
    });
}
