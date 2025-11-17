import axios from "axios";
import { clearStoredToken, getStoredToken } from "@/utils/authToken";

const RELATIVE_DEFAULT_BASE = "/api";
const FALLBACK_ABSOLUTE_BASE = "http://localhost:8080";

const normalizeBaseUrl = (value: string): string => {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/$/, "");
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/$/, "");
};

const resolveBaseUrl = () => {
  const envValue = import.meta.env?.VITE_API_URL;
  if (envValue && envValue.trim().length > 0) {
    return normalizeBaseUrl(envValue);
  }

  if (import.meta.env.DEV) {
    // During Vite dev server we rely on the proxy configuration, so keep the
    // relative path to ensure requests are forwarded to the backend.
    return RELATIVE_DEFAULT_BASE;
  }

  // Built/previewed bundles don't have the dev proxy, so default to the
  // Spring Boot backend on port 8080 unless VITE_API_URL overrides it.
  return `${FALLBACK_ABSOLUTE_BASE}${RELATIVE_DEFAULT_BASE}`;
};

const axiosInstance = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 15000,
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

    // For login/register failures, don't redirect; let the page show a message
    if (status === 401 && isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (status === 401) {
      clearStoredToken();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;