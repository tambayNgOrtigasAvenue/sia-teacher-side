<?php
/**
 * API Endpoint: Enroll Student with Automatic Section Assignment
 * Method: POST
 * 
 * Automatically assigns student to a section based on:
 * 1. Grade Level
 * 2. Section capacity (max 15 students per section)
 * 3. Assigns to first available section with space
 * 
 * Expected JSON Body:
 * {
 *   "studentProfileId": 123,
 *   "gradeLevelId": 1,
 *   "schoolYearId": 1
 * }
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

// Check authentication (optional for testing, but recommended for production)
// For now, we'll allow the endpoint to work without authentication for testing
// In production, uncomment the following lines:
/*
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated.']);
    exit();
}
*/

// Get request data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['studentProfileId']) || !isset($data['gradeLevelId']) || !isset($data['schoolYearId'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Missing required fields: studentProfileId, gradeLevelId, schoolYearId'
    ]);
    exit();
}

$studentProfileId = $data['studentProfileId'];
$gradeLevelId = $data['gradeLevelId'];
$schoolYearId = $data['schoolYearId'];

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

try {
    $db->beginTransaction();
    
    // Step 0: Verify student exists first
    $verifyStudentQuery = "
        SELECT sp.StudentProfileID, p.FirstName, p.LastName, sp.StudentNumber
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        WHERE sp.StudentProfileID = :studentProfileId
    ";
    
    $verifyStmt = $db->prepare($verifyStudentQuery);
    $verifyStmt->bindParam(':studentProfileId', $studentProfileId, PDO::PARAM_INT);
    $verifyStmt->execute();
    $studentExists = $verifyStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$studentExists) {
        throw new Exception("Student with StudentProfileID {$studentProfileId} not found in the database.");
    }
    
    // Step 1: Find the first available section for the grade level that has less than 15 students
    $sectionQuery = "
        SELECT 
            s.SectionID,
            s.SectionName,
            s.MaxCapacity,
            COALESCE(COUNT(e.EnrollmentID), 0) as CurrentStudentCount
        FROM section s
        LEFT JOIN enrollment e ON s.SectionID = e.SectionID
        WHERE s.GradeLevelID = :gradeLevelId
        AND s.SchoolYearID = :schoolYearId
        GROUP BY s.SectionID, s.SectionName, s.MaxCapacity
        HAVING CurrentStudentCount < 15
        ORDER BY s.SectionName ASC
        LIMIT 1
    ";
    
    $stmt = $db->prepare($sectionQuery);
    $stmt->bindParam(':gradeLevelId', $gradeLevelId, PDO::PARAM_INT);
    $stmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $stmt->execute();
    
    $availableSection = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$availableSection) {
        throw new Exception('No available sections found for this grade level. All sections are full or no sections exist.');
    }
    
    $sectionId = $availableSection['SectionID'];
    $sectionName = $availableSection['SectionName'];
    
    // Step 2: Check if student is already enrolled in this school year
    $checkEnrollmentQuery = "
        SELECT e.EnrollmentID, sec.SectionName, gl.LevelName
        FROM enrollment e
        JOIN section sec ON e.SectionID = sec.SectionID
        JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
        WHERE e.StudentProfileID = :studentProfileId
        AND sec.SchoolYearID = :schoolYearId
    ";
    
    $checkStmt = $db->prepare($checkEnrollmentQuery);
    $checkStmt->bindParam(':studentProfileId', $studentProfileId, PDO::PARAM_INT);
    $checkStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        $existingEnrollment = $checkStmt->fetch(PDO::FETCH_ASSOC);
        throw new Exception("Student {$studentExists['FirstName']} {$studentExists['LastName']} is already enrolled in Grade {$existingEnrollment['LevelName']} - {$existingEnrollment['SectionName']} for this school year.");
    }
    
    // Step 3: Get student information for response
    $studentQuery = "
        SELECT 
            p.FirstName,
            p.LastName,
            sp.StudentNumber
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        WHERE sp.StudentProfileID = :studentProfileId
    ";
    
    $studentStmt = $db->prepare($studentQuery);
    $studentStmt->bindParam(':studentProfileId', $studentProfileId, PDO::PARAM_INT);
    $studentStmt->execute();
    $student = $studentStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$student) {
        throw new Exception('Student profile not found.');
    }
    
    // Step 4: Insert enrollment record
    $enrollmentQuery = "
        INSERT INTO enrollment (
            StudentProfileID,
            SectionID,
            SchoolYearID,
            EnrollmentDate
        ) VALUES (
            :studentProfileId,
            :sectionId,
            :schoolYearId,
            NOW()
        )
    ";
    
    $enrollStmt = $db->prepare($enrollmentQuery);
    $enrollStmt->bindParam(':studentProfileId', $studentProfileId, PDO::PARAM_INT);
    $enrollStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $enrollStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    
    if (!$enrollStmt->execute()) {
        throw new Exception('Failed to create enrollment record.');
    }
    
    $enrollmentId = $db->lastInsertId();
    
    // Step 5: Update section's current enrollment count
    $updateSectionQuery = "
        UPDATE section 
        SET CurrentEnrollment = COALESCE(CurrentEnrollment, 0) + 1
        WHERE SectionID = :sectionId
    ";
    
    $updateStmt = $db->prepare($updateSectionQuery);
    $updateStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $updateStmt->execute();
    
    // Step 6: Get grade level name for response
    $gradeLevelQuery = "SELECT LevelName FROM gradelevel WHERE GradeLevelID = :gradeLevelId";
    $gradeLevelStmt = $db->prepare($gradeLevelQuery);
    $gradeLevelStmt->bindParam(':gradeLevelId', $gradeLevelId, PDO::PARAM_INT);
    $gradeLevelStmt->execute();
    $gradeLevel = $gradeLevelStmt->fetch(PDO::FETCH_ASSOC);
    
    $db->commit();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Student successfully enrolled and assigned to section.',
        'data' => [
            'enrollmentId' => $enrollmentId,
            'studentName' => $student['FirstName'] . ' ' . $student['LastName'],
            'studentNumber' => $student['StudentNumber'],
            'gradeLevel' => 'Grade ' . $gradeLevel['LevelName'],
            'sectionName' => $sectionName,
            'sectionId' => $sectionId,
            'currentStudentCount' => $availableSection['CurrentStudentCount'] + 1
        ]
    ]);
    
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollback();
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
