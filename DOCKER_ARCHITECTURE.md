# 🎨 Docker Architecture Diagrams

## Current Setup (MySQL Only)

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Windows Machine                     │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │   Browser    │    │    XAMPP     │    │    Docker     │  │
│  │ (localhost:  │◄──►│   Apache +   │◄──►│     MySQL     │  │
│  │    5173)     │    │     PHP      │    │  (localhost:  │  │
│  │              │    │              │    │     3306)     │  │
│  │  React App   │    │  Backend API │    │               │  │
│  │  (npm dev)   │    │              │    │  ┌─────────┐  │  │
│  └──────────────┘    └──────────────┘    │  │ gymnadb │  │  │
│         │                    │           │  │ Database│  │  │
│         │                    │           │  └─────────┘  │  │
│         │                    │           │               │  │
│         │                    │           │  Volume:      │  │
│         │                    │           │  mysql_data   │  │
│         └────────────────────┘           └───────────────┘  │
│              HTTP Requests                                  │
│          (fetch API / axios)                                │
└─────────────────────────────────────────────────────────────┘

Flow:
1. User opens http://localhost:5173 in browser
2. React app makes API calls to http://localhost/backend/api
3. PHP (XAMPP) connects to localhost:3306 (Docker MySQL)
4. MySQL returns data to PHP
5. PHP returns JSON to React
6. React displays data to user
```

---

## Full Docker Setup (Recommended)

```
┌─────────────────────────────────────────────────────────────────┐
│                     Your Windows Machine                         │
│                                                                  │
│  ┌──────────────┐                                               │
│  │   Browser    │                                               │
│  │  (localhost) │                                               │
│  └──────┬───────┘                                               │
│         │                                                        │
│  ┌──────▼────────────────────────────────────────────────────┐  │
│  │              Docker Network (gca_network)                 │  │
│  │                                                           │  │
│  │  ┌─────────────┐   ┌─────────────┐   ┌───────────────┐  │  │
│  │  │  Frontend   │   │   Backend   │   │    MySQL      │  │  │
│  │  │   (Nginx)   │──►│  (Apache)   │──►│   Server      │  │  │
│  │  │             │   │             │   │               │  │  │
│  │  │ Port: 5173  │   │ Port: 8080  │   │ Port: 3306    │  │  │
│  │  │             │   │             │   │               │  │  │
│  │  │ React App   │   │  PHP API    │   │  ┌─────────┐  │  │  │
│  │  │             │   │             │   │  │ gymnadb │  │  │  │
│  │  └─────────────┘   └─────────────┘   │  └─────────┘  │  │  │
│  │                                       │               │  │  │
│  │  ┌─────────────┐                     │  Volume:      │  │  │
│  │  │ phpMyAdmin  │────────────────────►│  mysql_data   │  │  │
│  │  │             │                     │               │  │  │
│  │  │ Port: 8081  │                     │               │  │  │
│  │  └─────────────┘                     └───────────────┘  │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Services:
- Frontend: http://localhost:5173
- Backend:  http://localhost:8080/api
- phpMyAdmin: http://localhost:8081
- MySQL: localhost:3306 (internal only)

Advantages:
✅ Consistent environment across team
✅ Easy deployment to production
✅ All services isolated in containers
✅ One command to start everything
```

---

## Network Communication

### Current Setup

```
┌──────────────────────────────────────┐
│          localhost (127.0.0.1)        │
│                                       │
│  ┌─────────┐         ┌─────────────┐ │
│  │  PHP    │────────►│   Docker    │ │
│  │ (XAMPP) │  Port   │   MySQL     │ │
│  │         │  3306   │             │ │
│  └─────────┘         └─────────────┘ │
│                                       │
│  Connection String:                   │
│  host=localhost                       │
│  port=3306                            │
└──────────────────────────────────────┘
```

### Full Docker Setup

```
┌────────────────────────────────────────┐
│     Docker Network: gca_network         │
│                                         │
│  ┌─────────┐         ┌─────────────┐   │
│  │Backend  │────────►│   MySQL     │   │
│  │Container│  DNS    │  Container  │   │
│  │         │ Resolves│             │   │
│  └─────────┘         └─────────────┘   │
│                                         │
│  Connection String:                     │
│  host=mysql    ← Service name in YAML  │
│  port=3306     ← Internal port         │
└─────────────────────────────────────────┘

Docker provides DNS resolution:
'mysql' → Resolves to MySQL container IP
```

---

## Volume Architecture

```
┌────────────────────────────────────────────────────────┐
│               Docker Host (Windows)                     │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Named Volume: mysql_data                        │  │
│  │  Location: Docker's internal storage             │  │
│  │  C:\ProgramData\Docker\volumes\...                │  │
│  │                                                   │  │
│  │  ┌──────────────────────────────────────┐        │  │
│  │  │  MySQL Data Files:                   │        │  │
│  │  │  - ibdata1                           │        │  │
│  │  │  - ib_logfile0, ib_logfile1          │        │  │
│  │  │  - gymnadb/ (database directory)     │        │  │
│  │  │    - user.ibd                        │        │  │
│  │  │    - profile.ibd                     │        │  │
│  │  │    - teachers.ibd                    │        │  │
│  │  │    - ... (all tables)                │        │  │
│  │  └──────────────────────────────────────┘        │  │
│  └──────────────────────────────────────────────────┘  │
│                          ▲                             │
│                          │ Mounted to                  │
│                          │                             │
│  ┌──────────────────────┴──────────────────────────┐  │
│  │    MySQL Container                              │  │
│  │    Path: /var/lib/mysql                         │  │
│  │                                                  │  │
│  │    MySQL Server Process                         │  │
│  │    - Reads/writes to /var/lib/mysql             │  │
│  │    - Volume ensures data persists                │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Bind Mount: ./docker/mysql/init.sql             │  │
│  │  Project Location: C:\xampp\htdocs\...\init.sql  │  │
│  │                                                   │  │
│  │  Mounted to: /docker-entrypoint-initdb.d/        │  │
│  │  Purpose: Auto-run on first container creation   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

