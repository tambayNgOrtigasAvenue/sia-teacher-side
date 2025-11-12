<?php
/**
 * Student Data Population Script
 * Uses Faker PHP to generate realistic student data
 * 
 * Usage: Run from command line: php populate-student-data.php
 */

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/db.php';

use Faker\Factory;

// Initialize Faker
$faker = Factory::create();

// Initialize Database Connection
$database = new Database();
$pdo = $database->getConnection();

if (!$pdo) {
    die("Database connection failed!\n");
}

// Configuration
$numberOfStudents = 15; // Adjust as needed
$currentSchoolYearId = 1; // Adjust based on your schoolyear table

// Gender options
$genders = ['Male', 'Female'];

// Nationalities (Philippine context)
$nationalities = ['Filipino', 'Chinese-Filipino', 'American', 'Japanese', 'Korean', 'Spanish'];

// Student statuses
$studentStatuses = ['Enrolled', 'Enrolled', 'Enrolled', 'On Leave']; // More enrolled students

echo "===========================================\n";
echo "Student Data Population Script\n";
echo "===========================================\n";
echo "Number of students to generate: $numberOfStudents\n";
echo "Starting population...\n\n";

try {
    $pdo->beginTransaction();
    
    // Get existing grade levels
    $gradeLevelsStmt = $pdo->query("SELECT GradeLevelID, LevelName FROM gradelevel ORDER BY SortOrder");
    $gradeLevels = $gradeLevelsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($gradeLevels)) {
        throw new Exception("No grade levels found. Please populate grade levels first.");
    }
    
    echo "Found " . count($gradeLevels) . " grade levels\n";
    
    // Get sections
    $sectionsStmt = $pdo->query("SELECT SectionID, GradeLevelID, SectionName FROM section");
    $sections = $sectionsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($sections)) {
        echo "Warning: No sections found. Students will not be enrolled in sections.\n";
    } else {
        echo "Found " . count($sections) . " sections\n";
    }
    
    echo "\n";
    
    $successCount = 0;
    
    for ($i = 1; $i <= $numberOfStudents; $i++) {
        echo "Creating student $i/$numberOfStudents... ";
        
        // Generate student data
        $firstName = $faker->firstName();
        $lastName = $faker->lastName();
        $middleName = $faker->lastName();
        $email = strtolower($firstName . '.' . $lastName . $faker->unique()->numberBetween(1, 9999)) . '@student.gymnazo.edu.ph';
        $phoneNumber = '+(63)-9' . $faker->numberBetween(100000000, 999999999);
        $address = $faker->address();
        $dateOfBirth = $faker->dateTimeBetween('-18 years', '-5 years')->format('Y-m-d');
        $gender = $faker->randomElement($genders);
        $nationality = $faker->randomElement($nationalities);
        $studentStatus = $faker->randomElement($studentStatuses);
        $studentNumber = 'STU-' . date('Y') . '-' . str_pad($i, 5, '0', STR_PAD_LEFT);
        
        // Step 1: Create User
        $userStmt = $pdo->prepare("
            INSERT INTO user (EmailAddress, UserType, AccountStatus, CreatedAt) 
            VALUES (?, 'Student', 'Active', NOW())
        ");
        $userStmt->execute([$email]);
        $userId = $pdo->lastInsertId();
        
        // Step 2: Create Profile
        $profileStmt = $pdo->prepare("
            INSERT INTO profile (UserID, FirstName, LastName, MiddleName, EncryptedPhoneNumber, EncryptedAddress) 
            VALUES (?, ?, ?, ?, AES_ENCRYPT(?, 'encryption_key'), AES_ENCRYPT(?, 'encryption_key'))
        ");
        $profileStmt->execute([$userId, $firstName, $lastName, $middleName, $phoneNumber, $address]);
        $profileId = $pdo->lastInsertId();
        
        // Step 3: Create Student Profile
        $gradeLevel = $faker->randomElement($gradeLevels);
        $qrCodeId = 'QR-' . strtoupper($faker->unique()->bothify('??????##########'));
        
        $studentProfileStmt = $pdo->prepare("
            INSERT INTO studentprofile (
                ProfileID, StudentNumber, QRCodeID, DateOfBirth, 
                Gender, Nationality, StudentStatus
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $studentProfileStmt->execute([
            $profileId, $studentNumber, $qrCodeId, $dateOfBirth,
            $gender, $nationality, $studentStatus
        ]);
        $studentProfileId = $pdo->lastInsertId();
        
        // Step 4: Create Guardian (Parent/Guardian)
        $guardianFirstName = $faker->firstName();
        $guardianLastName = $lastName; // Usually same surname
        $guardianFullName = $guardianFirstName . ' ' . $guardianLastName;
        $guardianPhone = '09' . $faker->numberBetween(100000000, 999999999);
        $guardianEmail = strtolower($guardianFirstName . '.' . $guardianLastName) . '@email.com';
        $occupation = $faker->randomElement(['Teacher', 'Engineer', 'Doctor', 'Businessman', 'Nurse', 'Accountant', 'Lawyer', 'Manager']);
        $workAddress = $faker->address();
        
        $guardianStmt = $pdo->prepare("
            INSERT INTO guardian (
                FullName, EncryptedPhoneNumber, EncryptedEmailAddress, 
                Occupation, WorkAddress
            ) 
            VALUES (?, AES_ENCRYPT(?, 'encryption_key'), AES_ENCRYPT(?, 'encryption_key'), ?, ?)
        ");
        $guardianStmt->execute([$guardianFullName, $guardianPhone, $guardianEmail, $occupation, $workAddress]);
        $guardianId = $pdo->lastInsertId();
        
        // Step 5: Link Student to Guardian
        $relationshipType = $faker->randomElement(['Father', 'Mother', 'Guardian']);
        $studentGuardianStmt = $pdo->prepare("
            INSERT INTO studentguardian (
                StudentProfileID, GuardianID, RelationshipType, 
                IsPrimaryContact, IsEmergencyContact, IsAuthorizedPickup, SortOrder
            ) 
            VALUES (?, ?, ?, 1, 1, 1, 1)
        ");
        $studentGuardianStmt->execute([$studentProfileId, $guardianId, $relationshipType]);
        
        // Step 6: Create Emergency Contact
        $emergencyContactName = $faker->name();
        $emergencyContactPhone = '09' . $faker->numberBetween(100000000, 999999999);
        
        $emergencyContactStmt = $pdo->prepare("
            INSERT INTO emergencycontact (StudentProfileID, ContactPerson, EncryptedContactNumber) 
            VALUES (?, ?, AES_ENCRYPT(?, 'encryption_key'))
        ");
        $emergencyContactStmt->execute([$studentProfileId, $emergencyContactName, $emergencyContactPhone]);
        
        // Step 7: Create Medical Info
        $weight = $faker->randomFloat(2, 30, 80); // kg
        $height = $faker->randomFloat(2, 120, 180); // cm
        $allergies = $faker->randomElement(['None', 'Peanuts', 'Seafood', 'Dust', 'Pollen']);
        $medicalConditions = $faker->randomElement(['None', 'Asthma', 'Diabetes', 'Hypertension']);
        $medications = $faker->randomElement(['None', 'Ventolin', 'Insulin', 'Amoxicillin']);
        
        $medicalInfoStmt = $pdo->prepare("
            INSERT INTO medicalinfo (
                StudentProfileID, Weight, Height, 
                EncryptedAllergies, EncryptedMedicalConditions, EncryptedMedications
            ) 
            VALUES (?, ?, ?, AES_ENCRYPT(?, 'encryption_key'), AES_ENCRYPT(?, 'encryption_key'), AES_ENCRYPT(?, 'encryption_key'))
        ");
        $medicalInfoStmt->execute([$studentProfileId, $weight, $height, $allergies, $medicalConditions, $medications]);
        
        // Step 8: Enroll student in a section (if sections exist)
        if (!empty($sections)) {
            // Find sections for this grade level
            $gradeLevelSections = array_filter($sections, function($section) use ($gradeLevel) {
                return $section['GradeLevelID'] == $gradeLevel['GradeLevelID'];
            });
            
            if (!empty($gradeLevelSections)) {
                $section = $faker->randomElement($gradeLevelSections);
                
                $enrollmentStmt = $pdo->prepare("
                    INSERT INTO enrollment (StudentProfileID, SectionID, SchoolYearID, EnrollmentDate) 
                    VALUES (?, ?, ?, CURDATE())
                ");
                $enrollmentStmt->execute([$studentProfileId, $section['SectionID'], $currentSchoolYearId]);
                
                // Update section enrollment count
                $updateSectionStmt = $pdo->prepare("
                    UPDATE section 
                    SET CurrentEnrollment = CurrentEnrollment + 1 
                    WHERE SectionID = ?
                ");
                $updateSectionStmt->execute([$section['SectionID']]);
            }
        }
        
        $successCount++;
        echo "✓ Created: $firstName $lastName ($studentNumber)\n";
    }
    
    $pdo->commit();
    
    echo "\n===========================================\n";
    echo "SUCCESS!\n";
    echo "===========================================\n";
    echo "Successfully created $successCount students\n";
    echo "Students have been enrolled with guardians, emergency contacts, and medical info.\n";
    echo "\n";
    
} catch (Exception $e) {
    $pdo->rollBack();
    echo "\n\n===========================================\n";
    echo "ERROR!\n";
    echo "===========================================\n";
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "\nTransaction rolled back. No data was inserted.\n";
    exit(1);
}
