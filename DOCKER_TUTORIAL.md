# 🎓 Docker Deployment Tutorial - Step by Step

This is a hands-on tutorial to get your Gymnazo Christian Academy application running with Docker.

---

## 📚 What You'll Learn

- ✅ How to set up Docker MySQL container
- ✅ How to configure environment variables
- ✅ How to connect your PHP backend to Docker MySQL
- ✅ How to verify everything works
- ✅ Basic Docker troubleshooting

**Time Required:** 15-20 minutes

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Docker Desktop installed and running
- [ ] XAMPP installed (for PHP/Apache)
- [ ] Node.js and npm installed (for React frontend)
- [ ] Git installed
- [ ] Text editor (VS Code, Notepad++, etc.)

---

## 🚀 Step 1: Verify Docker Installation

Open PowerShell and run:

```powershell
docker --version
docker-compose --version
```

**Expected Output:**
```
Docker version 24.0.x, build...
Docker Compose version v2.x.x
```

If you see errors:
1. Make sure Docker Desktop is running (check system tray)
2. Restart Docker Desktop
3. If still not working, reinstall Docker Desktop

---

## 📝 Step 2: Create Environment File

Navigate to your project root:

```powershell
cd C:\xampp\htdocs\gymnazo-christian-academy-teacher-side
```

Create `.env` file:

```powershell
Copy-Item .env.example .env
notepad .env
```

**Edit `.env` with these values:**

```env
DB_ROOT_PASS=rootpassword123
DB_NAME=gymnadb
DB_USER=gymnazo_user
DB_PASS=gymnazo_pass_2024
DB_HOST=localhost
DB_PORT=3306
```

**Save and close** the file.

> **💡 Pro Tip:** Use strong passwords in production!

---

## 🐳 Step 3: Start Docker MySQL Container

Make sure XAMPP MySQL is **STOPPED** (to avoid port conflicts):

```powershell
# Check if port 3306 is free
netstat -ano | findstr :3306
```

If you see output, stop XAMPP MySQL:
1. Open XAMPP Control Panel
2. Click "Stop" next to MySQL

Now start Docker MySQL:

```powershell
docker-compose up -d
```

**Expected Output:**
```
[+] Running 2/2
 ✔ Network gymnazo-christian-academy-teacher-side_gca_network  Created
 ✔ Container gca_mysql                                         Started
```

---

## ✅ Step 4: Verify Container is Running

Check container status:

```powershell
docker ps
```

**Expected Output:**
```
CONTAINER ID   IMAGE       STATUS         PORTS                    NAMES
abc123def456   mysql:8.0   Up 10 seconds  0.0.0.0:3306->3306/tcp  gca_mysql
```

Check container logs:

```powershell
docker logs gca_mysql
```

Look for:
```
[System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections.
```

This means MySQL is ready!

---

## 🗄️ Step 5: Verify Database Initialization

Connect to MySQL inside the container:

```powershell
docker exec -it gca_mysql mysql -u root -p
```

When prompted, enter password: `rootpassword123`

**Inside MySQL prompt**, run:

```sql
SHOW DATABASES;
```

**Expected Output:**
```
+--------------------+
| Database           |
+--------------------+
| gymnadb            |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

Check tables:

```sql
USE gymnadb;
SHOW TABLES;
```

You should see 40+ tables including:
- user
- teacherprofile
- studentprofile
- grade
- announcement
- classschedule
- etc.

Exit MySQL:

```sql
EXIT;
```

**✅ Success!** Your database is initialized.

---

## ⚙️ Step 6: Configure Backend

Navigate to backend directory:

```powershell
cd backend
```

Check if `.env` exists:

```powershell
ls .env
```

If not found, create it:

```powershell
Copy-Item .env.example .env
```

Edit `backend/.env`:

```powershell
notepad .env
```

**Make sure these values are set:**

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gymnadb
DB_USER=gymnazo_user
DB_PASS=gymnazo_pass_2024
```

**Save and close**.

