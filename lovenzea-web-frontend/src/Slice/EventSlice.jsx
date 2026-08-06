import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchUpcomingEvents = createAsyncThunk(
    'events/fetchUpcoming',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/events/upcoming');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
        }
    }
);

const eventSlice = createSlice({
    name: 'events',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearEventError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUpcomingEvents.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
            state.error = null;
        });
        builder.addCase(fetchUpcomingEvents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { clearEventError } = eventSlice.actions;
export default eventSlice.reducer;
