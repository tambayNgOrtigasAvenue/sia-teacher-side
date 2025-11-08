<?php
/**
 * Debug Endpoint: Check Session and Database
 * Access: http://localhost/gymnazo-christian-academy-teacher-side/backend/api/teachers/debug-profile.php
 */

session_start();

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

$database = new Database();
$db = $database->getConnection();

$debug = [
    'session' => [
        'user_id' => $_SESSION['user_id'] ?? 'NOT SET',
        'user_type' => $_SESSION['user_type'] ?? 'NOT SET',
        'all_session_data' => $_SESSION
    ],
    'database' => [
        'connected' => $db ? true : false
    ]
];

if ($db && isset($_SESSION['user_id'])) {
    try {
        // Check if user exists
        $stmt = $db->prepare("SELECT UserID, EmailAddress, UserType FROM user WHERE UserID = :userId");
        $stmt->bindParam(':userId', $_SESSION['user_id']);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $debug['user_check'] = $user ?: 'USER NOT FOUND';
        
        // Check if profile exists
        $stmt = $db->prepare("SELECT ProfileID, FirstName, LastName FROM profile WHERE UserID = :userId");
        $stmt->bindParam(':userId', $_SESSION['user_id']);
        $stmt->execute();
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);
        $debug['profile_check'] = $profile ?: 'PROFILE NOT FOUND';
        
        // Check if teacher profile exists
        if ($profile) {
            $stmt = $db->prepare("SELECT TeacherProfileID, EmployeeNumber FROM teacherprofile WHERE ProfileID = :profileId");
            $stmt->bindParam(':profileId', $profile['ProfileID']);
            $stmt->execute();
            $teacherProfile = $stmt->fetch(PDO::FETCH_ASSOC);
            $debug['teacher_profile_check'] = $teacherProfile ?: 'TEACHER PROFILE NOT FOUND';
        }
        
        // Try the full query
        $query = "
            SELECT 
                u.UserID,
                u.EmailAddress as email,
                p.FirstName as firstName,
                p.MiddleName as middleName,
                p.LastName as lastName,
                CONCAT(p.FirstName, ' ', IFNULL(CONCAT(p.MiddleName, ' '), ''), p.LastName) as fullName,
                p.Gender as gender,
                p.BirthDate as birthday,
                p.Age as age,
                p.Religion as religion,
                p.MotherTongue as motherTongue,
                p.EncryptedPhoneNumber as phoneNumber,
                p.EncryptedAddress as address,
                p.ProfilePictureURL as profilePicture,
                tp.EmployeeNumber,
                tp.Specialization,
                tp.HireDate,
                u.UserType as accountType
            FROM user u
            JOIN profile p ON u.UserID = p.UserID
            JOIN teacherprofile tp ON p.ProfileID = tp.ProfileID
            WHERE u.UserID = :userId
        ";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':userId', $_SESSION['user_id']);
        $stmt->execute();
        $fullProfile = $stmt->fetch(PDO::FETCH_ASSOC);
        $debug['full_profile_query'] = $fullProfile ?: 'QUERY RETURNED NO RESULTS';
        
    } catch (Exception $e) {
        $debug['error'] = [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ];
    }
}

echo json_encode($debug, JSON_PRETTY_PRINT);
?>
