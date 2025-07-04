// main.js file for the portfolio website

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager first
    const themeManager = new AdvancedThemeManager();
    
    // Initialize portfolio data manager and load data immediately
    portfolioDataManager = new PortfolioDataManager();
    portfolioDataManager.loadFromLocalStorage();
    
    // Make portfolioDataManager globally available
    window.portfolioDataManager = portfolioDataManager;
    
    initializeAdvancedComponents();
});

// Portfolio Data Management
class PortfolioDataManager {
    constructor() {
        this.data = null;
        this.apiBase = window.location.hostname === 'localhost' ? 'http://localhost/api.php' : './api.php';
    }

    async loadData() {
        try {
            const response = await fetch(`${this.apiBase}/data`);
            if (response.ok) {
                this.data = await response.json();
                this.updateUI();
            } else {
                // Fallback to localStorage if API fails
                this.loadFromLocalStorage();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.loadFromLocalStorage();
        }
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('portfolioData');
        if (savedData) {
            this.data = JSON.parse(savedData);
            console.log('Loading data from localStorage:', this.data);
            this.updateUI();
        } else {
            console.log('No saved data found, loading default data');
            this.loadDefaultData();
        }
    }

    loadDefaultData() {
        this.data = {
            profile: {
                name: 'Gagan Kumar',
                title: 'Python | Full Stack Developer',
                description: 'Crafting digital experiences with cutting-edge technologies. Specialized in building scalable web applications that push the boundaries of innovation.',
                image: 'img/IMG_20250629_175830.png'
            },
            skills: [
                { id: 1, name: 'Python', icon: 'fab fa-python', color: 'yellow-500', level: 90 },
                { id: 2, name: 'JavaScript', icon: 'fab fa-js', color: 'yellow-500', level: 85 },
                { id: 3, name: 'React', icon: 'fab fa-react', color: 'blue-500', level: 80 },
                { id: 4, name: 'Node.js', icon: 'fab fa-node-js', color: 'green-500', level: 75 },
                { id: 5, name: 'Django', icon: 'fab fa-python', color: 'green-500', level: 85 },
                { id: 6, name: 'MongoDB', icon: 'fas fa-database', color: 'green-500', level: 70 }
            ],
            projects: [
                {
                    id: 1,
                    name: 'Telegram Remote Desktop',
                    category: 'desktop',
                    description: 'A Python-based remote desktop application that allows users to control their computer remotely through Telegram bot commands.',
                    technologies: ['Python', 'Telegram Bot API', 'PyAutoGUI', 'PIL'],
                    liveUrl: '',
                    githubUrl: 'https://github.com/gaganrai-github/telegram-remote-desktop',
                    image: ''
                },
                {
                    id: 2,
                    name: 'Desktop Voice Assistant',
                    category: 'desktop',
                    description: 'An AI-powered desktop voice assistant built with Python that can perform various tasks like web browsing, system control, and answering questions.',
                    technologies: ['Python', 'Speech Recognition', 'pyttsx3', 'OpenAI API'],
                    liveUrl: '',
                    githubUrl: 'https://github.com/gaganrai-github/voice-assistant',
                    image: ''
                }
            ],
            contact: {
                email: 'gagan@example.com',
                phone: '+91 9876543210',
                location: 'India',
                linkedin: 'https://linkedin.com/in/gagan-kumar',
                github: 'https://github.com/gagan-kumar'
            }
        };
        this.updateUI();
    }

    updateUI() {
        if (!this.data) return;

        // Update profile information
        const nameElements = document.querySelectorAll('[data-profile="name"]');
        nameElements.forEach(el => el.textContent = this.data.profile.name);

        const titleElements = document.querySelectorAll('[data-profile="title"]');
        titleElements.forEach(el => el.textContent = this.data.profile.title);

        const descriptionElements = document.querySelectorAll('[data-profile="description"]');
        descriptionElements.forEach(el => el.textContent = this.data.profile.description);

        // Update profile image
        const imageElements = document.querySelectorAll('[data-profile="image"]');
        imageElements.forEach(el => {
            if (el.tagName === 'IMG') {
                el.src = this.data.profile.image;
            }
        });

        // Update skills
        this.updateSkills();

        // Update projects
        this.updateProjects();

        // Update contact information
        this.updateContactInfo();
    }

    updateSkills() {
        const skillsContainer = document.querySelector('[data-skills-container]');
        if (!skillsContainer || !this.data.skills) return;

        skillsContainer.innerHTML = '';
        this.data.skills.forEach(skill => {
            const skillElement = document.createElement('div');
            skillElement.className = `skill-item group bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center border border-transparent hover:border-${skill.color}/50`;
            skillElement.innerHTML = `
                <div class="mb-4">
                    <i class="${skill.icon} text-4xl text-${skill.color} group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${skill.name}</h3>
                <div class="mb-2">
                    <span class="text-sm font-medium text-${skill.color}">${skill.level || 50}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div class="bg-${skill.color} h-2 rounded-full transition-all duration-1000 ease-out" style="width: ${skill.level || 50}%"></div>
                </div>
            `;
            skillsContainer.appendChild(skillElement);
        });
    }

    updateProjects() {
        const projectsContainer = document.querySelector('[data-projects-container]');
        if (!projectsContainer || !this.data.projects) return;

        projectsContainer.innerHTML = '';
        this.data.projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-card group bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-dark-border';
            projectElement.dataset.category = project.category;
            
            const gradientColors = {
                web: 'from-blue-400 via-purple-500 to-pink-500',
                mobile: 'from-green-400 via-blue-500 to-purple-500',
                desktop: 'from-orange-400 via-red-500 to-pink-500',
                design: 'from-purple-400 via-pink-500 to-red-500'
            };

            projectElement.innerHTML = `
                <div class="relative overflow-hidden">
                    <div class="h-48 bg-gradient-to-br ${gradientColors[project.category] || 'from-primary to-secondary'} flex items-center justify-center relative">
                        ${project.image ? `<img src="${project.image}" alt="${project.name}" class="w-full h-full object-cover">` : `<i class="fas fa-project-diagram text-6xl text-white opacity-80"></i>`}
                    </div>
                    <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div class="flex space-x-4">
                            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="bg-white text-gray-900 p-3 rounded-full hover:scale-110 transition-transform duration-300"><i class="fas fa-external-link-alt"></i></a>` : ''}
                            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="bg-white text-gray-900 p-3 rounded-full hover:scale-110 transition-transform duration-300"><i class="fab fa-github"></i></a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-300">${project.name}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">${project.description}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${project.technologies.map(tech => `<span class="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">${tech}</span>`).join('')}
                    </div>
                    <div class="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                        <span class="text-sm text-gray-500 dark:text-gray-400 capitalize">${project.category}</span>
                        <div class="flex space-x-2">
                            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="text-primary hover:text-secondary transition-colors duration-300"><i class="fas fa-external-link-alt"></i></a>` : ''}
                            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="text-primary hover:text-secondary transition-colors duration-300"><i class="fab fa-github"></i></a>` : ''}
                        </div>
                    </div>
                </div>
            `;
            projectsContainer.appendChild(projectElement);
        });
    }

    updateContactInfo() {
        if (!this.data.contact) return;

        const contactElements = {
            email: document.querySelectorAll('[data-contact="email"]'),
            phone: document.querySelectorAll('[data-contact="phone"]'),
            location: document.querySelectorAll('[data-contact="location"]'),
            linkedin: document.querySelectorAll('[data-contact="linkedin"]'),
            github: document.querySelectorAll('[data-contact="github"]')
        };

        Object.keys(contactElements).forEach(key => {
            contactElements[key].forEach(el => {
                if (el.tagName === 'A') {
                    el.href = this.data.contact[key];
                } else {
                    el.textContent = this.data.contact[key];
                }
            });
        });
    }

    async saveContactMessage(formData) {
        try {
            const response = await fetch(`${this.apiBase}/contact-form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                return result;
            }
        } catch (error) {
            console.error('Error saving contact message:', error);
        }
        return { success: false, message: 'Failed to send message' };
    }
}

