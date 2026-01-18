🚀 Project Manager Full-Stack System
A robust Project & Student Management system built with a focus on modern architecture, containerization, and secure data handling.

🛠️ Tech Stack & Tools
Backend (The Core)
Java 22 & Spring Boot 3: High-performance backend logic.

Spring Data JPA & Hibernate: Advanced ORM for PostgreSQL database management.

Lombok: Used for boilerplate reduction (annotations like @Data, @Builder).

Spring Security & JWT: Secure, stateless authentication and authorization.

Maven: Dependency management and build lifecycle (via pom.xml).

Database Initializers: schema.sql and data.sql for automatic table creation and data seeding.

Frontend (The Interface)
React 18 & TypeScript: Strongly-typed UI development for error-free scaling.

Vite: Next-generation frontend tooling for ultra-fast development.

Material-UI (MUI): Comprehensive design system for a professional Dark Theme UI.

Axios & Interceptors: Centralized API handling with automatic JWT injection.

React Hook Form: Optimized form state and validation logic.

📁 Project Structure (Workspace)
Based on the project's layout, it is organized into two main micro-services:

Backend-project/: Contains the Spring Boot API, Maven wrapper (mvnw), and database initialization scripts.

Frontend-project/: Contains the React SPA, TypeScript configurations, and UI components.

Docker Support: Root-level and service-level Dockerfiles for full-stack orchestration.

🐳 Docker & Deployment
The application is fully containerized, ensuring it runs the same way on every machine.

Dockerfile: Custom build instructions for both the Java environment and the Node.js environment.

docker-compose.yml: Orchestrates three services:

PostgreSQL: The persistent data store.

Spring Boot API: The backend service.

React Frontend: The client-side application.

🔐 Key Features
Secure Auth: JWT-based login with hashed passwords (SHA-256).

Persistence: PostgreSQL database with Hibernate relationship mapping (One-to-Many).

Smart Search: Real-time student search by ID or Name.

Clean UI: Responsive Dark Theme with MUI Skeleton loaders for better UX.

Validation: Strict input validation on both Frontend (React Hook Form) and Backend (JSR-303).

🚀 Quick Start
Using Docker (Recommended)
Bash

docker-compose up --build
Frontend: http://localhost:5176

Backend API: http://localhost:8080

Manual Setup
Backend: Ensure PostgreSQL is running, then run ./mvnw spring-boot:run.

Frontend: Run npm install and npm run dev.
