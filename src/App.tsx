import React, { lazy, Suspense } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const TasksPage = lazy(() => import("./pages/TasksPage"));

const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="400px"
  >
    <CircularProgress />
  </Box>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="tasks/:projectId"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <TasksPage />
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
      <CssBaseline />
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true,
        }}
      />
    </ErrorBoundary>
  );
};

export default App;