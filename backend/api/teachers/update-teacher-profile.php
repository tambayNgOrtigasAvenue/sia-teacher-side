<?php
/**
 * API Endpoint: Update Teacher Profile
 * Method: POST
 * Updates the profile information for the logged-in teacher
 */

session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Log the received input for debugging
error_log("Received input: " . json_encode($input));

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    exit();
}

try {
    // Start transaction
    $db->beginTransaction();
    
    // Get profile ID
    $getProfileQuery = "
        SELECT p.ProfileID 
        FROM profile p
        WHERE p.UserID = :userId
    ";
    $stmt = $db->prepare($getProfileQuery);
    $stmt->bindParam(':userId', $_SESSION['user_id']);
    $stmt->execute();
    $profileData = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$profileData) {
        throw new Exception('Profile not found.');
    }
    
    $profileId = $profileData['ProfileID'];
    $firstName = (!empty($input['firstName'])) ? trim($input['firstName']) : null;
    $lastName = (!empty($input['lastName'])) ? trim($input['lastName']) : null;
    $middleName = (!empty($input['middleName'])) ? trim($input['middleName']) : null;

    if (empty($firstName) || empty($lastName)) {
        throw new Exception('First name and last name are required.');
    }

    $gender = (isset($input['gender']) && in_array($input['gender'], ['Male', 'Female'])) 
        ? $input['gender'] 
        : null;
    $birthDate = (!empty($input['birthday'])) ? $input['birthday'] : null;
    $age = (!empty($input['age'])) ? intval($input['age']) : null;
    $religion = (!empty($input['religion'])) ? $input['religion'] : null;
    $motherTongue = (!empty($input['motherTongue'])) ? $input['motherTongue'] : null;
    $phoneNumber = (!empty($input['phoneNumber'])) ? $input['phoneNumber'] : null;
    $address = (!empty($input['address'])) ? $input['address'] : null;
    
    // Handle profile picture upload
    $profilePictureURL = null;
    if (!empty($input['profilePicture'])) {
        // Check if it's a base64 image
        if (strpos($input['profilePicture'], 'data:image') === 0) {
            // Extract the base64 data
            $image_parts = explode(";base64,", $input['profilePicture']);
            if (count($image_parts) === 2) {
                $image_type_aux = explode("image/", $image_parts[0]);
                $image_type = $image_type_aux[1] ?? 'png';
                $image_base64 = base64_decode($image_parts[1]);
                
                // Create uploads directory if it doesn't exist
                $upload_dir = __DIR__ . '/../../uploads/profile-pictures/';
                if (!file_exists($upload_dir)) {
                    mkdir($upload_dir, 0755, true);
                }
                
                // Generate unique filename
                $filename = 'profile_' . $_SESSION['user_id'] . '_' . time() . '.' . $image_type;
                $file_path = $upload_dir . $filename;
                
                // Save the file
                if (file_put_contents($file_path, $image_base64)) {
                    // Delete old profile picture if exists
                    $oldPictureQuery = "SELECT ProfilePictureURL FROM profile WHERE ProfileID = :profileId";
                    $stmt = $db->prepare($oldPictureQuery);
                    $stmt->bindParam(':profileId', $profileId);
                    $stmt->execute();
                    $oldPicture = $stmt->fetch(PDO::FETCH_ASSOC);
                    
                    if ($oldPicture && !empty($oldPicture['ProfilePictureURL'])) {
                        $oldFilePath = __DIR__ . '/../../' . $oldPicture['ProfilePictureURL'];
                        if (file_exists($oldFilePath)) {
                            unlink($oldFilePath);
                        }
                    }
                    
                    // Store relative path
                    $profilePictureURL = 'uploads/profile-pictures/' . $filename;
                    error_log("Profile picture saved: " . $profilePictureURL);
                } else {
                    error_log("Failed to save profile picture");
                }
            }
        } else {
            // It's already a URL, keep it as is
            $profilePictureURL = $input['profilePicture'];
        }
    }
    
    // Check if MotherTongue column exists
    $checkColumn = $db->query("SHOW COLUMNS FROM profile LIKE 'MotherTongue'");
    $hasMotherTongue = $checkColumn->rowCount() > 0;
    
    $updateProfileQuery = "
        UPDATE profile 
        SET 
            FirstName = :firstName,
            LastName = :lastName,
            MiddleName = :middleName,
            Gender = :gender,
            BirthDate = :birthDate,
            Age = :age,
            Religion = :religion,
            " . ($hasMotherTongue ? "MotherTongue = :motherTongue," : "") . "
            EncryptedPhoneNumber = :encryptedPhoneNumber,
            EncryptedAddress = :encryptedAddress,
            ProfilePictureURL = :profilePicture
        WHERE ProfileID = :profileId
    ";
    
    $stmt = $db->prepare($updateProfileQuery);
    $stmt->bindParam(':firstName', $firstName);
    $stmt->bindParam(':lastName', $lastName);
    $stmt->bindParam(':middleName', $middleName);
    $stmt->bindParam(':gender', $gender);
    $stmt->bindParam(':birthDate', $birthDate);
    $stmt->bindParam(':age', $age);
    $stmt->bindParam(':religion', $religion);
    if ($hasMotherTongue) {
        $stmt->bindParam(':motherTongue', $motherTongue);
    }
    $stmt->bindParam(':encryptedPhoneNumber', $phoneNumber);
    $stmt->bindParam(':encryptedAddress', $address);
    $stmt->bindParam(':profilePicture', $profilePictureURL);
    $stmt->bindParam(':profileId', $profileId);

    error_log("Executing UPDATE with values - FirstName: $firstName, LastName: $lastName, ProfileID: $profileId, ProfilePicture: " . ($profilePictureURL ?? 'null'));
    
    $stmt->execute();
    
    // Update user email
    if (isset($input['email'])) {
        $updateEmailQuery = "
            UPDATE user 
            SET EmailAddress = :email
            WHERE UserID = :userId
        ";
        $stmt = $db->prepare($updateEmailQuery);
        $stmt->bindParam(':email', $input['email']);
        $stmt->bindParam(':userId', $_SESSION['user_id']);
        $stmt->execute();
    }
    
    // Commit transaction
    $db->commit();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Profile updated successfully.'
    ]);
    
} catch (Exception $e) {
    // Rollback on error
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    
    // Log the full error
    error_log("Profile update error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error updating profile: ' . $e->getMessage()
    ]);
}
?>