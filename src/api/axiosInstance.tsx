import axios from "axios";
import { clearStoredToken, getStoredToken } from "@/utils/authToken";

const RELATIVE_DEFAULT_BASE = "/api";
const FALLBACK_ABSOLUTE_BASE = "http://localhost:8080";
const REQUEST_TIMEOUT = 15000;
const HTTP_UNAUTHORIZED = 401;

const normalizeBaseUrl = (value: string): string => {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/$/, "");
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/$/, "");
};

const resolveBaseUrl = (): string => {
  const envValue = import.meta.env?.VITE_API_URL;
  if (envValue && envValue.trim().length > 0) {
    return normalizeBaseUrl(envValue);
  }

  if (import.meta.env.DEV) {
    return RELATIVE_DEFAULT_BASE;
  }

  return `${FALLBACK_ABSOLUTE_BASE}${RELATIVE_DEFAULT_BASE}`;
};

const axiosInstance = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const reqUrl: string = error.config?.url || "";
    const isAuthEndpoint = reqUrl.includes("/auth/login") || reqUrl.includes("/auth/register");

    if (status === HTTP_UNAUTHORIZED && isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (status === HTTP_UNAUTHORIZED) {
      clearStoredToken();
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;