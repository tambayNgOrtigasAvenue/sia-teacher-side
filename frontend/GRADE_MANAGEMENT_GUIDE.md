# Grade Management System Guide

## Overview

This guide covers the complete **Grade Management System** that allows teachers to input, edit, and view student grades across multiple quarters.

---

## System Architecture

### File Structure

```
frontend/src/components/
├── pages/
│   ├── classManagementApp.jsx    # Main state manager
│   ├── myClassesPage.jsx         # Class list view
│   ├── classDetailsPage.jsx      # Student roster view
│   └── classGradesPage.jsx       # Grade table view (NEW)
└── modals/
    └── inputGradeModal.jsx        # Grade input modal (NEW)
```

---

## Component Responsibilities

### 1. **classManagementApp.jsx** (Main Controller)

**Purpose:** Central state manager for the entire class management application

**Key Responsibilities:**
- Manages navigation between pages (classList, classDetails, classGrades)
- Stores all student data with grades in state
- Controls modal visibility for grade input
- Handles grade saving and state updates

**State Variables:**
```javascript
const [currentView, setCurrentView] = useState('classList');
const [selectedClass, setSelectedClass] = useState(null);
const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
const [studentToGrade, setStudentToGrade] = useState(null);
const [students, setStudents] = useState([/* with grades object */]);
```

**Key Functions:**
- `handleViewClassDetails(classData)` - Navigate to student roster
- `handleViewClassGrades()` - Navigate to grades page
- `handleOpenGradeModal(studentData)` - Open grade input modal
- `handleSaveGrade(studentId, newGradeData)` - Save grade and update state
- `handleToggleFavorite(classId)` - Toggle favorite status

**Student Data Structure:**
```javascript
{
  id: 1,
  firstName: "John",
  lastName: "Doe",
  attendance: "Present",
  grade: "Grade 6",
  grades: {
    q1: 85,      // 1st quarter grade
    q2: 90,      // 2nd quarter grade
    q3: null,    // Not yet entered
    q4: null,    // Not yet entered
    final: null, // Final grade (can be calculated)
    remarks: "Good performance"
  }
}
```

---

### 2. **myClassesPage.jsx** (Class List)

**Purpose:** Display list of all classes with search and filter functionality

**Props Received:**
- `classes` - Array of class objects
- `loading` - Boolean loading state
- `error` - Error message string
- `onViewClassDetails` - Callback function to navigate to details
- `onToggleFavorite` - Callback to toggle favorite status

**User Actions:**
- Click on a class card → Navigate to `ClassDetailsPage`
- Click star icon → Toggle favorite status
- Search classes by grade, section, or subject
- Filter classes by status (All, Active, Pending)

---

### 3. **classDetailsPage.jsx** (Student Roster)

**Purpose:** Display list of students in selected class with attendance info

**Props Received:**
- `classData` - Selected class object
- `students` - Array of student objects
- `loading` - Boolean loading state
- `error` - Error message string
- `onBack` - Callback to navigate back to class list
- `onViewGrades` - Callback to navigate to grades page

**User Actions:**
- Click "Back" → Navigate to `MyClassesPage`
- Click "View Class Grade" → Navigate to `ClassGradesPage`
- Export student list to CSV
- Print student roster
- Search/filter students by name and attendance

---

### 4. **classGradesPage.jsx** (Grade Table) ⭐ NEW

**Purpose:** Display grade table with quarter grades for all students

**Props Received:**
- `classData` - Selected class object
- `students` - Array of students with grades
- `loading` - Boolean loading state
- `error` - Error message string
- `onBack` - Callback to navigate back to details
- `onInputGrade` - Callback to open grade input modal

**Features:**
- **Grade Table Columns:**
  - Name (Last, First format)
  - 1st Quarter
  - 2nd Quarter
  - 3rd Quarter
  - 4th Quarter
  - Final Grade
  - Remarks
  - Input Grade button

