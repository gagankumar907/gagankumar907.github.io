# Portfolio Website with Admin Panel - CRUD Implementation

## Features

✅ **Complete CRUD Operations**: Create, Read, Update, Delete for all content
✅ **Backend API**: PHP-based REST API with JSON file storage
✅ **Admin Panel**: Full-featured admin interface for content management
✅ **Real-time Sync**: Changes in admin panel instantly reflect on frontend
✅ **Persistent Storage**: All data permanently stored in backend
✅ **Contact Form Integration**: Contact messages saved to backend
✅ **Authentication**: Secure admin login system

## How It Works

### 1. Backend API (api.php)
- **REST API endpoints** for all CRUD operations
- **JSON file storage** in `data/portfolio.json`
- **Authentication system** for admin access
- **Cross-origin support** for development and production

### 2. Admin Panel
- **Login**: Username: `admin`, Password: `gagan123`
- **Profile Management**: Update name, title, description
- **Skills Management**: Add, edit, delete skills with icons and colors
- **Projects Management**: Add, edit, delete projects with images
- **Contact Information**: Update contact details
- **Messages**: View and delete contact form messages
- **Dashboard**: Real-time statistics

### 3. Frontend Integration
- **API-first approach**: Frontend loads data from API
- **Fallback system**: Uses localStorage if API fails
- **Real-time updates**: Changes appear immediately on website
- **Contact form**: Saves messages directly to backend

## API Endpoints

### Authentication
- `POST /api.php/auth` - Admin login

### Data Management
- `GET /api.php/data` - Get all data
- `GET /api.php/profile` - Get profile data
- `PUT /api.php/profile` - Update profile data
- `GET /api.php/contact` - Get contact info
- `PUT /api.php/contact` - Update contact info

### Skills Management
- `GET /api.php/skills` - Get all skills
- `POST /api.php/skills` - Add new skill
- `PUT /api.php/skills/{id}` - Update skill
- `DELETE /api.php/skills/{id}` - Delete skill

### Projects Management
- `GET /api.php/projects` - Get all projects
- `POST /api.php/projects` - Add new project
- `PUT /api.php/projects/{id}` - Update project
- `DELETE /api.php/projects/{id}` - Delete project

### Messages Management
- `GET /api.php/messages` - Get all messages
- `POST /api.php/contact-form` - Save contact message
- `DELETE /api.php/messages/{id}` - Delete message

## Setup Instructions

### 1. Local Development
```bash
# Start PHP development server
cd /path/to/portfolio
php -S localhost:8000

# Access website: http://localhost:8000
# Access admin: http://localhost:8000/admin-login.html
```

### 2. Production Deployment
- Ensure `data/` directory has write permissions (755)
- Configure `.htaccess` for proper API routing
- Update `apiBase` URLs in JavaScript files if needed

### 3. File Structure
```
portfolio/
├── api.php              # Backend API
├── data/
│   └── portfolio.json   # Data storage
├── admin-login.html     # Admin login page
├── admin.html          # Admin panel
├── index.html          # Main website
├── js/
│   ├── admin.js        # Admin panel functionality
│   └── main.js         # Frontend functionality
└── .htaccess           # API routing configuration
```

## Admin Panel Usage

### 1. Login
- Visit `/admin-login.html`
- Username: `admin`
- Password: `gagan123`

### 2. Managing Content

#### Profile Section
- Update personal information
- Change title and description
- Upload profile image

#### Skills Section
- Add new skills with Font Awesome icons
- Set skill levels (percentage)
- Choose colors for skill display
- Edit or delete existing skills

#### Projects Section
- Add new projects with descriptions
- Upload project images
- Set technologies used
- Add live demo and GitHub links
- Categorize projects

#### Contact Section
- Update email, phone, location
- Set social media links

#### Messages Section
- View contact form submissions
- Delete unwanted messages

### 3. Real-time Updates
- All changes are immediately saved to backend
- Frontend automatically reflects changes
- No manual refresh needed

## Testing CRUD Operations

### Using Admin Panel
1. **Create**: Use "Add" buttons in each section
2. **Read**: Data automatically loads from API
3. **Update**: Click edit buttons to modify existing items
4. **Delete**: Click delete buttons to remove items

### Using API Directly
```bash
# Test data retrieval
curl -X GET "http://localhost:8000/api.php/data"

# Test authentication
curl -X POST "http://localhost:8000/api.php/auth" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"gagan123"}'

# Test adding a skill
curl -X POST "http://localhost:8000/api.php/skills" \
  -H "Content-Type: application/json" \
  -d '{"name":"Vue.js","icon":"fab fa-vuejs","color":"green-500"}'
```

## Security Notes

- Change default admin credentials in production
- Implement proper password hashing
- Add rate limiting for API endpoints
- Use HTTPS in production
- Validate and sanitize all inputs

## Troubleshooting

### Common Issues
1. **API not working**: Check PHP server is running
2. **Data not saving**: Verify `data/` directory permissions
3. **Admin login fails**: Confirm credentials in `api.php`
4. **Frontend not updating**: Check browser console for API errors

### Debug Mode
- Check browser developer tools for API calls
- Monitor PHP server logs for errors
- Verify JSON file structure in `data/portfolio.json`

## Customization

### Adding New Data Types
1. Update data structure in `api.php`
2. Add corresponding API endpoints
3. Create admin panel interface
4. Update frontend rendering

### Changing Credentials
Edit the authentication method in `api.php`:
```php
private function authenticate($input) {
    if ($input['username'] === 'your_username' && $input['password'] === 'your_password') {
        return ['success' => true, 'token' => 'dummy-token'];
    }
    return ['success' => false, 'message' => 'Invalid credentials'];
}
```

## Features Summary

🎯 **Complete CRUD**: All operations work seamlessly
🔄 **Real-time Sync**: Instant updates between admin and frontend  
💾 **Persistent Storage**: Data permanently saved in backend
🔐 **Secure Admin**: Password-protected admin access
📱 **Responsive Design**: Works on all devices
🚀 **API-Ready**: RESTful API for easy integration
📊 **Analytics Dashboard**: Track visits and content stats
✉️ **Contact Management**: Handle visitor messages
🎨 **Rich Content**: Support for images, links, and formatting
