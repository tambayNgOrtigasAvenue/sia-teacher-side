# Help & Support System Guide

## Overview

This guide covers the complete **Help & Support System** that provides teachers with a FAQ section, question submission form, and contact information.

---

## System Architecture

### File Structure

```
frontend/src/components/
├── pages/
│   └── helpPage.jsx                    # Main help page container
├── common/dashboard/help/
│   ├── faqSection.jsx                  # FAQ accordion section
│   ├── faqItem.jsx                     # Single FAQ accordion item
│   ├── askQuestionForm.jsx             # Question submission form
│   └── contactUs.jsx                   # Contact information display
├── icons/
│   └── icons.jsx                       # Centralized icon library
└── navigation/
    └── navBar.jsx                      # Updated with Help button
```

---

## Component Responsibilities

### 1. **helpPage.jsx** (Main Container)

**Purpose:** Main container that composes the entire Help & Support page

**Props Received:**
- `onAskQuestion` - Callback function to handle question submissions

**UI Structure:**
```
┌─────────────────────────────────────────────────┐
│  Help & Support                                 │
├─────────────────────────────────────────────────┤
│  ┌──────────────────┬───────────────────────┐  │
│  │  FAQ Section     │  Ask Question Form    │  │
│  │  (accordion)     │  (input fields)       │  │
│  └──────────────────┴───────────────────────┘  │
├─────────────────────────────────────────────────┤
│  Contact Us                                     │
│  (Facebook, Email, Phone)                       │
└─────────────────────────────────────────────────┘
```

**Layout:**
- Gray background (bg-gray-50)
- Main content card with rounded corners (rounded-2xl)
- Flex layout: column on mobile, row on desktop (lg:flex-row)
- Contact Us section below main card (mt-8)

---

### 2. **faqSection.jsx** (FAQ Container)

**Purpose:** Manages FAQ accordion state and renders FAQ items

**State:**
```javascript
const [openId, setOpenId] = useState(null);
```

**FAQ Data Structure:**
```javascript
{
  id: 'q1',
  icon: KeyRound,
  question: 'How does the RFID attendance work?',
  answer: 'The RFID attendance system uses...'
}
```

**Features:**

1. **Accordion Behavior**
   - Only one FAQ can be open at a time
   - Clicking an open item closes it
   - Clicking a closed item opens it and closes others

2. **Icons**
   - KeyRound: RFID attendance
   - ScrollText: Enrollment subsystem
   - CreditCard: Payment processing
   - MessageSquareText: TextSundo

**FAQ Content:**

**Q1: How does the RFID attendance work?**
> The RFID attendance system uses radio frequency identification technology to automatically record student attendance. Students simply tap their RFID card on the reader when entering the classroom, and their attendance is instantly logged in the system.

**Q2: What is the enroll subsystem?**
> The enrollment subsystem is a comprehensive module that handles student registration and enrollment processes. It allows administrators to manage student information, assign students to classes, track enrollment status, and generate enrollment reports.

**Q3: How are payment processed?**
> Payments are processed through our secure online payment gateway. Parents can pay tuition fees, miscellaneous fees, and other school charges using credit cards, debit cards, or online banking.

**Q4: What is TextSundo?**
> TextSundo is our SMS notification service that keeps parents and teachers informed about important school updates. It sends automated text messages for announcements, event reminders, grade notifications, and emergency alerts.

---

### 3. **faqItem.jsx** (Accordion Item)

**Purpose:** Renders a single collapsible FAQ item

**Props:**
- `question` - The FAQ question text
- `answer` - The FAQ answer text
- `IconComponent` - Icon component to display
- `isOpen` - Boolean indicating if item is expanded
- `onToggle` - Callback when item header is clicked

**UI Components:**

1. **Header (Clickable Button)**
   - Icon on the left (amber-500 color)
   - Question text in the middle
   - ChevronDown icon on the right
   - Hover effect (bg-gray-50)

2. **Chevron Animation**
   - Default: pointing down
   - Open state: rotates 180° (pointing up)
   - Smooth transition (duration-200)

3. **Content (Answer)**
   - Only shown when `isOpen === true`
   - Gray text (text-gray-600)
   - Padding for spacing (p-4 pt-0)

**Styling:**
```javascript
// Border and rounded corners
className="border border-gray-200 rounded-xl overflow-hidden"

// Chevron rotation
className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
```

---

### 4. **askQuestionForm.jsx** (Submission Form)

**Purpose:** Collects and submits user questions/support requests

**State:**
```javascript
const [fullName, setFullName] = useState('');
const [studentId, setStudentId] = useState('');
const [description, setDescription] = useState('');
```

