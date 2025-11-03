-- ========================================
-- Teacher Role and Permissions Setup
-- ========================================
-- This script creates the Teacher role and assigns appropriate permissions
-- Run this in phpMyAdmin or MySQL Workbench

-- 1. Create Teacher Role (if it doesn't exist)
INSERT IGNORE INTO role (RoleName, Description, IsActive)
VALUES ('Teacher', 'Teaching staff with class management and grading permissions', 1);

-- Get the RoleID for Teacher
SET @teacherRoleID = (SELECT RoleID FROM role WHERE RoleName = 'Teacher' LIMIT 1);

-- 2. Create Permissions (if they don't exist)
INSERT IGNORE INTO permission (PermissionCode, ModuleName, Description) VALUES
-- Student Management
('view_students', 'Students', 'View student information in assigned classes'),
('view_student_profiles', 'Students', 'View detailed student profiles'),

-- Grade Management
('view_grades', 'Grades', 'View student grades'),
('manage_grades', 'Grades', 'Input and edit student grades'),
('submit_grades', 'Grades', 'Submit final grades for approval'),

-- Attendance Management
('view_attendance', 'Attendance', 'View attendance records'),
('manage_attendance', 'Attendance', 'Mark student attendance'),
('edit_attendance', 'Attendance', 'Edit attendance records'),

-- Schedule Management
('view_schedules', 'Schedules', 'View class schedules'),
('view_own_schedule', 'Schedules', 'View personal teaching schedule'),
('create_schedule', 'Schedules', 'Create new class schedules'),
('edit_own_schedule', 'Schedules', 'Edit personal teaching schedule'),

-- Class Management
('view_classes', 'Classes', 'View assigned classes'),
('manage_class_content', 'Classes', 'Manage class materials and content'),

-- Announcement Management
('view_announcements', 'Announcements', 'View school announcements'),
('create_announcements', 'Announcements', 'Create class announcements'),
('edit_own_announcements', 'Announcements', 'Edit own announcements'),
('delete_own_announcements', 'Announcements', 'Delete own announcements'),

-- Report Management
('view_reports', 'Reports', 'View student reports'),
('generate_class_reports', 'Reports', 'Generate reports for assigned classes'),

-- Profile Management
('view_own_profile', 'Profile', 'View own teacher profile'),
('edit_own_profile', 'Profile', 'Edit own teacher profile');

-- 3. Assign Permissions to Teacher Role
INSERT IGNORE INTO rolepermission (RoleID, PermissionID)
SELECT @teacherRoleID, PermissionID
FROM permission
WHERE PermissionCode IN (
    'view_students',
    'view_student_profiles',
    'view_grades',
    'manage_grades',    
    'submit_grades',
    'view_attendance',
    'manage_attendance',
    'edit_attendance',
    'view_schedules',
    'view_own_schedule',
    'view_classes',
    'manage_class_content',
    'view_announcements',
    'create_announcements',
    'edit_own_announcements',
    'delete_own_announcements',
    'view_reports',
    'generate_class_reports',
    'view_own_profile',
    'edit_own_profile'
);

-- 4. Verify Setup
SELECT 
    r.RoleName,
    p.PermissionCode,
    p.ModuleName,
    p.Description
FROM role r
JOIN rolepermission rp ON r.RoleID = rp.RoleID
JOIN permission p ON rp.PermissionID = p.PermissionID
WHERE r.RoleName = 'Teacher'
ORDER BY p.ModuleName, p.PermissionCode;

SELECT 
    r.RoleName,
    p.PermissionCode,
    p.ModuleName,
    p.Description
FROM role r
JOIN rolepermission rp ON r.RoleID = rp.RoleID
JOIN permission p ON rp.PermissionID = p.PermissionID
WHERE r.RoleName = 'Super Teacher'
ORDER BY p.ModuleName, p.PermissionCode;

-- 5. Add Super Teacher Role
INSERT IGNORE INTO role (RoleName, Description, IsActive)
VALUES ('Super Teacher', 'Role with elevated permissions for experienced teachers', 1);

-- Get the RoleID for Super Teacher
SET @superTeacherRoleID = (SELECT RoleID FROM role WHERE RoleName = 'Super Teacher' LIMIT 1);
-- ========================================
-- Sample Test Teacher Account
-- ========================================
-- Uncomment below to create a test teacher account manually

/*
-- Create User
INSERT INTO user (EmailAddress, UserType, AccountStatus, CreatedAt)
VALUES ('testteacher@gymnazo.edu', 'Teacher', 'Active', NOW());
SET @newUserID = LAST_INSERT_ID();

-- Create Password Policy (password: Test1234!)
INSERT INTO passwordpolicy (UserID, PasswordHash, PasswordSetDate, MustChange, FailedLoginAttempts)
VALUES (@newUserID, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), 0, 0);

-- Create Profile
INSERT INTO profile (UserID, FirstName, LastName, MiddleName)
VALUES (@newUserID, 'Test', 'Teacher', 'Sample');
SET @newProfileID = LAST_INSERT_ID();

-- Create Teacher Profile
INSERT INTO teacherprofile (ProfileID, EmployeeNumber, Specialization, HireDate)
VALUES (@newProfileID, 'TEACH-2025-TEST', 'General Education', CURDATE());

-- Assign Teacher Role
INSERT INTO userrole (UserID, RoleID, AssignedDate)
VALUES (@newUserID, @teacherRoleID, NOW());

-- Verify Creation
SELECT 
    u.UserID,
    u.EmailAddress,
    CONCAT(p.FirstName, ' ', p.LastName) AS FullName,
    tp.EmployeeNumber,
    u.AccountStatus,
    r.RoleName
FROM user u
JOIN profile p ON u.UserID = p.UserID
JOIN teacherprofile tp ON p.ProfileID = tp.ProfileID
JOIN userrole ur ON u.UserID = ur.UserID
JOIN role r ON ur.RoleID = r.RoleID
WHERE u.EmailAddress = 'testteacher@gymnazo.edu';
*/

-- ========================================
-- Clean Up Test Data (Optional)
-- ========================================
-- Uncomment to remove test teacher account

/*
-- Get UserID
SET @testUserID = (SELECT UserID FROM user WHERE EmailAddress = 'testteacher@gymnazo.edu' LIMIT 1);

-- Delete in reverse order (respecting foreign keys)
DELETE FROM userrole WHERE UserID = @testUserID;
DELETE FROM teacherprofile WHERE ProfileID IN (SELECT ProfileID FROM profile WHERE UserID = @testUserID);
DELETE FROM profile WHERE UserID = @testUserID;
DELETE FROM passwordpolicy WHERE UserID = @testUserID;
DELETE FROM user WHERE UserID = @testUserID;
*/
