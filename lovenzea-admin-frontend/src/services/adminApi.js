import axios from 'axios';
import { BASE_URL } from '../constants/apiUrls';

const ADMIN_API_URL = BASE_URL + '/admin';

const adminApi = axios.create({
  baseURL: ADMIN_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token from localStorage
adminApi.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem('adminData');
      if (raw) {
        const adminData = JSON.parse(raw);
        if (adminData && adminData.token) {
          config.headers.Authorization = `Bearer ${adminData.token}`;
        }
      }
    } catch (e) {
      console.error('Error parsing admin auth data from storage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminData');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;
