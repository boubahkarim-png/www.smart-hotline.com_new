// Function to load HTML content from external files
function loadHTML(elementId, filePath, callback) {
    // Utiliser la fonction pour s'assurer que le chemin commence par un /
    const absolutePath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    
    console.log(`Loading ${absolutePath} into ${elementId}`);
    fetch(absolutePath)
        .then(response => {
            if (!response.ok) {
                // Pour le débogage si un chemin absolu ne fonctionne pas
                throw new Error(`HTTP error! status: ${response.status} for path: ${absolutePath}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                // Pour les pages de contenu, nous mettons le HTML dans le main-content-container
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
    loadHTML('header-container', 'includes/header.html', function() {
        console.log('Header loaded successfully');
        setupHeader();
        setupLanguageSelector();
    });
    
    loadHTML('footer-container', 'includes/footer.html', function() {
        console.log('Footer loaded successfully');
        setupFooter();
    });
    
    // Initialisation des composants dynamiques
    setupChatButton();
    setupArticleModal();
    initScrollReveal();
    initCounters();
    
    // Le chargement du contenu spécifique à la page sera fait par un script inline dans le gabarit HTML
    
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

            if (currentPath.startsWith('/en/')) {
                // De EN vers FR : Supprimer /en/ et rediriger
                newPath = currentPath.replace('/en/', '/');
            } else if (currentPath.startsWith('/fr/')) {
                // De FR vers EN : Remplacer /fr/ par /en/
                newPath = currentPath.replace('/fr/', '/en/');
            } else {
                // De la racine (index.html) vers EN ou FR (si non spécifié, on bascule vers /en/)
                newPath = '/en' + currentPath;
            }
            
            // Assurez-vous que l'index.html de la racine reste '/' pour la version FR principale
            if (newPath === '/index.html') newPath = '/';

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

// ... (Gardez le reste des fonctions comme setupHeader, setupFooter, etc.)

// Make functions globally available
window.loadHTML = loadHTML;
window.setupHeader = setupHeader;
window.setupFooter = setupFooter;
window.setupChatButton = setupChatButton;
window.setupArticleModal = setupArticleModal;
window.initCounters = initCounters;
window.initScrollReveal = initScrollReveal;
