import { jwtDecode } from "jwt-decode";

const TOKEN_STORAGE_KEY = "token";

export type DecodedTokenPayload = {
  sub?: string;
  username?: string;
  exp?: number;
};

export const decodeToken = (token: string): DecodedTokenPayload | null => {
  try {
    return jwtDecode<DecodedTokenPayload>(token);
  } catch (error) {
    console.warn("[auth] Failed to decode token", error);
    return null;
  }
};

export const isTokenExpired = (payload: DecodedTokenPayload | null) => {
  if (!payload?.exp) {
    return false;
  }
  return payload.exp * 1000 <= Date.now();
};

export const getUsernameFromPayload = (payload: DecodedTokenPayload | null) => {
  return payload?.username || payload?.sub || "";
};

export const persistToken = (token: string) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export const getExpirationMillis = (payload: DecodedTokenPayload | null) => {
  if (!payload?.exp) {
    return undefined;
  }
  return payload.exp * 1000;
};
