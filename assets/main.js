// (Only the changed parts shown here — replace the file's loadComponents and language navigation parts accordingly)

function loadComponents() {
    // Load header (use root-absolute path)
    fetch('/partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));
    
    // Load footer
    fetch('/partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

// ... later in file, inside setupEventListeners() replace language navigation with:

// Language options
if (langOptions) {
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = option.getAttribute('data-lang');
            // language roots (absolute)
            if (lang === 'fr') {
                window.location.href = '/fr/';
            } else if (lang === 'en') {
                window.location.href = '/en/';
            }
        });
    });
}
