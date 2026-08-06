const isDev = import.meta.env.DEV;

export const BASE_URL = isDev ? '/api' : 'https://app.lovenzea.online/api';
export const SOCKET_URL = isDev ? '/' : 'https://app.lovenzea.online/';
export const STOMP_URL = isDev ? '/ws' : 'wss://app.lovenzea.online/ws';
export const SOCKJS_URL = isDev ? '/ws' : 'https://app.lovenzea.online/ws';
