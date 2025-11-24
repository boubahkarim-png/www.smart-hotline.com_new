document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const chatButton = document.getElementById('chatButton');
    const statsCounters = document.querySelectorAll('.stats-counter');
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    // Initialize counters
    const initCounters = () => {
        const observerOptions = { threshold: 0.7, rootMargin: '0px' };
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
        statsCounters.forEach(counter => observer.observe(counter));
    };

    // Initialize scroll reveal
    const initScrollReveal = () => {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        scrollRevealElements.forEach(element => observer.observe(element));
    };

    // Set up event listeners
    const setupEventListeners = () => {
        // Language selector
        langToggle.addEventListener('click', () => langDropdown.classList.toggle('hidden'));
        document.addEventListener('click', (e) => {
            if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.add('hidden');
            }
        });
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = option.dataset.url;
            });
        });

        // Mobile menu toggle
        mobileMenuToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });

        // Chat functionality
        chatButton.addEventListener('click', () => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobile) {
                window.open('https://wa.me/15148190559?text=Bonjour,%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services.', '_blank');
            } else {
                window.location.href = 'mailto:direction@smart-hotline.com?subject=Demande%20d\'information%20-%20Smart%20Hotline';
            }
        });
    };

    initCounters();
    initScrollReveal();
    setupEventListeners();
});
