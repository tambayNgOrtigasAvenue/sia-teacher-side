<?php
/**
 * API Endpoint: Get Teachers by Subject
 * Method: GET
 * Returns all teachers who teach a specific subject
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

$subjectId = $_GET['subjectId'] ?? null;

if (!$subjectId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Subject ID is required.']);
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
    // First, get the subject name
    $subjectQuery = "SELECT SubjectName FROM subject WHERE SubjectID = :subjectId";
    $subjectStmt = $db->prepare($subjectQuery);
    $subjectStmt->bindParam(':subjectId', $subjectId, PDO::PARAM_INT);
    $subjectStmt->execute();
    $subjectName = $subjectStmt->fetchColumn();

    if (!$subjectName) {
        echo json_encode([
            'success' => true, 
            'data' => [], 
            'message' => 'Subject not found'
        ]);
        exit();
    }

    // Get all teachers whose specialization matches the subject name
    // We check if Specialization contains SubjectName OR SubjectName contains Specialization
    // to handle cases like "Mathematics" vs "Math" or "Science 1" vs "General Science"
    $query = "
        SELECT DISTINCT
            tp.TeacherProfileID as id,
            CONCAT(p.FirstName, ' ', p.LastName) as name,
            CONCAT(p.LastName, ', ', p.FirstName) as fullName,
            tp.Specialization
        FROM teacherprofile tp
        JOIN profile p ON tp.ProfileID = p.ProfileID
        JOIN user u ON p.UserID = u.UserID
        WHERE u.IsDeleted = 0
        AND u.AccountStatus = 'Active'
        AND (u.UserType = 'Teacher' OR u.UserType = 'HeadTeacher' OR u.UserType = 'Head Teacher')
        AND (
            tp.Specialization IS NOT NULL 
            AND tp.Specialization != ''
            AND (
                tp.Specialization LIKE CONCAT('%', :subjectName1, '%')
                OR :subjectName2 LIKE CONCAT('%', tp.Specialization, '%')
            )
        )
        ORDER BY p.LastName, p.FirstName
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':subjectName1', $subjectName, PDO::PARAM_STR);
    $stmt->bindParam(':subjectName2', $subjectName, PDO::PARAM_STR);
    $stmt->execute();
    $teachers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $teachers,
        'debug_subject' => $subjectName
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching teachers: ' . $e->getMessage()
    ]);
}
?>
