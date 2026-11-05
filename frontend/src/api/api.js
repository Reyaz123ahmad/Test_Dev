
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Redirect only for authenticated requests that get 401.
// Login's own 401 (wrong password) should not redirect.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hadToken = Boolean(
      error.config?.headers?.Authorization
    );

    if (status === 401 && hadToken) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('admin');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
