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
    $database = new Database();
    $db = $database->getConnection();
    
    // Get posted data
    $data = json_decode(file_get_contents("php://input"));
    
    // Validate required fields
    if (!isset($data->sectionId) || !isset($data->quarter)) {
        throw new Exception('Missing required fields: sectionId, quarter');
    }
    
    $sectionId = (int)$data->sectionId;
    $quarter = $data->quarter; // q1, q2, q3, q4
    $teacherNotes = isset($data->notes) ? trim($data->notes) : null;
    $teacherUserId = $_SESSION['user_id'];
    
    // Convert quarter format
    $quarterMap = [
        'q1' => 'First Quarter',
        'q2' => 'Second Quarter',
        'q3' => 'Third Quarter',
        'q4' => 'Fourth Quarter'
    ];
    
    if (!isset($quarterMap[$quarter])) {
        throw new Exception('Invalid quarter value. Must be q1, q2, q3, or q4');
    }
    
    $quarterValue = $quarterMap[$quarter];
    
    $db->beginTransaction();
    
    // Get the active school year
    $schoolYearQuery = "SELECT SchoolYearID FROM schoolyear WHERE IsActive = 1 LIMIT 1";
    $schoolYearStmt = $db->prepare($schoolYearQuery);
    $schoolYearStmt->execute();
    $schoolYear = $schoolYearStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$schoolYear) {
        throw new Exception('No active school year found');
    }
    
    $schoolYearId = $schoolYear['SchoolYearID'];
     
    // Check if grading deadline is still active
    $deadlineCheck = "
        SELECT 
            DeadlineDate,
            CASE 
                WHEN NOW() BETWEEN StartDate AND DeadlineDate THEN 'active'
                ELSE 'expired'
            END as status
        FROM gradesubmissiondeadline
        WHERE SchoolYearID = :schoolYearId
        AND Quarter = :quarter
        LIMIT 1
    ";
    $deadlineCheckStmt = $db->prepare($deadlineCheck);
    $deadlineCheckStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $deadlineCheckStmt->bindParam(':quarter', $quarterValue, PDO::PARAM_STR);
    $deadlineCheckStmt->execute();
    $deadlineInfo = $deadlineCheckStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$deadlineInfo) {
        throw new Exception('No grading deadline has been set for this quarter. Please contact the administrator.');
    }
    
    if ($deadlineInfo['status'] !== 'active') {
        throw new Exception('The grading deadline for this quarter has passed. You can no longer submit grades.');
    }
    
    // Get section info and verify teacher has access
    $sectionQuery = "
        SELECT s.SectionID, s.SectionName, s.GradeLevelID, gl.LevelName
        FROM section s
        JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
        WHERE s.SectionID = :sectionId
    ";
    $sectionStmt = $db->prepare($sectionQuery);
    $sectionStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $sectionStmt->execute();
    $section = $sectionStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$section) {
        throw new Exception('Section not found');
    }
    
    // Count total students in section
    $countStudentsQuery = "
        SELECT COUNT(*) as total
        FROM enrollment e
        WHERE e.SectionID = :sectionId
        AND e.SchoolYearID = :schoolYearId
    ";
    $countStmt = $db->prepare($countStudentsQuery);
    $countStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $countStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $countStmt->execute();
    $totalStudents = (int)$countStmt->fetchColumn();
    
    if ($totalStudents === 0) {
        throw new Exception('No students enrolled in this section');
    }
    
    // Count students with complete grades for this quarter
    // A student has complete grades if ALL subjects for their grade level have grades
    $studentsWithGradesQuery = "
        SELECT COUNT(DISTINCT e.StudentProfileID) as completed
        FROM enrollment e
        WHERE e.SectionID = :sectionId
        AND e.SchoolYearID = :schoolYearId
        AND NOT EXISTS (
            SELECT 1 FROM subject sub
            JOIN section sec ON sub.GradeLevelID = sec.GradeLevelID
            WHERE sec.SectionID = e.SectionID
            AND sub.IsActive = 1
            AND NOT EXISTS (
                SELECT 1 FROM grade g
                WHERE g.EnrollmentID = e.EnrollmentID
                AND g.SubjectID = sub.SubjectID
                AND g.Quarter = :quarter
                AND g.GradeValue IS NOT NULL
            )
        )
    ";
    $gradesStmt = $db->prepare($studentsWithGradesQuery);
    $gradesStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $gradesStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $gradesStmt->bindParam(':quarter', $quarterValue, PDO::PARAM_STR);
    $gradesStmt->execute();
    $studentsWithGrades = (int)$gradesStmt->fetchColumn();
    
    // Check if all students have complete grades
    if ($studentsWithGrades < $totalStudents) {
        throw new Exception("Cannot submit grades. Only {$studentsWithGrades} out of {$totalStudents} students have complete grades for {$quarterValue}.");
    }
    
    // Check if submission already exists
    $checkQuery = "
        SELECT SubmissionID, SubmissionStatus 
        FROM gradesubmission 
        WHERE SectionID = :sectionId 
        AND SchoolYearID = :schoolYearId 
        AND Quarter = :quarter
    ";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $checkStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $checkStmt->bindParam(':quarter', $quarterValue, PDO::PARAM_STR);
    $checkStmt->execute();
    $existingSubmission = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    $submissionId = null;
    $action = '';
    
    if ($existingSubmission) {
        // Update existing submission
        $status = $existingSubmission['SubmissionStatus'];
        
        if ($status === 'Approved') {
            throw new Exception('Grades for this quarter have already been approved by the registrar.');
        }
        
        // If rejected, change to resubmitted; otherwise submitted
        $newStatus = ($status === 'Rejected') ? 'Resubmitted' : 'Submitted';
        
        $updateQuery = "
            UPDATE gradesubmission 
            SET SubmissionStatus = :status,
                SubmittedByUserID = :userId,
                SubmittedDate = NOW(),
                TotalStudents = :totalStudents,
                StudentsWithGrades = :studentsWithGrades,
                TeacherNotes = :notes
            WHERE SubmissionID = :submissionId
        ";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':status', $newStatus, PDO::PARAM_STR);
        $updateStmt->bindParam(':userId', $teacherUserId, PDO::PARAM_INT);
        $updateStmt->bindParam(':totalStudents', $totalStudents, PDO::PARAM_INT);
        $updateStmt->bindParam(':studentsWithGrades', $studentsWithGrades, PDO::PARAM_INT);
        $updateStmt->bindParam(':notes', $teacherNotes, PDO::PARAM_STR);
        $updateStmt->bindParam(':submissionId', $existingSubmission['SubmissionID'], PDO::PARAM_INT);
        $updateStmt->execute();
        
        $submissionId = $existingSubmission['SubmissionID'];
        $action = $newStatus === 'Resubmitted' ? 'resubmitted' : 'updated';
    } else {
        // Create new submission
        $insertQuery = "
            INSERT INTO gradesubmission (
                SectionID, SchoolYearID, Quarter, SubmissionStatus,
                SubmittedByUserID, SubmittedDate, TotalStudents, 
                StudentsWithGrades, TeacherNotes
            ) VALUES (
                :sectionId, :schoolYearId, :quarter, 'Submitted',
                :userId, NOW(), :totalStudents, 
                :studentsWithGrades, :notes
            )
        ";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $insertStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
        $insertStmt->bindParam(':quarter', $quarterValue, PDO::PARAM_STR);
        $insertStmt->bindParam(':userId', $teacherUserId, PDO::PARAM_INT);
        $insertStmt->bindParam(':totalStudents', $totalStudents, PDO::PARAM_INT);
        $insertStmt->bindParam(':studentsWithGrades', $studentsWithGrades, PDO::PARAM_INT);
        $insertStmt->bindParam(':notes', $teacherNotes, PDO::PARAM_STR);
        $insertStmt->execute();
        
        $submissionId = $db->lastInsertId();
        $action = 'submitted';
    }
    
    // Update the grade status for all grades in this quarter/section to "Submitted"
    $updateGradesQuery = "
        UPDATE grade g
        JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
        SET g.GradeStatusID = (SELECT StatusID FROM gradestatus WHERE StatusName = 'Submitted' LIMIT 1)
        WHERE e.SectionID = :sectionId
        AND e.SchoolYearID = :schoolYearId
        AND g.Quarter = :quarter
        AND g.GradeValue IS NOT NULL
    ";
    $updateGradesStmt = $db->prepare($updateGradesQuery);
    $updateGradesStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $updateGradesStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $updateGradesStmt->bindParam(':quarter', $quarterValue, PDO::PARAM_STR);
    $updateGradesStmt->execute();
    
    $db->commit();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => "Grades successfully {$action} to registrar for review.",
        'data' => [
            'submissionId' => $submissionId,
            'sectionId' => $sectionId,
            'sectionName' => $section['SectionName'],
            'gradeLevel' => $section['LevelName'],
            'quarter' => $quarterValue,
            'totalStudents' => $totalStudents,
            'studentsWithGrades' => $studentsWithGrades,
            'status' => $action === 'resubmitted' ? 'Resubmitted' : 'Submitted',
            'submittedDate' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
