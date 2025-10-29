<?php
class Students{
    private $pdo;

    public function __construct($pdo){
        $this->pdo = $pdo;
    }

    public function getStudentGrade(){
        $query = "SELECT 
                    sp.StudentProfileID,
                    sp.StudentNumber,
                    sp.StudentStatus,
                    p.FirstName,
                    p.LastName,
                    p.MiddleName,
                    u.EmailAddress,
                    u.AccountStatus,
                    g.GradeLevel
                  FROM studentprofile sp
                  INNER JOIN profile p ON sp.ProfileID = p.ProfileID
                  INNER JOIN user u ON p.UserID = u.UserID
                  INNER JOIN gradelevel g ON sp.GradeLevelID = g.GradeLevelID
                  WHERE u.IsDeleted = 0
                  ORDER BY sp.StudentNumber";
    }

    public function getAllStudents(){
        try {
            $query = "SELECT 
                        sp.StudentProfileID,
                        sp.StudentNumber,
                        sp.StudentStatus,
                        p.FirstName,
                        p.LastName,
                        p.MiddleName,
                        u.EmailAddress,
                        u.AccountStatus
                      FROM studentprofile sp
                      INNER JOIN profile p ON sp.ProfileID = p.ProfileID
                      INNER JOIN user u ON p.UserID = u.UserID
                      WHERE u.IsDeleted = 0
                      ORDER BY sp.StudentNumber";
            
            $stmt = $this->pdo->prepare($query);
            $stmt->execute();
            
            $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'success' => true,
                'data' => $students
            ];
            
        } catch (PDOException $e) {
            error_log("Get students error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Server error'];
        }
    }
}