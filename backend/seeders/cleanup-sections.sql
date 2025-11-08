-- Clean up old sections with wrong naming (flower names for non-Grade 1)
-- Run this if you created sections before the theme update

USE db_gymnazo;

-- Show current sections
SELECT 
    s.SectionID,
    s.SectionName,
    gl.LevelName as GradeLevel,
    s.MaxCapacity,
    s.CurrentEnrollment
FROM section s
JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
ORDER BY gl.GradeLevelID, s.SectionName;

-- Delete old sections (ONLY if they have wrong names)
-- Comment out the following line after reviewing the above SELECT results
-- DELETE FROM section WHERE SectionID > 0;

-- After deleting, recreate sections using the "Add New Class" modal
-- Each grade will now use the correct theme names
