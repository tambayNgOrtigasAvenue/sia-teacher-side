<?php
/**
 * API Endpoint: Get Students by Section
 * Method: GET
 * Returns all students in a specific section with today's attendance status
 * Query Parameters: sectionId
 * 
 * Attendance Logic:
 * - If student has attendance record for today: Show status (Present, Absent, Late, Excused)
 * - If no record for today: Show "Unmarked"
 * - Past days without record are automatically considered "Absent"
 */

session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated.']);
    exit();
}

// Get section ID from query parameters
if (!isset($_GET['sectionId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Section ID is required.']);
    exit();
}

$sectionId = $_GET['sectionId'];
$today = date('Y-m-d');

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

try {
    // Get SchoolYearID for the section
    $sectionQuery = "SELECT SchoolYearID FROM section WHERE SectionID = :sectionId";
    $sectionStmt = $db->prepare($sectionQuery);
    $sectionStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $sectionStmt->execute();
    $schoolYearId = $sectionStmt->fetchColumn();

    // Get students in the section with their attendance status for today
    // Uses LEFT JOIN to include students without attendance records
    // Filter by SchoolYearID to ensure we only look at current year enrollments
    $studentQuery = "
        SELECT 
            sp.StudentProfileID as id,
            p.LastName as lastName,
            p.FirstName as firstName,
            p.MiddleName as middleName,
            sp.Gender as gender,
            sp.DateOfBirth as birthdate,
            TIMESTAMPDIFF(YEAR, sp.DateOfBirth, CURDATE()) as age,
            sp.StudentNumber as studentNumber,
            CAST(AES_DECRYPT(p.EncryptedAddress, 'encryption_key') AS CHAR) as address,
            CAST(AES_DECRYPT(p.EncryptedPhoneNumber, 'encryption_key') AS CHAR) as contactNumber,
            p.ProfilePictureURL as profilePicture,
            CASE 
                WHEN a.AttendanceStatus IS NOT NULL THEN a.AttendanceStatus
                ELSE 'Unmarked'
            END as attendance,
            a.AttendanceDate as attendanceDate,
            NULL as grade
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
        LEFT JOIN attendance a ON sp.StudentProfileID = a.StudentProfileID 
            AND DATE(a.AttendanceDate) = :today
        WHERE e.SectionID = :sectionId
        AND e.SchoolYearID = :schoolYearId
        AND e.EnrollmentID IN (
            SELECT MAX(EnrollmentID) 
            FROM enrollment 
            WHERE StudentProfileID = sp.StudentProfileID
            AND SchoolYearID = :schoolYearId
            GROUP BY StudentProfileID
        )
        ORDER BY p.LastName, p.FirstName
    ";
    
    $stmt = $db->prepare($studentQuery);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $stmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $stmt->bindParam(':today', $today, PDO::PARAM_STR);
    $stmt->execute();
    
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $students,
        'date' => $today
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching students: ' . $e->getMessage()
    ]);
}
?>
