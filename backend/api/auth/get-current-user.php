<?php

session_start();

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../models/User.php';

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated. Please log in.']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

$user = new User($db);

// Check user type and fetch appropriate data
$userType = $_SESSION['user_type'] ?? null;

if ($userType === 'Teacher') {
    // Fetch teacher data
    $userData = $user->getTeacherByUserId($_SESSION['user_id']);
    
    if (!$userData) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Teacher data not found.']);
        exit();
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'user' => [
            'userId' => $userData['UserID'],
            'emailAddress' => $userData['EmailAddress'],
            'userType' => $userData['UserType'],
            'accountStatus' => $userData['AccountStatus'],
            'lastLoginDate' => $userData['LastLoginDate'],
            'profileId' => $userData['ProfileID'],
            'firstName' => $userData['FirstName'],
            'lastName' => $userData['LastName'],
            'middleName' => $userData['MiddleName'],
            'fullName' => $userData['FullName'],
            'phoneNumber' => $userData['PhoneNumber'] ?? null,
            'address' => $userData['Address'] ?? null,
            'profilePictureURL' => $userData['ProfilePictureURL'],
            'teacherProfileId' => $userData['TeacherProfileID'],
            'employeeNumber' => $userData['EmployeeNumber'],
            'specialization' => $userData['Specialization'],
            'hireDate' => $userData['HireDate'],
            'roleId' => $userData['RoleID'] ?? null,
            'roleName' => $userData['RoleName'] ?? null,
            'roleDescription' => $userData['RoleDescription'] ?? null
        ]
    ]);
} else {
    // Fetch student data (original code)
    $userData = $user->getStudentByUserId($_SESSION['user_id']);

    if (!$userData) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User data not found.']);
        exit();
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'user' => [
            'userId' => $userData['UserID'],
            'emailAddress' => $userData['EmailAddress'],
            'userType' => $userData['UserType'],
            'accountStatus' => $userData['AccountStatus'],
            'lastLoginDate' => $userData['LastLoginDate'],
            'profileId' => $userData['ProfileID'],
            'firstName' => $userData['FirstName'],
            'lastName' => $userData['LastName'],
            'middleName' => $userData['MiddleName'],
            'fullName' => $userData['FullName'],
            'phoneNumber' => $userData['PhoneNumber'],
            'address' => $userData['Address'],
            'profilePictureURL' => $userData['ProfilePictureURL'],
            'studentProfileId' => $userData['StudentProfileID'],
            'studentNumber' => $userData['StudentNumber'],
            'qrCodeId' => $userData['QRCodeID'],
            'dateOfBirth' => $userData['DateOfBirth'],
            'gender' => $userData['Gender'],
            'nationality' => $userData['Nationality'],
            'studentStatus' => $userData['StudentStatus'],
            'age' => $userData['Age'],
            'schoolYear' => $userData['SchoolYear'],
            'schoolYearId' => $userData['SchoolYearID'],
            'gradeLevel' => $userData['GradeLevel'],
            'sectionName' => $userData['SectionName'],
            'sectionId' => $userData['SectionID'],
            'gradeAndSection' => $userData['GradeAndSection'],
            'adviserName' => $userData['AdviserName'],
            'weight' => $userData['Weight'],
            'height' => $userData['Height'],
            'allergies' => $userData['Allergies'],
            'medicalConditions' => $userData['MedicalConditions'],
            'medications' => $userData['Medications'],
            'emergencyContactPerson' => $userData['EmergencyContactPerson'],
            'emergencyContactNumber' => $userData['EmergencyContactNumber'],
            'primaryGuardianName' => $userData['PrimaryGuardianName'],
            'primaryGuardianRelationship' => $userData['PrimaryGuardianRelationship'],
            'primaryGuardianContactNumber' => $userData['PrimaryGuardianContactNumber'],
            'primaryGuardianEmail' => $userData['PrimaryGuardianEmail']
        ]
    ]);
}
?>