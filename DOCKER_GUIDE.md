# 🐳 Complete Docker Deployment Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Current Setup Explained](#current-setup-explained)
3. [Full Docker Setup](#full-docker-setup)
4. [Docker Commands Reference](#docker-commands-reference)
5. [Troubleshooting](#troubleshooting)
6. [Production Deployment](#production-deployment)

---

## 🚀 Quick Start

### Current Setup (MySQL Only)

**What you have:**
- Docker container for MySQL 8.0
- XAMPP for PHP/Apache (not containerized)
- npm dev server for React frontend (not containerized)

**How to use:**

```powershell
# 1. Create .env file in project root
DB_ROOT_PASS=rootpassword123
DB_NAME=gymnadb
DB_USER=gymnazo_user
DB_PASS=gymnazo_pass_2024

# 2. Start MySQL container
docker-compose up -d

# 3. Verify it's running
docker ps

# 4. Start XAMPP Apache (make sure XAMPP MySQL is OFF)

# 5. Update backend/.env to use Docker MySQL
DB_HOST=localhost
DB_USER=gymnazo_user
DB_PASS=gymnazo_pass_2024

# 6. Start frontend
cd frontend
npm run dev
```

---

## 📚 Current Setup Explained

### docker-compose.yml Breakdown

```yaml
version: '3.8'
# Docker Compose file format version
# 3.8 is stable and widely supported

services:
  mysql:
    image: mysql:8.0
    # Uses official MySQL 8.0 image from Docker Hub
    # No custom build needed - pulls pre-built image
    
    container_name: gca_mysql
    # Custom name for easy reference
    # Use: docker logs gca_mysql, docker exec -it gca_mysql bash
    
    ports:
      - "3306:3306"
    # Format: "HOST_PORT:CONTAINER_PORT"
    # Maps container's port 3306 to your Windows port 3306
    # Your PHP can connect to localhost:3306
    # Change to "3307:3306" if XAMPP MySQL is running
    
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASS}
      # Root user password from .env file
      # Used for administrative tasks
      
      MYSQL_DATABASE: ${DB_NAME}
      # Auto-creates 'gymnadb' database on first run
      
      MYSQL_USER: ${DB_USER}
      # Creates non-root user 'gymnazo_user'
      # This is what your application should use
      
      MYSQL_PASSWORD: ${DB_PASS}
      # Password for the non-root user
      # Automatically granted all privileges on MYSQL_DATABASE
    
    volumes:
      - mysql_data:/var/lib/mysql
      # Named volume for data persistence
      # Data survives container deletion/recreation
      # Stored in Docker's internal storage (not project folder)
      
      - ./docker/mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
      # Mounts local init.sql into special directory
      # MySQL automatically runs .sql files in /docker-entrypoint-initdb.d/
      # Only runs if database is empty (first container creation)
    
    networks:
      - gca_network
      # Connects to custom network
      # Allows communication with other containers by service name

volumes:
  mysql_data:
  # Named volume declaration
  # Docker manages storage location
  # Persists even if containers are deleted

networks:
  gca_network:
    driver: bridge
    # Default Docker network driver
    # Containers on same network can talk to each other
    # Provides DNS resolution (service name -> IP)
```

### Why Environment Variables?

**Without .env:**
```yaml
MYSQL_ROOT_PASSWORD: rootpassword123  # ❌ Exposed in Git
```

**With .env:**
```yaml
MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASS}  # ✅ Secret in .env (gitignored)
```

**Benefits:**
- 🔒 **Security:** Secrets not committed to version control
- 🔄 **Flexibility:** Different values per environment (dev/staging/prod)
- 👥 **Team-friendly:** Each developer can use own passwords

### Why Port Mapping?

```yaml
ports:
  - "3306:3306"
```

**What this does:**
- Container MySQL listens on port 3306 (inside container)
- Your Windows machine can access it at localhost:3306
- PHP in XAMPP connects to localhost:3306

**Port conflict scenario:**
```yaml
ports:
  - "3307:3306"  # Map to different host port
```
Then connect with: `localhost:3307`

### Why Volumes?

**Without volume:**
```
docker-compose down  # ❌ All data lost!
```

**With volume:**
```
docker-compose down  # ✅ Data persists
docker-compose up -d # ✅ Data restored
```

**Volume types:**

1. **Named volume (current setup):**
   ```yaml
   - mysql_data:/var/lib/mysql
   ```
   - Managed by Docker
   - Stored in Docker's internal storage
   - Best for databases

2. **Bind mount (init.sql):**
   ```yaml
   - ./docker/mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
   ```
   - Links project file to container
   - Changes on host reflect in container immediately
   - Best for config files

### Why Networks?

```yaml
networks:
  - gca_network
```

**Enables:**
- 🔗 Container-to-container communication
- 📛 DNS resolution (use service names instead of IPs)
- 🔒 Network isolation from other Docker projects

**Example:**
```php
// Without custom network (future multi-container setup):
$host = '172.18.0.2';  // ❌ Hard-coded IP, changes on restart

// With custom network:
$host = 'mysql';  // ✅ DNS resolves to MySQL container IP automatically
```

---

## 🎯 Full Docker Setup

If you want to containerize everything (recommended for production):

### Step 1: Use Full Docker Compose

```powershell
# Rename current file (backup)
Rename-Item docker-compose.yml docker-compose.mysql-only.yml

# Use full setup
Rename-Item docker-compose.full.yml docker-compose.yml
```

### Step 2: Update .env File

Add these variables:

```env
# MySQL Configuration
DB_ROOT_PASS=rootpassword123
DB_NAME=gymnadb
DB_USER=gymnazo_user
DB_PASS=gymnazo_pass_2024

# Backend will use 'mysql' as hostname (service name)
DB_HOST=mysql
DB_PORT=3306

# Application URLs
API_URL=http://localhost:8080
FRONTEND_URL=http://localhost:5173
```

### Step 3: Update Backend .env

```env
DB_HOST=mysql  # ← Service name from docker-compose.yml
DB_PORT=3306
DB_NAME=gymnadb
DB_USER=gymnazo_user
DB_PASS=gymnazo_pass_2024
```

### Step 4: Update Frontend API URL

Edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Step 5: Build and Start Everything

```powershell
# Build images (first time or after code changes)
docker-compose build

# Start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Step 6: Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Teacher login |
| Backend API | http://localhost:8080/api | N/A |
| phpMyAdmin | http://localhost:8081 | root / rootpassword123 |
| MySQL Direct | localhost:3306 | gymnazo_user / gymnazo_pass_2024 |

---

## 🛠️ Docker Commands Reference

### Container Management

```powershell
# Start containers
docker-compose up -d

# Start and rebuild
docker-compose up -d --build

# Stop containers (keeps data)
docker-compose stop

# Stop and remove containers (keeps volumes)
docker-compose down

# Stop and remove everything including volumes (⚠️ DELETES DATA)
docker-compose down -v

# Restart containers
docker-compose restart

# View running containers
docker-compose ps
docker ps

# View all containers (including stopped)
docker ps -a
```

### Logs and Debugging

```powershell
# View logs (all services)
docker-compose logs

# Follow logs (real-time)
docker-compose logs -f

# View logs for specific service
docker-compose logs mysql
docker-compose logs backend

# View last 100 lines
docker-compose logs --tail=100

# Access container shell
docker exec -it gca_mysql bash
docker exec -it gca_backend bash

# Access MySQL directly
docker exec -it gca_mysql mysql -u root -p
```

### Database Operations

```powershell
# Backup database
docker exec gca_mysql mysqldump -u root -prootpassword123 gymnadb > backup.sql

# Restore database
docker exec -i gca_mysql mysql -u root -prootpassword123 gymnadb < backup.sql

# Import SQL file
docker exec -i gca_mysql mysql -u root -prootpassword123 gymnadb < ./docker/mysql/init.sql

# Check database size
docker exec gca_mysql mysql -u root -prootpassword123 -e "SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.TABLES WHERE table_schema='gymnadb';"
```

### Volume Management

```powershell
# List volumes
docker volume ls

# Inspect volume
docker volume inspect gymnazo-christian-academy-teacher-side_mysql_data

# Remove unused volumes
docker volume prune

# Remove specific volume (⚠️ DELETES DATA)
docker volume rm gymnazo-christian-academy-teacher-side_mysql_data
```

### Network Management

```powershell
# List networks
docker network ls

# Inspect network
docker network inspect gymnazo-christian-academy-teacher-side_gca_network

# Remove unused networks
docker network prune
```

### Image Management

```powershell
# List images
docker images

# Remove image
docker rmi mysql:8.0

# Remove unused images
docker image prune

# Remove all unused images
docker image prune -a

# Pull latest image
docker pull mysql:8.0
```

### System Cleanup

```powershell
# Remove stopped containers
docker container prune

# Remove unused networks
docker network prune

# Remove unused volumes
docker volume prune

# Remove unused images
docker image prune

# Clean everything (⚠️ NUCLEAR OPTION)
docker system prune -a --volumes
```

---

## 🐛 Troubleshooting

### Issue 1: Port Already in Use

**Error:**
```
Error: bind: address already in use
```

**Solution:**
```powershell
# Find process using port 3306
netstat -ano | findstr :3306

# Stop XAMPP MySQL or change Docker port
# Option A: Stop XAMPP MySQL
# Control Panel → Stop MySQL

# Option B: Change Docker port
# Edit docker-compose.yml:
ports:
  - "3307:3306"  # Use 3307 instead

# Update backend/.env:
DB_PORT=3307
```

### Issue 2: Container Won't Start

**Check logs:**
```powershell
docker-compose logs mysql
docker logs gca_mysql
```

**Common causes:**

1. **Missing .env file:**
   ```powershell
   # Create .env file in project root
   New-Item -Path ".env" -ItemType File
   ```

2. **Invalid environment variables:**
   ```powershell
   # Verify .env file exists and has correct format
   cat .env
   ```

3. **Corrupted volume:**
   ```powershell
   # Remove and recreate volume
   docker-compose down -v
   docker-compose up -d
   ```

### Issue 3: Cannot Connect to Database

**Error in PHP:**
```
SQLSTATE[HY000] [2002] Connection refused
```

**Solutions:**

1. **Check container is running:**
   ```powershell
   docker ps | findstr gca_mysql
   ```

2. **Verify port mapping:**
   ```powershell
   docker port gca_mysql
   # Should show: 3306/tcp -> 0.0.0.0:3306
   ```

3. **Test connection:**
   ```powershell
   # From Windows
   mysql -h 127.0.0.1 -P 3306 -u gymnazo_user -p

   # From PHP
   php -r "try { new PDO('mysql:host=localhost;port=3306;dbname=gymnadb', 'gymnazo_user', 'gymnazo_pass_2024'); echo 'Connected!'; } catch(Exception $e) { echo $e->getMessage(); }"
   ```

4. **Check backend/.env:**
   ```env
   DB_HOST=localhost  # ← For XAMPP PHP
   # OR
   DB_HOST=mysql      # ← For containerized PHP
   ```

### Issue 4: Init Script Not Running

**Symptoms:**
- Database is empty
- Tables not created

**Solutions:**

1. **Check if script was run:**
   ```powershell
   docker exec -it gca_mysql mysql -u root -p -e "SHOW TABLES FROM gymnadb;"
   ```

2. **Script only runs on first creation:**
   ```powershell
   # Delete volume and recreate
   docker-compose down -v
   docker-compose up -d
   ```

3. **Manually import:**
   ```powershell
   docker exec -i gca_mysql mysql -u root -prootpassword123 gymnadb < ./docker/mysql/init.sql
   ```

### Issue 5: Permission Denied

**Error:**
```
MySQL Error: Access denied for user 'gymnazo_user'@'%'
```

**Solution:**
```powershell
# Connect as root
docker exec -it gca_mysql mysql -u root -p

# Grant privileges
GRANT ALL PRIVILEGES ON gymnadb.* TO 'gymnazo_user'@'%';
FLUSH PRIVILEGES;
EXIT;
```

### Issue 6: Out of Disk Space

**Check space:**
```powershell
docker system df
```

**Clean up:**
```powershell
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes (⚠️ Check first!)
docker volume prune
```

---

## 🚀 Production Deployment

### Security Hardening

1. **Use secrets for passwords:**
   ```powershell
   # Generate secure password
   [System.Web.Security.Membership]::GeneratePassword(32, 8)
   ```

2. **Don't expose ports unnecessarily:**
   ```yaml
   # Instead of:
   ports:
     - "3306:3306"  # ❌ Exposed to internet
   
   # Use:
   # No ports section if only containers need access
   ```

3. **Use specific image tags:**
   ```yaml
   # Instead of:
   image: mysql:8.0  # ❌ Tag can change
   
   # Use:
   image: mysql:8.0.35  # ✅ Specific version
   ```

4. **Limit container resources:**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 2G
   ```

### Production docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0.35
    container_name: gca_mysql_prod
    restart: always  # Auto-restart on failure
    environment:
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/db_root_password
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD_FILE: /run/secrets/db_password
    volumes:
      - mysql_data:/var/lib/mysql
    secrets:
      - db_root_password
      - db_password
    networks:
      - gca_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 30s
      timeout: 10s
      retries: 3

secrets:
  db_root_password:
    file: ./secrets/db_root_password.txt
  db_password:
    file: ./secrets/db_password.txt

volumes:
  mysql_data:

networks:
  gca_network:
    driver: bridge
```

### Backup Strategy

**Automated backup script:**
```powershell
# Create backup-db.ps1
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "backup_$timestamp.sql"

docker exec gca_mysql mysqldump -u root -prootpassword123 --all-databases > $backupFile

Write-Host "Backup created: $backupFile"
```

**Schedule with Task Scheduler:**
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily at 2 AM
4. Action: Start a program
5. Program: `powershell.exe`
6. Arguments: `-File C:\path\to\backup-db.ps1`

---

## 📚 Additional Resources

- **Docker Documentation:** https://docs.docker.com/
- **Docker Compose Reference:** https://docs.docker.com/compose/compose-file/
- **MySQL Docker Hub:** https://hub.docker.com/_/mysql
- **Best Practices:** https://docs.docker.com/develop/dev-best-practices/

---

## ✅ Summary

### Current Setup (What You Have)
- ✅ MySQL in Docker container
- ✅ Persistent data storage
- ✅ Auto-initialization with init.sql
- ❌ Backend still on XAMPP
- ❌ Frontend still on npm dev server

### Recommended Setup (docker-compose.full.yml)
- ✅ MySQL containerized
- ✅ PHP/Apache containerized
- ✅ React/Nginx containerized
- ✅ phpMyAdmin included
- ✅ Full isolation and portability

### When to Use Each

**Current Setup (MySQL only):**
- ✅ Quick development
- ✅ Familiar XAMPP workflow
- ✅ Easy debugging with XAMPP logs
- ✅ Less Docker knowledge needed

**Full Docker Setup:**
- ✅ Production deployment
- ✅ Team collaboration (same environment)
- ✅ CI/CD pipelines
- ✅ Easier scaling

Choose based on your needs! 🎯
