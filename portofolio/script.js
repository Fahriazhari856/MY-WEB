/*==================== MAIN APPLICATION ====================*/
class PortfolioApp {
    constructor() {
        this.init();
        this.bindEvents();
        this.initAnimations();
    }

    init() {
        // Cache DOM elements
        this.elements = {
            menuIcon: document.querySelector('#menu-icon'),
            navbar: document.querySelector('.navbar'),
            header: document.querySelector('header'),
            sections: document.querySelectorAll('section'),
            navLinks: document.querySelectorAll('header nav a'),
            contentSections: document.querySelectorAll('.content-section'),
            networkContainer: document.querySelector('.network-container'),
            progressBar: document.querySelector('.progress-bar')
        };

        // Animation state
        this.animationState = {
            mouseX: 0,
            mouseY: 0,
            gradientPos: 0,
            isScrolling: false
        };
    }

    /*==================== EVENT BINDINGS ====================*/
    bindEvents() {
        // Mobile menu toggle
        if (this.elements.menuIcon && this.elements.navbar) {
            this.elements.menuIcon.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Scroll events with throttling
        let scrollTimer = null;
        window.addEventListener('scroll', () => {
            if (!this.animationState.isScrolling) {
                this.animationState.isScrolling = true;
                requestAnimationFrame(() => this.handleScroll());
            }
            
            // Throttle scroll events
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                this.animationState.isScrolling = false;
            }, 150);
        }, { passive: true });

        // Mouse movement with throttling
        let mouseTimer = null;
        document.addEventListener('mousemove', (e) => {
            if (mouseTimer) clearTimeout(mouseTimer);
            mouseTimer = setTimeout(() => {
                this.handleMouseMove(e);
            }, 16); // ~60fps
        }, { passive: true });

        // Window load event
        window.addEventListener('load', () => this.handleLoad());

