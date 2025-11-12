<?php
/**
 * API Endpoint: Get Teacher's Assigned Sections
 * Method: GET
 * Returns sections assigned to a specific teacher
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

// Get teacher ID from query parameter
$teacherId = $_GET['teacherId'] ?? null;

if (!$teacherId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Teacher ID is required.']);
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
    // Get sections where this teacher is the adviser for the active school year
    $query = "
        SELECT 
            s.SectionID as id,
            s.SectionName as sectionName,
            gl.LevelName as gradeLevel,
            s.CurrentEnrollment as studentCount,
            s.MaxCapacity as maxCapacity,
            sy.YearName as schoolYear
        FROM section s
        JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
        JOIN schoolyear sy ON s.SchoolYearID = sy.SchoolYearID
        JOIN teacherprofile tp ON s.AdviserTeacherID = tp.TeacherProfileID
        JOIN profile p ON tp.ProfileID = p.ProfileID
        JOIN user u ON p.UserID = u.UserID
        WHERE u.UserID = :teacherId
            AND sy.IsActive = 1
        ORDER BY gl.SortOrder, s.SectionName
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':teacherId', $teacherId, PDO::PARAM_INT);
    $stmt->execute();
    $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $sections
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching sections: ' . $e->getMessage()
    ]);
}
?>
