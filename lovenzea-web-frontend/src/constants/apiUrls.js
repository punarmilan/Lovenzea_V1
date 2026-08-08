const isDev = import.meta.env.DEV;
const productionApiUrl = import.meta.env.VITE_API_URL || 'https://api.lovenzea.online/api';
const productionWsUrl = import.meta.env.VITE_WS_URL || 'wss://api.lovenzea.online/ws';
const productionRootUrl = productionApiUrl.replace(/\/api\/?$/, '/');
const productionSockJsUrl = productionWsUrl.replace(/^wss:/, 'https:').replace(/^ws:/, 'http:');

export const BASE_URL = isDev ? '/api' : productionApiUrl;
export const SOCKET_URL = isDev ? '/' : productionRootUrl;
export const STOMP_URL = isDev ? '/ws' : productionWsUrl;
export const SOCKJS_URL = isDev ? '/ws' : productionSockJsUrl;

// console.log("import.meta.env.DEV =", import.meta.env.DEV);
// console.log("isDev =", isDev);

// console.log("base url =", BASE_URL);
