<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

class PortfolioAPI {
    private $dataFile = 'data/portfolio.json';
    
    public function __construct() {
        if (!file_exists('data')) {
            mkdir('data', 0755, true);
        }
        
        if (!file_exists($this->dataFile)) {
            $this->initializeData();
        }
    }
    
    private function initializeData() {
        $defaultData = [
            'profile' => [
                'name' => 'Gagan Kumar',
                'title' => 'Python | Full Stack Developer',
                'description' => 'Crafting digital experiences with cutting-edge technologies. Specialized in building scalable web applications that push the boundaries of innovation.',
                'image' => 'img/IMG_20250629_175830.png'
            ],
            'skills' => [
                ['id' => 1, 'name' => 'Python', 'icon' => 'fab fa-python', 'color' => 'yellow-500'],
                ['id' => 2, 'name' => 'JavaScript', 'icon' => 'fab fa-js', 'color' => 'yellow-500'],
                ['id' => 3, 'name' => 'React', 'icon' => 'fab fa-react', 'color' => 'blue-500'],
                ['id' => 4, 'name' => 'Node.js', 'icon' => 'fab fa-node-js', 'color' => 'green-500'],
                ['id' => 5, 'name' => 'Django', 'icon' => 'fab fa-python', 'color' => 'green-500'],
                ['id' => 6, 'name' => 'MongoDB', 'icon' => 'fas fa-database', 'color' => 'green-500']
            ],
            'projects' => [
                [
                    'id' => 1,
                    'name' => 'Telegram Remote Desktop',
                    'category' => 'desktop',
                    'description' => 'A Python-based remote desktop application that allows users to control their computer remotely through Telegram bot commands.',
                    'technologies' => ['Python', 'Telegram Bot API', 'PyAutoGUI', 'PIL'],
                    'liveUrl' => '',
                    'githubUrl' => 'https://github.com/gaganrai-github/telegram-remote-desktop',
                    'image' => ''
                ],
                [
                    'id' => 2,
                    'name' => 'Desktop Voice Assistant',
                    'category' => 'desktop',
                    'description' => 'An AI-powered desktop voice assistant built with Python that can perform various tasks like web browsing, system control, and answering questions.',
                    'technologies' => ['Python', 'Speech Recognition', 'pyttsx3', 'OpenAI API'],
                    'liveUrl' => '',
                    'githubUrl' => 'https://github.com/gaganrai-github/voice-assistant',
                    'image' => ''
                ]
            ],
            'contact' => [
                'email' => 'gagan@example.com',
                'phone' => '+91 9876543210',
                'location' => 'India',
                'linkedin' => 'https://linkedin.com/in/gagan-kumar',
                'github' => 'https://github.com/gagan-kumar'
            ],
            'messages' => [],
            'stats' => [
                'profileViews' => 1250,
                'totalProjects' => 2,
                'totalSkills' => 6,
                'totalMessages' => 0
            ]
        ];
        
        file_put_contents($this->dataFile, json_encode($defaultData, JSON_PRETTY_PRINT));
    }
    
    private function getData() {
        return json_decode(file_get_contents($this->dataFile), true);
    }
    
    private function saveData($data) {
        return file_put_contents($this->dataFile, json_encode($data, JSON_PRETTY_PRINT));
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = $_SERVER['PATH_INFO'] ?? '/';
        
        switch ($method) {
            case 'GET':
                return $this->handleGet($path);
            case 'POST':
                return $this->handlePost($path);
            case 'PUT':
                return $this->handlePut($path);
            case 'DELETE':
                return $this->handleDelete($path);
            default:
                http_response_code(405);
                return ['error' => 'Method not allowed'];
        }
    }
    
    private function handleGet($path) {
        $data = $this->getData();
        
        switch ($path) {
            case '/':
            case '/data':
                return $data;
            case '/profile':
                return $data['profile'];
            case '/skills':
                return $data['skills'];
            case '/projects':
                return $data['projects'];
            case '/contact':
                return $data['contact'];
            case '/messages':
                return $data['messages'];
            case '/stats':
                return $data['stats'];
            default:
                http_response_code(404);
                return ['error' => 'Not found'];
        }
    }
    
    private function handlePost($path) {
        $input = json_decode(file_get_contents('php://input'), true);
        $data = $this->getData();
        
        switch ($path) {
            case '/auth':
                return $this->authenticate($input);
            case '/contact-form':
                return $this->saveContactMessage($input);
            case '/skills':
                return $this->addSkill($input);
            case '/projects':
                return $this->addProject($input);
            default:
                http_response_code(404);
                return ['error' => 'Not found'];
        }
    }
    
    private function handlePut($path) {
        $input = json_decode(file_get_contents('php://input'), true);
        $data = $this->getData();
        
        switch ($path) {
            case '/profile':
                $data['profile'] = array_merge($data['profile'], $input);
                $this->saveData($data);
                return ['success' => true, 'message' => 'Profile updated'];
            case '/contact':
                $data['contact'] = array_merge($data['contact'], $input);
                $this->saveData($data);
                return ['success' => true, 'message' => 'Contact info updated'];
            default:
                if (preg_match('/^\/skills\/(\d+)$/', $path, $matches)) {
                    return $this->updateSkill($matches[1], $input);
                }
                if (preg_match('/^\/projects\/(\d+)$/', $path, $matches)) {
                    return $this->updateProject($matches[1], $input);
                }
                http_response_code(404);
                return ['error' => 'Not found'];
        }
    }
    
