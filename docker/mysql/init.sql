-- ========================================
-- Gymnazo Christian Academy Database
-- Docker MySQL Initialization Script
-- ========================================
-- This script will run automatically when the MySQL container is first created
-- It includes the complete database schema and initial setup

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- ========================================
-- Table Structures
-- ========================================

-- Table: academicstanding
CREATE TABLE IF NOT EXISTS `academicstanding` (
  `StandingID` int(11) NOT NULL AUTO_INCREMENT,
  `EnrollmentID` int(11) NOT NULL,
  `GeneralAverage` decimal(5,2) DEFAULT NULL,
  `AttendanceRate` decimal(5,2) DEFAULT NULL COMMENT 'As a percentage',
  `StandingLevelID` int(11) DEFAULT NULL,
  `ParticipationLevelID` int(11) DEFAULT NULL,
  `ComputedDate` datetime NOT NULL,
  PRIMARY KEY (`StandingID`),
  UNIQUE KEY `EnrollmentID` (`EnrollmentID`),
  KEY `fk_AcademicStanding_StandingLevel` (`StandingLevelID`),
  KEY `fk_AcademicStanding_ParticipationLevel` (`ParticipationLevelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: academicstandinglevel
CREATE TABLE IF NOT EXISTS `academicstandinglevel` (
  `StandingLevelID` int(11) NOT NULL AUTO_INCREMENT,
  `LevelName` varchar(100) NOT NULL,
  `MinAverage` decimal(5,2) DEFAULT NULL,
  `SortOrder` int(11) DEFAULT 0,
  PRIMARY KEY (`StandingLevelID`),
  UNIQUE KEY `LevelName` (`LevelName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: announcement
CREATE TABLE IF NOT EXISTS `announcement` (
  `AnnouncementID` int(11) NOT NULL AUTO_INCREMENT,
  `AuthorUserID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Content` text NOT NULL,
  `PublishDate` datetime NOT NULL,
  `ExpiryDate` datetime DEFAULT NULL,
  `TargetAudience` enum('All Users','Students','Teachers','Parents','Staff') NOT NULL,
  `IsPinned` tinyint(1) NOT NULL DEFAULT 0,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`AnnouncementID`),
  KEY `fk_Announcement_User` (`AuthorUserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: application
CREATE TABLE IF NOT EXISTS `application` (
  `ApplicationID` int(11) NOT NULL AUTO_INCREMENT,
  `ApplicantProfileID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `ApplyingForGradeLevelID` int(11) NOT NULL,
  `EnrolleeType` enum('New','Old','Transferee') NOT NULL,
  `ApplicationStatus` enum('Pending','For Review','Approved','Rejected','Waitlisted') NOT NULL DEFAULT 'Pending',
  `SubmissionDate` datetime NOT NULL DEFAULT current_timestamp(),
  `ReviewedDate` datetime DEFAULT NULL,
  `PreviousSchool` varchar(255) DEFAULT NULL,
  `ReviewedByUserID` int(11) DEFAULT NULL,
  PRIMARY KEY (`ApplicationID`),
  KEY `fk_Application_SchoolYear` (`SchoolYearID`),
  KEY `fk_Application_GradeLevel` (`ApplyingForGradeLevelID`),
  KEY `fk_Application_ReviewedByUser` (`ReviewedByUserID`),
  KEY `idx_application_applicant` (`ApplicantProfileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: applicationrequirement
CREATE TABLE IF NOT EXISTS `applicationrequirement` (
  `RequirementID` int(11) NOT NULL AUTO_INCREMENT,
  `ApplicationID` int(11) NOT NULL,
  `RequirementTypeID` int(11) NOT NULL,
  `SecureFileID` int(11) DEFAULT NULL,
  `RequirementStatus` enum('Submitted','Verified','Missing','Rejected') NOT NULL DEFAULT 'Missing',
  `SubmittedDate` datetime DEFAULT NULL,
  `VerifiedByUserID` int(11) DEFAULT NULL,
  PRIMARY KEY (`RequirementID`),
  KEY `fk_ApplicationRequirement_Application` (`ApplicationID`),
  KEY `fk_ApplicationRequirement_RequirementType` (`RequirementTypeID`),
  KEY `fk_ApplicationRequirement_SecureFile` (`SecureFileID`),
  KEY `fk_ApplicationRequirement_VerifiedByUser` (`VerifiedByUserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: applieddiscount
CREATE TABLE IF NOT EXISTS `applieddiscount` (
  `AppliedDiscountID` int(11) NOT NULL AUTO_INCREMENT,
  `TransactionID` int(11) NOT NULL,
  `DiscountID` int(11) NOT NULL,
  `DiscountAmount` decimal(10,2) NOT NULL,
  `ApprovedByUserID` int(11) DEFAULT NULL,
  `AppliedDate` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`AppliedDiscountID`),
  KEY `fk_AppliedDiscount_Transaction` (`TransactionID`),
  KEY `fk_AppliedDiscount_Discount` (`DiscountID`),
  KEY `fk_AppliedDiscount_ApprovedByUser` (`ApprovedByUserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: attendance
CREATE TABLE IF NOT EXISTS `attendance` (
  `AttendanceID` int(11) NOT NULL AUTO_INCREMENT,
  `StudentProfileID` int(11) NOT NULL,
  `ClassScheduleID` int(11) NOT NULL,
  `AttendanceDate` date NOT NULL,
  `CheckInTime` datetime DEFAULT NULL,
  `CheckOutTime` datetime DEFAULT NULL,
  `AttendanceStatus` enum('Present','Late','Absent','Excused') NOT NULL,
  `AttendanceMethodID` int(11) DEFAULT NULL,
  `Notes` text DEFAULT NULL,
  PRIMARY KEY (`AttendanceID`),
  UNIQUE KEY `StudentProfileID` (`StudentProfileID`,`ClassScheduleID`,`AttendanceDate`),
  KEY `fk_Attendance_ClassSchedule` (`ClassScheduleID`),
  KEY `fk_Attendance_Method` (`AttendanceMethodID`),
  KEY `idx_attendance_student_schedule` (`StudentProfileID`,`ClassScheduleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: attendancemethod
CREATE TABLE IF NOT EXISTS `attendancemethod` (
  `MethodID` int(11) NOT NULL AUTO_INCREMENT,
  `MethodName` varchar(100) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`MethodID`),
  UNIQUE KEY `MethodName` (`MethodName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: auditlog
CREATE TABLE IF NOT EXISTS `auditlog` (
  `AuditID` bigint(20) NOT NULL AUTO_INCREMENT,
  `TableName` varchar(100) NOT NULL,
  `RecordID` int(11) DEFAULT NULL,
  `Operation` enum('INSERT','UPDATE','DELETE','LOGIN','LOGOUT') NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `OldValues` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`OldValues`)),
  `NewValues` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`NewValues`)),
  `IPAddress` varchar(45) DEFAULT NULL,
  `UserAgent` varchar(255) DEFAULT NULL,
  `Timestamp` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`AuditID`),
  KEY `idx_auditlog_table_record` (`TableName`,`RecordID`),
  KEY `idx_auditlog_user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: classschedule
CREATE TABLE IF NOT EXISTS `classschedule` (
  `ScheduleID` int(11) NOT NULL AUTO_INCREMENT,
  `SectionID` int(11) NOT NULL,
  `SubjectID` int(11) NOT NULL,
  `TeacherProfileID` int(11) DEFAULT NULL,
  `DayOfWeek` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `StartTime` time NOT NULL,
  `EndTime` time NOT NULL,
  `ScheduleStatusID` int(11) DEFAULT NULL,
  `RoomNumber` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ScheduleID`),
  KEY `fk_ClassSchedule_Section` (`SectionID`),
  KEY `fk_ClassSchedule_Subject` (`SubjectID`),
  KEY `fk_ClassSchedule_TeacherProfile` (`TeacherProfileID`),
  KEY `fk_ClassSchedule_Status` (`ScheduleStatusID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: discount
CREATE TABLE IF NOT EXISTS `discount` (
  `DiscountID` int(11) NOT NULL AUTO_INCREMENT,
  `DiscountName` varchar(100) NOT NULL,
  `DiscountTypeID` int(11) NOT NULL,
  `PercentageOrAmount` decimal(10,2) NOT NULL,
  `IsPercentage` tinyint(1) NOT NULL,
  `ValidFrom` date DEFAULT NULL,
  `ValidUntil` date DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`DiscountID`),
  KEY `fk_Discount_DiscountType` (`DiscountTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: discounttype
CREATE TABLE IF NOT EXISTS `discounttype` (
  `DiscountTypeID` int(11) NOT NULL AUTO_INCREMENT,
  `TypeName` varchar(100) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`DiscountTypeID`),
  UNIQUE KEY `TypeName` (`TypeName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: emergencycontact
CREATE TABLE IF NOT EXISTS `emergencycontact` (
  `EmergencyContactID` int(11) NOT NULL AUTO_INCREMENT,
  `StudentProfileID` int(11) NOT NULL,
  `ContactPerson` varchar(255) NOT NULL,
  `EncryptedContactNumber` varbinary(255) NOT NULL,
  PRIMARY KEY (`EmergencyContactID`),
  KEY `fk_EmergencyContact_StudentProfile` (`StudentProfileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: enrollment
CREATE TABLE IF NOT EXISTS `enrollment` (
  `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT,
  `StudentProfileID` int(11) NOT NULL,
  `SectionID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `EnrollmentDate` date NOT NULL,
  PRIMARY KEY (`EnrollmentID`),
  UNIQUE KEY `StudentProfileID` (`StudentProfileID`,`SchoolYearID`),
  KEY `fk_Enrollment_Section` (`SectionID`),
  KEY `fk_Enrollment_SchoolYear` (`SchoolYearID`),
  KEY `idx_enrollment_student` (`StudentProfileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: faq
CREATE TABLE IF NOT EXISTS `faq` (
  `FAQID` int(11) NOT NULL AUTO_INCREMENT,
  `Question` text NOT NULL,
  `Answer` text NOT NULL,
  `Category` varchar(100) DEFAULT NULL,
  `ViewCount` int(11) NOT NULL DEFAULT 0,
  `IsPublished` tinyint(1) NOT NULL DEFAULT 0,
  `SortOrder` int(11) DEFAULT 0,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`FAQID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: grade
CREATE TABLE IF NOT EXISTS `grade` (
  `GradeID` int(11) NOT NULL AUTO_INCREMENT,
  `EnrollmentID` int(11) NOT NULL,
  `SubjectID` int(11) NOT NULL,
  `Quarter` enum('First Quarter','Second Quarter','Third Quarter','Fourth Quarter') NOT NULL,
  `GradeValue` decimal(5,2) DEFAULT NULL,
  `Remarks` text DEFAULT NULL,
  `GradeStatusID` int(11) DEFAULT NULL,
  `LastModified` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ModifiedByUserID` int(11) DEFAULT NULL,
  PRIMARY KEY (`GradeID`),
  UNIQUE KEY `EnrollmentID` (`EnrollmentID`,`SubjectID`,`Quarter`),
  KEY `fk_Grade_Subject` (`SubjectID`),
  KEY `fk_Grade_Status` (`GradeStatusID`),
  KEY `fk_Grade_ModifiedByUser` (`ModifiedByUserID`),
  KEY `idx_grade_enrollment_subject` (`EnrollmentID`,`SubjectID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: gradelevel
CREATE TABLE IF NOT EXISTS `gradelevel` (
  `GradeLevelID` int(11) NOT NULL AUTO_INCREMENT,
  `LevelName` varchar(50) NOT NULL,
  `SortOrder` int(11) NOT NULL,
  PRIMARY KEY (`GradeLevelID`),
  UNIQUE KEY `LevelName` (`LevelName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: gradestatus
CREATE TABLE IF NOT EXISTS `gradestatus` (
  `StatusID` int(11) NOT NULL AUTO_INCREMENT,
  `StatusName` varchar(50) NOT NULL,
  PRIMARY KEY (`StatusID`),
  UNIQUE KEY `StatusName` (`StatusName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: guardian
CREATE TABLE IF NOT EXISTS `guardian` (
  `GuardianID` int(11) NOT NULL AUTO_INCREMENT,
  `FullName` varchar(255) NOT NULL,
  `EncryptedPhoneNumber` varbinary(255) DEFAULT NULL,
  `EncryptedEmailAddress` varbinary(255) DEFAULT NULL,
  `Occupation` varchar(100) DEFAULT NULL,
  `WorkAddress` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`GuardianID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: itemtype
CREATE TABLE IF NOT EXISTS `itemtype` (
  `ItemTypeID` int(11) NOT NULL AUTO_INCREMENT,
  `TypeName` varchar(100) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `SortOrder` int(11) DEFAULT 0,
  PRIMARY KEY (`ItemTypeID`),
  UNIQUE KEY `TypeName` (`TypeName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: medicalinfo
CREATE TABLE IF NOT EXISTS `medicalinfo` (
  `MedicalInfoID` int(11) NOT NULL AUTO_INCREMENT,
  `StudentProfileID` int(11) NOT NULL,
  `Weight` decimal(5,2) DEFAULT NULL COMMENT 'In kilograms',
  `Height` decimal(5,2) DEFAULT NULL COMMENT 'In centimeters',
  `EncryptedAllergies` blob DEFAULT NULL,
  `EncryptedMedicalConditions` blob DEFAULT NULL,
  `EncryptedMedications` blob DEFAULT NULL,
  PRIMARY KEY (`MedicalInfoID`),
  UNIQUE KEY `StudentProfileID` (`StudentProfileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: notificationlog
CREATE TABLE IF NOT EXISTS `notificationlog` (
  `LogID` int(11) NOT NULL AUTO_INCREMENT,
  `RecipientUserID` int(11) NOT NULL,
  `NotificationTypeID` int(11) DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Message` text NOT NULL,
  `SentAt` datetime NOT NULL DEFAULT current_timestamp(),
  `IsRead` tinyint(1) NOT NULL DEFAULT 0,
  `NotificationStatus` enum('Sent','Failed','Pending','Delivered','Read') NOT NULL,
  `ErrorMessage` text DEFAULT NULL,
  `RetryCount` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`LogID`),
  KEY `fk_NotificationLog_User` (`RecipientUserID`),
  KEY `fk_NotificationLog_NotificationType` (`NotificationTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: notificationtype
CREATE TABLE IF NOT EXISTS `notificationtype` (
  `NotificationTypeID` int(11) NOT NULL AUTO_INCREMENT,
  `TypeName` varchar(100) NOT NULL,
  `TemplateContent` text DEFAULT NULL,
  PRIMARY KEY (`NotificationTypeID`),
  UNIQUE KEY `TypeName` (`TypeName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: participationlevel
CREATE TABLE IF NOT EXISTS `participationlevel` (
  `ParticipationLevelID` int(11) NOT NULL AUTO_INCREMENT,
  `LevelName` varchar(100) NOT NULL,
  `SortOrder` int(11) DEFAULT 0,
  PRIMARY KEY (`ParticipationLevelID`),
  UNIQUE KEY `LevelName` (`LevelName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: passwordhistory
CREATE TABLE IF NOT EXISTS `passwordhistory` (
  `HistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`HistoryID`),
  KEY `fk_PasswordHistory_User` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: passwordpolicy
CREATE TABLE IF NOT EXISTS `passwordpolicy` (
  `PolicyID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `PasswordSetDate` datetime NOT NULL DEFAULT current_timestamp(),
  `ExpiryDate` datetime DEFAULT NULL,
  `MustChange` tinyint(1) NOT NULL DEFAULT 0,
  `FailedLoginAttempts` int(11) NOT NULL DEFAULT 0,
  `LockedUntil` datetime DEFAULT NULL,
  PRIMARY KEY (`PolicyID`),
  UNIQUE KEY `UserID` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: payment
CREATE TABLE IF NOT EXISTS `payment` (
  `PaymentID` int(11) NOT NULL AUTO_INCREMENT,
  `TransactionID` int(11) NOT NULL,
  `PaymentMethodID` int(11) NOT NULL,
  `AmountPaid` decimal(10,2) NOT NULL,
  `PaymentDateTime` datetime NOT NULL DEFAULT current_timestamp(),
  `ReferenceNumber` varchar(255) DEFAULT NULL,
  `ProofFileID` int(11) DEFAULT NULL,
  `VerificationStatus` enum('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending',
  `VerifiedByUserID` int(11) DEFAULT NULL,
  `VerifiedAt` datetime DEFAULT NULL,
  `RejectionReason` text DEFAULT NULL,
  PRIMARY KEY (`PaymentID`),
  UNIQUE KEY `ReferenceNumber` (`ReferenceNumber`),
  KEY `fk_Payment_PaymentMethod` (`PaymentMethodID`),
  KEY `fk_Payment_SecureFile` (`ProofFileID`),
  KEY `fk_Payment_VerifiedByUser` (`VerifiedByUserID`),
  KEY `idx_payment_transaction` (`TransactionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: paymentmethod
CREATE TABLE IF NOT EXISTS `paymentmethod` (
  `PaymentMethodID` int(11) NOT NULL AUTO_INCREMENT,
  `MethodName` varchar(100) NOT NULL,
  `MethodIcon` varchar(255) DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `SortOrder` int(11) DEFAULT 0,
  PRIMARY KEY (`PaymentMethodID`),
  UNIQUE KEY `MethodName` (`MethodName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: permission
CREATE TABLE IF NOT EXISTS `permission` (
  `PermissionID` int(11) NOT NULL AUTO_INCREMENT,
  `PermissionCode` varchar(100) NOT NULL,
  `ModuleName` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  PRIMARY KEY (`PermissionID`),
  UNIQUE KEY `PermissionCode` (`PermissionCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: profile
CREATE TABLE IF NOT EXISTS `profile` (
  `ProfileID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `MiddleName` varchar(100) DEFAULT NULL,
  `EncryptedPhoneNumber` varbinary(255) DEFAULT NULL,
  `EncryptedAddress` varbinary(512) DEFAULT NULL,
  `ProfilePictureURL` varchar(2048) DEFAULT NULL,
  PRIMARY KEY (`ProfileID`),
  UNIQUE KEY `UserID` (`UserID`),
  KEY `idx_profile_user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: requirementtype
CREATE TABLE IF NOT EXISTS `requirementtype` (
  `RequirementTypeID` int(11) NOT NULL AUTO_INCREMENT,
  `TypeName` varchar(255) NOT NULL,
  `IsMandatory` tinyint(1) NOT NULL DEFAULT 1,
  `SortOrder` int(11) DEFAULT 0,
  PRIMARY KEY (`RequirementTypeID`),
  UNIQUE KEY `TypeName` (`TypeName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: role
CREATE TABLE IF NOT EXISTS `role` (
  `RoleID` int(11) NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`RoleID`),
  UNIQUE KEY `RoleName` (`RoleName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: rolepermission
CREATE TABLE IF NOT EXISTS `rolepermission` (
  `RolePermissionID` int(11) NOT NULL AUTO_INCREMENT,
  `RoleID` int(11) NOT NULL,
  `PermissionID` int(11) NOT NULL,
  PRIMARY KEY (`RolePermissionID`),
  UNIQUE KEY `RoleID` (`RoleID`,`PermissionID`),
  KEY `fk_RolePermission_Permission` (`PermissionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: schedulestatus
CREATE TABLE IF NOT EXISTS `schedulestatus` (
  `StatusID` int(11) NOT NULL AUTO_INCREMENT,
  `StatusName` varchar(50) NOT NULL,
  PRIMARY KEY (`StatusID`),
  UNIQUE KEY `StatusName` (`StatusName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: schoolyear
CREATE TABLE IF NOT EXISTS `schoolyear` (
  `SchoolYearID` int(11) NOT NULL AUTO_INCREMENT,
  `YearName` varchar(50) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`SchoolYearID`),
  UNIQUE KEY `YearName` (`YearName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: section
CREATE TABLE IF NOT EXISTS `section` (
  `SectionID` int(11) NOT NULL AUTO_INCREMENT,
  `GradeLevelID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `AdviserTeacherID` int(11) DEFAULT NULL,
  `SectionName` varchar(100) NOT NULL,
  `MaxCapacity` int(11) DEFAULT NULL,
  `CurrentEnrollment` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`SectionID`),
  KEY `fk_Section_GradeLevel` (`GradeLevelID`),
  KEY `fk_Section_SchoolYear` (`SchoolYearID`),
  KEY `fk_Section_TeacherProfile` (`AdviserTeacherID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: securefile
CREATE TABLE IF NOT EXISTS `securefile` (
  `FileID` int(11) NOT NULL AUTO_INCREMENT,
  `OriginalFileName` varchar(255) NOT NULL,
  `StoredFileName` varchar(255) NOT NULL,
  `FilePath` varchar(1024) NOT NULL,
  `FileSize` bigint(20) NOT NULL COMMENT 'In bytes',
  `MimeType` varchar(100) NOT NULL,
  `FileHash` varchar(255) DEFAULT NULL,
  `UploadedByUserID` int(11) DEFAULT NULL,
  `UploadedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `EncryptionMethod` varchar(50) DEFAULT NULL,
  `AccessLevel` varchar(50) DEFAULT 'private',
  `ExpiryDate` datetime DEFAULT NULL,
  PRIMARY KEY (`FileID`),
  UNIQUE KEY `StoredFileName` (`StoredFileName`),
  UNIQUE KEY `FileHash` (`FileHash`),
  KEY `fk_SecureFile_User` (`UploadedByUserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: studentguardian
CREATE TABLE IF NOT EXISTS `studentguardian` (
  `StudentGuardianID` int(11) NOT NULL AUTO_INCREMENT,
  `StudentProfileID` int(11) NOT NULL,
  `GuardianID` int(11) NOT NULL,
  `RelationshipType` enum('Father','Mother','Guardian','Sibling','Other') NOT NULL,
  `IsPrimaryContact` tinyint(1) NOT NULL DEFAULT 0,
  `IsEmergencyContact` tinyint(1) NOT NULL DEFAULT 0,
  `IsAuthorizedPickup` tinyint(1) NOT NULL DEFAULT 0,
  `SortOrder` int(11) DEFAULT 0,
  PRIMARY KEY (`StudentGuardianID`),
  KEY `fk_StudentGuardian_StudentProfile` (`StudentProfileID`),
  KEY `fk_StudentGuardian_Guardian` (`GuardianID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: studentprofile
CREATE TABLE IF NOT EXISTS `studentprofile` (
  `StudentProfileID` int(11) NOT NULL AUTO_INCREMENT,
  `ProfileID` int(11) NOT NULL,
  `StudentNumber` varchar(50) NOT NULL,
  `QRCodeID` varchar(255) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Gender` varchar(20) DEFAULT NULL,
  `Nationality` varchar(100) DEFAULT NULL,
  `StudentStatus` enum('Enrolled','Withdrawn','Graduated','On Leave') NOT NULL DEFAULT 'Enrolled',
  `ArchiveDate` date DEFAULT NULL,
  PRIMARY KEY (`StudentProfileID`),
  UNIQUE KEY `ProfileID` (`ProfileID`),
  UNIQUE KEY `StudentNumber` (`StudentNumber`),
  UNIQUE KEY `QRCodeID` (`QRCodeID`),
  KEY `idx_studentprofile_profile` (`ProfileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: subject
CREATE TABLE IF NOT EXISTS `subject` (
  `SubjectID` int(11) NOT NULL AUTO_INCREMENT,
  `SubjectName` varchar(100) NOT NULL,
  `SubjectCode` varchar(20) NOT NULL,
  `GradeLevelID` int(11) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`SubjectID`),
  UNIQUE KEY `SubjectCode` (`SubjectCode`),
  KEY `fk_Subject_GradeLevel` (`GradeLevelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: supportticket
CREATE TABLE IF NOT EXISTS `supportticket` (
  `TicketID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `Subject` varchar(255) NOT NULL,
  `TicketStatus` enum('Open','In Progress','On Hold','Closed') NOT NULL DEFAULT 'Open',
  `TicketPriority` enum('Low','Medium','High','Urgent') NOT NULL DEFAULT 'Medium',
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `ResolvedAt` datetime DEFAULT NULL,
  `AssignedToUserID` int(11) DEFAULT NULL,
  `ResolvedByUserID` int(11) DEFAULT NULL,
  PRIMARY KEY (`TicketID`),
  KEY `fk_SupportTicket_User` (`UserID`),
  KEY `fk_SupportTicket_AssignedToUser` (`AssignedToUserID`),
  KEY `fk_SupportTicket_ResolvedByUser` (`ResolvedByUserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: teacherprofile
CREATE TABLE IF NOT EXISTS `teacherprofile` (
  `TeacherProfileID` int(11) NOT NULL AUTO_INCREMENT,
  `ProfileID` int(11) NOT NULL,
  `EmployeeNumber` varchar(50) NOT NULL,
  `Specialization` varchar(255) DEFAULT NULL,
  `HireDate` date DEFAULT NULL,
  PRIMARY KEY (`TeacherProfileID`),
  UNIQUE KEY `ProfileID` (`ProfileID`),
  UNIQUE KEY `EmployeeNumber` (`EmployeeNumber`),
  KEY `idx_teacherprofile_profile` (`ProfileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: ticketmessage
CREATE TABLE IF NOT EXISTS `ticketmessage` (
  `MessageID` int(11) NOT NULL AUTO_INCREMENT,
  `TicketID` int(11) NOT NULL,
  `SenderUserID` int(11) NOT NULL,
  `Message` text NOT NULL,
  `AttachmentFileID` int(11) DEFAULT NULL,
  `SentAt` datetime NOT NULL DEFAULT current_timestamp(),
  `IsInternal` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`MessageID`),
  KEY `fk_TicketMessage_SupportTicket` (`TicketID`),
  KEY `fk_TicketMessage_User` (`SenderUserID`),
  KEY `fk_TicketMessage_SecureFile` (`AttachmentFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: transaction
CREATE TABLE IF NOT EXISTS `transaction` (
  `TransactionID` int(11) NOT NULL AUTO_INCREMENT,
  `StudentProfileID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `IssueDate` date NOT NULL,
  `DueDate` date DEFAULT NULL,
  `TotalAmount` decimal(10,2) NOT NULL,
  `PaidAmount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `BalanceAmount` decimal(10,2) GENERATED ALWAYS AS (`TotalAmount` - `PaidAmount`) STORED,
  `TransactionStatus` enum('Paid','Unpaid','Partially Paid','Overdue') NOT NULL,
  PRIMARY KEY (`TransactionID`),
  KEY `fk_Transaction_SchoolYear` (`SchoolYearID`),
  KEY `idx_transaction_student` (`StudentProfileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: transactionitem
CREATE TABLE IF NOT EXISTS `transactionitem` (
  `ItemID` int(11) NOT NULL AUTO_INCREMENT,
  `TransactionID` int(11) NOT NULL,
  `ItemTypeID` int(11) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`ItemID`),
  KEY `fk_TransactionItem_Transaction` (`TransactionID`),
  KEY `fk_TransactionItem_ItemType` (`ItemTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: user
CREATE TABLE IF NOT EXISTS `user` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `EmailAddress` varchar(255) NOT NULL,
  `UserType` enum('Admin','Teacher','Student','Parent','Staff') NOT NULL,
  `AccountStatus` enum('Active','Inactive','Suspended','PendingVerification') NOT NULL DEFAULT 'PendingVerification',
  `LastLoginDate` datetime DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `DeletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `EmailAddress` (`EmailAddress`),
  KEY `idx_user_email` (`EmailAddress`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: userrole
CREATE TABLE IF NOT EXISTS `userrole` (
  `UserRoleID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `RoleID` int(11) NOT NULL,
  `AssignedDate` datetime NOT NULL DEFAULT current_timestamp(),
  `ExpiryDate` datetime DEFAULT NULL,
  `AssignedByUserID` int(11) DEFAULT NULL,
  PRIMARY KEY (`UserRoleID`),
  UNIQUE KEY `UserID` (`UserID`,`RoleID`),
  KEY `fk_UserRole_Role` (`RoleID`),
  KEY `fk_UserRole_AssignedByUser` (`AssignedByUserID`),
  KEY `idx_userrole_user_role` (`UserID`,`RoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: usersettings
CREATE TABLE IF NOT EXISTS `usersettings` (
  `SettingsID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `Theme` varchar(50) DEFAULT 'default',
  `AccentColor` varchar(20) DEFAULT '#007bff',
  `NotificationPreferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`NotificationPreferences`)),
  `TwoFactorEnabled` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`SettingsID`),
  UNIQUE KEY `UserID` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================================
-- Foreign Key Constraints
-- ========================================

ALTER TABLE `academicstanding`
  ADD CONSTRAINT `fk_AcademicStanding_Enrollment` FOREIGN KEY (`EnrollmentID`) REFERENCES `enrollment` (`EnrollmentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_AcademicStanding_ParticipationLevel` FOREIGN KEY (`ParticipationLevelID`) REFERENCES `participationlevel` (`ParticipationLevelID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_AcademicStanding_StandingLevel` FOREIGN KEY (`StandingLevelID`) REFERENCES `academicstandinglevel` (`StandingLevelID`) ON DELETE SET NULL;

ALTER TABLE `announcement`
  ADD CONSTRAINT `fk_Announcement_User` FOREIGN KEY (`AuthorUserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `application`
  ADD CONSTRAINT `fk_Application_GradeLevel` FOREIGN KEY (`ApplyingForGradeLevelID`) REFERENCES `gradelevel` (`GradeLevelID`),
  ADD CONSTRAINT `fk_Application_Profile` FOREIGN KEY (`ApplicantProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Application_ReviewedByUser` FOREIGN KEY (`ReviewedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Application_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`);

ALTER TABLE `applicationrequirement`
  ADD CONSTRAINT `fk_ApplicationRequirement_Application` FOREIGN KEY (`ApplicationID`) REFERENCES `application` (`ApplicationID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ApplicationRequirement_RequirementType` FOREIGN KEY (`RequirementTypeID`) REFERENCES `requirementtype` (`RequirementTypeID`),
  ADD CONSTRAINT `fk_ApplicationRequirement_SecureFile` FOREIGN KEY (`SecureFileID`) REFERENCES `securefile` (`FileID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ApplicationRequirement_VerifiedByUser` FOREIGN KEY (`VerifiedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

ALTER TABLE `applieddiscount`
  ADD CONSTRAINT `fk_AppliedDiscount_ApprovedByUser` FOREIGN KEY (`ApprovedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_AppliedDiscount_Discount` FOREIGN KEY (`DiscountID`) REFERENCES `discount` (`DiscountID`),
  ADD CONSTRAINT `fk_AppliedDiscount_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`) ON DELETE CASCADE;

ALTER TABLE `attendance`
  ADD CONSTRAINT `fk_Attendance_ClassSchedule` FOREIGN KEY (`ClassScheduleID`) REFERENCES `classschedule` (`ScheduleID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Attendance_Method` FOREIGN KEY (`AttendanceMethodID`) REFERENCES `attendancemethod` (`MethodID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Attendance_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

ALTER TABLE `auditlog`
  ADD CONSTRAINT `fk_AuditLog_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

ALTER TABLE `classschedule`
  ADD CONSTRAINT `fk_ClassSchedule_Section` FOREIGN KEY (`SectionID`) REFERENCES `section` (`SectionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ClassSchedule_Status` FOREIGN KEY (`ScheduleStatusID`) REFERENCES `schedulestatus` (`StatusID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ClassSchedule_Subject` FOREIGN KEY (`SubjectID`) REFERENCES `subject` (`SubjectID`),
  ADD CONSTRAINT `fk_ClassSchedule_TeacherProfile` FOREIGN KEY (`TeacherProfileID`) REFERENCES `teacherprofile` (`TeacherProfileID`) ON DELETE SET NULL;

ALTER TABLE `discount`
  ADD CONSTRAINT `fk_Discount_DiscountType` FOREIGN KEY (`DiscountTypeID`) REFERENCES `discounttype` (`DiscountTypeID`);

ALTER TABLE `emergencycontact`
  ADD CONSTRAINT `fk_EmergencyContact_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

ALTER TABLE `enrollment`
  ADD CONSTRAINT `fk_Enrollment_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_Enrollment_Section` FOREIGN KEY (`SectionID`) REFERENCES `section` (`SectionID`),
  ADD CONSTRAINT `fk_Enrollment_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

ALTER TABLE `grade`
  ADD CONSTRAINT `fk_Grade_Enrollment` FOREIGN KEY (`EnrollmentID`) REFERENCES `enrollment` (`EnrollmentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Grade_ModifiedByUser` FOREIGN KEY (`ModifiedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Grade_Status` FOREIGN KEY (`GradeStatusID`) REFERENCES `gradestatus` (`StatusID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Grade_Subject` FOREIGN KEY (`SubjectID`) REFERENCES `subject` (`SubjectID`);

ALTER TABLE `medicalinfo`
  ADD CONSTRAINT `fk_MedicalInfo_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

ALTER TABLE `notificationlog`
  ADD CONSTRAINT `fk_NotificationLog_NotificationType` FOREIGN KEY (`NotificationTypeID`) REFERENCES `notificationtype` (`NotificationTypeID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_NotificationLog_User` FOREIGN KEY (`RecipientUserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `passwordhistory`
  ADD CONSTRAINT `fk_PasswordHistory_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `passwordpolicy`
  ADD CONSTRAINT `fk_PasswordPolicy_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `payment`
  ADD CONSTRAINT `fk_Payment_PaymentMethod` FOREIGN KEY (`PaymentMethodID`) REFERENCES `paymentmethod` (`PaymentMethodID`),
  ADD CONSTRAINT `fk_Payment_SecureFile` FOREIGN KEY (`ProofFileID`) REFERENCES `securefile` (`FileID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Payment_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`),
  ADD CONSTRAINT `fk_Payment_VerifiedByUser` FOREIGN KEY (`VerifiedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

ALTER TABLE `profile`
  ADD CONSTRAINT `fk_Profile_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `rolepermission`
  ADD CONSTRAINT `fk_RolePermission_Permission` FOREIGN KEY (`PermissionID`) REFERENCES `permission` (`PermissionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_RolePermission_Role` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`) ON DELETE CASCADE;

ALTER TABLE `section`
  ADD CONSTRAINT `fk_Section_GradeLevel` FOREIGN KEY (`GradeLevelID`) REFERENCES `gradelevel` (`GradeLevelID`),
  ADD CONSTRAINT `fk_Section_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_Section_TeacherProfile` FOREIGN KEY (`AdviserTeacherID`) REFERENCES `teacherprofile` (`TeacherProfileID`) ON DELETE SET NULL;

ALTER TABLE `securefile`
  ADD CONSTRAINT `fk_SecureFile_User` FOREIGN KEY (`UploadedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

ALTER TABLE `studentguardian`
  ADD CONSTRAINT `fk_StudentGuardian_Guardian` FOREIGN KEY (`GuardianID`) REFERENCES `guardian` (`GuardianID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_StudentGuardian_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

ALTER TABLE `studentprofile`
  ADD CONSTRAINT `fk_StudentProfile_Profile` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

ALTER TABLE `subject`
  ADD CONSTRAINT `fk_Subject_GradeLevel` FOREIGN KEY (`GradeLevelID`) REFERENCES `gradelevel` (`GradeLevelID`);

ALTER TABLE `supportticket`
  ADD CONSTRAINT `fk_SupportTicket_AssignedToUser` FOREIGN KEY (`AssignedToUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_SupportTicket_ResolvedByUser` FOREIGN KEY (`ResolvedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_SupportTicket_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `teacherprofile`
  ADD CONSTRAINT `fk_TeacherProfile_Profile` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

ALTER TABLE `ticketmessage`
  ADD CONSTRAINT `fk_TicketMessage_SecureFile` FOREIGN KEY (`AttachmentFileID`) REFERENCES `securefile` (`FileID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_TicketMessage_SupportTicket` FOREIGN KEY (`TicketID`) REFERENCES `supportticket` (`TicketID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_TicketMessage_User` FOREIGN KEY (`SenderUserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `transaction`
  ADD CONSTRAINT `fk_Transaction_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_Transaction_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`);

ALTER TABLE `transactionitem`
  ADD CONSTRAINT `fk_TransactionItem_ItemType` FOREIGN KEY (`ItemTypeID`) REFERENCES `itemtype` (`ItemTypeID`),
  ADD CONSTRAINT `fk_TransactionItem_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`) ON DELETE CASCADE;

ALTER TABLE `userrole`
  ADD CONSTRAINT `fk_UserRole_AssignedByUser` FOREIGN KEY (`AssignedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_UserRole_Role` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_UserRole_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `usersettings`
  ADD CONSTRAINT `fk_UserSettings_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

-- ========================================
-- Initial Data Seeds
-- ========================================

-- Teacher Role and Permissions
INSERT IGNORE INTO role (RoleName, Description, IsActive)
VALUES ('Teacher', 'Teaching staff with class management and grading permissions', 1);

SET @teacherRoleID = (SELECT RoleID FROM role WHERE RoleName = 'Teacher' LIMIT 1);

-- Insert Permissions
INSERT IGNORE INTO permission (PermissionCode, ModuleName, Description) VALUES
('view_students', 'Students', 'View student information in assigned classes'),
('view_student_profiles', 'Students', 'View detailed student profiles'),
('view_grades', 'Grades', 'View student grades'),
('manage_grades', 'Grades', 'Input and edit student grades'),
('submit_grades', 'Grades', 'Submit final grades for approval'),
('view_attendance', 'Attendance', 'View attendance records'),
('manage_attendance', 'Attendance', 'Mark student attendance'),
('edit_attendance', 'Attendance', 'Edit attendance records'),
('view_schedules', 'Schedules', 'View class schedules'),
('view_own_schedule', 'Schedules', 'View personal teaching schedule'),
('view_classes', 'Classes', 'View assigned classes'),
('manage_class_content', 'Classes', 'Manage class materials and content'),
('view_announcements', 'Announcements', 'View school announcements'),
('create_announcements', 'Announcements', 'Create class announcements'),
('edit_own_announcements', 'Announcements', 'Edit own announcements'),
('delete_own_announcements', 'Announcements', 'Delete own announcements'),
('view_reports', 'Reports', 'View student reports'),
('generate_class_reports', 'Reports', 'Generate reports for assigned classes'),
('view_own_profile', 'Profile', 'View own teacher profile'),
('edit_own_profile', 'Profile', 'Edit own teacher profile');

-- Assign Permissions to Teacher Role
INSERT IGNORE INTO rolepermission (RoleID, PermissionID)
SELECT @teacherRoleID, PermissionID
FROM permission
WHERE PermissionCode IN (
    'view_students', 'view_student_profiles', 'view_grades', 'manage_grades', 
    'submit_grades', 'view_attendance', 'manage_attendance', 'edit_attendance',
    'view_schedules', 'view_own_schedule', 'view_classes', 'manage_class_content',
    'view_announcements', 'create_announcements', 'edit_own_announcements', 
    'delete_own_announcements', 'view_reports', 'generate_class_reports',
    'view_own_profile', 'edit_own_profile'
);

-- Insert Grade Statuses
INSERT IGNORE INTO gradestatus (StatusName) VALUES
('Draft'),
('Submitted'),
('Approved'),
('Final');

-- Insert Schedule Statuses
INSERT IGNORE INTO schedulestatus (StatusName) VALUES
('Active'),
('Cancelled'),
('Rescheduled'),
('Completed');

-- Insert Attendance Methods
INSERT IGNORE INTO attendancemethod (MethodName, IsActive) VALUES
('Manual Entry', 1),
('QR Code Scan', 1),
('Biometric', 0),
('RFID Card', 0);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
