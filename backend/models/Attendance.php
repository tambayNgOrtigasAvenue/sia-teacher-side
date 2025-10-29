<?php
class Attendance{
    private $conn;
    private $table_name = 'attendance';

    public $AttendanceId;
    public $StudentProfileID;
    public $ClassScheduleID;
    public $AttendanceDate;
    public $CheckInTime;
    public $CheckOutTime;
    public $AttendanceStatus;
    public $AttendanceMethodId;
    public $notes;

    public function __construct($db){
        $this->conn = $db;
    }
    
    public function viewAttendance(){
        $query = 'SELECT p.LastName, p.FirstName, p.MiddleName, a.AttendanceStatus 
                  FROM attendance a 
                  JOIN profile p 
                  ON a.StudentProfileID = p.ProfileID 
                  ORDER BY a.AttendanceDate DESC;';
        try{
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $this->ClassScheduleID);
            $stmt->execute();
            $attendanceRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return [
                'success' => true,
                'data' => $attendanceRecords
            ];
        }
        catch(PDOException $e){
            error_log("View attendance error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Server error'];
        }
    }

    public function viewAttendanceReport(){

    }
}