<?php
/**
 * API Endpoint: Get Teacher Schedule Detail
 * Method: GET
 * Returns detailed schedule for a specific teacher including all time slots
 * Query parameter: teacherId (required)
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

// Get teacher ID from query parameter
$teacherId = $_GET['teacherId'] ?? null;

if (!$teacherId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Teacher ID is required.']);
    exit();
}

try {
    // Get teacher's section information
    $sectionQuery = "
        SELECT DISTINCT
            sec.SectionID,
            CONCAT(gl.LevelName, ' - Section ', sec.SectionName) as gradeSection,
            sec.RoomNumber as room,
            tp.TeacherProfileID
        FROM teacherprofile tp
        JOIN section sec ON sec.AdviserTeacherID = tp.TeacherProfileID
        JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
        JOIN profile p ON tp.ProfileID = p.ProfileID
        WHERE p.UserID = :teacherId
        LIMIT 1
    ";
    
    $stmt = $db->prepare($sectionQuery);
    $stmt->bindParam(':teacherId', $teacherId);
    $stmt->execute();
    $sectionInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$sectionInfo) {
        // If no section is assigned, return empty schedule
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => [
                'gradeSection' => '',
                'room' => '',
                'day' => 'Monday to Friday',
                'schedule' => []
            ]
        ]);
        exit();
    }
    
    // Get teacher's schedule from database
    $scheduleQuery = "
        SELECT 
            cs.ScheduleID,
            cs.StartTime,
            cs.EndTime,
            cs.SubjectID,
            sub.SubjectName,
            cs.DayOfWeek,
            cs.RoomNumber,
            CONCAT(TIME_FORMAT(cs.StartTime, '%h:%i %p'), ' - ', TIME_FORMAT(cs.EndTime, '%h:%i %p')) as timeSlot
        FROM classschedule cs
        JOIN subject sub ON cs.SubjectID = sub.SubjectID
        WHERE cs.TeacherProfileID = :teacherProfileId
        AND cs.SectionID = :sectionId
        ORDER BY cs.StartTime
    ";
    
    $stmt = $db->prepare($scheduleQuery);
    $stmt->bindParam(':teacherProfileId', $sectionInfo['TeacherProfileID']);
    $stmt->bindParam(':sectionId', $sectionInfo['SectionID']);
    $stmt->execute();
    
    $schedules = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Build the schedule array from actual database records with separate start and end times
    $formattedSchedule = [];
    foreach ($schedules as $schedule) {
        $formattedSchedule[] = [
            'startTime' => date('h:i A', strtotime($schedule['StartTime'])),
            'endTime' => date('h:i A', strtotime($schedule['EndTime'])),
            'subject' => $schedule['SubjectID'],
            'subjectName' => $schedule['SubjectName'],
            'day' => $schedule['DayOfWeek']
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'gradeSection' => $sectionInfo['gradeSection'],
            'room' => $sectionInfo['room'] ?? '',
            'day' => 'Monday to Friday',
            'teacherProfileId' => $sectionInfo['TeacherProfileID'],
            'sectionId' => $sectionInfo['SectionID'],
            'schedule' => $formattedSchedule
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching schedule: ' . $e->getMessage()
    ]);
}
?>
