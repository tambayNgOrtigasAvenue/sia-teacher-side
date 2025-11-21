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
    if (!isset($data->studentProfileId) || !isset($data->sectionId) || 
        !isset($data->quarter) || !isset($data->gradeValue) || !isset($data->subjectId)) {
        throw new Exception('Missing required fields: studentProfileId, sectionId, quarter, gradeValue, subjectId');
    }
    
    $studentProfileId = (int)$data->studentProfileId;
    $sectionId = (int)$data->sectionId;
    $subjectId = (int)$data->subjectId;
    $quarter = $data->quarter; // q1, q2, q3, q4
    $gradeValue = (float)$data->gradeValue;
    $remarks = isset($data->remarks) ? trim($data->remarks) : null;
    $teacherUserId = $_SESSION['user_id'];
    
    // Validate grade value (0-100)
    if ($gradeValue < 0 || $gradeValue > 100) {
        throw new Exception('Grade value must be between 0 and 100');
    }
    
    // Convert quarter format (q1 -> First Quarter)
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
    
    // Step 1: Get enrollment ID for this student in this section
    $enrollmentQuery = "
        SELECT e.EnrollmentID, e.SchoolYearID
        FROM enrollment e
        WHERE e.StudentProfileID = :studentProfileId
        AND e.SectionID = :sectionId
    ";
    
    $enrollStmt = $db->prepare($enrollmentQuery);
    $enrollStmt->bindParam(':studentProfileId', $studentProfileId, PDO::PARAM_INT);
    $enrollStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $enrollStmt->execute();
    $enrollment = $enrollStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$enrollment) {
        throw new Exception('Student is not enrolled in this section');
    }
    
    $enrollmentId = $enrollment['EnrollmentID'];
    
    // Step 2: Verify subject exists and belongs to the correct grade level
    $subjectVerifyQuery = "
        SELECT s.SubjectID, s.SubjectName
        FROM subject s
        JOIN section sec ON s.GradeLevelID = sec.GradeLevelID
        WHERE s.SubjectID = :subjectId
        AND sec.SectionID = :sectionId
        AND s.IsActive = 1
    ";
    
    $subjectStmt = $db->prepare($subjectVerifyQuery);
    $subjectStmt->bindParam(':subjectId', $subjectId, PDO::PARAM_INT);
    $subjectStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $subjectStmt->execute();
    
    if ($subjectStmt->rowCount() === 0) {
        throw new Exception('Invalid subject for this grade level');
    }
    
    // Step 3: Check if grade already exists for this enrollment, subject, and quarter
    $checkQuery = "
        SELECT GradeID, GradeValue, Remarks
        FROM grade
        WHERE EnrollmentID = :enrollmentId
        AND SubjectID = :subjectId
        AND Quarter = :quarter
    ";
    
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':enrollmentId', $enrollmentId, PDO::PARAM_INT);
    $checkStmt->bindParam(':subjectId', $subjectId, PDO::PARAM_INT);
    $checkStmt->bindParam(':quarter', $quarterValue, PDO::PARAM_STR);
    $checkStmt->execute();
    $existingGrade = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($existingGrade) {
        // Update existing grade
        $updateQuery = "
            UPDATE grade 
            SET GradeValue = :gradeValue,
                Remarks = :remarks,
                ModifiedByUserID = :teacherUserId,
                LastModified = NOW()
            WHERE GradeID = :gradeId
        ";
        
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':gradeValue', $gradeValue, PDO::PARAM_STR);
        $updateStmt->bindParam(':remarks', $remarks, PDO::PARAM_STR);
        $updateStmt->bindParam(':teacherUserId', $teacherUserId, PDO::PARAM_INT);
        $updateStmt->bindParam(':gradeId', $existingGrade['GradeID'], PDO::PARAM_INT);
        $updateStmt->execute();
        
        $gradeId = $existingGrade['GradeID'];
        $action = 'updated';
    } else {
        // Insert new grade
        $insertQuery = "
            INSERT INTO grade (
                EnrollmentID,
                SubjectID,
                Quarter,
                GradeValue,
                Remarks,
                ModifiedByUserID
            ) VALUES (
                :enrollmentId,
                :subjectId,
                :quarter,
                :gradeValue,
                :remarks,
                :teacherUserId
            )
        ";
        
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(':enrollmentId', $enrollmentId, PDO::PARAM_INT);
        $insertStmt->bindParam(':subjectId', $subjectId, PDO::PARAM_INT);
        $insertStmt->bindParam(':quarter', $quarterValue, PDO::PARAM_STR);
        $insertStmt->bindParam(':gradeValue', $gradeValue, PDO::PARAM_STR);
        $insertStmt->bindParam(':remarks', $remarks, PDO::PARAM_STR);
        $insertStmt->bindParam(':teacherUserId', $teacherUserId, PDO::PARAM_INT);
        $insertStmt->execute();
        
        $gradeId = $db->lastInsertId();
        $action = 'created';
    }
    
    // Step 4: Calculate final grade if all 4 quarters are complete
    $finalGrade = null;
    $allGradesQuery = "
        SELECT Quarter, GradeValue
        FROM grade
        WHERE EnrollmentID = :enrollmentId
        AND SubjectID = :subjectId
        AND Quarter IN ('First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter')
    ";
    
    $allGradesStmt = $db->prepare($allGradesQuery);
    $allGradesStmt->bindParam(':enrollmentId', $enrollmentId, PDO::PARAM_INT);
    $allGradesStmt->bindParam(':subjectId', $subjectId, PDO::PARAM_INT);
    $allGradesStmt->execute();
    $allGrades = $allGradesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Check if all 4 quarters have grades
    if (count($allGrades) == 4) {
        $total = 0;
        foreach ($allGrades as $grade) {
            $total += $grade['GradeValue'];
        }
        $finalGrade = round($total / 4, 2);
    }
    
    $db->commit();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => "Grade {$action} successfully",
        'data' => [
            'gradeId' => $gradeId,
            'quarter' => $quarter,
            'gradeValue' => $gradeValue,
            'remarks' => $remarks,
            'finalGrade' => $finalGrade,
            'action' => $action
        ]
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
