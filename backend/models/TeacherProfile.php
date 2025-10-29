<?php
/**
 * Model: TeacherProfile
 *
 * Handles all database operations for the 'TeacherProfiles' table.
 */
class TeacherProfile {
    private $conn;
    private $table_name = "TeacherProfiles";

    // Properties
    public $TeacherProfileID;
    public $ProfileID; // FK to an external 'Profiles' table
    public $EmployeeNumber;
    public $Specialization;
    public $HireDate;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create a new teacher profile
     */
    public function create($data) {
        // Note: Assumes ProfileID is provided from another source (e.g., a user creation process)
        $query = "INSERT INTO " . $this->table_name . " 
                  (ProfileID, EmployeeNumber, Specialization, HireDate) 
                  VALUES (:ProfileID, :EmployeeNumber, :Specialization, :HireDate)";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->ProfileID = (int)$data->ProfileID;
        $this->EmployeeNumber = htmlspecialchars(strip_tags($data->EmployeeNumber));
        $this->Specialization = !empty($data->Specialization) ? htmlspecialchars(strip_tags($data->Specialization)) : null;
        $this->HireDate = !empty($data->HireDate) ? htmlspecialchars(strip_tags($data->HireDate)) : null;

        // Bind
        $stmt->bindParam(":ProfileID", $this->ProfileID);
        $stmt->bindParam(":EmployeeNumber", $this->EmployeeNumber);
        $stmt->bindParam(":Specialization", $this->Specialization);
        $stmt->bindParam(":HireDate", $this->HireDate);

        try {
            return $stmt->execute();
        } catch (PDOException $e) {
            // Handle unique constraint violation for EmployeeNumber, etc.
            return false;
        }
    }

    /**
     * Read all teacher profiles
     */
    public function read() {
        // Here you might want to JOIN with your external 'Profiles' table
        // For this example, we'll just read from TeacherProfiles
        $query = "SELECT TeacherProfileID, ProfileID, EmployeeNumber, Specialization, HireDate 
                  FROM " . $this->table_name . " 
                  ORDER BY EmployeeNumber ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Read a single teacher profile by ID
     */
    public function readOne($id) {
        $query = "SELECT TeacherProfileID, ProfileID, EmployeeNumber, Specialization, HireDate 
                  FROM " . $this->table_name . " 
                  WHERE TeacherProfileID = :TeacherProfileID LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":TeacherProfileID", $id, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->TeacherProfileID = $row['TeacherProfileID'];
            $this->ProfileID = $row['ProfileID'];
            $this->EmployeeNumber = $row['EmployeeNumber'];
            $this->Specialization = $row['Specialization'];
            $this->HireDate = $row['HireDate'];
            return true;
        }
        return false;
    }

    /**
     * Update a teacher profile
     */
    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . "
                  SET ProfileID = :ProfileID, 
                      EmployeeNumber = :EmployeeNumber, 
                      Specialization = :Specialization, 
                      HireDate = :HireDate
                  WHERE TeacherProfileID = :TeacherProfileID";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->TeacherProfileID = (int)$id;
        $this->ProfileID = (int)$data->ProfileID;
        $this->EmployeeNumber = htmlspecialchars(strip_tags($data->EmployeeNumber));
        $this->Specialization = !empty($data->Specialization) ? htmlspecialchars(strip_tags($data->Specialization)) : null;
        $this->HireDate = !empty($data->HireDate) ? htmlspecialchars(strip_tags($data->HireDate)) : null;

        // Bind
        $stmt->bindParam(":ProfileID", $this->ProfileID);
        $stmt->bindParam(":EmployeeNumber", $this->EmployeeNumber);
        $stmt->bindParam(":Specialization", $this->Specialization);
        $stmt->bindParam(":HireDate", $this->HireDate);
        $stmt->bindParam(":TeacherProfileID", $this->TeacherProfileID, PDO::PARAM_INT);

        try {
            if ($stmt->execute()) {
                return $stmt->rowCount() > 0;
            }
        } catch (PDOException $e) {
            return false;
        }
        return false;
    }

    /**
     * Delete a teacher profile
     */
    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE TeacherProfileID = :TeacherProfileID";
        
        $stmt = $this->conn->prepare($query);
        
        $this->TeacherProfileID = (int)$id;
        $stmt->bindParam(":TeacherProfileID", $this->TeacherProfileID, PDO::PARAM_INT);

        try {
            if ($stmt->execute()) {
                return $stmt->rowCount() > 0;
            }
        } catch (PDOException $e) {
            // Handle foreign key constraint issues if a teacher is an adviser
            return false;
        }
        return false;
    }
}
?>