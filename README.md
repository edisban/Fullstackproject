# Project Manager - Backend

A Spring Boot REST API for managing projects and student tasks with JWT authentication.

 Overview

This is a full-stack project management system where administrators can create projects and assign students (tasks) to them. The backend provides a secure RESTful API with JWT authentication, built using Spring Boot and PostgreSQL.

 Features

- **Project Management**: Create, read, update, and delete projects
- **Student/Task Management**: Manage student assignments within projects
- **JWT Authentication**: Secure API endpoints with token-based authentication
- **SHA-256 Password Hashing**: User passwords are securely hashed
- **One-to-Many Relationship**: Projects can have multiple tasks/students
- **RESTful API**: Clean REST endpoints following best practices
- **Error Handling**: Structured error responses with proper HTTP status codes
- **Auto-initialization**: Admin user created automatically on first startup

 Tech Stack

- Java
- Spring Boot
- PostgreSQL
- Maven 
- JWT: JSON Web Tokens for authentication
- Hibernate/JPA: ORM for database operations







```sql
CREATE DATABASE Project_db;
```

Configure Environment Variables

Set the following environment variables before running the application:


```bash
# Linux/Mac
export DB_URL='jdbc:postgresql://localhost:5432/Project_db'
export DB_USERNAME='postgres'
export DB_PASSWORD='your_postgres_password'
export JWT_SECRET='your-secret-key-here-make-it-long-and-secure'
export APP_AUTH_DEFAULT_ADMIN_USERNAME='admin'
export APP_AUTH_DEFAULT_ADMIN_PASSWORD='123456'
```

### 4. Run the Application


Database Schema

Projects Table

CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    code_number VARCHAR(50) UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    grade DOUBLE PRECISION,
    role VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    description TEXT,
    project_id BIGINT,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);
```

Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL


