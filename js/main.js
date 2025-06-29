// main.js file for the portfolio website

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeAdvancedComponents();
});

// Advanced Theme Management
class AdvancedThemeManager {
    constructor() {
        // Default to dark mode
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupToggle();
        this.setupSystemThemeListener();
    }

    applyTheme() {
        const html = document.documentElement;
        if (this.theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        
        // Update theme toggle icons
        this.updateToggleButtons();
        
        // Update favicon based on theme
        this.updateFavicon();
    }

    updateToggleButtons() {
        const toggles = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
        toggles.forEach(toggle => {
            const sunIcon = toggle.querySelector('.fa-sun');
            const moonIcon = toggle.querySelector('.fa-moon');
            
            if (this.theme === 'dark') {
                sunIcon?.classList.add('hidden');
                moonIcon?.classList.remove('hidden');
            } else {
                sunIcon?.classList.remove('hidden');
                moonIcon?.classList.add('hidden');
            }
        });
    }

    updateFavicon() {
        const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = this.theme === 'dark' 
            ? 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌙</text></svg>'
            : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">☀️</text></svg>';
        document.head.appendChild(favicon);
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
        this.animateToggle();
    }

    setupToggle() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#theme-toggle, #mobile-theme-toggle')) {
                this.toggleTheme();
            }
        });
    }

    setupSystemThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.theme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                }
            });
        }
    }

    animateToggle() {
        const toggles = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
        toggles.forEach(toggle => {
            toggle.style.transform = 'scale(0.8) rotate(180deg)';
            setTimeout(() => {
                toggle.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        });
    }
}

// Advanced Components Initialization
function initializeAdvancedComponents() {
    setupAdvancedNavigation();
    setupAdvancedScrollEffects();
    setupAdvancedAnimations();
    setupAdvancedInteractions();
    setupAdvancedParticles();
    setupAdvancedCursor();
}

// Advanced Navigation
function setupAdvancedNavigation() {
    const navbar = document.querySelector('nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Enhanced navbar scroll effect
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            navbar.classList.add('bg-dark-bg/95', 'backdrop-blur-xl');
            navbar.classList.remove('bg-white/5', 'dark:bg-dark-bg/80');
        } else {
            navbar.classList.add('bg-white/5', 'dark:bg-dark-bg/80');
            navbar.classList.remove('bg-dark-bg/95', 'backdrop-blur-xl');
        }
        
        // Hide/show navbar based on scroll direction
        if (scrollY > lastScrollY && scrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = scrollY;
    });
    
    // Enhanced mobile menu
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');
            
            if (isOpen) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                document.body.style.overflow = 'auto';
            } else {
                mobileMenu.classList.remove('hidden');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times text-xl"></i>';
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Close mobile menu on link click
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                document.body.style.overflow = 'auto';
            });
        });
    }
}

// Advanced Scroll Effects
function setupAdvancedScrollEffects() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation highlighting with advanced animation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-primary', 'scale-110');
            const underline = link.querySelector('.absolute');
            if (underline) {
                underline.style.width = '0';
            }
            
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-primary', 'scale-110');
                if (underline) {
                    underline.style.width = '100%';
                }
            }
        });
    });
}

// Advanced Animations
function setupAdvancedAnimations() {
    // Advanced Intersection Observer
    const advancedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add staggered animation to child elements
                const children = element.querySelectorAll('[data-animate]');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-fade-in');
                    }, index * 100);
                });
                
                // Trigger specific animations based on section
                switch (element.id) {
                    case 'about':
                        animateCounters();
                        break;
                    case 'skills':
                        animateSkills();
                        break;
                    case 'projects':
                        animateProjects();
                        break;
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        advancedObserver.observe(section);
    });
}

// Advanced Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Advanced easing function
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOutCubic * target);
            
            counter.textContent = current;
            
            // Add visual effects
            counter.style.textShadow = `0 0 ${10 + (progress * 20)}px rgba(0, 212, 255, ${progress * 0.8})`;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (target >= 25 ? '+' : '');
                counter.style.textShadow = '0 0 20px rgba(0, 212, 255, 0.8)';
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
}