    private function handleDelete($path) {
        if (preg_match('/^\/skills\/(\d+)$/', $path, $matches)) {
            return $this->deleteSkill($matches[1]);
        }
        if (preg_match('/^\/projects\/(\d+)$/', $path, $matches)) {
            return $this->deleteProject($matches[1]);
        }
        if (preg_match('/^\/messages\/(\d+)$/', $path, $matches)) {
            return $this->deleteMessage($matches[1]);
        }
        
        http_response_code(404);
        return ['error' => 'Not found'];
    }
    
    private function authenticate($input) {
        // Simple authentication - in production, use proper password hashing
        if ($input['username'] === 'admin' && $input['password'] === 'gagan123') {
            return ['success' => true, 'token' => 'dummy-token'];
        }
        return ['success' => false, 'message' => 'Invalid credentials'];
    }
    
    private function saveContactMessage($input) {
        $data = $this->getData();
        $message = [
            'id' => time(),
            'name' => $input['name'],
            'email' => $input['email'],
            'subject' => $input['subject'],
            'message' => $input['message'],
            'timestamp' => time()
        ];
        
        $data['messages'][] = $message;
        $data['stats']['totalMessages']++;
        $this->saveData($data);
        
        return ['success' => true, 'message' => 'Message sent successfully'];
    }
    
    private function addSkill($input) {
        $data = $this->getData();
        $skill = [
            'id' => time(),
            'name' => $input['name'],
            'icon' => $input['icon'],
            'color' => $input['color']
        ];
        
        $data['skills'][] = $skill;
        $data['stats']['totalSkills']++;
        $this->saveData($data);
        
        return ['success' => true, 'message' => 'Skill added successfully'];
    }
    
    private function updateSkill($id, $input) {
        $data = $this->getData();
        $skillIndex = array_search($id, array_column($data['skills'], 'id'));
        
        if ($skillIndex !== false) {
            $data['skills'][$skillIndex] = array_merge($data['skills'][$skillIndex], $input);
            $this->saveData($data);
            return ['success' => true, 'message' => 'Skill updated successfully'];
        }
        
        return ['success' => false, 'message' => 'Skill not found'];
    }
    
    private function deleteSkill($id) {
        $data = $this->getData();
        $skillIndex = array_search($id, array_column($data['skills'], 'id'));
        
        if ($skillIndex !== false) {
            array_splice($data['skills'], $skillIndex, 1);
            $data['stats']['totalSkills']--;
            $this->saveData($data);
            return ['success' => true, 'message' => 'Skill deleted successfully'];
        }
        
        return ['success' => false, 'message' => 'Skill not found'];
    }
    
    private function addProject($input) {
        $data = $this->getData();
        $project = [
            'id' => time(),
            'name' => $input['name'],
            'category' => $input['category'],
            'description' => $input['description'],
            'technologies' => $input['technologies'],
            'liveUrl' => $input['liveUrl'] ?? '',
            'githubUrl' => $input['githubUrl'] ?? '',
            'image' => $input['image'] ?? ''
        ];
        
        $data['projects'][] = $project;
        $data['stats']['totalProjects']++;
        $this->saveData($data);
        
        return ['success' => true, 'message' => 'Project added successfully'];
    }
    
    private function updateProject($id, $input) {
        $data = $this->getData();
        $projectIndex = array_search($id, array_column($data['projects'], 'id'));
        
        if ($projectIndex !== false) {
            $data['projects'][$projectIndex] = array_merge($data['projects'][$projectIndex], $input);
            $this->saveData($data);
            return ['success' => true, 'message' => 'Project updated successfully'];
        }
        
        return ['success' => false, 'message' => 'Project not found'];
    }
    
    private function deleteProject($id) {
        $data = $this->getData();
        $projectIndex = array_search($id, array_column($data['projects'], 'id'));
        
        if ($projectIndex !== false) {
            array_splice($data['projects'], $projectIndex, 1);
            $data['stats']['totalProjects']--;
            $this->saveData($data);
            return ['success' => true, 'message' => 'Project deleted successfully'];
        }
        
        return ['success' => false, 'message' => 'Project not found'];
    }
    
    private function deleteMessage($id) {
        $data = $this->getData();
        $messageIndex = array_search($id, array_column($data['messages'], 'id'));
        
        if ($messageIndex !== false) {
            array_splice($data['messages'], $messageIndex, 1);
            $data['stats']['totalMessages']--;
            $this->saveData($data);
            return ['success' => true, 'message' => 'Message deleted successfully'];
        }
        
        return ['success' => false, 'message' => 'Message not found'];
    }
}

// Handle the request
$api = new PortfolioAPI();
$result = $api->handleRequest();
echo json_encode($result);
?>
