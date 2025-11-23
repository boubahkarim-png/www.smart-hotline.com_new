// Function to load HTML content from external files
function loadHTML(elementId, filePath, callback) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) callback();
        })
        .catch(error => console.error('Error loading HTML:', error));
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer
    loadHTML('header-container', 'includes/header.html', function() {
        // Header functionality after loading
        setupHeader();
    });
    
    loadHTML('footer-container', 'includes/footer.html', function() {
        // Footer functionality after loading
        setupFooter();
    });
});

// Setup header functionality
function setupHeader() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    if (mobileMenu) {
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

// Initialize all components after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupChatButton();
    setupArticleModal();
});
