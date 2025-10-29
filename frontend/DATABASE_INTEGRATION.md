# 🔌 Database Integration Guide

## Overview

This guide explains how to switch from mock data to database fetching in your Class Management Application. All database integration points are clearly marked with comments in the code.

## 🎯 Database Integration Points

### 1. **Fetch Classes from Database**
**Location:** `classManagementApp.jsx` - Line ~55

**Current State:** Using mock data  
**To Switch:** Uncomment the API call section

```jsx
// UNCOMMENT THIS BLOCK:
const response = await fetch(
  'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/classes/get-teacher-classes.php',
  {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  }
);

// COMMENT OUT THIS BLOCK:
const mockClasses = [...];
setClasses(mockClasses);
```

**Expected API Response Format:**
```json
{
  "success": true,
  "classes": [
    {
      "id": 1,
      "grade": "Grade 6",
      "section": "Section A",
      "subject": "Mathematics",
      "isFavorited": true,
      "status": "active"
    }
  ]
}
```

### 2. **Fetch Students by Class**
**Location:** `classManagementApp.jsx` - Line ~130

**Current State:** Using mock data  
**To Switch:** Uncomment the API call section

```jsx
// UNCOMMENT THIS BLOCK:
const response = await fetch(
  `http://localhost/gymnazo-christian-academy-teacher-side/backend/api/students/get-by-class.php?classId=${selectedClass.id}`,
  {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  }
);

// COMMENT OUT THIS BLOCK:
const mockStudents = [...];
setStudents(mockStudents);
```

**Expected API Response Format:**
```json
{
  "success": true,
  "students": [
    {
      "id": 1,
      "lastName": "Aldabon",
      "firstName": "Mark",
      "attendance": "Present",
      "grade": "-"
    }
  ]
}
```

### 3. **Toggle Favorite Status**
**Location:** `classManagementApp.jsx` - Line ~200

**Current State:** Optimistic UI update only  
**To Switch:** Uncomment the API call section

```jsx
// UNCOMMENT THIS BLOCK:
const response = await fetch(
  'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/classes/toggle-favorite.php',
  {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ classId })
  }
);
```

**Expected API Request Body:**
```json
{
  "classId": 1
}
```

**Expected API Response:**
```json
{
  "success": true,
  "message": "Favorite status updated",
  "isFavorited": true
}
```

## 📋 Required Backend API Endpoints

### Endpoint 1: Get Teacher's Classes
```
GET /backend/api/classes/get-teacher-classes.php
```

**Purpose:** Fetch all classes assigned to the logged-in teacher

**Authentication:** Session-based (cookies)

**Response:**
```json
{
  "success": true,
  "classes": [
    {
      "id": 1,
      "grade": "Grade 6",
      "section": "Section A",
      "subject": "Mathematics",
      "isFavorited": true,
      "status": "active",
      "schedule": "MWF 8:00-9:00",
      "room": "Room 101",
      "studentCount": 25
    }
  ]
}
```

**Database Query Example:**
```sql
SELECT 
    c.ClassID as id,
    CONCAT('Grade ', gl.GradeLevelName) as grade,
    s.SectionName as section,
    sub.SubjectName as subject,
    IFNULL(f.IsFavorited, 0) as isFavorited,
    CASE 
        WHEN c.Status = 'pending' THEN 'pending'
        ELSE 'active'
    END as status,
    c.Schedule as schedule,
    c.Room as room,
    COUNT(DISTINCT sc.StudentID) as studentCount
