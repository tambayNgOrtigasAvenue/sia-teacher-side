<?php
/**
 * API Endpoint: Get Students by Section
 * Method: GET
 * Returns all students in a specific section
 * Query Parameters: sectionId
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

// Get section ID from query parameters
if (!isset($_GET['sectionId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Section ID is required.']);
    exit();
}

$sectionId = $_GET['sectionId'];

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

try {
    // Get students in the section with their attendance status
    $studentQuery = "
        SELECT 
            sp.StudentProfileID as id,
            p.LastName as lastName,
            p.FirstName as firstName,
            p.MiddleName as middleName,
            'Present' as attendance,
            NULL as grade
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        WHERE sp.SectionID = :sectionId
        ORDER BY p.LastName, p.FirstName
    ";
    
    $stmt = $db->prepare($studentQuery);
    $stmt->bindParam(':sectionId', $sectionId);
    $stmt->execute();
    
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $students
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching students: ' . $e->getMessage()
    ]);
}
?>
