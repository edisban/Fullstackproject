🚀 Project Manager Full-Stack System
A professional-grade Project & Student Management ecosystem designed with a focus on clean architecture, containerization, and secure data handling. This system demonstrates a modern approach to full-stack development using a decoupled micro-service structure.

🏗️ System Architecture
The repository is organized into two primary independent services, managed by Docker Compose:

- /server (Backend): Spring Boot 3 / Java 17 REST API secured with Spring Security & JWT.
- /client (Frontend): React 18 + TypeScript SPA powered by Vite and Material UI.
- /db (Infrastructure): PostgreSQL 16 container seeded via schema.sql for deterministic environments.

🛠️ Tech Stack & Tooling
Backend Core
Spring Boot 3 & Java 22: Utilizing the latest features for robust backend logic.

Spring Security & JWT: Implementation of stateless authentication and secure authorization flows.

Data Persistence: PostgreSQL integration via Spring Data JPA & Hibernate for complex relational mapping (One-to-Many).

Quality & Maintenance: Automated schema initialization via schema.sql and data.sql.

Frontend Experience
React 18 & TypeScript: Scalable UI components with strict type-safety to eliminate runtime errors.

Material-UI (MUI): A professional design system featuring a custom Responsive Dark Theme.

State & API: Optimized form handling with React Hook Form and centralized API logic via Axios Interceptors.

🔐 Key Enterprise Features
Identity Management: Secure JWT-based authentication with automated token injection in the frontend.

Data Integrity: Strict validation layers on both the Client (React Hook Form) and Server (JSR-303 / Bean Validation).

Performance UX: Integrated Skeleton Loaders and optimized search functionality for a seamless user experience.

Database Reliability: Cascading deletes and unique constraints managed through PostgreSQL.

docker-compose up --build
🐳 Deployment & Orchestration (Docker)
The repo ships with first-class Docker support (multi-stage images + Compose). To run the entire stack locally:

1. Clone the repository and switch into it.
2. Copy the sample env file and adjust secrets/ports as needed:
	```bash
	cp .env.docker.example .env
	```
	Update the new `.env` file with your secrets—`APP_ADMIN_USERNAME` and `APP_ADMIN_PASSWORD` control the bootstrap admin account used by both the SQL seed and the runtime initializer (defaults to `admin` / `admin`).
3. Build and launch every service in the background:
	```bash
	docker compose up --build -d
	```
4. Visit the app at http://localhost:4173 (frontend). The API is available on http://localhost:8081 and PostgreSQL on port 5432.

| Service   | Image / Path    | Port (host→container) | Notes |
|-----------|-----------------|-----------------------|-------|
| frontend  | client/Dockerfile | 4173 → 80            | Nginx serves the Vite build and proxies `/api` to the backend. |
| backend   | server/Dockerfile | 8081 → 8080          | Spring Boot jar with env-driven DB/JWT/CORS settings. |
| postgres  | postgres:16-alpine | 5432 → 5432         | Auto-seeded via `server/schema.sql/*.sql`, persisted by a named volume. |

Once the stack is healthy you can sign in with `admin` / `admin`, or whatever credentials you configured via the admin env vars.

Useful commands:

- `docker compose logs -f backend` – tail backend logs.
- `docker compose down` – stop containers (keep volume data).
- `docker compose down -v` – stop everything and delete the Postgres volume.

🧪 Testing & Quality
Backend: Unit and Integration tests using JUnit 5 and Mockito.

Frontend: Component and hook testing via Vitest and React Testing Library.