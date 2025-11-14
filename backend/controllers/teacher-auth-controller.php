<?php
require_once __DIR__ . '/../models/Teachers.php';
require_once __DIR__ . '/../models/User.php';

class TeacherAuthController {
    private $conn;
    private $user;
    private $userModel;

    public function __construct($db) {
        $this->conn = $db;
        $this->user = new Teachers($db);
        $this->userModel = new User($db);
    }
    
    public function loginTeacher($EmployeeNumber, $password) {
        $teacher = $this->user->getTeacherByEmployeeNumber($EmployeeNumber);

        // 1. ichchceck kung may employee number ba na galing sa db
        if (!$teacher) {
            return ['success' => false, 'message' => 'Invalid username or password.'];
        }

        // 2. ichchceck if active ba yung account
        if ($teacher['AccountStatus'] !== 'Active') {
            return ['success' => false, 'message' => 'Account is inactive or suspended. Please contact administration.'];
        }

        if (password_verify($password, $teacher['PasswordHash'])) {
            if (session_status() === PHP_SESSION_NONE) {
                // sessiion cookie params for security hell yeah
                session_set_cookie_params([
                    'lifetime' => 3600, // 1 hour lang to lods
                    'path' => '/',
                    'domain' => '', 
                    'secure' => isset($_SERVER['HTTPS']), 
                    'httponly' => true, // Prevent client-side script access
                    'samesite' => 'Lax'
                ]);
                session_start();
            }

            session_regenerate_id(true);

            $_SESSION['user_id'] = $teacher['UserID'];
            $_SESSION['full_name'] = $teacher['FullName'];
            $_SESSION['user_type'] = $teacher['UserType'];

            // Fetch complete teacher data including role information
            $teacherData = $this->userModel->getTeacherByUserId($teacher['UserID']);
            
            return [
                'success' => true, 
                'message' => 'Login successful!',
                'user' => [
                    'userId' => $teacherData['UserID'],
                    'emailAddress' => $teacherData['EmailAddress'],
                    'userType' => $teacherData['UserType'],
                    'accountStatus' => $teacherData['AccountStatus'],
                    'lastLoginDate' => $teacherData['LastLoginDate'],
                    'profileId' => $teacherData['ProfileID'],
                    'firstName' => $teacherData['FirstName'],
                    'lastName' => $teacherData['LastName'],
                    'middleName' => $teacherData['MiddleName'],
                    'fullName' => $teacherData['FullName'],
                    'phoneNumber' => $teacherData['PhoneNumber'] ?? null,
                    'address' => $teacherData['Address'] ?? null,
                    'profilePictureURL' => $teacherData['ProfilePictureURL'],
                    'teacherProfileId' => $teacherData['TeacherProfileID'],
                    'employeeNumber' => $teacherData['EmployeeNumber'],
                    'specialization' => $teacherData['Specialization'],
                    'hireDate' => $teacherData['HireDate'],
                    'roleId' => $teacherData['RoleID'] ?? null,
                    'roleName' => $teacherData['RoleName'] ?? null,
                    'roleDescription' => $teacherData['RoleDescription'] ?? null
                ]
            ];
        } else {
            return ['success' => false, 'message' => 'Invalid username or password.'];
        }
    }

    /**
     * Register a new teacher account
     * Creates: User -> PasswordPolicy -> Profile -> TeacherProfile -> UserRole
     */
    public function registerTeacher($data) {
        try {
            // Start transaction
            $this->conn->beginTransaction();

            // Validate required fields
            $requiredFields = ['email', 'password', 'firstName', 'lastName', 'employeeNumber'];
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    throw new Exception("Missing required field: $field");
                }
            }

            // Check if email already exists
            if ($this->emailExists($data['email'])) {
                throw new Exception("Email address already registered.");
            }

            // Check if employee number already exists
            if ($this->employeeNumberExists($data['employeeNumber'])) {
                throw new Exception("Employee number already exists.");
            }

            // 1. Create User
            $userId = $this->createUser($data['email']);
            if (!$userId) {
                throw new Exception("Failed to create user account.");
            }

