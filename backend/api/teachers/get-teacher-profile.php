<?php
/**
 * API Endpoint: Get Teacher Profile
 * Method: GET
 * Returns the complete profile information for the logged-in teacher
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
    // Check if MotherTongue column exists
    $checkColumn = $db->query("SHOW COLUMNS FROM profile LIKE 'MotherTongue'");
    $hasMotherTongue = $checkColumn->rowCount() > 0;
    
    // Get teacher profile information
    $query = "
        SELECT 
            u.UserID,
            u.EmailAddress as email,
            p.FirstName as firstName,
            p.MiddleName as middleName,
            p.LastName as lastName,
            CONCAT(p.FirstName, ' ', IFNULL(CONCAT(p.MiddleName, ' '), ''), p.LastName) as fullName,
            p.Gender as gender,
            p.BirthDate as birthday,
            p.Age as age,
            p.Religion as religion,
            " . ($hasMotherTongue ? "p.MotherTongue as motherTongue," : "NULL as motherTongue,") . "
            p.EncryptedPhoneNumber as phoneNumber,
            p.EncryptedAddress as address,
            p.ProfilePictureURL as profilePicture,
            tp.EmployeeNumber,
            tp.Specialization,
            tp.HireDate,
            u.UserType as accountType
        FROM user u
        JOIN profile p ON u.UserID = p.UserID
        JOIN teacherprofile tp ON p.ProfileID = tp.ProfileID
        WHERE u.UserID = :userId
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':userId', $_SESSION['user_id']);
    $stmt->execute();
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$profile) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Teacher profile not found.']);
        exit();
    }
    
    // Format the response
    $response = [
        'firstName' => $profile['firstName'] ?? '',
        'middleName' => $profile['middleName'] ?? '',
        'lastName' => $profile['lastName'] ?? '',
        'fullName' => $profile['fullName'] ?? '',
        'email' => $profile['email'] ?? '',
        'gender' => $profile['gender'] ?? '',
        'birthday' => $profile['birthday'] ?? '',
        'age' => $profile['age'] ?? '',
        'religion' => $profile['religion'] ?? '',
        'motherTongue' => $profile['motherTongue'] ?? '',
        'phoneNumber' => $profile['phoneNumber'] ?? '',
        'address' => $profile['address'] ?? '',
        'accountType' => $profile['accountType'] ?? 'Teacher',
        'profilePicture' => $profile['profilePicture'] ?? null,
        'employeeNumber' => $profile['EmployeeNumber'] ?? '',
        'specialization' => $profile['Specialization'] ?? '',
        'hireDate' => $profile['HireDate'] ?? ''
    ];
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $response
    ]);
    
} catch (Exception $e) {
    error_log("Get teacher profile error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    error_log("User ID: " . ($_SESSION['user_id'] ?? 'not set'));
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching profile: ' . $e->getMessage(),
        'debug' => [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'userId' => $_SESSION['user_id'] ?? null
        ]
    ]);
}
?>
