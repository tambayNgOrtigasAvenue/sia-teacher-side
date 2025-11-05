# 🚀 Vercel Deployment - Quick Start Guide

## ✅ What We've Configured

### 1. **Fixed Vite Configuration**
- ✅ Changed `base` from `/sia-teacher-side` to `/`
- ✅ This fixes routing issues on Vercel

### 2. **Created Environment Files**
- ✅ `.env.development` - for local development
- ✅ `.env.production` - for Vercel deployment
- ✅ `.env.example` - template for team members

### 3. **Created API Configuration**
- ✅ `src/config/api.js` - centralized API endpoint management
- ✅ Supports environment-specific URLs
- ✅ Updated `AuthContext.jsx` to use new configuration

### 4. **Updated Project Files**
- ✅ `vercel.json` - proper build and routing configuration
- ✅ `.gitignore` - excludes environment files
- ✅ Documentation created

---

## 📋 Pre-Deployment Checklist

Before deploying to Vercel, complete these steps:

### Step 1: Update Remaining API Calls
You need to update the hardcoded localhost URLs in these files:

- [ ] `src/services/HelpSupportService.js`
- [ ] `src/pages/AttendancePage.jsx`
- [ ] `src/pages/AttendanceReportPage.jsx`
- [ ] `src/components/pages/classManagementApp.jsx`
- [ ] `src/components/common/dashboardHeader.jsx`

See `API_MIGRATION_GUIDE.md` for specific instructions.

### Step 2: Update Production Environment
Edit `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-actual-backend-url.com
```
Replace with your real backend URL.

### Step 3: Test Build Locally
```powershell
cd frontend
npm run build
npm run preview
```

### Step 4: Commit Changes
```powershell
git add .
git commit -m "Configure project for Vercel deployment"
git push origin main
```

---

## 🌐 Deploying to Vercel

### Method 1: Vercel Dashboard (Recommended for First Time)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Select `sia-teacher-side` repository
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add: `VITE_API_BASE_URL`
   - Value: Your production backend URL
   - Environment: Production
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)

### Method 2: Vercel CLI (Quick Deploy)

```powershell
# Install Vercel CLI (one time)
npm install -g vercel

# Deploy
cd c:\xampp\htdocs\gymnazo-christian-academy-teacher-side
vercel --prod

# Follow the prompts:
# - Link to existing project? No
# - Project name: sia-teacher-side
# - Directory: frontend
# - Override settings? No
```

---

## ⚙️ Backend Deployment (Required)

**Important**: Your PHP backend must be deployed separately!

### Backend Options:

1. **Traditional PHP Hosting**
   - Hostinger, SiteGround, HostGator
   - Upload `backend/` folder
   - Configure database connection

2. **Railway.app** (Recommended)
   - Supports PHP
   - Free tier available
   - Easy GitHub integration

3. **Your Current XAMPP**
   - Make it publicly accessible
   - Configure port forwarding
   - Update CORS settings

### Update Backend CORS
In `backend/config/cors.php`:
```php
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://sia-teacher-side.vercel.app', // Your Vercel domain
    'https://your-custom-domain.com',      // If using custom domain
];
```

---

## 🧪 Testing Your Deployment

### After Deployment:

1. **Visit Your Site**
   - Go to your Vercel URL (e.g., `https://sia-teacher-side.vercel.app`)

2. **Test Routing**
   - Click through different pages
   - Refresh the page on each route
   - Should NOT get 404 errors ✅

3. **Test API Connectivity**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Try logging in
   - Check for CORS or connection errors

4. **Verify Environment Variables**
   - In console, type: `import.meta.env.VITE_API_BASE_URL`
   - Should show your production backend URL

---

## 🐛 Common Issues & Solutions

### Issue: 404 on Page Refresh
**Solution**: ✅ Already fixed with `vercel.json` rewrites

### Issue: API Calls Fail
**Causes**:
- Backend not deployed
- Wrong `VITE_API_BASE_URL` in Vercel
- CORS not configured

**Solution**:
1. Check environment variables in Vercel dashboard
2. Verify backend is accessible
3. Update backend CORS settings

### Issue: Blank Page
**Causes**:
- JavaScript errors
- Wrong base path

**Solution**:
1. Check browser console for errors
2. Verify `vite.config.js` has `base: '/'`

### Issue: Environment Variables Not Working
**Solution**:
1. Ensure variable starts with `VITE_`
2. Redeploy after adding variables
3. Clear browser cache

---

## 📊 Project Structure Overview

```
gymnazo-christian-academy-teacher-side/
├── frontend/                          # React + Vite app
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js                # ✅ NEW: API configuration
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # ✅ Updated
│   │   └── ...
│   ├── .env.development              # ✅ NEW: Dev environment
│   ├── .env.production               # ✅ NEW: Prod environment (UPDATE THIS!)
│   ├── .env.example                  # ✅ NEW: Template
│   ├── vite.config.js                # ✅ Updated
│   └── package.json
├── backend/                          # PHP API (deploy separately)
│   ├── api/
│   ├── config/
│   │   └── cors.php                  # ⚠️ Update CORS settings
│   └── ...
├── vercel.json                       # ✅ Vercel configuration
├── VERCEL_DEPLOYMENT_GUIDE.md        # ✅ Detailed guide
├── API_MIGRATION_GUIDE.md            # ✅ API update instructions
└── VERCEL_QUICK_START.md            # 👈 You are here!
```

---

## 📝 Next Steps

### Immediate Tasks:
1. [ ] Update remaining API calls (see `API_MIGRATION_GUIDE.md`)
2. [ ] Update `.env.production` with backend URL
3. [ ] Test build locally
4. [ ] Deploy backend (if not already deployed)
5. [ ] Deploy to Vercel
6. [ ] Configure environment variables in Vercel
7. [ ] Test production deployment

### Optional Enhancements:
- [ ] Set up custom domain in Vercel
- [ ] Enable preview deployments for branches
- [ ] Configure build notifications
- [ ] Set up analytics

---

## 📚 Documentation Files

- `VERCEL_DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- `API_MIGRATION_GUIDE.md` - How to update API calls
- `VERCEL_QUICK_START.md` - This file (quick reference)

---

## 🆘 Need Help?

1. Check the detailed guides in the repository
2. Review Vercel build logs for errors
3. Check browser console for frontend errors
4. Verify environment variables are set correctly

---

## 🎉 Success Checklist

After deployment, you should have:
- ✅ Frontend live on Vercel
- ✅ Custom domain (optional)
- ✅ No 404 errors on page refresh
- ✅ Working authentication
- ✅ All API calls functioning
- ✅ Assets loading correctly

**You're ready to deploy! Good luck! 🚀**
