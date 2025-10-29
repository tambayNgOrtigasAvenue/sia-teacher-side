-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 12, 2025 at 03:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gymnadb`
--

-- --------------------------------------------------------

--
-- Table structure for table `academicstanding`
--

CREATE TABLE `academicstanding` (
  `StandingID` int(11) NOT NULL,
  `EnrollmentID` int(11) NOT NULL,
  `GeneralAverage` decimal(5,2) DEFAULT NULL,
  `AttendanceRate` decimal(5,2) DEFAULT NULL COMMENT 'As a percentage',
  `StandingLevelID` int(11) DEFAULT NULL,
  `ParticipationLevelID` int(11) DEFAULT NULL,
  `ComputedDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `academicstandinglevel`
--

CREATE TABLE `academicstandinglevel` (
  `StandingLevelID` int(11) NOT NULL,
  `LevelName` varchar(100) NOT NULL,
  `MinAverage` decimal(5,2) DEFAULT NULL,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcement`
--

CREATE TABLE `announcement` (
  `AnnouncementID` int(11) NOT NULL,
  `AuthorUserID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Content` text NOT NULL,
  `PublishDate` datetime NOT NULL,
  `ExpiryDate` datetime DEFAULT NULL,
  `TargetAudience` enum('All Users','Students','Teachers','Parents','Staff') NOT NULL,
  `IsPinned` tinyint(1) NOT NULL DEFAULT 0,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `application`
--

CREATE TABLE `application` (
  `ApplicationID` int(11) NOT NULL,
  `ApplicantProfileID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `ApplyingForGradeLevelID` int(11) NOT NULL,
  `EnrolleeType` enum('New','Old','Transferee') NOT NULL,
  `ApplicationStatus` enum('Pending','For Review','Approved','Rejected','Waitlisted') NOT NULL DEFAULT 'Pending',
  `SubmissionDate` datetime NOT NULL DEFAULT current_timestamp(),
  `ReviewedDate` datetime DEFAULT NULL,
  `PreviousSchool` varchar(255) DEFAULT NULL,
  `ReviewedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applicationrequirement`
--

CREATE TABLE `applicationrequirement` (
  `RequirementID` int(11) NOT NULL,
  `ApplicationID` int(11) NOT NULL,
  `RequirementTypeID` int(11) NOT NULL,
  `SecureFileID` int(11) DEFAULT NULL,
  `RequirementStatus` enum('Submitted','Verified','Missing','Rejected') NOT NULL DEFAULT 'Missing',
  `SubmittedDate` datetime DEFAULT NULL,
  `VerifiedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applieddiscount`
--

CREATE TABLE `applieddiscount` (
  `AppliedDiscountID` int(11) NOT NULL,
  `TransactionID` int(11) NOT NULL,
  `DiscountID` int(11) NOT NULL,
  `DiscountAmount` decimal(10,2) NOT NULL,
  `ApprovedByUserID` int(11) DEFAULT NULL,
  `AppliedDate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `AttendanceID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `ClassScheduleID` int(11) NOT NULL,
  `AttendanceDate` date NOT NULL,
  `CheckInTime` datetime DEFAULT NULL,
  `CheckOutTime` datetime DEFAULT NULL,
  `AttendanceStatus` enum('Present','Late','Absent','Excused') NOT NULL,
  `AttendanceMethodID` int(11) DEFAULT NULL,
  `Notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendancemethod`
--

CREATE TABLE `attendancemethod` (
  `MethodID` int(11) NOT NULL,
  `MethodName` varchar(100) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auditlog`
--

CREATE TABLE `auditlog` (
  `AuditID` bigint(20) NOT NULL,
  `TableName` varchar(100) NOT NULL,
  `RecordID` int(11) DEFAULT NULL,
  `Operation` enum('INSERT','UPDATE','DELETE','LOGIN','LOGOUT') NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `OldValues` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`OldValues`)),
  `NewValues` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`NewValues`)),
  `IPAddress` varchar(45) DEFAULT NULL,
  `UserAgent` varchar(255) DEFAULT NULL,
  `Timestamp` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classschedule`
--

CREATE TABLE `classschedule` (
  `ScheduleID` int(11) NOT NULL,
  `SectionID` int(11) NOT NULL,
  `SubjectID` int(11) NOT NULL,
  `TeacherProfileID` int(11) DEFAULT NULL,
  `DayOfWeek` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `StartTime` time NOT NULL,
  `EndTime` time NOT NULL,
  `ScheduleStatusID` int(11) DEFAULT NULL,
  `RoomNumber` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discount`
--

CREATE TABLE `discount` (
  `DiscountID` int(11) NOT NULL,
  `DiscountName` varchar(100) NOT NULL,
  `DiscountTypeID` int(11) NOT NULL,
  `PercentageOrAmount` decimal(10,2) NOT NULL,
  `IsPercentage` tinyint(1) NOT NULL,
  `ValidFrom` date DEFAULT NULL,
  `ValidUntil` date DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discounttype`
--

CREATE TABLE `discounttype` (
  `DiscountTypeID` int(11) NOT NULL,
  `TypeName` varchar(100) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emergencycontact`
--

CREATE TABLE `emergencycontact` (
  `EmergencyContactID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `ContactPerson` varchar(255) NOT NULL,
  `EncryptedContactNumber` varbinary(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `EnrollmentID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `SectionID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `EnrollmentDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faq`
--

CREATE TABLE `faq` (
  `FAQID` int(11) NOT NULL,
  `Question` text NOT NULL,
  `Answer` text NOT NULL,
  `Category` varchar(100) DEFAULT NULL,
  `ViewCount` int(11) NOT NULL DEFAULT 0,
  `IsPublished` tinyint(1) NOT NULL DEFAULT 0,
  `SortOrder` int(11) DEFAULT 0,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grade`
--

CREATE TABLE `grade` (
  `GradeID` int(11) NOT NULL,
  `EnrollmentID` int(11) NOT NULL,
  `SubjectID` int(11) NOT NULL,
  `Quarter` enum('First Quarter','Second Quarter','Third Quarter','Fourth Quarter') NOT NULL,
  `GradeValue` decimal(5,2) DEFAULT NULL,
  `Remarks` text DEFAULT NULL,
  `GradeStatusID` int(11) DEFAULT NULL,
  `LastModified` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ModifiedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gradelevel`
--

CREATE TABLE `gradelevel` (
  `GradeLevelID` int(11) NOT NULL,
  `LevelName` varchar(50) NOT NULL,
  `SortOrder` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gradestatus`
--

CREATE TABLE `gradestatus` (
  `StatusID` int(11) NOT NULL,
  `StatusName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `guardian`
--

CREATE TABLE `guardian` (
  `GuardianID` int(11) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `EncryptedPhoneNumber` varbinary(255) DEFAULT NULL,
  `EncryptedEmailAddress` varbinary(255) DEFAULT NULL,
  `Occupation` varchar(100) DEFAULT NULL,
  `WorkAddress` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `itemtype`
--

CREATE TABLE `itemtype` (
  `ItemTypeID` int(11) NOT NULL,
  `TypeName` varchar(100) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medicalinfo`
--

CREATE TABLE `medicalinfo` (
  `MedicalInfoID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `Weight` decimal(5,2) DEFAULT NULL COMMENT 'In kilograms',
  `Height` decimal(5,2) DEFAULT NULL COMMENT 'In centimeters',
  `EncryptedAllergies` blob DEFAULT NULL,
  `EncryptedMedicalConditions` blob DEFAULT NULL,
  `EncryptedMedications` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notificationlog`
--

CREATE TABLE `notificationlog` (
  `LogID` int(11) NOT NULL,
  `RecipientUserID` int(11) NOT NULL,
  `NotificationTypeID` int(11) DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Message` text NOT NULL,
  `SentAt` datetime NOT NULL DEFAULT current_timestamp(),
  `IsRead` tinyint(1) NOT NULL DEFAULT 0,
  `NotificationStatus` enum('Sent','Failed','Pending','Delivered','Read') NOT NULL,
  `ErrorMessage` text DEFAULT NULL,
  `RetryCount` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notificationtype`
--

CREATE TABLE `notificationtype` (
  `NotificationTypeID` int(11) NOT NULL,
  `TypeName` varchar(100) NOT NULL,
  `TemplateContent` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `participationlevel`
--

CREATE TABLE `participationlevel` (
  `ParticipationLevelID` int(11) NOT NULL,
  `LevelName` varchar(100) NOT NULL,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `passwordhistory`
--

CREATE TABLE `passwordhistory` (
  `HistoryID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `passwordpolicy`
--

CREATE TABLE `passwordpolicy` (
  `PolicyID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `PasswordSetDate` datetime NOT NULL DEFAULT current_timestamp(),
  `ExpiryDate` datetime DEFAULT NULL,
  `MustChange` tinyint(1) NOT NULL DEFAULT 0,
  `FailedLoginAttempts` int(11) NOT NULL DEFAULT 0,
  `LockedUntil` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `PaymentID` int(11) NOT NULL,
  `TransactionID` int(11) NOT NULL,
  `PaymentMethodID` int(11) NOT NULL,
  `AmountPaid` decimal(10,2) NOT NULL,
  `PaymentDateTime` datetime NOT NULL DEFAULT current_timestamp(),
  `ReferenceNumber` varchar(255) DEFAULT NULL,
  `ProofFileID` int(11) DEFAULT NULL,
  `VerificationStatus` enum('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending',
  `VerifiedByUserID` int(11) DEFAULT NULL,
  `VerifiedAt` datetime DEFAULT NULL,
  `RejectionReason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paymentmethod`
--

CREATE TABLE `paymentmethod` (
  `PaymentMethodID` int(11) NOT NULL,
  `MethodName` varchar(100) NOT NULL,
  `MethodIcon` varchar(255) DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `PermissionID` int(11) NOT NULL,
  `PermissionCode` varchar(100) NOT NULL,
  `ModuleName` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `ProfileID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `MiddleName` varchar(100) DEFAULT NULL,
  `EncryptedPhoneNumber` varbinary(255) DEFAULT NULL,
  `EncryptedAddress` varbinary(512) DEFAULT NULL,
  `ProfilePictureURL` varchar(2048) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `requirementtype`
--

CREATE TABLE `requirementtype` (
  `RequirementTypeID` int(11) NOT NULL,
  `TypeName` varchar(255) NOT NULL,
  `IsMandatory` tinyint(1) NOT NULL DEFAULT 1,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `RoleID` int(11) NOT NULL,
  `RoleName` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rolepermission`
--

CREATE TABLE `rolepermission` (
  `RolePermissionID` int(11) NOT NULL,
  `RoleID` int(11) NOT NULL,
  `PermissionID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schedulestatus`
--

CREATE TABLE `schedulestatus` (
  `StatusID` int(11) NOT NULL,
  `StatusName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schoolyear`
--

CREATE TABLE `schoolyear` (
  `SchoolYearID` int(11) NOT NULL,
  `YearName` varchar(50) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `SectionID` int(11) NOT NULL,
  `GradeLevelID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `AdviserTeacherID` int(11) DEFAULT NULL,
  `SectionName` varchar(100) NOT NULL,
  `MaxCapacity` int(11) DEFAULT NULL,
  `CurrentEnrollment` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `securefile`
--

CREATE TABLE `securefile` (
  `FileID` int(11) NOT NULL,
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
  `ExpiryDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `studentguardian`
--

CREATE TABLE `studentguardian` (
  `StudentGuardianID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `GuardianID` int(11) NOT NULL,
  `RelationshipType` enum('Father','Mother','Guardian','Sibling','Other') NOT NULL,
  `IsPrimaryContact` tinyint(1) NOT NULL DEFAULT 0,
  `IsEmergencyContact` tinyint(1) NOT NULL DEFAULT 0,
  `IsAuthorizedPickup` tinyint(1) NOT NULL DEFAULT 0,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `studentprofile`
--

CREATE TABLE `studentprofile` (
  `StudentProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `StudentNumber` varchar(50) NOT NULL,
  `QRCodeID` varchar(255) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Gender` varchar(20) DEFAULT NULL,
  `Nationality` varchar(100) DEFAULT NULL,
  `StudentStatus` enum('Enrolled','Withdrawn','Graduated','On Leave') NOT NULL DEFAULT 'Enrolled',
  `ArchiveDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `SubjectID` int(11) NOT NULL,
  `SubjectName` varchar(100) NOT NULL,
  `SubjectCode` varchar(20) NOT NULL,
  `GradeLevelID` int(11) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supportticket`
--

CREATE TABLE `supportticket` (
  `TicketID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Subject` varchar(255) NOT NULL,
  `TicketStatus` enum('Open','In Progress','On Hold','Closed') NOT NULL DEFAULT 'Open',
  `TicketPriority` enum('Low','Medium','High','Urgent') NOT NULL DEFAULT 'Medium',
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `ResolvedAt` datetime DEFAULT NULL,
  `AssignedToUserID` int(11) DEFAULT NULL,
  `ResolvedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacherprofile`
--

CREATE TABLE `teacherprofile` (
  `TeacherProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `EmployeeNumber` varchar(50) NOT NULL,
  `Specialization` varchar(255) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticketmessage`
--

CREATE TABLE `ticketmessage` (
  `MessageID` int(11) NOT NULL,
  `TicketID` int(11) NOT NULL,
  `SenderUserID` int(11) NOT NULL,
  `Message` text NOT NULL,
  `AttachmentFileID` int(11) DEFAULT NULL,
  `SentAt` datetime NOT NULL DEFAULT current_timestamp(),
  `IsInternal` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `TransactionID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `IssueDate` date NOT NULL,
  `DueDate` date DEFAULT NULL,
  `TotalAmount` decimal(10,2) NOT NULL,
  `PaidAmount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `BalanceAmount` decimal(10,2) GENERATED ALWAYS AS (`TotalAmount` - `PaidAmount`) STORED,
  `TransactionStatus` enum('Paid','Unpaid','Partially Paid','Overdue') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactionitem`
--

CREATE TABLE `transactionitem` (
  `ItemID` int(11) NOT NULL,
  `TransactionID` int(11) NOT NULL,
  `ItemTypeID` int(11) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UserID` int(11) NOT NULL,
  `EmailAddress` varchar(255) NOT NULL,
  `UserType` enum('Admin','Teacher','Student','Parent','Staff') NOT NULL,
  `AccountStatus` enum('Active','Inactive','Suspended','PendingVerification') NOT NULL DEFAULT 'PendingVerification',
  `LastLoginDate` datetime DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `DeletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userrole`
--

CREATE TABLE `userrole` (
  `UserRoleID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `RoleID` int(11) NOT NULL,
  `AssignedDate` datetime NOT NULL DEFAULT current_timestamp(),
  `ExpiryDate` datetime DEFAULT NULL,
  `AssignedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usersettings`
--

CREATE TABLE `usersettings` (
  `SettingsID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Theme` varchar(50) DEFAULT 'default',
  `AccentColor` varchar(20) DEFAULT '#007bff',
  `NotificationPreferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`NotificationPreferences`)),
  `TwoFactorEnabled` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academicstanding`
--
ALTER TABLE `academicstanding`
  ADD PRIMARY KEY (`StandingID`),
  ADD UNIQUE KEY `EnrollmentID` (`EnrollmentID`),
  ADD KEY `fk_AcademicStanding_StandingLevel` (`StandingLevelID`),
  ADD KEY `fk_AcademicStanding_ParticipationLevel` (`ParticipationLevelID`);

--
-- Indexes for table `academicstandinglevel`
--
ALTER TABLE `academicstandinglevel`
  ADD PRIMARY KEY (`StandingLevelID`),
  ADD UNIQUE KEY `LevelName` (`LevelName`);

--
-- Indexes for table `announcement`
--
ALTER TABLE `announcement`
  ADD PRIMARY KEY (`AnnouncementID`),
  ADD KEY `fk_Announcement_User` (`AuthorUserID`);

--
-- Indexes for table `application`
--
ALTER TABLE `application`
  ADD PRIMARY KEY (`ApplicationID`),
  ADD KEY `fk_Application_SchoolYear` (`SchoolYearID`),
  ADD KEY `fk_Application_GradeLevel` (`ApplyingForGradeLevelID`),
  ADD KEY `fk_Application_ReviewedByUser` (`ReviewedByUserID`),
  ADD KEY `idx_application_applicant` (`ApplicantProfileID`);

--
-- Indexes for table `applicationrequirement`
--
ALTER TABLE `applicationrequirement`
  ADD PRIMARY KEY (`RequirementID`),
  ADD KEY `fk_ApplicationRequirement_Application` (`ApplicationID`),
  ADD KEY `fk_ApplicationRequirement_RequirementType` (`RequirementTypeID`),
  ADD KEY `fk_ApplicationRequirement_SecureFile` (`SecureFileID`),
  ADD KEY `fk_ApplicationRequirement_VerifiedByUser` (`VerifiedByUserID`);

--
-- Indexes for table `applieddiscount`
--
ALTER TABLE `applieddiscount`
  ADD PRIMARY KEY (`AppliedDiscountID`),
  ADD KEY `fk_AppliedDiscount_Transaction` (`TransactionID`),
  ADD KEY `fk_AppliedDiscount_Discount` (`DiscountID`),
  ADD KEY `fk_AppliedDiscount_ApprovedByUser` (`ApprovedByUserID`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`AttendanceID`),
  ADD UNIQUE KEY `StudentProfileID` (`StudentProfileID`,`ClassScheduleID`,`AttendanceDate`),
  ADD KEY `fk_Attendance_ClassSchedule` (`ClassScheduleID`),
  ADD KEY `fk_Attendance_Method` (`AttendanceMethodID`),
  ADD KEY `idx_attendance_student_schedule` (`StudentProfileID`,`ClassScheduleID`);

--
-- Indexes for table `attendancemethod`
--
ALTER TABLE `attendancemethod`
  ADD PRIMARY KEY (`MethodID`),
  ADD UNIQUE KEY `MethodName` (`MethodName`);

--
-- Indexes for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD PRIMARY KEY (`AuditID`),
  ADD KEY `idx_auditlog_table_record` (`TableName`,`RecordID`),
  ADD KEY `idx_auditlog_user` (`UserID`);

--
-- Indexes for table `classschedule`
--
ALTER TABLE `classschedule`
  ADD PRIMARY KEY (`ScheduleID`),
  ADD KEY `fk_ClassSchedule_Section` (`SectionID`),
  ADD KEY `fk_ClassSchedule_Subject` (`SubjectID`),
  ADD KEY `fk_ClassSchedule_TeacherProfile` (`TeacherProfileID`),
  ADD KEY `fk_ClassSchedule_Status` (`ScheduleStatusID`);

--
-- Indexes for table `discount`
--
ALTER TABLE `discount`
  ADD PRIMARY KEY (`DiscountID`),
  ADD KEY `fk_Discount_DiscountType` (`DiscountTypeID`);

--
-- Indexes for table `discounttype`
--
ALTER TABLE `discounttype`
  ADD PRIMARY KEY (`DiscountTypeID`),
  ADD UNIQUE KEY `TypeName` (`TypeName`);

--
-- Indexes for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  ADD PRIMARY KEY (`EmergencyContactID`),
  ADD KEY `fk_EmergencyContact_StudentProfile` (`StudentProfileID`);

--
-- Indexes for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`EnrollmentID`),
  ADD UNIQUE KEY `StudentProfileID` (`StudentProfileID`,`SchoolYearID`),
  ADD KEY `fk_Enrollment_Section` (`SectionID`),
  ADD KEY `fk_Enrollment_SchoolYear` (`SchoolYearID`),
  ADD KEY `idx_enrollment_student` (`StudentProfileID`);

--
-- Indexes for table `faq`
--
ALTER TABLE `faq`
  ADD PRIMARY KEY (`FAQID`);

--
-- Indexes for table `grade`
--
ALTER TABLE `grade`
  ADD PRIMARY KEY (`GradeID`),
  ADD UNIQUE KEY `EnrollmentID` (`EnrollmentID`,`SubjectID`,`Quarter`),
  ADD KEY `fk_Grade_Subject` (`SubjectID`),
  ADD KEY `fk_Grade_Status` (`GradeStatusID`),
  ADD KEY `fk_Grade_ModifiedByUser` (`ModifiedByUserID`),
  ADD KEY `idx_grade_enrollment_subject` (`EnrollmentID`,`SubjectID`);

--
-- Indexes for table `gradelevel`
--
ALTER TABLE `gradelevel`
  ADD PRIMARY KEY (`GradeLevelID`),
  ADD UNIQUE KEY `LevelName` (`LevelName`);

--
-- Indexes for table `gradestatus`
--
ALTER TABLE `gradestatus`
  ADD PRIMARY KEY (`StatusID`),
  ADD UNIQUE KEY `StatusName` (`StatusName`);

--
-- Indexes for table `guardian`
--
ALTER TABLE `guardian`
  ADD PRIMARY KEY (`GuardianID`);

--
-- Indexes for table `itemtype`
--
ALTER TABLE `itemtype`
  ADD PRIMARY KEY (`ItemTypeID`),
  ADD UNIQUE KEY `TypeName` (`TypeName`);

--
-- Indexes for table `medicalinfo`
--
ALTER TABLE `medicalinfo`
  ADD PRIMARY KEY (`MedicalInfoID`),
  ADD UNIQUE KEY `StudentProfileID` (`StudentProfileID`);

--
-- Indexes for table `notificationlog`
--
ALTER TABLE `notificationlog`
  ADD PRIMARY KEY (`LogID`),
  ADD KEY `fk_NotificationLog_User` (`RecipientUserID`),
  ADD KEY `fk_NotificationLog_NotificationType` (`NotificationTypeID`);

--
-- Indexes for table `notificationtype`
--
ALTER TABLE `notificationtype`
  ADD PRIMARY KEY (`NotificationTypeID`),
  ADD UNIQUE KEY `TypeName` (`TypeName`);

--
-- Indexes for table `participationlevel`
--
ALTER TABLE `participationlevel`
  ADD PRIMARY KEY (`ParticipationLevelID`),
  ADD UNIQUE KEY `LevelName` (`LevelName`);

--
-- Indexes for table `passwordhistory`
--
ALTER TABLE `passwordhistory`
  ADD PRIMARY KEY (`HistoryID`),
  ADD KEY `fk_PasswordHistory_User` (`UserID`);

--
-- Indexes for table `passwordpolicy`
--
ALTER TABLE `passwordpolicy`
  ADD PRIMARY KEY (`PolicyID`),
  ADD UNIQUE KEY `UserID` (`UserID`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`PaymentID`),
  ADD UNIQUE KEY `ReferenceNumber` (`ReferenceNumber`),
  ADD KEY `fk_Payment_PaymentMethod` (`PaymentMethodID`),
  ADD KEY `fk_Payment_SecureFile` (`ProofFileID`),
  ADD KEY `fk_Payment_VerifiedByUser` (`VerifiedByUserID`),
  ADD KEY `idx_payment_transaction` (`TransactionID`);

--
-- Indexes for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  ADD PRIMARY KEY (`PaymentMethodID`),
  ADD UNIQUE KEY `MethodName` (`MethodName`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`PermissionID`),
  ADD UNIQUE KEY `PermissionCode` (`PermissionCode`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`ProfileID`),
  ADD UNIQUE KEY `UserID` (`UserID`),
  ADD KEY `idx_profile_user` (`UserID`);

--
-- Indexes for table `requirementtype`
--
ALTER TABLE `requirementtype`
  ADD PRIMARY KEY (`RequirementTypeID`),
  ADD UNIQUE KEY `TypeName` (`TypeName`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`RoleID`),
  ADD UNIQUE KEY `RoleName` (`RoleName`);

--
-- Indexes for table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD PRIMARY KEY (`RolePermissionID`),
  ADD UNIQUE KEY `RoleID` (`RoleID`,`PermissionID`),
  ADD KEY `fk_RolePermission_Permission` (`PermissionID`);

--
-- Indexes for table `schedulestatus`
--
ALTER TABLE `schedulestatus`
  ADD PRIMARY KEY (`StatusID`),
  ADD UNIQUE KEY `StatusName` (`StatusName`);

--
-- Indexes for table `schoolyear`
--
ALTER TABLE `schoolyear`
  ADD PRIMARY KEY (`SchoolYearID`),
  ADD UNIQUE KEY `YearName` (`YearName`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`SectionID`),
  ADD KEY `fk_Section_GradeLevel` (`GradeLevelID`),
  ADD KEY `fk_Section_SchoolYear` (`SchoolYearID`),
  ADD KEY `fk_Section_TeacherProfile` (`AdviserTeacherID`);

--
-- Indexes for table `securefile`
--
ALTER TABLE `securefile`
  ADD PRIMARY KEY (`FileID`),
  ADD UNIQUE KEY `StoredFileName` (`StoredFileName`),
  ADD UNIQUE KEY `FileHash` (`FileHash`),
  ADD KEY `fk_SecureFile_User` (`UploadedByUserID`);

--
-- Indexes for table `studentguardian`
--
ALTER TABLE `studentguardian`
  ADD PRIMARY KEY (`StudentGuardianID`),
  ADD KEY `fk_StudentGuardian_StudentProfile` (`StudentProfileID`),
  ADD KEY `fk_StudentGuardian_Guardian` (`GuardianID`);

--
-- Indexes for table `studentprofile`
--
ALTER TABLE `studentprofile`
  ADD PRIMARY KEY (`StudentProfileID`),
  ADD UNIQUE KEY `ProfileID` (`ProfileID`),
  ADD UNIQUE KEY `StudentNumber` (`StudentNumber`),
  ADD UNIQUE KEY `QRCodeID` (`QRCodeID`),
  ADD KEY `idx_studentprofile_profile` (`ProfileID`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`SubjectID`),
  ADD UNIQUE KEY `SubjectCode` (`SubjectCode`),
  ADD KEY `fk_Subject_GradeLevel` (`GradeLevelID`);

--
-- Indexes for table `supportticket`
--
ALTER TABLE `supportticket`
  ADD PRIMARY KEY (`TicketID`),
  ADD KEY `fk_SupportTicket_User` (`UserID`),
  ADD KEY `fk_SupportTicket_AssignedToUser` (`AssignedToUserID`),
  ADD KEY `fk_SupportTicket_ResolvedByUser` (`ResolvedByUserID`);

--
-- Indexes for table `teacherprofile`
--
ALTER TABLE `teacherprofile`
  ADD PRIMARY KEY (`TeacherProfileID`),
  ADD UNIQUE KEY `ProfileID` (`ProfileID`),
  ADD UNIQUE KEY `EmployeeNumber` (`EmployeeNumber`),
  ADD KEY `idx_teacherprofile_profile` (`ProfileID`);

--
-- Indexes for table `ticketmessage`
--
ALTER TABLE `ticketmessage`
  ADD PRIMARY KEY (`MessageID`),
  ADD KEY `fk_TicketMessage_SupportTicket` (`TicketID`),
  ADD KEY `fk_TicketMessage_User` (`SenderUserID`),
  ADD KEY `fk_TicketMessage_SecureFile` (`AttachmentFileID`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`TransactionID`),
  ADD KEY `fk_Transaction_SchoolYear` (`SchoolYearID`),
  ADD KEY `idx_transaction_student` (`StudentProfileID`);

--
-- Indexes for table `transactionitem`
--
ALTER TABLE `transactionitem`
  ADD PRIMARY KEY (`ItemID`),
  ADD KEY `fk_TransactionItem_Transaction` (`TransactionID`),
  ADD KEY `fk_TransactionItem_ItemType` (`ItemTypeID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `EmailAddress` (`EmailAddress`),
  ADD KEY `idx_user_email` (`EmailAddress`);

--
-- Indexes for table `userrole`
--
ALTER TABLE `userrole`
  ADD PRIMARY KEY (`UserRoleID`),
  ADD UNIQUE KEY `UserID` (`UserID`,`RoleID`),
  ADD KEY `fk_UserRole_Role` (`RoleID`),
  ADD KEY `fk_UserRole_AssignedByUser` (`AssignedByUserID`),
  ADD KEY `idx_userrole_user_role` (`UserID`,`RoleID`);

--
-- Indexes for table `usersettings`
--
ALTER TABLE `usersettings`
  ADD PRIMARY KEY (`SettingsID`),
  ADD UNIQUE KEY `UserID` (`UserID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academicstanding`
--
ALTER TABLE `academicstanding`
  MODIFY `StandingID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `academicstandinglevel`
--
ALTER TABLE `academicstandinglevel`
  MODIFY `StandingLevelID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `announcement`
--
ALTER TABLE `announcement`
  MODIFY `AnnouncementID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `application`
--
ALTER TABLE `application`
  MODIFY `ApplicationID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `applicationrequirement`
--
ALTER TABLE `applicationrequirement`
  MODIFY `RequirementID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `applieddiscount`
--
ALTER TABLE `applieddiscount`
  MODIFY `AppliedDiscountID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `AttendanceID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendancemethod`
--
ALTER TABLE `attendancemethod`
  MODIFY `MethodID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auditlog`
--
ALTER TABLE `auditlog`
  MODIFY `AuditID` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `classschedule`
--
ALTER TABLE `classschedule`
  MODIFY `ScheduleID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `discount`
--
ALTER TABLE `discount`
  MODIFY `DiscountID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `discounttype`
--
ALTER TABLE `discounttype`
  MODIFY `DiscountTypeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  MODIFY `EmergencyContactID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faq`
--
ALTER TABLE `faq`
  MODIFY `FAQID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grade`
--
ALTER TABLE `grade`
  MODIFY `GradeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gradelevel`
--
ALTER TABLE `gradelevel`
  MODIFY `GradeLevelID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gradestatus`
--
ALTER TABLE `gradestatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `guardian`
--
ALTER TABLE `guardian`
  MODIFY `GuardianID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `itemtype`
--
ALTER TABLE `itemtype`
  MODIFY `ItemTypeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medicalinfo`
--
ALTER TABLE `medicalinfo`
  MODIFY `MedicalInfoID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notificationlog`
--
ALTER TABLE `notificationlog`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notificationtype`
--
ALTER TABLE `notificationtype`
  MODIFY `NotificationTypeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `participationlevel`
--
ALTER TABLE `participationlevel`
  MODIFY `ParticipationLevelID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `passwordhistory`
--
ALTER TABLE `passwordhistory`
  MODIFY `HistoryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `passwordpolicy`
--
ALTER TABLE `passwordpolicy`
  MODIFY `PolicyID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  MODIFY `PaymentMethodID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `PermissionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `ProfileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `requirementtype`
--
ALTER TABLE `requirementtype`
  MODIFY `RequirementTypeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `RoleID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rolepermission`
--
ALTER TABLE `rolepermission`
  MODIFY `RolePermissionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schedulestatus`
--
ALTER TABLE `schedulestatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schoolyear`
--
ALTER TABLE `schoolyear`
  MODIFY `SchoolYearID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `SectionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `securefile`
--
ALTER TABLE `securefile`
  MODIFY `FileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `studentguardian`
--
ALTER TABLE `studentguardian`
  MODIFY `StudentGuardianID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `studentprofile`
--
ALTER TABLE `studentprofile`
  MODIFY `StudentProfileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `SubjectID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supportticket`
--
ALTER TABLE `supportticket`
  MODIFY `TicketID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacherprofile`
--
ALTER TABLE `teacherprofile`
  MODIFY `TeacherProfileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ticketmessage`
--
ALTER TABLE `ticketmessage`
  MODIFY `MessageID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactionitem`
--
ALTER TABLE `transactionitem`
  MODIFY `ItemID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userrole`
--
ALTER TABLE `userrole`
  MODIFY `UserRoleID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usersettings`
--
ALTER TABLE `usersettings`
  MODIFY `SettingsID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `academicstanding`
--
ALTER TABLE `academicstanding`
  ADD CONSTRAINT `fk_AcademicStanding_Enrollment` FOREIGN KEY (`EnrollmentID`) REFERENCES `enrollment` (`EnrollmentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_AcademicStanding_ParticipationLevel` FOREIGN KEY (`ParticipationLevelID`) REFERENCES `participationlevel` (`ParticipationLevelID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_AcademicStanding_StandingLevel` FOREIGN KEY (`StandingLevelID`) REFERENCES `academicstandinglevel` (`StandingLevelID`) ON DELETE SET NULL;

--
-- Constraints for table `announcement`
--
ALTER TABLE `announcement`
  ADD CONSTRAINT `fk_Announcement_User` FOREIGN KEY (`AuthorUserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `application`
--
ALTER TABLE `application`
  ADD CONSTRAINT `fk_Application_GradeLevel` FOREIGN KEY (`ApplyingForGradeLevelID`) REFERENCES `gradelevel` (`GradeLevelID`),
  ADD CONSTRAINT `fk_Application_Profile` FOREIGN KEY (`ApplicantProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Application_ReviewedByUser` FOREIGN KEY (`ReviewedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Application_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`);

--
-- Constraints for table `applicationrequirement`
--
ALTER TABLE `applicationrequirement`
  ADD CONSTRAINT `fk_ApplicationRequirement_Application` FOREIGN KEY (`ApplicationID`) REFERENCES `application` (`ApplicationID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ApplicationRequirement_RequirementType` FOREIGN KEY (`RequirementTypeID`) REFERENCES `requirementtype` (`RequirementTypeID`),
  ADD CONSTRAINT `fk_ApplicationRequirement_SecureFile` FOREIGN KEY (`SecureFileID`) REFERENCES `securefile` (`FileID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ApplicationRequirement_VerifiedByUser` FOREIGN KEY (`VerifiedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

--
-- Constraints for table `applieddiscount`
--
ALTER TABLE `applieddiscount`
  ADD CONSTRAINT `fk_AppliedDiscount_ApprovedByUser` FOREIGN KEY (`ApprovedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_AppliedDiscount_Discount` FOREIGN KEY (`DiscountID`) REFERENCES `discount` (`DiscountID`),
  ADD CONSTRAINT `fk_AppliedDiscount_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`) ON DELETE CASCADE;

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `fk_Attendance_ClassSchedule` FOREIGN KEY (`ClassScheduleID`) REFERENCES `classschedule` (`ScheduleID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Attendance_Method` FOREIGN KEY (`AttendanceMethodID`) REFERENCES `attendancemethod` (`MethodID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Attendance_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD CONSTRAINT `fk_AuditLog_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

--
-- Constraints for table `classschedule`
--
ALTER TABLE `classschedule`
  ADD CONSTRAINT `fk_ClassSchedule_Section` FOREIGN KEY (`SectionID`) REFERENCES `section` (`SectionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ClassSchedule_Status` FOREIGN KEY (`ScheduleStatusID`) REFERENCES `schedulestatus` (`StatusID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ClassSchedule_Subject` FOREIGN KEY (`SubjectID`) REFERENCES `subject` (`SubjectID`),
  ADD CONSTRAINT `fk_ClassSchedule_TeacherProfile` FOREIGN KEY (`TeacherProfileID`) REFERENCES `teacherprofile` (`TeacherProfileID`) ON DELETE SET NULL;

--
-- Constraints for table `discount`
--
ALTER TABLE `discount`
  ADD CONSTRAINT `fk_Discount_DiscountType` FOREIGN KEY (`DiscountTypeID`) REFERENCES `discounttype` (`DiscountTypeID`);

--
-- Constraints for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  ADD CONSTRAINT `fk_EmergencyContact_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `fk_Enrollment_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_Enrollment_Section` FOREIGN KEY (`SectionID`) REFERENCES `section` (`SectionID`),
  ADD CONSTRAINT `fk_Enrollment_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `grade`
--
ALTER TABLE `grade`
  ADD CONSTRAINT `fk_Grade_Enrollment` FOREIGN KEY (`EnrollmentID`) REFERENCES `enrollment` (`EnrollmentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Grade_ModifiedByUser` FOREIGN KEY (`ModifiedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Grade_Status` FOREIGN KEY (`GradeStatusID`) REFERENCES `gradestatus` (`StatusID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Grade_Subject` FOREIGN KEY (`SubjectID`) REFERENCES `subject` (`SubjectID`);

--
-- Constraints for table `medicalinfo`
--
ALTER TABLE `medicalinfo`
  ADD CONSTRAINT `fk_MedicalInfo_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `notificationlog`
--
ALTER TABLE `notificationlog`
  ADD CONSTRAINT `fk_NotificationLog_NotificationType` FOREIGN KEY (`NotificationTypeID`) REFERENCES `notificationtype` (`NotificationTypeID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_NotificationLog_User` FOREIGN KEY (`RecipientUserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `passwordhistory`
--
ALTER TABLE `passwordhistory`
  ADD CONSTRAINT `fk_PasswordHistory_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `passwordpolicy`
--
ALTER TABLE `passwordpolicy`
  ADD CONSTRAINT `fk_PasswordPolicy_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `fk_Payment_PaymentMethod` FOREIGN KEY (`PaymentMethodID`) REFERENCES `paymentmethod` (`PaymentMethodID`),
  ADD CONSTRAINT `fk_Payment_SecureFile` FOREIGN KEY (`ProofFileID`) REFERENCES `securefile` (`FileID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Payment_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`),
  ADD CONSTRAINT `fk_Payment_VerifiedByUser` FOREIGN KEY (`VerifiedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

--
-- Constraints for table `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `fk_Profile_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD CONSTRAINT `fk_RolePermission_Permission` FOREIGN KEY (`PermissionID`) REFERENCES `permission` (`PermissionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_RolePermission_Role` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`) ON DELETE CASCADE;

--
-- Constraints for table `section`
--
ALTER TABLE `section`
  ADD CONSTRAINT `fk_Section_GradeLevel` FOREIGN KEY (`GradeLevelID`) REFERENCES `gradelevel` (`GradeLevelID`),
  ADD CONSTRAINT `fk_Section_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_Section_TeacherProfile` FOREIGN KEY (`AdviserTeacherID`) REFERENCES `teacherprofile` (`TeacherProfileID`) ON DELETE SET NULL;

--
-- Constraints for table `securefile`
--
ALTER TABLE `securefile`
  ADD CONSTRAINT `fk_SecureFile_User` FOREIGN KEY (`UploadedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

--
-- Constraints for table `studentguardian`
--
ALTER TABLE `studentguardian`
  ADD CONSTRAINT `fk_StudentGuardian_Guardian` FOREIGN KEY (`GuardianID`) REFERENCES `guardian` (`GuardianID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_StudentGuardian_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `studentprofile`
--
ALTER TABLE `studentprofile`
  ADD CONSTRAINT `fk_StudentProfile_Profile` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `subject`
--
ALTER TABLE `subject`
  ADD CONSTRAINT `fk_Subject_GradeLevel` FOREIGN KEY (`GradeLevelID`) REFERENCES `gradelevel` (`GradeLevelID`);

--
-- Constraints for table `supportticket`
--
ALTER TABLE `supportticket`
  ADD CONSTRAINT `fk_SupportTicket_AssignedToUser` FOREIGN KEY (`AssignedToUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_SupportTicket_ResolvedByUser` FOREIGN KEY (`ResolvedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_SupportTicket_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `teacherprofile`
--
ALTER TABLE `teacherprofile`
  ADD CONSTRAINT `fk_TeacherProfile_Profile` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `ticketmessage`
--
ALTER TABLE `ticketmessage`
  ADD CONSTRAINT `fk_TicketMessage_SecureFile` FOREIGN KEY (`AttachmentFileID`) REFERENCES `securefile` (`FileID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_TicketMessage_SupportTicket` FOREIGN KEY (`TicketID`) REFERENCES `supportticket` (`TicketID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_TicketMessage_User` FOREIGN KEY (`SenderUserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `fk_Transaction_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_Transaction_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`);

--
-- Constraints for table `transactionitem`
--
ALTER TABLE `transactionitem`
  ADD CONSTRAINT `fk_TransactionItem_ItemType` FOREIGN KEY (`ItemTypeID`) REFERENCES `itemtype` (`ItemTypeID`),
  ADD CONSTRAINT `fk_TransactionItem_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`) ON DELETE CASCADE;

--
-- Constraints for table `userrole`
--
ALTER TABLE `userrole`
  ADD CONSTRAINT `fk_UserRole_AssignedByUser` FOREIGN KEY (`AssignedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_UserRole_Role` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_UserRole_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `usersettings`
--
ALTER TABLE `usersettings`
  ADD CONSTRAINT `fk_UserSettings_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;