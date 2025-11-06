<?php
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
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;

    $query = "
        SELECT 
            a.AnnouncementID as id,
            a.Title as title,
            a.Content as message,
            a.PublishDate as createdAt,
            CONCAT(p.FirstName, ' ', p.LastName) as createdBy
        FROM announcement a
        JOIN user u ON a.AuthorUserID = u.UserID
        JOIN profile p ON u.UserID = p.UserID
        WHERE a.TargetAudience IN ('All Users', 'Teachers')
            AND a.IsActive = 1
            AND (a.ExpiryDate IS NULL OR a.ExpiryDate >= CURDATE())
        ORDER BY a.PublishDate DESC
        LIMIT :limit
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    
    $announcements = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $announcements
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching announcements: ' . $e->getMessage()
    ]);
}
?>
