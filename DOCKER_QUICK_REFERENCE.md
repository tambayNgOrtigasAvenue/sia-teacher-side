# ⚡ Docker Quick Reference

## 🚀 Most Used Commands

### Start Everything
```powershell
docker-compose up -d
```

### Stop Everything
```powershell
docker-compose down
```

### View Logs
```powershell
docker-compose logs -f
```

### Restart Containers
```powershell
docker-compose restart
```

### Rebuild After Code Changes
```powershell
docker-compose up -d --build
```

---

## 🔍 Check Status

### List Running Containers
```powershell
docker ps
```

### Check Container Logs
```powershell
docker logs gca_mysql
docker logs gca_backend
docker logs gca_frontend
```

### Access Container Shell
```powershell
docker exec -it gca_mysql bash
```

### Connect to MySQL
```powershell
docker exec -it gca_mysql mysql -u root -p
```

---

## 💾 Database Operations

### Backup Database
```powershell
docker exec gca_mysql mysqldump -u root -prootpassword123 gymnadb > backup.sql
```

### Restore Database
```powershell
docker exec -i gca_mysql mysql -u root -prootpassword123 gymnadb < backup.sql
```

### Import init.sql
```powershell
docker exec -i gca_mysql mysql -u root -prootpassword123 gymnadb < ./docker/mysql/init.sql
```

---

## 🧹 Cleanup

### Remove Stopped Containers
```powershell
docker container prune
```

### Remove All (⚠️ DELETES DATA)
```powershell
docker-compose down -v
```

### Clean System
```powershell
docker system prune
```

---

## 🐛 Troubleshooting

### Port Conflict
```powershell
# Check what's using port 3306
netstat -ano | findstr :3306

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change Docker port in docker-compose.yml:
ports:
  - "3307:3306"
```

### Container Won't Start
```powershell
# Check logs
docker-compose logs mysql

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

### Cannot Connect to Database
```powershell
# Test connection
php -r "try { new PDO('mysql:host=localhost;dbname=gymnadb', 'gymnazo_user', 'gymnazo_pass_2024'); echo 'OK'; } catch(Exception $e) { echo $e->getMessage(); }"
```

---

## 📦 Services & Ports

| Service | Port | URL |
|---------|------|-----|
| MySQL | 3306 | localhost:3306 |
| Backend | 8080 | http://localhost:8080 |
| Frontend | 5173 | http://localhost:5173 |
| phpMyAdmin | 8081 | http://localhost:8081 |

---

## 🔐 Default Credentials

**MySQL:**
- User: `gymnazo_user`
- Password: `gymnazo_pass_2024`
- Database: `gymnadb`

**phpMyAdmin:**
- User: `root`
- Password: `rootpassword123`

---

## 📝 Common Workflows

### First Time Setup
```powershell
# 1. Copy .env.example to .env
Copy-Item .env.example .env

# 2. Edit .env with your values
notepad .env

# 3. Start containers
docker-compose up -d

# 4. Check logs
docker-compose logs -f mysql

# 5. Verify database
docker exec -it gca_mysql mysql -u root -p -e "SHOW DATABASES;"
```

### Development Workflow
```powershell
# 1. Start Docker MySQL
docker-compose up -d

# 2. Start XAMPP Apache

# 3. Start Frontend
cd frontend
npm run dev
```

### Update Database Schema
```powershell
# 1. Edit docker/mysql/init.sql

# 2. Recreate database
docker-compose down -v
docker-compose up -d

# Or manually import:
docker exec -i gca_mysql mysql -u root -p gymnadb < ./docker/mysql/init.sql
```

---

## 🎯 Pro Tips

1. **Always use `-d` flag** to run in background:
   ```powershell
   docker-compose up -d
   ```

2. **View real-time logs** during development:
   ```powershell
   docker-compose logs -f mysql
   ```

3. **Keep .env out of Git**:
   ```gitignore
   .env
   ```

4. **Backup before major changes**:
   ```powershell
   docker exec gca_mysql mysqldump -u root -p --all-databases > full_backup.sql
   ```

5. **Use named volumes** for persistence:
   - Data survives container deletion
   - Better performance than bind mounts

---

For detailed explanations, see: `DOCKER_GUIDE.md`
