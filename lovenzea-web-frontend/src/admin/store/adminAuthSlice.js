import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAuthService } from '../services/adminAuthService';

const storedAdmin = JSON.parse(localStorage.getItem('adminData'));

export const adminLogin = createAsyncThunk(
    'adminAuth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            return await adminAuthService.login(email, password);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState: {
        admin: storedAdmin || null,
        loading: false,
        error: null,
    },
    reducers: {
        adminLogout: (state) => {
            adminAuthService.logout();
            state.admin = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload;
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
