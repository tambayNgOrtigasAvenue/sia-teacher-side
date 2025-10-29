<?php
class Classes{
    private $conn;
    private $table_name = 'section';
    
    public $SectionID;
    public $GradeLevelID;
    public $SchoolYearID;
    public $AdviserID;
    public $SectionName;
    public $MaxCapacity;
    public $CurrentEnrollment;

    public function __construct($db){
        $this->conn = $db;
    }

    public function viewClasses(){
        $query = 'SELECT g.GradeLevel, s.SectionName FROM ' . $this->table_name . ' s 
                  JOIN gradelevel g 
                  ON s.GradeLevelID = g.GradeLevelID 
                  ORDER BY g.GradeLevel ASC;';
        try{
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $myClasses = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return [
                'success' => true,
                'data' => $myClasses
            ];
        }
        catch(PDOException $e){
            error_log("View classes error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Server error'];
        }
    }

    public function createSchedule(){
        //Logic here
    }
}