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
    
    // Get quarter parameter (optional - if not provided, show all quarters)
    $quarter = isset($_GET['quarter']) ? $_GET['quarter'] : null;
    
    // Map quarter names to database values
    $quarterMap = [
        'First' => 'First Quarter',
        'Second' => 'Second Quarter',
        'Third' => 'Third Quarter',
        'Fourth' => 'Fourth Quarter'
    ];
    
    // Get the current school year
    $schoolYearQuery = "
        SELECT SchoolYearID 
        FROM schoolyear 
        WHERE IsActive = 1 
        LIMIT 1
    ";
    $schoolYearStmt = $db->prepare($schoolYearQuery);
    $schoolYearStmt->execute();
    $schoolYearResult = $schoolYearStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$schoolYearResult) {
        throw new Exception('No active school year found');
    }
    
    $schoolYearId = $schoolYearResult['SchoolYearID'];
    
    // Build the query based on whether quarter is specified
    if ($quarter && isset($quarterMap[$quarter])) {
        $quarterValue = $quarterMap[$quarter];
        
        // Get attendance summary for specific quarter
        $query = "
            SELECT 
                sp.StudentProfileID as id,
                CONCAT(p.LastName, ', ', p.FirstName, ' ', COALESCE(p.MiddleName, '')) as name,
                :quarter as quarter,
                COUNT(CASE WHEN a.AttendanceStatus = 'Present' THEN 1 END) as totalPresent,
                COUNT(CASE WHEN a.AttendanceStatus = 'Absent' THEN 1 END) as totalAbsent,
                COUNT(CASE WHEN a.AttendanceStatus = 'Late' THEN 1 END) as totalLate,
                COUNT(CASE WHEN a.AttendanceStatus = 'Excused' THEN 1 END) as totalExcused
            FROM studentprofile sp
            JOIN profile p ON sp.ProfileID = p.ProfileID
            JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
            LEFT JOIN attendance a ON sp.StudentProfileID = a.StudentProfileID
                AND a.AttendanceDate >= (
                    SELECT StartDate 
                    FROM quarter q 
                    WHERE q.QuarterName = :quarterValue 
                    AND q.SchoolYearID = :schoolYearId
                    LIMIT 1
                )
                AND a.AttendanceDate <= (
                    SELECT EndDate 
                    FROM quarter q 
                    WHERE q.QuarterName = :quarterValue 
                    AND q.SchoolYearID = :schoolYearId
                    LIMIT 1
                )
            WHERE e.SectionID = :sectionId
            GROUP BY sp.StudentProfileID, p.LastName, p.FirstName, p.MiddleName
            ORDER BY p.LastName ASC, p.FirstName ASC
        ";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $stmt->bindParam(':quarter', $quarter, PDO::PARAM_STR);
        $stmt->bindParam(':quarterValue', $quarterValue, PDO::PARAM_STR);
        $stmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
        $stmt->execute();
        
        $students = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $students[] = [
                'id' => (int)$row['id'],
                'name' => $row['name'],
                'quarter' => $row['quarter'],
                'totalPresent' => (int)$row['totalPresent'],
                'totalAbsent' => (int)$row['totalAbsent'],
                'totalLate' => (int)$row['totalLate'],
                'totalExcused' => (int)$row['totalExcused']
            ];
        }
        
    } else {
        // Get attendance summary for all quarters
        $query = "
            SELECT 
                sp.StudentProfileID as id,
                CONCAT(p.LastName, ', ', p.FirstName, ' ', COALESCE(p.MiddleName, '')) as name,
                q.QuarterName as quarter,
                COUNT(CASE WHEN a.AttendanceStatus = 'Present' THEN 1 END) as totalPresent,
                COUNT(CASE WHEN a.AttendanceStatus = 'Absent' THEN 1 END) as totalAbsent,
                COUNT(CASE WHEN a.AttendanceStatus = 'Late' THEN 1 END) as totalLate,
                COUNT(CASE WHEN a.AttendanceStatus = 'Excused' THEN 1 END) as totalExcused
            FROM studentprofile sp
            JOIN profile p ON sp.ProfileID = p.ProfileID
            JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
            CROSS JOIN quarter q
            LEFT JOIN attendance a ON sp.StudentProfileID = a.StudentProfileID
                AND a.AttendanceDate >= q.StartDate
                AND a.AttendanceDate <= q.EndDate
            WHERE e.SectionID = :sectionId
                AND q.SchoolYearID = :schoolYearId
            GROUP BY sp.StudentProfileID, p.LastName, p.FirstName, p.MiddleName, q.QuarterName, q.StartDate
            ORDER BY p.LastName ASC, p.FirstName ASC, q.StartDate ASC
        ";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $stmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
        $stmt->execute();
        
        $students = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Convert quarter name format
            $quarterDisplay = str_replace(' Quarter', '', $row['quarter']);
            
            $students[] = [
                'id' => (int)$row['id'],
                'name' => $row['name'],
                'quarter' => $quarterDisplay,
                'totalPresent' => (int)$row['totalPresent'],
                'totalAbsent' => (int)$row['totalAbsent'],
                'totalLate' => (int)$row['totalLate'],
                'totalExcused' => (int)$row['totalExcused']
            ];
        }
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $students,
        'quarter' => $quarter,
        'sectionId' => $sectionId
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
