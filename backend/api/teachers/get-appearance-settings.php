<?php
/**
 * API Endpoint: Get Appearance Settings
 * Method: GET
 * Returns theme and accent color preferences for the logged-in user
 */

session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated.']);
    exit();
}

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

try {
    // Get user settings
    $query = "
        SELECT 
            Theme as theme,
            AccentColor as accentColor
        FROM usersettings
        WHERE UserID = :userId
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':userId', $_SESSION['user_id']);
    $stmt->execute();
    $settings = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // If no settings exist, return defaults
    if (!$settings) {
        $settings = [
            'theme' => 'light',
            'accentColor' => '#22c55e'
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $settings
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching settings: ' . $e->getMessage()
    ]);
}
?>
