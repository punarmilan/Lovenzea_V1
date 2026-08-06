import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async thunks
export const register = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const login = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const loginWithOtp = createAsyncThunk(
    'user/loginWithOtp',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login-otp/verify', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'OTP Login failed');
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'user/forgotPassword',
    async (emailData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/forgot-password', emailData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send reset link');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'user/resetPassword',
    async (resetData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/reset-password', resetData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
        }
    }
);

export const verifyForgotPasswordOtp = createAsyncThunk(
    'user/verifyForgotPasswordOtp',
    async (otpData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/forgot-password/verify-otp', otpData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
        }
    }
);

export const resetPasswordWithOtp = createAsyncThunk(
    'user/resetPasswordWithOtp',
    async (resetData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/reset-password-otp', resetData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
        }
    }
);

export const logout = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().user;
            if (user && user.email) {
                await api.post(`/auth/logout?email=${user.email}`);
            }
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            // Still return success so frontend clears state even if backend call fails
            return { success: true };
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    'user/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/auth/me'); // Assuming there's a /me or similar endpoint
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get user');
        }
    }
);

export const fetchSubscriptionDetails = createAsyncThunk(
    'user/fetchSubscriptionDetails',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/subscriptions/details');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscription details');
        }
    }
);

export const trackContactView = createAsyncThunk(
    'user/trackContactView',
    async (profileId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/subscriptions/track-contact-view/${profileId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to track contact view');
        }
    }
);

export const fetchViewedContacts = createAsyncThunk(
    'user/fetchViewedContacts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/subscriptions/viewed-contacts');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch viewed contacts');
        }
    }
);

export const sendReferralInvite = createAsyncThunk(
    'user/sendReferralInvite',
    async (emailData, { rejectWithValue }) => {
        try {
            const response = await api.post('/referral/invite', emailData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send invitation');
        }
    }
);

const getStoredUser = () => {
    const user = localStorage.getItem('user');
    if (user && user !== "undefined") {
        try {
            return JSON.parse(user);
        } catch (e) {
            return null;
        }
    }
    return null;
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: getStoredUser(),
        loading: false,
        error: null,
        isAuthenticated: !!getStoredUser(), // Initial guess based on cached user
        subscriptionDetails: null,
        viewedContacts: [],
        viewedContactsLoading: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('user', JSON.stringify(state.user));
        }
    },
    extraReducers: (builder) => {
        // Register
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            const userData = action.payload; 
            
            state.user = userData;
            state.isAuthenticated = true;
            state.error = null;

            // Store minimal user info in localStorage
            localStorage.setItem('user', JSON.stringify(userData));
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        });

        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            const userData = action.payload;

            state.user = userData;
            state.isAuthenticated = true;
            state.error = null;

            // Store in localStorage
            localStorage.setItem('user', JSON.stringify(userData));
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        });

        // OTP Login
        builder.addCase(loginWithOtp.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginWithOtp.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        });
        builder.addCase(loginWithOtp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Logout
        builder.addCase(logout.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.loading = false;
            // Clear localStorage
            localStorage.removeItem('user');
        });
        builder.addCase(logout.rejected, (state) => {
            state.loading = false;
            // Still clear if logout failed at backend
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
        });

        // Get current user
        builder.addCase(getCurrentUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getCurrentUser.fulfilled, (state, action) => {
            state.user = action.payload; 
            state.isAuthenticated = true;
            state.loading = false;
            localStorage.setItem('user', JSON.stringify(action.payload));
        });
        builder.addCase(getCurrentUser.rejected, (state, action) => {
            state.loading = false;
            // Only clear auth if it's a definitive auth failure (401/403)
            // Don't clear on transient network errors, timeouts, or server restarts
            const status = action.payload?.status || action.meta?.requestStatus;
            const isAuthError = typeof action.payload === 'string' && 
                (action.payload.includes('401') || action.payload.includes('403') || action.payload.includes('Unauthorized'));
            
            if (isAuthError) {
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('user');
            }
            // For other errors (network, 500, etc), keep the cached user
        });

        // Forgot Password
        builder.addCase(forgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(forgotPassword.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Verify Forgot Password OTP
        builder.addCase(verifyForgotPasswordOtp.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(verifyForgotPasswordOtp.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });
        builder.addCase(verifyForgotPasswordOtp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Reset Password With OTP
        builder.addCase(resetPasswordWithOtp.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(resetPasswordWithOtp.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });
        builder.addCase(resetPasswordWithOtp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Reset Password
        builder.addCase(resetPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(resetPassword.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(resetPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Subscription Details
        builder.addCase(fetchSubscriptionDetails.fulfilled, (state, action) => {
            state.subscriptionDetails = action.payload;
            if (state.user && action.payload && typeof action.payload.active !== 'undefined') {
                state.user.isPremium = action.payload.active;
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        });
        builder.addCase(trackContactView.fulfilled, (state, action) => {
            state.subscriptionDetails = action.payload;
            if (state.user && action.payload && typeof action.payload.active !== 'undefined') {
                state.user.isPremium = action.payload.active;
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        });

        // Viewed Contacts History
        builder.addCase(fetchViewedContacts.pending, (state) => {
            state.viewedContactsLoading = true;
        });
        builder.addCase(fetchViewedContacts.fulfilled, (state, action) => {
            state.viewedContactsLoading = false;
            state.viewedContacts = action.payload || [];
        });
        builder.addCase(fetchViewedContacts.rejected, (state, action) => {
            state.viewedContactsLoading = false;
            state.error = action.payload;
        });
    }
});

export const { clearError, updateUser } = userSlice.actions;
export default userSlice.reducer; 