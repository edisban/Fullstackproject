/**
 * Route wrapper that requires authentication.
 * Redirects to login page if user is not authenticated.
 */
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  
  return <>{children}</>;
};

export default ProtectedRoute;