**Form Fields:**

1. **Full Name Input**
   - Type: text
   - Placeholder: "Enter your full name"
   - Required field

2. **Student ID Input**
   - Type: text
   - Placeholder: "Student ID"
   - Required field

3. **Description Textarea**
   - Rows: 6
   - Placeholder: "Description..."
   - Required field
   - Resize disabled (resize-none)

**Form Submission Logic:**

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  
  // Validate all fields are filled
  if (!fullName.trim() || !studentId.trim() || !description.trim()) {
    alert('Please fill in all fields');
    return;
  }
  
  // Call parent callback with data
  onSubmit({
    fullName: fullName.trim(),
    studentId: studentId.trim(),
    description: description.trim()
  });
  
  // Reset form
  setFullName('');
  setStudentId('');
  setDescription('');
  
  // Show success message
  alert('Your question has been submitted successfully!');
};
```

**Styling:**
- Background: amber-50 (light yellow)
- Inputs: White background with focus ring (ring-amber-400)
- Submit button: amber-400 with hover effect
- Button position: Right-aligned (justify-end)

---

### 5. **contactUs.jsx** (Contact Information)

**Purpose:** Displays static school contact information

**Contact Details:**

1. **Facebook**
   - Icon: Facebook
   - Link: https://facebook.com/GymnazoChristianAcademy
   - Opens in new tab (target="_blank")

2. **Email**
   - Icon: Mail
   - Link: mailto:482022.gymnazochristianacademy@gmail.com
   - Clickable to open email client

3. **Phone**
   - Icon: Phone
   - Link: tel:282472450
   - Clickable to initiate call on mobile

**UI Structure:**
```javascript
<div className="flex items-center gap-3">
  <Icon className="w-5 h-5 text-gray-700" />
  <a href="..." className="hover:text-amber-600">Contact Info</a>
</div>
```

**Styling:**
- Background: amber-50 (consistent with form)
- Icons: gray-700 color
- Links: Hover effect changes to amber-600
- Spacing: space-y-3 between items

---

## Integration with App

### State Management in App.jsx (Required)

```javascript
// Add to App.jsx state
const [submittedQuestions, setSubmittedQuestions] = useState([]);

// Add to App.jsx functions
const handleSubmitQuestion = (questionData) => {
  const newQuestion = {
    id: Date.now(),
    date: new Date().toISOString(),
    ...questionData
  };
  
  setSubmittedQuestions(prev => [...prev, newQuestion]);
  
  // Optional: Send to backend API
  // fetch('/api/questions', {
  //   method: 'POST',
  //   body: JSON.stringify(newQuestion)
  // });
};

// Add to currentView switch
case 'help':
  return <HelpPage onAskQuestion={handleSubmitQuestion} />;
```

### Navigation Flow

```
NavBar (Top Navigation)
├─> Click "Help & Support" button
└─> onNavClick('help') is called
    └─> App.jsx sets currentView = 'help'
        └─> Renders <HelpPage />
