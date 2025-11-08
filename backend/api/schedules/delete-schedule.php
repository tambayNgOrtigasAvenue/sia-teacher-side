<?php
/**
 * API Endpoint: Delete Schedule
 * Method: DELETE or POST
 * Deletes a class schedule
 */

session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

// Allow DELETE or POST requests
if (!in_array($_SERVER['REQUEST_METHOD'], ['DELETE', 'POST'])) {
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

// Get schedule ID from input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['scheduleId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Schedule ID is required.']);
    exit();
}

try {
    $scheduleId = $input['scheduleId'];
    
    // Delete the schedule
    $deleteQuery = "DELETE FROM classschedule WHERE ScheduleID = :scheduleId";
    $stmt = $db->prepare($deleteQuery);
    $stmt->bindParam(':scheduleId', $scheduleId);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Schedule deleted successfully.'
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Schedule not found.'
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error deleting schedule: ' . $e->getMessage()
    ]);
}
?>
