-- ========================================
-- Verification Script
-- ========================================
-- Run this to verify that all data was seeded correctly

USE db_gymnazo;

-- Check Grade Levels (should show 12 grades)
SELECT 'GRADE LEVELS:' as '';
SELECT GradeLevelID, LevelName, SortOrder FROM gradelevel ORDER BY SortOrder;

-- Check Subjects Count
SELECT '' as '';
SELECT 'SUBJECTS:' as '';
SELECT 
    g.LevelName,
    COUNT(s.SubjectID) as SubjectCount,
    GROUP_CONCAT(s.SubjectName SEPARATOR ', ') as Subjects
FROM gradelevel g
LEFT JOIN subject s ON g.GradeLevelID = s.GradeLevelID
GROUP BY g.GradeLevelID
ORDER BY g.SortOrder;

-- Check Active School Year
SELECT '' as '';
SELECT 'ACTIVE SCHOOL YEAR:' as '';
SELECT SchoolYearID, YearName, StartDate, EndDate, IsActive FROM schoolyear WHERE IsActive = 1;

-- Check Schedule Statuses
SELECT '' as '';
SELECT 'SCHEDULE STATUSES:' as '';
SELECT StatusID, StatusName FROM schedulestatus;

-- Check if any sections exist
SELECT '' as '';
SELECT 'SECTIONS:' as '';
SELECT COUNT(*) as TotalSections FROM section;
