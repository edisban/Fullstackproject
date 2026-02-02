📌 Project Manager – Backend (Spring Boot)
🧾 Description
The backend serves as the core of the Project Manager application, providing a robust REST API for user authentication and comprehensive management of projects and students. It is built using Spring Boot 3 following a clean, layered architecture, modular design, and secure communication via JWT.

Core Features:
🔐 Secure Authentication: State-of-the-art JWT implementation, self-service registration that leaves users logged out until they authenticate, and a protected delete-account endpoint.

📁 Project Management: Full CRUD operations for projects.

👥 Student Management: Full CRUD operations for students linked to specific projects.

🔍 Advanced Search: Search students by ID or Name using optimized JPA queries.

🎯 Robust Validation: Strict input validation and structured global error handling.

⚡ Selective Caching: Targeted Spring Cache annotations back high-traffic reads (projects/students/metadata) with Redis TTLs (10m/5m/1h) and automatic eviction on writes.

🗄️ Relational Database: Fully mapped PostgreSQL schema with Hibernate.

🛠️ Tech Stack
Language: Java 22

Framework: Spring Boot 3.x

Security: Spring Security & JWT

Persistence: Spring Data JPA / Hibernate

Database: PostgreSQL
Migrations: Flyway

Caching: Spring Cache + Redis (Lettuce)

Build Tool: Maven

Boilerplate: Lombok

🧱 Architecture – Layered Structure
The project follows a Domain-Driven Design (DDD) approach:

Controllers: REST endpoints with input validation using ApiResponse wrappers.

Services: Business logic, entity existence checks, and custom exceptions.

Repositories: Spring Data JPA interfaces for automated query generation.

Entities: PostgreSQL table mappings (Project, Student, User) with One-to-Many relationships and Cascade Deletes.

DTOs (Data Transfer Objects): Used for request/response mapping to prevent internal entity leakage.

🧊 Caching & Redis
- Redis 7 runs alongside Postgres (via Docker) and is wired through `RedisConfig`, which configures SSL, timeouts, and serializer defaults for the shared `LettuceConnectionFactory`.
- A custom `RedisCacheManager` gives every cache name its own TTL (projects 10m, students 5m, metadata 1h) and prefixes keys with `cache::` to keep the namespace tidy.
- Only read-heavy service methods opt into `@Cacheable`, while create/update/delete operations issue `@CacheEvict(allEntries = true)` so PostgreSQL stays authoritative.

🔐 Security & Authentication
JWT Flow: Stateless authentication where tokens are signed with a secret key and expire in 24 hours.

Hashing: Passwords are never stored in plain text; they are hashed using BCrypt with per-password salts.

Public Endpoints:
- `POST /api/auth/register` – self-service signup that normalizes usernames and stores BCrypt-hashed passwords.
- `POST /api/auth/login` – exchanges valid credentials for a JWT access token.
- `POST /api/auth/logout` – stateless logout that blacklists the presented JWT in Redis until it would naturally expire.
- `DELETE /api/users/me` – authenticated users can remove their own account; the backend revokes their session, deletes associated data, and blacklists the current JWT.

Admin Bootstrap:
- `AdminUserInitializer` provisions the administrator listed in `APP_ADMIN_USERNAME`/`APP_ADMIN_PASSWORD` on startup (including inside Docker), so no manual SQL insert is required.

Security Components:

JwtAuthenticationFilter: Intercepts and validates tokens per request.

JwtTokenProvider: Handles token generation and validation logic.
TokenBlacklistService: Persists revoked tokens in Redis so blacklisted JWTs are rejected instantly.

🧪 Testing Strategy
To ensure reliability and code quality, the backend includes:

Unit Testing (JUnit 5 & Mockito):

Testing Services in isolation by mocking Repositories.

Validating business logic and exception throwing.

Integration Testing:

Testing REST endpoints using MockMvc.

Verifying JWT authentication filters and security constraints.

Repository Testing:

Using @DataJpaTest to verify custom query methods and database constraints.

🗄️ Database Migrations

Flyway manages schema evolution with SQL scripts in [src/main/resources/db/migration](src/main/resources/db/migration). Notable versions include `V1__create_data_tables.sql` (schema), `V2__seed_data.sql` (demo rows), `V3__remove_seed_users.sql`, and `V4__cleanup_seed_users.sql`, which remove the deprecated SQL-based admin/user inserts now that accounts are provisioned dynamically. New schema changes should be captured by adding a higher-numbered file. The backend automatically runs `flyway:migrate` on startup and during CI, while the Postgres Docker container simply starts empty—Flyway takes care of creating tables and seed data. To apply migrations manually, run:

```bash
mvn -pl server flyway:migrate
```

⚠️ Global Exception Handling
A @ControllerAdvice mechanism ensures that all errors return a consistent JSON structure:

JSON

{
  "data": null,
  "message": "Detailed error message",
  "validationErrors": { "field": "error reason" }
}
Supported cases: Validation Errors, Entity Not Found, Unauthorized Access, Conflict (Duplicate IDs), and Expired JWT.

🌐 API & Database
CORS: Configured to allow secure communication with the Frontend.

Database Schema:

Projects: ID, Unique Name, Description, Start Date, Timestamps.

Students: ID, First/Last Name, Unique Code Number, FK to Projects.

Users: Username, Hashed Password (Auth-only table).