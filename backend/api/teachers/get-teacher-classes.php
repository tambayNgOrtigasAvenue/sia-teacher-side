<?php
/**
 * API Endpoint: Get Teacher Classes
 * Method: GET
 * Returns all classes/sections assigned to the logged-in teacher
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
    
    // Get all unique classes/sections assigned to this teacher
    $classQuery = "
        SELECT DISTINCT
            sec.SectionID as id,
            gl.LevelName as grade,
            CONCAT('Section ', sec.SectionName) as section,
            sub.SubjectName as subject,
            'active' as status,
            0 as isFavorited
        FROM schedule s
        JOIN subject sub ON s.SubjectID = sub.SubjectID
        JOIN section sec ON s.SectionID = sec.SectionID
        JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
        WHERE s.TeacherProfileID = :teacherProfileId
        ORDER BY gl.LevelName, sec.SectionName
    ";
    
    $classStmt = $db->prepare($classQuery);
    $classStmt->bindParam(':teacherProfileId', $teacher['TeacherProfileID']);
    $classStmt->execute();
    
    $classes = $classStmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $classes
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching classes: ' . $e->getMessage()
    ]);
}
?>