```

---

## User Flow

### Scenario 1: Teacher browses FAQs

**Step 1: Navigate to Help**
```
Teacher clicks "Help & Support" in NavBar
└─> HelpPage renders
```

**Step 2: Read FAQ**
```
Teacher sees 4 closed FAQ items
├─> Click "How does the RFID attendance work?"
├─> Item expands with full answer
└─> ChevronDown icon rotates 180°
```

**Step 3: Open Another FAQ**
```
Teacher clicks "What is TextSundo?"
├─> Previous item closes automatically
├─> New item opens with answer
└─> Only one item open at a time
```

### Scenario 2: Teacher submits a question

**Step 1: Fill Form**
```
Teacher types in Ask Question form:
├─> Full Name: "Maria Santos"
├─> Student ID: "2024-12345"
└─> Description: "How do I reset my password?"
```

**Step 2: Submit**
```
Teacher clicks "Submit" button
├─> Form validates all fields are filled
├─> Calls onSubmit callback
├─> Sends data to App.jsx state
└─> Shows success alert
```

**Step 3: Form Reset**
```
After submission:
├─> All fields clear to empty
├─> Form ready for next question
└─> Teacher sees success message
```

### Scenario 3: Teacher contacts school

**Step 1: View Contact Info**
```
Teacher scrolls to Contact Us section
└─> Sees 3 contact methods
```

**Step 2: Send Email**
```
Teacher clicks email link
├─> Opens default email client
├─> Email address pre-filled
└─> Teacher writes message
```

**Step 3: Call School**
```
Teacher clicks phone number
├─> On mobile: Opens phone dialer
├─> On desktop: Shows "Open with..." dialog
└─> Teacher can call directly
```

---

## Responsive Design

### Mobile (< 768px)
- FAQ and Form stack vertically
- Full-width components
- Touch-friendly tap targets
- FAQ items expand/collapse smoothly

### Tablet (768px - 1024px)
- FAQ and Form still stacked
- Slightly wider layout
- Better spacing

### Desktop (> 1024px)
- FAQ and Form side-by-side (lg:flex-row)
- 50/50 split (flex-1 on each)
- Maximum readability
- Hover effects on interactive elements

---

## State Management

### Local State (Component Level)

**faqSection.jsx:**
```javascript
const [openId, setOpenId] = useState(null);
// Manages which FAQ item is currently open
```

**askQuestionForm.jsx:**
```javascript
const [fullName, setFullName] = useState('');
const [studentId, setStudentId] = useState('');
const [description, setDescription] = useState('');
// Manages form field values
```

### Global State (App.jsx Level)

**submittedQuestions:**
```javascript
const [submittedQuestions, setSubmittedQuestions] = useState([]);
// Stores all submitted questions
// Can be used to show submission history
// Can be sent to backend for ticketing system
```

**Question Object Structure:**
```javascript
{
  id: 1730198400000,
  date: "2025-10-29T10:30:00.000Z",
  fullName: "Maria Santos",
  studentId: "2024-12345",
  description: "How do I reset my password?"
}
```

---

## Styling Details

### Color Palette

**Backgrounds:**
- Page: `bg-gray-50` (light gray)
- Main card: `bg-white` (pure white)
- Form/Contact: `bg-amber-50` (light yellow)

**Text:**
- Headings: `text-gray-900` (dark)
- Body: `text-gray-600` (medium)
- Labels: `text-gray-700` (medium-dark)

**Accents:**
- Primary: `bg-amber-400` (buttons)
- Hover: `bg-amber-500` (button hover)
- Icons: `text-amber-500` (FAQ icons)
- Links: `hover:text-amber-600`

### Border & Spacing

**Borders:**
- FAQ items: `border border-gray-200`
- Rounded: `rounded-xl` or `rounded-2xl`

**Spacing:**
- Between sections: `gap-8`
- Between form fields: `space-y-4`
- Between contact items: `space-y-3`

### Interactive States

**Buttons:**
```javascript
// Default
className="bg-amber-400"

// Hover
hover:bg-amber-500

// Focus
focus:ring-2 focus:ring-amber-400
```

**FAQ Items:**
```javascript
// Default
className="hover:bg-gray-50"

// Transition
transition-colors
```

---

## Database Integration

### Backend API Endpoints Needed

**1. Submit Question**
```php
// POST /api/help/questions
// Body: { fullName, studentId, description }
// Returns: { id, status, message }
```

**2. Get Questions (Admin)**
```php
// GET /api/help/questions
// Returns: array of question objects with timestamps
```

**3. Update Question Status (Admin)**
```php
// PUT /api/help/questions/:id
// Body: { status: 'pending' | 'answered' | 'resolved' }
```

**4. Add/Update FAQ**
```php
// POST /api/help/faq
// Body: { question, answer, icon, category }
```

**5. Get All FAQs**
```php
// GET /api/help/faq
// Returns: array of FAQ objects
```

### Database Schema

**help_questions table:**
```sql
CREATE TABLE help_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  teacher_id INT,
  full_name VARCHAR(255) NOT NULL,
  student_id VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('pending', 'answered', 'resolved') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);
```

**faq table:**
```sql
CREATE TABLE faq (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  icon VARCHAR(50),
  category VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Update Form to Use API

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/help/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: fullName.trim(),
        studentId: studentId.trim(),
        description: description.trim()
      })
    });
    
    if (!response.ok) throw new Error('Submission failed');
    
    const data = await response.json();
    
    // Call parent callback
    onSubmit(data);
    
    // Reset form
    setFullName('');
    setStudentId('');
    setDescription('');
    
    alert('Question submitted successfully!');
  } catch (error) {
    alert('Failed to submit question. Please try again.');
    console.error(error);
  }
};
```

---

## Future Enhancements

### 1. Question History

**Show teacher's submitted questions:**
```javascript
<div className="mt-8">
  <h2>Your Recent Questions</h2>
  <ul>
    {submittedQuestions.map(q => (
      <li key={q.id}>
        <p>{q.description}</p>
        <span>Status: {q.status}</span>
      </li>
    ))}
  </ul>
