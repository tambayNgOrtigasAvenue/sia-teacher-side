<?php
/**
 * API Endpoint: Update Appearance Settings
 * Method: POST
 * Updates theme and accent color preferences for the logged-in user
 */

session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    exit();
}

try {
    $theme = isset($input['theme']) ? $input['theme'] : 'light';
    $accentColor = isset($input['accentColor']) ? $input['accentColor'] : '#22c55e';
    
    // Check if settings exist
    $checkQuery = "SELECT SettingsID FROM usersettings WHERE UserID = :userId";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':userId', $_SESSION['user_id']);
    $checkStmt->execute();
    $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($existing) {
        // Update existing settings
        $updateQuery = "
            UPDATE usersettings 
            SET 
                Theme = :theme,
                AccentColor = :accentColor
            WHERE UserID = :userId
        ";
        $stmt = $db->prepare($updateQuery);
    } else {
        // Insert new settings
        $insertQuery = "
            INSERT INTO usersettings (UserID, Theme, AccentColor)
            VALUES (:userId, :theme, :accentColor)
        ";
        $stmt = $db->prepare($insertQuery);
    }
    
    $stmt->bindParam(':userId', $_SESSION['user_id']);
    $stmt->bindParam(':theme', $theme);
    $stmt->bindParam(':accentColor', $accentColor);
    $stmt->execute();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Settings updated successfully.'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error updating settings: ' . $e->getMessage()
    ]);
}
?>
