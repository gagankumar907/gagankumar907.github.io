<?php
/**
 * Portfolio Data Backup and Restore Utility
 * 
 * This script helps backup and restore portfolio data
 */

class DataManager {
    private $dataFile = 'data/portfolio.json';
    private $backupDir = 'data/backups/';
    
    public function __construct() {
        if (!file_exists($this->backupDir)) {
            mkdir($this->backupDir, 0755, true);
        }
    }
    
    public function backup() {
        if (!file_exists($this->dataFile)) {
            return ['success' => false, 'message' => 'Data file not found'];
        }
        
        $timestamp = date('Y-m-d_H-i-s');
        $backupFile = $this->backupDir . "portfolio_backup_{$timestamp}.json";
        
        if (copy($this->dataFile, $backupFile)) {
            return [
                'success' => true, 
                'message' => 'Backup created successfully',
                'file' => $backupFile
            ];
        }
        
        return ['success' => false, 'message' => 'Failed to create backup'];
    }
    
    public function restore($backupFile) {
        $fullPath = $this->backupDir . $backupFile;
        
        if (!file_exists($fullPath)) {
            return ['success' => false, 'message' => 'Backup file not found'];
        }
        
        // Validate JSON
        $data = json_decode(file_get_contents($fullPath), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return ['success' => false, 'message' => 'Invalid JSON in backup file'];
        }
        
        // Create current backup before restore
        $this->backup();
        
        if (copy($fullPath, $this->dataFile)) {
            return ['success' => true, 'message' => 'Data restored successfully'];
        }
        
        return ['success' => false, 'message' => 'Failed to restore data'];
    }
    
    public function listBackups() {
        $backups = [];
        $files = glob($this->backupDir . '*.json');
        
        foreach ($files as $file) {
            $backups[] = [
                'name' => basename($file),
                'size' => filesize($file),
                'date' => date('Y-m-d H:i:s', filemtime($file))
            ];
        }
        
        return $backups;
    }
}

// Handle requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dataManager = new DataManager();
    $action = $_POST['action'] ?? '';
    
    switch ($action) {
        case 'backup':
            $result = $dataManager->backup();
            break;
        case 'restore':
            $backupFile = $_POST['file'] ?? '';
            $result = $dataManager->restore($backupFile);
            break;
        case 'list':
            $result = ['success' => true, 'backups' => $dataManager->listBackups()];
            break;
        default:
            $result = ['success' => false, 'message' => 'Invalid action'];
    }
    
    header('Content-Type: application/json');
    echo json_encode($result);
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Data Manager</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-900 text-white min-h-screen">
    <div class="container mx-auto p-8">
        <h1 class="text-3xl font-bold mb-8 text-center">
            <i class="fas fa-database mr-2"></i>
            Portfolio Data Manager
        </h1>
        
        <div class="grid md:grid-cols-2 gap-8">
            <!-- Backup Section -->
            <div class="bg-gray-800 p-6 rounded-lg">
                <h2 class="text-xl font-semibold mb-4">
                    <i class="fas fa-save mr-2"></i>
                    Create Backup
                </h2>
                <p class="text-gray-400 mb-4">Create a backup of your current portfolio data.</p>
                <button onclick="createBackup()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
                    <i class="fas fa-download mr-2"></i>
                    Create Backup
                </button>
            </div>
            
            <!-- Restore Section -->
            <div class="bg-gray-800 p-6 rounded-lg">
                <h2 class="text-xl font-semibold mb-4">
                    <i class="fas fa-upload mr-2"></i>
                    Restore Data
                </h2>
                <p class="text-gray-400 mb-4">Restore data from a previous backup.</p>
                <div class="mb-4">
                    <select id="backupSelect" class="bg-gray-700 text-white p-2 rounded w-full">
                        <option value="">Select a backup...</option>
                    </select>
                </div>
                <button onclick="restoreData()" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
                    <i class="fas fa-history mr-2"></i>
                    Restore Data
                </button>
            </div>
        </div>
        
        <!-- Backups List -->
        <div class="mt-8 bg-gray-800 p-6 rounded-lg">
            <h2 class="text-xl font-semibold mb-4">
                <i class="fas fa-list mr-2"></i>
                Available Backups
            </h2>
            <div id="backupsList" class="space-y-2">
                <!-- Backups will be loaded here -->
            </div>
        </div>
        
        <!-- Messages -->
        <div id="messages" class="mt-4"></div>
    </div>

    <script>
        // Load backups on page load
        document.addEventListener('DOMContentLoaded', loadBackups);
        
        async function createBackup() {
            try {
                const formData = new FormData();
                formData.append('action', 'backup');
                
                const response = await fetch('', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('Backup created successfully!', 'success');
                    loadBackups();
                } else {
                    showMessage(result.message, 'error');
                }
            } catch (error) {
                showMessage('Error creating backup', 'error');
            }
        }
        
        async function restoreData() {
            const backupFile = document.getElementById('backupSelect').value;
            
            if (!backupFile) {
                showMessage('Please select a backup file', 'error');
                return;
            }
            
            if (!confirm('Are you sure you want to restore this backup? Current data will be backed up first.')) {
                return;
            }
            
            try {
                const formData = new FormData();
                formData.append('action', 'restore');
                formData.append('file', backupFile);
                
                const response = await fetch('', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('Data restored successfully!', 'success');
                    loadBackups();
                } else {
                    showMessage(result.message, 'error');
                }
            } catch (error) {
                showMessage('Error restoring data', 'error');
            }
        }
        
        async function loadBackups() {
            try {
                const formData = new FormData();
                formData.append('action', 'list');
                
                const response = await fetch('', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    updateBackupsList(result.backups);
                    updateBackupsSelect(result.backups);
                }
            } catch (error) {
                console.error('Error loading backups:', error);
            }
        }
        
        function updateBackupsList(backups) {
            const container = document.getElementById('backupsList');
            
            if (backups.length === 0) {
                container.innerHTML = '<p class="text-gray-400">No backups available</p>';
                return;
            }
            
            container.innerHTML = backups.map(backup => `
                <div class="bg-gray-700 p-3 rounded flex justify-between items-center">
                    <div>
                        <span class="font-medium">${backup.name}</span>
                        <span class="text-gray-400 ml-2">(${formatFileSize(backup.size)})</span>
                    </div>
                    <span class="text-gray-400 text-sm">${backup.date}</span>
                </div>
            `).join('');
        }
        
        function updateBackupsSelect(backups) {
            const select = document.getElementById('backupSelect');
            select.innerHTML = '<option value="">Select a backup...</option>';
            
            backups.forEach(backup => {
                const option = document.createElement('option');
                option.value = backup.name;
                option.textContent = `${backup.name} (${backup.date})`;
                select.appendChild(option);
            });
        }
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        function showMessage(message, type) {
            const container = document.getElementById('messages');
            const div = document.createElement('div');
            div.className = `p-4 rounded ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`;
            div.innerHTML = `
                <div class="flex justify-between items-center">
                    <span>${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" class="ml-4 hover:opacity-70">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            container.appendChild(div);
            
            setTimeout(() => div.remove(), 5000);
        }
    </script>
</body>
</html>