- **Search/Filter:** Search students by name
- **Actions:** Click "Input Grade" button → Opens modal for that student

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Name      │ 1st │ 2nd │ 3rd │ 4th │ Final │ Remarks │ Action│
├─────────────────────────────────────────────────────────────┤
│ Doe, John │ 85  │ 90  │  -  │  -  │   -   │ Good    │[Input]│
│ Smith, A. │ 88  │  -  │  -  │  -  │   -   │    -    │[Input]│
└─────────────────────────────────────────────────────────────┘
```

---

### 5. **inputGradeModal.jsx** (Grade Input Modal) ⭐ NEW

**Purpose:** Modal dialog for inputting or editing student grades

**Props Received:**
- `isOpen` - Boolean to control modal visibility
- `student` - Student object being graded
- `subject` - Subject name (e.g., "Mathematics")
- `allStudents` - Array of all students (for Save & Next)
- `onClose` - Callback to close modal
- `onSave` - Callback to save grade data

**Features:**

1. **Quarter Selector Dropdown**
   - Options: 1st Quarter, 2nd Quarter, 3rd Quarter, 4th Quarter
   - State variable: `selectedQuarter`

2. **Grade Input Field**
   - Type: Number (0-100)
   - Validates grade is entered before saving
   - Auto-populates if grade already exists

3. **Remarks Input Field**
   - Type: Textarea
   - Optional field for teacher comments

4. **Auto-Population**
   - When modal opens, checks if student already has a grade for selected quarter
   - Populates existing grade and remarks if available

5. **Button Actions:**

   a) **Cancel Button**
      - Closes modal without saving
      - Resets form state

   b) **Save Button**
      - Validates grade is entered
      - Calls `onSave(studentId, gradeData)`
      - Closes modal after saving

   c) **Save & Next Button** (Conditional)
      - Only shown if not the last student
      - Saves current grade
      - Auto-opens modal for next student
      - Closes modal if last student

**Grade Data Format Sent to Parent:**
```javascript
{
  q1: 85,              // Or q2, q3, q4 depending on selectedQuarter
  remarks: "Excellent" // Always includes remarks (can be empty string)
}
```

**Modal Styling:**
- Dark header (gray-800) with white text
- White body with form fields
- Light gray footer with action buttons
- Backdrop overlay (semi-transparent black)
- Centered on screen

---

## User Flow: Complete Grade Input Process

### Scenario: Teacher wants to input grades for Grade 6 Section A

**Step 1: View Classes**
```
My Classes Page
└─> Teacher sees: "Grade 6 - Section A - Mathematics"
└─> Teacher clicks on the class card
```

**Step 2: View Student Roster**
```
Class Details Page
├─> Shows header: "Grade 6 / Section A"
├─> Shows list of students with attendance
└─> Teacher clicks "View Class Grade" button
```

**Step 3: View Grade Table**
```
Class Grades Page
├─> Shows grade table with all students
├─> Columns: Name | 1st | 2nd | 3rd | 4th | Final | Remarks
├─> Teacher sees John Doe has 1st quarter: 85
└─> Teacher clicks "Input Grade" for John Doe
```

**Step 4: Input Grade via Modal**
```
Input Grade Modal Opens
├─> Shows: "Student Name: John Doe"
├─> Shows: "Subject: Mathematics"
├─> Teacher selects: "2nd Quarter" from dropdown
├─> Teacher enters: "90" in grade field
├─> Teacher enters: "Great improvement" in remarks
└─> Teacher clicks "Save & Next"
```

**Step 5: State Updates**
```
Behind the Scenes:
├─> handleSaveGrade() is called with:
│   ├─> studentId: 1
│   └─> newGradeData: { q2: 90, remarks: "Great improvement" }
├─> students state is updated via map()
├─> Modal closes automatically
└─> If "Save & Next" was clicked, modal reopens for next student
```

**Step 6: Verify Changes**
```
Back on Class Grades Page:
├─> John Doe's row now shows:
│   └─> Name: Doe, John | 1st: 85 | 2nd: 90 | 3rd: - | 4th: - | Final: - | Remarks: Great improvement
└─> Changes persist in state (no database save yet)
```

---

## State Management Deep Dive

### How Grades are Stored

**Initial State (No Grades):**
```javascript
{
  id: 1,
  firstName: "John",
  lastName: "Doe",
  grades: {
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    final: null,
    remarks: ""
  }
}
```

**After Inputting 1st Quarter Grade (85):**
```javascript
{
  id: 1,
  firstName: "John",
  lastName: "Doe",
  grades: {
    q1: 85,        // ← Updated
    q2: null,
    q3: null,
    q4: null,
    final: null,
    remarks: "Good work" // ← Updated
  }
}
```

**After Inputting 2nd Quarter Grade (90):**
```javascript
{
  id: 1,
  firstName: "John",
  lastName: "Doe",
  grades: {
    q1: 85,
    q2: 90,        // ← Updated
    q3: null,
    q4: null,
    final: null,
    remarks: "Great improvement" // ← Overwritten (not appended)
  }
}
```

### How handleSaveGrade Works

```javascript
const handleSaveGrade = (studentId, newGradeData) => {
  setStudents(prevStudents => 
    prevStudents.map(student => {
      if (student.id === studentId) {
        // Found the student to update
        return {
          ...student,              // Keep all existing properties
          grades: {
            ...student.grades,     // Keep existing grades (q1, q2, etc.)
            ...newGradeData        // Merge new grade data (overwrite specific quarter)
          }
        };
      }
      return student; // Return unchanged for other students
    })
  );
  
  handleCloseGradeModal(); // Close modal after save
};
```

**Example Update:**
- Current student grades: `{ q1: 85, q2: null, q3: null, q4: null, remarks: "Good" }`
- New grade data: `{ q2: 90, remarks: "Excellent" }`
- Result: `{ q1: 85, q2: 90, q3: null, q4: null, remarks: "Excellent" }`

---

## Navigation Flow

```
┌─────────────────────┐
│  My Classes Page    │  (currentView = 'classList')
│  (List of classes)  │
└──────────┬──────────┘
           │ Click class card
           ↓
