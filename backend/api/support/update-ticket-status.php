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

// Only accept PUT requests
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use PUT.'
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
    if (empty($data['ticketId']) || empty($data['status'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Ticket ID and status are required',
            'error_code' => 'INVALID_INPUT'
        ]);
        exit();
    }

    // Get database connection
    $database = new Database();
    $db = $database->getConnection();

    // Create controller instance
    $controller = new HelpSupportController($db);

    // Update ticket status
    $result = $controller->updateTicketStatus(
        $data['ticketId'],
        $userId,
        $data['status']
    );

    // Set appropriate HTTP status code
    if ($result['success']) {
        http_response_code(200);
    } else if (isset($result['error_code']) && $result['error_code'] === 'UNAUTHORIZED') {
        http_response_code(403);
    } else {
        http_response_code(400);
    }

    echo json_encode($result);

} catch (Exception $e) {
    error_log("Error in update-ticket-status.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error',
        'error_code' => 'SERVER_ERROR'
    ]);
}
