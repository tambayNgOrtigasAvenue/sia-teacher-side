<?php
session_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

header("Content-Type: application/json; charset=UTF-8");

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please log in.'
    ]);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
    exit();
}

try {
    // Get database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Get request body
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (!isset($input['studentId']) || !isset($input['status']) || !isset($input['date'])) {
        throw new Exception('Student ID, status, and date are required');
    }
    
    $studentId = (int)$input['studentId'];
    $status = $input['status'];
    $attendanceDate = $input['date'];
    $notes = isset($input['notes']) ? $input['notes'] : null;
    
    // Validate status
    $validStatuses = ['Present', 'Absent', 'Late', 'Excused'];
    if (!in_array($status, $validStatuses)) {
        throw new Exception('Invalid attendance status');
    }
    
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
        throw new Exception('Teacher profile not found');
    }
    
    $teacherProfileId = (int)$teacher['TeacherProfileID'];
    
    // Get the ClassScheduleID for this student and teacher
    // First, get the student's section
    $sectionQuery = "
        SELECT e.SectionID
        FROM enrollment e
        WHERE e.StudentProfileID = :studentId
        LIMIT 1
    ";
    $stmt = $db->prepare($sectionQuery);
    $stmt->bindParam(':studentId', $studentId, PDO::PARAM_INT);
    $stmt->execute();
    $enrollment = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$enrollment) {
        throw new Exception('Student enrollment not found');
    }
    
    $sectionId = (int)$enrollment['SectionID'];
    
    // Now get the schedule for this section and teacher
    $scheduleQuery = "
        SELECT cs.ScheduleID 
        FROM classschedule cs
        WHERE cs.SectionID = :sectionId
        AND cs.TeacherProfileID = :teacherId
        LIMIT 1
    ";
    $stmt = $db->prepare($scheduleQuery);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $stmt->bindParam(':teacherId', $teacherProfileId, PDO::PARAM_INT);
    $stmt->execute();
    $schedule = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // If no schedule found, use default value of 1
    $classScheduleId = $schedule ? (int)$schedule['ScheduleID'] : 1;
    
    // Check if attendance record already exists
    $checkQuery = "
        SELECT AttendanceID 
        FROM attendance 
        WHERE StudentProfileID = :studentId 
        AND DATE(AttendanceDate) = :attendanceDate
    ";
    $stmt = $db->prepare($checkQuery);
    $stmt->bindParam(':studentId', $studentId, PDO::PARAM_INT);
    $stmt->bindParam(':attendanceDate', $attendanceDate, PDO::PARAM_STR);
    $stmt->execute();
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($existing) {
        // Update existing record
        $updateQuery = "
            UPDATE attendance 
            SET AttendanceStatus = :status,
                Notes = :notes
            WHERE AttendanceID = :attendanceId
        ";
        $stmt = $db->prepare($updateQuery);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->bindParam(':notes', $notes, PDO::PARAM_STR);
        $stmt->bindParam(':attendanceId', $existing['AttendanceID'], PDO::PARAM_INT);
        $stmt->execute();
        
        $message = 'Attendance updated successfully';
    } else {
        // Insert new record
        $insertQuery = "
            INSERT INTO attendance 
            (StudentProfileID, ClassScheduleID, AttendanceDate, AttendanceStatus, Notes, CheckInTime)
            VALUES 
            (:studentId, :classScheduleId, :attendanceDate, :status, :notes, NOW())
        ";
        $stmt = $db->prepare($insertQuery);
        $stmt->bindParam(':studentId', $studentId, PDO::PARAM_INT);
        $stmt->bindParam(':classScheduleId', $classScheduleId, PDO::PARAM_INT);
        $stmt->bindParam(':attendanceDate', $attendanceDate, PDO::PARAM_STR);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->bindParam(':notes', $notes, PDO::PARAM_STR);
        $stmt->execute();
        
        $message = 'Attendance recorded successfully';
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => $message
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
