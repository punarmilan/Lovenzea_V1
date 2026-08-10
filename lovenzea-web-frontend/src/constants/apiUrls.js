const isDev = import.meta.env.DEV;

export const BASE_URL = isDev ? '/api' : `https://api.lovenzea.online/api`;
export const SOCKET_URL = isDev ? '/' : `https://api.lovenzea.online/`;
export const STOMP_URL = isDev ? '/ws' : `wss://api.lovenzea.online/ws`;
export const SOCKJS_URL = isDev ? '/ws' : `https://api.lovenzea.online/ws`;

// console.log("import.meta.env.DEV =", import.meta.env.DEV);
// console.log("isDev =", isDev);

// export const BASE_URL = isDev ? '/api' :`https://app.lovenzea.online/api`;
// export const SOCKET_URL = isDev ? '/' : `https://app.lovenzea.online/`;
// export const STOMP_URL = isDev ? '/ws' : `wss://app.lovenzea.online/ws`;
// export const SOCKJS_URL = isDev ? '/ws' : `https://app.lovenzea.online/ws`;

// console.log("base url =", BASE_URL);