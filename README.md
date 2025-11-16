This project is a full-stack web application designed to manage projects and tasks efficiently.
It consists of a React (Vite + TypeScript + Material UI) frontend and a Spring Boot backend connected to a PostgreSQL database.
The system supports user authentication, project management, and task tracking, allowing users to organize their work in a structured way.

Users can log in through /api/auth/login, where the backend validates their credentials and returns a JWT token.
The frontend stores this token and attaches it automatically to every API request for secure access to protected routes.

✨ Main Features

User authentication with JWT (JSON Web Token)

Project management: create, update, delete, and view all projects

Task management: manage tasks within projects, including search by name or code (AM)

Modern UI built with Material UI and React Router for smooth navigation

RESTful API communication between frontend and backend

Database persistence using PostgreSQL

⚙️ Technology Stack

Frontend: React 18, TypeScript, Vite, Material UI, Axios, React Router

Backend: Spring Boot 3, Spring Security, Spring Data JPA, JJWT, PostgreSQL

Other tools: Maven, Node.js, Express (for serving static builds)