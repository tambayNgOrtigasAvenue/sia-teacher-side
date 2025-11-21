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
    
    // Get posted data
    $data = json_decode(file_get_contents("php://input"));
    
    // Validate required fields
    if (!isset($data->sectionId)) {
        throw new Exception('Section ID is required');
    }
    
    $sectionId = (int)$data->sectionId;
    $teacherUserId = $_SESSION['user_id'];
    
    // Get teacher profile ID
    $teacherQuery = "SELECT TeacherProfileID FROM teacherprofile WHERE UserID = :userId";
    $teacherStmt = $db->prepare($teacherQuery);
    $teacherStmt->bindParam(':userId', $teacherUserId, PDO::PARAM_INT);
    $teacherStmt->execute();
    $teacherResult = $teacherStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$teacherResult) {
        throw new Exception('Teacher profile not found');
    }
    
    $teacherProfileId = $teacherResult['TeacherProfileID'];
    
    // Get Approved status ID
    $statusQuery = "SELECT StatusID FROM schedulestatus WHERE StatusName = 'Approved' LIMIT 1";
    $statusStmt = $db->prepare($statusQuery);
    $statusStmt->execute();
    $statusResult = $statusStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$statusResult) {
        throw new Exception('Approved status not found');
    }
    
    $approvedStatusId = $statusResult['StatusID'];
    
    $db->beginTransaction();
    
    // Check if this section already has schedules
    $checkQuery = "
        SELECT COUNT(*) as scheduleCount 
        FROM classschedule 
        WHERE SectionID = :sectionId
    ";
    
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $checkStmt->execute();
    $checkResult = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($checkResult['scheduleCount'] == 0) {
        // No schedules exist - need to create basic schedule entries first
        // Get all subjects for this grade level
        $subjectQuery = "
            SELECT sub.SubjectID
            FROM subject sub
            JOIN section sec ON sub.GradeLevelID = sec.GradeLevelID
            WHERE sec.SectionID = :sectionId
            AND sub.IsActive = 1
        ";
        
        $subjectStmt = $db->prepare($subjectQuery);
        $subjectStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $subjectStmt->execute();
        $subjects = $subjectStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Create basic schedule for each subject (Monday, 8:00-9:00 as default)
        foreach ($subjects as $subject) {
            $insertQuery = "
                INSERT INTO classschedule (
                    SectionID,
                    SubjectID,
                    TeacherProfileID,
                    DayOfWeek,
                    StartTime,
                    EndTime,
                    ScheduleStatusID,
                    RoomNumber
                ) VALUES (
                    :sectionId,
                    :subjectId,
                    :teacherProfileId,
                    'Monday',
                    '08:00:00',
                    '09:00:00',
                    :statusId,
                    'TBD'
                )
            ";
            
            $insertStmt = $db->prepare($insertQuery);
            $insertStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
            $insertStmt->bindParam(':subjectId', $subject['SubjectID'], PDO::PARAM_INT);
            $insertStmt->bindParam(':teacherProfileId', $teacherProfileId, PDO::PARAM_INT);
            $insertStmt->bindParam(':statusId', $approvedStatusId, PDO::PARAM_INT);
            $insertStmt->execute();
        }
    } else {
        // Update existing schedules to Approved status
        $updateQuery = "
            UPDATE classschedule 
            SET ScheduleStatusID = :statusId
            WHERE SectionID = :sectionId
        ";
        
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':statusId', $approvedStatusId, PDO::PARAM_INT);
        $updateStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $updateStmt->execute();
    }
    
    $db->commit();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Section approved successfully'
    ]);
    
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
