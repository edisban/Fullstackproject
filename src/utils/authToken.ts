import { jwtDecode } from "jwt-decode";

const TOKEN_STORAGE_KEY = "token";
const JWT_EXPIRATION_MULTIPLIER = 1000; 

export type DecodedTokenPayload = {
  sub?: string;
  username?: string;
  exp?: number;
};

export const decodeToken = (token: string): DecodedTokenPayload | null => {
  try {
    return jwtDecode<DecodedTokenPayload>(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (payload: DecodedTokenPayload | null): boolean => {
  if (!payload?.exp) {
    return false;
  }
  return payload.exp * JWT_EXPIRATION_MULTIPLIER <= Date.now();
};

export const getUsernameFromPayload = (payload: DecodedTokenPayload | null): string => {
  return payload?.username || payload?.sub || "";
};

export const persistToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const clearStoredToken = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const getExpirationMillis = (payload: DecodedTokenPayload | null): number | undefined => {
  if (!payload?.exp) {
    return undefined;
  }
  return payload.exp * JWT_EXPIRATION_MULTIPLIER;
};