// Advanced Skills Animation
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate-slide-up');
            
            const progressBar = item.querySelector('[data-width]');
            if (progressBar) {
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width + '%';
                    progressBar.style.boxShadow = `0 0 20px rgba(0, 212, 255, 0.5)`;
                    
                    // Add percentage animation
                    const percentage = progressBar.parentElement.nextElementSibling;
                    if (percentage) {
                        let currentWidth = 0;
                        const interval = setInterval(() => {
                            currentWidth += 2;
                            percentage.textContent = Math.min(currentWidth, width) + '%';
                            if (currentWidth >= width) {
                                clearInterval(interval);
                            }
                        }, 30);
                    }
                }, 300);
            }
        }, index * 150);
    });
}

// Advanced Project Animation
function animateProjects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate-slide-up');
            card.style.animationDelay = `${index * 0.1}s`;
        }, 200);
    });
}

// Advanced Interactions
function setupAdvancedInteractions() {
    // Enhanced hover effects for project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 25px 50px rgba(0, 212, 255, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = 'none';
        });
    });
    
    // Advanced button interactions
    document.querySelectorAll('button, .btn, a[href^="#"]').forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.05)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
        
        element.addEventListener('mousedown', () => {
            element.style.transform = 'scale(0.95)';
        });
        
        element.addEventListener('mouseup', () => {
            element.style.transform = 'scale(1.05)';
        });
    });
}

// Advanced Particle System
function setupAdvancedParticles() {
    const canvas = document.createElement('canvas');
    canvas.className = 'fixed inset-0 pointer-events-none z-0';
    canvas.style.opacity = '0.3';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: 0, y: 0 };
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle(x, y) {
        return {
            x: x || Math.random() * canvas.width,
            y: y || Math.random() * canvas.height,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 0.5,
            life: 1,
            decay: Math.random() * 0.02 + 0.005
        };
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.life -= particle.decay;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
            
            // Mouse interaction
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particle.dx += dx * 0.0001;
                particle.dy += dy * 0.0001;
            }
            
            // Draw particle
            ctx.save();
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = '#00d4ff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00d4ff';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            // Remove dead particles
            if (particle.life <= 0) {
                particles[index] = createParticle();
            }
        });
        
        requestAnimationFrame(updateParticles);
    }
    
    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    updateParticles();
}

// Advanced Custom Cursor
function setupAdvancedCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor fixed w-4 h-4 bg-primary rounded-full pointer-events-none z-50 mix-blend-difference transition-all duration-150';
    cursor.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.8)';
    document.body.appendChild(cursor);
    
    const trail = [];
    const trailLength = 10;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 8 + 'px';
        cursor.style.top = e.clientY - 8 + 'px';
        
        // Add to trail
        trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        if (trail.length > trailLength) {
            trail.shift();
        }
    });
    
    // Enhanced cursor interactions
    document.addEventListener('mouseover', (e) => {
        if (e.target.matches('a, button, .project-card, .skill-item, [data-cursor="pointer"]')) {
            cursor.style.transform = 'scale(2)';
            cursor.style.backgroundColor = 'rgba(0, 212, 255, 0.5)';
        } else {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = '#00d4ff';
        }
    });
}

// Initialize theme manager
const themeManager = new AdvancedThemeManager();

// Add scroll to top functionality
function setupScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'fixed bottom-8 right-8 bg-gradient-to-r from-primary to-secondary text-dark p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 invisible z-40 hover:scale-110';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up text-lg"></i>';
    scrollBtn.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.remove('opacity-0', 'invisible');
            scrollBtn.classList.add('opacity-100', 'visible');
        } else {
            scrollBtn.classList.add('opacity-0', 'invisible');
            scrollBtn.classList.remove('opacity-100', 'visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize on load
window.addEventListener('load', () => {
    setupScrollToTop();
    
    // Remove loading screen if exists
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
    
    // Add loaded class to body
    document.body.classList.add('loaded');
});

// Performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Console easter egg
console.log(`
%c╔══════════════════════════════════════╗
║                                      ║
║         Welcome to my portfolio!     ║
║                                      ║
║    Built with 💙 by Gagan Kumar      ║
║                                      ║
╚══════════════════════════════════════╝
`, 'color: #00d4ff; font-family: monospace; font-size: 12px;');