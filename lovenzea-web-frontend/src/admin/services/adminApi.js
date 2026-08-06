import axios from 'axios';
import { BASE_URL } from '../../constants/apiUrls';

const ADMIN_API_URL = BASE_URL + '/admin';

const adminApi = axios.create({
    baseURL: ADMIN_API_URL,
    withCredentials: true,
});

// Request interceptor to add JWT
adminApi.interceptors.request.use((config) => {
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    if (adminData && adminData.token) {
        config.headers.Authorization = `Bearer ${adminData.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle 401 Unauthorized
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('adminData');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export default adminApi;