// Initialize portfolio data manager (moved to top)
let portfolioDataManager = null;

// Function to load portfolio data
function loadPortfolioData() {
    if (portfolioDataManager) {
        portfolioDataManager.loadFromLocalStorage();
    }
}

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
    setupContactForm();
    setupProjectFiltering();
    setupAdminButtons(); // Add admin button setup
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

// Contact Form Handling
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            const result = await portfolioDataManager.saveContactMessage(data);
            
            if (result.success) {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showNotification('Failed to send message. Please try again.', 'error');
            }
        });
    }
}

// Project Filtering
function setupProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-gradient-to-r', 'from-primary', 'to-secondary', 'text-white');
                btn.classList.add('bg-gray-200', 'dark:bg-dark-card', 'text-gray-700', 'dark:text-gray-300');
            });
            
            button.classList.add('active', 'bg-gradient-to-r', 'from-primary', 'to-secondary', 'text-white');
            button.classList.remove('bg-gray-200', 'dark:bg-dark-card', 'text-gray-700', 'dark:text-gray-300');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.classList.add('animate-fade-in');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('animate-fade-in');
                }
            });
        });
    });
}

// Setup Admin Buttons
function setupAdminButtons() {
    // Select all admin buttons (desktop, mobile, and hidden)
    const adminButtons = document.querySelectorAll('.admin-button');
    
    adminButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openAdminPanel();
        });
    });
    
    // Also add event listener for the hidden admin access button
    const hiddenAdminButton = document.querySelector('#admin-access button');
    if (hiddenAdminButton) {
        hiddenAdminButton.addEventListener('click', (e) => {
            e.preventDefault();
            openAdminPanel();
        });
    }
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
    } text-white`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${type === 'success' ? 'fa-check' : 'fa-exclamation-triangle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 hover:opacity-70">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Admin Panel Access
function openAdminPanel() {
    // Open admin login page
    window.open('admin-login.html', '_blank');
}

// Make function globally available
window.openAdminPanel = openAdminPanel;

// Show admin button on secret key combination (Ctrl + Alt + A)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key === 'a') {
        const adminButton = document.getElementById('admin-access');
        adminButton.classList.toggle('opacity-0');
        adminButton.classList.toggle('opacity-100');
    }
});

// Console easter egg with admin info
console.log(`
%c╔══════════════════════════════════════╗
║                                      ║
║         Welcome to my portfolio!     ║
║                                      ║
║    Built with 💙 by Gagan Kumar      ║
║                                      ║
║    🔐 Admin Panel Access:            ║
║    • URL: admin.html                 ║
║    • Username: admin                 ║
║    • Password: gagan123              ║
║    • Shortcut: Ctrl+Alt+A            ║
║                                      ║
╚══════════════════════════════════════╝
`, 'color: #00d4ff; font-family: monospace; font-size: 12px;');

// Initialize on load
window.addEventListener('load', () => {
    setupScrollToTop();
    setupContactForm();
    setupProjectFiltering();
    
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

// Debug function to check localStorage data
function debugPortfolioData() {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
        console.log('Portfolio data found in localStorage:', JSON.parse(savedData));
        return JSON.parse(savedData);
    } else {
        console.log('No portfolio data found in localStorage');
        return null;
    }
}

// Debug function to reload data
function reloadPortfolioData() {
    console.log('Reloading portfolio data...');
    if (window.portfolioDataManager) {
        window.portfolioDataManager.loadFromLocalStorage();
    } else {
        console.error('Portfolio data manager not found');
    }
}

// Make debug functions available globally
window.debugPortfolioData = debugPortfolioData;
window.reloadPortfolioData = reloadPortfolioData;

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

// Listen for localStorage changes from admin panel
window.addEventListener('storage', (e) => {
    if (e.key === 'portfolioData') {
        console.log('Portfolio data changed, reloading...');
        portfolioDataManager.loadFromLocalStorage();
    }
});

// Force refresh portfolio data every 5 seconds if we're not in admin panel
if (!window.location.pathname.includes('admin')) {
    setInterval(() => {
        const currentData = localStorage.getItem('portfolioData');
        if (currentData) {
            const newData = JSON.parse(currentData);
            if (JSON.stringify(newData) !== JSON.stringify(portfolioDataManager.data)) {
                console.log('Data changed, updating UI...');
                portfolioDataManager.data = newData;
                portfolioDataManager.updateUI();
            }
        }
    }, 5000);
}