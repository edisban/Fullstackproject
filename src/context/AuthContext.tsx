import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (newToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  // 🔥 ΣΗΜΑΝΤΙΚΟ: Initialize από localStorage
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  // 🔥 Sync με localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};