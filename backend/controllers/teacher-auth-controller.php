<?php
require_once __DIR__ . '/../models/Teachers.php';

class TeacherAuthController {
    private $conn;
    private $user;

    public function __construct($db) {
        $this->conn = $db;
        $this->user = new Teachers($db);
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

            return [
                'success' => true, 
                'message' => 'Login successful!',
                'user' => [
                    'fullName' => $teacher['FullName']
                ]
            ];
        } else {
            return ['success' => false, 'message' => 'Invalid username or password.'];
        }
    }
}