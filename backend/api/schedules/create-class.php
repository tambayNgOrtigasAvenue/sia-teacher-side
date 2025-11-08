<?php
/**
 * API Endpoint: Create Class for Section
 * Method: POST
 * Allows teacher to create a new class (schedule) for a section
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
    
    // Get teacher profile ID
    $teacherQuery = "
        SELECT tp.TeacherProfileID 
        FROM teacherprofile tp
        JOIN profile p ON tp.ProfileID = p.ProfileID
        WHERE p.UserID = :userId
    ";
    
    $stmt = $db->prepare($teacherQuery);
    $stmt->bindParam(':userId', $_SESSION['user_id']);
    $stmt->execute();
    $teacher = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$teacher) {
        throw new Exception('Teacher profile not found.');
    }
    
    $teacherProfileId = $teacher['TeacherProfileID'];
    
    // Validate required fields
    if (empty($input['sectionId']) || empty($input['subjectId'])) {
        throw new Exception('Section ID and Subject ID are required.');
    }
    
    $sectionId = $input['sectionId'];
    $subjectId = $input['subjectId'];
    $dayOfWeek = $input['dayOfWeek'] ?? 'Monday';
    $startTime = $input['startTime'] ?? '08:00:00';
    $endTime = $input['endTime'] ?? '09:00:00';
    $roomNumber = $input['roomNumber'] ?? 'TBD';
    
    // Check if class already exists for this section, subject, and time
    $checkQuery = "
        SELECT ScheduleID FROM classschedule 
        WHERE SectionID = :sectionId 
        AND SubjectID = :subjectId 
        AND DayOfWeek = :dayOfWeek 
        AND StartTime = :startTime
        LIMIT 1
    ";
    
    $stmt = $db->prepare($checkQuery);
    $stmt->bindParam(':sectionId', $sectionId);
    $stmt->bindParam(':subjectId', $subjectId);
    $stmt->bindParam(':dayOfWeek', $dayOfWeek);
    $stmt->bindParam(':startTime', $startTime);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        throw new Exception('A class already exists for this section, subject, and time slot.');
    }
    
    // Insert new class schedule
    $insertQuery = "
        INSERT INTO classschedule 
        (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber, ScheduleStatusID)
        VALUES 
        (:sectionId, :subjectId, :teacherProfileId, :dayOfWeek, :startTime, :endTime, :roomNumber, 1)
    ";
    
    $stmt = $db->prepare($insertQuery);
    $stmt->bindParam(':sectionId', $sectionId);
    $stmt->bindParam(':subjectId', $subjectId);
    $stmt->bindParam(':teacherProfileId', $teacherProfileId);
    $stmt->bindParam(':dayOfWeek', $dayOfWeek);
    $stmt->bindParam(':startTime', $startTime);
    $stmt->bindParam(':endTime', $endTime);
    $stmt->bindParam(':roomNumber', $roomNumber);
    $stmt->execute();
    
    $scheduleId = $db->lastInsertId();
    
    $db->commit();
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Class created successfully!',
        'data' => [
            'scheduleId' => $scheduleId,
            'sectionId' => $sectionId,
            'subjectId' => $subjectId,
            'teacherProfileId' => $teacherProfileId
        ]
    ]);
    
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error creating class: ' . $e->getMessage()
    ]);
}
?>
