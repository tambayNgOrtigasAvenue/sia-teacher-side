<?php

class User {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getStudentByStudentNumber($studentNumber) {
        $query = "
            SELECT 
                u.UserID,
                sp.StudentNumber,
                pp.PasswordHash,
                CONCAT(p.FirstName, ' ', p.LastName) AS FullName,
                u.UserType,
                u.AccountStatus
            FROM 
                studentprofile sp
            JOIN 
                profile p ON sp.ProfileID = p.ProfileID
            JOIN 
                user u ON p.UserID = u.UserID
            JOIN 
                passwordpolicy pp ON u.UserID = pp.UserID
            WHERE 
                sp.StudentNumber = :studentNumber AND u.UserType = 'Student'
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':studentNumber', $studentNumber);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return false;
        }
    }


    public function getStudentByUserId($userId) {
        $query = "
            SELECT 
                u.UserID, u.EmailAddress, u.UserType, u.AccountStatus, u.LastLoginDate,
                p.ProfileID, p.FirstName, p.LastName, p.MiddleName,
                CONCAT_WS(' ', p.FirstName, p.MiddleName, p.LastName) AS FullName,
                CAST(p.EncryptedPhoneNumber AS CHAR) AS PhoneNumber,
                CAST(p.EncryptedAddress AS CHAR) AS Address,
                p.ProfilePictureURL,
                sp.StudentProfileID, sp.StudentNumber, sp.QRCodeID, sp.DateOfBirth, sp.Gender, sp.Nationality, sp.StudentStatus,
                TIMESTAMPDIFF(YEAR, sp.DateOfBirth, CURDATE()) AS Age,
                sy.YearName AS SchoolYear, sy.SchoolYearID,
                gl.LevelName AS GradeLevel,
                sec.SectionName, sec.SectionID,
                CONCAT(gl.LevelName, ' - ', sec.SectionName) AS GradeAndSection,
                CONCAT_WS(' ', adviser_profile.FirstName, adviser_profile.LastName) AS AdviserName,
                mi.Weight, mi.Height,
                CAST(mi.EncryptedAllergies AS CHAR) AS Allergies,
                CAST(mi.EncryptedMedicalConditions AS CHAR) AS MedicalConditions,
                CAST(mi.EncryptedMedications AS CHAR) AS Medications,
                ec.ContactPerson AS EmergencyContactPerson,
                CAST(ec.EncryptedContactNumber AS CHAR) AS EmergencyContactNumber,
                g_primary.FullName AS PrimaryGuardianName,
                sg_primary.RelationshipType AS PrimaryGuardianRelationship,
                CAST(g_primary.EncryptedPhoneNumber AS CHAR) AS PrimaryGuardianContactNumber,
                CAST(g_primary.EncryptedEmailAddress AS CHAR) AS PrimaryGuardianEmail
            FROM 
                user u
            JOIN profile p ON u.UserID = p.UserID
            JOIN studentprofile sp ON p.ProfileID = sp.ProfileID
            
            LEFT JOIN (
                SELECT e_inner.*
                FROM enrollment e_inner
                INNER JOIN (
                    -- This subquery finds the single highest EnrollmentID for each student
                    SELECT StudentProfileID, MAX(EnrollmentID) as MaxID
                    FROM enrollment
                    GROUP BY StudentProfileID
                ) latest_e ON e_inner.StudentProfileID = latest_e.StudentProfileID AND e_inner.EnrollmentID = latest_e.MaxID
            ) e ON sp.StudentProfileID = e.StudentProfileID

            LEFT JOIN schoolyear sy ON e.SchoolYearID = sy.SchoolYearID
            LEFT JOIN section sec ON e.SectionID = sec.SectionID
            LEFT JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
            LEFT JOIN teacherprofile tp ON sec.AdviserTeacherID = tp.TeacherProfileID
            LEFT JOIN profile adviser_profile ON tp.ProfileID = adviser_profile.ProfileID
            LEFT JOIN medicalinfo mi ON sp.StudentProfileID = mi.StudentProfileID
            LEFT JOIN emergencycontact ec ON sp.StudentProfileID = ec.StudentProfileID
            LEFT JOIN studentguardian sg_primary ON sp.StudentProfileID = sg_primary.StudentProfileID AND sg_primary.IsPrimaryContact = 1
            LEFT JOIN guardian g_primary ON sg_primary.GuardianID = g_primary.GuardianID
            WHERE 
                u.UserID = :userId 
                AND u.UserType = 'Student'
                AND u.IsDeleted = 0
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return false;
        }
    }

    public function getTeacherByUserId($userId){
        $query = "
            SELECT 
                u.UserID, u.EmailAddress, u.UserType, u.AccountStatus, u.LastLoginDate,
                p.ProfileID, p.FirstName, p.LastName, p.MiddleName,
                CONCAT_WS(' ', p.FirstName, p.MiddleName, p.LastName) AS FullName,
                CAST(p.EncryptedPhoneNumber AS CHAR) AS PhoneNumber,
                CAST(p.EncryptedAddress AS CHAR) AS Address,
                p.ProfilePictureURL,
                tp.TeacherProfileID, tp.EmployeeNumber, tp.Specialization, tp.HireDate,
                ur.RoleID, r.RoleName, r.Description as RoleDescription
            FROM 
                user u
            JOIN 
                profile p ON u.UserID = p.UserID
            JOIN 
                teacherprofile tp ON p.ProfileID = tp.ProfileID
            LEFT JOIN 
                passwordpolicy pp ON u.UserID = pp.UserID
            LEFT JOIN
                userrole ur ON u.UserID = ur.UserID
            LEFT JOIN
                role r ON ur.RoleID = r.RoleID
            WHERE 
                u.UserID = :userId AND u.UserType = 'Teacher'
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Get teacher by UserID error: " . $e->getMessage());
            return false;
        }
    }

    public function getTeacherByEmployeeNumber($EmployeeNumber){
        $query = "
            SELECT 
                u.UserID,
                tp.EmployeeNumber,
                pp.PasswordHash,
                CONCAT(p.FirstName, ' ', p.LastName) AS FullName,
                u.UserType,
                u.AccountStatus
            FROM 
                teacherprofile tp
            JOIN 
                profile p ON tp.ProfileID = p.ProfileID
            JOIN 
                user u ON p.UserID = u.UserID
            WHERE 
                tp.EmployeeNumber = :EmployeeNumber AND u.UserType = 'Teacher'";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':EmployeeNumber', $EmployeeNumber);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Optional: Log the error for debugging
            error_log("Teacher login error: " . $e->getMessage());
            return false;
        }
    }
}
?>