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
    
    // Optional: Get specific date
    $attendanceDate = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
    
    // Fetch all students in the section with their attendance for the specified date
    $query = "
        SELECT 
            sp.StudentProfileID as id,
            p.FirstName as firstName,
            p.MiddleName as middleName,
            p.LastName as lastName,
            sp.StudentNumber as studentNumber,
            a.AttendanceStatus as status,
            a.CheckInTime as checkInTime,
            a.CheckOutTime as checkOutTime,
            a.Notes as notes,
            a.AttendanceDate as attendanceDate
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
        LEFT JOIN attendance a ON sp.StudentProfileID = a.StudentProfileID 
            AND DATE(a.AttendanceDate) = :attendanceDate
        WHERE e.SectionID = :sectionId
        ORDER BY p.LastName ASC, p.FirstName ASC
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $stmt->bindParam(':attendanceDate', $attendanceDate, PDO::PARAM_STR);
    $stmt->execute();
    
    $students = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $students[] = [
            'id' => (int)$row['id'],
            'firstName' => $row['firstName'],
            'middleName' => $row['middleName'] ?: '',
            'lastName' => $row['lastName'],
            'studentNumber' => $row['studentNumber'],
            'status' => $row['status'] ?: 'Not Marked',
            'checkInTime' => $row['checkInTime'],
            'checkOutTime' => $row['checkOutTime'],
            'notes' => $row['notes'],
            'attendanceDate' => $row['attendanceDate']
        ];
    }
    
    // Calculate attendance summary
    $totalStudents = count($students);
    $present = count(array_filter($students, fn($s) => $s['status'] === 'Present'));
    $absent = count(array_filter($students, fn($s) => $s['status'] === 'Absent'));
    $late = count(array_filter($students, fn($s) => $s['status'] === 'Late'));
    $excused = count(array_filter($students, fn($s) => $s['status'] === 'Excused'));
    $notMarked = count(array_filter($students, fn($s) => $s['status'] === 'Not Marked'));
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'students' => $students,
            'summary' => [
                'total' => $totalStudents,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'excused' => $excused,
                'notMarked' => $notMarked
            ],
            'date' => $attendanceDate
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
