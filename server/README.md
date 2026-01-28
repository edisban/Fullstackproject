📌 Project Manager – Backend (Spring Boot)
🧾 Description
The backend serves as the core of the Project Manager application, providing a robust REST API for user authentication and comprehensive management of projects and students. It is built using Spring Boot 3 following a clean, layered architecture, modular design, and secure communication via JWT.

Core Features:
🔐 Secure Authentication: State-of-the-art JWT implementation.

📁 Project Management: Full CRUD operations for projects.

👥 Student Management: Full CRUD operations for students linked to specific projects.

🔍 Advanced Search: Search students by ID or Name using optimized JPA queries.

🎯 Robust Validation: Strict input validation and structured global error handling.

🗄️ Relational Database: Fully mapped PostgreSQL schema with Hibernate.

🛠️ Tech Stack
Language: Java 22

Framework: Spring Boot 3.x

Security: Spring Security & JWT

Persistence: Spring Data JPA / Hibernate

Database: PostgreSQL

Build Tool: Maven

Boilerplate: Lombok

🧱 Architecture – Layered Structure
The project follows a Domain-Driven Design (DDD) approach:

Controllers: REST endpoints with input validation using ApiResponse wrappers.

Services: Business logic, entity existence checks, and custom exceptions.

Repositories: Spring Data JPA interfaces for automated query generation.

Entities: PostgreSQL table mappings (Project, Student, User) with One-to-Many relationships and Cascade Deletes.

DTOs (Data Transfer Objects): Used for request/response mapping to prevent internal entity leakage.

🔐 Security & Authentication
JWT Flow: Stateless authentication where tokens are signed with a secret key and expire in 24 hours.

Hashing: Passwords are never stored in plain text; they are hashed using SHA-256.

Security Components:

JwtAuthenticationFilter: Intercepts and validates tokens per request.

JwtTokenProvider: Handles token generation and validation logic.

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