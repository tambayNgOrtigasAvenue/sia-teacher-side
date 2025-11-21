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
    // Get database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Get section ID from query parameters
    if (!isset($_GET['sectionId'])) {
        throw new Exception('Section ID is required');
    }
    
    $sectionId = (int)$_GET['sectionId'];
    
    // If subjectId is provided, use it; otherwise get first subject for the grade level
    if (isset($_GET['subjectId'])) {
        $subjectId = (int)$_GET['subjectId'];
    } else {
        // Get first subject for this section's grade level
        $subjectQuery = "
            SELECT s.SubjectID
            FROM subject s
            JOIN section sec ON s.GradeLevelID = sec.GradeLevelID
            WHERE sec.SectionID = :sectionId
            AND s.IsActive = 1
            ORDER BY s.SubjectName ASC
            LIMIT 1
        ";
        
        $subjectStmt = $db->prepare($subjectQuery);
        $subjectStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $subjectStmt->execute();
        $subjectResult = $subjectStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$subjectResult) {
            throw new Exception('No subjects found for this grade level');
        }
        
        $subjectId = (int)$subjectResult['SubjectID'];
    }
    
    // Fetch all students with their grades for this section
    $query = "
        SELECT 
            sp.StudentProfileID as id,
            p.FirstName as firstName,
            p.LastName as lastName,
            sp.StudentNumber as studentNumber,
            MAX(CASE WHEN g.Quarter = 'First Quarter' THEN g.GradeValue END) as q1,
            MAX(CASE WHEN g.Quarter = 'Second Quarter' THEN g.GradeValue END) as q2,
            MAX(CASE WHEN g.Quarter = 'Third Quarter' THEN g.GradeValue END) as q3,
            MAX(CASE WHEN g.Quarter = 'Fourth Quarter' THEN g.GradeValue END) as q4,
            MAX(g.Remarks) as remarks
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
        LEFT JOIN grade g ON e.EnrollmentID = g.EnrollmentID AND g.SubjectID = :subjectId
        WHERE e.SectionID = :sectionId
        GROUP BY sp.StudentProfileID, p.FirstName, p.LastName, sp.StudentNumber
        ORDER BY p.LastName ASC, p.FirstName ASC
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $stmt->bindParam(':subjectId', $subjectId, PDO::PARAM_INT);
    $stmt->execute();
    
    $students = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Calculate final grade if all quarters are complete
        $finalGrade = null;
        if ($row['q1'] !== null && $row['q2'] !== null && 
            $row['q3'] !== null && $row['q4'] !== null) {
            $finalGrade = round(($row['q1'] + $row['q2'] + $row['q3'] + $row['q4']) / 4, 2);
        }
        
        $students[] = [
            'id' => (int)$row['id'],
            'firstName' => $row['firstName'],
            'lastName' => $row['lastName'],
            'studentNumber' => $row['studentNumber'],
            'grades' => [
                'q1' => $row['q1'] ? (float)$row['q1'] : null,
                'q2' => $row['q2'] ? (float)$row['q2'] : null,
                'q3' => $row['q3'] ? (float)$row['q3'] : null,
                'q4' => $row['q4'] ? (float)$row['q4'] : null,
                'final' => $finalGrade,
                'remarks' => $row['remarks']
            ]
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $students
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
