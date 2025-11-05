<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");

echo json_encode(['step' => 1, 'message' => 'Starting test...']) . "\n";

// Test 1: Check if files exist
$files_to_check = [
    'cors.php' => __DIR__ . '/../../config/cors.php',
    'db.php' => __DIR__ . '/../../config/db.php',
    'controller' => __DIR__ . '/../../controllers/teacher-auth-controller.php',
];

foreach ($files_to_check as $name => $path) {
    if (file_exists($path)) {
        echo json_encode(['step' => 2, 'file' => $name, 'status' => 'EXISTS']) . "\n";
    } else {
        echo json_encode(['step' => 2, 'file' => $name, 'status' => 'MISSING', 'path' => $path]) . "\n";
        exit();
    }
}

// Test 2: Load dependencies
try {
    require_once __DIR__ . '/../../config/cors.php';
    echo json_encode(['step' => 3, 'message' => 'CORS loaded']) . "\n";
    
    require_once __DIR__ . '/../../config/db.php';
    echo json_encode(['step' => 4, 'message' => 'DB config loaded']) . "\n";
    
    require_once __DIR__ . '/../../controllers/teacher-auth-controller.php';
    echo json_encode(['step' => 5, 'message' => 'Controller loaded']) . "\n";
} catch (Exception $e) {
    echo json_encode(['step' => 'LOAD_ERROR', 'error' => $e->getMessage()]) . "\n";
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        echo json_encode(['step' => 6, 'status' => 'DB_CONNECTION_FAILED']) . "\n";
        exit();
    }
    
    echo json_encode(['step' => 6, 'status' => 'DB_CONNECTED']) . "\n";
} catch (Exception $e) {
    echo json_encode(['step' => 6, 'error' => $e->getMessage()]) . "\n";
    exit(); 
}

$testData = [
    'email' => 'testteacher' . time() . '@gymnazo.edu',
    'password' => 'Test1234!',
    'firstName' => 'Test',
    'lastName' => 'Teacher',
    'middleName' => null,
    'employeeNumber' => 'TEACH-TEST-' . time(),
    'phoneNumber' => null,
    'address' => null,
    'specialization' => 'Testing',
    'hireDate' => date('Y-m-d'),
    'assignedByUserId' => null
];

echo json_encode(['step' => 7, 'message' => 'Test data prepared', 'data' => $testData]) . "\n";

try {
    $authController = new TeacherAuthController($db);
    echo json_encode(['step' => 8, 'message' => 'Controller instantiated']) . "\n";
    
    $result = $authController->registerTeacher($testData);
    echo json_encode(['step' => 9, 'message' => 'Registration called', 'result' => $result]) . "\n";
    
    if ($result['success']) {
        echo json_encode(['step' => 10, 'status' => 'SUCCESS', 'data' => $result]) . "\n";
    } else {
        echo json_encode(['step' => 10, 'status' => 'FAILED', 'error' => $result['message']]) . "\n";
    }
} catch (Exception $e) {
    echo json_encode(['step' => 'REGISTRATION_ERROR', 'error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]) . "\n";
}

echo json_encode(['step' => 11, 'message' => 'Test completed']) . "\n";
?>
