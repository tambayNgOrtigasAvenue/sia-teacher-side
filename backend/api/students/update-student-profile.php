<?php
/**
 * Update Student Profile API
 * 
 * Allows teachers to update student profile information
 * Updates studentprofile table with new information
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/db.php';

session_start();

// Check if user is logged in and is a teacher
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'Teacher') {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized access'
    ]);
    exit();
}

try {
    // Get database connection
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception('Database connection failed');
    }
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Log the received data for debugging
    error_log("Update student profile input: " . print_r($input, true));
    
    if (!$input) {
        throw new Exception('Invalid input data');
    }

    // Validate required fields
    $studentId = $input['studentId'] ?? null;
    $firstName = $input['firstName'] ?? null;
    $lastName = $input['lastName'] ?? null;
    
    if (!$studentId || !$firstName || !$lastName) {
        throw new Exception('Student ID, first name, and last name are required');
    }

    // Optional fields
    $middleName = $input['middleName'] ?? '';
    $birthdate = !empty($input['birthdate']) ? $input['birthdate'] : null;
    $age = $input['age'] ?? null;
    $studentNumber = !empty($input['studentNumber']) ? $input['studentNumber'] : null;
    $address = $input['address'] ?? '';
    $contactNumber = $input['contactNumber'] ?? '';

    // Start transaction
    $db->beginTransaction();

    // Get student's profile ID
    $stmt = $db->prepare("
        SELECT ProfileID 
        FROM studentprofile 
        WHERE StudentProfileID = :studentId
    ");
    $stmt->bindParam(':studentId', $studentId);
    $stmt->execute();
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        throw new Exception('Student not found');
    }

    $profileId = $student['ProfileID'];

    // Update profile table
    $updateProfile = "
        UPDATE profile 
        SET 
            FirstName = :firstName,
            MiddleName = :middleName,
            LastName = :lastName
    ";
    
    $params = [
        ':firstName' => $firstName,
        ':middleName' => $middleName,
        ':lastName' => $lastName,
        ':profileId' => $profileId
    ];

    // Add encrypted fields if provided
    if (!empty($contactNumber)) {
        $updateProfile .= ", EncryptedPhoneNumber = :phoneNumber";
        $params[':phoneNumber'] = $contactNumber;
    }

    if (!empty($address)) {
        $updateProfile .= ", EncryptedAddress = :address";
        $params[':address'] = $address;
    }

    $updateProfile .= " WHERE ProfileID = :profileId";

    $stmt = $db->prepare($updateProfile);
    if (!$stmt->execute($params)) {
        throw new Exception('Failed to update profile table: ' . implode(', ', $stmt->errorInfo()));
    }
    error_log("Profile updated successfully for ProfileID: $profileId");

    // Update studentprofile table
    $studentParams = [':studentId' => $studentId];
    $updateFields = [];
    
    if ($birthdate !== null) {
        $updateFields[] = "DateOfBirth = :birthdate";
        $studentParams[':birthdate'] = $birthdate;
    }
    
    if ($studentNumber !== null && !empty($studentNumber)) {
        $updateFields[] = "StudentNumber = :studentNumber";
        $studentParams[':studentNumber'] = $studentNumber;
    }

    // Only update if there are fields to update
    if (!empty($updateFields)) {
        $updateStudent = "
            UPDATE studentprofile 
            SET " . implode(', ', $updateFields) . "
            WHERE StudentProfileID = :studentId
        ";

        $stmt = $db->prepare($updateStudent);
        if (!$stmt->execute($studentParams)) {
            throw new Exception('Failed to update studentprofile table: ' . implode(', ', $stmt->errorInfo()));
        }
        error_log("StudentProfile updated successfully for StudentProfileID: $studentId");
    }

    // Commit transaction
    $db->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Student profile updated successfully',
        'data' => [
            'studentId' => $studentId,
            'firstName' => $firstName,
            'middleName' => $middleName,
            'lastName' => $lastName,
            'birthdate' => $birthdate,
            'age' => $age,
            'studentNumber' => $studentNumber,
            'address' => $address,
            'contactNumber' => $contactNumber
        ]
    ]);

} catch (Exception $e) {
    // Rollback transaction on error
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    
    // Log the error
    error_log("Update student profile error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'debug' => [
            'file' => basename($e->getFile()),
            'line' => $e->getLine()
        ]
    ]);
}
