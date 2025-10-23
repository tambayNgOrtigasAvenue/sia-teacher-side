<?php
//API endpoint for teacher login
//POST Request
session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../models/Teachers.php';
require_once __DIR__ . '/../../controllers/teacher-auth-controller.php';

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed.']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed.']);
    exit();
}

$authController = new TeacherAuthController($db);
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->employee_number) || !isset($data->password)) {
    http_response_code(400); 
    echo json_encode(['message' => 'Missing employee number or password.']);
    exit();
}

$employeeNumber = trim(htmlspecialchars(strip_tags($data->employee_number)));
$password = $data->password;

$result = $authController->loginTeacher($employeeNumber, $password);

if ($result['success']) {
    http_response_code(200);
} else {
    http_response_code(401); 
}

echo json_encode($result);
?>