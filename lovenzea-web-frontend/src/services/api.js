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
const PHOTO_PUBLIC_BASE = 'https://api.lovenzea.online/minio';

const normalizeUrl = (val) => {
    if (!val || typeof val !== 'string') return val;
    const clean = val.trim();
    if (!clean) return val;

    // External third-party avatars/images
    if (clean.startsWith('data:') || clean.startsWith('blob:')) return clean;
    if (clean.includes('unsplash.com') || clean.includes('dicebear.com') || clean.includes('ui-avatars.com') || clean.includes('flaticon.com') || clean.includes('githubusercontent.com')) {
        return clean;
    }

    // Already the canonical public URL
    if (clean.startsWith(`${PHOTO_PUBLIC_BASE}/`)) {
        return clean.replace(`${PHOTO_PUBLIC_BASE}/punarmilan-photos/`, `${PHOTO_PUBLIC_BASE}/`)
                    .replace(`${PHOTO_PUBLIC_BASE}/lovenzea-photos/`, `${PHOTO_PUBLIC_BASE}/`);
    }

    // Internal MinIO URLs — strip host and bucket prefix
    const minioMatch = clean.match(/^https?:\/\/(?:localhost|127\.0\.0\.1|minio):9000\/(?:punarmilan|lovenzea)-photos\/(.*)/);
    if (minioMatch) {
        return `${PHOTO_PUBLIC_BASE}/${minioMatch[1]}`;
    }

    // Old domains / prefixes
    const oldDomainMatch = clean.match(/^https?:\/\/(?:(?:www\.)?lovenzea\.online|(?:www\.)?app\.lovenzea\.online|(?:www\.)?api\.lovenzea\.online)\/(?:api\/photos|minio|photos)\/(.*)/);
    if (oldDomainMatch) {
        const path = oldDomainMatch[1].replace(/^(?:punarmilan-photos|lovenzea-photos)\//, '');
        return `${PHOTO_PUBLIC_BASE}/${path}`;
    }

    // Relative /minio/, /api/photos/, /photos/
    if (clean.startsWith('/minio/')) {
        const path = clean.replace(/^\/minio\//, '').replace(/^(?:punarmilan-photos|lovenzea-photos)\//, '');
        return `${PHOTO_PUBLIC_BASE}/${path}`;
    }
    if (clean.startsWith('/api/photos/')) {
        const path = clean.replace(/^\/api\/photos\//, '').replace(/^(?:punarmilan-photos|lovenzea-photos)\//, '');
        return `${PHOTO_PUBLIC_BASE}/${path}`;
    }
    if (clean.startsWith('/photos/')) {
        const path = clean.replace(/^\/photos\//, '').replace(/^(?:punarmilan-photos|lovenzea-photos)\//, '');
        return `${PHOTO_PUBLIC_BASE}/${path}`;
    }

    // Any other absolute URL
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
        return clean;
    }

    // Plain object path
    const cleanObject = clean.startsWith('/') ? clean.substring(1) : clean;
    return `${PHOTO_PUBLIC_BASE}/${cleanObject}`;
};

const formatImageUrls = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    if (Array.isArray(obj)) {
        obj.forEach(item => formatImageUrls(item));
        return;
    }
    
    Object.keys(obj).forEach(key => {
        if (IMAGE_PROPERTIES.includes(key) && typeof obj[key] === 'string') {
            obj[key] = normalizeUrl(obj[key]);
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
