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
    if (empty($input['teacherProfileId']) || empty($input['sectionId']) || empty($input['schedule'])) {
        throw new Exception('Missing required fields: teacherProfileId, sectionId, or schedule.');
    }
    
    $teacherProfileId = $input['teacherProfileId'];
    $sectionId = $input['sectionId'];
    $day = $input['day'] ?? 'Monday';
    $scheduleSlots = $input['schedule'];
    
    // Get room number from section table
    $sectionQuery = "SELECT RoomNumber FROM section WHERE SectionID = :sectionId";
    $stmt = $db->prepare($sectionQuery);
    $stmt->bindParam(':sectionId', $sectionId);
    $stmt->execute();
    $sectionData = $stmt->fetch(PDO::FETCH_ASSOC);
    $room = $sectionData['RoomNumber'] ?? 'TBD';
    
    // First, delete existing schedules for this teacher and section
    $deleteQuery = "
        DELETE FROM classschedule 
        WHERE TeacherProfileID = :teacherProfileId 
        AND SectionID = :sectionId
    ";
    $stmt = $db->prepare($deleteQuery);
    $stmt->bindParam(':teacherProfileId', $teacherProfileId);
    $stmt->bindParam(':sectionId', $sectionId);
    $stmt->execute();
    
    $insertedCount = 0;
    
    // Insert each time slot as a schedule entry
    foreach ($scheduleSlots as $slot) {
        // Skip if subject, startTime, or endTime is missing
        if (empty($slot['subject']) || empty($slot['startTime']) || empty($slot['endTime'])) {
            continue;
        }
        
        // Convert time to 24-hour format
        $startTime = date('H:i:s', strtotime($slot['startTime']));
        $endTime = date('H:i:s', strtotime($slot['endTime']));
        
        // Validate time conversion
        if ($startTime === false || $endTime === false) {
            continue; // Skip invalid time formats
        }
        
        // Insert schedule
        $insertQuery = "
            INSERT INTO classschedule 
            (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber, ScheduleStatusID)
            VALUES 
            (:sectionId, :subjectId, :teacherProfileId, :dayOfWeek, :startTime, :endTime, :room, 1)
        ";
        
        $stmt = $db->prepare($insertQuery);
        $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $stmt->bindParam(':subjectId', $slot['subject'], PDO::PARAM_INT);
        $stmt->bindParam(':teacherProfileId', $teacherProfileId, PDO::PARAM_INT);
        $stmt->bindParam(':dayOfWeek', $day, PDO::PARAM_STR);
        $stmt->bindParam(':startTime', $startTime, PDO::PARAM_STR);
        $stmt->bindParam(':endTime', $endTime, PDO::PARAM_STR);
        $stmt->bindParam(':room', $room, PDO::PARAM_STR);
        $stmt->execute();
        
        $insertedCount++;
    }
    
    $db->commit();
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => "Schedule saved successfully! ($insertedCount time slots added)"
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
