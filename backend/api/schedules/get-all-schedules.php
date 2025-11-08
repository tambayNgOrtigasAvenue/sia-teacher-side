<?php
/**
 * API Endpoint: Get All Teacher Schedules
 * Method: GET
 * Returns all teacher schedules (for Teacher Schedules tab)
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
    // Get all teacher schedules with teacher names
    $query = "
        SELECT 
            cs.ScheduleID as id,
            CONCAT(p.FirstName, ' ', p.LastName) as teacher,
            sub.SubjectName as subject,
            cs.DayOfWeek as day,
            CONCAT(TIME_FORMAT(cs.StartTime, '%h:%i %p'), ' - ', TIME_FORMAT(cs.EndTime, '%h:%i %p')) as time,
            cs.RoomNumber as room,
            cs.TeacherProfileID,
            cs.SubjectID,
            cs.SectionID
        FROM classschedule cs
        JOIN subject sub ON cs.SubjectID = sub.SubjectID
        LEFT JOIN teacherprofile tp ON cs.TeacherProfileID = tp.TeacherProfileID
        LEFT JOIN profile p ON tp.ProfileID = p.ProfileID
        JOIN section sec ON cs.SectionID = sec.SectionID
        ORDER BY 
            p.LastName,
            FIELD(cs.DayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
            cs.StartTime
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $schedules = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format teacher names (handle null for unassigned schedules)
    foreach ($schedules as &$schedule) {
        if (empty($schedule['teacher']) || $schedule['teacher'] === ' ') {
            $schedule['teacher'] = 'Unassigned';
        }
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $schedules
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching schedules: ' . $e->getMessage()
    ]);
}
?>
