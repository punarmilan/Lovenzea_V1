import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚡️ IMPORTANT: Replace 'localhost' with your computer's local IP address (e.g. 192.168.1.5)
// so the mobile app can reach your backend server.
export const LOCAL_IP = '192.168.1.41'; 

const BASE_URL = `https://app.lovenzea.online/api`;
export const SOCKET_URL = `https://app.lovenzea.online/`;
export const STOMP_URL = `wss://app.lovenzea.online/ws`;
export const SOCKJS_URL = `https://app.lovenzea.online/ws`;

// const BASE_URL = `https://punar-milan-backend-v-1-0-h129.vercel.app/api`;
// export const SOCKET_URL = `https://punar-milan-backend-v-1-0-h129.vercel.app/`;


// const BASE_URL = `http://10.205.169.48:3009/api`;
// export const SOCKET_URL = `http://10.205.169.48:3009`;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
