<?php
/**
 * Model: Section
 *
 * Handles all database operations for the 'Sections' table.
 * Includes JOINs as requested for read operations.
 */
class Section {
    private $conn;
    private $table_name = "Sections";

    // Properties
    public $SectionID;
    public $GradeLevelID;
    public $SchoolYearID;
    public $AdviserTeacherID;
    public $SectionName;
    public $MaxCapacity;
    public $CurrentEnrollment;

    // Joined Properties (for read methods)
    public $LevelName;
    public $YearName;
    public $AdviserEmployeeNumber; // Assuming EmployeeNumber is the desired field.
    // You could also join to the 'Profiles' table to get the teacher's name.

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create a new section
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " 
                  (GradeLevelID, SchoolYearID, AdviserTeacherID, SectionName, MaxCapacity, CurrentEnrollment) 
                  VALUES (:GradeLevelID, :SchoolYearID, :AdviserTeacherID, :SectionName, :MaxCapacity, :CurrentEnrollment)";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->GradeLevelID = (int)$data->GradeLevelID;
        $this->SchoolYearID = (int)$data->SchoolYearID;
        $this->AdviserTeacherID = !empty($data->AdviserTeacherID) ? (int)$data->AdviserTeacherID : null;
        $this->SectionName = htmlspecialchars(strip_tags($data->SectionName));
        $this->MaxCapacity = !empty($data->MaxCapacity) ? (int)$data->MaxCapacity : null;
        $this->CurrentEnrollment = isset($data->CurrentEnrollment) ? (int)$data->CurrentEnrollment : 0; // Default 0

        // Bind
        $stmt->bindParam(":GradeLevelID", $this->GradeLevelID);
        $stmt->bindParam(":SchoolYearID", $this->SchoolYearID);
        $stmt->bindParam(":AdviserTeacherID", $this->AdviserTeacherID);
        $stmt->bindParam(":SectionName", $this->SectionName);
        $stmt->bindParam(":MaxCapacity", $this->MaxCapacity);
        $stmt->bindParam(":CurrentEnrollment", $this->CurrentEnrollment);

        try {
            return $stmt->execute();
        } catch (PDOException $e) {
            return false;
        }
    }

    /**
     * Read all sections with joined data
     */
    public function read() {
        $query = "SELECT 
                    s.SectionID, s.SectionName, s.MaxCapacity, s.CurrentEnrollment,
                    g.GradeLevelID, g.LevelName, g.SortOrder,
                    sy.SchoolYearID, sy.YearName,
                    t.TeacherProfileID, t.EmployeeNumber AS AdviserEmployeeNumber
                  FROM 
                    " . $this->table_name . " s
                    LEFT JOIN GradeLevels g ON s.GradeLevelID = g.GradeLevelID
                    LEFT JOIN SchoolYears sy ON s.SchoolYearID = sy.SchoolYearID
                    LEFT JOIN TeacherProfiles t ON s.AdviserTeacherID = t.TeacherProfileID
                  ORDER BY 
                    g.SortOrder ASC, s.SectionName ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Read a single section by ID with joined data
     */
    public function readOne($id) {
        $query = "SELECT 
                    s.SectionID, s.SectionName, s.MaxCapacity, s.CurrentEnrollment,
                    s.GradeLevelID, s.SchoolYearID, s.AdviserTeacherID,
                    g.LevelName,
                    sy.YearName,
                    t.EmployeeNumber AS AdviserEmployeeNumber
                  FROM 
                    " . $this->table_name . " s
                    LEFT JOIN GradeLevels g ON s.GradeLevelID = g.GradeLevelID
                    LEFT JOIN SchoolYears sy ON s.SchoolYearID = sy.SchoolYearID
                    LEFT JOIN TeacherProfiles t ON s.AdviserTeacherID = t.TeacherProfileID
                  WHERE 
                    s.SectionID = :SectionID 
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":SectionID", $id, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // Set properties from the 'Sections' table
            $this->SectionID = $row['SectionID'];
            $this->GradeLevelID = $row['GradeLevelID'];
            $this->SchoolYearID = $row['SchoolYearID'];
            $this->AdviserTeacherID = $row['AdviserTeacherID'];
            $this->SectionName = $row['SectionName'];
            $this->MaxCapacity = $row['MaxCapacity'];
            $this->CurrentEnrollment = $row['CurrentEnrollment'];

            // Set joined properties
            $this->LevelName = $row['LevelName'];
            $this->YearName = $row['YearName'];
            $this->AdviserEmployeeNumber = $row['AdviserEmployeeNumber'];
            return true;
        }
        return false;
    }

    /**
     * Update a section
     */
    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . "
                  SET 
                    GradeLevelID = :GradeLevelID, 
                    SchoolYearID = :SchoolYearID, 
                    AdviserTeacherID = :AdviserTeacherID, 
                    SectionName = :SectionName, 
                    MaxCapacity = :MaxCapacity, 
                    CurrentEnrollment = :CurrentEnrollment
                  WHERE 
                    SectionID = :SectionID";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->SectionID = (int)$id;
        $this->GradeLevelID = (int)$data->GradeLevelID;
        $this->SchoolYearID = (int)$data->SchoolYearID;
        $this->AdviserTeacherID = !empty($data->AdviserTeacherID) ? (int)$data->AdviserTeacherID : null;
        $this->SectionName = htmlspecialchars(strip_tags($data->SectionName));
        $this->MaxCapacity = !empty($data->MaxCapacity) ? (int)$data->MaxCapacity : null;
        $this->CurrentEnrollment = isset($data->CurrentEnrollment) ? (int)$data->CurrentEnrollment : 0;

        // Bind
        $stmt->bindParam(":GradeLevelID", $this->GradeLevelID);
        $stmt->bindParam(":SchoolYearID", $this->SchoolYearID);
        $stmt->bindParam(":AdviserTeacherID", $this->AdviserTeacherID);
        $stmt->bindParam(":SectionName", $this->SectionName);
        $stmt->bindParam(":MaxCapacity", $this->MaxCapacity);
        $stmt->bindParam(":CurrentEnrollment", $this->CurrentEnrollment);
        $stmt->bindParam(":SectionID", $this->SectionID, PDO::PARAM_INT);

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
     * Delete a section
     */
    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE SectionID = :SectionID";
        
        $stmt = $this->conn->prepare($query);
        
        $this->SectionID = (int)$id;
        $stmt->bindParam(":SectionID", $this->SectionID, PDO::PARAM_INT);

        try {
            if ($stmt->execute()) {
                return $stmt->rowCount() > 0;
            }
        } catch (PDOException $e) {
            // Handle FK constraints (e.g., if students are enrolled in this section)
            return false;
        }
        return false;
    }
}
?>