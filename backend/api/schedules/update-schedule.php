<?php
/**
 * API Endpoint: Update Schedule
 * Method: POST
 * Updates an existing class schedule
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
    if (empty($input['scheduleId'])) {
        throw new Exception('Schedule ID is required.');
    }
    
    $scheduleId = $input['scheduleId'];
    $teacherProfileId = isset($input['teacherProfileId']) ? $input['teacherProfileId'] : null;
    $subjectId = isset($input['subjectId']) ? $input['subjectId'] : null;
    $day = isset($input['day']) ? $input['day'] : null;
    $startTime = isset($input['startTime']) ? $input['startTime'] : null;
    $endTime = isset($input['endTime']) ? $input['endTime'] : null;
    $room = isset($input['room']) ? $input['room'] : null;
    
    // Build update query dynamically
    $updates = [];
    $params = [':scheduleId' => $scheduleId];
    
    if ($teacherProfileId !== null) {
        $updates[] = "TeacherProfileID = :teacherProfileId";
        $params[':teacherProfileId'] = $teacherProfileId;
    }
    
    if ($subjectId !== null) {
        $updates[] = "SubjectID = :subjectId";
        $params[':subjectId'] = $subjectId;
    }
    
    if ($day !== null) {
        $updates[] = "DayOfWeek = :day";
        $params[':day'] = $day;
    }
    
    if ($startTime !== null) {
        $updates[] = "StartTime = :startTime";
        $params[':startTime'] = date('H:i:s', strtotime($startTime));
    }
    
    if ($endTime !== null) {
        $updates[] = "EndTime = :endTime";
        $params[':endTime'] = date('H:i:s', strtotime($endTime));
    }
    
    if ($room !== null) {
        $updates[] = "RoomNumber = :room";
        $params[':room'] = $room;
    }
    
    if (empty($updates)) {
        throw new Exception('No fields to update.');
    }
    
    $updateQuery = "UPDATE classschedule SET " . implode(', ', $updates) . " WHERE ScheduleID = :scheduleId";
    
    $stmt = $db->prepare($updateQuery);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();
    
    $db->commit();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Schedule updated successfully.'
    ]);
    
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error updating schedule: ' . $e->getMessage()
    ]);
}
?>
