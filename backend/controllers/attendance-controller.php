<?php
require_once '../models/Attendance.php';

class AttendanceController {
    private $conn;
    private $attendanceModel;

    public function __construct($db) {
        $this->conn = $db;
        $this->attendanceModel = new Attendance($db);
    }

    public function checkAttendance() {
        // Implement the logic to check attendance here
    }
    
    public function checkIn(){
        // Implement the logic to check in a student here
    }

    public function checkOut(){
        // Implement the logic to check out a student here
    }
}