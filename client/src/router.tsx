import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router";
import { GuestOnly, RequireAuth } from "@/auth/RouteGuards";
import { AppShell } from "@/components/layout/AppShell";
import { AuthPage } from "@/pages/AuthPage";
import { NotFoundPage, RouteErrorPage } from "@/pages/StatusPages";

// Signed-in pages are code-split; the sign-in page is part of the initial bundle.
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage"));
const ProjectPage = lazy(() => import("@/pages/ProjectPage"));

export const routes: RouteObject[] = [
  {
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <GuestOnly />,
        children: [
          { path: "/login", element: <AuthPage mode="login" /> },
          { path: "/register", element: <AuthPage mode="register" /> },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AppShell />,
            children: [
              { path: "/", element: <Navigate to="/projects" replace /> },
              { path: "/projects", element: <ProjectsPage /> },
              { path: "/projects/:projectId", element: <ProjectPage /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
