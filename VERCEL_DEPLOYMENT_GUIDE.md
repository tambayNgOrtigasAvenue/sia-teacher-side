# Vercel Deployment Configuration Guide

## Project Structure
This is a monorepo with separate frontend (React + Vite) and backend (PHP) directories.

## Vercel Configuration Steps

### 1. Import Your Repository
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click "Add New Project"
- Import your GitHub repository: `sia-teacher-side`

### 2. Configure Build Settings

#### Framework Preset
- **Framework**: Vite

#### Root Directory
- **Root Directory**: `frontend`

#### Build & Development Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables

Add these environment variables in Vercel:

#### Production Environment Variables
```
VITE_API_BASE_URL=https://your-backend-domain.com
```

**Important**: Replace `https://your-backend-domain.com` with your actual backend API URL.

#### How to Add Environment Variables:
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add `VITE_API_BASE_URL` with your production backend URL
4. Select "Production" environment
5. Click "Save"

### 4. Deploy

Click "Deploy" button and wait for the build to complete.

## Backend Deployment (Separate)

⚠️ **Important**: Your PHP backend needs to be deployed separately as Vercel doesn't support PHP.

### Recommended Backend Hosting Options:

1. **Traditional PHP Hosting**
   - Hostinger
   - SiteGround
   - HostGator
   - BlueHost

2. **Cloud Platforms**
   - Railway (supports PHP)
   - Heroku with PHP buildpack
   - AWS EC2
   - DigitalOcean

3. **Your Current XAMPP Setup**
   - If accessible publicly, use your domain/IP
   - Ensure CORS is properly configured

### Backend CORS Configuration

Make sure your backend allows requests from your Vercel domain:

```php
// In backend/config/cors.php
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app', // Add your Vercel domain
];
```

## Testing Your Deployment

### Local Testing
```bash
cd frontend
npm run build
npm run preview
```

### After Deployment
1. Visit your Vercel URL
2. Test login functionality
3. Navigate through different routes
4. Refresh pages to ensure routing works
5. Check browser console for any API errors

## Troubleshooting

### 404 Errors on Page Refresh
✅ Fixed by `vercel.json` rewrites configuration

### API Connection Errors
- Verify `VITE_API_BASE_URL` is set correctly in Vercel
- Check backend CORS settings
- Ensure backend is accessible from Vercel servers

### Build Failures
- Check build logs in Vercel
- Verify all dependencies in package.json
- Test build locally first

## Current Configuration Files

### vercel.json (Root)
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### vite.config.js (Frontend)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
})
```

## Quick Deploy Commands

```bash
# Commit changes
git add .
git commit -m "Configure for Vercel deployment"
git push origin main

# Or use Vercel CLI
vercel --prod
```

## Post-Deployment Checklist

- [ ] Frontend deployed successfully on Vercel
- [ ] Backend deployed and accessible
- [ ] Environment variables configured in Vercel
- [ ] CORS configured in backend
- [ ] Login/authentication working
- [ ] All API endpoints responding
- [ ] Routing working (no 404 on refresh)
- [ ] Images and assets loading correctly

## Need Help?

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify environment variables
4. Test API endpoints directly
