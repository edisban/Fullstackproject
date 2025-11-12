import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  // Αν δεν υπάρχει token, γύρνα στο login και κράτα το path που προσπάθησε να μπει
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Αν υπάρχει token, δείξε το περιεχόμενο
  return <>{children}</>;
};

export default ProtectedRoute;
