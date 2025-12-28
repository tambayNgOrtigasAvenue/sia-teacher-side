-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2025 at 01:26 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `latest_database_nov28`
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
-- Table structure for table `adminprofile`
--

CREATE TABLE `adminprofile` (
  `AdminProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `EmployeeNumber` varchar(50) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `adminprofile`
--

INSERT INTO `adminprofile` (`AdminProfileID`, `ProfileID`, `EmployeeNumber`, `HireDate`) VALUES
(1, 3, 'A-00001', '2025-11-27'),
(2, 12, 'A-00002', '2025-11-29');

-- --------------------------------------------------------

--
-- Table structure for table `announcement`
--

CREATE TABLE `announcement` (
  `AnnouncementID` int(11) NOT NULL,
  `AuthorUserID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Content` text NOT NULL,
  `Summary` text DEFAULT NULL,
  `Category` enum('Academic','Events','General') NOT NULL DEFAULT 'General',
  `BannerURL` varchar(255) DEFAULT NULL,
  `PublishDate` datetime NOT NULL,
  `ExpiryDate` datetime DEFAULT NULL,
  `TargetAudience` enum('All Users','Students','Teachers','Parents','Staff') NOT NULL,
  `IsPinned` tinyint(1) NOT NULL DEFAULT 0,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcement`
--

INSERT INTO `announcement` (`AnnouncementID`, `AuthorUserID`, `Title`, `Content`, `Summary`, `Category`, `BannerURL`, `PublishDate`, `ExpiryDate`, `TargetAudience`, `IsPinned`, `IsActive`) VALUES
(1, 12, 'gumana kajojlkjkljkljkl', 'sdfsdfsfsdf', NULL, 'Events', 'http://127.0.0.1:8000/storage/announcements/4OuJOy5pdscyc4CIOV8dBgSo2nvKgnWZ2YcNB5VC.png', '2025-10-25 00:00:00', '2025-11-25 00:00:00', 'All Users', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `application`
--

CREATE TABLE `application` (
  `ApplicationID` int(11) NOT NULL,
  `ApplicantProfileID` int(11) DEFAULT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `ApplyingForGradeLevelID` int(11) NOT NULL,
  `EnrolleeType` enum('New','Old','Transferee') NOT NULL,
  `ApplicationStatus` enum('Pending','For Review','Approved','Rejected','Waitlisted','Enrolled') NOT NULL DEFAULT 'Pending',
  `PaymentMode` enum('full','quarterly','monthly') DEFAULT NULL,
  `TransactionID` int(11) DEFAULT NULL,
  `RegistrarNotes` text DEFAULT NULL,
  `SubmissionDate` datetime NOT NULL DEFAULT current_timestamp(),
  `ReviewedDate` datetime DEFAULT NULL,
  `PreviousSchool` varchar(255) DEFAULT NULL,
  `StudentFirstName` varchar(100) DEFAULT NULL,
  `StudentLastName` varchar(100) DEFAULT NULL,
  `StudentMiddleName` varchar(100) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Gender` enum('Male','Female') DEFAULT NULL,
  `Address` varchar(512) DEFAULT NULL,
  `ContactNumber` varchar(20) DEFAULT NULL,
  `EmailAddress` varchar(255) DEFAULT NULL,
  `GuardianFirstName` varchar(100) DEFAULT NULL,
  `GuardianLastName` varchar(100) DEFAULT NULL,
  `GuardianRelationship` varchar(50) DEFAULT NULL,
  `GuardianContact` varchar(20) DEFAULT NULL,
  `GuardianEmail` varchar(255) DEFAULT NULL,
  `TrackingNumber` varchar(50) DEFAULT NULL,
  `PrivacyAgreement` tinyint(1) DEFAULT 0,
  `ReviewedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `application`
--

INSERT INTO `application` (`ApplicationID`, `ApplicantProfileID`, `SchoolYearID`, `ApplyingForGradeLevelID`, `EnrolleeType`, `ApplicationStatus`, `PaymentMode`, `TransactionID`, `RegistrarNotes`, `SubmissionDate`, `ReviewedDate`, `PreviousSchool`, `StudentFirstName`, `StudentLastName`, `StudentMiddleName`, `DateOfBirth`, `Gender`, `Address`, `ContactNumber`, `EmailAddress`, `GuardianFirstName`, `GuardianLastName`, `GuardianRelationship`, `GuardianContact`, `GuardianEmail`, `TrackingNumber`, `PrivacyAgreement`, `ReviewedByUserID`) VALUES
(1, NULL, 7, 7, 'New', 'Enrolled', NULL, NULL, NULL, '2025-11-28 04:11:56', NULL, '', 'Aaaa', 'AA', 'AA', '2020-11-11', 'Male', '21 ahahahaha', '09123456789', 'haha@gmail.com', 'Hahaha', 'hahaha', 'father', '09123456789', 'hahahaha@gmail.com', 'GCA-2025-15774', 1, NULL),
(2, NULL, 7, 3, 'New', 'Enrolled', 'full', 2, '', '2025-11-28 06:32:49', '2025-11-28 06:48:26', '', 'JOAA', 'GAA', 'REY', '2020-12-20', 'Male', 'AAAAADASDADASDA', '09123456789', 'SADASDASD@GMAIL.COM', 'DDA', 'AA', 'ADSADSA', '09123456789', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-88188', 1, NULL),
(3, NULL, 7, 6, 'New', 'Enrolled', 'monthly', 3, '', '2025-11-28 06:58:04', '2025-11-28 06:58:43', '', 'aaaaga', 'hahaha', 'haha', '2020-11-11', 'Male', '2121212 hahahaha', '09123456789', 'hahaha@gmail.com', 'hahaha', 'hahahaha', 'father', '09123456789', 'j@gmail.com', 'GCA-2025-56645', 1, NULL),
(4, NULL, 7, 3, 'New', 'Enrolled', 'monthly', 4, '', '2025-11-28 07:05:49', '2025-11-28 07:06:30', '', 'Sana', 'Ka', 'Gumana', '2020-11-11', 'Male', 'AAaaaaaadsadsadada', '09123456789', 'sas@gmail.com', 'ASDasdas', 'dasd', 'father', '09123456678', 'johnre@gmail.com', 'GCA-2025-75766', 1, NULL),
(5, NULL, 7, 4, 'Old', 'Enrolled', 'quarterly', 6, '', '2025-11-28 07:11:41', '2025-11-28 08:49:23', '', 'HAHAHA', 'HAHAHA', 'HAHAHAHA', '2020-12-12', 'Male', 'hahahahahahaha', '09123456789', 'hahahaha@gmail.com', 'GHAHAHAHA', 'HAHAHAHA', 'father', '09123456789', 'ghahaha@gmail.com', 'GCA-2025-43302', 1, NULL),
(6, NULL, 7, 8, 'Old', 'Enrolled', 'quarterly', 5, '', '2025-11-28 07:26:58', '2025-11-28 07:27:24', '', 'Haha', 'ahahaha', 'haha', '2020-11-11', 'Male', 'HAhahaADASDADA', '0912345789', 'haha@gmail.com', 'hahahahaha', 'hahahaha', 'FATHER', '09123567890', 'FGSDF@GMAIL.COM', 'GCA-2025-08791', 1, NULL);

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

--
-- Dumping data for table `attendancemethod`
--

INSERT INTO `attendancemethod` (`MethodID`, `MethodName`, `IsActive`) VALUES
(1, 'Manual', 1),
(2, 'QR Code Scan', 1),
(3, 'RFID Card', 1),
(4, 'Biometric', 1);

-- --------------------------------------------------------

--
-- Table structure for table `attendancesummary`
--

CREATE TABLE `attendancesummary` (
  `AttendanceSummaryID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `TotalDaysPresent` int(11) NOT NULL DEFAULT 0,
  `TotalSchoolDays` int(11) NOT NULL DEFAULT 0,
  `AttendancePercentage` decimal(5,2) GENERATED ALWAYS AS (case when `TotalSchoolDays` > 0 then round(`TotalDaysPresent` / `TotalSchoolDays` * 100,2) else 0 end) STORED,
  `LastUpdated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendancesummary`
--

INSERT INTO `attendancesummary` (`AttendanceSummaryID`, `StudentProfileID`, `SchoolYearID`, `TotalDaysPresent`, `TotalSchoolDays`, `LastUpdated`) VALUES
(1, 1, 7, 0, 0, '2025-11-28 04:22:41'),
(2, 2, 7, 0, 0, '2025-11-28 06:48:51'),
(3, 3, 7, 0, 0, '2025-11-28 06:59:24'),
(4, 4, 7, 0, 0, '2025-11-28 07:06:41'),
(5, 5, 7, 0, 0, '2025-11-28 07:27:36'),
(6, 6, 7, 0, 0, '2025-11-28 08:49:31');

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

--
-- Dumping data for table `auditlog`
--

INSERT INTO `auditlog` (`AuditID`, `TableName`, `RecordID`, `Operation`, `UserID`, `OldValues`, `NewValues`, `IPAddress`, `UserAgent`, `Timestamp`) VALUES
(1, 'guardprofile', 1, 'INSERT', 3, NULL, '{\"GuardProfileID\":1,\"EmployeeNumber\":\"G-00001\",\"HireDate\":\"2025-11-28\",\"Profile\":{\"ProfileID\":8,\"FirstName\":\"Denmarc\",\"LastName\":\"Maglipon\",\"MiddleName\":\"Amar\",\"PhoneNumber\":\"09507047933\",\"Address\":\"15 Masaya St., Banguian, Abulug, Cagayan, Region II (Cagayan Valley)\",\"ProfilePictureURL\":\"http:\\/\\/127.0.0.1:8000\\/storage\\/profiles\\/YAJA8zcvEQl7vxDPXDigR15xcZGfqawM0I7wwiQs.png\"},\"User\":{\"UserID\":8,\"EmailAddress\":\"maglipon.denmarc.amar@gmail.com\",\"UserType\":\"Guard\",\"AccountStatus\":\"Active\",\"LastLoginDate\":null,\"IsArchived\":false}}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-28 08:49:13'),
(2, 'registrarprofile', 2, 'INSERT', 3, NULL, '{\"RegistrarProfileID\":2,\"EmployeeNumber\":\"R-00002\",\"HireDate\":\"2025-11-28\",\"Profile\":{\"ProfileID\":9,\"FirstName\":\"Den\",\"LastName\":\"Maglipon\",\"MiddleName\":\"Amar\",\"PhoneNumber\":\"09507047933\",\"Address\":\"3 Maligaya St., San Antonio, Basco , Batanes, Region II (Cagayan Valley)\",\"ProfilePictureURL\":\"http:\\/\\/127.0.0.1:8000\\/storage\\/profiles\\/2lYfVbc7fTQ6t1HCramLzRiXnSobfcvsXQgwXnu5.png\"},\"User\":{\"UserID\":9,\"EmailAddress\":\"amar.denmarc@gmail.com\",\"UserType\":\"Registrar\",\"AccountStatus\":\"Active\",\"LastLoginDate\":null,\"IsArchived\":false}}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-28 08:54:28'),
(3, 'guardprofile', 2, 'INSERT', 1, NULL, '{\"GuardProfileID\":2,\"EmployeeNumber\":\"G-00002\",\"HireDate\":\"2025-11-29\",\"Profile\":{\"ProfileID\":10,\"FirstName\":\"denmarc\",\"LastName\":\"maglipon\",\"MiddleName\":\"amar\",\"PhoneNumber\":\"09507047933\",\"Address\":\"ghghgh, Adams, Adams, Ilocos Norte, Region I (Ilocos Region)\",\"ProfilePictureURL\":\"http:\\/\\/127.0.0.1:8000\\/storage\\/profiles\\/ys0Dg8yOnn9fJCSDvg1QOZFvyIkUoKAh1nvii17t.jpg\"},\"User\":{\"UserID\":10,\"EmailAddress\":\"gagalang.joshua.s@gmail.com\",\"UserType\":\"Guard\",\"AccountStatus\":\"Active\",\"LastLoginDate\":null,\"IsArchived\":false}}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-29 05:04:39'),
(4, 'teacherprofile', 1, 'INSERT', 1, NULL, '{\"TeacherProfileID\":1,\"EmployeeNumber\":\"T-00001\",\"Specialization\":\"Mathematics\",\"HireDate\":\"2025-05-10\",\"Profile\":{\"ProfileID\":11,\"FirstName\":\"Juan\",\"LastName\":\"Kiki\",\"MiddleName\":\"Santos\",\"PhoneNumber\":\"099765679757\",\"Address\":\"456 Barangay San Isidro, Quezon City, Metro Manila\",\"ProfilePictureURL\":\"http:\\/\\/127.0.0.1:8000\\/storage\\/profiles\\/PZx7prIdbeCMX4OD3MIXQaR5MSYS4K45Rx97X32G.jpg\"},\"User\":{\"UserID\":11,\"EmailAddress\":\"uniqujje@gmail.com\",\"UserType\":\"HeadTeacher\",\"AccountStatus\":\"Active\",\"LastLoginDate\":null,\"IsArchived\":false}}', '127.0.0.1', 'PostmanRuntime/7.49.1', '2025-11-29 06:05:06'),
(5, 'adminprofile', 2, 'INSERT', 12, NULL, '{\"AdminProfileID\":2,\"EmployeeNumber\":\"A-00002\",\"HireDate\":\"2025-11-29\",\"Profile\":{\"ProfileID\":12,\"FirstName\":\"denmarc\",\"LastName\":\"maglipon\",\"MiddleName\":\"amar\",\"PhoneNumber\":\"09507047933\",\"Address\":\"mnbjbjhghj, Adams, Adams, Ilocos Norte, Region I (Ilocos Region)\",\"ProfilePictureURL\":\"http:\\/\\/127.0.0.1:8000\\/storage\\/profiles\\/R2uXS8mxKflvilm4OKuCLFnwRIv8O1Kxx0SRtK1c.jpg\"},\"User\":{\"UserID\":12,\"EmailAddress\":\"amar.denmarc@gmail.com\",\"UserType\":\"Admin\",\"AccountStatus\":\"Active\",\"LastLoginDate\":null,\"IsArchived\":false}}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-29 07:40:43'),
(6, 'announcement', 1, 'INSERT', 12, NULL, '{\"Title\":\"gumana kajojlkjkljkljkl\",\"Content\":\"sdfsdfsfsdf\",\"Summary\":null,\"Category\":\"Events\",\"PublishDate\":\"2025-10-25\",\"ExpiryDate\":\"2025-11-25\",\"TargetAudience\":\"All Users\",\"IsPinned\":\"1\",\"IsActive\":\"1\",\"BannerURL\":\"http:\\/\\/127.0.0.1:8000\\/storage\\/announcements\\/4OuJOy5pdscyc4CIOV8dBgSo2nvKgnWZ2YcNB5VC.png\",\"AuthorUserID\":12,\"AnnouncementID\":1}', '127.0.0.1', 'PostmanRuntime/7.49.1', '2025-11-29 08:51:12');

-- --------------------------------------------------------

--
-- Table structure for table `authorized_escort`
--

CREATE TABLE `authorized_escort` (
  `EscortID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `RelationshipToStudent` varchar(100) NOT NULL,
  `ContactNumber` varchar(20) NOT NULL,
  `Address` varchar(512) DEFAULT NULL,
  `AdditionalNotes` text DEFAULT NULL,
  `EscortStatus` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `DateAdded` datetime NOT NULL DEFAULT current_timestamp(),
  `ApprovedByUserID` int(11) DEFAULT NULL
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
-- Table structure for table `document_request`
--

CREATE TABLE `document_request` (
  `RequestID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `DocumentType` enum('form137','grades','goodMoral','enrollment','completion','honorable') NOT NULL,
  `Purpose` varchar(255) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1,
  `DeliveryMethod` enum('pickup','mail') NOT NULL DEFAULT 'pickup',
  `AdditionalNotes` text DEFAULT NULL,
  `RequestStatus` enum('Pending','Processing','Ready','Completed','Rejected') NOT NULL DEFAULT 'Pending',
  `DateRequested` datetime NOT NULL DEFAULT current_timestamp(),
  `DateCompleted` datetime DEFAULT NULL,
  `ProcessedByUserID` int(11) DEFAULT NULL
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

--
-- Dumping data for table `emergencycontact`
--

INSERT INTO `emergencycontact` (`EmergencyContactID`, `StudentProfileID`, `ContactPerson`, `EncryptedContactNumber`) VALUES
(1, 1, 'Hahaha hahaha', 0x3039313233343536373839),
(2, 2, 'DDA AA', 0x3039313233343536373839),
(3, 3, 'hahaha hahahaha', 0x3039313233343536373839),
(4, 4, 'ASDasdas dasd', 0x3039313233343536363738),
(5, 5, 'hahahahaha hahahaha', 0x3039313233353637383930),
(6, 6, 'GHAHAHAHA HAHAHAHA', 0x3039313233343536373839);

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `EnrollmentID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `SectionID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `EnrollmentDate` date NOT NULL,
  `OutstandingBalance` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`EnrollmentID`, `StudentProfileID`, `SectionID`, `SchoolYearID`, `EnrollmentDate`, `OutstandingBalance`) VALUES
(1, 1, 14, 7, '2025-11-28', 0.00),
(2, 2, 6, 7, '2025-11-28', 0.00),
(3, 3, 12, 7, '2025-11-28', 0.00),
(4, 4, 6, 7, '2025-11-28', 0.00),
(5, 5, 16, 7, '2025-11-28', 0.00),
(6, 6, 8, 7, '2025-11-28', 0.00);

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

--
-- Dumping data for table `grade`
--

INSERT INTO `grade` (`GradeID`, `EnrollmentID`, `SubjectID`, `Quarter`, `GradeValue`, `Remarks`, `GradeStatusID`, `LastModified`, `ModifiedByUserID`) VALUES
(1, 1, 37, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(2, 1, 37, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(3, 1, 37, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(4, 1, 37, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(5, 1, 38, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(6, 1, 38, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(7, 1, 38, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(8, 1, 38, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(9, 1, 39, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(10, 1, 39, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(11, 1, 39, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(12, 1, 39, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(13, 1, 40, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(14, 1, 40, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(15, 1, 40, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(16, 1, 40, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(17, 1, 41, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(18, 1, 41, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(19, 1, 41, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(20, 1, 41, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(21, 1, 42, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(22, 1, 42, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(23, 1, 42, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(24, 1, 42, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(25, 1, 43, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(26, 1, 43, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(27, 1, 43, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(28, 1, 43, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(29, 1, 44, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(30, 1, 44, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(31, 1, 44, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(32, 1, 44, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(33, 1, 45, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(34, 1, 45, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(35, 1, 45, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(36, 1, 45, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(37, 2, 1, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(38, 2, 1, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(39, 2, 1, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(40, 2, 1, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(41, 2, 2, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(42, 2, 2, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(43, 2, 2, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(44, 2, 2, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(45, 2, 3, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(46, 2, 3, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(47, 2, 3, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(48, 2, 3, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(49, 2, 4, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(50, 2, 4, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(51, 2, 4, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(52, 2, 4, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(53, 2, 5, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(54, 2, 5, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(55, 2, 5, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(56, 2, 5, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(57, 2, 6, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(58, 2, 6, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(59, 2, 6, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(60, 2, 6, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(61, 2, 7, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(62, 2, 7, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(63, 2, 7, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(64, 2, 7, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(65, 2, 8, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(66, 2, 8, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(67, 2, 8, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(68, 2, 8, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(69, 2, 9, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(70, 2, 9, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(71, 2, 9, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(72, 2, 9, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(73, 3, 28, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(74, 3, 28, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(75, 3, 28, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(76, 3, 28, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(77, 3, 29, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(78, 3, 29, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(79, 3, 29, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(80, 3, 29, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(81, 3, 30, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(82, 3, 30, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(83, 3, 30, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(84, 3, 30, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(85, 3, 31, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(86, 3, 31, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(87, 3, 31, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(88, 3, 31, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(89, 3, 32, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(90, 3, 32, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(91, 3, 32, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(92, 3, 32, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(93, 3, 33, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(94, 3, 33, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(95, 3, 33, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(96, 3, 33, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(97, 3, 34, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(98, 3, 34, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(99, 3, 34, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(100, 3, 34, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(101, 3, 35, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(102, 3, 35, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(103, 3, 35, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(104, 3, 35, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(105, 3, 36, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(106, 3, 36, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(107, 3, 36, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(108, 3, 36, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(109, 4, 1, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(110, 4, 1, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(111, 4, 1, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(112, 4, 1, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(113, 4, 2, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(114, 4, 2, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(115, 4, 2, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(116, 4, 2, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(117, 4, 3, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(118, 4, 3, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(119, 4, 3, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(120, 4, 3, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(121, 4, 4, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(122, 4, 4, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(123, 4, 4, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(124, 4, 4, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(125, 4, 5, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(126, 4, 5, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(127, 4, 5, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(128, 4, 5, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(129, 4, 6, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(130, 4, 6, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(131, 4, 6, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(132, 4, 6, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(133, 4, 7, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(134, 4, 7, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(135, 4, 7, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(136, 4, 7, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(137, 4, 8, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(138, 4, 8, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(139, 4, 8, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(140, 4, 8, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(141, 4, 9, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(142, 4, 9, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(143, 4, 9, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(144, 4, 9, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(145, 5, 46, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(146, 5, 46, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(147, 5, 46, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(148, 5, 46, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(149, 5, 47, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(150, 5, 47, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(151, 5, 47, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(152, 5, 47, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(153, 5, 48, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(154, 5, 48, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(155, 5, 48, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(156, 5, 48, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(157, 5, 49, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(158, 5, 49, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(159, 5, 49, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(160, 5, 49, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(161, 5, 50, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(162, 5, 50, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(163, 5, 50, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(164, 5, 50, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(165, 5, 51, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(166, 5, 51, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(167, 5, 51, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(168, 5, 51, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(169, 5, 52, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(170, 5, 52, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(171, 5, 52, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(172, 5, 52, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(173, 5, 53, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(174, 5, 53, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(175, 5, 53, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(176, 5, 53, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(177, 5, 54, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(178, 5, 54, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(179, 5, 54, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(180, 5, 54, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(181, 5, 55, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(182, 5, 55, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(183, 5, 55, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(184, 5, 55, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(185, 5, 56, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(186, 5, 56, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(187, 5, 56, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(188, 5, 56, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(189, 5, 57, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(190, 5, 57, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(191, 5, 57, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(192, 5, 57, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(193, 5, 58, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(194, 5, 58, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(195, 5, 58, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(196, 5, 58, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(197, 5, 59, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(198, 5, 59, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(199, 5, 59, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(200, 5, 59, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(201, 5, 60, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(202, 5, 60, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(203, 5, 60, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(204, 5, 60, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(205, 6, 10, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(206, 6, 10, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(207, 6, 10, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(208, 6, 10, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(209, 6, 11, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(210, 6, 11, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(211, 6, 11, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(212, 6, 11, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(213, 6, 12, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(214, 6, 12, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(215, 6, 12, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(216, 6, 12, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(217, 6, 13, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(218, 6, 13, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(219, 6, 13, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(220, 6, 13, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(221, 6, 14, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(222, 6, 14, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(223, 6, 14, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(224, 6, 14, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(225, 6, 15, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(226, 6, 15, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(227, 6, 15, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(228, 6, 15, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(229, 6, 16, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(230, 6, 16, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(231, 6, 16, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(232, 6, 16, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(233, 6, 17, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(234, 6, 17, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(235, 6, 17, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(236, 6, 17, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(237, 6, 18, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(238, 6, 18, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(239, 6, 18, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(240, 6, 18, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `gradelevel`
--

CREATE TABLE `gradelevel` (
  `GradeLevelID` int(11) NOT NULL,
  `LevelName` varchar(50) NOT NULL,
  `SortOrder` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gradelevel`
--

INSERT INTO `gradelevel` (`GradeLevelID`, `LevelName`, `SortOrder`) VALUES
(1, 'Pre-Elem', 1),
(2, 'Kinder', 2),
(3, 'Grade 1', 3),
(4, 'Grade 2', 4),
(5, 'Grade 3', 5),
(6, 'Grade 4', 6),
(7, 'Grade 5', 7),
(8, 'Grade 6', 8);

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
-- Table structure for table `gradesubmissiondeadline`
--

CREATE TABLE `gradesubmissiondeadline` (
  `DeadlineID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `Quarter` enum('First Quarter','Second Quarter','Third Quarter','Fourth Quarter') NOT NULL,
  `StartDate` datetime NOT NULL,
  `DeadlineDate` datetime NOT NULL,
  `CreatedByUserID` int(11) DEFAULT NULL
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

--
-- Dumping data for table `guardian`
--

INSERT INTO `guardian` (`GuardianID`, `FullName`, `EncryptedPhoneNumber`, `EncryptedEmailAddress`, `Occupation`, `WorkAddress`) VALUES
(1, 'Hahaha hahaha', 0x3039313233343536373839, 0x686168616861686140676d61696c2e636f6d, NULL, NULL),
(2, 'DDA AA', 0x3039313233343536373839, 0x6a6f686e7265796269736e617263616c6970657340676d61696c2e636f6d, NULL, NULL),
(3, 'hahaha hahahaha', 0x3039313233343536373839, 0x6a40676d61696c2e636f6d, NULL, NULL),
(4, 'ASDasdas dasd', 0x3039313233343536363738, 0x6a6f686e726540676d61696c2e636f6d, NULL, NULL),
(5, 'hahahahaha hahahaha', 0x3039313233353637383930, 0x464753444640474d41494c2e434f4d, NULL, NULL),
(6, 'GHAHAHAHA HAHAHAHA', 0x3039313233343536373839, 0x6768616861686140676d61696c2e636f6d, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `guardprofile`
--

CREATE TABLE `guardprofile` (
  `GuardProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `EmployeeNumber` varchar(50) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guardprofile`
--

INSERT INTO `guardprofile` (`GuardProfileID`, `ProfileID`, `EmployeeNumber`, `HireDate`) VALUES
(1, 8, 'G-00001', '2025-11-28'),
(2, 10, 'G-00002', '2025-11-29');

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

--
-- Dumping data for table `itemtype`
--

INSERT INTO `itemtype` (`ItemTypeID`, `TypeName`, `IsActive`, `SortOrder`) VALUES
(1, 'Tuition Fee', 1, 1),
(2, 'Miscellaneous Fee', 1, 2),
(3, 'Books and Materials', 1, 3),
(4, 'Computer Lab Fee', 1, 4),
(5, 'Development Fee', 1, 5);

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

--
-- Dumping data for table `medicalinfo`
--

INSERT INTO `medicalinfo` (`MedicalInfoID`, `StudentProfileID`, `Weight`, `Height`, `EncryptedAllergies`, `EncryptedMedicalConditions`, `EncryptedMedications`) VALUES
(1, 1, NULL, NULL, NULL, NULL, NULL),
(2, 2, NULL, NULL, NULL, NULL, NULL),
(3, 3, NULL, NULL, NULL, NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL, NULL),
(6, 6, NULL, NULL, NULL, NULL, NULL);

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

--
-- Dumping data for table `notificationtype`
--

INSERT INTO `notificationtype` (`NotificationTypeID`, `TypeName`, `TemplateContent`) VALUES
(1, 'Grade Release', 'Grades for {{quarter}} released'),
(2, 'Payment Reminder', 'Payment due {{due_date}}'),
(3, 'Attendance Alert', '{{student_name}} marked {{status}}');

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
-- Table structure for table `participationrating`
--

CREATE TABLE `participationrating` (
  `ParticipationRatingID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `Rating` int(11) NOT NULL CHECK (`Rating` >= 1 and `Rating` <= 5),
  `Remark` varchar(100) DEFAULT NULL,
  `EvaluatedByUserID` int(11) DEFAULT NULL,
  `EvaluationDate` datetime NOT NULL DEFAULT current_timestamp(),
  `LastUpdated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
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

--
-- Dumping data for table `passwordpolicy`
--

INSERT INTO `passwordpolicy` (`PolicyID`, `UserID`, `PasswordHash`, `PasswordSetDate`, `ExpiryDate`, `MustChange`, `FailedLoginAttempts`, `LockedUntil`) VALUES
(1, 1, '$2y$10$VrnrUrqRa.sY9/JpB/Wlu.k1ZhL3QjYPJo2Teblche6/uq70KXIIC', '2025-11-28 04:20:13', NULL, 0, 0, NULL),
(2, 2, '$2y$10$QU0kRSZdfDL1k/1K/CrMdelhcRJAFH21knzI4Ahb2vVZi7vpvOIoy', '2025-11-28 04:22:41', NULL, 1, 0, NULL),
(3, 3, '$2y$10$QU0kRSZdfDL1k/1K/CrMdelhcRJAFH21knzI4Ahb2vVZi7vpvOIoy', '2025-11-28 06:48:51', NULL, 1, 0, NULL),
(4, 4, '$2y$10$SYHLmjvpCMITs2ofs46PeOddmqhXGXgm.Q.Wxlzc.wZUvqPW8I3k.', '2025-11-28 06:59:24', NULL, 1, 0, NULL),
(5, 5, '$2y$10$WHpwhKLwEYZ9bIrYS6meAumTbZOL3GDA4AoPqhn6Xl3sz/m7r12SW', '2025-11-28 07:06:41', NULL, 1, 0, NULL),
(6, 6, '$2y$10$QU0kRSZdfDL1k/1K/CrMdelhcRJAFH21knzI4Ahb2vVZi7vpvOIoy', '2025-11-28 07:27:35', NULL, 1, 0, NULL),
(7, 7, '$2y$10$QU0kRSZdfDL1k/1K/CrMdelhcRJAFH21knzI4Ahb2vVZi7vpvOIoy', '2025-11-28 08:49:31', NULL, 1, 0, NULL),
(8, 8, '$2y$12$jWqyqpuWU1mqZmHhb5MyneD7scGHS6cHt5toerPlCwuZi.f/sCt9C', '2025-11-28 08:49:13', NULL, 0, 0, NULL),
(9, 9, '$2y$12$9WhhnAsUUP.1Zg1XLflL3OoaLUdUyCXJ6y6tOBn.aJXY.hBjsq26m', '2025-11-28 08:54:28', NULL, 0, 0, NULL),
(10, 10, '$2y$12$AlwtKImpTje3uO7CT/c26ux7P.5kfxB76wL7mP2EjYk/dwKFdV4Lq', '2025-11-29 05:04:39', NULL, 0, 0, NULL),
(11, 11, '$2y$12$MKc4csXLyQkoo57F2WU9vObLaiGhondPtz.JW0vnT/TAJNDSB5ayO', '2025-11-29 06:05:06', NULL, 0, 0, NULL),
(12, 12, '$2y$12$Ys0h7fomU/U9kfUXy3ywwuFA5Esp5zYmE4aaHVIcIXV7E4/S9vPqq', '2025-11-29 07:40:43', NULL, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `TokenID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Token` varchar(255) NOT NULL,
  `ExpiresAt` datetime NOT NULL,
  `IsUsed` tinyint(1) NOT NULL DEFAULT 0,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp()
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
  `RejectionReason` text DEFAULT NULL,
  `VerifiedBy` int(11) DEFAULT NULL,
  `VerificationRemarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`PaymentID`, `TransactionID`, `PaymentMethodID`, `AmountPaid`, `PaymentDateTime`, `ReferenceNumber`, `ProofFileID`, `VerificationStatus`, `VerifiedByUserID`, `VerifiedAt`, `RejectionReason`, `VerifiedBy`, `VerificationRemarks`) VALUES
(1, 1, 3, 6000.00, '2025-11-28 05:20:14', 'TXN1764278411304153', NULL, 'Verified', 1, '2025-11-28 09:57:40', '', NULL, NULL),
(2, 2, 1, 18500.00, '2025-11-28 06:48:26', 'DOWNPAY-2-1764283706', NULL, 'Verified', NULL, '2025-11-28 09:48:06', NULL, NULL, NULL),
(3, 3, 1, 8300.00, '2025-11-28 06:58:43', 'DOWNPAY-3-1764284323', NULL, 'Verified', 1, '2025-11-28 06:58:43', NULL, NULL, NULL),
(4, 3, 3, 11700.00, '2025-11-28 07:03:51', 'TXN1764284625372268', NULL, 'Verified', 1, '2025-11-28 09:55:32', '', NULL, NULL),
(5, 4, 1, 7700.00, '2025-11-28 07:06:30', 'DOWNPAY-4-1764284790', NULL, 'Verified', 1, '2025-11-28 07:06:30', NULL, NULL, NULL),
(6, 5, 1, 9600.00, '2025-11-28 07:27:24', 'DOWNPAY-6-1764286044', NULL, 'Verified', 1, '2025-11-28 07:27:24', NULL, NULL, NULL),
(7, 5, 3, 10400.00, '2025-11-28 07:29:15', 'TXN1764286144632499', NULL, 'Verified', 1, '2025-11-28 09:36:14', '', NULL, NULL),
(8, 6, 1, 8900.00, '2025-11-28 08:49:23', 'DOWNPAY-5-1764290963', NULL, 'Verified', 1, '2025-11-28 08:49:23', NULL, NULL, NULL),
(9, 6, 3, 9600.00, '2025-11-28 08:51:08', 'TXN1764291065951286', NULL, 'Verified', 1, '2025-11-28 09:30:25', '', NULL, NULL);

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

--
-- Dumping data for table `paymentmethod`
--

INSERT INTO `paymentmethod` (`PaymentMethodID`, `MethodName`, `MethodIcon`, `IsActive`, `SortOrder`) VALUES
(1, 'Cash', NULL, 1, 1),
(2, 'Bank Transfer', NULL, 1, 2),
(3, 'GCash', NULL, 1, 3),
(4, 'PayMaya', NULL, 1, 4),
(5, 'Check', NULL, 1, 5);

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
  `Gender` enum('Male','Female') DEFAULT NULL,
  `BirthDate` date DEFAULT NULL,
  `Age` int(11) DEFAULT NULL,
  `Religion` varchar(255) DEFAULT NULL,
  `MotherTounge` varchar(255) DEFAULT NULL,
  `EncryptedPhoneNumber` varbinary(255) DEFAULT NULL,
  `EncryptedAddress` varbinary(512) DEFAULT NULL,
  `ProfilePictureURL` varchar(2048) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`ProfileID`, `UserID`, `FirstName`, `LastName`, `MiddleName`, `Gender`, `BirthDate`, `Age`, `Religion`, `MotherTounge`, `EncryptedPhoneNumber`, `EncryptedAddress`, `ProfilePictureURL`) VALUES
(1, 1, 'Registrar', 'Ako', 'Si', 'Male', '2025-11-02', 19, '11', '11', 0x11, 0x11, '11'),
(2, 2, 'Aaaa', 'AA', 'AA', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x323120616861686168616861, NULL),
(3, 3, 'JOAA', 'GAA', 'REY', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x414141414144415344414441534441, NULL),
(4, 4, 'aaaaga', 'hahaha', 'haha', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x32313231323132206861686168616861, NULL),
(5, 5, 'Sana', 'Ka', 'Gumana', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x414161616161616164736164736164616461, NULL),
(6, 6, 'Haha', 'ahahaha', 'haha', NULL, NULL, NULL, NULL, NULL, 0x30393132333435373839, 0x4841686168614144415344414441, NULL),
(7, 7, 'HAHAHA', 'HAHAHA', 'HAHAHAHA', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x6861686168616861686168616861, NULL),
(8, 8, 'Denmarc', 'Maglipon', 'Amar', NULL, NULL, NULL, NULL, NULL, 0x65794a7064694936496e5a7356476849535768505769394764553479656d6b34635670786331453950534973496e5a686248566c496a6f694d445a53646a5a334f574a35637a42774d315251576b78785a31497a5a7a3039496977696257466a496a6f695a4455335a4749785a4467794d6a63344e544d304e4459304d4759324e5455784f44466b4d446b354d6a686d5a6a5135593251774d4449784e7a4535596a426a5a575a6c4f546b314d7a597a4d5463794d5463784d434973496e52685a79493649694a39, 0x65794a7064694936496a42326454563256315670656d7779536e465363455976576b5a525358633950534973496e5a686248566c496a6f69516e6842646b46494e44524a5a446868554455724e456c684d55705153304a57536c6844634651794d7939505957464a5a33425462544a7062304e42556b64775654463262323147546b683459337071624574686469733355334243565642594d314e6a626c68584e6b347a4f5642784d446430626e6430656c5258536c5a444e6a5a746348424b4d58493359306b39496977696257466a496a6f694d6a4e6c597a68694d4445304d7a63794d5459335a6a67314e54597a4d5749354d544d794d7a45784e546c6a4d6a526c5a545a694d5745304d544e695a44597a4e546c6c4e6a4d785a445935596a64694d474a6c4e434973496e52685a79493649694a39, 'http://127.0.0.1:8000/storage/profiles/YAJA8zcvEQl7vxDPXDigR15xcZGfqawM0I7wwiQs.png'),
(9, 9, 'Den', 'Maglipon', 'Amar', NULL, NULL, NULL, NULL, NULL, 0x65794a7064694936496b4a366254526d52553531656a524c556d39694d6d3830543074495346453950534973496e5a686248566c496a6f6965584633536b46714e31564455564e55563351764e55744d53464e445a7a3039496977696257466a496a6f694d6d566a4e57597a4d5451784e7a637a4e7a4d344d7a4935593251785a575a6a4d54597a4d6a4a684e6d4d334f574e6b4e7a41315a6d45325a5468694d544e6a4e3256694f4751304f5755334e5449774f446c6d5a694973496e52685a79493649694a39, 0x65794a7064694936496c5a6b596e567857444a335958564e51334e5051586c7a546c424d4b33633950534973496e5a686248566c496a6f69644551775532646a5755466d5558673251575a3263457057544651725a4746725154644a634770764f465272536d5132636d4a47556b67784c30744b616e646865444a534f556b3356585236655456444d545a50517a5a5156474e5756555a58656d39516133646b4f476b7a544735685a6e4e4b626a6c72526d4a4e4f564a4562574e61515568795a445a7252446739496977696257466a496a6f695a474d77597a6b784f57517759574a6d4d446c6c4d7a457a4d7a426c593249784d6d4d334e4451794d5463324d7a45314d445535597a45345a6d4931596a526c4d7a67305a44497a4f54557a595451325a6a55314e434973496e52685a79493649694a39, 'http://127.0.0.1:8000/storage/profiles/2lYfVbc7fTQ6t1HCramLzRiXnSobfcvsXQgwXnu5.png'),
(10, 10, 'denmarc', 'maglipon', 'amar', NULL, NULL, NULL, NULL, NULL, 0x65794a7064694936496a46475a486868596b6c4b634574774d6a424e64573555613239714b33633950534973496e5a686248566c496a6f69616c647853586c534e58703656544247546d6c595a566c55516d77725a7a3039496977696257466a496a6f69596d51315a6d4d785a445178596a51304e325a6d4d325933596a5a6c4d6a55794f5455784e6a6b794d6d4d774d474e695a4463315a4463305a47557a5a57526d5a444e6a4e6a59334f5749304e544d33595751324e434973496e52685a79493649694a39, 0x65794a7064694936496b6475526c525665485659623031536231683061444a5565565a735656453950534973496e5a686248566c496a6f694d574675517a526c4b797442566d4a4d656a5a3153545533565646755633637a62537434536a497661304674646a464f516e524855334a7062335675633149324c326c6b6156465562573433576a5a5957446458626b4a4e63444e554e565a6c4d457848516e4e324e585a56646b74476347633950534973496d316859794936496d566b4f54557a4e4449345a4445794e4441314e4759314e5463335a5452685a5445354f575a6a4d6a646c4e6a646a4d6d466b4e444a684f4749304d6d557a5a6a42684e446b335a6a4e6b595451344e4745314d324d694c434a30595763694f69496966513d3d, 'http://127.0.0.1:8000/storage/profiles/ys0Dg8yOnn9fJCSDvg1QOZFvyIkUoKAh1nvii17t.jpg'),
(11, 11, 'Juan', 'Kiki', 'Santos', NULL, NULL, NULL, NULL, NULL, 0x65794a7064694936496e6879626d4a594d4851334f45313352454a4664326471655852366455453950534973496e5a686248566c496a6f69656c4a6959316c546146426f5746566c52465a78536b68356153394a55543039496977696257466a496a6f694d6a4a684d7a41794e57526d4e6d4d33596a6b33596d566b5a54417a4d7a426c4d7a46694e5442694f44526a4e474a6c4f4442684f5755774d546b7a4d446c694e6d457a59574a694d6a68694d574e6d5a474d314d534973496e52685a79493649694a39, 0x65794a7064694936496d7868656e647753585a6d4d6d52745530394b656e55304f5642715a45453950534973496e5a686248566c496a6f69546e557a6257397953454a35556e5242545856595a7a51344d564a6b65485a424e6b524265574a6164317052533268715547703461444e735a564230596c6f795a45744d4e5664776354424453466c595a306c5a616c46714e3038345a6c646b5957526b53464e4e5a576c6b5a5641306546453950534973496d316859794936496a68684e6a4d355a6a5577596a64694e6d49794d7a4135595441785a6d52684d324533596d59334d44566b4e6d5a6b4e7a63794e4459354e6d45354d57466c596a59784f475a6a4f5441314d325a6959545179596a4d694c434a30595763694f69496966513d3d, 'http://127.0.0.1:8000/storage/profiles/PZx7prIdbeCMX4OD3MIXQaR5MSYS4K45Rx97X32G.jpg'),
(12, 12, 'denmarc', 'maglipon', 'amar', NULL, NULL, NULL, NULL, NULL, 0x65794a7064694936496a6c6e5a456435544842536132646c4e5778785a43394f4c305236516d633950534973496e5a686248566c496a6f695769383457464d764f4556355253746e625855354f48517a55464a6d647a3039496977696257466a496a6f694d7a51304f444a684d446b314d4459354f44466c4e7a5269595455315a4455784d6a41344d6a4e695a6a5535595449774e5751314f4749324e5456684e6d597a4d6d49334e574d324e4451354e7a51334e7a63324d434973496e52685a79493649694a39, 0x65794a7064694936496a4634636e4978635551725a6d355056553968556e4a78536d566d5957633950534973496e5a686248566c496a6f69536b5a335432565365445a32536d64764e574578554745334d6e4a344b326b35546c4e57556d6c6e566c68774e5646305a32463159336870536c6c59616b70484e484e7054474a365745786d654670596555637751315a6c61454a45613352335a30565a576d317761306b7261454a7859306b334d48706f576b5133596e5a59535778704e4568565647524c616a5139496977696257466a496a6f695954557a4f5452685a6a5534597a59334f5752685a6d59784d7a637a5a44646a4d4441314e324e6a4d444668596d45774d7a63784f445a6d5a6d526d4e54426d4f5751304d3249354f5467774d7a4d784d5455324d434973496e52685a79493649694a39, 'http://127.0.0.1:8000/storage/profiles/R2uXS8mxKflvilm4OKuCLFnwRIv8O1Kxx0SRtK1c.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `registrarprofile`
--

CREATE TABLE `registrarprofile` (
  `RegistrarProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `EmployeeNumber` varchar(50) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registrarprofile`
--

INSERT INTO `registrarprofile` (`RegistrarProfileID`, `ProfileID`, `EmployeeNumber`, `HireDate`) VALUES
(1, 1, '1', NULL),
(2, 9, 'R-00002', '2025-11-28');

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

--
-- Dumping data for table `requirementtype`
--

INSERT INTO `requirementtype` (`RequirementTypeID`, `TypeName`, `IsMandatory`, `SortOrder`) VALUES
(1, 'Birth Certificate (PSA)', 1, 1),
(2, 'Report Card', 1, 2),
(3, 'Good Moral', 1, 3),
(4, '2x2 ID Picture', 1, 4);

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

--
-- Dumping data for table `schedulestatus`
--

INSERT INTO `schedulestatus` (`StatusID`, `StatusName`) VALUES
(1, 'Active'),
(2, 'Cancelled'),
(3, 'Completed'),
(4, 'Suspended');

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

--
-- Dumping data for table `schoolyear`
--

INSERT INTO `schoolyear` (`SchoolYearID`, `YearName`, `StartDate`, `EndDate`, `IsActive`) VALUES
(2, '2020-2021', '2020-06-01', '2021-03-31', 0),
(3, '2021-2022', '2021-06-01', '2022-03-31', 0),
(4, '2022-2023', '2022-06-01', '2023-03-31', 0),
(5, '2023-2024', '2023-06-01', '2024-03-31', 0),
(6, '2024-2025', '2024-06-01', '2025-03-31', 0),
(7, '2025-2026', '2025-06-01', '2026-03-31', 1);

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
  `CurrentEnrollment` int(11) NOT NULL DEFAULT 0,
  `IsDefault` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`SectionID`, `GradeLevelID`, `SchoolYearID`, `AdviserTeacherID`, `SectionName`, `MaxCapacity`, `CurrentEnrollment`, `IsDefault`) VALUES
(1, 1, 7, NULL, 'Pre-elem Morning', 15, 0, 1),
(2, 1, 7, NULL, 'Pre-elem Afternoon', 15, 0, 1),
(3, 2, 7, NULL, 'Kinder Morning', 15, 0, 1),
(4, 2, 7, NULL, 'Kinder Afternoon', 15, 0, 1),
(5, 3, 7, NULL, 'Grade 1 Morning', 15, 0, 1),
(6, 3, 7, NULL, 'Grade 1 Afternoon', 15, 2, 1),
(7, 4, 7, NULL, 'Grade 2 Morning', 15, 0, 1),
(8, 4, 7, NULL, 'Grade 2 Afternoon', 15, 1, 1),
(9, 5, 7, NULL, 'Grade 3 Morning', 15, 0, 1),
(10, 5, 7, NULL, 'Grade 3 Afternoon', 15, 0, 1),
(11, 6, 7, NULL, 'Grade 4 Morning', 15, 0, 1),
(12, 6, 7, NULL, 'Grade 4 Afternoon', 15, 1, 1),
(13, 7, 7, NULL, 'Grade 5 Morning', 15, 0, 1),
(14, 7, 7, NULL, 'Grade 5 Afternoon', 15, 1, 1),
(15, 8, 7, NULL, 'Grade 6 Morning', 15, 0, 1),
(16, 8, 7, NULL, 'Grade 6 Afternoon', 15, 1, 1);

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

--
-- Dumping data for table `studentguardian`
--

INSERT INTO `studentguardian` (`StudentGuardianID`, `StudentProfileID`, `GuardianID`, `RelationshipType`, `IsPrimaryContact`, `IsEmergencyContact`, `IsAuthorizedPickup`, `SortOrder`) VALUES
(1, 1, 1, 'Father', 1, 1, 1, 0),
(2, 2, 2, 'Guardian', 1, 1, 1, 0),
(3, 3, 3, 'Father', 1, 1, 1, 0),
(4, 4, 4, 'Father', 1, 1, 1, 0),
(5, 5, 5, 'Father', 1, 1, 1, 0),
(6, 6, 6, 'Father', 1, 1, 1, 0);

-- --------------------------------------------------------

--
-- Stand-in structure for view `studentlogindetails`
-- (See below for the actual view)
--
CREATE TABLE `studentlogindetails` (
`UserID` int(11)
,`StudentNumber` varchar(50)
,`PasswordHash` varchar(255)
,`FullName` varchar(201)
,`UserType` enum('Admin','Teacher','Student','Parent','Registrar','Guard','Staff','HeadTeacher')
,`AccountStatus` enum('Active','Inactive','Suspended','PendingVerification')
,`ProfileID` int(11)
);

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

--
-- Dumping data for table `studentprofile`
--

INSERT INTO `studentprofile` (`StudentProfileID`, `ProfileID`, `StudentNumber`, `QRCodeID`, `DateOfBirth`, `Gender`, `Nationality`, `StudentStatus`, `ArchiveDate`) VALUES
(1, 2, 'GCA-2025-00001', 'QR-GCA-2025-00001', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(2, 3, 'GCA-2025-00002', 'QR-GCA-2025-00002', '2020-12-20', 'Male', 'Filipino', 'Enrolled', NULL),
(3, 4, 'GCA-2025-00003', 'QR-GCA-2025-00003', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(4, 5, 'GCA-2025-00004', 'QR-GCA-2025-00004', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(5, 6, 'GCA-2025-00005', 'QR-GCA-2025-00005', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(6, 7, 'GCA-2025-00006', 'QR-GCA-2025-00006', '2020-12-12', 'Male', 'Filipino', 'Enrolled', NULL);

--
-- Triggers `studentprofile`
--
DELIMITER $$
CREATE TRIGGER `after_student_profile_insert` AFTER INSERT ON `studentprofile` FOR EACH ROW BEGIN
    DECLARE app_transaction_id INT;
    DECLARE app_school_year_id INT;
    DECLARE transaction_balance DECIMAL(10,2);
    
    -- Find the application that matches this student's name
    SELECT a.TransactionID, a.SchoolYearID
    INTO app_transaction_id, app_school_year_id
    FROM application a
    JOIN profile p ON p.FirstName = a.StudentFirstName AND p.LastName = a.StudentLastName
    WHERE p.ProfileID = NEW.ProfileID
    AND a.ApplicationStatus IN ('Approved', 'Enrolled')
    AND a.TransactionID IS NOT NULL
    ORDER BY a.ApplicationID DESC
    LIMIT 1;
    
    -- If we found a matching transaction, link it automatically
    IF app_transaction_id IS NOT NULL THEN
        -- Update transaction with student profile ID
        UPDATE transaction 
        SET StudentProfileID = NEW.StudentProfileID
        WHERE TransactionID = app_transaction_id
        AND StudentProfileID IS NULL;
        
        -- Get the outstanding balance
        SELECT (TotalAmount - PaidAmount)
        INTO transaction_balance
        FROM transaction
        WHERE TransactionID = app_transaction_id;
        
        -- Update enrollment outstanding balance automatically
        UPDATE enrollment 
        SET OutstandingBalance = transaction_balance
        WHERE StudentProfileID = NEW.StudentProfileID
        AND SchoolYearID = app_school_year_id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `student_personal_info`
-- (See below for the actual view)
--
CREATE TABLE `student_personal_info` (
`UserID` int(11)
,`StudentProfileID` int(11)
,`ProfilePictureURL` varchar(2048)
,`FullName` varchar(302)
,`EmailAddress` varchar(255)
,`PhoneNumber` varchar(255)
,`Address` varchar(512)
,`StudentNumber` varchar(50)
,`DateOfBirth` date
,`Age` bigint(21)
,`Gender` varchar(20)
,`Nationality` varchar(100)
,`StudentStatus` enum('Enrolled','Withdrawn','Graduated','On Leave')
,`SchoolYear` varchar(50)
,`GradeAndSection` varchar(153)
,`AdviserName` varchar(201)
,`Weight` decimal(5,2)
,`Height` decimal(5,2)
,`Allergies` mediumtext
,`MedicalConditions` mediumtext
,`EmergencyContactPerson` varchar(255)
,`EmergencyContactNumber` varchar(255)
,`FatherName` varchar(255)
,`MotherName` varchar(255)
,`PrimaryGuardianName` varchar(255)
,`PrimaryGuardianRelationship` enum('Father','Mother','Guardian','Sibling','Other')
,`PrimaryGuardianContactNumber` varchar(255)
,`PrimaryGuardianEmail` varchar(255)
);

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

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`SubjectID`, `SubjectName`, `SubjectCode`, `GradeLevelID`, `IsActive`) VALUES
(1, 'Filipino', 'FIL-1', 3, 1),
(2, 'English', 'ENG-1', 3, 1),
(3, 'Mathematics', 'MATH-1', 3, 1),
(4, 'Makabansa', 'MAK-1', 3, 1),
(5, 'GMRC', 'GMRC-1', 3, 1),
(6, 'Music', 'MUS-1', 3, 1),
(7, 'Arts', 'ART-1', 3, 1),
(8, 'Physical Education', 'PE-1', 3, 1),
(9, 'Health', 'HLT-1', 3, 1),
(10, 'Filipino', 'FIL-2', 4, 1),
(11, 'English', 'ENG-2', 4, 1),
(12, 'Mathematics', 'MATH-2', 4, 1),
(13, 'Makabansa', 'MAK-2', 4, 1),
(14, 'GMRC', 'GMRC-2', 4, 1),
(15, 'Music', 'MUS-2', 4, 1),
(16, 'Arts', 'ART-2', 4, 1),
(17, 'Physical Education', 'PE-2', 4, 1),
(18, 'Health', 'HLT-2', 4, 1),
(19, 'Filipino', 'FIL-3', 5, 1),
(20, 'English', 'ENG-3', 5, 1),
(21, 'Mathematics', 'MATH-3', 5, 1),
(22, 'Makabansa', 'MAK-3', 5, 1),
(23, 'GMRC', 'GMRC-3', 5, 1),
(24, 'Music', 'MUS-3', 5, 1),
(25, 'Arts', 'ART-3', 5, 1),
(26, 'Physical Education', 'PE-3', 5, 1),
(27, 'Health', 'HLT-3', 5, 1),
(28, 'Filipino', 'FIL-4', 6, 1),
(29, 'English', 'ENG-4', 6, 1),
(30, 'Mathematics', 'MATH-4', 6, 1),
(31, 'Makabansa', 'MAK-4', 6, 1),
(32, 'GMRC', 'GMRC-4', 6, 1),
(33, 'Music', 'MUS-4', 6, 1),
(34, 'Arts', 'ART-4', 6, 1),
(35, 'Physical Education', 'PE-4', 6, 1),
(36, 'Health', 'HLT-4', 6, 1),
(37, 'Filipino', 'FIL-5', 7, 1),
(38, 'English', 'ENG-5', 7, 1),
(39, 'Mathematics', 'MATH-5', 7, 1),
(40, 'Makabansa', 'MAK-5', 7, 1),
(41, 'GMRC', 'GMRC-5', 7, 1),
(42, 'Music', 'MUS-5', 7, 1),
(43, 'Arts', 'ART-5', 7, 1),
(44, 'Physical Education', 'PE-5', 7, 1),
(45, 'Health', 'HLT-5', 7, 1),
(46, 'Filipino', 'FIL-6', 8, 1),
(47, 'English', 'ENG-6', 8, 1),
(48, 'Mathematics', 'MATH-6', 8, 1),
(49, 'Makabansa', 'MAK-6', 8, 1),
(50, 'GMRC', 'GMRC-6', 8, 1),
(51, 'Music', 'MUS-6', 8, 1),
(52, 'Arts', 'ART-6', 8, 1),
(53, 'Physical Education', 'PE-6', 8, 1),
(54, 'Health', 'HLT-6', 8, 1),
(55, 'ENGLISH', 'ENG6', 8, 1),
(56, 'MATH', 'MTH6', 8, 1),
(57, 'FILIPINO', 'FIL6', 8, 1),
(58, 'SCIENCE', 'SCI6', 8, 1),
(59, 'ARALING PANLIPUNAN', 'AP6', 8, 1),
(60, 'MAPEH', 'MAPEH6', 8, 1);

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
  `EmployeeNumber` varchar(50) DEFAULT NULL,
  `Specialization` varchar(255) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacherprofile`
--

INSERT INTO `teacherprofile` (`TeacherProfileID`, `ProfileID`, `EmployeeNumber`, `Specialization`, `HireDate`) VALUES
(1, 11, 'T-00001', 'Mathematics', '2025-05-10');

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
  `StudentProfileID` int(11) DEFAULT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `IssueDate` date NOT NULL,
  `DueDate` date DEFAULT NULL,
  `TotalAmount` decimal(10,2) NOT NULL,
  `PaidAmount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `BalanceAmount` decimal(10,2) GENERATED ALWAYS AS (`TotalAmount` - `PaidAmount`) STORED,
  `TransactionStatusID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`TransactionID`, `StudentProfileID`, `SchoolYearID`, `IssueDate`, `DueDate`, `TotalAmount`, `PaidAmount`, `TransactionStatusID`) VALUES
(1, 1, 7, '2025-11-28', '2025-11-30', 11000.00, 6000.00, 1),
(2, 2, 7, '2025-11-28', '2025-12-28', 18500.00, 0.00, 1),
(3, 3, 7, '2025-11-28', '2025-12-28', 20000.00, 20000.00, 2),
(4, NULL, 7, '2025-11-28', '2025-12-28', 18500.00, 7700.00, 2),
(5, 5, 7, '2025-11-28', '2025-12-28', 20000.00, 20000.00, 3),
(6, 6, 7, '2025-11-28', '2025-12-28', 18500.00, 18500.00, 3);

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

--
-- Dumping data for table `transactionitem`
--

INSERT INTO `transactionitem` (`ItemID`, `TransactionID`, `ItemTypeID`, `Description`, `Amount`, `Quantity`) VALUES
(1, 1, 1, 'ha', 100.00, 1),
(2, 2, 1, 'Registration Fee', 2000.00, 1),
(3, 2, 2, 'Miscellaneous Fee', 4500.00, 1),
(4, 2, 1, 'Tuition Fee', 12000.00, 1),
(5, 3, 1, 'Registration Fee', 2000.00, 1),
(6, 3, 2, 'Miscellaneous Fee', 5000.00, 1),
(7, 3, 1, 'Tuition Fee', 13000.00, 1),
(8, 4, 1, 'Registration Fee', 2000.00, 1),
(9, 4, 2, 'Miscellaneous Fee', 4500.00, 1),
(10, 4, 1, 'Tuition Fee', 12000.00, 1),
(11, 5, 1, 'Registration Fee', 2000.00, 1),
(12, 5, 2, 'Miscellaneous Fee', 5000.00, 1),
(13, 5, 1, 'Tuition Fee', 13000.00, 1),
(14, 6, 1, 'Registration Fee', 2000.00, 1),
(15, 6, 2, 'Miscellaneous Fee', 4500.00, 1),
(16, 6, 1, 'Tuition Fee', 12000.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `transactionstatus`
--

CREATE TABLE `transactionstatus` (
  `StatusID` int(11) NOT NULL,
  `StatusName` varchar(50) NOT NULL,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactionstatus`
--

INSERT INTO `transactionstatus` (`StatusID`, `StatusName`, `SortOrder`) VALUES
(1, 'Unpaid', 1),
(2, 'Partial', 2),
(3, 'Paid', 3),
(4, 'Overdue', 4);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UserID` int(11) NOT NULL,
  `EmailAddress` varchar(255) NOT NULL,
  `UserType` enum('Admin','Teacher','Student','Parent','Registrar','Guard','Staff','HeadTeacher') NOT NULL,
  `AccountStatus` enum('Active','Inactive','Suspended','PendingVerification') NOT NULL DEFAULT 'PendingVerification',
  `LastLoginDate` datetime DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `DeletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`UserID`, `EmailAddress`, `UserType`, `AccountStatus`, `LastLoginDate`, `CreatedAt`, `UpdatedAt`, `IsDeleted`, `DeletedAt`) VALUES
(1, '1', 'Registrar', 'Active', NULL, '2025-11-28 04:12:58', '2025-11-28 04:12:58', 0, NULL),
(2, 'aaaa.aa@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 04:22:41', '2025-11-28 04:22:41', 0, NULL),
(3, 'joaa.gaa@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 06:48:51', '2025-11-28 06:48:51', 0, NULL),
(4, 'aaaaga.hahaha@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 06:59:24', '2025-11-28 06:59:24', 0, NULL),
(5, 'sana.ka@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 07:06:41', '2025-11-28 07:06:41', 0, NULL),
(6, 'haha.ahahaha@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 07:27:35', '2025-11-28 07:27:35', 0, NULL),
(7, 'hahaha.hahaha@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 08:49:31', '2025-11-28 08:49:31', 0, NULL),
(8, 'maglipon.denmarc.amar@gmail.com', 'Guard', 'Active', NULL, '2025-11-28 08:49:12', '2025-11-28 08:49:12', 0, NULL),
(9, 'amar.dmnmnenmarc@gmail.com', 'Registrar', 'Active', NULL, '2025-11-28 08:54:27', '2025-11-29 15:40:33', 0, NULL),
(10, 'gagalang.joshua.s@gmail.com', 'Guard', 'Active', NULL, '2025-11-29 05:04:38', '2025-11-29 05:04:38', 0, NULL),
(11, 'uniqujje@gmail.com', 'HeadTeacher', 'Active', NULL, '2025-11-29 06:05:05', '2025-11-29 06:05:05', 0, NULL),
(12, 'amar.denmarc@gmail.com', 'Admin', 'Active', NULL, '2025-11-29 07:40:43', '2025-11-29 07:40:43', 0, NULL);

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

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `SessionID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Token` varchar(255) NOT NULL,
  `ExpiresAt` datetime NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `LastActivity` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`SessionID`, `UserID`, `Token`, `ExpiresAt`, `CreatedAt`, `LastActivity`) VALUES
(1, 1, '0a50422b7641e62ba070fcd65d7e93d63f95f37698e29678d4ab131db8a6b6c3_1_1764294736', '2025-12-28 09:52:16', '2025-11-28 08:12:27', '2025-11-28 09:52:16'),
(6, 7, '2e05cc78277abbbcdfd19bee405a43a86a41871a726001d624ba053cae5e0a5f_7_1764416764', '2025-12-29 19:46:04', '2025-11-28 08:49:50', '2025-11-29 19:46:04'),
(12, 6, 'aaa2bc638688b3c99cddfa08f015ff5dae4638cca6d964516c19095214c92474_6_1764293721', '2025-12-28 09:35:21', '2025-11-28 09:35:21', '2025-11-28 09:35:21'),
(13, 3, '08e4f4fd9d5c492073c64ec2961e597743fc00dabde0b4304be78c0870943753_3_1764294862', '2025-12-28 09:54:22', '2025-11-28 09:47:47', '2025-11-28 09:54:22'),
(17, 2, '501cafa2c3e11cfc02ebcbddd02db4d46d8e72ee3bd0f215493ebc7463b88ff8_2_1764294909', '2025-12-28 09:55:09', '2025-11-28 09:55:09', '2025-11-28 09:55:09'),
(21, 12, 'e639e0b286320cc0241b8754a5e9bb25be663abd40c212e664282410ded2e8b7_12_1764416784', '2025-12-29 19:46:24', '2025-11-29 16:32:24', '2025-11-29 19:46:24');

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_student_auth`
-- (See below for the actual view)
--
CREATE TABLE `vw_student_auth` (
`UserID` int(11)
,`EmailAddress` varchar(255)
,`UserType` enum('Admin','Teacher','Student','Parent','Registrar','Guard','Staff','HeadTeacher')
,`AccountStatus` enum('Active','Inactive','Suspended','PendingVerification')
,`LastLoginDate` datetime
,`UserCreatedAt` datetime
,`IsDeleted` tinyint(1)
,`ProfileID` int(11)
,`FirstName` varchar(100)
,`LastName` varchar(100)
,`MiddleName` varchar(100)
,`FullName` varchar(302)
,`EncryptedPhoneNumber` varbinary(255)
,`EncryptedAddress` varbinary(512)
,`ProfilePictureURL` varchar(2048)
,`StudentProfileID` int(11)
,`StudentNumber` varchar(50)
,`QRCodeID` varchar(255)
,`DateOfBirth` date
,`Gender` varchar(20)
,`Nationality` varchar(100)
,`StudentStatus` enum('Enrolled','Withdrawn','Graduated','On Leave')
,`ArchiveDate` date
,`PasswordHash` varchar(255)
,`PasswordSetDate` datetime
,`ExpiryDate` datetime
,`MustChange` tinyint(1)
,`FailedLoginAttempts` int(11)
,`LockedUntil` datetime
,`LoginStatus` varchar(12)
,`Age` bigint(21)
);

-- --------------------------------------------------------

--
-- Structure for view `studentlogindetails`
--
DROP TABLE IF EXISTS `studentlogindetails`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `studentlogindetails`  AS SELECT `u`.`UserID` AS `UserID`, `sp`.`StudentNumber` AS `StudentNumber`, `pp`.`PasswordHash` AS `PasswordHash`, concat(`p`.`FirstName`,' ',`p`.`LastName`) AS `FullName`, `u`.`UserType` AS `UserType`, `u`.`AccountStatus` AS `AccountStatus`, `p`.`ProfileID` AS `ProfileID` FROM (((`studentprofile` `sp` join `profile` `p` on(`sp`.`ProfileID` = `p`.`ProfileID`)) join `user` `u` on(`p`.`UserID` = `u`.`UserID`)) join `passwordpolicy` `pp` on(`u`.`UserID` = `pp`.`UserID`)) WHERE `u`.`UserType` = 'Student' ;

-- --------------------------------------------------------

--
-- Structure for view `student_personal_info`
--
DROP TABLE IF EXISTS `student_personal_info`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `student_personal_info`  AS SELECT `u`.`UserID` AS `UserID`, `sp`.`StudentProfileID` AS `StudentProfileID`, `p`.`ProfilePictureURL` AS `ProfilePictureURL`, concat_ws(' ',`p`.`FirstName`,`p`.`MiddleName`,`p`.`LastName`) AS `FullName`, `u`.`EmailAddress` AS `EmailAddress`, cast(`p`.`EncryptedPhoneNumber` as char charset utf8mb4) AS `PhoneNumber`, cast(`p`.`EncryptedAddress` as char charset utf8mb4) AS `Address`, `sp`.`StudentNumber` AS `StudentNumber`, `sp`.`DateOfBirth` AS `DateOfBirth`, timestampdiff(YEAR,`sp`.`DateOfBirth`,curdate()) AS `Age`, `sp`.`Gender` AS `Gender`, `sp`.`Nationality` AS `Nationality`, `sp`.`StudentStatus` AS `StudentStatus`, `sy`.`YearName` AS `SchoolYear`, concat(`gl`.`LevelName`,' - ',`sec`.`SectionName`) AS `GradeAndSection`, concat_ws(' ',`adviser_profile`.`FirstName`,`adviser_profile`.`LastName`) AS `AdviserName`, `mi`.`Weight` AS `Weight`, `mi`.`Height` AS `Height`, cast(`mi`.`EncryptedAllergies` as char charset utf8mb4) AS `Allergies`, cast(`mi`.`EncryptedMedicalConditions` as char charset utf8mb4) AS `MedicalConditions`, `ec`.`ContactPerson` AS `EmergencyContactPerson`, cast(`ec`.`EncryptedContactNumber` as char charset utf8mb4) AS `EmergencyContactNumber`, (select `g`.`FullName` from (`guardian` `g` join `studentguardian` `sg` on(`g`.`GuardianID` = `sg`.`GuardianID`)) where `sg`.`StudentProfileID` = `sp`.`StudentProfileID` and `sg`.`RelationshipType` = 'Father' limit 1) AS `FatherName`, (select `g`.`FullName` from (`guardian` `g` join `studentguardian` `sg` on(`g`.`GuardianID` = `sg`.`GuardianID`)) where `sg`.`StudentProfileID` = `sp`.`StudentProfileID` and `sg`.`RelationshipType` = 'Mother' limit 1) AS `MotherName`, `g_primary`.`FullName` AS `PrimaryGuardianName`, `sg_primary`.`RelationshipType` AS `PrimaryGuardianRelationship`, cast(`g_primary`.`EncryptedPhoneNumber` as char charset utf8mb4) AS `PrimaryGuardianContactNumber`, cast(`g_primary`.`EncryptedEmailAddress` as char charset utf8mb4) AS `PrimaryGuardianEmail` FROM ((((((((((((`user` `u` join `profile` `p` on(`u`.`UserID` = `p`.`UserID`)) join `studentprofile` `sp` on(`p`.`ProfileID` = `sp`.`ProfileID`)) left join (select `e_inner`.`EnrollmentID` AS `EnrollmentID`,`e_inner`.`StudentProfileID` AS `StudentProfileID`,`e_inner`.`SectionID` AS `SectionID`,`e_inner`.`SchoolYearID` AS `SchoolYearID`,`e_inner`.`EnrollmentDate` AS `EnrollmentDate` from (`enrollment` `e_inner` join (select `enrollment`.`StudentProfileID` AS `StudentProfileID`,max(`enrollment`.`EnrollmentID`) AS `MaxID` from `enrollment` group by `enrollment`.`StudentProfileID`) `latest_e` on(`e_inner`.`StudentProfileID` = `latest_e`.`StudentProfileID` and `e_inner`.`EnrollmentID` = `latest_e`.`MaxID`))) `e` on(`sp`.`StudentProfileID` = `e`.`StudentProfileID`)) left join `schoolyear` `sy` on(`e`.`SchoolYearID` = `sy`.`SchoolYearID`)) left join `section` `sec` on(`e`.`SectionID` = `sec`.`SectionID`)) left join `gradelevel` `gl` on(`sec`.`GradeLevelID` = `gl`.`GradeLevelID`)) left join `teacherprofile` `tp` on(`sec`.`AdviserTeacherID` = `tp`.`TeacherProfileID`)) left join `profile` `adviser_profile` on(`tp`.`ProfileID` = `adviser_profile`.`ProfileID`)) left join `medicalinfo` `mi` on(`sp`.`StudentProfileID` = `mi`.`StudentProfileID`)) left join `emergencycontact` `ec` on(`sp`.`StudentProfileID` = `ec`.`StudentProfileID`)) left join `studentguardian` `sg_primary` on(`sp`.`StudentProfileID` = `sg_primary`.`StudentProfileID` and `sg_primary`.`IsPrimaryContact` = 1)) left join `guardian` `g_primary` on(`sg_primary`.`GuardianID` = `g_primary`.`GuardianID`)) WHERE `u`.`IsDeleted` = 0 ;

-- --------------------------------------------------------

--
-- Structure for view `vw_student_auth`
--
DROP TABLE IF EXISTS `vw_student_auth`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_student_auth`  AS SELECT `u`.`UserID` AS `UserID`, `u`.`EmailAddress` AS `EmailAddress`, `u`.`UserType` AS `UserType`, `u`.`AccountStatus` AS `AccountStatus`, `u`.`LastLoginDate` AS `LastLoginDate`, `u`.`CreatedAt` AS `UserCreatedAt`, `u`.`IsDeleted` AS `IsDeleted`, `p`.`ProfileID` AS `ProfileID`, `p`.`FirstName` AS `FirstName`, `p`.`LastName` AS `LastName`, `p`.`MiddleName` AS `MiddleName`, concat_ws(' ',`p`.`FirstName`,`p`.`MiddleName`,`p`.`LastName`) AS `FullName`, `p`.`EncryptedPhoneNumber` AS `EncryptedPhoneNumber`, `p`.`EncryptedAddress` AS `EncryptedAddress`, `p`.`ProfilePictureURL` AS `ProfilePictureURL`, `sp`.`StudentProfileID` AS `StudentProfileID`, `sp`.`StudentNumber` AS `StudentNumber`, `sp`.`QRCodeID` AS `QRCodeID`, `sp`.`DateOfBirth` AS `DateOfBirth`, `sp`.`Gender` AS `Gender`, `sp`.`Nationality` AS `Nationality`, `sp`.`StudentStatus` AS `StudentStatus`, `sp`.`ArchiveDate` AS `ArchiveDate`, `pp`.`PasswordHash` AS `PasswordHash`, `pp`.`PasswordSetDate` AS `PasswordSetDate`, `pp`.`ExpiryDate` AS `ExpiryDate`, `pp`.`MustChange` AS `MustChange`, `pp`.`FailedLoginAttempts` AS `FailedLoginAttempts`, `pp`.`LockedUntil` AS `LockedUntil`, CASE WHEN `pp`.`LockedUntil` is not null AND `pp`.`LockedUntil` > current_timestamp() THEN 'Locked' WHEN `u`.`AccountStatus` = 'Active' AND `sp`.`StudentStatus` = 'Enrolled' THEN 'Can Login' ELSE 'Cannot Login' END AS `LoginStatus`, timestampdiff(YEAR,`sp`.`DateOfBirth`,curdate()) AS `Age` FROM (((`user` `u` join `profile` `p` on(`u`.`UserID` = `p`.`UserID`)) join `studentprofile` `sp` on(`p`.`ProfileID` = `sp`.`ProfileID`)) left join `passwordpolicy` `pp` on(`u`.`UserID` = `pp`.`UserID`)) WHERE `u`.`UserType` = 'Student' AND `u`.`IsDeleted` = 0 ;

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
-- Indexes for table `adminprofile`
--
ALTER TABLE `adminprofile`
  ADD PRIMARY KEY (`AdminProfileID`),
  ADD KEY `profile_admin_fk` (`ProfileID`);

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
  ADD UNIQUE KEY `TrackingNumber` (`TrackingNumber`),
  ADD KEY `fk_Application_Profile` (`ApplicantProfileID`),
  ADD KEY `fk_Application_SchoolYear` (`SchoolYearID`),
  ADD KEY `fk_Application_GradeLevel` (`ApplyingForGradeLevelID`),
  ADD KEY `fk_Application_ReviewedByUser` (`ReviewedByUserID`),
  ADD KEY `idx_tracking_number` (`TrackingNumber`),
  ADD KEY `fk_Application_Transaction` (`TransactionID`);

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
  ADD KEY `fk_Attendance_Method` (`AttendanceMethodID`);

--
-- Indexes for table `attendancemethod`
--
ALTER TABLE `attendancemethod`
  ADD PRIMARY KEY (`MethodID`),
  ADD UNIQUE KEY `MethodName` (`MethodName`);

--
-- Indexes for table `attendancesummary`
--
ALTER TABLE `attendancesummary`
  ADD PRIMARY KEY (`AttendanceSummaryID`),
  ADD UNIQUE KEY `unique_student_year` (`StudentProfileID`,`SchoolYearID`),
  ADD KEY `fk_AttendanceSummary_SchoolYear` (`SchoolYearID`);

--
-- Indexes for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD PRIMARY KEY (`AuditID`),
  ADD KEY `fk_AuditLog_User` (`UserID`);

--
-- Indexes for table `authorized_escort`
--
ALTER TABLE `authorized_escort`
  ADD PRIMARY KEY (`EscortID`),
  ADD KEY `fk_AuthorizedEscort_Student` (`StudentProfileID`),
  ADD KEY `fk_AuthorizedEscort_Approver` (`ApprovedByUserID`);

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
-- Indexes for table `document_request`
--
ALTER TABLE `document_request`
  ADD PRIMARY KEY (`RequestID`),
  ADD KEY `fk_DocumentRequest_Student` (`StudentProfileID`),
  ADD KEY `fk_DocumentRequest_Processor` (`ProcessedByUserID`);

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
  ADD KEY `fk_Enrollment_SchoolYear` (`SchoolYearID`);

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
  ADD KEY `fk_Grade_ModifiedByUser` (`ModifiedByUserID`);

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
-- Indexes for table `gradesubmissiondeadline`
--
ALTER TABLE `gradesubmissiondeadline`
  ADD PRIMARY KEY (`DeadlineID`),
  ADD UNIQUE KEY `unique_schoolyear_quarter` (`SchoolYearID`,`Quarter`),
  ADD KEY `fk_GradeDeadline_SchoolYear` (`SchoolYearID`),
  ADD KEY `fk_GradeDeadline_CreatedByUser` (`CreatedByUserID`);

--
-- Indexes for table `guardian`
--
ALTER TABLE `guardian`
  ADD PRIMARY KEY (`GuardianID`);

--
-- Indexes for table `guardprofile`
--
ALTER TABLE `guardprofile`
  ADD PRIMARY KEY (`GuardProfileID`),
  ADD KEY `profile_guard_fk` (`ProfileID`);

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
-- Indexes for table `participationrating`
--
ALTER TABLE `participationrating`
  ADD PRIMARY KEY (`ParticipationRatingID`),
  ADD UNIQUE KEY `unique_student_year` (`StudentProfileID`,`SchoolYearID`),
  ADD KEY `fk_ParticipationRating_SchoolYear` (`SchoolYearID`),
  ADD KEY `fk_ParticipationRating_EvaluatedByUser` (`EvaluatedByUserID`);

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
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`TokenID`),
  ADD UNIQUE KEY `Token` (`Token`),
  ADD KEY `fk_PasswordResetToken_User` (`UserID`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`PaymentID`),
  ADD UNIQUE KEY `ReferenceNumber` (`ReferenceNumber`),
  ADD KEY `fk_Payment_Transaction` (`TransactionID`),
  ADD KEY `fk_Payment_PaymentMethod` (`PaymentMethodID`),
  ADD KEY `fk_Payment_SecureFile` (`ProofFileID`),
  ADD KEY `fk_Payment_VerifiedByUser` (`VerifiedByUserID`),
  ADD KEY `VerifiedBy` (`VerifiedBy`);

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
  ADD UNIQUE KEY `UserID` (`UserID`);

--
-- Indexes for table `registrarprofile`
--
ALTER TABLE `registrarprofile`
  ADD PRIMARY KEY (`RegistrarProfileID`),
  ADD KEY `profile_registrar_fk` (`ProfileID`);

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
  ADD UNIQUE KEY `StudentNumber` (`StudentNumber`);

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
  ADD UNIQUE KEY `ProfileID` (`ProfileID`);

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
  ADD KEY `fk_Transaction_StudentProfile` (`StudentProfileID`),
  ADD KEY `fk_Transaction_SchoolYear` (`SchoolYearID`),
  ADD KEY `fk_transaction_status` (`TransactionStatusID`);

--
-- Indexes for table `transactionitem`
--
ALTER TABLE `transactionitem`
  ADD PRIMARY KEY (`ItemID`),
  ADD KEY `fk_TransactionItem_Transaction` (`TransactionID`),
  ADD KEY `fk_TransactionItem_ItemType` (`ItemTypeID`);

--
-- Indexes for table `transactionstatus`
--
ALTER TABLE `transactionstatus`
  ADD PRIMARY KEY (`StatusID`),
  ADD UNIQUE KEY `StatusName` (`StatusName`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `EmailAddress` (`EmailAddress`);

--
-- Indexes for table `userrole`
--
ALTER TABLE `userrole`
  ADD PRIMARY KEY (`UserRoleID`),
  ADD UNIQUE KEY `UserID` (`UserID`,`RoleID`),
  ADD KEY `fk_UserRole_Role` (`RoleID`),
  ADD KEY `fk_UserRole_AssignedByUser` (`AssignedByUserID`);

--
-- Indexes for table `usersettings`
--
ALTER TABLE `usersettings`
  ADD PRIMARY KEY (`SettingsID`),
  ADD UNIQUE KEY `UserID` (`UserID`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`SessionID`),
  ADD UNIQUE KEY `Token` (`Token`),
  ADD UNIQUE KEY `UserID` (`UserID`),
  ADD KEY `fk_UserSessions_User` (`UserID`),
  ADD KEY `idx_token_expiry` (`Token`,`ExpiresAt`);

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
-- AUTO_INCREMENT for table `adminprofile`
--
ALTER TABLE `adminprofile`
  MODIFY `AdminProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `announcement`
--
ALTER TABLE `announcement`
  MODIFY `AnnouncementID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `application`
--
ALTER TABLE `application`
  MODIFY `ApplicationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `MethodID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `attendancesummary`
--
ALTER TABLE `attendancesummary`
  MODIFY `AttendanceSummaryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `auditlog`
--
ALTER TABLE `auditlog`
  MODIFY `AuditID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `authorized_escort`
--
ALTER TABLE `authorized_escort`
  MODIFY `EscortID` int(11) NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT for table `document_request`
--
ALTER TABLE `document_request`
  MODIFY `RequestID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  MODIFY `EmergencyContactID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `faq`
--
ALTER TABLE `faq`
  MODIFY `FAQID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grade`
--
ALTER TABLE `grade`
  MODIFY `GradeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=241;

--
-- AUTO_INCREMENT for table `gradelevel`
--
ALTER TABLE `gradelevel`
  MODIFY `GradeLevelID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `gradestatus`
--
ALTER TABLE `gradestatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gradesubmissiondeadline`
--
ALTER TABLE `gradesubmissiondeadline`
  MODIFY `DeadlineID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `guardian`
--
ALTER TABLE `guardian`
  MODIFY `GuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `guardprofile`
--
ALTER TABLE `guardprofile`
  MODIFY `GuardProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `itemtype`
--
ALTER TABLE `itemtype`
  MODIFY `ItemTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `medicalinfo`
--
ALTER TABLE `medicalinfo`
  MODIFY `MedicalInfoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notificationlog`
--
ALTER TABLE `notificationlog`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notificationtype`
--
ALTER TABLE `notificationtype`
  MODIFY `NotificationTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `participationlevel`
--
ALTER TABLE `participationlevel`
  MODIFY `ParticipationLevelID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `participationrating`
--
ALTER TABLE `participationrating`
  MODIFY `ParticipationRatingID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `passwordhistory`
--
ALTER TABLE `passwordhistory`
  MODIFY `HistoryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `passwordpolicy`
--
ALTER TABLE `passwordpolicy`
  MODIFY `PolicyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `TokenID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  MODIFY `PaymentMethodID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `PermissionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `ProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `registrarprofile`
--
ALTER TABLE `registrarprofile`
  MODIFY `RegistrarProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `requirementtype`
--
ALTER TABLE `requirementtype`
  MODIFY `RequirementTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `schoolyear`
--
ALTER TABLE `schoolyear`
  MODIFY `SchoolYearID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `SectionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `securefile`
--
ALTER TABLE `securefile`
  MODIFY `FileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `studentguardian`
--
ALTER TABLE `studentguardian`
  MODIFY `StudentGuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `studentprofile`
--
ALTER TABLE `studentprofile`
  MODIFY `StudentProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `SubjectID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `supportticket`
--
ALTER TABLE `supportticket`
  MODIFY `TicketID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacherprofile`
--
ALTER TABLE `teacherprofile`
  MODIFY `TeacherProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ticketmessage`
--
ALTER TABLE `ticketmessage`
  MODIFY `MessageID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `transactionitem`
--
ALTER TABLE `transactionitem`
  MODIFY `ItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `transactionstatus`
--
ALTER TABLE `transactionstatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `SessionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

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
-- Constraints for table `adminprofile`
--
ALTER TABLE `adminprofile`
  ADD CONSTRAINT `profile_admin_fk` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `fk_Application_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_Application_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`) ON DELETE SET NULL;

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
-- Constraints for table `attendancesummary`
--
ALTER TABLE `attendancesummary`
  ADD CONSTRAINT `fk_AttendanceSummary_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_AttendanceSummary_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD CONSTRAINT `fk_AuditLog_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

--
-- Constraints for table `authorized_escort`
--
ALTER TABLE `authorized_escort`
  ADD CONSTRAINT `fk_AuthorizedEscort_Approver` FOREIGN KEY (`ApprovedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_AuthorizedEscort_Student` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

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
-- Constraints for table `document_request`
--
ALTER TABLE `document_request`
  ADD CONSTRAINT `fk_DocumentRequest_Processor` FOREIGN KEY (`ProcessedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_DocumentRequest_Student` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  ADD CONSTRAINT `fk_EmergencyContact_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `grade`
--
ALTER TABLE `grade`
  ADD CONSTRAINT `fk_Grade_Enrollment` FOREIGN KEY (`EnrollmentID`) REFERENCES `enrollment` (`EnrollmentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Grade_ModifiedByUser` FOREIGN KEY (`ModifiedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Grade_Status` FOREIGN KEY (`GradeStatusID`) REFERENCES `gradestatus` (`StatusID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Grade_Subject` FOREIGN KEY (`SubjectID`) REFERENCES `subject` (`SubjectID`);

--
-- Constraints for table `gradesubmissiondeadline`
--
ALTER TABLE `gradesubmissiondeadline`
  ADD CONSTRAINT `fk_GradeDeadline_CreatedByUser` FOREIGN KEY (`CreatedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_GradeDeadline_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`VerifiedBy`) REFERENCES `user` (`UserID`);

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `fk_UserSessions_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `cleanup_expired_sessions` ON SCHEDULE EVERY 1 DAY STARTS '2025-11-28 08:16:31' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM user_sessions WHERE ExpiresAt < NOW()$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
