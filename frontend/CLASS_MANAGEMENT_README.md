# 📚 Dynamic Multi-Page Class Management Application

## Overview

This is a complete, production-ready React application for managing teacher classes and student rosters. The application demonstrates advanced React patterns including state management, prop drilling, dynamic navigation, and component composition.

## 🏗️ Architecture

### Component Hierarchy

```
ClassManagementApp.jsx (Main Controller)
├── MyClassesPage.jsx (Class List Container)
│   ├── HeaderPage.jsx (Static Header)
│   ├── SearchBarWithFilter.jsx (Reusable Control)
│   └── ViewMyClasses.jsx (Presentational List)
│       └── ClassRow (Internal Component)
└── ClassDetailsPage.jsx (Student List Container)
    ├── SearchBarWithFilter.jsx (Reusable Control)
    └── StudentList (Internal Component)
        └── StudentRow (Internal Component)
```

## 📁 File Structure

```
src/components/
├── pages/
│   ├── classManagementApp.jsx     # Main app controller
│   ├── myClassesPage.jsx           # Class list page
│   └── classDetailsPage.jsx        # Student details page
└── common/dashboard/my-classes/
    ├── headerPage.jsx              # Static header component
    ├── searchBarWithFilter.jsx     # Reusable search/filter
    ├── viewMyClasses.jsx           # Class list renderer
    └── icons.jsx                   # Icon library
```

## 🎯 Key Features

### 1. **Dynamic Navigation**
- Clicking "View Class Details" navigates to the class details page
- Back button returns to the class list
- State-based routing (no external router required)

### 2. **Smart Filtering & Search**
- **Class List**: Filter by All/Favorited/Pending
- **Student List**: Filter by All/Present/Absent
- Real-time search across relevant fields
- Combined filter + search logic

### 3. **Reusable Components**
- `SearchBarWithFilter` adapts to different contexts via props
- Consistent styling via Tailwind CSS
- Icon library for maintainability

### 4. **Mock Data Ready for API Integration**
- Structured data models
- Easy to replace with API calls
- Proper separation of concerns

## 🚀 How to Use

### Integration into Existing App

Add to your main `App.jsx`:

```jsx
import ClassManagementApp from './components/pages/classManagementApp.jsx';

// In your route configuration:
<Route path="/teacher-dashboard/my-classes" element={<ClassManagementApp />} />
```

Or use it standalone:

```jsx
import ClassManagementApp from './components/pages/classManagementApp.jsx';

function App() {
  return <ClassManagementApp />;
}
```

## 📊 Data Flow Explained

### Navigation Flow

```
User Action: Click "View Class Details" button
    ↓
Triggers: onViewClassDetails(classData) callback
    ↓
Updates State in ClassManagementApp:
    - setSelectedClass(classData)
    - setCurrentView('classDetails')
    ↓
React Re-renders: Shows ClassDetailsPage
    ↓
User Action: Click "Back" button
    ↓
Triggers: onBack() callback
    ↓
Updates State in ClassManagementApp:
    - setSelectedClass(null)
    - setCurrentView('classList')
    ↓
React Re-renders: Shows MyClassesPage
```

### Data Filtering Flow

```
User Types in Search Bar
    ↓
Updates: searchTerm state (local to page)
    ↓
Triggers: filteredClasses/filteredStudents re-calculation
    ↓
React Re-renders: Updated list displayed
```

## 🔧 Component Details

### ClassManagementApp.jsx (Main Controller)

**Responsibilities:**
- Manages global navigation state (`currentView`, `selectedClass`)
- Defines mock data (`mockClasses`, `mockStudents`)
- Provides navigation callbacks
- Conditionally renders pages

**Key State:**
```jsx
const [currentView, setCurrentView] = useState('classList');
const [selectedClass, setSelectedClass] = useState(null);
```

**Key Functions:**
```jsx
handleViewClassDetails(classData) // Navigate to details
handleBackToList()                 // Navigate back to list
```

### MyClassesPage.jsx (Container)

**Responsibilities:**
- Manages search/filter state for classes
- Applies filtering logic
- Composes child components
- Passes callbacks down

**Props Received:**
- `classes`: Array of class objects
- `onViewClassDetails`: Navigation callback

**Local State:**
- `searchTerm`: Search input value
- `filterOption`: Current filter selection

### ClassDetailsPage.jsx (Container)

**Responsibilities:**
- Manages search/filter state for students
- Applies filtering logic
- Renders student list
- Provides back navigation

**Props Received:**
- `classData`: Selected class object
- `students`: Array of student objects
- `onBack`: Back navigation callback

