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

// Check Authorization (Head Teacher only)
// Check Authorization (Head Teacher or Teacher)
// Note: UserType might be 'Head Teacher' or 'HeadTeacher' depending on DB version
if (!isset($_SESSION['user_type']) || 
    ($_SESSION['user_type'] !== 'Head Teacher' && 
     $_SESSION['user_type'] !== 'HeadTeacher' && 
     $_SESSION['user_type'] !== 'Teacher')) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Access denied. User type: ' . ($_SESSION['user_type'] ?? 'None')]);
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
    if (empty($input['sectionId']) || empty($input['schedule'])) {
        throw new Exception('Missing required fields: sectionId or schedule.');
    }
    
    $sectionId = $input['sectionId'];
    $day = $input['day'] ?? 'Monday';
    $scheduleSlots = $input['schedule'];
    
    error_log("=== SUBMIT SCHEDULE DEBUG ===");
    error_log("Section ID: " . $sectionId);
    error_log("Number of schedules received: " . count($scheduleSlots));
    error_log("Schedule data: " . json_encode($scheduleSlots));
    
    // Get a valid ScheduleStatusID or set to NULL
    $statusId = null;
    $statusQuery = "SELECT StatusID FROM schedulestatus LIMIT 1";
    $statusStmt = $db->prepare($statusQuery);
    if ($statusStmt->execute()) {
        $statusResult = $statusStmt->fetch(PDO::FETCH_ASSOC);
        if ($statusResult) {
            $statusId = $statusResult['StatusID'];
        }
    }
    
    // Collect all unique days from the schedule slots
    $daysToUpdate = [];
    foreach ($scheduleSlots as $slot) {
        $slotDay = $slot['day'] ?? $day;
        if (!in_array($slotDay, $daysToUpdate)) {
            $daysToUpdate[] = $slotDay;
        }
    }
    
    error_log("Days to update: " . json_encode($daysToUpdate));
    
    // Delete existing schedules ONLY for the days being updated
    // This prevents accidentally deleting schedules for other days
    if (!empty($daysToUpdate)) {
        $placeholders = implode(',', array_fill(0, count($daysToUpdate), '?'));
        $deleteQuery = "DELETE FROM classschedule WHERE SectionID = ? AND DayOfWeek IN ($placeholders)";
        $stmt = $db->prepare($deleteQuery);
        $params = array_merge([$sectionId], $daysToUpdate);
        $deletedRows = $stmt->execute($params);
        error_log("Deleted schedules for days: " . json_encode($daysToUpdate));
        error_log("Rows affected: " . $stmt->rowCount());
    }
    
    $insertedCount = 0;
    
    // Insert each time slot as a schedule entry
    foreach ($scheduleSlots as $slot) {
        // Skip if subject, startTime, endTime, or teacherId is missing
        if (empty($slot['subject']) || empty($slot['startTime']) || empty($slot['endTime']) || empty($slot['teacherId'])) {
            continue;
        }
        
        // Use slot day if available, else fallback to global day
        $slotDay = $slot['day'] ?? $day;
        $teacherProfileId = $slot['teacherId'];
        
        // Get room number from slot, default to 'TBD' if not provided
        $room = $slot['room'] ?? 'TBD';
        
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
            (:sectionId, :subjectId, :teacherProfileId, :dayOfWeek, :startTime, :endTime, :room, :statusId)
        ";
        
        $stmt = $db->prepare($insertQuery);
        $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $stmt->bindParam(':subjectId', $slot['subject'], PDO::PARAM_INT);
        $stmt->bindParam(':teacherProfileId', $teacherProfileId, PDO::PARAM_INT);
        $stmt->bindParam(':dayOfWeek', $slotDay, PDO::PARAM_STR);
        $stmt->bindParam(':startTime', $startTime, PDO::PARAM_STR);
        $stmt->bindParam(':endTime', $endTime, PDO::PARAM_STR);
        $stmt->bindParam(':room', $room, PDO::PARAM_STR);
        $stmt->bindParam(':statusId', $statusId, PDO::PARAM_INT);
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
