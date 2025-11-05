# API Configuration Migration Guide

## Overview
We've created a centralized API configuration to handle environment-specific URLs. This allows the app to work in development (localhost) and production (Vercel) seamlessly.

## What Changed?

### 1. New Configuration File: `src/config/api.js`
This file exports:
- `API_BASE_URL`: The base URL from environment variables
- `getApiUrl(endpoint)`: Helper function to build full API URLs
- `API_ENDPOINTS`: Pre-configured endpoints for common API calls

### 2. Environment Files
- `.env.development`: Used during `npm run dev`
- `.env.production`: Used during `npm run build`
- `.env.example`: Template for developers

## How to Update Your Files

### Before (❌ Old Way)
```javascript
const response = await axios.get(
  'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/auth/login.php'
);
```

### After (✅ New Way)

#### Option 1: Use Pre-configured Endpoints
```javascript
import { API_ENDPOINTS } from '../config/api';

const response = await axios.get(API_ENDPOINTS.LOGIN);
```

#### Option 2: Use getApiUrl Helper
```javascript
import { getApiUrl } from '../config/api';

const response = await axios.get(getApiUrl('api/auth/login.php'));
```

## Files That Need Updating

### ✅ Already Updated:
- `src/context/AuthContext.jsx`

### 📝 Need to Update:

#### 1. `src/services/HelpSupportService.js`
**Current:**
```javascript
const API_BASE_URL = 'http://localhost:5173/api/support';
```

**Update to:**
```javascript
import { getApiUrl } from '../config/api';

const API_BASE_URL = getApiUrl('api/support');
```

#### 2. `src/pages/AttendancePage.jsx` (Line 40)
**Current:**
```javascript
const response = await axios.get(
  `http://localhost/gymnazo-christian-academy-teacher-side/backend/api/teachers/get-students-by-section.php?sectionId=${sectionId}`
);
```

**Update to:**
```javascript
import { getApiUrl } from '../config/api';

const response = await axios.get(
  getApiUrl(`api/teachers/get-students-by-section.php?sectionId=${sectionId}`)
);
```

#### 3. `src/pages/AttendanceReportPage.jsx` (Line 37)
**Current:**
```javascript
const response = await axios.get(
  `http://localhost/gymnazo-christian-academy-teacher-side/backend/api/attendance/get-report.php?quarter=${selectedQuarter}`
);
```

**Update to:**
```javascript
import { getApiUrl } from '../config/api';

const response = await axios.get(
  getApiUrl(`api/attendance/get-report.php?quarter=${selectedQuarter}`)
);
```

#### 4. `src/components/pages/classManagementApp.jsx`

**Lines 84 & 107:**
```javascript
import { API_ENDPOINTS, getApiUrl } from '../../config/api';

// Line 84
const response = await axios.get(API_ENDPOINTS.GET_TEACHER_CLASSES);

// Line 107
const response = await axios.get(
  getApiUrl(`api/teachers/get-students-by-section.php?sectionId=${sectionId}`)
);
```

#### 5. `src/components/common/dashboardHeader.jsx` (Line 49)
```javascript
import { getApiUrl } from '../../config/api';

const response = await axios.get(
  getApiUrl('api/notifications/get-notifications.php?limit=10')
);
```

## Quick Find & Replace Pattern

You can use VS Code's find and replace with regex:

### Find:
```
http://localhost/gymnazo-christian-academy-teacher-side/backend/
```

### Replace with:
```javascript
// First, add import at top:
import { getApiUrl } from '../config/api'; // or '../../config/api' depending on file location

// Then replace URL with:
getApiUrl('
```

## Adding New API Endpoints

To add new endpoints to the configuration:

1. Open `src/config/api.js`
2. Add to `API_ENDPOINTS` object:

```javascript
export const API_ENDPOINTS = {
  // ... existing endpoints
  
  // Your new endpoint
  YOUR_NEW_ENDPOINT: getApiUrl('api/your-path/endpoint.php'),
};
```

3. Use it in your components:
```javascript
import { API_ENDPOINTS } from '../config/api';

const response = await axios.get(API_ENDPOINTS.YOUR_NEW_ENDPOINT);
```

## Testing

### Test Locally
```bash
cd frontend
npm run dev
# Should use .env.development settings
```

### Test Production Build
```bash
cd frontend
npm run build
npm run preview
# Should use .env.production settings
```

### Test with Different API URLs
Create `.env.local` to override settings:
```
VITE_API_BASE_URL=http://your-test-server.com/backend
```

## Troubleshooting

### Issue: API calls return 404
- Check that `.env.production` has the correct backend URL
- Verify environment variables in Vercel dashboard
- Ensure backend CORS allows your Vercel domain

### Issue: Environment variables not working
- Vite environment variables MUST start with `VITE_`
- Restart dev server after changing .env files
- Check `import.meta.env.VITE_API_BASE_URL` in console

### Issue: CORS errors in production
Update your backend's `config/cors.php`:
```php
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-vercel-domain.vercel.app', // Add this
];
```

## Next Steps

1. ✅ Configuration files created
2. ✅ AuthContext.jsx updated
3. 📝 Update remaining files (see list above)
4. 📝 Update `.env.production` with your actual backend URL
5. 📝 Test locally
6. 📝 Deploy to Vercel
7. 📝 Configure environment variables in Vercel
8. 📝 Test production deployment
