<?php
// Login API endpoint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only POST requests are accepted.',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit();
}

// Include required files
require_once '../config/database.php';
require_once '../utils/ResponseHelper.php';
require_once '../utils/JWT.php';

try {
    // Get and decode JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Check if JSON is valid
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid JSON format',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit();
    }
    
    // Validate required fields
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Email and password are required',
            'errors' => [
                'missing_fields' => array_filter([
                    !isset($data['email']) ? 'email' : null,
                    !isset($data['password']) ? 'password' : null
                ])
            ],
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit();
    }
    
    $email = trim($data['email']);
    $password = $data['password'];
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email format',
            'errors' => ['email' => 'Please provide a valid email address'],
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit();
    }
    
    // Validate password length
    if (empty($password)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Password cannot be empty',
            'errors' => ['password' => 'Password is required'],
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit();
    }
    
    // Create database connection
    $database = new Database();
    $connection = $database->getConnection();
    
    if (!$connection) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit();
    }
    
    // Query to find user by email
    $query = "SELECT id, email, password, first_name, last_name, role, status 
              FROM users 
              WHERE email = :email AND status = 'active'";
    
    $stmt = $connection->prepare($query);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check if user exists and password is correct
    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit();
    }
    
    // Check if user account is active
    if ($user['status'] !== 'active') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Account is not active. Please contact administrator.',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit();
    }
    
    // Remove password from user data
    unset($user['password']);
    
    // Generate JWT token
    $payload = [
        'user_id' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role'],
        'iat' => time(),
        'exp' => time() + (60 * 60) // 1 hour expiration
    ];
    
    $token = JWT::encode($payload);
    
    // Log successful login (optional)
    error_log("User login successful: " . $user['email'] . " at " . date('Y-m-d H:i:s'));
    
    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'data' => [
            'user' => $user,
            'token' => $token,
            'expires_in' => 3600, // 1 hour in seconds
            'token_type' => 'Bearer'
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (PDOException $e) {
    // Database error
    error_log("Database error in login: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    // General error
    error_log("General error in login: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>