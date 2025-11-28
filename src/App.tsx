/**
 * Main application component with routing configuration.
 * Implements lazy loading for Dashboard and StudentsPage with protected routes.
 */
import React, { lazy, Suspense } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Skeleton from "./components/Skeleton";
import { SnackbarProvider } from "./context/SnackbarContext";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudentsPage = lazy(() => import("./pages/StudentsPage"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Skeleton />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="students/:projectId"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Skeleton />}>
              <StudentsPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
    </Route>
  ),
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <SnackbarProvider>
        <CssBaseline />
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true,
          }}
        />
      </SnackbarProvider>
    </ErrorBoundary>
  );
};

export default App;