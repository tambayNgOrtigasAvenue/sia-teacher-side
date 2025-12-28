<?php
/**
 * API Endpoint: Get Attendance Report
 * Method: GET
 * Returns attendance summary for students in a section
 * 
 * Query Parameters:
 * - sectionId (required): The section ID to get attendance for
 * - quarter (optional): 'First', 'Second', 'Third', 'Fourth' to filter by quarter
 */

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
    
    // Get quarter parameter
    $quarter = isset($_GET['quarter']) ? $_GET['quarter'] : 'First';
    
    // Get current year
    $currentYear = date('Y');
    
    // Define quarter date ranges (approximate school year quarters)
    // Adjust these dates based on your school's actual quarter dates
    $quarterDates = [
        'First' => [
            'start' => $currentYear . '-06-01',  // June 1
            'end' => $currentYear . '-08-31'     // August 31
        ],
        'Second' => [
            'start' => $currentYear . '-09-01',  // September 1
            'end' => $currentYear . '-11-30'     // November 30
        ],
        'Third' => [
            'start' => $currentYear . '-12-01',  // December 1
            'end' => ($currentYear + 1) . '-02-28' // February 28
        ],
        'Fourth' => [
            'start' => ($currentYear + 1) . '-03-01', // March 1
            'end' => ($currentYear + 1) . '-05-31'    // May 31
        ]
    ];
    
    // Use selected quarter dates or default to First
    $startDate = $quarterDates[$quarter]['start'] ?? $quarterDates['First']['start'];
    $endDate = $quarterDates[$quarter]['end'] ?? $quarterDates['First']['end'];
    
    // Get SchoolYearID for the section
    $sectionQuery = "SELECT SchoolYearID FROM section WHERE SectionID = :sectionId";
    $sectionStmt = $db->prepare($sectionQuery);
    $sectionStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $sectionStmt->execute();
    $schoolYearId = $sectionStmt->fetchColumn();

    // Get attendance summary for the quarter
    $query = "
        SELECT 
            sp.StudentProfileID as id,
            CONCAT(p.LastName, ', ', p.FirstName) as name,
            COUNT(CASE WHEN a.AttendanceStatus = 'Present' THEN 1 END) as totalPresent,
            COUNT(CASE WHEN a.AttendanceStatus = 'Absent' THEN 1 END) as totalAbsent,
            COUNT(CASE WHEN a.AttendanceStatus = 'Late' THEN 1 END) as totalLate,
            COUNT(CASE WHEN a.AttendanceStatus = 'Excused' THEN 1 END) as totalExcused
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
        LEFT JOIN attendance a ON sp.StudentProfileID = a.StudentProfileID
            AND DATE(a.AttendanceDate) >= :startDate
            AND DATE(a.AttendanceDate) <= :endDate
        WHERE e.SectionID = :sectionId
        AND e.SchoolYearID = :schoolYearId
        AND e.EnrollmentID IN (
            SELECT MAX(EnrollmentID) 
            FROM enrollment 
            WHERE StudentProfileID = sp.StudentProfileID
            AND SchoolYearID = :schoolYearId
            GROUP BY StudentProfileID
        )
        GROUP BY sp.StudentProfileID, p.LastName, p.FirstName
        ORDER BY p.LastName ASC, p.FirstName ASC
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $stmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $stmt->bindParam(':startDate', $startDate, PDO::PARAM_STR);
    $stmt->bindParam(':endDate', $endDate, PDO::PARAM_STR);
    $stmt->execute();
    
    $students = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $students[] = [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'totalPresent' => (int)$row['totalPresent'],
            'totalAbsent' => (int)$row['totalAbsent'],
            'totalLate' => (int)$row['totalLate'],
            'totalExcused' => (int)$row['totalExcused']
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $students,
        'quarter' => $quarter,
        'sectionId' => $sectionId,
        'dateRange' => [
            'start' => $startDate,
            'end' => $endDate
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
