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
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function viewAttendanceReport(){

    }
}