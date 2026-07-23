import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚡️ IMPORTANT: Replace 'localhost' with your computer's local IP address (e.g. 192.168.1.5)
// so the mobile app can reach your backend server.
export const LOCAL_IP = '192.168.1.41'; 

const BASE_URL = `http://${LOCAL_IP}:8085/api`;
export const SOCKET_URL = `http://${LOCAL_IP}:8085/`;
export const STOMP_URL = `ws://${LOCAL_IP}:8085/ws`;
export const SOCKJS_URL = `http://${LOCAL_IP}:8085/ws`;

// const BASE_URL = `https://punar-milan-backend-v-1-0-h129.vercel.app/api`;
// export const SOCKET_URL = `https://punar-milan-backend-v-1-0-h129.vercel.app/`;


// const BASE_URL = `http://10.205.169.48:3009/api`;
// export const SOCKET_URL = `http://10.205.169.48:3009`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
