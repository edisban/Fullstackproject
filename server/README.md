# Project Manager – Backend (Spring Boot)

## Overview
This backend provides the REST API for the Project Manager application. It is built with Spring Boot 3 and targets Java 17. The service handles authentication (JWT), project and student CRUD, search, caching, and database migrations via Flyway.

## Tech Stack
- Java 17
- Spring Boot 3
- Spring Data JPA / Hibernate
- PostgreSQL
- Flyway (database migrations)
- Redis (Lettuce) for caching and token blacklisting
- Maven for build and dependency management

## Architecture — Clean / Layered
The codebase follows a layered architecture to keep concerns separated:

- Controllers: HTTP endpoints that validate input and translate to service calls.
- Services: Business logic, transactions, and orchestration between repositories and other services.
- Repositories: Spring Data JPA interfaces handling persistence operations.
- DTOs: Data Transfer Objects used to isolate internal Entities from API contracts.
- Entities: JPA-mapped domain objects representing tables (Project, Student, User).

This separation makes the code easier to test and evolve.

## Caching & Redis
- Selective caching is applied using Spring Cache annotations. Caches have per-cache TTLs configured by a custom `RedisCacheManager`:
  - `projects` cache: 10 minutes
  - `students` cache: 5 minutes
  - `metadata` cache: 1 hour
- Write operations evict relevant caches to keep PostgreSQL authoritative.
- JWT Blacklisting: On logout, JWTs are written to Redis with TTL equal to the token remaining lifetime. A `TokenBlacklistService` checks Redis to reject blacklisted tokens.

## Database Migrations (Flyway)
- Flyway SQL scripts are placed in `src/main/resources/db/migration` and are applied automatically on application startup.
- Seed data scripts (e.g., `V2__seed_data.sql`) exist for local/dev convenience; CI also runs migrations during builds.

## Project Structure

```
server/
├── src/
│   ├── main/
│   │   ├── java/com/edis/backendproject/
│   │   │   ├── BackendProjectApplication.java    # Spring Boot entry point
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java           # Login, register, logout
│   │   │   │   ├── ProjectController.java        # Project CRUD
│   │   │   │   └── StudentController.java        # Student CRUD & search
│   │   │   ├── service/
│   │   │   │   ├── UserService.java              # User registration & management
│   │   │   │   ├── ProjectService.java           # Project business logic
│   │   │   │   ├── StudentService.java           # Student business logic
│   │   │   │   └── TokenBlacklistService.java    # JWT blacklist on logout
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java           # User persistence
│   │   │   │   ├── ProjectRepository.java        # Project persistence
│   │   │   │   └── StudentRepository.java        # Student persistence
│   │   │   ├── entity/
│   │   │   │   ├── User.java
│   │   │   │   ├── Project.java
│   │   │   │   └── Student.java
│   │   │   ├── dto/
│   │   │   │   ├── ProjectRequest.java
│   │   │   │   ├── ProjectResponse.java
│   │   │   │   ├── StudentRequest.java
│   │   │   │   ├── StudentResponse.java
│   │   │   │   └── RegisterRequest.java
│   │   │   ├── security/
│   │   │   │   ├── SecurityConfig.java           # Spring Security configuration
│   │   │   │   ├── JwtAuthenticationFilter.java  # JWT validation filter
│   │   │   │   └── JwtTokenProvider.java         # JWT creation/validation
│   │   │   └── config/
│   │   │       └── RedisCacheConfig.java         # Redis & cache configuration
│   │   └── resources/
│   │       ├── application.properties             # Spring Boot config
│   │       ├── logback-spring.xml                 # Logging config
│   │       └── db/migration/
│   │           ├── V1__init_schema.sql           # Create tables
│   │           ├── V2__seed_data.sql             # Sample data
│   │           └── V3__alter_*.sql               # Schema changes
│   └── test/
│       └── java/com/edis/backendproject/service/
│           ├── ProjectServiceTest.java
│           ├── StudentServiceTest.java
│           └── UserServiceTest.java
├── pom.xml                      # Maven dependencies
├── Dockerfile
├── mvnw
├── mvnw.cmd
└── README.md
```

## API Endpoints

Base URL: `http://localhost:8081/api` (when running locally)

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------| 
| POST | `/auth/register` | Register new user | ❌ No |
| POST | `/auth/login` | Login (returns JWT) | ❌ No |
| POST | `/auth/logout` | Logout & blacklist token | ✅ Yes |

### Projects

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------| 
| GET | `/projects` | List all projects | ✅ Yes |
| GET | `/projects/{id}` | Get project by ID | ✅ Yes |
| POST | `/projects` | Create project | ✅ Yes |
| PUT | `/projects/{id}` | Update project | ✅ Yes |
| DELETE | `/projects/{id}` | Delete project | ✅ Yes |

### Students

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------| 
| GET | `/students` | List students (supports pagination & search) | ✅ Yes |
| GET | `/students/{id}` | Get student by ID | ✅ Yes |
| POST | `/students` | Create student | ✅ Yes |
| PUT | `/students/{id}` | Update student | ✅ Yes |
| DELETE | `/students/{id}` | Delete student | ✅ Yes |

### User Account

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------| 
| DELETE | `/users/me` | Delete current user account | ✅ Yes |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------| 
| GET | `/actuator/health` | Service health status | ❌ No |

## Local Development (Without Docker)
Requirements: Java 17, Maven, a running PostgreSQL instance (or set DB URL to a local instance).

Run the application locally:

```bash
cd server
mvn spring-boot:run
```

Apply migrations manually:

```bash
mvn -pl server flyway:migrate
```

Run tests:

```bash
mvn -pl server test
```

## Security
- JWT based authentication with BCrypt password hashing.
- Protected endpoints require a valid JWT; expired or blacklisted tokens are rejected.

## Notes
- Admin account is provisioned from environment variables `APP_ADMIN_USERNAME` / `APP_ADMIN_PASSWORD` during startup.
- For local development using Docker, use the `docker compose` commands from the main README.
