import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const submitReport = createAsyncThunk(
    'report/submitReport',
    async (reportData, { rejectWithValue }) => {
        try {
            const response = await api.post('/reports', reportData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const reportSlice = createSlice({
    name: 'report',
    initialState: {
        loading: false,
        success: false,
        error: null,
    },
    reducers: {
        resetReportState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitReport.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(submitReport.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(submitReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    }
});

export const { resetReportState } = reportSlice.actions;
export default reportSlice.reducer;
