<?php
/**
 * API Endpoint: Get Advisory Classes
 * Method: GET
 * Returns sections where the logged-in teacher is the adviser
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
    // Get teacher profile ID from user session
    $query = "
        SELECT tp.TeacherProfileID 
        FROM teacherprofile tp
        JOIN profile p ON tp.ProfileID = p.ProfileID
        WHERE p.UserID = :userId
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':userId', $_SESSION['user_id']);
    $stmt->execute();
    $teacher = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$teacher) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Teacher profile not found.']);
        exit();
    }
    
    // Get advisory classes
    $advisoryQuery = "
        SELECT 
            s.SectionID as id,
            gl.LevelName as grade,
            s.SectionName as section,
            COUNT(DISTINCT e.StudentProfileID) as studentCount
        FROM section s
        JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
        LEFT JOIN enrollment e ON s.SectionID = e.SectionID
        WHERE s.AdviserTeacherID = :teacherProfileId
        GROUP BY s.SectionID, gl.LevelName, s.SectionName
        ORDER BY gl.LevelName, s.SectionName
    ";
    
    $advisoryStmt = $db->prepare($advisoryQuery);
    $advisoryStmt->bindParam(':teacherProfileId', $teacher['TeacherProfileID']);
    $advisoryStmt->execute();
    
    $advisoryClasses = $advisoryStmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $advisoryClasses
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching advisory classes: ' . $e->getMessage()
    ]);
}
?>
