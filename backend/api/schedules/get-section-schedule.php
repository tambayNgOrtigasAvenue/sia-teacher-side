<?php
/**
 * API Endpoint: Get Section Schedule
 * Method: GET
 * Returns schedule for a specific section
 * Query parameter: sectionId (required)
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

// Get section ID from query parameter
$sectionId = $_GET['sectionId'] ?? null;

if (!$sectionId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Section ID is required.']);
    exit();
}

try {
    // Get section information
    $sectionQuery = "
        SELECT 
            s.SectionID,
            CONCAT(gl.LevelName, ' - Section ', s.SectionName) as gradeSection,
            s.AdviserTeacherID
        FROM section s
        JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
        WHERE s.SectionID = :sectionId
        LIMIT 1
    ";
    
    $stmt = $db->prepare($sectionQuery);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $stmt->execute();
    $sectionInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$sectionInfo) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Section not found.'
        ]);
        exit();
    }
    
    // Get section's schedule from database
    $scheduleQuery = "
        SELECT 
            cs.ScheduleID,
            cs.StartTime,
            cs.EndTime,
            cs.SubjectID as subject,
            cs.TeacherProfileID,
            sub.SubjectName,
            cs.DayOfWeek,
            cs.RoomNumber,
            TIME_FORMAT(cs.StartTime, '%h:%i %p') as startTime,
            TIME_FORMAT(cs.EndTime, '%h:%i %p') as endTime
        FROM classschedule cs
        JOIN subject sub ON cs.SubjectID = sub.SubjectID
        WHERE cs.SectionID = :sectionId
        ORDER BY cs.StartTime
    ";
    
    $stmt = $db->prepare($scheduleQuery);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $stmt->execute();
    $schedules = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format schedule data for frontend
    $formattedSchedule = [];
    foreach ($schedules as $schedule) {
        $formattedSchedule[] = [
            'subject' => $schedule['subject'],
            'subjectName' => $schedule['SubjectName'],
            'startTime' => $schedule['startTime'],
            'endTime' => $schedule['endTime'],
            'rawStartTime' => $schedule['StartTime'],
            'rawEndTime' => $schedule['EndTime'],
            'day' => $schedule['DayOfWeek'],
            'teacherId' => $schedule['TeacherProfileID'],
            'room' => $schedule['RoomNumber'] ?? 'TBD'
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'gradeSection' => $sectionInfo['gradeSection'],
            'sectionId' => $sectionInfo['SectionID'],
            'teacherProfileId' => $sectionInfo['AdviserTeacherID'],
            'day' => 'Monday to Friday',
            'schedule' => $formattedSchedule
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching section schedule: ' . $e->getMessage()
    ]);
}
?>
