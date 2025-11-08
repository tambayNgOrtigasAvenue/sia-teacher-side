-- ========================================
-- Seed Data for Teaching Schedule Feature
-- ========================================
-- This script populates the required tables with initial data
-- Run this in your MySQL database to enable the "Add New Class" modal

USE db_gymnazo;

-- ========================================
-- 1. GRADE LEVELS
-- ========================================
INSERT INTO gradelevel (GradeLevelID, LevelName, SortOrder) VALUES
(1, 'Grade 1', 1),
(2, 'Grade 2', 2),
(3, 'Grade 3', 3),
(4, 'Grade 4', 4),
(5, 'Grade 5', 5),
(6, 'Grade 6', 6),
(7, 'Grade 7', 7),
(8, 'Grade 8', 8),
(9, 'Grade 9', 9),
(10, 'Grade 10', 10),
(11, 'Grade 11', 11),
(12, 'Grade 12', 12)
ON DUPLICATE KEY UPDATE LevelName = VALUES(LevelName);

-- ========================================
-- 2. SUBJECTS
-- ========================================
-- Note: Subject table requires GradeLevelID. Adding subjects for all grade levels (1-12)
-- For simplicity, we'll add core subjects for elementary (1-6) and high school (7-12) separately

-- Elementary Subjects (Grades 1-6)
INSERT INTO subject (SubjectName, SubjectCode, GradeLevelID, IsActive) VALUES
('English', 'ENG-1', 1, 1), ('Mathematics', 'MATH-1', 1, 1), ('Science', 'SCI-1', 1, 1), ('Filipino', 'FIL-1', 1, 1),
('English', 'ENG-2', 2, 1), ('Mathematics', 'MATH-2', 2, 1), ('Science', 'SCI-2', 2, 1), ('Filipino', 'FIL-2', 2, 1),
('English', 'ENG-3', 3, 1), ('Mathematics', 'MATH-3', 3, 1), ('Science', 'SCI-3', 3, 1), ('Filipino', 'FIL-3', 3, 1),
('English', 'ENG-4', 4, 1), ('Mathematics', 'MATH-4', 4, 1), ('Science', 'SCI-4', 4, 1), ('Filipino', 'FIL-4', 4, 1),
('English', 'ENG-5', 5, 1), ('Mathematics', 'MATH-5', 5, 1), ('Science', 'SCI-5', 5, 1), ('Filipino', 'FIL-5', 5, 1),
('English', 'ENG-6', 6, 1), ('Mathematics', 'MATH-6', 6, 1), ('Science', 'SCI-6', 6, 1), ('Filipino', 'FIL-6', 6, 1)
ON DUPLICATE KEY UPDATE SubjectName = VALUES(SubjectName);

-- High School Subjects (Grades 7-12)
INSERT INTO subject (SubjectName, SubjectCode, GradeLevelID, IsActive) VALUES
('English', 'ENG-7', 7, 1), ('Mathematics', 'MATH-7', 7, 1), ('Science', 'SCI-7', 7, 1), ('Filipino', 'FIL-7', 7, 1),
('English', 'ENG-8', 8, 1), ('Mathematics', 'MATH-8', 8, 1), ('Science', 'SCI-8', 8, 1), ('Filipino', 'FIL-8', 8, 1),
('English', 'ENG-9', 9, 1), ('Mathematics', 'MATH-9', 9, 1), ('Science', 'SCI-9', 9, 1), ('Filipino', 'FIL-9', 9, 1),
('English', 'ENG-10', 10, 1), ('Mathematics', 'MATH-10', 10, 1), ('Science', 'SCI-10', 10, 1), ('Filipino', 'FIL-10', 10, 1),
('English', 'ENG-11', 11, 1), ('Mathematics', 'MATH-11', 11, 1), ('Science', 'SCI-11', 11, 1), ('Filipino', 'FIL-11', 11, 1),
('English', 'ENG-12', 12, 1), ('Mathematics', 'MATH-12', 12, 1), ('Science', 'SCI-12', 12, 1), ('Filipino', 'FIL-12', 12, 1)
ON DUPLICATE KEY UPDATE SubjectName = VALUES(SubjectName);

-- ========================================
-- 3. SCHOOL YEAR
-- ========================================
-- Create the current active school year
INSERT INTO schoolyear (YearName, StartDate, EndDate, IsActive) VALUES
('2024-2025', '2024-08-01', '2025-05-31', 1)
ON DUPLICATE KEY UPDATE IsActive = VALUES(IsActive);

-- Deactivate all other school years
UPDATE schoolyear SET IsActive = 0 WHERE YearName != '2024-2025';

-- ========================================
-- 4. SCHEDULE STATUS
-- ========================================
INSERT INTO schedulestatus (StatusID, StatusName) VALUES
(1, 'Pending'),
(2, 'Approved'),
(3, 'Cancelled')
ON DUPLICATE KEY UPDATE StatusName = VALUES(StatusName);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these to verify the data was inserted correctly:

-- SELECT * FROM gradelevel;
-- SELECT * FROM subject;
-- SELECT * FROM schoolyear WHERE IsActive = 1;
-- SELECT * FROM schedulestatus;

-- ========================================
-- NOTES:
-- ========================================
-- 1. Sections are created dynamically through the "Create Sections" button in the UI
-- 2. Each grade level will have 5 sections: Rose, Lily, Tulip, Daisy, Sunflower
-- 3. Each section has a maximum capacity of 15 students
-- 4. Classes are assigned to sections by teachers through the "Add New Class" modal
