import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import store from '../Store/store';
import { receiveMessage } from '../Slice/ChatSlice';
import { SOCKJS_URL } from '../constants/apiUrls';

let stompClient = null;
let socket = null;
let isConnecting = false;
let retryCount = 0; // For exponential backoff

const ChatService = {
    connect: (userId) => {
        if (isConnecting || (stompClient && stompClient.connected)) return;
        isConnecting = true;

        socket = new SockJS(SOCKJS_URL);
        stompClient = Stomp.over(socket);

        // Disable logging in production
        stompClient.debug = null;

        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        stompClient.connect(headers, (frame) => {
            isConnecting = false;
            retryCount = 0; // Reset on successful connection
            
            // Subscribe to private queue
            stompClient.subscribe('/user/queue/messages', (messageOutput) => {
                try {
                    const message = JSON.parse(messageOutput.body);
                    const state = store.getState();
                    const currentUserId = state.user?.user?.id;
                    
                    store.dispatch(receiveMessage({ ...message, currentUserId }));
                } catch (e) {
                    console.error("Error processing received message:", e);
                }
            });
        }, (error) => {
            isConnecting = false;
            
            // Reconnect logic with exponential backoff
            if (socket) {
                const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Max 30s
                retryCount++;
                
                setTimeout(() => {
                    const user = store.getState().user.user;
                    if (user && user.id) {
                        ChatService.connect(user.id);
                    }
                }, delay);
            }
        });
    },

    disconnect: () => {
        isConnecting = false;
        if (stompClient !== null) {
            try {
                if (stompClient.connected) {
                    stompClient.disconnect();
                    console.log("Disconnected STOMP Client");
                }
            } catch (err) {
                console.warn("STOMP disconnect failed:", err);
            }
        }
        
        if (socket !== null) {
            try {
                socket.close();
                console.log("Closed WebSocket Socket");
            } catch (err) {
                console.error("Error during socket close:", err);
            }
        }

        stompClient = null;
        socket = null;
    },

    sendMessage: (messageDTO) => {
        if (!messageDTO) {
            console.warn("Attempted to send null message");
            return;
        }

        if (stompClient && stompClient.connected) {
            try {
                stompClient.send("/app/chat.send", {}, JSON.stringify(messageDTO));
            } catch (err) {
                console.error("Error calling stompClient.send:", err);
            }
        } else {
            // Try to reconnect if possible
            const user = store.getState().user.user;
            if (user?.id) {
                ChatService.connect(user.id);
            }
        }
    }
};

export default ChatService;
