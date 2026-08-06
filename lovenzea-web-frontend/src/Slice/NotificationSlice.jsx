import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchAll',
    async ({ page = 0, size = 20 } = {}, { rejectWithValue }) => {
        try {
            const response = await api.get(`/notifications?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
        }
    }
);

export const loadMoreNotifications = createAsyncThunk(
    'notifications/loadMore',
    async ({ page, size = 20 } = {}, { rejectWithValue }) => {
        try {
            const response = await api.get(`/notifications?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load more notifications');
        }
    }
);

export const fetchUnreadNotifications = createAsyncThunk(
    'notifications/fetchUnread',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/notifications/unread');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread notifications');
        }
    }
);

export const fetchUnreadCount = createAsyncThunk(
    'notifications/fetchUnreadCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/notifications/unread-count');
            return response.data.count;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId, { rejectWithValue }) => {
        try {
            await api.patch(`/notifications/${notificationId}/read`);
            return notificationId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (_, { rejectWithValue }) => {
        try {
            await api.patch('/notifications/mark-all-read');
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        unreadCount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearNotificationError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch All Notifications (replaces list)
        builder.addCase(fetchNotifications.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload.content;
            state.totalItems = action.payload.totalElements;
            state.totalPages = action.payload.totalPages;
            state.currentPage = 0;
            state.unreadCount = action.payload.content.filter(n => !n.read).length;
        });
        builder.addCase(fetchNotifications.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Load More (appends to existing list)
        builder.addCase(loadMoreNotifications.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(loadMoreNotifications.fulfilled, (state, action) => {
            state.loading = false;
            state.items = [...state.items, ...action.payload.content];
            state.totalItems = action.payload.totalElements;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.meta.arg.page;
        });
        builder.addCase(loadMoreNotifications.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Fetch Unread
        builder.addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
            state.unreadCount = action.payload.length;
        });

        // Fetch Unread Count
        builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
            state.unreadCount = action.payload;
        });

        // Mark as Read
        builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
            const index = state.items.findIndex(n => n.id === action.payload);
            if (index !== -1 && !state.items[index].read) {
                state.items[index].read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        });

        // Mark All as Read
        builder.addCase(markAllNotificationsAsRead.fulfilled, (state) => {
            state.items.forEach(n => n.read = true);
            state.unreadCount = 0;
        });
    }
});

export const { clearNotificationError } = notificationSlice.actions;
export default notificationSlice.reducer;
