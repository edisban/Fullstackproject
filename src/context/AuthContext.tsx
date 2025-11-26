/**
 * Authentication context provider with JWT token management.
 * Handles login, logout, token persistence, and auto-refresh timer.
 * Provides user state to entire application.
 */
import React, {
  createContext,
  useState,
  ReactNode,
  useRef,
  useCallback,
  useEffect,
} from "react";
import {
  clearStoredToken,
  decodeToken,
  getExpirationMillis,
  getStoredToken,
  getUsernameFromPayload,
  isTokenExpired,
  persistToken,
} from "@/utils/authToken";

interface AuthUser {
  username: string;
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (newToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

interface Props {
  children: ReactNode;
}

const buildInitialState = () => {
  const storedToken = getStoredToken();
  if (!storedToken) {
    return { token: null, user: null } as const;
  }
  const payload = decodeToken(storedToken);
  if (!payload || isTokenExpired(payload)) {
    clearStoredToken();
    return { token: null, user: null } as const;
  }
  const username = getUsernameFromPayload(payload);
  return {
    token: storedToken,
    user: username ? { username } : null,
  } as const;
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [authState, setAuthState] = useState(() => buildInitialState());
  const logoutTimerRef = useRef<number | null>(null);

  const clearLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      window.clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    clearLogoutTimer();
    clearStoredToken();
    setAuthState({ token: null, user: null });
  }, [clearLogoutTimer]);

  const scheduleLogout = useCallback(
    (expiration?: number) => {
      clearLogoutTimer();
      if (!expiration) {
        return;
      }
      const timeout = expiration - Date.now();
      if (timeout <= 0) {
        logout();
        return;
      }
      logoutTimerRef.current = window.setTimeout(() => logout(), timeout);
    },
    [clearLogoutTimer, logout]
  );

  const login = useCallback(
    (newToken: string) => {
      try {
        const payload = decodeToken(newToken);
        if (!payload || isTokenExpired(payload)) {
          throw new Error("Invalid or expired token");
        }
        const username = getUsernameFromPayload(payload);
        persistToken(newToken);
        setAuthState({ token: newToken, user: username ? { username } : null });
        scheduleLogout(getExpirationMillis(payload));
      } catch (error) {
        clearStoredToken();
        throw error;
      }
    },
    [scheduleLogout]
  );

  useEffect(() => {
    if (!authState.token) {
      clearLogoutTimer();
      return;
    }
    const payload = decodeToken(authState.token);
    if (!payload || isTokenExpired(payload)) {
      logout();
      return;
    }
    scheduleLogout(getExpirationMillis(payload));
  }, [authState.token, clearLogoutTimer, logout, scheduleLogout]);

  return (
    <AuthContext.Provider
      value={{
        token: authState.token,
        user: authState.user,
        isAuthenticated: !!authState.token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};