**Local State:**
- `searchTerm`: Search input value
- `filterOption`: Current filter selection

### SearchBarWithFilter.jsx (Reusable)

**Responsibilities:**
- Renders search input
- Renders filter dropdown
- Adapts options based on `filterType` prop

**Props:**
- `searchTerm`: Current search value
- `onSearchChange`: Search change callback
- `filterOption`: Current filter value
- `onFilterChange`: Filter change callback
- `filterType`: 'classes' or 'students'

**Adaptability:**
```jsx
filterType === 'classes' 
  → Options: All Classes, Favorited, Pending

filterType === 'students'
  → Options: All Students, Present, Absent
```

### ViewMyClasses.jsx (Presentational)

**Responsibilities:**
- Renders class list header
- Maps over classes to render rows
- Handles empty state

**Props:**
- `classes`: Filtered array of classes
- `onViewClassDetails`: Callback for navigation

**Key Feature:**
```jsx
<button onClick={() => onViewClassDetails(classData)}>
  View Class Details
</button>
```

### icons.jsx (Library)

**Exports:**
- `FilterIcon`: From lucide-react Filter
- `SearchIcon`: From lucide-react Search
- `StarIcon`: From lucide-react Star (pre-styled)

## 🔄 Converting to API Data

### Step 1: Replace Mock Data with API Calls

In `ClassManagementApp.jsx`:

```jsx
import { useState, useEffect } from 'react';

export default function ClassManagementApp() {
  const [mockClasses, setMockClasses] = useState([]);
  const [mockStudents, setMockStudents] = useState([]);
  
  // Fetch classes on mount
  useEffect(() => {
    fetch('http://localhost/backend/api/classes/get-teacher-classes.php', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setMockClasses(data.classes))
      .catch(error => console.error('Error fetching classes:', error));
  }, []);
  
  // Fetch students when class is selected
  useEffect(() => {
    if (selectedClass) {
      fetch(`http://localhost/backend/api/students/get-by-class.php?classId=${selectedClass.id}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => setMockStudents(data.students))
        .catch(error => console.error('Error fetching students:', error));
    }
  }, [selectedClass]);
  
  // Rest of component stays the same
}
```

### Step 2: Update Data Structure

Ensure your API returns data in the expected format:

**Classes API Response:**
```json
{
  "success": true,
  "classes": [
    {
      "id": 1,
      "grade": "Grade 6",
      "section": "Section A",
      "isFavorited": true,
      "status": "active"
    }
  ]
}
```

**Students API Response:**
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

## 🎨 Styling Customization

All components use Tailwind CSS. Key classes:

- **Amber theme**: `bg-amber-300`, `bg-amber-400`, `hover:bg-amber-500`
- **Status lozenges**: `bg-green-100 text-green-800` (Present), `bg-red-100 text-red-800` (Absent)
- **Cards**: `rounded-2xl shadow-lg`
- **Buttons**: `rounded-full py-2 px-5`

To customize colors, update Tailwind classes throughout components.

## 🧪 Testing the Application

### Test Navigation:
1. Start on "My Classes" page
2. Click "View Class Details" on any active class
3. Observe navigation to details page with correct data
4. Click back button
5. Confirm return to class list

### Test Filtering:
1. Select "Favorited" filter → Should show only starred classes
2. Select "Pending" filter → Should show only pending classes
3. Type in search → Should filter by grade/section

### Test Student Filtering:
1. Navigate to class details
2. Select "Present" filter → Should show only present students
3. Select "Absent" filter → Should show only absent students
4. Type in search → Should filter by name

## 💡 Best Practices Demonstrated

1. **Single Responsibility Principle**: Each component has one clear purpose
2. **Props vs State**: Proper use of lifting state up
3. **Controlled Components**: All inputs are controlled via state
4. **Composition**: Components built from smaller, reusable pieces
5. **Comments**: Comprehensive JSDoc-style documentation
6. **Error Handling**: Empty states and no-results messages
7. **Responsive Design**: Mobile-friendly with Tailwind responsive classes

## 🚧 Future Enhancements

- [ ] Add loading states during API calls
- [ ] Implement error boundaries
- [ ] Add pagination for large lists
- [ ] Implement sorting functionality
- [ ] Add animations for page transitions
- [ ] Save filter preferences to localStorage
- [ ] Add bulk actions for students
- [ ] Implement real-time updates with WebSockets

## 📝 License

This component library is part of the Gymnazo Christian Academy Teacher Management System.

---

**Built with ❤️ using React, Tailwind CSS, and Lucide Icons**