</div>
```

### 2. Real-time Chat Support

**Add live chat widget:**
```javascript
import ChatWidget from './ChatWidget';

<ChatWidget 
  teacherId={currentTeacher.id}
  isOnline={supportTeamOnline}
/>
```

### 3. Search FAQs

**Add search functionality:**
```javascript
const [faqSearch, setFaqSearch] = useState('');

const filteredFaqs = faqData.filter(faq =>
  faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
  faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
);
```

### 4. FAQ Categories

**Organize by topics:**
```javascript
const categories = ['Attendance', 'Enrollment', 'Payments', 'Technical'];

<select onChange={(e) => setCategory(e.target.value)}>
  {categories.map(cat => <option>{cat}</option>)}
</select>
```

### 5. Attachment Upload

**Allow teachers to attach files:**
```javascript
const [attachment, setAttachment] = useState(null);

<input 
  type="file" 
  onChange={(e) => setAttachment(e.target.files[0])}
/>
```

### 6. Email Notifications

**Notify admins of new questions:**
```php
// In backend after question submission
$mailer->send([
  'to' => 'admin@school.com',
  'subject' => 'New Help Request',
  'body' => "From: {$fullName}\nQuestion: {$description}"
]);
```

---

## Testing Checklist

### Visual Testing
- [ ] Page header displays correctly
- [ ] FAQ and Form are side-by-side on desktop
- [ ] FAQ and Form stack on mobile
- [ ] FAQ icons display correctly
- [ ] ChevronDown rotates when FAQ opens
- [ ] Form fields have proper spacing
- [ ] Submit button is right-aligned
- [ ] Contact icons display correctly

### Functional Testing
- [ ] Clicking FAQ item opens it
- [ ] Opening new FAQ closes previous one
- [ ] Form validation works (empty fields)
- [ ] Form submits with valid data
- [ ] Form resets after submission
- [ ] Success alert appears after submit
- [ ] Email link opens mail client
- [ ] Phone link works on mobile
- [ ] Facebook link opens in new tab

### Responsive Testing
- [ ] Mobile: components stack vertically
- [ ] Tablet: proper spacing maintained
- [ ] Desktop: side-by-side layout works
- [ ] Touch targets are adequate size
- [ ] Text is readable at all sizes

### Accessibility Testing
- [ ] Form labels are descriptive
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Screen reader friendly
- [ ] Color contrast meets standards

---

## Common Issues & Solutions

### Issue: FAQ won't open
**Solution:** Check that `openId` state is being updated and `isOpen` prop is passed correctly

### Issue: Form doesn't reset after submit
**Solution:** Ensure all `setState('')` calls are executed after successful submission

### Issue: Icons not displaying
**Solution:** Verify lucide-react is installed and icons are imported correctly

### Issue: Layout breaks on mobile
**Solution:** Check that `lg:flex-row` is used, not just `flex-row`

### Issue: Submit button doesn't work
**Solution:** Ensure `type="submit"` is on button and `onSubmit` is on form element

---

## Performance Considerations

### FAQ Rendering
- Only 4 FAQ items - minimal performance impact
- No need for virtualization
- Animations are CSS-based (efficient)

### Form State
- Local state management (optimal)
- No unnecessary re-renders
- Controlled inputs for better UX

### Icons
- Tree-shaking enabled with lucide-react
- Only imports used icons
- SVG-based (scalable, small file size)

---

## Quick Reference

### Props Flow
```
HelpPage
├─> FaqSection (no props)
│   └─> FaqItem (question, answer, icon, isOpen, onToggle)
├─> AskQuestionForm (onSubmit)
└─> ContactUs (no props)
```

### Key Files
- Main: `helpPage.jsx`
- FAQ: `faqSection.jsx`, `faqItem.jsx`
- Form: `askQuestionForm.jsx`
- Contact: `contactUs.jsx`
- Icons: `icons.jsx`

### Key Classes
- Page: `bg-gray-50 min-h-screen p-8`
- Card: `bg-white rounded-2xl shadow-lg`
- Form: `bg-amber-50 p-6 rounded-2xl`
- Button: `bg-amber-400 hover:bg-amber-500 rounded-full`

---

## Summary

The Help & Support System provides:
- ✅ Comprehensive FAQ section with 4 common questions
- ✅ Collapsible accordion UI (one item open at a time)
- ✅ Question submission form with validation
- ✅ Contact information display (Facebook, Email, Phone)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Clean component-based architecture
- ✅ Ready for database integration
- ✅ Accessible and user-friendly

All components work together seamlessly and are ready for production use!