---

## 🧪 Step 7: Test Database Connection

Test PHP connection to Docker MySQL:

```powershell
php -r "try { `$pdo = new PDO('mysql:host=localhost;dbname=gymnadb', 'gymnazo_user', 'gymnazo_pass_2024'); echo 'Connection successful!'; } catch(Exception `$e) { echo 'Error: '`$e->getMessage(); }"
```

**Expected Output:**
```
Connection successful!
```

If you see an error:
1. Check if container is running: `docker ps`
2. Verify credentials in `.env`
3. Make sure port 3306 is not blocked by firewall

---

## 🚀 Step 8: Start XAMPP Apache

1. Open XAMPP Control Panel
2. Click "Start" next to **Apache** (NOT MySQL)
3. Wait for green "Running" status

**Test backend API:**

Open browser and go to:
```
http://localhost/gymnazo-christian-academy-teacher-side/backend/api/auth/get-current-user.php
```

You should see a JSON response (even if not logged in).

---

## ⚛️ Step 9: Start Frontend

Open a **new PowerShell window**:

```powershell
cd C:\xampp\htdocs\gymnazo-christian-academy-teacher-side\frontend
```

Install dependencies (if not already done):

```powershell
npm install --legacy-peer-deps
```

Start development server:

```powershell
npm run dev
```

**Expected Output:**
```
  VITE v7.1.7  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## 🎉 Step 10: Test the Application

Open browser and go to:
```
http://localhost:5173
```

You should see the **Gymnazo Christian Academy Teacher Portal** login page.

**Test login** (if you have a test account):
- Email: `teacher@example.com`
- Password: Your test password

If login works, you're all set! 🎊

---

## 📊 Step 11: Verify Full Setup

Check all services are running:

```powershell
# Check Docker MySQL
docker ps

# Check XAMPP Apache
# Should show "Running" in XAMPP Control Panel

# Check Frontend
# Should show "VITE" running in terminal
```

**Access URLs:**

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5173 | ✅ Running |
| Backend | http://localhost/gymnazo-christian-academy-teacher-side/backend/api | ✅ Running |
| MySQL | localhost:3306 | ✅ Running |

---

## 🛠️ Daily Development Workflow

**Starting your work day:**

```powershell
# 1. Start Docker MySQL (if not running)
docker-compose up -d

# 2. Start XAMPP Apache
# Open XAMPP Control Panel → Start Apache

# 3. Start Frontend
cd frontend
npm run dev
```

**Ending your work day:**

```powershell
# 1. Stop Frontend
# Press Ctrl+C in terminal

# 2. Stop XAMPP Apache
# XAMPP Control Panel → Stop Apache

# 3. Stop Docker (optional - can keep running)
docker-compose stop
```

---

## 🐛 Troubleshooting Common Issues

### Issue 1: Port 3306 Already in Use

**Error:**
```
Error response from daemon: driver failed programming external connectivity:
Bind for 0.0.0.0:3306 failed: port is already allocated.
```

**Solution:**

```powershell
# Find what's using port 3306
netstat -ano | findstr :3306

# Stop XAMPP MySQL
# XAMPP Control Panel → Stop MySQL

# Or change Docker port
# Edit docker-compose.yml:
ports:
  - "3307:3306"  # Use port 3307 instead

# Update backend/.env:
DB_PORT=3307
```

### Issue 2: Container Won't Start

**Check logs:**

```powershell
docker logs gca_mysql
```

**Common fixes:**

1. **Remove and recreate:**
   ```powershell
   docker-compose down -v
   docker-compose up -d
   ```

2. **Check .env file exists:**
   ```powershell
   ls .env
   ```

3. **Verify Docker Desktop is running:**
   - Check system tray for Docker icon
   - Should be green/running

### Issue 3: Cannot Connect from PHP

**Test connection:**