FROM classes c
LEFT JOIN section s ON c.SectionID = s.SectionID
LEFT JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
LEFT JOIN subjects sub ON c.SubjectID = sub.SubjectID
LEFT JOIN student_classes sc ON c.ClassID = sc.ClassID
LEFT JOIN class_favorites f ON c.ClassID = f.ClassID AND f.TeacherID = ?
WHERE c.TeacherID = ?
GROUP BY c.ClassID
ORDER BY gl.GradeLevelName, s.SectionName;
```

### Endpoint 2: Get Students by Class
```
GET /backend/api/students/get-by-class.php?classId={id}
```

**Purpose:** Fetch all students enrolled in a specific class

**Authentication:** Session-based (cookies)

**Query Parameters:**
- `classId` (required): The ID of the class

**Response:**
```json
{
  "success": true,
  "students": [
    {
      "id": 1,
      "lastName": "Aldabon",
      "firstName": "Mark",
      "middleName": "Santos",
      "attendance": "Present",
      "grade": "85",
      "studentNumber": "2024-00001",
      "email": "mark.aldabon@example.com"
    }
  ]
}
```

**Database Query Example:**
```sql
SELECT 
    st.StudentID as id,
    p.LastName as lastName,
    p.FirstName as firstName,
    p.MiddleName as middleName,
    COALESCE(a.Status, 'Present') as attendance,
    COALESCE(g.Grade, '-') as grade,
    st.StudentNumber as studentNumber,
    p.Email as email
FROM student_classes sc
JOIN students st ON sc.StudentID = st.StudentID
JOIN profile p ON st.ProfileID = p.ProfileID
LEFT JOIN attendance a ON st.StudentID = a.StudentID 
    AND a.ClassID = sc.ClassID 
    AND a.Date = CURDATE()
LEFT JOIN grades g ON st.StudentID = g.StudentID 
    AND g.ClassID = sc.ClassID
WHERE sc.ClassID = ?
ORDER BY p.LastName, p.FirstName;
```

### Endpoint 3: Toggle Favorite Status
```
POST /backend/api/classes/toggle-favorite.php
```

**Purpose:** Toggle the favorite status of a class for the logged-in teacher

**Authentication:** Session-based (cookies)

**Request Body:**
```json
{
  "classId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Favorite status updated",
  "isFavorited": true
}
```

**Database Query Example:**
```sql
-- Check if favorite exists
SELECT IsFavorited 
FROM class_favorites 
WHERE ClassID = ? AND TeacherID = ?;

-- If exists, toggle it
UPDATE class_favorites 
SET IsFavorited = NOT IsFavorited 
WHERE ClassID = ? AND TeacherID = ?;

-- If not exists, insert it
INSERT INTO class_favorites (ClassID, TeacherID, IsFavorited) 
VALUES (?, ?, 1);
```

## 🛠️ Step-by-Step Integration

### Step 1: Create Database Tables (if not exists)

```sql
-- Favorites table
CREATE TABLE IF NOT EXISTS class_favorites (
    FavoriteID INT PRIMARY KEY AUTO_INCREMENT,
    ClassID INT NOT NULL,
    TeacherID INT NOT NULL,
    IsFavorited BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ClassID) REFERENCES classes(ClassID),
    FOREIGN KEY (TeacherID) REFERENCES teachers(id),
    UNIQUE KEY unique_class_teacher (ClassID, TeacherID)
);
```

### Step 2: Create Backend API Files

Create these three PHP files in `backend/api/`:

1. `classes/get-teacher-classes.php`
2. `students/get-by-class.php`
3. `classes/toggle-favorite.php`

### Step 3: Test API Endpoints

Use Postman or curl to test each endpoint:

```bash
# Test get classes
curl -X GET http://localhost/backend/api/classes/get-teacher-classes.php \
  --cookie "PHPSESSID=your_session_id"

# Test get students
curl -X GET "http://localhost/backend/api/students/get-by-class.php?classId=1" \
  --cookie "PHPSESSID=your_session_id"

# Test toggle favorite
curl -X POST http://localhost/backend/api/classes/toggle-favorite.php \
  -H "Content-Type: application/json" \
  -d '{"classId":1}' \
  --cookie "PHPSESSID=your_session_id"
```

### Step 4: Switch Frontend to Use API

In `classManagementApp.jsx`:

1. **Find the comment:** `// 🔌 DATABASE FETCH - UNCOMMENT FOR PRODUCTION/DEVELOPMENT`
2. **Uncomment** the fetch code block
3. **Comment out** the mock data block
4. **Save** the file
5. **Test** in browser

