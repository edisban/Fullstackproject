# Project Manager Full-Stack System

## 💡 What does this application do? (Core Features)
- User Authentication: register, login, logout (JWT-based), and delete account.
- Project Dashboard: create, read, update, delete projects and view metadata.
- Student Management: add/edit/remove students tied to projects; search by name or student ID.
- Smart Search: fast, incremental search in the UI with server-side filtering by name or ID.

## 🏗️ System Architecture
The platform runs as a containerized full-stack application composed of:

- Frontend: React + Vite (served behind Nginx)
- Backend: Spring Boot REST API (Java 17)
- Database: PostgreSQL
- Cache: Redis (optional but recommended for caching and blacklist)

Data flow (text diagram):

Client -> Nginx Proxy -> Backend -> Postgres / Redis

### Architecture Diagram

Client -> Nginx Proxy -> Backend -> Postgres / Redis

## Project Structure

```
Fullstackproject/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD pipeline
├── client/                      # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/          # UI components (logic-less)
│   │   ├── hooks/               # Custom hooks (business logic)
│   │   ├── pages/               # Page components
│   │   ├── api/                 # API client (Axios)
│   │   ├── context/             # React context (Auth, Snackbar)
│   │   ├── types/               # TypeScript type definitions
│   │   ├── utils/               # Utility functions
│   │   ├── e2e/                 # Selenium E2E tests
│   │   └── App.tsx              # Root component
│   ├── Dockerfile               # Container image
│   ├── nginx.conf               # Reverse proxy config
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                      # Backend (Spring Boot)
│   ├── src/
│   │   ├── main/java/com/edis/backendproject/
│   │   │   ├── controller/      # REST endpoints
│   │   │   ├── service/         # Business logic
│   │   │   ├── repository/      # Data access (JPA)
│   │   │   ├── entity/          # JPA entities
│   │   │   ├── dto/             # Data transfer objects
│   │   │   ├── security/        # JWT & authentication
│   │   │   └── config/          # Spring configuration
│   │   ├── main/resources/
│   │   │   ├── application.properties
│   │   │   └── db/migration/    # Flyway SQL migrations
│   │   └── test/java/           # Unit & integration tests
│   ├── Dockerfile
│   ├── pom.xml                  # Maven dependencies
│   └── mvnw                     # Maven wrapper
├── docker-compose.yml           # Container orchestration
├── .env                         # Local secrets (git-ignored)
├── .env.docker.example          # Template for .env
├── .gitignore
└── README.md                    # This file
```

## Prerequisites
- Docker
- Docker Compose

## 🐳 Quick Start (Local with Docker)
1. Create a `.env` from the example (choose command for your shell):

   - macOS / Linux / WSL:
     ```bash
     cp .env.docker.example .env
     ```
   - PowerShell (Windows):
     ```powershell
     Copy-Item .env.docker.example .env
     ```
   - cmd.exe (Windows):
     ```cmd
     copy .env.docker.example .env
     ```

2. Start the stack:

```bash
docker compose up --build -d
```

3. Verify services:

```bash
docker compose ps
docker compose logs -f backend
```

4. Access the app (using ports from your `.env`):

- Frontend: http://localhost:4173 (default)
- Backend API: http://localhost:8081 (default)

5. Create an account via the frontend's "Create Account" tab.

## 🛠️ Tech Stack & Tooling
- Backend: Spring Boot 3, Java 17, Spring Data JPA, Flyway for migrations
- Frontend: React 18, TypeScript, Vite, Material UI
- Cache: Redis (Lettuce)
- DevOps: Docker, Docker Compose, Nginx reverse proxy

## ⚙️ CI/CD
- GitHub Actions builds backend and frontend images and publishes to GitHub Container Registry. See [.github/workflows/ci.yml](.github/workflows/ci.yml).

## 🧪 Testing
- Unit and integration tests for backend (Maven) and frontend (Vitest). E2E tests use Selenium and require Docker services running.

## 🗄️ Database Migrations
- Flyway is used to manage schema and seed data. Migration scripts live in [server/src/main/resources/db/migration](server/src/main/resources/db/migration). The backend runs Flyway on startup.

## Troubleshooting
- Check container logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

- Health check example:

```bash
curl http://localhost/api/students
```

- Restart services:

```bash
docker compose restart
```

---