```powershell
cd backend
php -r "try { new PDO('mysql:host=localhost;dbname=gymnadb', 'gymnazo_user', 'gymnazo_pass_2024'); echo 'OK'; } catch(Exception `$e) { echo `$e->getMessage(); }"
```

**If fails:**

1. Check container is running: `docker ps`
2. Verify credentials in `backend/.env`
3. Test MySQL directly:
   ```powershell
   mysql -h 127.0.0.1 -P 3306 -u gymnazo_user -p
   ```

### Issue 4: Database is Empty

**Re-import schema:**

```powershell
# Method 1: Recreate container
docker-compose down -v
docker-compose up -d

# Method 2: Manual import
docker exec -i gca_mysql mysql -u root -prootpassword123 gymnadb < ./docker/mysql/init.sql
```

### Issue 5: Frontend Can't Reach Backend

**Check API URL in `frontend/.env`:**

```env
VITE_API_BASE_URL=http://localhost/gymnazo-christian-academy-teacher-side/backend/api
```

**Test backend directly:**

Open browser:
```
http://localhost/gymnazo-christian-academy-teacher-side/backend/api/auth/get-current-user.php
```

Should return JSON (not 404 error).

---

## 📈 Next Steps

Now that you have the basic setup running:

### Option A: Continue with Current Setup
- ✅ Works well for development
- ✅ Familiar XAMPP workflow
- ✅ Easy to debug

### Option B: Full Docker Setup
See `DOCKER_GUIDE.md` for containerizing everything:
- Backend (PHP/Apache)
- Frontend (Nginx)
- MySQL
- phpMyAdmin

**Benefits:**
- Consistent environment across team
- Easier production deployment
- Better isolation

---

## 📚 Additional Resources

- **Quick Reference:** `DOCKER_QUICK_REFERENCE.md`
- **Detailed Guide:** `DOCKER_GUIDE.md`
- **Architecture:** `DOCKER_ARCHITECTURE.md`
- **Docker Docs:** https://docs.docker.com/

---

## ✅ Checklist - Did Everything Work?

- [ ] Docker MySQL container running (`docker ps`)
- [ ] Database initialized with tables (`docker exec mysql...`)
- [ ] Backend connects to MySQL (PHP test)
- [ ] XAMPP Apache serving backend API
- [ ] Frontend development server running
- [ ] Login page loads in browser
- [ ] Can log in as teacher (if have test account)

**All checked?** Congratulations! You're all set! 🎉

**Having issues?** Check troubleshooting section or contact team.

---

## 💡 Pro Tips for Development

1. **Keep Docker running:** MySQL container can run 24/7 without issues

2. **Use Docker Desktop:** GUI makes it easy to manage containers
   - View logs
   - Restart containers
   - Inspect volumes

3. **Backup regularly:**
   ```powershell
   docker exec gca_mysql mysqldump -u root -prootpassword123 --all-databases > backup.sql
   ```

4. **Monitor logs during development:**
   ```powershell
   docker logs -f gca_mysql
   ```

5. **Quick restart if things get weird:**
   ```powershell
   docker-compose restart
   ```

---

## 🎯 Summary

**What you accomplished:**

✅ Installed and configured Docker MySQL
✅ Initialized Gymnazo Christian Academy database
✅ Connected PHP backend to Docker MySQL
✅ Started frontend development server
✅ Verified full application stack works

**Your setup:**

```
Browser (http://localhost:5173)
    ↓
Frontend (React/Vite on npm dev server)
    ↓
Backend (PHP on XAMPP Apache)
    ↓
Database (MySQL in Docker container)
```

**Commands to remember:**

```powershell
# Start everything
docker-compose up -d                    # MySQL
# Start XAMPP Apache manually
cd frontend && npm run dev              # Frontend

# Check status
docker ps                               # Containers
docker logs gca_mysql                   # MySQL logs

# Stop everything
docker-compose stop                     # MySQL
# Stop XAMPP Apache manually
# Ctrl+C in frontend terminal
```

**Happy coding! 🚀**

---

**Questions or issues?** Check `DOCKER_GUIDE.md` for detailed explanations.
