# Teacher Registration System - Complete Guide

## 📋 Overview

This system allows you to create new teacher accounts with complete user profile, authentication, and role assignment.

---

## 🗂️ File Structure

```
backend/
├── api/auth/
│   └── register-teacher.php          ← API endpoint for registration
├── controllers/
│   └── teacher-auth-controller.php   ← Registration logic & validation
└── models/
    ├── User.php                       ← User database operations
    └── Teachers.php                   ← Teacher-specific operations

frontend/
├── src/
│   ├── components/common/homepage/
│   │   ├── login.jsx                 ← Login page (with register link)
│   │   └── registerTeacher.jsx       ← Registration form component
│   └── App.jsx                        ← Route configuration
```

---

## 🔄 Registration Flow

### Step-by-Step Process:

1. **User** → Fills registration form
2. **Frontend** → Validates input & sends to API
3. **API** → Receives data & calls controller
4. **Controller** → Creates database records in order:
   - `user` table (UserID generated)
   - `passwordpolicy` table (stores hashed password)
   - `profile` table (ProfileID generated)
   - `teacherprofile` table (TeacherProfileID generated)
   - `userrole` table (assigns Teacher role)
5. **Response** → Success/error message sent back

---

## 📊 Database Tables Created

### 1. **user** Table
```sql
UserID          INT (auto-generated)
EmailAddress    VARCHAR (unique, used for login)
UserType        ENUM ('Teacher')
AccountStatus   ENUM ('Active', 'Inactive', 'Suspended', 'PendingVerification')
CreatedAt       DATETIME
```

### 2. **passwordpolicy** Table
```sql
PolicyID        INT (auto-generated)
UserID          INT (foreign key to user)
PasswordHash    VARCHAR (bcrypt hashed password)
PasswordSetDate DATETIME
MustChange      TINYINT (0 = no, 1 = yes)
```

### 3. **profile** Table
```sql
ProfileID              INT (auto-generated)
UserID                 INT (foreign key to user)
FirstName              VARCHAR
LastName               VARCHAR
MiddleName             VARCHAR
EncryptedPhoneNumber   VARBINARY (encrypted)
EncryptedAddress       VARBINARY (encrypted)
```

### 4. **teacherprofile** Table
```sql
TeacherProfileID  INT (auto-generated)
ProfileID         INT (foreign key to profile)
EmployeeNumber    VARCHAR (unique identifier)
Specialization    VARCHAR (subject area)
HireDate          DATE
```

### 5. **role** Table (pre-existing)
```sql
RoleID      INT
RoleName    VARCHAR ('Teacher')
Description TEXT
IsActive    TINYINT
```

### 6. **userrole** Table
```sql
UserRoleID       INT (auto-generated)
UserID           INT (foreign key to user)
RoleID           INT (foreign key to role)
AssignedDate     DATETIME
AssignedByUserID INT (who assigned this role)
```

---

## 🔌 API Endpoint

### **POST** `/backend/api/auth/register-teacher.php`

**Request Body:**
```json
{
  "email": "teacher@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "middleName": "Smith",
  "employeeNumber": "TEACH-2025-001",
  "phoneNumber": "09171234567",
  "address": "123 Main Street, City",
  "specialization": "Mathematics",
  "hireDate": "2025-01-15"
}
```

**Required Fields:**
- ✅ `email`
- ✅ `password`
- ✅ `firstName`
- ✅ `lastName`
- ✅ `employeeNumber`

**Optional Fields:**
- `middleName`
- `phoneNumber`
- `address`
- `specialization`
- `hireDate` (defaults to today)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Teacher account created successfully!",
  "data": {
    "userId": 5,
    "profileId": 5,
    "teacherProfileId": 3,
    "employeeNumber": "TEACH-2025-001"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email address already registered."
}
```

---

## 💻 Frontend Usage

### Access the Registration Page:

1. **Via Login Page:**
   - Go to login page
   - Click "Register New Teacher" link at bottom
   - Fill out the registration form
   - Click "Register Teacher" button

2. **Direct URL:**
   ```
   http://localhost:5173/register-teacher
   ```

### Form Validation:
- ✅ Email format validation
- ✅ Password minimum 8 characters
- ✅ Password confirmation match
- ✅ Required fields check
- ✅ Real-time error display

---

## 🔐 Security Features

### Backend Security:
1. **Input Sanitization:**
   - All inputs are sanitized using `htmlspecialchars()` and `strip_tags()`
   - Email validated with `filter_var()`

2. **Password Security:**
   - Passwords hashed with `password_hash()` using BCRYPT
   - Minimum 8 characters enforced

3. **SQL Injection Prevention:**
   - All queries use PDO prepared statements
   - Parameters bound with `bindParam()`

4. **Transaction Safety:**
   - Database transactions ensure all-or-nothing inserts
   - Automatic rollback on error

5. **Unique Constraints:**
   - Email addresses must be unique
   - Employee numbers must be unique

### Frontend Security:
1. **HTTPS/Credentials:**
   - API calls use `withCredentials: true`
   - Ready for HTTPS in production

2. **XSS Prevention:**
   - React automatically escapes JSX output
   - No dangerouslySetInnerHTML used

---

## 🧪 Testing the System

### Manual Test:

1. **Start Backend:**
   ```bash
   # Make sure XAMPP Apache and MySQL are running
   ```

2. **Start Frontend:**
   ```powershell
   cd frontend
   npm run dev
   ```

3. **Test Registration:**
   - Navigate to `http://localhost:5173/register-teacher`
   - Fill in form with test data:
     ```
     Email: testteacher@gymnazo.edu
     Password: Test1234!
     First Name: Test
     Last Name: Teacher
     Employee Number: TEACH-2025-TEST
     ```
   - Submit form
   - Check for success message
   - Verify redirect to login

