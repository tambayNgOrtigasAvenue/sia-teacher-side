<?php
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
    // This includes sections assigned as adviser, even without schedules
    $classQuery = "
        SELECT DISTINCT
            sec.SectionID as id,
            sec.GradeLevelID as gradeLevelId,
            CONCAT('', gl.LevelName) as grade,
            sec.SectionName as section,
            CASE 
                WHEN cs.ScheduleStatusID IS NOT NULL THEN 'active'
                ELSE 'pending'
            END as status,
            0 as isFavorited
        FROM section sec
        JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
        LEFT JOIN classschedule cs ON cs.SectionID = sec.SectionID AND cs.TeacherProfileID = :teacherProfileId
        WHERE sec.AdviserTeacherID = :teacherProfileId
        GROUP BY sec.SectionID, sec.GradeLevelID, gl.LevelName, sec.SectionName
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
