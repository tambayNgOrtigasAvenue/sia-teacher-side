<?php
class Grade{
    private $conn;
    private $table_name = 'grade';
    
    public $GradeId;
    public $EnrollmentID;
    public $SubjectID;
    public $Quarter;
    public $GradeValue;
    public $Remarks;
    public $GradeStatusID;
    public $LastModified;
    public $ModifiedByUserID;

    public function __construct($db){
        $this->conn = $db;
    }

    public function viewAllStudentsGrade(){

    }
    
    public function insertGrade(){
        $query = 'INSERT INTO ' . $this->table_name . ' SET
                    EnrollmentID = :EnrollmentID,
                    SubjectID = :SubjectID,
                    Quarter = :Quarter,
                    GradeValue = :GradeValue,
                    Remarks = :Remarks,
                    GradeStatusID = :GradeStatusID,
                    ModifiedByUserID = :ModifiedByUserID';
        $stmt = $this->conn->prepare($query);
        // This cleans the data before binding to prevent injection attacks
        $this->EnrollmentID = htmlspecialchars(strip_tags($this->EnrollmentID));
        $this->SubjectID = htmlspecialchars(strip_tags($this->SubjectID));
        $this->Quarter = htmlspecialchars(strip_tags($this->Quarter));
        $this->GradeValue = htmlspecialchars(strip_tags($this->GradeValue));
        $this->Remarks = htmlspecialchars(strip_tags($this->Remarks));
        $this->GradeStatusID = htmlspecialchars(strip_tags($this->GradeStatusID));
        $this->ModifiedByUserID = htmlspecialchars(strip_tags($this->ModifiedByUserID));

        $stmt->bindParam(':EnrollmentID', $this->EnrollmentID);
        $stmt->bindParam(':SubjectID', $this->SubjectID);
        $stmt->bindParam(':Quarter', $this->Quarter);
        $stmt->bindParam(':GradeValue', $this->GradeValue);
        $stmt->bindParam(':Remarks', $this->Remarks);
        $stmt->bindParam(':GradeStatusID', $this->GradeStatusID);
        $stmt->bindParam(':ModifiedByUserID', $this->ModifiedByUserID);

        // 5. Execute the query
        if ($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    public function updateGrade(){
        $query = 'UPDATE ' . $this->table_name . ' SET
                    GradeValue = :GradeValue,
                    Remarks = :Remarks,
                    GradeStatusID = :GradeStatusID,
                    LastModified = NOW(),
                    ModifiedByUserID = :ModifiedByUserID
                  WHERE GradeId = :GradeId';
        $stmt = $this->conn->prepare($query);

        // This cleans the data before binding to prevent injection attacks
        $this->GradeValue = htmlspecialchars(strip_tags($this->GradeValue));
        $this->Remarks = htmlspecialchars(strip_tags($this->Remarks));
        $this->GradeStatusID = htmlspecialchars(strip_tags($this->GradeStatusID));
        $this->ModifiedByUserID = htmlspecialchars(strip_tags($this->ModifiedByUserID));
        $this->GradeId = htmlspecialchars(strip_tags($this->GradeId));

        $stmt->bindParam(':GradeValue', $this->GradeValue);
        $stmt->bindParam(':Remarks', $this->Remarks);
        $stmt->bindParam(':GradeStatusID', $this->GradeStatusID);
        $stmt->bindParam(':ModifiedByUserID', $this->ModifiedByUserID);
        $stmt->bindParam(':GradeId', $this->GradeId);

        // 5. Execute the query
        if ($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->error);
        return false;
    }
}