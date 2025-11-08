import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "components/Layout";
import LoginPage from "pages/LoginPage";
import Dashboard from "pages/Dashboard";
import HomePage from "pages/HomePage";
import ProtectedRoute from "routes/ProtectedRoute";



const App: React.FC = () => {
  return (
    <Router>
      <Routes>
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
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
