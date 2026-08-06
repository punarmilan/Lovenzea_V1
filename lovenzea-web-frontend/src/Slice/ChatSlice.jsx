import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const getStoredUserId = () => {
    const user = localStorage.getItem('user');
    if (user && user !== "undefined") {
        try {
            const parsed = JSON.parse(user);
            return parsed.id || parsed.userId || null;
        } catch (e) {
            return null;
        }
    }
    return null;
};

export const fetchChatHistory = createAsyncThunk(
    'chat/fetchChatHistory',
    async ({ targetUserId, page = 0, size = 20 }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/chat/history/${targetUserId}?page=${page}&size=${size}`);
            return { targetUserId, history: response.data.content, totalPages: response.data.totalPages };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchUnreadChatCount = createAsyncThunk(
    'chat/fetchUnreadChatCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/chat/unread-count');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchRecentConversations = createAsyncThunk(
    'chat/fetchRecentConversations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/chat/conversations');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const markChatAsRead = createAsyncThunk(
    'chat/markChatAsRead',
    async (messageId, { rejectWithValue }) => {
        try {
            await api.patch(`/chat/read/${messageId}`);
            return messageId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const markAllChatAsRead = createAsyncThunk(
    'chat/markAllChatAsRead',
    async (partnerId, { rejectWithValue }) => {
        try {
            await api.patch(`/chat/read/all/${partnerId}`);
            return partnerId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        conversations: {}, // { userId: { messages: [], totalPages: 0, currentPage: 0 } }
        recentConversations: [],
        currentUserId: getStoredUserId(),
        activeChatUserId: null,
        activeChatUser: null, // full user object for ChatWindow
        unreadCount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        setActiveChatUser: (state, action) => {
            state.activeChatUserId = action.payload;
        },
        openChatWith: (state, action) => {
            // payload: { id, fullName, profilePhotoUrl, displayNameVisibility }
            state.activeChatUser = action.payload;
            state.activeChatUserId = action.payload?.id ?? null;
        },
        closeChatWindow: (state) => {
            state.activeChatUser = null;
            state.activeChatUserId = null;
        },
        clearChatError: (state) => {
            state.error = null;
        },
        receiveMessage: (state, action) => {
            const { currentUserId: receivedCurrentUserId, ...message } = action.payload;
            // Use ID from payload if provided, otherwise fallback to state
            const effectiveCurrentId = receivedCurrentUserId || state.currentUserId;
            
            // Use loose equality for ID comparison to handle string/number mismatch
            const otherUserId = (String(message.senderId) == String(effectiveCurrentId))
                ? message.recipientId
                : message.senderId;

            if (!otherUserId) {
                console.warn("Could not determine otherUserId for message:", message);
                return;
            }

            if (!state.conversations[otherUserId]) {
                state.conversations[otherUserId] = { messages: [], totalPages: 0, currentPage: 0 };
            }

            // Avoid duplicates
            const isDuplicate = state.conversations[otherUserId].messages.some(m =>
                (m.id && m.id === message.id) ||
                (m.createdAt === message.createdAt && m.content === message.content)
            );

            if (message.error) {
                state.error = message.error;
                return;
            }

            if (!isDuplicate) {
                state.conversations[otherUserId].messages.push(message);
            }

            // Update unread count if message is for us and we are not in that chat
            if (String(message.recipientId) == String(state.currentUserId) &&
                String(state.activeChatUserId) != String(message.senderId)) {
                state.unreadCount += 1;
            }
        },
        setCurrentUserId: (state, action) => {
            state.currentUserId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChatHistory.fulfilled, (state, action) => {
                state.loading = false;
                const { targetUserId, history, totalPages } = action.payload;
                state.conversations[targetUserId] = {
                    messages: history.reverse(), // Show oldest first in history
                    totalPages,
                    currentPage: 0
                };
            })
            .addCase(fetchChatHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUnreadChatCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })
            .addCase(fetchRecentConversations.fulfilled, (state, action) => {
                state.recentConversations = action.payload;
            })
            .addCase(markAllChatAsRead.fulfilled, (state, action) => {
                const partnerId = action.payload;
                // Find and update the specific conversation in recentConversations
                const convIndex = state.recentConversations.findIndex(c => String(c.otherUserId) === String(partnerId));
                if (convIndex !== -1) {
                    const unreadCount = state.recentConversations[convIndex].unreadCount || 0;
                    state.recentConversations[convIndex].unreadCount = 0;
                    // Also reduce the total unreadCount
                    state.unreadCount = Math.max(0, state.unreadCount - unreadCount);
                }
            })
            .addCase('user/logout/fulfilled', (state) => {
                state.currentUserId = null;
                state.conversations = {};
                state.unreadCount = 0;
            })
            // Update currentUserId when user logs in or registers
            .addMatcher(
                (action) => action.type === 'user/login/fulfilled' || action.type === 'user/register/fulfilled',
                (state, action) => {
                    const userData = action.payload;
                    state.currentUserId = userData.id || userData.userId || null;
                }
            );
    }
});

export const { setActiveChatUser, receiveMessage, setCurrentUserId, openChatWith, closeChatWindow, clearChatError } = chatSlice.actions;
export default chatSlice.reducer;
