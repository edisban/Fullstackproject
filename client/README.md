# Project Manager – Frontend (React + TypeScript)

## Overview
This frontend is a React 18 + TypeScript application built with Vite. It provides the user interface for authentication, project dashboard, student management, and smart search.

## Architecture & Philosophy
- React 18 with Vite for fast development and builds.
- Logic-less Components: Presentational components focus on rendering; business logic and side effects are implemented in custom hooks (e.g., `useProjects`, `useStudents`, `useCrudOperator`).
- State & side effects are encapsulated in hooks to make components easier to test and reuse.

## Tech & Tooling
- React 18
- TypeScript
- Vite (development server and build)
- Material UI (MUI)
- Axios for HTTP with interceptors
- React Router v6
- React Hook Form for performant form handling

## Scripts
- Install: `npm install`
- Development: `npm run dev`
- Production build: `npm run build`
- Unit tests: `npm test`
- E2E tests: `npm run test:e2e`

## Environment
- Required local environment variable for production build / Nginx proxy:
	- `VITE_API_URL=/api`

## State Management – Custom Hooks
- `useProjects`: fetching, caching, update logic.
- `useStudents`: CRUD, search filtering, and server error mapping.
- `useCrudOperator`: shared create/update/delete patterns with optimistic UI behavior.

## Authentication & API Layer
- JWT tokens are stored client-side (localStorage) and attached to requests via Axios interceptors.
- Interceptors also handle 401 responses to trigger logout and token cleanup.

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ConfirmDialog.tsx        # Confirmation modal
│   │   ├── Dashboard.tsx            # Main dashboard page
│   │   ├── EmptyState.tsx           # Empty state placeholder
│   │   ├── ErrorBoundary.tsx        # Error boundary wrapper
│   │   ├── Footer.tsx               # Footer component
│   │   ├── Header.tsx               # Navigation header
│   │   ├── Layout.tsx               # Page layout wrapper
│   │   ├── NotificationSnackbar.tsx # Toast notifications
│   │   ├── ProjectCard.tsx          # Project display card
│   │   ├── ProjectForm.tsx          # Create/edit project form
│   │   ├── StudentForm.tsx          # Create/edit student form
│   │   ├── StudentListItem.tsx      # Student list item
│   │   ├── StudentSearchBar.tsx     # Search & filter bar
│   │   ├── Skeleton.tsx             # Loading skeleton
│   │   └── __tests__/               # Component unit tests
│   ├── hooks/
│   │   ├── useCrudOperation.ts      # Generic CRUD hook
│   │   ├── useProjects.ts           # Project management hook
│   │   ├── useStudents.ts           # Student management hook
│   │   └── __tests__/               # Hook unit tests
│   ├── pages/
│   │   ├── Dashboard.tsx            # Dashboard page
│   │   ├── HomePage.tsx             # Landing page
│   │   └── StudentsPage.tsx         # Students page
│   ├── api/
│   │   ├── axiosInstance.tsx        # Axios config with interceptors
│   │   ├── projects.ts              # Project API calls
│   │   ├── students.ts              # Student API calls
│   │   └── users.ts                 # User API calls
│   ├── context/
│   │   ├── AuthContext.tsx          # Auth state & login/logout
│   │   └── SnackbarContext.tsx      # Toast notifications state
│   ├── routes/
│   │   └── ProtectedRoute.tsx       # Route guard for authenticated pages
│   ├── types/
│   │   └── errors.ts                # Error type definitions
│   ├── utils/
│   │   ├── authToken.ts             # JWT token management
│   │   └── dateUtils.ts             # Date formatting
│   ├── e2e/
│   │   └── sample.test.ts           # Selenium E2E tests
│   ├── App.tsx                      # Root component with routing
│   ├── main.tsx                     # React entry point
│   ├── index.css                    # Global styles
│   └── theme.ts                     # Material UI theme config
├── index.html
├── Dockerfile
├── nginx.conf                       # Reverse proxy config
├── package.json
├── tsconfig.json
├── tsconfig.e2e.json
├── vite.config.ts
├── vitest.e2e.config.ts
└── README.md
```

## Testing
- Unit tests: Vitest + React Testing Library
- Integration and E2E tests: MSW for mocking and Selenium for full browser flows

---
