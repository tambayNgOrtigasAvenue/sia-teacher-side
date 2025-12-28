<?php
class Teachers{
    private $conn;
    private $table_name = "teachers";
    
    public $id;
    public $last_name;
    public $first_name;
    public $middle_name;
    public $gender;
    public $birth_date;
    public $civil_status;
    public $date_hired;
    public $created_at;
    public $updated_at;

    public function __construct($db){
        $this->conn = $db;
    }

    public function getAllTeachers(){
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY last_name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    
    public function viewEmployeeNumber($EmployeeNumber){
        $query =  "SELECT EmployeeNumber FROM " . $this->table_name . " WHERE EmployeeNumber = ? LIMIT 0,1";
        $stmt = $this->conn->prepare( $query );
        $stmt->bindParam(1, $EmployeeNumber);
        $stmt->execute();
        return $stmt;
    }

    public function getTeacherByEmployeeNumber($identifier){
        $query = "
            SELECT 
                u.UserID,
                tp.EmployeeNumber,
                u.EmailAddress,
                pp.PasswordHash,
                CONCAT(p.FirstName, ' ', p.LastName) AS FullName,
                u.UserType,
                u.AccountStatus
            FROM 
                teacherprofile tp
            JOIN 
                profile p ON tp.ProfileID = p.ProfileID
            JOIN 
                user u ON p.UserID = u.UserID
            LEFT JOIN 
                passwordpolicy pp ON u.UserID = pp.UserID
            WHERE 
                (tp.EmployeeNumber = :identifier OR u.EmailAddress = :identifier)
                AND (u.UserType = 'Teacher' OR u.UserType = 'Head Teacher')";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':identifier', $identifier);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Optional: Log the error for debugging
            error_log("Teacher login error: " . $e->getMessage());
            return false;
        }
    }
}
?>