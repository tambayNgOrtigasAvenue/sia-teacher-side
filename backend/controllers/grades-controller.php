<?php
require_once __DIR__ . '/../../vendor/autoload.php';

class GradeController{
    private $conn;

    public function __construct($db){
        $this->conn = $db;
    }

    public function insertOrUpdateStudentGrade($student_id, $subject_id, $quarter, $grade){
        // Sanitize input
        $student_id = htmlspecialchars(strip_tags($student_id));
        $subject_id = htmlspecialchars(strip_tags($subject_id));
        $quarter = htmlspecialchars(strip_tags($quarter));
        $grade = htmlspecialchars(strip_tags($grade));

        // Check if a grade already exists
        $check_query = "SELECT GradeID FROM grades WHERE StudentID = ? AND SubjectID = ? AND Quarter = ?";
        $check_stmt = $this->conn->prepare($check_query);
        $check_stmt->execute([$student_id, $subject_id, $quarter]);
        $grade_id = $check_stmt->fetchColumn();

        if ($grade_id) {
            // Grade exists, so UPDATE it
            $query = "UPDATE grades SET GradeValue = ? WHERE GradeID = ?";
            $stmt = $this->conn->prepare($query);
            $params = [$grade, $grade_id];
        } else {
            // Grade does not exist, so INSERT it
            $query = "INSERT INTO grades (StudentID, SubjectID, Quarter, GradeValue) VALUES (?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $params = [$student_id, $subject_id, $quarter, $grade];
        }
        if($stmt->execute($params)){
            return ['success' => true, 'message' => 'Grade saved successfully.'];
        } else {
            return ['success' => false, 'message' => 'Failed to save grade.'];
        }
    }

    public function viewStudentGradeByStudentId($student_id){
        $stmt = $this->conn->prepare("SELECT * FROM grades WHERE student_id = ?");

        try{
            $stmt->bindParam(1, $student_id);
            $stmt->execute();
            $studentGrades = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return [
                'success' => true,
                'data' => $studentGrades
            ];
        }
        catch(PDOException $e){
            error_log("View student grade error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Server error'];
        }
    }
}