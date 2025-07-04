# Gagan Kumar Portfolio Website

A modern, responsive portfolio website with an integrated admin panel for easy content management.

## 🔐 Quick Admin Access

**Admin Panel URL**: `admin.html`
**Login Credentials**:
- **Username**: `admin`
- **Password**: `gagan123`

**Quick Access Methods**:
1. **Direct URL**: Navigate to `admin.html`
2. **Secret Shortcut**: Press `Ctrl + Alt + A` on main page
3. **Console Info**: Press F12 and check console for details

## Features

### Portfolio Website
- **Modern Design**: Dark theme with neon accents and glassmorphism effects
- **Responsive Layout**: Works perfectly on all devices
- **Dynamic Content**: Content can be updated via admin panel
- **Interactive Elements**: Smooth animations and hover effects
- **Skills Section**: Dynamically loaded from admin panel
- **Projects Section**: Filterable project showcase
- **Contact Form**: Integrated with admin panel for message management

### Admin Panel
- **Secure Login**: Simple authentication system
- **Profile Management**: Update name, title, description, and profile image
- **Skills Management**: Add, edit, and delete skills with icons and colors
- **Projects Management**: Complete CRUD operations for projects
- **Contact Information**: Update contact details and social links
- **Message Management**: View and manage contact form submissions
- **Dashboard**: Overview of portfolio statistics

## Getting Started

### Files Structure
```
portfolio/
├── index.html          # Main portfolio page
├── admin.html          # Admin panel
├── api.php            # Backend API (optional)
├── js/
│   ├── main.js        # Main portfolio JavaScript
│   └── admin.js       # Admin panel JavaScript
├── css/
│   ├── style.css      # Custom styles
│   └── responsive.css # Responsive styles
└── img/
    └── IMG_20250629_175830.png # Profile image
```

### Setup Instructions

1. **Clone or download** the project files
2. **Open index.html** in your browser to view the portfolio
3. **Access admin panel** in any of these ways:
   - Direct URL: Open `admin.html` in your browser
   - Hidden button: Press `Ctrl + Alt + A` to show/hide admin button
   - Console: Check browser console for admin info
4. **Default login credentials**:
   - **Username**: `admin`
   - **Password**: `gagan123`

### Admin Panel Usage

#### How to Access Admin Panel
**Method 1**: Direct URL
- Type `admin.html` in your browser address bar after your domain
- Example: `http://localhost/portfolio/admin.html`

**Method 2**: Secret Keyboard Shortcut
- On the main portfolio page, press `Ctrl + Alt + A`
- A red gear button will appear in the top-left corner
- Click it to open the admin panel

**Method 3**: Browser Console
- Press F12 to open developer tools
- Check the console for admin panel information

#### Login
1. Open `admin.html` in your browser
2. Enter the default credentials
3. Click "Login" to access the admin panel

#### Managing Profile
1. Go to the "Profile" tab
2. Update your name, title, and description
3. Upload a new profile image if needed
4. Click "Update Profile" to save changes

#### Managing Skills
1. Go to the "Skills" tab
2. Click "Add Skill" to add new skills
3. Enter skill name, Font Awesome icon class, and color
4. Use the edit/delete buttons to modify existing skills

#### Managing Projects
1. Go to the "Projects" tab
2. Click "Add Project" to create new projects
3. Fill in project details:
   - Name and description
   - Category (Web, Mobile, Desktop, Design)
   - Technologies used
   - Live URL and GitHub URL
   - Project image (optional)
4. Use edit/delete buttons to modify existing projects

#### Managing Contact Information
1. Go to the "Contact Info" tab
2. Update your email, phone, location
3. Update social media links
4. Click "Update Contact Info" to save

#### Viewing Messages
1. Go to the "Messages" tab
2. View all contact form submissions
3. Delete messages as needed

## Customization

### Adding New Skills
Popular skill icons and their Font Awesome classes:
- Python: `fab fa-python`
- JavaScript: `fab fa-js`
- React: `fab fa-react`
- Node.js: `fab fa-node-js`
- HTML5: `fab fa-html5`
- CSS3: `fab fa-css3-alt`
- Git: `fab fa-git-alt`
- Docker: `fab fa-docker`
- AWS: `fab fa-aws`

### Color Options
Available color classes:
- `orange-500` - Orange
- `blue-500` - Blue
- `yellow-500` - Yellow
- `cyan-500` - Cyan
- `green-500` - Green
- `purple-500` - Purple
- `red-500` - Red
- `pink-500` - Pink

### Project Categories
- `web` - Web Applications
- `mobile` - Mobile Apps
- `desktop` - Desktop Applications
- `design` - UI/UX Design

## Featured Projects

### 1. Telegram Remote Desktop
- **Category**: Desktop Application
- **Technologies**: Python, Telegram Bot API, PyAutoGUI, PIL
- **Description**: A Python-based remote desktop application that allows users to control their computer remotely through Telegram bot commands.

### 2. Desktop Voice Assistant
- **Category**: Desktop Application
- **Technologies**: Python, Speech Recognition, pyttsx3, OpenAI API
- **Description**: An AI-powered desktop voice assistant built with Python that can perform various tasks like web browsing, system control, and answering questions.

## Technologies Used

### Frontend
- HTML5, CSS3, JavaScript
- Tailwind CSS for styling
- Font Awesome for icons
- Google Fonts (Inter)

### Backend (Optional)
- PHP for API endpoints
- JSON for data storage
- Local storage for client-side persistence

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Local Development
1. Use a local server (XAMPP, WAMP, or simple HTTP server)
2. Place files in the web server directory
3. Access via `http://localhost/portfolio/`

## Production Deployment
1. Upload files to your web hosting service
2. Ensure PHP is enabled if using the API
3. Set proper file permissions
4. Update API endpoints if needed

## Security Notes
- Change the default admin credentials
- Use HTTPS in production
- Implement proper authentication for production use
- Regularly backup your data

## Support
For any issues or questions, please contact the developer through the portfolio contact form.

## License
This project is open source and available under the MIT License.