            // 2. Create Password Policy
            $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);
            if (!$this->createPasswordPolicy($userId, $passwordHash)) {
                throw new Exception("Failed to set password.");
            }

            // 3. Create Profile
            $profileId = $this->createProfile($userId, $data);
            if (!$profileId) {
                throw new Exception("Failed to create profile.");
            }

            // 4. Create Teacher Profile
            $teacherProfileId = $this->createTeacherProfile($profileId, $data);
            if (!$teacherProfileId) {
                throw new Exception("Failed to create teacher profile.");
            }

            // 5. Assign Teacher Role
            if (!$this->assignTeacherRole($userId, $data['assignedByUserId'] ?? null)) {
                throw new Exception("Failed to assign teacher role.");
            }

            // Commit transaction
            $this->conn->commit();

            return [
                'success' => true,
                'message' => 'Teacher account created successfully!',
                'data' => [
                    'userId' => $userId,
                    'profileId' => $profileId,
                    'teacherProfileId' => $teacherProfileId,
                    'employeeNumber' => $data['employeeNumber']
                ]
            ];

        } catch (Exception $e) {
            // Rollback on error
            $this->conn->rollback();
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Check if email already exists
     */
    private function emailExists($email) {
        $query = "SELECT UserID FROM user WHERE EmailAddress = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    /**
     * Check if employee number already exists
     */
    private function employeeNumberExists($employeeNumber) {
        $query = "SELECT TeacherProfileID FROM teacherprofile WHERE EmployeeNumber = :employeeNumber LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':employeeNumber', $employeeNumber);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    /**
     * Create User record
     */
    private function createUser($email) {
        $query = "INSERT INTO user (EmailAddress, UserType, AccountStatus, CreatedAt) 
                  VALUES (:email, 'Teacher', 'Active', NOW())";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    /**
     * Create Password Policy
     */
    private function createPasswordPolicy($userId, $passwordHash) {
        $query = "INSERT INTO passwordpolicy (UserID, PasswordHash, PasswordSetDate, MustChange, FailedLoginAttempts) 
                  VALUES (:userId, :passwordHash, NOW(), 0, 0)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':passwordHash', $passwordHash);
        return $stmt->execute();
    }

    /**
     * Create Profile record
     */
    private function createProfile($userId, $data) {
        // For encrypted fields, we'll insert NULL if no data provided
        // In production, you should use AES_ENCRYPT with a proper encryption key
        
        // Prepare variables for bindParam (must be passed by reference)
        $firstName = $data['firstName'];
        $lastName = $data['lastName'];
        $middleName = $data['middleName'] ?? null;
        
        if (!empty($data['phoneNumber']) || !empty($data['address'])) {
            $phoneNumber = $data['phoneNumber'] ?? null;
            $address = $data['address'] ?? null;
            
            $query = "INSERT INTO profile (UserID, FirstName, LastName, MiddleName, EncryptedPhoneNumber, EncryptedAddress) 
                      VALUES (:userId, :firstName, :lastName, :middleName, :phoneNumber, :address)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':userId', $userId);
            $stmt->bindParam(':firstName', $firstName);
            $stmt->bindParam(':lastName', $lastName);
            $stmt->bindParam(':middleName', $middleName);
            $stmt->bindParam(':phoneNumber', $phoneNumber);
            $stmt->bindParam(':address', $address);
        } else {
            // Simplified query if no phone/address
            $query = "INSERT INTO profile (UserID, FirstName, LastName, MiddleName) 
                      VALUES (:userId, :firstName, :lastName, :middleName)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':userId', $userId);
            $stmt->bindParam(':firstName', $firstName);
            $stmt->bindParam(':lastName', $lastName);
            $stmt->bindParam(':middleName', $middleName);
        }
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    /**
     * Create Teacher Profile
     */
    private function createTeacherProfile($profileId, $data) {
        // Prepare variables for bindParam (must be passed by reference)
        $employeeNumber = $data['employeeNumber'];
        $specialization = $data['specialization'] ?? null;
        $hireDate = $data['hireDate'] ?? date('Y-m-d');
        
        $query = "INSERT INTO teacherprofile (ProfileID, EmployeeNumber, Specialization, HireDate) 
                  VALUES (:profileId, :employeeNumber, :specialization, :hireDate)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':profileId', $profileId);
        $stmt->bindParam(':employeeNumber', $employeeNumber);
        $stmt->bindParam(':specialization', $specialization);
        $stmt->bindParam(':hireDate', $hireDate);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    /**
     * Assign Teacher Role
     */
    private function assignTeacherRole($userId, $assignedByUserId = null) {
        // First, ensure Teacher role exists
        $checkRoleQuery = "SELECT RoleID FROM role WHERE RoleName = 'Teacher' LIMIT 1";
        $stmt = $this->conn->prepare($checkRoleQuery);
        $stmt->execute();
        $role = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$role) {
            // Create Teacher role if it doesn't exist
            $createRoleQuery = "INSERT INTO role (RoleName, Description, IsActive) 
                               VALUES ('Teacher', 'Teaching staff with class management permissions', 1)";
            $stmt = $this->conn->prepare($createRoleQuery);
            $stmt->execute();
            $roleId = $this->conn->lastInsertId();
        } else {
            $roleId = $role['RoleID'];
        }

        // Assign role to user
        $query = "INSERT INTO userrole (UserID, RoleID, AssignedDate, AssignedByUserID) 
                  VALUES (:userId, :roleId, NOW(), :assignedByUserId)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':roleId', $roleId);
        $stmt->bindParam(':assignedByUserId', $assignedByUserId);
        
        return $stmt->execute();
    }
}