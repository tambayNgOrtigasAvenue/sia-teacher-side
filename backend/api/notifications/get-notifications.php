<?php
/**
 * API Endpoint: Get Notifications
 * Method: GET
 * Returns notifications for the logged-in teacher
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
    // Get limit parameter (default to 5 for dashboard)
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;
    
    // Get notifications for the teacher
    $query = "
        SELECT 
            nl.LogID as id,
            nl.Title as sender,
            nl.Message as message,
            nl.IsRead as isRead,
            DATE_FORMAT(nl.SentAt, '%h:%i %p') as time,
            nl.SentAt as createdAt
        FROM notificationlog nl
        WHERE nl.RecipientUserID = :userId
        ORDER BY nl.SentAt DESC
        LIMIT :limit
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':userId', $_SESSION['user_id']);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $notifications
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching notifications: ' . $e->getMessage()
    ]);
}
?>
