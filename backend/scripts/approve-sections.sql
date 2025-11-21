-- Script to approve all pending sections
-- This will update sections that are currently showing as "Pending" to "Approved"

-- First, let's see what status IDs we have
SELECT * FROM schedulestatus;

-- Get the Approved status ID (usually 2)
SET @approved_status = (SELECT StatusID FROM schedulestatus WHERE StatusName = 'Approved');
SET @pending_status = (SELECT StatusID FROM schedulestatus WHERE StatusName = 'Pending');

-- Show current pending sections
SELECT 
    sec.SectionID,
    gl.LevelName as Grade,
    sec.SectionName as Section,
    COALESCE(ss.StatusName, 'Pending') as CurrentStatus
FROM section sec
JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
LEFT JOIN classschedule cs ON cs.SectionID = sec.SectionID
LEFT JOIN schedulestatus ss ON cs.ScheduleStatusID = ss.StatusID
WHERE sec.AdviserTeacherID IS NOT NULL
GROUP BY sec.SectionID, gl.LevelName, sec.SectionName;

-- Option 1: Update ALL existing schedules to Approved status
UPDATE classschedule 
SET ScheduleStatusID = @approved_status
WHERE ScheduleStatusID IS NULL OR ScheduleStatusID = @pending_status;

-- Option 2: If you want to approve a specific section (replace SECTION_ID with actual ID)
-- UPDATE classschedule 
-- SET ScheduleStatusID = @approved_status
-- WHERE SectionID = SECTION_ID;

-- Verify the changes
SELECT 
    sec.SectionID,
    gl.LevelName as Grade,
    sec.SectionName as Section,
    ss.StatusName as NewStatus
FROM section sec
JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
LEFT JOIN classschedule cs ON cs.SectionID = sec.SectionID
LEFT JOIN schedulestatus ss ON cs.ScheduleStatusID = ss.StatusID
WHERE sec.AdviserTeacherID IS NOT NULL
GROUP BY sec.SectionID, gl.LevelName, sec.SectionName;
