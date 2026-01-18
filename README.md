# 🚀 Project Manager Full-Stack System

A professional Project & Student Management system built with a focus on modern architecture, containerization, and secure data handling.

## 🛠️ Tech Stack & Tools

### **Backend (The Core)**
* **Java 22 & Spring Boot 3**: High-performance backend logic.
* **Spring Data JPA & Hibernate**: Advanced ORM for PostgreSQL database management.
* **Lombok**: Boilerplate reduction (Annotations: `@Data`, `@Builder`, `@AllArgsConstructor`).
* **Spring Security & JWT**: Secure, stateless authentication and authorization.
* **Maven**: Dependency management and build lifecycle (via `pom.xml`).
* **Database Scripts**: Includes `schema.sql` and `data.sql` for automated schema creation and data seeding.

### **Frontend (The Interface)**
* **React 18 & TypeScript**: Strongly-typed UI for scalable and error-free development.
* **Vite**: Next-generation frontend tooling for ultra-fast development builds.
* **Material-UI (MUI)**: Professional design system with custom Dark Theme.
* **Axios & Interceptors**: Centralized API handling with automatic JWT token injection.
* **React Hook Form**: Optimized form state and real-time validation logic.

---

## 📁 Project Structure

The repository is organized into two main services:

* **`/server` (Backend)**: Spring Boot API, Maven wrapper, and SQL initialization scripts.
* **`/client` (Frontend)**: React SPA, TypeScript configurations, and MUI components.
* **Docker Support**: Root-level `docker-compose.yml` and service-specific `Dockerfiles`.

---

## 🐳 Docker & Deployment

The application is fully containerized for seamless deployment.

* **Containerization**: Optimized Dockerfiles for both Java (JDK 22) and Node.js environments.
* **Orchestration**: `docker-compose.yml` manages the Spring Boot API, React Frontend, and PostgreSQL database simultaneously.

---

## 🔐 Key Features

* **Secure Authentication**: JWT-based login with SHA-256 password hashing.
* **Persistence**: PostgreSQL integration with Hibernate relationship mapping (One-to-Many).
* **Smart Search**: Optimized search functionality for students by ID or Name.
* **Professional UI**: Responsive Dark Mode with Skeleton loaders for a smooth UX.
* **Full Validation**: Strict validation on both Client (React Hook Form) and Server (JSR-303).

---

## 🚀 How to Run

### **Option A: Using Docker (Recommended)**
```bash
docker-compose up --build
