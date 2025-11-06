<?php
/**
 * API Endpoint: Get Teacher Schedule
 * Method: GET
 * Returns the schedule for the logged-in teacher
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
    
    // Get teacher's schedule
    $scheduleQuery = "
        SELECT 
            cs.ScheduleID,
            sub.SubjectName as subject,
            CONCAT(gl.LevelName, ' - Section ', sec.SectionName) as grade,
            cs.DayOfWeek as day,
            CONCAT(TIME_FORMAT(cs.StartTime, '%h:%i %p'), ' - ', TIME_FORMAT(cs.EndTime, '%h:%i %p')) as time,
            cs.RoomNumber as room
        FROM classschedule cs
        JOIN subject sub ON cs.SubjectID = sub.SubjectID
        JOIN section sec ON cs.SectionID = sec.SectionID
        JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
        WHERE cs.TeacherProfileID = :teacherProfileId
        ORDER BY 
            FIELD(cs.DayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
            cs.StartTime
    ";
    
    $scheduleStmt = $db->prepare($scheduleQuery);
    $scheduleStmt->bindParam(':teacherProfileId', $teacher['TeacherProfileID']);
    $scheduleStmt->execute();
    
    $schedules = $scheduleStmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $schedules
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching schedule: ' . $e->getMessage()
    ]);
}
?>
