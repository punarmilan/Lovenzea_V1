const isDev = import.meta.env.DEV;

export const BASE_URL = isDev ? '/api' : 'https://api.lovenzea.online/api';
export const SOCKET_URL = isDev ? '/' : 'https://api.lovenzea.online/';
export const STOMP_URL = isDev ? '/ws' : 'wss://api.lovenzea.online/ws';
export const SOCKJS_URL = isDev ? '/ws' : 'https://api.lovenzea.online/ws';
