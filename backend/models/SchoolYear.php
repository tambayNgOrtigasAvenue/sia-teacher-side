<?php
/**
 * Model: SchoolYear
 *
 * Handles all database operations for the 'SchoolYears' table.
 */
class SchoolYear {
    private $conn;
    private $table_name = "SchoolYears";

    // Properties
    public $SchoolYearID;
    public $YearName;
    public $StartDate;
    public $EndDate;
    public $IsActive;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create a new school year
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " 
                  (YearName, StartDate, EndDate, IsActive) 
                  VALUES (:YearName, :StartDate, :EndDate, :IsActive)";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->YearName = htmlspecialchars(strip_tags($data->YearName));
        $this->StartDate = htmlspecialchars(strip_tags($data->StartDate));
        $this->EndDate = htmlspecialchars(strip_tags($data->EndDate));
        $this->IsActive = isset($data->IsActive) ? (int)$data->IsActive : 0;

        // Bind
        $stmt->bindParam(":YearName", $this->YearName);
        $stmt->bindParam(":StartDate", $this->StartDate);
        $stmt->bindParam(":EndDate", $this->EndDate);
        $stmt->bindParam(":IsActive", $this->IsActive);

        try {
            return $stmt->execute();
        } catch (PDOException $e) {
            return false;
        }
    }

    /**
     * Read all school years
     */
    public function read() {
        $query = "SELECT SchoolYearID, YearName, StartDate, EndDate, IsActive 
                  FROM " . $this->table_name . " 
                  ORDER BY StartDate DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Read a single school year by ID
     */
    public function readOne($id) {
        $query = "SELECT SchoolYearID, YearName, StartDate, EndDate, IsActive 
                  FROM " . $this->table_name . " 
                  WHERE SchoolYearID = :SchoolYearID LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":SchoolYearID", $id, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->SchoolYearID = $row['SchoolYearID'];
            $this->YearName = $row['YearName'];
            $this->StartDate = $row['StartDate'];
            $this->EndDate = $row['EndDate'];
            $this->IsActive = $row['IsActive'];
            return true;
        }
        return false;
    }

    /**
     * Update a school year
     */
    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . "
                  SET YearName = :YearName, StartDate = :StartDate, EndDate = :EndDate, IsActive = :IsActive
                  WHERE SchoolYearID = :SchoolYearID";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->SchoolYearID = (int)$id;
        $this->YearName = htmlspecialchars(strip_tags($data->YearName));
        $this->StartDate = htmlspecialchars(strip_tags($data->StartDate));
        $this->EndDate = htmlspecialchars(strip_tags($data->EndDate));
        $this->IsActive = isset($data->IsActive) ? (int)$data->IsActive : 0;

        // Bind
        $stmt->bindParam(":YearName", $this->YearName);
        $stmt->bindParam(":StartDate", $this->StartDate);
        $stmt->bindParam(":EndDate", $this->EndDate);
        $stmt->bindParam(":IsActive", $this->IsActive);
        $stmt->bindParam(":SchoolYearID", $this->SchoolYearID, PDO::PARAM_INT);

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
     * Delete a school year
     */
    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE SchoolYearID = :SchoolYearID";
        
        $stmt = $this->conn->prepare($query);
        
        $this->SchoolYearID = (int)$id;
        $stmt->bindParam(":SchoolYearID", $this->SchoolYearID, PDO::PARAM_INT);

        try {
            if ($stmt->execute()) {
                return $stmt->rowCount() > 0;
            }
        } catch (PDOException $e) {
            return false;
        }
        return false;
    }
}
?>