4. **Test Login:**
   - Use newly created credentials
   - Should successfully login and redirect to dashboard

5. **Verify Database:**
   ```sql
   -- Check user created
   SELECT * FROM user WHERE EmailAddress = 'testteacher@gymnazo.edu';
   
   -- Check profile created
   SELECT u.UserID, p.ProfileID, p.FirstName, p.LastName 
   FROM user u 
   JOIN profile p ON u.UserID = p.UserID 
   WHERE u.EmailAddress = 'testteacher@gymnazo.edu';
   
   -- Check teacher profile
   SELECT tp.*, p.FirstName, p.LastName 
   FROM teacherprofile tp
   JOIN profile p ON tp.ProfileID = p.ProfileID
   WHERE tp.EmployeeNumber = 'TEACH-2025-TEST';
   
   -- Check role assignment
   SELECT ur.*, r.RoleName 
   FROM userrole ur
   JOIN role r ON ur.RoleID = r.RoleID
   JOIN user u ON ur.UserID = u.UserID
   WHERE u.EmailAddress = 'testteacher@gymnazo.edu';
   ```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Email address already registered"
**Cause:** Email already exists in database
**Solution:** Use a different email or delete the existing account

### Issue 2: "Employee number already exists"
**Cause:** Employee number must be unique
**Solution:** Generate a new unique employee number

### Issue 3: "Database connection failed"
**Cause:** Database not running or wrong credentials
**Solution:** 
- Check XAMPP is running
- Verify `.env` file has correct database credentials

### Issue 4: "Failed to create user account"
**Cause:** Database permissions or constraint violation
**Solution:**
- Check database user has INSERT permissions
- Review database error logs

### Issue 5: Registration succeeds but login fails
**Cause:** Password policy not created or incorrect table join
**Solution:**
- Verify `passwordpolicy` table has the record
- Check password hash is stored correctly

---

## 🔧 Customization

### Change Password Requirements:
Edit `backend/api/auth/register-teacher.php`:
```php
// Line ~68
if (strlen($data['password']) < 12) {  // Changed from 8 to 12
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least 12 characters long.']);
    exit();
}
```

### Add Password Strength Validation:
```php
// Add after password length check
if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/', $data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must contain uppercase, lowercase, number, and special character.']);
    exit();
}
```

### Change Default Account Status:
Edit `backend/controllers/teacher-auth-controller.php`:
```php
// Line ~168
$query = "INSERT INTO user (EmailAddress, UserType, AccountStatus, CreatedAt) 
          VALUES (:email, 'Teacher', 'PendingVerification', NOW())";  // Changed from 'Active'
```

### Add Email Verification:
1. Add verification token to user creation
2. Send verification email
3. Create verification endpoint
4. Set status to 'Active' after verification

---

## 📞 Support

If you encounter issues:

1. Check PHP error logs: `xampp/php/logs/php_error_log`
2. Check Apache error logs: `xampp/apache/logs/error.log`
3. Check browser console for frontend errors
4. Verify database connection in `.env` file

---

## 🎯 Next Steps

**Recommended Enhancements:**

1. **Email Verification:**
   - Send verification email after registration
   - Require email verification before account activation

2. **Admin Dashboard:**
   - Create admin panel to manage teacher accounts
   - Add bulk teacher import functionality

3. **Role Permissions:**
   - Define specific permissions for Teacher role
   - Implement permission checking in controllers

4. **Profile Pictures:**
   - Add image upload functionality
   - Store profile pictures securely

5. **Audit Logging:**
   - Log all registration attempts
   - Track who created which accounts

---

## ✅ Summary

You now have a complete teacher registration system that:

- ✅ Creates user accounts with proper database relationships
- ✅ Securely hashes passwords
- ✅ Assigns teacher roles automatically
- ✅ Validates all inputs (frontend + backend)
- ✅ Uses database transactions for data integrity
- ✅ Provides clear error messages
- ✅ Redirects to login after successful registration

**Files Created/Modified:**
- ✅ `backend/controllers/teacher-auth-controller.php` (modified)
- ✅ `backend/api/auth/register-teacher.php` (created)
- ✅ `frontend/src/components/common/homepage/registerTeacher.jsx` (created)
- ✅ `frontend/src/components/common/homepage/login.jsx` (modified)
- ✅ `frontend/src/App.jsx` (modified)
