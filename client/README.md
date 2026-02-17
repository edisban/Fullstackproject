📌 Project Manager – Frontend (React + TypeScript)
🧾 Description
The frontend serves as the interactive graphical interface of the Project Manager application, enabling real-time management of projects and students. Built with React 18 and TypeScript, it features a modern architecture, a centralized API layer, and a sleek design based on Material-UI.

Core Features:
🔐 Secure Auth: JWT-based authentication with protected routes and a post-registration flow that keeps the user on the login form until they explicitly sign in.

📁 Project Management: Full CRUD operations for project lifecycles.

👥 Student Management: Per-project CRUD for students with unique ID handling.

🔍 Smart Search: Real-time search by name or Student ID.

📝 Robust Forms: Advanced validation using React Hook Form.

🎨 Modern UI: Responsive Dark Theme with Skeleton screens for loading states and a simplified header that only shows navigation/actions when authenticated (no more Login/Create Account duplicates).
🧹 Account Lifecycle: Built-in "Delete Account" action in the header triggers the backend self-delete endpoint and logs the user out automatically.

🛠️ Tech Stack
Framework: React 18 (Vite)

Language: TypeScript

UI Library: Material-UI (MUI)

Routing: React Router 6

State & Logic: Custom Hooks Architecture

API Client: Axios (with Interceptors)

Forms: React Hook Form

🧪 Testing Strategy
To ensure UI stability and prevent regressions, the frontend includes a comprehensive testing suite:

Unit Testing (Vitest & React Testing Library):

Testing individual components (e.g., ProjectCard, StudentSearchBar) for correct rendering.

Validating Custom Hooks (e.g., useCrudOperator) in isolation.

Integration Testing:

Testing form submissions and validation logic in ProjectForm and StudentForm.

Mocking API calls using MSW (Mock Service Worker) to test frontend behavior without a live backend.

End-to-End (E2E) Testing (Selenium):

Simulating user flows like Login -> Create Project -> Add Student using Selenium WebDriver.
Runs in headless Chrome for CI/CD compatibility.
Test files located in `src/e2e/`.

Run with: `npm run test:e2e`

🧠 State Management – Custom Hooks
The application follows a "Logic-less Components" philosophy by offloading complexity to custom hooks:

useProjects: Manages fetching, caching, and state updates for projects.

useStudents: Handles student CRUD, search filtering, and server-side error mapping.

useCrudOperator: A higher-order hook for safe, consistent, and reusable CRUD operations across the app.

🔐 Authentication & API Layer
JWT Persistence: Tokens are securely stored and managed via localStorage.

Axios Interceptors: * Request: Automatically injects the Authorization header.

Response: Detects 401 Unauthorized errors to trigger automatic logout and clean up.

Protected Routes: Prevents unauthenticated access to the dashboard and management pages.

📝 Form Validation & Error Handling
Real-time Feedback: Powered by React Hook Form for high performance (no unnecessary re-renders).

Validation Rules: Checks for required fields, Student ID patterns, and unique constraints.

Global Notifications: A centralized useSnackbar hook provides non-blocking success/error feedback for every user action.

🚀 Installation & Setup
Install dependencies:

Bash

npm install
Start development server:

Bash

npm run dev
Run Tests:

Bash

npm test
Run E2E Tests:

Bash

npm run test:e2e