        // Resize event
        window.addEventListener('resize', () => this.handleResize(), { passive: true });
    }

    /*==================== MOBILE MENU ====================*/
    toggleMobileMenu() {
        this.elements.menuIcon.classList.toggle('bx-x');
        this.elements.navbar.classList.toggle('active');
    }

    closeMobileMenu() {
        this.elements.menuIcon?.classList.remove('bx-x');
        this.elements.navbar?.classList.remove('active');
    }

    /*==================== SCROLL HANDLING ====================*/
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Update multiple scroll-dependent features
        this.updateActiveNavLinks(scrollY);
        this.updateStickyHeader(scrollY);
        this.updateScrollProgress(scrollY);
        this.updateNetworkAnimation(scrollY);
        
        // Auto-close mobile menu when scrolling
        if (this.elements.navbar?.classList.contains('active')) {
            this.closeMobileMenu();
        }
    }

    /*==================== ACTIVE NAV LINKS ====================*/
    updateActiveNavLinks(scrollY) {
        if (!this.elements.sections || !this.elements.navLinks) return;

        this.elements.sections.forEach(section => {
            const top = scrollY;
            const offset = section.offsetTop - 150;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (top >= offset && top < offset + height) {
                // Remove active class from all links
                this.elements.navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const activeLink = document.querySelector(`header nav a[href*="${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    /*==================== STICKY HEADER ====================*/
    updateStickyHeader(scrollY) {
        if (!this.elements.header) return;
        
        this.elements.header.classList.toggle('sticky', scrollY > 100);
    }

    /*==================== SCROLL PROGRESS ====================*/
    updateScrollProgress(scrollY) {
        if (!this.elements.progressBar) return;

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min(scrollY / docHeight, 1);
        
        this.elements.progressBar.style.transform = `scaleX(${scrollPercent})`;
    }

    /*==================== NETWORK ANIMATION ====================*/
    updateNetworkAnimation(scrollY) {
        if (!this.elements.contentSections) return;

        const windowHeight = window.innerHeight;
        
        this.elements.contentSections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            // Check if section is in viewport
            if (scrollY + windowHeight > sectionTop && scrollY < sectionBottom) {
                this.activateNetworkElements(index);
                
                const content = section.querySelector('.section-content');
                if (content) {
                    content.classList.add('visible');
                }
            }
        });
    }

    activateNetworkElements(sectionIndex) {
        // Activate nodes for current section
        const nodes = document.querySelectorAll(`.network-node[data-trigger="${sectionIndex}"]`);
        const lines = document.querySelectorAll(`.network-line[data-trigger="${sectionIndex}"]`);
        
        nodes.forEach(node => node.classList.add('active'));
        lines.forEach(line => line.classList.add('active'));
    }

    /*==================== MOUSE MOVEMENT ====================*/
    handleMouseMove(e) {
        this.animationState.mouseX = e.clientX;
        this.animationState.mouseY = e.clientY;
        
        // Network parallax effect
        if (this.elements.networkContainer) {
            const moveX = (this.animationState.mouseX - window.innerWidth / 2) * 0.01;
            const moveY = (this.animationState.mouseY - window.innerHeight / 2) * 0.01;
            
            this.elements.networkContainer.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    }

    /*==================== PARTICLE SYSTEM ====================*/
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        const endY = -10;
        const duration = Math.random() * 3000 + 2000;
        
        particle.style.cssText = `
            left: ${startX}px;
            top: ${startY}px;
            opacity: 1;
            position: fixed;
            width: 4px;
            height: 4px;
            background: #64b5f6;
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
        `;
        
        document.body.appendChild(particle);
        
        const animation = particle.animate([
            { transform: 'translateY(0px)', opacity: 0 },
            { transform: 'translateY(-20px)', opacity: 1 },
            { transform: `translateY(${endY - startY}px)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear'
        });
        
        animation.onfinish = () => particle.remove();
    }

    /*==================== BACKGROUND GRADIENT ANIMATION ====================*/
    animateGradient() {
        this.animationState.gradientPos += 1;
        if (this.animationState.gradientPos > 40) {
            this.animationState.gradientPos = 0;
        }
        
        document.body.style.backgroundPosition = 
            `${this.animationState.gradientPos}% ${this.animationState.gradientPos}%`;
        
        requestAnimationFrame(() => this.animateGradient());
    }

    /*==================== INITIALIZATION METHODS ====================*/
    initAnimations() {
        // Initialize ScrollReveal if available
        this.initScrollReveal();
        
        // Initialize Typed.js if available
        this.initTypedJS();
        
        // Start gradient animation
        this.animateGradient();
    }

    initScrollReveal() {
        if (typeof ScrollReveal !== 'undefined') {
            const sr = ScrollReveal({
                reset: true,
                distance: '80px',
                duration: 2000,
                delay: 200
            });

            // Reveal animations
            sr.reveal('.home-content, .heading', { origin: 'top' });
            sr.reveal('.home-img, .services-container, .portfolio-box, .contact form', { origin: 'bottom' });
            sr.reveal('.home-content h1, .about-img', { origin: 'left' });
            sr.reveal('.home-content p, .about-content', { origin: 'right' });
        }
    }

    initTypedJS() {
        if (typeof Typed !== 'undefined' && document.querySelector('.multiple-text')) {
            new Typed('.multiple-text', {
                strings: ['Web Designer', 'Frontend Developer', 'UI/UX Designer'],
                typeSpeed: 100,
                backSpeed: 100,
                backDelay: 1000,
                loop: true
            });
        }
    }

    /*==================== LOAD HANDLER ====================*/
    handleLoad() {
        // Initial setup
        this.updateNetworkAnimation(window.scrollY);
        this.updateScrollProgress(window.scrollY);
        
        // Start particle system
        if (document.querySelector('.particle') !== null || document.querySelector('.network-container')) {
            setInterval(() => this.createParticle(), 500);
        }
        
        // Add loaded class for CSS transitions
        document.body.classList.add('loaded');
    }

    /*==================== RESIZE HANDLER ====================*/
    handleResize() {
        // Recalculate scroll positions on resize
        setTimeout(() => {
            this.updateNetworkAnimation(window.scrollY);
            this.updateScrollProgress(window.scrollY);
        }, 100);
    }

    /*==================== UTILITY METHODS ====================*/
    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Debounce function for performance
    debounce(func, wait) {
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
}

/*==================== INITIALIZE APPLICATION ====================*/
// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.portfolioApp = new PortfolioApp();
    });
} else {
    window.portfolioApp = new PortfolioApp();
}

/*==================== ADDITIONAL UTILITIES ====================*/
// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu after click
            if (window.portfolioApp) {
                window.portfolioApp.closeMobileMenu();
            }
        }
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape' && window.portfolioApp) {
        window.portfolioApp.closeMobileMenu();
    }
});

// Performance optimization: Preload critical images
const preloadImages = () => {
    const imageUrls = [
        // Add your critical image URLs here
        // 'path/to/hero-image.jpg',
        // 'path/to/profile-image.jpg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
};

// Call preload on load
window.addEventListener('load', preloadImages);
