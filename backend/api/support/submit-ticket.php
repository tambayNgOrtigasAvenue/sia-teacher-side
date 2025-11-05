<?php
session_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/help-support-controller.php';

header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit();
}

try {
    // Check authentication
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Unauthorized. Please login.',
            'error_code' => 'UNAUTHORIZED'
        ]);
        exit();
    }

    // Get user ID from session
    $userId = $_SESSION['user_id'];

    // Get JSON input
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate required fields
    if (empty($data['subject'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Subject is required',
            'error_code' => 'INVALID_INPUT'
        ]);
        exit();
    }

    // Get database connection
    $database = new Database();
    $db = $database->getConnection();

    // Create controller instance
    $controller = new HelpSupportController($db);

    // Get parameters
    $subject = $data['subject'];
    $message = $data['message'] ?? '';
    $priority = $data['priority'] ?? 'Medium';

    // Create ticket with initial message
    $result = $controller->createTicketWithMessage($userId, $subject, $message, $priority);

    // Set appropriate HTTP status code
    if ($result['success']) {
        http_response_code(201);
    } else {
        http_response_code(400);
    }

    echo json_encode($result);

} catch (Exception $e) {
    error_log("Error in submit-ticket.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error',
        'error_code' => 'SERVER_ERROR'
    ]);
}