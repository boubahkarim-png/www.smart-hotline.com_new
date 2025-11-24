// Function to load HTML content from external files
function loadHTML(elementId, filePath, callback) {
    // Utilisation d'un chemin absolu
    const absolutePath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    
    console.log(`Loading ${absolutePath} into ${elementId}`);
    fetch(absolutePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for path: ${absolutePath}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
                console.log(`Successfully loaded ${absolutePath}`);
                if (callback) callback();
            } else {
                console.error(`Element ${elementId} not found`);
            }
        })
        .catch(error => {
            console.error('Error loading HTML:', error);
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = '<div style="color: red; padding: 20px;">Error loading content from ' + absolutePath + '. Check your server configuration or path.</div>';
            }
        });
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing page...');
    
    // CORRECTION: Charger le header et le footer en utilisant des chemins absolus
    loadHTML('header-container', '/includes/header.html', function() { // Chemin absolu
        console.log('Header loaded successfully');
        setupHeader();
        setupLanguageSelector();
    });
    
    loadHTML('footer-container', '/includes/footer.html', function() { // Chemin absolu
        console.log('Footer loaded successfully');
        setupFooter();
        // Déplace l'initialisation des compteurs et scroll ici, car ils pourraient se trouver dans le footer
        initCounters();
        initScrollReveal(); 
    });
    
    // Initialisation des composants statiques (hors includes)
    setupChatButton();
    setupArticleModal();
    
    console.log('Page initialization complete');
});


// CORRECTION: Logique de basculement de langue pour gérer les dossiers /fr/ et /en/
function setupLanguageSelector() {
    const langToggle = document.querySelector('.lang-selector');
    
    if (langToggle) {
        langToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            const currentPath = window.location.pathname;
            let newPath = '';

            // Retire l'extension .html pour la comparaison
            let baseName = currentPath.split('/').pop().replace('.html', '');
            if (baseName === '') baseName = 'index'; // Si c'est /, c'est l'index

            if (currentPath.startsWith('/en/')) {
                // De EN vers FR : Rediriger vers la racine ou /fr/page.html
                newPath = (baseName === 'index' || baseName === '') ? '/' : `/fr/${baseName}.html`;
            } else if (currentPath === '/' || currentPath.startsWith('/fr/')) {
                // De FR vers EN : Rediriger vers /en/page.html
                newPath = `/en/${baseName}.html`;
            } else {
                // Gestion de la racine index.html (cas où l'URL n'a pas de /fr/)
                newPath = `/en/${baseName}.html`;
            }

            // Simplification de la racine: /en/index.html -> /en/
            if (newPath === '/en/index.html') newPath = '/en/';
            if (newPath === '/fr/index.html') newPath = '/';

            // Redirection
            window.location.href = newPath;
        });
    }

    // Affichage de la langue actuelle dans le sélecteur
    const currentLangSpan = document.getElementById('langSelector');
    if (currentLangSpan) {
        if (window.location.pathname.startsWith('/en/')) {
            currentLangSpan.textContent = 'EN';
        } else {
            currentLangSpan.textContent = 'FR';
        }
    }
}
// Le reste des fonctions (setupHeader, setupFooter, setupChatButton, setupArticleModal, initCounters, initScrollReveal)
// doit être conservé tel quel (sauf les modifications dans setupLanguageSelector et loadHTML ci-dessus).

// Function to set up the mobile menu toggle (from your original code)
function setupHeader() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    // ... (rest of setupHeader logic)
}

function setupFooter() {
    // ... (rest of setupFooter logic)
}
function setupChatButton() {
    // ... (rest of setupChatButton logic)
}
function setupArticleModal() {
    // ... (rest of setupArticleModal logic)
}
function initCounters() {
    // ... (rest of initCounters logic)
}
function initScrollReveal() {
    // ... (rest of initScrollReveal logic)
}

// Make functions globally available
window.loadHTML = loadHTML;
window.setupHeader = setupHeader;
window.setupFooter = setupFooter;
window.setupChatButton = setupChatButton;
window.setupArticleModal = setupArticleModal;
window.initCounters = initCounters;
window.initScrollReveal = initScrollReveal;
