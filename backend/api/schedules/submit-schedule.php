<?php
/**
 * API Endpoint: Submit/Create Schedule
 * Method: POST
 * Creates a new class schedule
 */

session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    exit();
}

try {
    $db->beginTransaction();
    
    // Validate required fields
    if (empty($input['teacherProfileId']) || empty($input['sectionId']) || empty($input['timeSlots'])) {
        throw new Exception('Missing required fields: teacherProfileId, sectionId, or timeSlots.');
    }
    
    $teacherProfileId = $input['teacherProfileId'];
    $sectionId = $input['sectionId'];
    $room = $input['room'] ?? 'TBD';
    $day = $input['day'] ?? 'Monday';
    $timeSlots = $input['timeSlots'];
    
    $insertedCount = 0;
    
    // Insert each time slot as a schedule entry
    foreach ($timeSlots as $slot) {
        if (empty($slot['subject']) || empty($slot['startTime']) || empty($slot['endTime'])) {
            continue; // Skip empty slots
        }
        
        // Get or create subject
        $subjectQuery = "SELECT SubjectID FROM subject WHERE SubjectName = :subjectName LIMIT 1";
        $stmt = $db->prepare($subjectQuery);
        $stmt->bindParam(':subjectName', $slot['subject']);
        $stmt->execute();
        $subject = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$subject) {
            // Create subject if it doesn't exist
            $insertSubjectQuery = "INSERT INTO subject (SubjectName) VALUES (:subjectName)";
            $stmt = $db->prepare($insertSubjectQuery);
            $stmt->bindParam(':subjectName', $slot['subject']);
            $stmt->execute();
            $subjectId = $db->lastInsertId();
        } else {
            $subjectId = $subject['SubjectID'];
        }
        
        // Insert schedule
        $insertQuery = "
            INSERT INTO classschedule 
            (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber, ScheduleStatusID)
            VALUES 
            (:sectionId, :subjectId, :teacherProfileId, :dayOfWeek, :startTime, :endTime, :room, 1)
        ";
        
        $stmt = $db->prepare($insertQuery);
        $stmt->bindParam(':sectionId', $sectionId);
        $stmt->bindParam(':subjectId', $subjectId);
        $stmt->bindParam(':teacherProfileId', $teacherProfileId);
        $stmt->bindParam(':dayOfWeek', $day);
        $stmt->bindParam(':startTime', $slot['startTime']);
        $stmt->bindParam(':endTime', $slot['endTime']);
        $stmt->bindParam(':room', $room);
        $stmt->execute();
        
        $insertedCount++;
    }
    
    $db->commit();
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => "Schedule created successfully! ($insertedCount time slots added)"
    ]);
    
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error creating schedule: ' . $e->getMessage()
    ]);
}
?>
