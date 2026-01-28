🚀 Project Manager Full-Stack System
A professional-grade Project & Student Management ecosystem designed with a focus on clean architecture, containerization, and secure data handling. This system demonstrates a modern approach to full-stack development using a decoupled micro-service structure.

🏗️ System Architecture
The repository is organized into two primary independent services, managed by a centralized orchestration layer:

/server (Backend): A high-performance RESTful API built with Spring Boot 3 and Java 22.

/client (Frontend): A responsive, type-safe Single Page Application (SPA) built with React 18, TypeScript, and Vite.

Infrastructure: Fully containerized environment using Docker and Docker Compose for consistent deployment across environments.

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

🐳 Deployment & Orchestration (Docker)
This project is "production-ready" through full containerization. You can spin up the entire stack (Database, API, and UI) with a single command:

Bash

# Clone the repository
git clone <your-repo-link>

# Launch the full environment
docker-compose up --build
The system will automatically initialize the PostgreSQL database, run the Spring Boot migrations, and serve the React application.

🧪 Testing & Quality
Backend: Unit and Integration tests using JUnit 5 and Mockito.

Frontend: Component and hook testing via Vitest and React Testing Library.