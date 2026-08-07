import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// ──────────────────────────────────────────────────────────────────────────────
//  Public backend endpoints (VPS — no private credentials here)
// ──────────────────────────────────────────────────────────────────────────────

export const BASE_URL      = 'https://app.lovenzea.online/api';
export const SOCKET_URL    = 'https://app.lovenzea.online';
export const STOMP_URL     = 'wss://app.lovenzea.online/ws';
export const SOCKJS_URL    = 'https://app.lovenzea.online/ws';
export const PHOTO_BASE_URL = 'https://app.lovenzea.online/minio';

// ──────────────────────────────────────────────────────────────────────────────
//  Axios instance for standard JSON REST requests
// ──────────────────────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// ──────────────────────────────────────────────────────────────────────────────
//  Request interceptor
//   • Attach Bearer token from AsyncStorage
//   • Log request URL in development
// ──────────────────────────────────────────────────────────────────────────────

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      // In Axios, remove Content-Type if FormData is passed directly
      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
      } else {
        delete config.headers['Content-Type'];
      }
    }

    if (__DEV__) {
      console.log('[API] ➜', config.method?.toUpperCase(), config.baseURL + (config.url || ''));
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ──────────────────────────────────────────────────────────────────────────────
//  Response interceptor
//   • Log HTTP status in development
//   • On 401: clear token + userData, redirect to login
//   • Network errors and 400 errors do NOT clear the token
// ──────────────────────────────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log('[API] ✓', response.status, response.config?.url);
    }
    return response;
  },
  async (error) => {
    const status = error.response?.status;

    if (__DEV__) {
      if (error.response) {
        console.warn(
          '[API] ✗',
          status,
          error.config?.url,
          '\n[Backend Error]',
          JSON.stringify(error.response.data, null, 2),
        );
      } else {
        console.warn('[API] Network Error:', error.message);
      }
    }

    if (status === 401) {
      // Session expired — clear credentials and send user to login
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      try {
        router.replace('/');
      } catch {
        // Router may not be mounted yet (e.g. during app bootstrap) — safe to ignore
      }
    }

    // For network errors, 400, or any other status: do NOT clear the token.
    return Promise.reject(error);
  },
);

// ──────────────────────────────────────────────────────────────────────────────
//  uploadProfilePhotoApi
//
//  Uses React Native's native fetch to stream multipart/form-data safely.
//  (React Native's native networking layer handles { uri, name, type } objects
//  inside FormData and sets the multipart boundary header automatically,
//  avoiding Axios/XMLHttpRequest "Network Error" boundary serialization bugs).
// ──────────────────────────────────────────────────────────────────────────────

export const uploadProfilePhotoApi = async (asset, index = 0, tokenOverride = null) => {
  if (!asset?.uri) {
    throw new Error('Selected image URI is missing');
  }

  const token = tokenOverride || (await AsyncStorage.getItem('userToken'));
  if (!token) {
    throw new Error('Login token not found');
  }

  const fileName = asset.fileName || asset.name || `photo-${index}-${Date.now()}.jpg`;
  const fileType = asset.mimeType || asset.type || 'image/jpeg';

  const formData = new FormData();
  formData.append('file', {
    uri: asset.uri,
    name: fileName,
    type: fileType,
  });

  const uploadUrl = `${BASE_URL}/profiles/photo?photoIndex=${index}`;

  if (__DEV__) {
    console.log('[API Upload] ➜ POST', uploadUrl, {
      uri: asset.uri,
      name: fileName,
      type: fileType,
    });
  }

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      // Notice: Do NOT set Content-Type header so native fetch sets multipart boundary automatically
    },
    body: formData,
  });

  const responseText = await response.text();

  if (__DEV__) {
    console.log('[API Upload] ✓ Status:', response.status, 'Response:', responseText);
  }

  let responseData = null;
  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      try {
        router.replace('/');
      } catch {}
    }

    const backendMessage =
      typeof responseData === 'object'
        ? responseData?.message || responseData?.error
        : responseData;

    const error = new Error(
      backendMessage || `Upload failed with status ${response.status}`,
    );
    error.response = {
      status: response.status,
      data: responseData,
    };
    throw error;
  }

  return responseData;
};

export default api;
