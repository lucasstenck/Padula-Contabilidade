// Configurações globais
const CONFIG = {
    carousel: {
        autoPlay: true,
        interval: 5000,
        transitionDuration: 700
    },
    mobile: {
        breakpoint: 768
    }
};

// Classe principal do site
class SiteManager {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.autoPlayInterval = null;
        this.isMobile = window.innerWidth <= CONFIG.mobile.breakpoint;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCarousel();
        this.initializeMobileMenu();
        this.initializeDropdowns();
        this.initializeAnimations();
        this.setupIntersectionObserver();
    }

    setupEventListeners() {
        // Resize listener
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Scroll listener para header
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Touch events para mobile
        if ('ontouchstart' in window) {
            this.setupTouchEvents();
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= CONFIG.mobile.breakpoint;
        this.updateMobileMenu();
        
        // Re-inicializar dropdowns apenas se mudou de desktop para mobile ou vice-versa
        if (wasMobile !== this.isMobile) {
            console.log('Screen size changed, re-initializing dropdowns');
            this.initializeDropdowns();
        }
    }

    handleScroll() {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    handleKeyboard(event) {
        switch(event.key) {
            case 'ArrowLeft':
                this.prevSlide();
                break;
            case 'ArrowRight':
                this.nextSlide();
                break;
            case 'Escape':
                this.closeMobileMenu();
                break;
        }
    }

    // Carrossel
    initializeCarousel() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        
        if (this.slides.length === 0) return;

        // Botões de navegação
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

        // Indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Auto-play
        if (CONFIG.carousel.autoPlay) {
            this.startAutoPlay();
        }

        // Pausar auto-play no hover
        const carousel = document.querySelector('.carousel-container');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
            carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }

    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, CONFIG.carousel.interval);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        // Remove active class from current slide and indicator
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');

        // Update current slide
        this.currentSlide = index;

        // Add active class to new slide and indicator
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');

        // Trigger custom event
        this.triggerEvent('slideChange', { currentSlide: this.currentSlide });
    }

    // Menu Mobile
    initializeMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.main-nav');
        
        if (!mobileToggle || !nav) return;

        mobileToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (event) => {
            if (!nav.contains(event.target) && !mobileToggle.contains(event.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const nav = document.querySelector('.main-nav');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        nav.classList.toggle('active');
        toggle.classList.toggle('active');
        
        // Animar hamburger
        const lines = toggle.querySelectorAll('.hamburger-line');
        lines.forEach((line, index) => {
            if (nav.classList.contains('active')) {
                if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) line.style.opacity = '0';
                if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                line.style.transform = '';
                line.style.opacity = '';
            }
        });
    }

    closeMobileMenu() {
        const nav = document.querySelector('.main-nav');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        nav.classList.remove('active');
        toggle.classList.remove('active');
        
        // Reset hamburger
        const lines = toggle.querySelectorAll('.hamburger-line');
        lines.forEach(line => {
            line.style.transform = '';
            line.style.opacity = '';
        });
    }

    updateMobileMenu() {
        if (!this.isMobile) {
            this.closeMobileMenu();
        }
    }

    // Dropdowns
    initializeDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        // Limpar todos os event listeners existentes
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                // Remover todos os event listeners clonando o elemento
                const newToggle = toggle.cloneNode(true);
                toggle.parentNode.replaceChild(newToggle, toggle);
            }
        });
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!toggle || !menu) return;

            // Desktop: hover
            if (!this.isMobile) {
                dropdown.addEventListener('mouseenter', () => {
                    this.showDropdown(dropdown);
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    this.hideDropdown(dropdown);
                });
            } else {
                // Mobile: click - lógica simplificada e direta
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('Mobile dropdown clicked');
                    
                    // Toggle direto
                    const isActive = dropdown.classList.contains('active');
                    
                    // Fechar todos os outros dropdowns primeiro
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                        }
                    });
                    
                    // Toggle do dropdown atual
                    if (isActive) {
                        dropdown.classList.remove('active');
                        console.log('Dropdown closed');
                    } else {
                        dropdown.classList.add('active');
                        console.log('Dropdown opened');
                    }
                });
            }
        });

        // Fechar dropdowns ao clicar fora (apenas no mobile)
        if (this.isMobile) {
            // Remover listener antigo se existir
            if (this.handleOutsideClick) {
                document.removeEventListener('click', this.handleOutsideClick);
            }
            
            // Adicionar novo listener
            this.handleOutsideClick = (event) => {
                dropdowns.forEach(dropdown => {
                    if (!dropdown.contains(event.target)) {
                        dropdown.classList.remove('active');
                    }
                });
            };
            
            document.addEventListener('click', this.handleOutsideClick);
        }
    }

    showDropdown(dropdown) {
        dropdown.classList.add('active');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu && !this.isMobile) {
            // Desktop: aplica estilos inline
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateY(0)';
        }
    }

    hideDropdown(dropdown) {
        dropdown.classList.remove('active');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu && !this.isMobile) {
            // Desktop: aplica estilos inline
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.transform = 'translateY(-10px)';
        }
    }

    toggleDropdown(dropdown) {
        const isActive = dropdown.classList.contains('active');
        
        if (isActive) {
            this.hideDropdown(dropdown);
        } else {
            // Fechar outros dropdowns
            document.querySelectorAll('.dropdown.active').forEach(d => {
                if (d !== dropdown) this.hideDropdown(d);
            });
            this.showDropdown(dropdown);
        }
    }

    // Animações
    initializeAnimations() {
        // Animar elementos quando entram na viewport
        const animatedElements = document.querySelectorAll('.service-card, .slide-content');
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observar elementos animáveis
        const animatedElements = document.querySelectorAll('.service-card, .slide-content');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Touch events para mobile
    setupTouchEvents() {
        const carousel = document.querySelector('.carousel-container');
        if (!carousel) return;

        let startX = 0;
        let endX = 0;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });

        carousel.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    // Utilitários
    triggerEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, {
            detail: data,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    // Debounce function
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

    // Throttle function
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
        };
    }
}

// Lazy loading para imagens
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            this.loadAllImages();
        }
    }

    setupIntersectionObserver() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        this.images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    }

    loadAllImages() {
        this.images.forEach(img => this.loadImage(img));
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.measurePerformance();
                }, 0);
            });
        }
    }

    measurePerformance() {
        const perfData = performance.getEntriesByType('navigation')[0];
        
        if (perfData) {
            console.log('Performance Metrics:', {
                'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                'Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
                'Total Load Time': perfData.loadEventEnd - perfData.fetchStart
            });
        }
    }
}

// Error handling
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('error', (event) => {
            console.error('JavaScript Error:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
        });
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes
    new SiteManager();
    new LazyLoader();
    new PerformanceMonitor();
    new ErrorHandler();

    // Adicionar classe loaded ao body
    document.body.classList.add('loaded');

    // Log de inicialização
    console.log('Site initialized successfully');
});

// Fallback para navegadores mais antigos
if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported, using fallback');
}

// Service Worker registration (se disponível)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}