import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
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
    const reqUrl: string = error.config?.url || '';
    const isAuthEndpoint = reqUrl.includes('/auth/login') || reqUrl.includes('/auth/register');

    // For login/register failures, don't redirect; let the page show a message
    if (status === 401 && isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      const loginPath = import.meta.env.DEV ? '/login' : '/#/login';
      window.location.href = loginPath;
      return; // stop further handling
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;