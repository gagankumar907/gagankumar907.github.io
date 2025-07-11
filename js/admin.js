// Admin Panel JavaScript with Real-time Firebase Sync
class AdminPanel {
    constructor() {
        this.isLoggedIn = false;
        this.currentTab = 'profile';
        this.data = {};
        this.syncManager = null;
        this.init();
    }

    async init() {
        this.checkAuth();
        await this.initializeSync();
        this.setupEventListeners();
        this.setupSyncUI();
        await this.loadDashboardData();
    }

    async initializeSync() {
        // Wait for Firebase sync to be ready
        if (window.firebaseSync) {
            this.syncManager = window.firebaseSync;
            console.log('✅ Real-time sync initialized');
            
            // Set up real-time data loading
            window.loadAdminData = (data) => {
                this.data = data;
                this.refreshAdminUI();
            };
        } else {
            console.warn('⚠️ Firebase sync not available, using localStorage');
        }
    }

    setupSyncUI() {
        // Update sync status indicators
        this.updateSyncStatus();
        
        // Setup sync button handlers
        const forceSyncBtn = document.getElementById('force-sync-btn');
        if (forceSyncBtn) {
            forceSyncBtn.addEventListener('click', () => this.forceSyncData());
        }

        const backupBtn = document.getElementById('backup-data-btn');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => this.backupData());
        }

        // Update connection status
        window.addEventListener('online', () => this.updateConnectionStatus(true));
        window.addEventListener('offline', () => this.updateConnectionStatus(false));
    }

    updateSyncStatus() {
        const connectionStatus = document.getElementById('connection-status');
        const connectionText = document.getElementById('connection-text');
        const syncStatus = document.getElementById('sync-status');
        const syncText = document.getElementById('sync-text');
        
        if (navigator.onLine) {
            connectionStatus.innerHTML = '<i class="fas fa-wifi text-green-400"></i>';
            connectionText.textContent = 'Online';
            syncStatus.innerHTML = '<i class="fas fa-check-circle text-green-400"></i>';
            syncText.textContent = 'Real-time';
        } else {
            connectionStatus.innerHTML = '<i class="fas fa-wifi-slash text-red-400"></i>';
            connectionText.textContent = 'Offline';
            syncStatus.innerHTML = '<i class="fas fa-exclamation-triangle text-yellow-400"></i>';
            syncText.textContent = 'Local Only';
        }
    }

    updateConnectionStatus(online) {
        this.updateSyncStatus();
        if (online && this.syncManager) {
            this.syncManager.syncPendingChanges();
        }
    }

    async forceSyncData() {
        if (this.syncManager) {
            this.syncManager.showSyncStatus('syncing');
            await this.syncManager.updatePortfolioData(this.data);
            this.updateLastSyncTime();
        }
    }

    backupData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    updateLastSyncTime() {
        const updateTime = document.getElementById('update-time');
        if (updateTime) {
            updateTime.textContent = new Date().toLocaleTimeString();
        }
    }

    refreshAdminUI() {
        // Add visual feedback for real-time updates
        const container = document.querySelector('.container');
        if (container) {
            container.classList.add('data-updated');
            setTimeout(() => container.classList.remove('data-updated'), 500);
        }
        
        // Refresh all admin sections
        this.loadSkillsList();
        this.loadProjectsList();
        this.updateLastSyncTime();
    }

    checkAuth() {
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
        const rememberMe = localStorage.getItem('adminRememberMe');
        
        if (isAuthenticated || (rememberMe && Date.now() < parseInt(rememberMe))) {
            this.isLoggedIn = true;
            this.showAdminContent();
        } else {
            // Redirect to login page instead of showing modal
            window.location.href = 'admin-login.html';
        }
    }

    setupEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // Profile form
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });

        // Profile image upload
        document.getElementById('profile-image').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        // Skills management
        document.getElementById('add-skill-btn').addEventListener('click', () => {
            this.showSkillModal();
        });

        document.getElementById('skill-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSkill();
        });

        document.getElementById('cancel-skill').addEventListener('click', () => {
            this.hideSkillModal();
        });

        // Skill level slider
        document.getElementById('skill-level').addEventListener('input', (e) => {
            document.getElementById('skill-level-display').textContent = e.target.value + '%';
        });

        // Projects management
        document.getElementById('add-project-btn').addEventListener('click', () => {
            this.showProjectModal();
        });

        document.getElementById('project-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProject();
        });

        document.getElementById('cancel-project').addEventListener('click', () => {
            this.hideProjectModal();
        });

        // Project image upload preview
        document.getElementById('project-image').addEventListener('change', (e) => {
            this.handleProjectImagePreview(e);
        });

        // Contact form
        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateContact();
        });

        // Data sync functionality
        document.getElementById('export-data-btn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('import-data-input').addEventListener('change', (e) => {
            this.importData(e);
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple authentication (in a real app, use proper authentication)
        if (username === 'admin' && password === 'gagan123') {
            this.isLoggedIn = true;
            sessionStorage.setItem('adminAuthenticated', 'true');
            this.showAdminContent();
            this.showNotification('Login successful!', 'success');
        } else {
            this.showNotification('Invalid credentials!', 'error');
        }
    }

    handleLogout() {
        this.isLoggedIn = false;
        sessionStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminRememberMe');
        window.location.href = 'admin-login.html';
    }

    showLoginModal() {
        document.getElementById('login-modal').classList.remove('hidden');
        document.getElementById('admin-content').classList.add('hidden');
    }

    showAdminContent() {
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('admin-content').classList.remove('hidden');
        this.loadAllData();
    }

    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.add('hidden');
        });

        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-primary', 'text-white');
            btn.classList.add('bg-dark-bg', 'text-gray-300');
        });

        // Show selected tab
        document.getElementById(`${tabName}-tab`).classList.remove('hidden');
        
        // Add active class to clicked button
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        activeBtn.classList.add('active', 'bg-primary', 'text-white');
        activeBtn.classList.remove('bg-dark-bg', 'text-gray-300');

        this.currentTab = tabName;

        // Load tab-specific data
        switch(tabName) {
            case 'skills':
                this.loadSkills();
                break;
            case 'projects':
                this.loadProjects();
                break;
            case 'messages':
                this.loadMessages();
                break;
        }
    }

    async loadData() {
        const defaultData = {
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
            },
            messages: [],
            stats: {
                profileViews: 1250,
                totalProjects: 2,
                totalSkills: 6,
                totalMessages: 0
            },
            lastUpdated: new Date().toISOString()
        };

        if (this.syncManager) {
            try {
                const cloudData = await this.syncManager.getPortfolioData();
                return cloudData || defaultData;
            } catch (error) {
                console.warn('Failed to load from cloud, using local data');
            }
        }

        const savedData = localStorage.getItem('portfolioData');
        return savedData ? JSON.parse(savedData) : defaultData;
    }

    async saveData() {
        this.data.lastUpdated = new Date().toISOString();
        
        if (this.syncManager) {
            this.syncManager.showSyncStatus('syncing');
            await this.syncManager.updatePortfolioData(this.data);
            this.updateLastSyncTime();
        } else {
            // Fallback to localStorage
            localStorage.setItem('portfolioData', JSON.stringify(this.data));
        }
        
        this.updatePortfolioData();
        
        // Auto-backup for safety
        this.autoBackup();
    }

    generateJSONFile() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'portfolio.json';
        
        // Show notification with download option
        this.showDownloadNotification(link);
    }

    showDownloadNotification(downloadLink) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg bg-blue-600 text-white max-w-sm';
        notification.innerHTML = `
            <div class="flex items-start space-x-3">
                <i class="fas fa-download text-lg mt-1"></i>
                <div class="flex-1">
                    <h4 class="font-semibold mb-2">Data Updated!</h4>
                    <p class="text-sm mb-3">To sync changes across all browsers, download and replace the portfolio.json file in the data folder.</p>
                    <div class="flex space-x-2">
                        <button onclick="this.previousElementSibling.previousElementSibling.click()" class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100">
                            Download JSON
                        </button>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" class="bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-800">
                            Close
                        </button>
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-white/70 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add hidden download link
        notification.appendChild(downloadLink);
        
        document.body.appendChild(notification);
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    autoBackup() {
        // Auto-backup every hour to prevent data loss
        const lastBackup = localStorage.getItem('lastAutoBackup');
        const now = Date.now();
        
        if (!lastBackup || (now - parseInt(lastBackup)) > 3600000) { // 1 hour
            localStorage.setItem('portfolioBackup', JSON.stringify(this.data));
            localStorage.setItem('lastAutoBackup', now.toString());
            console.log('📦 Auto-backup created');
        }
    }

    async loadDashboardData() {
        // Load data from cloud/local storage
        this.data = await this.loadData();
        
        // Update dashboard stats
        document.getElementById('total-projects').textContent = this.data.projects.length;
        document.getElementById('total-skills').textContent = this.data.skills.length;
        document.getElementById('total-messages').textContent = this.data.messages.length;
        document.getElementById('profile-views').textContent = this.data.stats.profileViews;
        
        // Load all sections
        this.loadAllData();
        this.updateLastSyncTime();
    }

    loadAllData() {
        this.loadProfile();
        this.loadContact();
        this.loadDashboardData();
    }

    loadProfile() {
        document.getElementById('profile-name').value = this.data.profile.name;
        document.getElementById('profile-title').value = this.data.profile.title;
        document.getElementById('profile-description').value = this.data.profile.description;
    }

    loadContact() {
        document.getElementById('contact-email').value = this.data.contact.email;
        document.getElementById('contact-phone').value = this.data.contact.phone;
        document.getElementById('contact-location').value = this.data.contact.location;
        document.getElementById('contact-linkedin').value = this.data.contact.linkedin;
        document.getElementById('contact-github').value = this.data.contact.github;
    }

    updateProfile() {
        this.data.profile.name = document.getElementById('profile-name').value;
        this.data.profile.title = document.getElementById('profile-title').value;
        this.data.profile.description = document.getElementById('profile-description').value;
        
        this.saveData();
        this.showNotification('Profile updated successfully!', 'success');
    }

    updateContact() {
        this.data.contact.email = document.getElementById('contact-email').value;
        this.data.contact.phone = document.getElementById('contact-phone').value;
        this.data.contact.location = document.getElementById('contact-location').value;
        this.data.contact.linkedin = document.getElementById('contact-linkedin').value;
        this.data.contact.github = document.getElementById('contact-github').value;
        
        this.saveData();
        this.showNotification('Contact information updated successfully!', 'success');
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.data.profile.image = e.target.result;
                this.saveData();
                document.getElementById('image-name').textContent = file.name;
                this.showNotification('Image uploaded successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    }

    handleProjectImagePreview(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('project-image-preview');
        const previewImg = document.getElementById('project-image-preview-img');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                preview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            preview.classList.add('hidden');
        }
    }

    loadSkills() {
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = '';

        this.data.skills.forEach(skill => {
            const skillElement = document.createElement('div');
            skillElement.className = 'bg-dark-bg p-4 rounded-lg border border-dark-border';
            skillElement.innerHTML = `
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-4">
                        <i class="${skill.icon} text-2xl text-${skill.color}"></i>
                        <div>
                            <span class="font-semibold">${skill.name}</span>
                            <span class="text-sm text-gray-400 ml-2">${skill.level || 50}%</span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="adminPanel.editSkill(${skill.id})" class="bg-yellow-600 text-white px-3 py-1 rounded hover:opacity-90 transition-opacity duration-300">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="adminPanel.deleteSkill(${skill.id})" class="bg-red-600 text-white px-3 py-1 rounded hover:opacity-90 transition-opacity duration-300">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-gradient-to-r from-${skill.color} to-${skill.color} h-2 rounded-full transition-all duration-300" 
                         style="width: ${skill.level || 50}%"></div>
                </div>
            `;
            skillsList.appendChild(skillElement);
        });
    }

    showSkillModal(skillId = null) {
        const modal = document.getElementById('skill-modal');
        modal.classList.remove('hidden');

        if (skillId) {
            const skill = this.data.skills.find(s => s.id === skillId);
            if (skill) {
                document.getElementById('skill-name').value = skill.name;
                document.getElementById('skill-icon').value = skill.icon;
                document.getElementById('skill-color').value = skill.color;
                document.getElementById('skill-level').value = skill.level || 50;
                document.getElementById('skill-level-display').textContent = (skill.level || 50) + '%';
                document.getElementById('skill-form').dataset.skillId = skillId;
            }
        } else {
            document.getElementById('skill-form').reset();
            document.getElementById('skill-level').value = 50;
            document.getElementById('skill-level-display').textContent = '50%';
            delete document.getElementById('skill-form').dataset.skillId;
        }
    }

    hideSkillModal() {
        document.getElementById('skill-modal').classList.add('hidden');
    }

    saveSkill() {
        const form = document.getElementById('skill-form');
        const skillId = form.dataset.skillId;
        const skillData = {
            name: document.getElementById('skill-name').value,
            icon: document.getElementById('skill-icon').value,
            color: document.getElementById('skill-color').value,
            level: parseInt(document.getElementById('skill-level').value)
        };

        if (skillId) {
            // Edit existing skill
            const skillIndex = this.data.skills.findIndex(s => s.id === parseInt(skillId));
            if (skillIndex !== -1) {
                this.data.skills[skillIndex] = { ...this.data.skills[skillIndex], ...skillData };
            }
        } else {
            // Add new skill
            const newSkill = {
                id: Date.now(),
                ...skillData
            };
            this.data.skills.push(newSkill);
        }

        this.saveData();
        this.loadSkills();
        this.loadDashboardData();
        this.hideSkillModal();
        this.showNotification('Skill saved successfully!', 'success');
    }

    editSkill(skillId) {
        this.showSkillModal(skillId);
    }

    deleteSkill(skillId) {
        if (confirm('Are you sure you want to delete this skill?')) {
            this.data.skills = this.data.skills.filter(s => s.id !== skillId);
            this.saveData();
            this.loadSkills();
            this.loadDashboardData();
            this.showNotification('Skill deleted successfully!', 'success');
        }
    }

    loadProjects() {
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '';

        this.data.projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'bg-dark-bg p-4 rounded-lg border border-dark-border';
            projectElement.innerHTML = `
                <div class="flex items-start justify-between gap-4">
                    ${project.image ? `
                        <div class="flex-shrink-0">
                            <img src="${project.image}" alt="${project.name}" class="w-20 h-20 object-cover rounded-lg border border-dark-border">
                        </div>
                    ` : ''}
                    <div class="flex-1">
                        <h4 class="font-semibold text-lg mb-2">${project.name}</h4>
                        <p class="text-gray-400 mb-2">${project.description}</p>
                        <div class="flex flex-wrap gap-2 mb-2">
                            ${project.technologies.map(tech => `<span class="bg-primary/20 text-primary px-2 py-1 rounded text-sm">${tech}</span>`).join('')}
                        </div>
                        <div class="flex space-x-4 text-sm">
                            <span class="bg-secondary/20 text-secondary px-2 py-1 rounded">${project.category}</span>
                            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="text-blue-400 hover:underline">Live Demo</a>` : ''}
                            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="text-blue-400 hover:underline">GitHub</a>` : ''}
                        </div>
                    </div>
                    <div class="flex space-x-2 ml-4">
                        <button onclick="adminPanel.editProject(${project.id})" class="bg-yellow-600 text-white px-3 py-1 rounded hover:opacity-90 transition-opacity duration-300">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="adminPanel.deleteProject(${project.id})" class="bg-red-600 text-white px-3 py-1 rounded hover:opacity-90 transition-opacity duration-300">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            projectsList.appendChild(projectElement);
        });
    }

    showProjectModal(projectId = null) {
        const modal = document.getElementById('project-modal');
        const preview = document.getElementById('project-image-preview');
        const previewImg = document.getElementById('project-image-preview-img');
        
        modal.classList.remove('hidden');

        if (projectId) {
            const project = this.data.projects.find(p => p.id === projectId);
            if (project) {
                document.getElementById('project-name').value = project.name;
                document.getElementById('project-category').value = project.category;
                document.getElementById('project-description').value = project.description;
                document.getElementById('project-live').value = project.liveUrl || '';
                document.getElementById('project-github').value = project.githubUrl || '';
                document.getElementById('project-technologies').value = project.technologies.join(', ');
                document.getElementById('project-form').dataset.projectId = projectId;
                
                // Show existing image if available
                if (project.image) {
                    previewImg.src = project.image;
                    preview.classList.remove('hidden');
                } else {
                    preview.classList.add('hidden');
                }
            }
        } else {
            document.getElementById('project-form').reset();
            delete document.getElementById('project-form').dataset.projectId;
            preview.classList.add('hidden');
        }
    }

    hideProjectModal() {
        document.getElementById('project-modal').classList.add('hidden');
        // Clear image preview
        document.getElementById('project-image-preview').classList.add('hidden');
    }

    saveProject() {
        const form = document.getElementById('project-form');
        const projectId = form.dataset.projectId;
        const imageInput = document.getElementById('project-image');
        
        // Handle image upload
        let imageUrl = '';
        if (imageInput.files && imageInput.files[0]) {
            const file = imageInput.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                imageUrl = e.target.result; // Base64 data URL
                this.saveProjectData(projectId, imageUrl);
            };
            
            reader.readAsDataURL(file);
        } else {
            // No new image selected, use existing image if editing
            if (projectId) {
                const existingProject = this.data.projects.find(p => p.id === parseInt(projectId));
                imageUrl = existingProject ? existingProject.image : '';
            }
            this.saveProjectData(projectId, imageUrl);
        }
    }
    
    saveProjectData(projectId, imageUrl) {
        const projectData = {
            name: document.getElementById('project-name').value,
            category: document.getElementById('project-category').value,
            description: document.getElementById('project-description').value,
            liveUrl: document.getElementById('project-live').value,
            githubUrl: document.getElementById('project-github').value,
            technologies: document.getElementById('project-technologies').value.split(',').map(t => t.trim()),
            image: imageUrl
        };

        if (projectId) {
            // Edit existing project
            const projectIndex = this.data.projects.findIndex(p => p.id === parseInt(projectId));
            if (projectIndex !== -1) {
                this.data.projects[projectIndex] = { ...this.data.projects[projectIndex], ...projectData };
            }
        } else {
            // Add new project
            const newProject = {
                id: Date.now(),
                ...projectData
            };
            this.data.projects.push(newProject);
        }

        this.saveData();
        this.loadProjects();
        this.loadDashboardData();
        this.hideProjectModal();
        this.showNotification('Project saved successfully!', 'success');
    }

    editProject(projectId) {
        this.showProjectModal(projectId);
    }

    deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            this.data.projects = this.data.projects.filter(p => p.id !== projectId);
            this.saveData();
            this.loadProjects();
            this.loadDashboardData();
            this.showNotification('Project deleted successfully!', 'success');
        }
    }

    loadMessages() {
        const messagesList = document.getElementById('messages-list');
        messagesList.innerHTML = '';

        if (this.data.messages.length === 0) {
            messagesList.innerHTML = '<div class="text-center text-gray-400 py-8">No messages yet.</div>';
            return;
        }

        this.data.messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = 'bg-dark-bg p-4 rounded-lg border border-dark-border';
            messageElement.innerHTML = `
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold text-lg mb-2">${message.name}</h4>
                        <p class="text-gray-400 mb-2">${message.email}</p>
                        <p class="text-gray-300 mb-2">${message.message}</p>
                        <span class="text-sm text-gray-500">${new Date(message.timestamp).toLocaleString()}</span>
                    </div>
                    <button onclick="adminPanel.deleteMessage(${message.id})" class="bg-red-600 text-white px-3 py-1 rounded hover:opacity-90 transition-opacity duration-300">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            messagesList.appendChild(messageElement);
        });
    }

    deleteMessage(messageId) {
        if (confirm('Are you sure you want to delete this message?')) {
            this.data.messages = this.data.messages.filter(m => m.id !== messageId);
            this.saveData();
            this.loadMessages();
            this.loadDashboardData();
            this.showNotification('Message deleted successfully!', 'success');
        }
    }

    updatePortfolioData() {
        // This function would update the main portfolio website
        // In a real application, this would make an API call to update the database
        console.log('Portfolio data updated:', this.data);
    }

    showNotification(message, type = 'success') {
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

    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'portfolio.json';
        link.click();
        
        this.showNotification('Portfolio data exported successfully!', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate data structure
                if (this.validateDataStructure(importedData)) {
                    this.data = importedData;
                    this.saveData();
                    this.loadDashboardData();
                    this.loadProfile();
                    this.loadSkills();
                    this.loadProjects();
                    this.loadContactInfo();
                    
                    this.showNotification('Portfolio data imported successfully!', 'success');
                } else {
                    this.showNotification('Invalid JSON file format!', 'error');
                }
            } catch (error) {
                console.error('Error importing data:', error);
                this.showNotification('Error reading JSON file!', 'error');
            }
        };
        reader.readAsText(file);
    }

    validateDataStructure(data) {
        // Basic validation to ensure required fields exist
        return data && 
               data.profile && 
               data.skills && 
               data.projects && 
               data.contact &&
               Array.isArray(data.skills) &&
               Array.isArray(data.projects);
    }

    // ...existing code...
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