Key Points:
- Named volumes: Managed by Docker, best for databases
- Bind mounts: Direct link to host files, best for config
- Data persists even if container is deleted
- Only destroyed with: docker-compose down -v
```

---

## Port Mapping

```
┌────────────────────────────────────────────────────┐
│           Windows (Your Machine)                    │
│                                                     │
│  Browser makes request to:                         │
│  http://localhost:3306                             │
│         │                                           │
│         │ Windows routes to Docker                 │
│         ▼                                           │
│  ┌──────────────────────────────────────────────┐  │
│  │  Docker Port Mapping                         │  │
│  │                                              │  │
│  │  Host Port    →    Container Port           │  │
│  │    3306       →         3306                │  │
│  │    8080       →          80                 │  │
│  │    5173       →          80                 │  │
│  │    8081       →          80                 │  │
│  └──────────────────────────────────────────────┘  │
│         │                                           │
│         ▼                                           │
│  ┌──────────────────────────────────────────────┐  │
│  │  MySQL Container                             │  │
│  │  Internal Port: 3306                         │  │
│  │  Listens on: 0.0.0.0:3306                    │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘

Configuration in docker-compose.yml:
ports:
  - "3306:3306"  # Windows:3306 → Container:3306
  
Access from:
- Windows: localhost:3306
- Other containers: mysql:3306 (service name)
```

---

## Lifecycle

```
Initial Setup:
┌──────────────────────────────────────────────┐
│ docker-compose up -d                         │
└──────────────┬───────────────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Pull MySQL image     │ (if not exists)
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Create volume        │ mysql_data
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Create network       │ gca_network
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Start container      │ gca_mysql
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Run init.sql         │ (first time only)
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ MySQL ready!         │ ✅
    └──────────────────────┘

Regular Usage:
┌──────────────────────────────────────────────┐
│ docker-compose start                         │ → Start existing containers
│ docker-compose stop                          │ → Stop containers (keep data)
│ docker-compose restart                       │ → Restart containers
│ docker-compose down                          │ → Stop & remove containers (keep volumes)
│ docker-compose down -v                       │ → Remove everything including data ⚠️
└──────────────────────────────────────────────┘

Data Flow During Restart:
┌──────────────────────────────────────────────┐
│ docker-compose restart                       │
└──────────────┬───────────────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Stop container       │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Start container      │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Mount existing volume│
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Data restored!       │ ✅ All data intact
    └──────────────────────┘
```

---

## Security Model

```
┌──────────────────────────────────────────────────────────┐
│                    Security Layers                        │
│                                                           │
│  1. Network Isolation                                    │
│     ┌─────────────────────────────────────────────────┐  │
│     │ gca_network (bridge)                            │  │
│     │ - Isolated from other Docker networks           │  │
│     │ - Only exposed ports accessible from host       │  │
│     └─────────────────────────────────────────────────┘  │
│                                                           │
│  2. Port Exposure Control                                │
│     ┌─────────────────────────────────────────────────┐  │
│     │ Published Ports:                                │  │
│     │ - 3306 → MySQL (remove in production)           │  │
│     │ - 8080 → Backend API (public)                   │  │
│     │ - 5173 → Frontend (public)                      │  │
│     │                                                 │  │
│     │ Internal Only:                                  │  │
│     │ - Container-to-container communication          │  │
│     └─────────────────────────────────────────────────┘  │
│                                                           │
│  3. Credentials Management                               │
│     ┌─────────────────────────────────────────────────┐  │
│     │ .env file (gitignored)                          │  │
│     │ - Never committed to repository                 │  │
│     │ - Team members use own values                   │  │
│     │                                                 │  │
│     │ Production: Use Docker Secrets                  │  │
│     │ - Encrypted at rest                             │  │
│     │ - Only accessible to authorized containers      │  │
│     └─────────────────────────────────────────────────┘  │
│                                                           │
│  4. Container Isolation                                  │
│     ┌─────────────────────────────────────────────────┐  │
│     │ Each container runs in isolated namespace       │  │
│     │ - Separate process tree                         │  │
│     │ - Separate file system                          │  │
│     │ - Separate network stack                        │  │
│     │ - Limited resource access                       │  │
│     └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘

Production Hardening:
┌──────────────────────────────────────────┐
│ 1. Remove exposed MySQL port            │
│    Remove: ports: - "3306:3306"          │
│                                          │
│ 2. Use specific image versions          │
│    Use: mysql:8.0.35 not mysql:8.0       │
│                                          │
│ 3. Set resource limits                   │
│    Add: deploy.resources.limits          │
│                                          │
│ 4. Enable restart policies               │
│    Set: restart: always                  │
│                                          │
│ 5. Use Docker secrets                    │
│    Replace env vars with secrets         │
└──────────────────────────────────────────┘
```

---

For implementation details, see: `DOCKER_GUIDE.md`
