import axios from 'axios';
import { BASE_URL } from '../constants/apiUrls';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// URLs that should NOT trigger a token refresh on 401
const AUTH_URLS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-otp', '/auth/resend-otp', '/auth/login-otp/request', '/auth/login-otp/verify'];

const isAuthUrl = (url) => {
    return AUTH_URLS.some(authUrl => url?.includes(authUrl));
};

// Token handling is now handled by HTTP-only cookies automatically
api.interceptors.request.use(
    (config) => {
        // Let the browser set the Content-Type and boundary automatically for FormData
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const IMAGE_PROPERTIES = [
    // Profile photo fields
    'profilePhotoUrl', 'otherProfilePhotoUrl', 'img', 'profilePictureUrl', 'image', 'photoUrl',
    // Gallery / album photos (photoUrl2–photoUrl6)
    'photoUrl2', 'photoUrl3', 'photoUrl4', 'photoUrl5', 'photoUrl6',
    // Other image fields
    'thumbnailUrl', 'coverPhotoUrl', 'idProofUrl', 'bannerUrl', 'avatarUrl', 'imageUrl',
];
const LIVE_URL = BASE_URL.replace(/\/api\/?$/, '');
const LIVE_MINIO_URL = LIVE_URL ? `${LIVE_URL}/minio/` : '/minio/';

const formatImageUrls = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    if (Array.isArray(obj)) {
        obj.forEach(item => formatImageUrls(item));
        return;
    }
    
    Object.keys(obj).forEach(key => {
        if (IMAGE_PROPERTIES.includes(key) && typeof obj[key] === 'string') {
            if (obj[key] && !obj[key].startsWith('http') && !obj[key].startsWith('data:')) {
                const cleanPath = obj[key].startsWith('/') ? obj[key] : `/${obj[key]}`;
                obj[key] = `${LIVE_URL}${cleanPath}`;
            } else if (obj[key] && obj[key].startsWith('http')) {
                obj[key] = obj[key]
                    .replace('http://localhost:9000/', LIVE_MINIO_URL)
                    .replace('http://127.0.0.1:9000/', LIVE_MINIO_URL)
                    .replace('http://minio:9000/', LIVE_MINIO_URL)
                    .replace('/punarmilan-photos/punarmilan-photos/', '/punarmilan-photos/')
                    .split('?')[0];
            }
        } else if (typeof obj[key] === 'object') {
            formatImageUrls(obj[key]);
        }
    });
};

// Add a response interceptor to handle 401 Unauthorized errors globally
api.interceptors.response.use(
    (response) => {
        if (response.data) {
            formatImageUrls(response.data);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Don't try to refresh for auth endpoints (login/register failures are real errors)
        if (error.response && error.response.status === 401 && !originalRequest._retry && !isAuthUrl(originalRequest.url)) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        // Cookie is automatically updated, just retry the request
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Send empty body — the refresh token is in HTTP-only cookie
                // withCredentials ensures the cookie is sent automatically
                const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, {
                    withCredentials: true
                });

                if (response.status === 200) {
                    processQueue(null);
                    // Retry the original request — new accessToken cookie is already set
                    return api(originalRequest);
                }
            } catch (err) {
                processQueue(err, null);
                handleLogout();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

const handleLogout = () => {
    console.error('Session expired. Redirecting to login...');
    localStorage.removeItem('user');
    // Only redirect if not already on a public page
    const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/verify-otp', '/about-us'];
    if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/';
    }
};

export default api;
