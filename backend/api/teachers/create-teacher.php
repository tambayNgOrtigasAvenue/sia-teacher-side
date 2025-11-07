<?php
/**
 * API Endpoint: Create Teacher (new)
 * Method: POST
 *
 * Expected JSON Body similar to /api/auth/register-teacher.php
 */

session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../controllers/teacher-auth-controller.php';

header("Content-Type: application/json; charset=UTF-8");

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
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

// Get POST data
$inputData = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$requiredFields = ['email', 'password', 'firstName', 'lastName', 'employeeNumber'];
$missingFields = [];

foreach ($requiredFields as $field) {
    if (empty($inputData[$field])) {
        $missingFields[] = $field;
    }
}

if (!empty($missingFields)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: ' . implode(', ', $missingFields)
    ]);
    exit();
}

// Sanitize input
$data = [
    'email' => filter_var(trim($inputData['email']), FILTER_SANITIZE_EMAIL),
    'password' => $inputData['password'], // Don't sanitize password
    'firstName' => htmlspecialchars(strip_tags(trim($inputData['firstName']))),
    'lastName' => htmlspecialchars(strip_tags(trim($inputData['lastName']))),
    'middleName' => !empty($inputData['middleName']) ? htmlspecialchars(strip_tags(trim($inputData['middleName']))) : null,
    'employeeNumber' => htmlspecialchars(strip_tags(trim($inputData['employeeNumber']))),
    'phoneNumber' => !empty($inputData['phoneNumber']) ? htmlspecialchars(strip_tags(trim($inputData['phoneNumber']))) : null,
    'address' => !empty($inputData['address']) ? htmlspecialchars(strip_tags(trim($inputData['address']))) : null,
    'specialization' => !empty($inputData['specialization']) ? htmlspecialchars(strip_tags(trim($inputData['specialization']))) : null,
    'hireDate' => !empty($inputData['hireDate']) ? htmlspecialchars(strip_tags(trim($inputData['hireDate']))) : date('Y-m-d'),
    'assignedByUserId' => isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null
];

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit();
}

// Validate password strength (optional)
if (strlen($data['password']) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long.']);
    exit();
}

// Use TeacherAuthController to register
$authController = new TeacherAuthController($db);
$result = $authController->registerTeacher($data);

// Log result
error_log("Create Teacher Result: " . json_encode($result));

if ($result['success']) {
    http_response_code(201);
} else {
    http_response_code(400);
}

echo json_encode($result);

?>
