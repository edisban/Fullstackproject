# 🚀 Project Manager Full-Stack System

A professional-grade Project & Student Management ecosystem built with a focus on **Clean Architecture**, security, and seamless deployment via Docker. This project demonstrates a modern approach to full-stack development using a decoupled micro-service structure.

## 🏗️ System Architecture
The platform is organized into three independent services that work in harmony:

* **Backend (`/server`):** A robust REST API built with Spring Boot 3 & Java 17, secured with stateless JWT authentication.
* **Frontend (`/client`):** A modern Single Page Application (SPA) using React 18, TypeScript, and Vite for a fast developer experience.
* **Database (`/db`):** A PostgreSQL 16 instance that is automatically initialized with schema and seed data for a "ready-to-go" environment.



## 🛠️ Tech Stack & Tooling
* **Backend Core:** Spring Boot 3, Java 17, Spring Data JPA, and Hibernate.
* **Security:** Spring Security with **BCrypt** password hashing and **JWT** issuance/validation.
* **Frontend UX:** React 18, TypeScript, and **Material UI (MUI)** with a responsive dark theme.
* **DevOps:** Docker & Docker Compose for orchestration, with **Nginx** acting as a reverse proxy.

## 🔐 Key Enterprise Features
* **Identity Management:** Secure authentication flow using industry-standard JWT tokens.
* **Data Integrity:** Multi-layer validation (Client-side via React and Server-side via JSR-303 Bean Validation).
* **Containerization:** The entire stack is containerized, ensuring a consistent environment across different machines.
* **Database Persistence:** Reliable data storage using Docker named volumes to prevent data loss during container restarts.

## 🐳 Quick Start (Docker)
To get the entire platform running locally with a single command:

1. **Configuration:** Copy the sample environment file:
   ```bash
   cp .env.docker.example .env
   Launch: Build and start the stack in detached mode:

2. docker compose up --build -d
3. Access: Open http://localhost:4173