┌─────────────────────┐
│ Class Details Page  │  (currentView = 'classDetails')
│ (Student roster)    │
└──────────┬──────────┘
           │ Click "View Class Grade"
           ↓
┌─────────────────────┐
│ Class Grades Page   │  (currentView = 'classGrades')
│ (Grade table)       │
└──────────┬──────────┘
           │ Click "Input Grade"
           ↓
┌─────────────────────┐
│ Input Grade Modal   │  (isGradeModalOpen = true)
│ (Grade input form)  │
└──────────┬──────────┘
           │ Click "Save" or "Save & Next"
           ↓
     [Grade saved to state]
           │
           └──> Modal closes, back to Grade table
```

---

## Save & Next Functionality

**Logic:**
1. Teacher clicks "Save & Next" in modal
2. Current student's grade is saved
3. System finds current student's index in `allStudents` array
4. System checks if there's a next student (`currentIndex + 1`)
5. If yes: Modal stays open, but updates to show next student
6. If no (last student): Modal closes automatically

**Code Implementation:**
```javascript
const handleSaveAndNext = () => {
  // Save current student's grade
  onSave(student.id, gradeData);

  // Find next student
  const currentIndex = allStudents.findIndex(s => s.id === student.id);
  const nextStudent = allStudents[currentIndex + 1];

  if (nextStudent) {
    // Continue to next student (parent updates studentToGrade)
  } else {
    // Close modal (last student)
    onClose();
  }
};
```

**Button Visibility:**
- "Save & Next" button is **hidden** for the last student
- Only "Save" and "Cancel" buttons appear for last student

---

## Important Notes

### Data Persistence
- ⚠️ **All data is stored in React state only**
- No database integration yet
- Grades persist as long as the page is not refreshed
- Refreshing the page will reset all data to mock defaults

### Future Database Integration Points

**When connecting to backend:**

1. **Load Students with Grades (classManagementApp.jsx)**
   ```javascript
   useEffect(() => {
     if (selectedClass && currentView === 'classGrades') {
       // Replace mock data fetch with:
       fetch(`/api/students/${selectedClass.id}/grades`)
         .then(res => res.json())
         .then(data => setStudents(data));
     }
   }, [selectedClass, currentView]);
   ```

2. **Save Grade (handleSaveGrade function)**
   ```javascript
   const handleSaveGrade = async (studentId, newGradeData) => {
     // Add API call before state update:
     await fetch(`/api/students/${studentId}/grades`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(newGradeData)
     });
     
     // Then update state (for immediate UI update)
     setStudents(/* ... */);
   };
   ```

---

## Styling & Responsiveness

**Key Tailwind Classes Used:**

**Modal:**
- `fixed inset-0` - Full screen overlay
- `z-50` - High z-index to appear above all content
- `bg-black bg-opacity-50` - Semi-transparent backdrop

**Grade Table:**
- `grid grid-cols-12` - 12-column grid layout
- `overflow-x-auto` - Horizontal scroll on small screens
- `min-w-[800px]` - Minimum width to prevent squishing

**Buttons:**
- `rounded-full` - Pill-shaped buttons
- `hover:bg-amber-500` - Color change on hover
- `transition-colors` - Smooth color transitions

**Responsive Behavior:**
- Tables scroll horizontally on mobile
- Modal is centered and responsive
- Forms stack vertically on small screens

---

## Testing Checklist

### Manual Testing Steps

**1. Navigation Flow**
- [ ] Can navigate from Classes → Details → Grades
- [ ] Back buttons work correctly
- [ ] Breadcrumbs display current location

**2. Grade Input**
- [ ] Modal opens when clicking "Input Grade"
- [ ] Student name displays correctly in modal
- [ ] Quarter dropdown works
- [ ] Grade input accepts numbers 0-100
- [ ] Remarks field accepts text
- [ ] Cancel button closes modal without saving

**3. Grade Saving**
- [ ] "Save" button saves grade and closes modal
- [ ] Saved grade appears in table immediately
- [ ] Can edit existing grade (auto-populates in modal)
- [ ] Remarks are saved and displayed

**4. Save & Next**
- [ ] "Save & Next" saves and moves to next student
- [ ] Button is hidden for last student
- [ ] Modal closes after last student

**5. Search & Filter**
- [ ] Can search students by name on grades page
- [ ] Search updates table in real-time

**6. Edge Cases**
- [ ] Modal prevents submission without grade value
- [ ] Handles empty student list gracefully
- [ ] Works with single student in class

---

## Common Issues & Solutions

### Issue: Modal doesn't close after saving
**Solution:** Make sure `handleCloseGradeModal()` is called in `handleSaveGrade()`

### Issue: Grades don't persist when navigating back
**Solution:** Verify that `students` state is in the parent component (`classManagementApp.jsx`), not in individual pages

### Issue: "Save & Next" doesn't work
**Solution:** Ensure `allStudents` prop is passed to `InputGradeModal` and is the complete student array

### Issue: Edited grade shows old value
**Solution:** Check that `useEffect` in modal has correct dependencies: `[student, selectedQuarter]`

---

## Future Enhancements

**Potential Features:**
1. **Auto-calculate Final Grade**
   - Calculate average of q1, q2, q3, q4
   - Display in "Final Grade" column

2. **Grade History**
   - Track when grades were last updated
   - Show edit history

3. **Bulk Grade Input**
   - Upload grades via CSV
   - Copy-paste from Excel

4. **Grade Analytics**
   - Class average per quarter
   - Highest/lowest grades
   - Grade distribution chart

5. **Export Grades**
   - Export grade table to PDF
   - Generate report cards

6. **Remarks Templates**
   - Pre-defined remarks dropdown
   - Quick select common feedback

---

## Quick Reference

**Key Props Flow:**
```
classManagementApp
├─> MyClassesPage (classes, onViewClassDetails)
├─> ClassDetailsPage (classData, students, onViewGrades)
├─> ClassGradesPage (classData, students, onInputGrade)
└─> InputGradeModal (isOpen, student, onSave, onClose)
```

**Key State Variables:**
```javascript
currentView        // 'classList' | 'classDetails' | 'classGrades'
selectedClass      // { id, grade, section, subject }
students           // [{ id, firstName, lastName, grades: {...} }]
isGradeModalOpen   // true | false
studentToGrade     // { id, firstName, lastName, ... }
```

**Key Functions:**
```javascript
handleViewClassDetails(classData)     // Navigate to details
handleViewClassGrades()               // Navigate to grades
handleOpenGradeModal(studentData)     // Open modal
handleSaveGrade(studentId, gradeData) // Save grade
handleCloseGradeModal()               // Close modal
```

---

## Summary

The Grade Management System provides a complete solution for teachers to:
- ✅ View all their classes
- ✅ Navigate to student rosters
- ✅ Access grade tables by class
- ✅ Input/edit grades via modal interface
- ✅ Support quarter-based grading (1st, 2nd, 3rd, 4th)
- ✅ Add remarks for students
- ✅ Use "Save & Next" for efficient data entry

All data is currently managed in React state with clear integration points marked for future database connectivity.

