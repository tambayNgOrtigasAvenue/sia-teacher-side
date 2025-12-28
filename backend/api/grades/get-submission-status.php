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

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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
    
    // Get section ID from query params
    if (!isset($_GET['sectionId'])) {
        throw new Exception('Missing required parameter: sectionId');
    }
    
    $sectionId = (int)$_GET['sectionId'];
    
    // Get the active school year
    $schoolYearQuery = "SELECT SchoolYearID FROM schoolyear WHERE IsActive = 1 LIMIT 1";
    $schoolYearStmt = $db->prepare($schoolYearQuery);
    $schoolYearStmt->execute();
    $schoolYear = $schoolYearStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$schoolYear) {
        throw new Exception('No active school year found');
    }
    
    $schoolYearId = $schoolYear['SchoolYearID'];
    
    // Get section info
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
    
    // Get all submission statuses for this section
    $submissionsQuery = "
        SELECT 
            gs.SubmissionID,
            gs.Quarter,
            gs.SubmissionStatus,
            gs.SubmittedDate,
            gs.TotalStudents,
            gs.StudentsWithGrades,
            gs.ReviewedDate,
            gs.RegistrarNotes,
            gs.TeacherNotes,
            CONCAT(p.FirstName, ' ', p.LastName) as SubmittedBy,
            CONCAT(rp.FirstName, ' ', rp.LastName) as ReviewedBy
        FROM gradesubmission gs
        LEFT JOIN user u ON gs.SubmittedByUserID = u.UserID
        LEFT JOIN profile p ON u.UserID = p.UserID
        LEFT JOIN user ru ON gs.ReviewedByUserID = ru.UserID
        LEFT JOIN profile rp ON ru.UserID = rp.UserID
        WHERE gs.SectionID = :sectionId
        AND gs.SchoolYearID = :schoolYearId
        ORDER BY FIELD(gs.Quarter, 'First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter')
    ";
    $submissionsStmt = $db->prepare($submissionsQuery);
    $submissionsStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $submissionsStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $submissionsStmt->execute();
    $submissions = $submissionsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get total students in section
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
    
    // Get grade completion status for each quarter
    $quarters = ['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'];
    $quarterStatus = [];
    
    foreach ($quarters as $quarter) {
        // Count students with complete grades for this quarter
        $gradesQuery = "
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
        $gradesStmt = $db->prepare($gradesQuery);
        $gradesStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $gradesStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
        $gradesStmt->bindParam(':quarter', $quarter, PDO::PARAM_STR);
        $gradesStmt->execute();
        $studentsWithGrades = (int)$gradesStmt->fetchColumn();
        
        // Find submission for this quarter
        $submission = null;
        foreach ($submissions as $sub) {
            if ($sub['Quarter'] === $quarter) {
                $submission = $sub;
                break;
            }
        }
        
        $quarterKey = strtolower(str_replace(' ', '', $quarter)); // 'firstquarter', etc.
        $shortKey = 'q' . (array_search($quarter, $quarters) + 1); // 'q1', 'q2', etc.
        
        $quarterStatus[$shortKey] = [
            'quarter' => $quarter,
            'totalStudents' => $totalStudents,
            'studentsWithGrades' => $studentsWithGrades,
            'isComplete' => $studentsWithGrades >= $totalStudents && $totalStudents > 0,
            'submissionStatus' => $submission ? $submission['SubmissionStatus'] : 'Draft',
            'submittedDate' => $submission ? $submission['SubmittedDate'] : null,
            'submittedBy' => $submission ? $submission['SubmittedBy'] : null,
            'reviewedDate' => $submission ? $submission['ReviewedDate'] : null,
            'reviewedBy' => $submission ? $submission['ReviewedBy'] : null,
            'registrarNotes' => $submission ? $submission['RegistrarNotes'] : null,
            'teacherNotes' => $submission ? $submission['TeacherNotes'] : null,
            'canSubmit' => ($studentsWithGrades >= $totalStudents && $totalStudents > 0) && 
                           (!$submission || !in_array($submission['SubmissionStatus'], ['Submitted', 'Approved', 'Resubmitted']))
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'section' => [
                'id' => $section['SectionID'],
                'name' => $section['SectionName'],
                'gradeLevel' => $section['LevelName']
            ],
            'totalStudents' => $totalStudents,
            'quarters' => $quarterStatus
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
