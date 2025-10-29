# Announcement System Guide

## Overview

This guide covers the complete **Announcement System** that displays school announcements in a responsive grid layout with search functionality.

---

## System Architecture

### File Structure

```
frontend/src/components/
├── pages/
│   ├── announcementContainer.jsx  # Container with state management
│   └── announcementPage.jsx       # Presentation component
├── cards/
│   └── announcementCard.jsx       # Individual announcement card
└── navigation/
    └── navBar.jsx                  # Top navigation (optional)
```

---

## Component Responsibilities

### 1. **announcementContainer.jsx** (State Manager)

**Purpose:** Container component that manages announcement data and loading states

**State Variables:**
```javascript
const [announcements, setAnnouncements] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

**Key Responsibilities:**
- Fetches announcement data (currently using mock data)
- Manages loading and error states
- Passes data down to AnnouncementPage

**Mock Data Structure:**
```javascript
{
  id: 1,
  title: "Suspension of Classes",
  description: "Copy that provides context about what is being shown...",
  imageUrl: "https://placehold.co/600x400/333/FFF?text=Enrollment",
  facebookUrl: "https://facebook.com"
}
```

**Database Integration Point:**
```javascript
// Replace mock data with API call:
useEffect(() => {
  fetch('/api/announcements')
    .then(res => res.json())
    .then(data => {
      setAnnouncements(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
}, []);
```

---

### 2. **announcementPage.jsx** (Presentation Component)

**Purpose:** Displays announcements in a grid layout with search functionality

**Props Received:**
- `announcements` - Array of announcement objects

**State Variables:**
```javascript
const [searchTerm, setSearchTerm] = useState('');
```

**Features:**

1. **Page Header**
   - "ANNOUNCEMENT" label (gray, uppercase)
   - "Updated Announcement" heading (with amber highlight)

2. **Search Bar**
   - Uses `SearchBarWithFilter` component
   - `filterType="announcements"` (hides filter dropdown)
   - Searches both title and description

3. **Responsive Grid**
   - 1 column on mobile
   - 2 columns on tablet (md breakpoint)
   - 3 columns on desktop (lg breakpoint)
   - Gap between cards: `gap-6`

4. **Empty State**
   - Shows when no announcements match search
   - Helpful message to adjust search

**Filtering Logic:**
```javascript
const filteredAnnouncements = announcements.filter((announcement) => {
  if (searchTerm === '') return true;

  const matchesTitle = announcement.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  
  const matchesDescription = announcement.description
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  return matchesTitle || matchesDescription;
});
```

---

### 3. **announcementCard.jsx** (Card Component)

**Purpose:** Renders a single announcement card with image and actions

**Props Received:**
- `announcement` - Single announcement object

**UI Structure:**

```
┌─────────────────────────────┐
│  [Image with NEW badge]     │
├─────────────────────────────┤
│  Suspension of Classes      │ ← Title
│                             │
│  Copy that provides...      │ ← Description
│                             │
├─────────────────────────────┤
│ [Read More] [View on FB]    │ ← Action Buttons
└─────────────────────────────┘
```

**Features:**

1. **Image Section**
   - Full-width image (h-48)
   - Object-cover for proper aspect ratio
   - "NEW" badge overlay (top-left, amber-400)

2. **Content Section**
   - Title: `text-xl font-semibold`
   - Description: `text-sm text-gray-600`
   - Line clamp (shows 3 lines max)
   - Flex-grow to push buttons to bottom

3. **Action Buttons**
   - **Read More**: Gray button (future: show modal/detail view)
   - **View on Facebook**: Amber button, opens in new tab

**Styling:**
```javascript
className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
```

---

## Integration with Existing App

### Current Setup (React Router)

The announcement system integrates with the existing React Router structure:

```javascript
// App.jsx
<Route path="announcements" element={<AnnouncementContainer />} />
```

**Navigation Flow:**
1. User clicks "Announcements" in sidebar
2. Router loads `/teacher-dashboard/announcements`
3. `AnnouncementContainer` renders (fetches data)
4. `AnnouncementPage` displays announcements
5. `AnnouncementCard` renders each item

---

## SearchBarWithFilter Integration

The announcement page uses the existing `SearchBarWithFilter` component:

**Key Configuration:**
```javascript
<SearchBarWithFilter
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  filterOption="All"
  onFilterChange={() => {}}
  filterType="announcements"  // ← Important: hides filter dropdown
/>
```

**Why `filterType="announcements"`?**
- Announcements don't need filtering by status
- Only search functionality is needed
- Filter dropdown is conditionally hidden when filterType is "announcements"

---

## User Flow

### Scenario: Teacher views announcements

**Step 1: Navigate to Announcements**
```
Dashboard Sidebar
└─> Teacher clicks "Announcements"
└─> Router navigates to /teacher-dashboard/announcements
```

**Step 2: Data Loading**
```
AnnouncementContainer
├─> Shows loading spinner
├─> Fetches mock data (500ms delay)
└─> Passes data to AnnouncementPage
```

**Step 3: View Announcements**
```
AnnouncementPage
├─> Displays "Updated Announcement" header
├─> Shows search bar
└─> Renders 6 announcement cards in grid (3 columns)
```

**Step 4: Search Announcements**
```
Teacher types "Enrollment" in search
├─> filteredAnnouncements updates in real-time
├─> Grid shows only matching cards
└─> "Enrollment Ongoing" card remains visible
```

**Step 5: Take Action**
```
Teacher clicks "View on Facebook"
├─> Opens Facebook link in new tab
└─> Original page remains open
```

---

## Responsive Behavior

### Mobile (< 768px)
- 1 column grid
- Cards stack vertically
- Full-width search bar
- Touch-friendly buttons

### Tablet (768px - 1024px)
- 2 column grid
- Side-by-side cards
- Optimized spacing

### Desktop (> 1024px)
- 3 column grid
- Maximum visual density
- Hover effects on cards

**Responsive Classes:**
```javascript
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

---

## State Management

### Data Flow

```
AnnouncementContainer (manages state)
        ↓
  [announcements array]
        ↓
AnnouncementPage (filters & displays)
        ↓
  [filteredAnnouncements]
        ↓
AnnouncementCard.map() (renders each)
```

### Search State

**Local to AnnouncementPage:**
```javascript
const [searchTerm, setSearchTerm] = useState('');
```

**Why local?**
- Search state doesn't need to be global
- Resets automatically when navigating away
- Simpler component structure

---

## Styling Details

### Color Scheme

**Background Colors:**
- Page: `bg-gray-50` (light gray)
- Cards: `bg-white` (pure white)
- Badge: `bg-amber-400` (golden yellow)

**Text Colors:**
- Headings: `text-gray-900` (dark gray)
- Labels: `text-gray-500` (medium gray)
- Description: `text-gray-600` (gray)

**Button Colors:**
- Read More: `bg-gray-100` → `hover:bg-gray-200`
- Facebook: `bg-amber-400` → `hover:bg-amber-500`

### Border Radius

- Cards: `rounded-2xl` (large rounded corners)
- Buttons: `rounded-full` (pill-shaped)

### Shadows

- Default: `shadow-lg`
- Hover: `shadow-xl`
- Transition: `transition-shadow duration-300`

---

## Future Enhancements

### 1. Read More Functionality

**Current:** Console log only
**Future:** Open modal with full announcement

```javascript
const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

// In card:
onClick={() => {
  setSelectedAnnouncement(announcement);
  setIsModalOpen(true);
}}
```

### 2. Announcement Categories

**Add filtering by type:**
```javascript
{
  id: 1,
  title: "...",
  category: "academic" | "event" | "urgent",
  // ...
}
```

### 3. Date Display

**Show when posted:**
```javascript
{
  id: 1,
  title: "...",
  postedAt: "2025-10-15T10:30:00Z",
  // ...
}

// Display:
<p className="text-xs text-gray-400">
  Posted {formatDate(announcement.postedAt)}
</p>
```

### 4. Pagination

**For many announcements:**
```javascript
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 9;
const paginatedAnnouncements = filteredAnnouncements.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
```

### 5. Like/Save Feature

**Allow teachers to bookmark:**
```javascript
{
  id: 1,
  title: "...",
  isSaved: false,
  // ...
}

// In card:
<button onClick={() => handleToggleSave(announcement.id)}>
  {announcement.isSaved ? <BookmarkFilled /> : <BookmarkOutline />}
</button>
```

---

## Database Integration

### Backend API Endpoints Needed

**1. Get All Announcements**
```php
// GET /api/announcements
// Returns: array of announcement objects
```

**2. Get Single Announcement**
```php
// GET /api/announcements/:id
// Returns: single announcement object
```

**3. Create Announcement (Admin)**
```php
// POST /api/announcements
// Body: { title, description, imageUrl, facebookUrl }
```

**4. Update Announcement (Admin)**
```php
// PUT /api/announcements/:id
// Body: { title, description, imageUrl, facebookUrl }
```

**5. Delete Announcement (Admin)**
```php
// DELETE /api/announcements/:id
```

### Database Schema

**announcements table:**
```sql
CREATE TABLE announcements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500),
  facebook_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_published BOOLEAN DEFAULT TRUE
);
```

### Update Container to Use API

```javascript
useEffect(() => {
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/announcements');
      
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }
      
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchAnnouncements();
}, []);
```

---

## Testing Checklist

### Visual Testing
- [ ] Page header displays correctly
- [ ] Search bar appears and functions
- [ ] Cards display in proper grid (1/2/3 columns)
- [ ] Images load properly
- [ ] Buttons are styled correctly
- [ ] Hover effects work on cards

### Functional Testing
- [ ] Search filters announcements by title
- [ ] Search filters announcements by description
- [ ] Search is case-insensitive
- [ ] Empty state shows when no results
- [ ] "View on Facebook" opens in new tab
- [ ] Loading spinner shows initially
- [ ] Error message displays on API failure

### Responsive Testing
- [ ] Mobile: 1 column layout
- [ ] Tablet: 2 column layout
- [ ] Desktop: 3 column layout
- [ ] Search bar is full-width on mobile
- [ ] Buttons stack properly on small screens
- [ ] Images scale appropriately

### Edge Cases
- [ ] No announcements (empty array)
- [ ] Very long titles (text wrapping)
- [ ] Very long descriptions (line clamping)
- [ ] Missing images (broken link)
- [ ] Special characters in search
- [ ] Rapid typing in search (debouncing not needed yet)

---

## Common Issues & Solutions

### Issue: Cards not displaying in grid
**Solution:** Check that parent div has `grid` class and proper `grid-cols-*` classes

### Issue: Search not working
**Solution:** Verify `searchTerm` state is being updated by `onSearchChange` callback

### Issue: Images not loading
**Solution:** Check imageUrl format and ensure CORS is enabled if loading from external source

### Issue: "NEW" badge not visible
**Solution:** Verify parent image div has `relative` class and badge has `absolute` positioning

### Issue: Buttons not side-by-side
**Solution:** Ensure button container has `flex gap-2` classes

---

## Performance Considerations

### Image Optimization

**Current:** Using placeholder images
**Production:** Use optimized images

```javascript
// Recommended image specs:
// - Size: 600x400px
// - Format: WebP (with JPG fallback)
// - Compression: 80% quality
// - Lazy loading: implemented by default in modern browsers
```

### Search Performance

**Current:** Filters on every keystroke
**Future:** Add debouncing for large datasets

```javascript
import { useState, useEffect } from 'react';

const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 300);

  return () => clearTimeout(timer);
}, [searchTerm]);

// Use debouncedSearch for filtering
```

---

## Quick Reference

### Props Flow
```
AnnouncementContainer
└─> AnnouncementPage (announcements)
    └─> AnnouncementCard (announcement)
```

### Key Files
- Container: `announcementContainer.jsx`
- Page: `announcementPage.jsx`
- Card: `announcementCard.jsx`
- Route: `App.jsx` → `/teacher-dashboard/announcements`

### Key Classes
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Card: `bg-white rounded-2xl shadow-lg`
- Button: `rounded-full transition-colors`

---

## Summary

The Announcement System provides:
- ✅ Clean, card-based UI matching design specs
- ✅ Responsive grid layout (1/2/3 columns)
- ✅ Real-time search functionality
- ✅ Loading and error states
- ✅ Integration with existing React Router structure
- ✅ Clear database integration points
- ✅ Component-based architecture for maintainability

All functionality is working with mock data and ready for backend integration.
