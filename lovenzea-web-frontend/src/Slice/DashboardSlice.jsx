import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchDashboardSummary = createAsyncThunk(
    'dashboard/fetchSummary',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/dashboard/summary');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard summary');
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        summary: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        },
        updateDashboardUser: (state, action) => {
            if (state.summary) {
                state.summary.user = { ...state.summary.user, ...action.payload };
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDashboardSummary.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchDashboardSummary.fulfilled, (state, action) => {
            state.loading = false;
            state.summary = action.payload;
            state.error = null;
        });
        builder.addCase(fetchDashboardSummary.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { clearDashboardError, updateDashboardUser } = dashboardSlice.actions;
export default dashboardSlice.reducer;
