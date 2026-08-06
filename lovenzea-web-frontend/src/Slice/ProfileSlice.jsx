import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { updateDashboardUser } from './DashboardSlice';
import { updateUser } from './UserSlice';

export const fetchMyProfile = createAsyncThunk(
    'profile/fetchMyProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/profiles/me');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (profileData, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.patch('/profiles/me', profileData);
            const updatedProfile = response.data;

            // Synchronize with other slices
            dispatch(updateDashboardUser(updatedProfile));
            dispatch(updateUser(updatedProfile));

            return updatedProfile;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

export const fetchPartnerPreferences = createAsyncThunk(
    'profile/fetchPartnerPreferences',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/preferences/me');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch preferences');
        }
    }
);

export const updatePartnerPreferences = createAsyncThunk(
    'profile/updatePartnerPreferences',
    async (prefData, { rejectWithValue }) => {
        try {
            const response = await api.post('/preferences', prefData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update preferences');
        }
    }
);

export const uploadProfilePhoto = createAsyncThunk(
    'profile/uploadPhoto',
    async ({ file, photoIndex = 0 }, { dispatch, rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('photoIndex', photoIndex);

            const response = await api.post('/profiles/photo', formData);

            // Synchronize with other slices
            const updatedProfile = response.data;
            dispatch(updateDashboardUser(updatedProfile));
            dispatch(updateUser(updatedProfile));

            return updatedProfile;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload photo');
        }
    }
);

export const uploadIdProof = createAsyncThunk(
    'profile/uploadIdProof',
    async ({ file, idProofType, idProofNumber }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('idProofType', idProofType);
            formData.append('idProofNumber', idProofNumber);

            const response = await api.post('/profiles/id-proof', formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload verification document');
        }
    }
);

export const deleteProfilePhoto = createAsyncThunk(
    'profile/deletePhoto',
    async (photoIndex, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.delete(`/profiles/photos/${photoIndex}`);
            const updatedProfile = response.data; // Backend returns updated ProfileDTO

            // Synchronize with other slices
            dispatch(updateDashboardUser(updatedProfile));
            dispatch(updateUser(updatedProfile));

            return updatedProfile;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete photo');
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profile: null,
        preferences: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearProfileError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch My Profile
        builder.addCase(fetchMyProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchMyProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload;
            state.error = null;
        });
        builder.addCase(fetchMyProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Update Profile
        builder.addCase(updateProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload;
            state.error = null;
        });
        builder.addCase(updateProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Partner Preferences
        builder.addCase(fetchPartnerPreferences.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchPartnerPreferences.fulfilled, (state, action) => {
            state.loading = false;
            state.preferences = action.payload;
            state.error = null;
        });
        builder.addCase(fetchPartnerPreferences.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(updatePartnerPreferences.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updatePartnerPreferences.fulfilled, (state, action) => {
            state.loading = false;
            state.preferences = action.payload;
            state.error = null;
        });
        builder.addCase(updatePartnerPreferences.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Upload Profile Photo
        builder.addCase(uploadProfilePhoto.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(uploadProfilePhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload;
            state.error = null;
        });
        builder.addCase(uploadProfilePhoto.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Upload ID Proof
        builder.addCase(uploadIdProof.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(uploadIdProof.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload;
            state.error = null;
        });
        builder.addCase(uploadIdProof.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Delete Profile Photo
        builder.addCase(deleteProfilePhoto.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteProfilePhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload;
            state.error = null;
        });
        builder.addCase(deleteProfilePhoto.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