### Step 5: Update API URLs for Production

Before deployment, update the base URL:

```jsx
// Development
const API_BASE_URL = 'http://localhost/gymnazo-christian-academy-teacher-side';

// Production
const API_BASE_URL = 'https://your-production-domain.com';

// Then use:
fetch(`${API_BASE_URL}/backend/api/classes/get-teacher-classes.php`)
```

## ✨ New Features Added

### 1. **Clickable Star Icons**
- Click star to toggle favorite status
- Optimistic UI updates (instant feedback)
- Persists to database when API is connected

### 2. **Loading States**
- Shows spinner while fetching data
- Prevents user interaction during loads
- Better UX

### 3. **Error Handling**
- Displays error messages to users
- Falls back gracefully on API failures
- Logs errors to console for debugging

### 4. **Refresh Button**
- Manual data refresh capability
- Useful after external changes
- Located in header area

### 5. **Statistics**
- Shows total, present, and absent student counts
- Updates in real-time based on data
- Visible in class details header

### 6. **Export to CSV**
- Export student roster
- Includes all visible columns
- Automatic file naming

### 7. **Print Functionality**
- Print-friendly layouts
- Browser's native print dialog
- Clean output

### 8. **Enhanced Search**
- Now searches across more fields
- Includes subject names
- Case-insensitive

## 🔧 Configuration Options

### Environment Variables (Optional)

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost/gymnazo-christian-academy-teacher-side
VITE_API_TIMEOUT=5000
```

Use in code:

```jsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

### Timeout Configuration

Add timeout to fetch calls:

```jsx
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

fetch(url, {
  signal: controller.signal,
  ...otherOptions
});
```

## 🚨 Common Issues & Solutions

### Issue 1: CORS Errors
**Problem:** Browser blocks API requests

**Solution:** Update `backend/config/cors.php`:
```php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
```

### Issue 2: Session Not Working
**Problem:** Session data not available in API

**Solution:** Ensure `session_start()` in every API file:
```php
<?php
session_start();
// ... rest of code
```

### Issue 3: Empty Response
**Problem:** API returns empty data

**Solution:** Check:
1. Teacher is logged in
2. Teacher has classes assigned
3. Database query is correct
4. Session contains teacher ID

### Issue 4: Favorites Not Saving
**Problem:** Star toggle doesn't persist

**Solution:** 
1. Ensure `class_favorites` table exists
2. Check API endpoint is working
3. Verify teacher ID in session
4. Uncomment the API call in frontend

## 📊 Testing Checklist

- [ ] Classes load from database
- [ ] Students load for selected class
- [ ] Star toggle works and persists
- [ ] Search filters results correctly
- [ ] Filter dropdown works
- [ ] Loading spinner shows during fetch
- [ ] Error messages display on failure
- [ ] Refresh button reloads data
- [ ] Export CSV downloads file
- [ ] Print opens dialog
- [ ] Navigation works between pages
- [ ] Back button returns to list
- [ ] Statistics show correct counts
- [ ] Responsive on mobile
- [ ] Session persists across pages

## 🎓 Development vs Production

### Development Mode
```jsx
// Use localhost
const API_URL = 'http://localhost/backend/api';

// Keep mock data as fallback
// Show detailed error messages
// Log to console
```

### Production Mode
```jsx
// Use production URL
const API_URL = 'https://api.yourschool.com';

// Remove mock data
// Show user-friendly errors
// Disable console logs
```

## 📝 Quick Reference

### To Switch to Database:
1. Find `// 🔌 DATABASE FETCH` comments
2. Uncomment API code
3. Comment out mock data
4. Test endpoints
5. Deploy

### To Switch Back to Mock:
1. Comment out API code
2. Uncomment mock data
3. Test locally

---

**Ready to deploy!** 🚀

Your application now works with both mock data (for development) and real database (for production). Simply uncomment the marked sections when ready!
