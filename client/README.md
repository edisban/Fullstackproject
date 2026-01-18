📌 Project Manager – Frontend (React + TypeScript)
🧾 Description
The frontend serves as the graphical interface of the Project Manager application, enabling real-time management of projects and students. The application is built with React + TypeScript, featuring a modern architecture, Material-UI design system, custom hooks, and a clean API layer.

Core Features:
🔐 JWT Authentication.

📁 Full CRUD Management for projects.

👥 Full CRUD Management for students.

🔍 Search functionality.

📝 Form Validation across all inputs.

🎨 Responsive Dark Theme.

🚀 Roadmap (Planned Features):
Pagination and Sorting.

Role-Based Access Control (RBAC).

Multi-language Support (i18n).

Dark/Light mode toggle.

🛠️ Tech Stack
React 18

TypeScript

Vite

Material-UI (MUI)

React Router

Axios

React Hook Form

Custom Hooks Architecture

🚀 Installation & Setup
Install dependencies:

Bash

npm install
Start development server:

Bash

npm run dev
The application runs at: http://localhost:5176/

🔐 Authentication (JWT & Protected Routes)
The system utilizes JWT for user identification:

Tokens are stored in localStorage.

An Axios interceptor automatically injects the token into all requests.

Protected Routes restrict access to logged-in users only.

Automatic logout and redirect to login occur on 401 Unauthorized errors.

🌐 Axios API Layer
A centralized Axios instance handles:

JWT token injection.

Unified error messages.

Automatic logout on 401.

Network error detection.

Benefit: Eliminates repetitive code across components.

📁 Projects Module
Provides full management of projects:

Create, Edit, and Delete projects.

Display all projects.

Empty state handling when no data is available.

Components:

ProjectCard – Project presentation.

ProjectForm – Creation/Editing forms.

ConfirmDialog – Deletion confirmation.

👥 Students Module
Management of students per project:

Add new students.

Edit and Delete with confirmation.

Search by name or Student ID.

Empty state for empty lists.

Components:

StudentForm – Validation & form logic.

StudentListItem – List entry display.

StudentSearchBar – Search functionality.

🧠 State Management – Custom Hooks
useProjects: Fetching, creating, editing, and deleting projects with auto-refresh.

useStudents: Student CRUD, search functionality, and server-side error handling.

useSnackbar: Centralized notification system.

useCrudOperator: A unified hook for safe and consistent CRUD operations.

Advantages: Clean architecture, logic reuse, and lean components.

📝 React Hook Form & Validation
The app integrates a robust validation layer providing:

Required fields and pattern rules.

Real-time error feedback.

Immediate rejection of invalid data.

Error messages displayed under each input.

Detects: Empty fields, invalid Student IDs, illegal characters, and future dates.

🔔 Snackbar Notifications
A global notification mechanism that:

Displays success and error messages.

Features auto-dismiss and a consistent UI.

Is non-blocking and used across all CRUD operations.

⚠️ Error Handling System
The application manages:

Backend errors (400, 401, 404, 409, 500).

Validation and Network errors.

Constraint violations (e.g., duplicate project name or unique student ID).

Fallback UI via ErrorBoundary.

🔀 Routing Structure
React Router handles:

Login page.

Dashboard (Projects).

Students page (per project).

Protected routes for authenticated users via useNavigate.

🎨 Material-UI & Theme
Features a Custom Dark Theme:

Consistent color palette and readable typography.

Responsive layout with modern hover states.

Skeleton Screens: User-friendly UI during data fetching.

✨ Accessibility
The application follows core accessibility principles:

ARIA labels and semantic HTML.

Keyboard navigation support.

Screen reader-friendly components.

Proper focus management in dialogs.