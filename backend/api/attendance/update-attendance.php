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
    
    // Get section ID from input
    if (!isset($input['sectionId'])) {
        throw new Exception('Section ID is required');
    }
    $sectionId = (int)$input['sectionId'];

    // Verify student is enrolled in this section
    $enrollmentQuery = "
        SELECT EnrollmentID
        FROM enrollment
        WHERE StudentProfileID = :studentId
        AND SectionID = :sectionId
        LIMIT 1
    ";
    $stmt = $db->prepare($enrollmentQuery);
    $stmt->bindParam(':studentId', $studentId, PDO::PARAM_INT);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $stmt->execute();
    
    if (!$stmt->fetch()) {
        throw new Exception('Student is not enrolled in this section');
    }
    
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
    
    // If no schedule found for this teacher, try to get any schedule for this section
    if (!$schedule) {
        $fallbackQuery = "
            SELECT cs.ScheduleID 
            FROM classschedule cs
            WHERE cs.SectionID = :sectionId
            LIMIT 1
        ";
        $stmt = $db->prepare($fallbackQuery);
        $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $stmt->execute();
        $schedule = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // If still no schedule found, create a default one for this section
    if (!$schedule) {
        // Create a default schedule entry for this section
        $createScheduleQuery = "
            INSERT INTO classschedule 
            (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
            VALUES 
            (:sectionId, 1, :teacherId, 'Monday', '08:00:00', '09:00:00', 'TBA')
        ";
        $stmt = $db->prepare($createScheduleQuery);
        $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $stmt->bindParam(':teacherId', $teacherProfileId, PDO::PARAM_INT);
        $stmt->execute();
        
        $classScheduleId = (int)$db->lastInsertId();
    } else {
        $classScheduleId = (int)$schedule['ScheduleID'];
    }
    
    // Check if attendance record already exists
    $checkQuery = "
        SELECT AttendanceID 
        FROM attendance 
        WHERE StudentProfileID = :studentId 
        AND ClassScheduleID = :classScheduleId
        AND DATE(AttendanceDate) = :attendanceDate
    ";
    $stmt = $db->prepare($checkQuery);
    $stmt->bindParam(':studentId', $studentId, PDO::PARAM_INT);
    $stmt->bindParam(':classScheduleId', $classScheduleId, PDO::PARAM_INT);
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
    error_log("Attendance update error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'debug' => [
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ]);
} catch (PDOException $e) {
    error_log("Database error in attendance update: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
