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
    
    // First, get all students in the section
    $studentQuery = "
        SELECT 
            sp.StudentProfileID as id,
            p.FirstName as firstName,
            p.LastName as lastName,
            p.MiddleName as middleName,
            p.ProfilePictureURL as profilePicture,
            sp.StudentNumber as studentNumber,
            sp.Gender as gender,
            sp.DateOfBirth as birthdate,
            TIMESTAMPDIFF(YEAR, sp.DateOfBirth, CURDATE()) as age,
            CAST(AES_DECRYPT(p.EncryptedAddress, 'encryption_key') AS CHAR) as address,
            CAST(AES_DECRYPT(p.EncryptedPhoneNumber, 'encryption_key') AS CHAR) as contactNumber,
            e.EnrollmentID as enrollmentId
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
        WHERE e.SectionID = :sectionId
        ORDER BY p.LastName ASC, p.FirstName ASC
    ";
    
    $studentStmt = $db->prepare($studentQuery);
    $studentStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $studentStmt->execute();
    
    $students = [];
    
    while ($studentRow = $studentStmt->fetch(PDO::FETCH_ASSOC)) {
        $studentId = (int)$studentRow['id'];
        $enrollmentId = (int)$studentRow['enrollmentId'];
        
        // Get all subjects for this grade level
        $subjectQuery = "
            SELECT s.SubjectID
            FROM subject s
            JOIN section sec ON s.GradeLevelID = sec.GradeLevelID
            WHERE sec.SectionID = :sectionId
            AND s.IsActive = 1
        ";
        
        $subjectStmt = $db->prepare($subjectQuery);
        $subjectStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $subjectStmt->execute();
        
        $subjectIds = $subjectStmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (empty($subjectIds)) {
            // No subjects found, skip this student
            continue;
        }
        
        // Get grades for all subjects for this student
        $placeholders = str_repeat('?,', count($subjectIds) - 1) . '?';
        $gradeQuery = "
            SELECT 
                Quarter,
                SubjectID,
                GradeValue,
                Remarks
            FROM grade
            WHERE EnrollmentID = ?
            AND SubjectID IN ($placeholders)
        ";
        
        $gradeStmt = $db->prepare($gradeQuery);
        $params = array_merge([$enrollmentId], $subjectIds);
        $gradeStmt->execute($params);
        
        $grades = $gradeStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Organize grades by quarter and subject
        $quarterGrades = [
            'q1' => [],
            'q2' => [],
            'q3' => [],
            'q4' => []
        ];
        
        $remarksCollection = [];
        
        foreach ($grades as $grade) {
            $quarter = null;
            switch ($grade['Quarter']) {
                case 'First Quarter':
                    $quarter = 'q1';
                    break;
                case 'Second Quarter':
                    $quarter = 'q2';
                    break;
                case 'Third Quarter':
                    $quarter = 'q3';
                    break;
                case 'Fourth Quarter':
                    $quarter = 'q4';
                    break;
            }
            
            if ($quarter && $grade['GradeValue'] !== null) {
                $quarterGrades[$quarter][] = (float)$grade['GradeValue'];
            }
            
            if (!empty($grade['Remarks'])) {
                $remarksCollection[] = $grade['Remarks'];
            }
        }
        
        // Calculate average for each quarter (only if ALL subjects have grades for that quarter)
        $totalSubjects = count($subjectIds);
        $q1Avg = (count($quarterGrades['q1']) === $totalSubjects) 
            ? round(array_sum($quarterGrades['q1']) / $totalSubjects, 2) 
            : null;
        $q2Avg = (count($quarterGrades['q2']) === $totalSubjects) 
            ? round(array_sum($quarterGrades['q2']) / $totalSubjects, 2) 
            : null;
        $q3Avg = (count($quarterGrades['q3']) === $totalSubjects) 
            ? round(array_sum($quarterGrades['q3']) / $totalSubjects, 2) 
            : null;
        $q4Avg = (count($quarterGrades['q4']) === $totalSubjects) 
            ? round(array_sum($quarterGrades['q4']) / $totalSubjects, 2) 
            : null;
        
        // Calculate final grade if all quarters are complete
        $finalGrade = null;
        if ($q1Avg !== null && $q2Avg !== null && $q3Avg !== null && $q4Avg !== null) {
            $finalGrade = round(($q1Avg + $q2Avg + $q3Avg + $q4Avg) / 4, 2);
        }
        
        // Get most recent remark
        $remark = !empty($remarksCollection) ? end($remarksCollection) : null;
        
        $students[] = [
            'id' => $studentId,
            'firstName' => $studentRow['firstName'],
            'lastName' => $studentRow['lastName'],
            'middleName' => $studentRow['middleName'],
            'profilePicture' => $studentRow['profilePicture'],
            'studentNumber' => $studentRow['studentNumber'],
            'gender' => $studentRow['gender'],
            'birthdate' => $studentRow['birthdate'],
            'age' => $studentRow['age'],
            'address' => $studentRow['address'],
            'contactNumber' => $studentRow['contactNumber'],
            'grades' => [
                'q1' => $q1Avg,
                'q2' => $q2Avg,
                'q3' => $q3Avg,
                'q4' => $q4Avg,
                'final' => $finalGrade,
                'remarks' => $remark
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
