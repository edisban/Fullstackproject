# 🚀 Project Manager Full-Stack System

A professional-grade Project & Student Management ecosystem built with a focus on **Clean Architecture**, security, and seamless deployment via Docker. This project demonstrates a modern approach to full-stack development using a decoupled micro-service structure.

[![CI](https://github.com/edisban/Fullstackproject/actions/workflows/ci.yml/badge.svg)](https://github.com/edisban/Fullstackproject/actions/workflows/ci.yml)

## 🏗️ System Architecture
The platform is organized into three independent services that work in harmony:

* **Backend (`/server`):** A robust REST API built with Spring Boot 3 & Java 17, secured with stateless JWT authentication.
* **Frontend (`/client`):** A modern Single Page Application (SPA) using React 18, TypeScript, and Vite for a fast developer experience.
* **Database (`/db`):** A PostgreSQL 16 instance that is automatically initialized with schema and seed data for a "ready-to-go" environment.
* **Cache (`/redis`):** An optional Redis 7 service, wired for Spring Cache so we can move hot data (sessions, lookups, rate limits, etc.) out of Postgres without changing the persistence layer.



## 🛠️ Tech Stack & Tooling
* **Backend Core:** Spring Boot 3, Java 17, Spring Data JPA, Hibernate, and Spring Data Redis (Lettuce).
* **Security:** Spring Security with **BCrypt** password hashing and **JWT** issuance/validation.
* **Frontend UX:** React 18, TypeScript, and **Material UI (MUI)** with a responsive dark theme.
* **DevOps:** Docker & Docker Compose for orchestration, with **Nginx** acting as a reverse proxy and a shared Maven cache volume to keep container builds fast even on flaky networks.
* **Database migrations:** Flyway-managed SQL scripts stored in [server/src/main/resources/db/migration](server/src/main/resources/db/migration).

## ⚙️ CI/CD
* **GitHub Actions:** [.github/workflows/ci.yml](.github/workflows/ci.yml) runs parallel backend (Maven) and frontend (Vite) jobs on every push/PR to `main`.
* **Automated Deploy:** On successful tests, the workflow builds `server/Dockerfile` and `client/Dockerfile` and publishes images to GitHub Container Registry:
   * Backend: `ghcr.io/edisban/fullstackproject-backend:latest`
   * Frontend: `ghcr.io/edisban/fullstackproject-frontend:latest`
* Consumers can `docker pull` the latest artifacts or reference them directly in deployment manifests.

## 🔐 Key Enterprise Features
* **Identity Management:** Secure authentication flow using industry-standard JWT tokens.
* **Selective Caching:** High-volume read endpoints (projects/students) now use targeted Spring Cache annotations backed by Redis with per-cache TTLs (10 minutes for projects, 5 minutes for students, 1 hour for metadata) managed by a custom `RedisCacheManager`.
* **Self-Service Onboarding:** Users can call `POST /api/auth/register` to create accounts; passwords are hashed with BCrypt before persistence and the UI now keeps them on the login tab so credentials must be re-entered manually.
* **Account Lifecycle Controls:** Authenticated users can permanently remove themselves via the new `DELETE /api/users/me` endpoint (wired to the "Delete Account" button in the header) which also invalidates their JWT and logs them out immediately.
* **Stateless Logout:** Hitting `POST /api/auth/logout` blacklists the presented JWT in Redis until it would have expired naturally, blocking reuse from other devices without keeping server-side sessions.
* **Data Integrity:** Multi-layer validation (Client-side via React and Server-side via JSR-303 Bean Validation).
* **Containerization:** The entire stack is containerized, ensuring a consistent environment across different machines.
* **Database Persistence:** Reliable data storage using Docker named volumes to prevent data loss during container restarts.

## 🐳 Quick Start (Docker)
To get the entire platform running locally with a single command:

1. **Configuration:** Copy the sample environment file:
   ```bash
   cp .env.docker.example .env
   ```
2. **Launch:** Build and start the stack in detached mode:
   ```bash
   docker compose up --build -d
   ```
3. **Access:** Open http://localhost:4173 (frontend) and http://localhost:8080 (backend API).
4. **Create Your Account:** Use the "Create Account" tab on the landing page to register yourself. You will see a "Your account was created successfully. Please log in." snackbar and remain on the login form until you authenticate manually. No manual SQL inserts are required—the backend now provisions the admin account automatically from `APP_ADMIN_*` variables, and every other user can self-register (and later self-delete) from the UI.

## 🧪 E2E Testing (Selenium)
The project includes end-to-end tests using **Selenium WebDriver** to verify user flows in a real browser.

### Test Coverage
- Homepage loading verification
- Login form elements presence
- Invalid login error handling

### Running E2E Tests (Local)
```bash
cd client
npm install
# Make sure Docker services are running:
docker compose up -d
# Then run tests:
npm run test:e2e
```

### Prerequisites (Local)
- Docker services running (`docker compose up -d`)
- Chrome browser installed
- ChromeDriver in PATH (or let Selenium manage it)

## 🗄️ Database Migrations (Flyway)
* Flyway runs automatically on application startup and in CI, ensuring every environment shares the same schema.
* Versioned scripts live in [server/src/main/resources/db/migration](server/src/main/resources/db/migration) (`V1__create_data_tables.sql`, `V2__seed_data.sql`, `V3__remove_seed_users.sql`, `V4__cleanup_seed_users.sql`, etc.).
* To add a change, create a new `V{N}__description.sql` file and commit it. Flyway will execute it once per database.
* For manual runs, you can invoke `mvn -pl server flyway:migrate` (uses the same datasource credentials as the app).