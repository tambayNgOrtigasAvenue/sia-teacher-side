<?php
/**
 * Model: GradeLevel
 *
 * Handles all database operations for the 'GradeLevels' table.
 */
class GradeLevel {
    // Database connection and table name
    private $conn;
    private $table_name = "GradeLevels";

    // Object Properties
    public $GradeLevelID;
    public $LevelName;
    public $SortOrder;

    /**
     * Constructor with $db as database connection
     *
     * @param PDO $db The PDO database connection object
     */
    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create a new grade level
     *
     * @param object $data Data containing LevelName and SortOrder
     * @return bool True on success, false on failure
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " (LevelName, SortOrder) VALUES (:LevelName, :SortOrder)";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize data (basic trim)
        $this->LevelName = htmlspecialchars(strip_tags($data->LevelName));
        $this->SortOrder = (int)$data->SortOrder;

        // Bind values
        $stmt->bindParam(":LevelName", $this->LevelName);
        $stmt->bindParam(":SortOrder", $this->SortOrder);

        // Execute query
        try {
            if ($stmt->execute()) {
                return true;
            }
        } catch (PDOException $e) {
            // Handle error, e.g., log $e->getMessage()
            return false;
        }
        return false;
    }

    /**
     * Read all grade levels
     *
     * @return PDOStatement The executed PDOStatement object
     */
    public function read() {
        $query = "SELECT GradeLevelID, LevelName, SortOrder FROM " . $this->table_name . " ORDER BY SortOrder ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    /**
     * Read a single grade level by ID
     *
     * @param int $id The ID of the grade level to read
     * @return bool True if record is found and properties are set, false otherwise
     */
    public function readOne($id) {
        $query = "SELECT GradeLevelID, LevelName, SortOrder FROM " . $this->table_name . " WHERE GradeLevelID = :GradeLevelID LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":GradeLevelID", $id, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // Set properties
            $this->GradeLevelID = $row['GradeLevelID'];
            $this->LevelName = $row['LevelName'];
            $this->SortOrder = $row['SortOrder'];
            return true;
        }
        return false;
    }

    /**
     * Update an existing grade level
     *
     * @param int $id The ID of the grade level to update
     * @param object $data Data containing LevelName and SortOrder
     * @return bool True on success, false on failure
     */
    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . "
                  SET LevelName = :LevelName, SortOrder = :SortOrder
                  WHERE GradeLevelID = :GradeLevelID";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize data
        $this->LevelName = htmlspecialchars(strip_tags($data->LevelName));
        $this->SortOrder = (int)$data->SortOrder;
        $this->GradeLevelID = (int)$id;

        // Bind values
        $stmt->bindParam(":LevelName", $this->LevelName);
        $stmt->bindParam(":SortOrder", $this->SortOrder);
        $stmt->bindParam(":GradeLevelID", $this->GradeLevelID, PDO::PARAM_INT);

        // Execute query
        try {
            if ($stmt->execute()) {
                // Check if any row was actually updated
                return $stmt->rowCount() > 0;
            }
        } catch (PDOException $e) {
            return false;
        }
        return false;
    }

    /**
     * Delete a grade level
     *
     * @param int $id The ID of the grade level to delete
     * @return bool True on success, false on failure
     */
    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE GradeLevelID = :GradeLevelID";
        
        $stmt = $this->conn->prepare($query);
        
        // Sanitize
        $this->GradeLevelID = (int)$id;

        // Bind ID
        $stmt->bindParam(":GradeLevelID", $this->GradeLevelID, PDO::PARAM_INT);

        // Execute query
        try {
            if ($stmt->execute()) {
                // Check if any row was actually deleted
                return $stmt->rowCount() > 0;
            }
        } catch (PDOException $e) {
            return false;
        }
        return false;
    }
}
?>