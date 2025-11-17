import React from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import ProtectedRoute from "./routes/ProtectedRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="tasks/:projectId"
        element={
          <ProtectedRoute>
            <TasksPage />
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
    <>
      <CssBaseline />
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true,
        }}
      />
    </>
  );
};

export default App;