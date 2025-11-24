// Function to load HTML content from external files
function loadHTML(elementId, filePath, callback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
                if (callback) callback();
            }
        })
        .catch(error => {
            console.error('Error loading HTML:', error);
            // Fallback: try to load from cache or show error
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = '<div style="color: red; padding: 20px;">Error loading content. Please refresh the page.</div>';
            }
        });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing page...');
    
    // Load header and footer
    loadHTML('header-container', 'includes/header.html', function() {
        console.log('Header loaded successfully');
        setupHeader();
    });
    
    loadHTML('footer-container', 'includes/footer.html', function() {
        console.log('Footer loaded successfully');
        setupFooter();
    });
    
    // Initialize other components
    setupChatButton();
    setupArticleModal();
    initScrollReveal();
    initCounters();
});

// Setup header functionality
function setupHeader() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
            });
        });
    }
}

// Setup footer functionality
function setupFooter() {
    // Footer functionality
    console.log('Footer setup complete');
}

// Chat button functionality
function setupChatButton() {
    const chatButton = document.getElementById('chatButton');
    
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                window.open('https://wa.me/15148190559?text=Bonjour,%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services.%20Pouvez-vous%20m\'aider%3F', '_blank');
            } else {
                window.location.href = 'mailto:direction@smart-hotline.com?subject=Demande%20d\'information%20-%20Smart%20Hotline&body=Bonjour,%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services.%20Pouvez-vous%20m\'aider%3F';
            }
        });
    }
}

// Article modal functionality
function setupArticleModal() {
    const articleModal = document.getElementById('articleModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    // Open article modal
    window.openArticle = function(articleId) {
        const article = window.articles[articleId];
        if (article && articleModal && modalTitle && modalContent) {
            modalTitle.textContent = article.title;
            modalContent.innerHTML = article.content;
            articleModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Close article modal
    window.closeArticle = function() {
        if (articleModal) {
            articleModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Close modal on background click
    if (articleModal) {
        articleModal.addEventListener('click', function(e) {
            if (e.target === articleModal) {
                window.closeArticle();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && articleModal && articleModal.classList.contains('active')) {
            window.closeArticle();
        }
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

// Make functions globally available
window.loadHTML = loadHTML;
window.setupHeader = setupHeader;
window.setupFooter = setupFooter;
window.setupChatButton = setupChatButton;
window.setupArticleModal = setupArticleModal;
window.initCounters = initCounters;
window.initScrollReveal = initScrollReveal;
