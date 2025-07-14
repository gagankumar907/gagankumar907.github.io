// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.isLoggedIn = false;
        this.currentTab = 'profile';
        this.data = {};
        this.apiBase = window.location.hostname === 'localhost' ? 'http://localhost:8000/api.php' : './api.php';
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadDataFromAPI();
    }

    async checkAuth() {
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
            this.updateProfileAPI();
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
            this.saveSkillAPI();
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
            this.saveProjectAPI();
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
            this.updateContactAPI();
        });
    }

    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${this.apiBase}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (result.success) {
                this.isLoggedIn = true;
                sessionStorage.setItem('adminAuthenticated', 'true');
                this.showAdminContent();
                this.showNotification('Login successful!', 'success');
            } else {
                this.showNotification('Invalid credentials!', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Login failed. Please try again.', 'error');
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
        this.loadDataFromAPI();
    }

    // API Methods
    async loadDataFromAPI() {
        try {
            const response = await fetch(`${this.apiBase}/data`);
            if (response.ok) {
                this.data = await response.json();
                this.loadAllData();
                this.loadDashboardData();
            } else {
                this.showNotification('Failed to load data from server', 'error');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.showNotification('Error connecting to server', 'error');
        }
    }

    async updateProfileAPI() {
        const profileData = {
            name: document.getElementById('profile-name').value,
            title: document.getElementById('profile-title').value,
            description: document.getElementById('profile-description').value
        };

        try {
            const response = await fetch(`${this.apiBase}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            const result = await response.json();

            if (result.success) {
                this.data.profile = { ...this.data.profile, ...profileData };
                this.showNotification('Profile updated successfully!', 'success');
            } else {
                this.showNotification('Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showNotification('Error updating profile', 'error');
        }
    }

    async updateContactAPI() {
        const contactData = {
            email: document.getElementById('contact-email').value,
            phone: document.getElementById('contact-phone').value,
            location: document.getElementById('contact-location').value,
            linkedin: document.getElementById('contact-linkedin').value,
            github: document.getElementById('contact-github').value
        };

        try {
            const response = await fetch(`${this.apiBase}/contact`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactData)
            });

            const result = await response.json();

            if (result.success) {
                this.data.contact = { ...this.data.contact, ...contactData };
                this.showNotification('Contact information updated successfully!', 'success');
            } else {
                this.showNotification('Failed to update contact information', 'error');
            }
        } catch (error) {
            console.error('Error updating contact:', error);
            this.showNotification('Error updating contact information', 'error');
        }
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
                this.loadSkillsFromAPI();
                break;
            case 'projects':
                this.loadProjectsFromAPI();
                break;
            case 'messages':
                this.loadMessagesFromAPI();
                break;
        }
    }

    loadDashboardData() {
        if (this.data.projects && this.data.skills && this.data.messages && this.data.stats) {
            document.getElementById('total-projects').textContent = this.data.projects.length;
            document.getElementById('total-skills').textContent = this.data.skills.length;
            document.getElementById('total-messages').textContent = this.data.messages.length;
            document.getElementById('profile-views').textContent = this.data.stats.profileViews || 0;
        }
    }

    loadAllData() {
        this.loadProfile();
        this.loadContact();
        this.loadDashboardData();
    }

    loadProfile() {
        if (this.data.profile) {
            document.getElementById('profile-name').value = this.data.profile.name || '';
            document.getElementById('profile-title').value = this.data.profile.title || '';
            document.getElementById('profile-description').value = this.data.profile.description || '';
        }
    }

    loadContact() {
        if (this.data.contact) {
            document.getElementById('contact-email').value = this.data.contact.email || '';
            document.getElementById('contact-phone').value = this.data.contact.phone || '';
            document.getElementById('contact-location').value = this.data.contact.location || '';
            document.getElementById('contact-linkedin').value = this.data.contact.linkedin || '';
            document.getElementById('contact-github').value = this.data.contact.github || '';
        }
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

    async loadSkillsFromAPI() {
        try {
            const response = await fetch(`${this.apiBase}/skills`);
            if (response.ok) {
                this.data.skills = await response.json();
                this.renderSkills();
            }
        } catch (error) {
            console.error('Error loading skills:', error);
        }
    }

    renderSkills() {
        const skillsList = document.getElementById('skills-list');
        if (!skillsList) return;
        
        skillsList.innerHTML = '';

        if (!this.data.skills || this.data.skills.length === 0) {
            skillsList.innerHTML = '<div class="text-center text-gray-400 py-8">No skills added yet.</div>';
            return;
        }

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
                        <button onclick="adminPanel.deleteSkillAPI(${skill.id})" class="bg-red-600 text-white px-3 py-1 rounded hover:opacity-90 transition-opacity duration-300">
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

    editSkill(skillId) {
        this.showSkillModal(skillId);
    }

    hideSkillModal() {
        document.getElementById('skill-modal').classList.add('hidden');
    }

    async saveSkillAPI() {
        const form = document.getElementById('skill-form');
        const skillId = form.dataset.skillId;
        const skillData = {
            name: document.getElementById('skill-name').value,
            icon: document.getElementById('skill-icon').value,
            color: document.getElementById('skill-color').value,
            level: parseInt(document.getElementById('skill-level').value)
        };

        try {
            let response;
            if (skillId) {
                // Update existing skill
                response = await fetch(`${this.apiBase}/skills/${skillId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(skillData)
                });
            } else {
                // Add new skill
                response = await fetch(`${this.apiBase}/skills`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(skillData)
                });
            }

            const result = await response.json();

            if (result.success) {
                this.loadSkillsFromAPI();
                this.loadDashboardData();
                this.hideSkillModal();
                this.showNotification('Skill saved successfully!', 'success');
            } else {
                this.showNotification('Failed to save skill', 'error');
            }
        } catch (error) {
            console.error('Error saving skill:', error);
            this.showNotification('Error saving skill', 'error');
        }
    }

    async deleteSkillAPI(skillId) {
        if (confirm('Are you sure you want to delete this skill?')) {
            try {
                const response = await fetch(`${this.apiBase}/skills/${skillId}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    this.loadSkillsFromAPI();
                    this.loadDashboardData();
                    this.showNotification('Skill deleted successfully!', 'success');
                } else {
                    this.showNotification('Failed to delete skill', 'error');
                }
            } catch (error) {
                console.error('Error deleting skill:', error);
                this.showNotification('Error deleting skill', 'error');
            }
        }
    }

    async loadProjectsFromAPI() {
        try {
            const response = await fetch(`${this.apiBase}/projects`);
            if (response.ok) {
                this.data.projects = await response.json();
                this.renderProjects();
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    renderProjects() {
        const projectsList = document.getElementById('projects-list');
        if (!projectsList) return;
        
        projectsList.innerHTML = '';

        if (!this.data.projects || this.data.projects.length === 0) {
            projectsList.innerHTML = '<div class="text-center text-gray-400 py-8">No projects added yet.</div>';
            return;
        }

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
                        <button onclick="adminPanel.deleteProjectAPI(${project.id})" class="bg-red-600 text-white px-3 py-1 rounded hover:opacity-90 transition-opacity duration-300">
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

    async saveProjectAPI() {
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
                this.saveProjectDataAPI(projectId, imageUrl);
            };
            
            reader.readAsDataURL(file);
        } else {
            // No new image selected, use existing image if editing
            if (projectId) {
                const existingProject = this.data.projects.find(p => p.id === parseInt(projectId));
                imageUrl = existingProject ? existingProject.image : '';
            }
            this.saveProjectDataAPI(projectId, imageUrl);
        }
    }
    
    async saveProjectDataAPI(projectId, imageUrl) {
        const projectData = {
            name: document.getElementById('project-name').value,
            category: document.getElementById('project-category').value,
            description: document.getElementById('project-description').value,
            liveUrl: document.getElementById('project-live').value,
            githubUrl: document.getElementById('project-github').value,
            technologies: document.getElementById('project-technologies').value.split(',').map(t => t.trim()),
            image: imageUrl
        };

        try {
            let response;
            if (projectId) {
                // Update existing project
                response = await fetch(`${this.apiBase}/projects/${projectId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(projectData)
                });
            } else {
                // Add new project
                response = await fetch(`${this.apiBase}/projects`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(projectData)
                });
            }

            const result = await response.json();

            if (result.success) {
                this.loadProjectsFromAPI();
                this.loadDashboardData();
                this.hideProjectModal();
                this.showNotification('Project saved successfully!', 'success');
            } else {
                this.showNotification('Failed to save project', 'error');
            }
        } catch (error) {
            console.error('Error saving project:', error);
            this.showNotification('Error saving project', 'error');
        }
    }

    async deleteProjectAPI(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                const response = await fetch(`${this.apiBase}/projects/${projectId}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    this.loadProjectsFromAPI();
                    this.loadDashboardData();
                    this.showNotification('Project deleted successfully!', 'success');
                } else {
                    this.showNotification('Failed to delete project', 'error');
                }
            } catch (error) {
                console.error('Error deleting project:', error);
                this.showNotification('Error deleting project', 'error');
            }
        }
    }

    editProject(projectId) {
        this.showProjectModal(projectId);
    }

    async loadMessagesFromAPI() {
        try {
            const response = await fetch(`${this.apiBase}/messages`);
            if (response.ok) {
                this.data.messages = await response.json();
                this.renderMessages();
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    renderMessages() {
        const messagesList = document.getElementById('messages-list');
        if (!messagesList) return;
        
        messagesList.innerHTML = '';

        if (!this.data.messages || this.data.messages.length === 0) {
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
                        <span class="text-sm text-gray-500">${new Date(message.timestamp * 1000).toLocaleString()}</span>
                    </div>
                    <button onclick="adminPanel.deleteMessageAPI(${message.id})" class="bg-red-600 text-white px-3 py-1 rounded hover:opacity-90 transition-opacity duration-300">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            messagesList.appendChild(messageElement);
        });
    }

    async deleteMessageAPI(messageId) {
        if (confirm('Are you sure you want to delete this message?')) {
            try {
                const response = await fetch(`${this.apiBase}/messages/${messageId}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    this.loadMessagesFromAPI();
                    this.loadDashboardData();
                    this.showNotification('Message deleted successfully!', 'success');
                } else {
                    this.showNotification('Failed to delete message', 'error');
                }
            } catch (error) {
                console.error('Error deleting message:', error);
                this.showNotification('Error deleting message', 'error');
            }
        }
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
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
