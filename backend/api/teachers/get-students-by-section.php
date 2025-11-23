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
    // Students are linked to sections through the enrollment table
    $studentQuery = "
        SELECT 
            sp.StudentProfileID as id,
            p.LastName as lastName,
            p.FirstName as firstName,
            p.MiddleName as middleName,
            sp.DateOfBirth as birthdate,
            TIMESTAMPDIFF(YEAR, sp.DateOfBirth, CURDATE()) as age,
            sp.StudentNumber as studentNumber,
            CAST(p.EncryptedAddress AS CHAR) as address,
            CAST(p.EncryptedPhoneNumber AS CHAR) as contactNumber,
            p.ProfilePictureURL as profilePicture,
            'Present' as attendance,
            NULL as grade
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
        WHERE e.SectionID = :sectionId
        AND e.EnrollmentID IN (
            SELECT MAX(EnrollmentID) 
            FROM enrollment 
            WHERE StudentProfileID = sp.StudentProfileID
            GROUP BY StudentProfileID
        )
        ORDER BY p.LastName, p.FirstName
    ";
    
    $stmt = $db->prepare($studentQuery);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
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
