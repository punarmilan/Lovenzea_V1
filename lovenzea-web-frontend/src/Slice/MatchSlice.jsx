import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchFilterOptions = createAsyncThunk(
    'match/fetchFilterOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/profiles/filters');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const searchPremiumProfiles = createAsyncThunk(
    'match/searchPremiumProfiles',
    async (searchData, { rejectWithValue }) => {
        try {
            // Using a default large size or pagination if needed
            const response = await api.post('/profiles/search?page=0&size=50', searchData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchNewMatches = createAsyncThunk(
    'match/fetchNewMatches',
    async (params = { page: 0, size: 20 }, { rejectWithValue }) => {
        try {
            const { page, size } = params;
            const response = await api.get(`/matches/new?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchDailyMatches = createAsyncThunk(
    'match/fetchDailyMatches',
    async (params = { page: 0, size: 20 }, { rejectWithValue }) => {
        try {
            const { page, size } = params;
            const response = await api.get(`/matches/today?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchAllMatches = createAsyncThunk(
    'match/fetchAllMatches',
    async (params = { page: 0, size: 20 }, { rejectWithValue }) => {
        try {
            const { page, size } = params;
            const response = await api.get(`/matches/all?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchNearMeMatches = createAsyncThunk(
    'match/fetchNearMeMatches',
    async (params = { page: 0, size: 20 }, { rejectWithValue }) => {
        try {
            const { page, size } = params;
            const response = await api.get(`/matches/near-me?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchShortlist = createAsyncThunk(
    'match/fetchShortlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/shortlist/my');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addToShortlistServer = createAsyncThunk(
    'match/addToShortlistServer',
    async (profile, { rejectWithValue }) => {
        try {
            await api.post(`/shortlist/${profile.id}`);
            return profile;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removeFromShortlistServer = createAsyncThunk(
    'match/removeFromShortlistServer',
    async (profileId, { rejectWithValue }) => {
        try {
            await api.delete(`/shortlist/${profileId}`);
            return profileId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchRecentlyViewed = createAsyncThunk(
    'match/fetchRecentlyViewed',
    async (params = { page: 0, size: 20 }, { rejectWithValue }) => {
        try {
            const { page, size } = params;
            const response = await api.get(`/matches/recently-viewed?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchRecentVisitors = createAsyncThunk(
    'match/fetchRecentVisitors',
    async (params = { page: 0, size: 20 }, { rejectWithValue }) => {
        try {
            const { page, size } = params;
            const response = await api.get(`/matches/recent-visitors?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchOnlineMatches = createAsyncThunk(
    'match/fetchOnlineMatches',
    async (params = { page: 0, size: 20 }, { rejectWithValue }) => {
        try {
            const { page, size } = params;
            const response = await api.get(`/social/online-matches?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchOnlineAccepted = createAsyncThunk(
    'match/fetchOnlineAccepted',
    async (params = { page: 0, size: 20 }, { rejectWithValue }) => {
        try {
            const { page, size } = params;
            const response = await api.get(`/social/online-accepted?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchShortlistedSocial = createAsyncThunk(
    'match/fetchShortlistedSocial',
    async (params = { page: 0, size: 20 }, { rejectWithValue }) => {
        try {
            const { page, size } = params;
            const response = await api.get(`/social/shortlisted?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const logProfileView = createAsyncThunk(
    'match/logProfileView',
    async (profileId, { rejectWithValue }) => {
        try {
            await api.post(`/matches/view/${profileId}`);
            return profileId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchReceivedRequests = createAsyncThunk(
    'match/fetchReceivedRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/connections/received?status=PENDING&type=CONNECTION');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchSentRequests = createAsyncThunk(
    'match/fetchSentRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/connections/sent?type=CONNECTION');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchAcceptedByMe = createAsyncThunk(
    'match/fetchAcceptedByMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/connections/received?status=ACCEPTED');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchAcceptedByHer = createAsyncThunk(
    'match/fetchAcceptedByHer',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/connections/sent?status=ACCEPTED');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchDeclinedByMe = createAsyncThunk(
    'match/fetchDeclinedByMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/connections/received?status=DECLINED');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchDeclinedByThem = createAsyncThunk(
    'match/fetchDeclinedByThem',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/connections/sent?status=DECLINED');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchReceivedPhotoRequests = createAsyncThunk(
    'match/fetchReceivedPhotoRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/connections/received?status=PENDING&type=PHOTO');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchPhotoRequests = createAsyncThunk(
    'match/fetchPhotoRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/connections/sent?type=PHOTO');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchProfileById = createAsyncThunk(
    'match/fetchProfileById',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/profiles/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchPreferenceMatch = createAsyncThunk(
    'match/fetchPreferenceMatch',
    async (profileId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/matches/preference-match/${profileId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const sendConnectionRequest = createAsyncThunk(
    'match/sendConnectionRequest',
    async (receiverProfileId, { rejectWithValue, dispatch }) => {
        try {
            await api.post(`/connections/send/${receiverProfileId}`);
            dispatch(fetchSentRequests());
            return receiverProfileId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const withdrawConnectionRequest = createAsyncThunk(
    'match/withdrawConnectionRequest',
    async (receiverProfileId, { rejectWithValue, dispatch }) => {
        try {
            await api.delete(`/connections/withdraw/${receiverProfileId}`);
            dispatch(fetchSentRequests());
            return receiverProfileId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const acceptConnectionRequest = createAsyncThunk(
    'match/acceptConnectionRequest',
    async (requestId, { rejectWithValue, dispatch }) => {
        try {
            await api.put(`/connections/accept/${requestId}`);
            dispatch(fetchReceivedRequests());
            dispatch(fetchAcceptedByMe());
            return requestId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const declineConnectionRequest = createAsyncThunk(
    'match/declineConnectionRequest',
    async (requestId, { rejectWithValue, dispatch }) => {
        try {
            await api.put(`/connections/decline/${requestId}`);
            dispatch(fetchReceivedRequests());
            dispatch(fetchDeclinedByMe());
            return requestId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const matchSlice = createSlice({
    name: 'match',
    initialState: {
        newMatches: [],
        dailyMatches: [],
        allMatches: [],
        nearMeMatches: [],
        shortlistedProfiles: [],
        recentlyViewedMatches: [],
        recentVisitors: [],
        receivedRequests: [],
        sentRequests: [],
        acceptedByMe: [],
        acceptedByHer: [],
        declinedByMe: [],
        declinedByThem: [],
        photoRequestsSent: [],
        photoRequestsReceived: [],
        onlineMatches: [],
        onlineAccepted: [],
        currentProfile: null,
        preferenceMatch: null,
        loadingAction: false,
        filterOptions: null,
        searchResults: null,
        searchLoading: false,
        error: null,
        pagination: {
            newMatches: { totalPages: 0, totalElements: 0, page: 0 },
            dailyMatches: { totalPages: 0, totalElements: 0, page: 0 },
            allMatches: { totalPages: 0, totalElements: 0, page: 0 },
            nearMeMatches: { totalPages: 0, totalElements: 0, page: 0 },
            recentlyViewed: { totalPages: 0, totalElements: 0, page: 0 },
            recentVisitors: { totalPages: 0, totalElements: 0, page: 0 },
            onlineMatches: { totalPages: 0, totalElements: 0, page: 0 },
            onlineAccepted: { totalPages: 0, totalElements: 0, page: 0 },
            shortlistedSocial: { totalPages: 0, totalElements: 0, page: 0 }
        },
        hasFetched: {
            new: false,
            today: false,
            my: false,
            near: false,
            recentlyViewed: false,
            recentVisitors: false,
            shortlist: false
        }
    },
    reducers: {
        addToShortlist: (state, action) => {
            const profile = action.payload;
            if (!state.shortlistedProfiles.find(p => p.id === profile.id)) {
                state.shortlistedProfiles.push(profile);
            }
        },
        removeFromShortlist: (state, action) => {
            state.shortlistedProfiles = state.shortlistedProfiles.filter(p => p.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNewMatches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNewMatches.fulfilled, (state, action) => {
                state.loading = false;
                state.newMatches = action.payload.content || [];
                state.pagination.newMatches = {
                    totalPages: action.payload.totalPages,
                    totalElements: action.payload.totalElements,
                    page: action.payload.number
                };
                state.hasFetched.new = true;
            })
            .addCase(fetchNewMatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchDailyMatches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDailyMatches.fulfilled, (state, action) => {
                state.loading = false;
                state.dailyMatches = action.payload.content || [];
                state.pagination.dailyMatches = {
                    totalPages: action.payload.totalPages,
                    totalElements: action.payload.totalElements,
                    page: action.payload.number
                };
                state.hasFetched.today = true;
            })
            .addCase(fetchDailyMatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllMatches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllMatches.fulfilled, (state, action) => {
                state.loading = false;
                state.allMatches = action.payload.content || [];
                state.pagination.allMatches = {
                    totalPages: action.payload.totalPages,
                    totalElements: action.payload.totalElements,
                    page: action.payload.number
                };
                state.hasFetched.my = true;
            })
            .addCase(fetchAllMatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchNearMeMatches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNearMeMatches.fulfilled, (state, action) => {
                state.loading = false;
                state.nearMeMatches = action.payload.content || [];
                state.pagination.nearMeMatches = {
                    totalPages: action.payload.totalPages,
                    totalElements: action.payload.totalElements,
                    page: action.payload.number
                };
                state.hasFetched.near = true;
            })
            .addCase(fetchNearMeMatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchShortlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShortlist.fulfilled, (state, action) => {
                state.loading = false;
                state.shortlistedProfiles = action.payload;
            })
            .addCase(fetchShortlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToShortlistServer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToShortlistServer.fulfilled, (state, action) => {
                state.loading = false;
                const profile = action.payload;
                if (!state.shortlistedProfiles.find(p => p.id === profile.id)) {
                    state.shortlistedProfiles.push(profile);
                }
            })
            .addCase(addToShortlistServer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeFromShortlistServer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromShortlistServer.fulfilled, (state, action) => {
                state.loading = false;
                state.shortlistedProfiles = state.shortlistedProfiles.filter(p => p.id !== action.payload);
            })
            .addCase(removeFromShortlistServer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchRecentlyViewed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecentlyViewed.fulfilled, (state, action) => {
                state.loading = false;
                state.recentlyViewedMatches = action.payload.content || [];
                state.pagination.recentlyViewed = {
                    totalPages: action.payload.totalPages,
                    totalElements: action.payload.totalElements,
                    page: action.payload.number
                };
                state.hasFetched.recentlyViewed = true;
            })
            .addCase(fetchRecentlyViewed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchRecentVisitors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecentVisitors.fulfilled, (state, action) => {
                state.loading = false;
                state.recentVisitors = action.payload.content || [];
                state.pagination.recentVisitors = {
                    totalPages: action.payload.totalPages,
                    totalElements: action.payload.totalElements,
                    page: action.payload.number
                };
                state.hasFetched.recentVisitors = true;
            })
            .addCase(fetchRecentVisitors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logProfileView.pending, (state) => {
                state.error = null;
            })
            .addCase(logProfileView.fulfilled, (state) => {
                // No specific state change needed, just logged
            })
            .addCase(logProfileView.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(fetchReceivedRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReceivedRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.receivedRequests = action.payload;
            })
            .addCase(fetchReceivedRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSentRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSentRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.sentRequests = action.payload;
            })
            .addCase(fetchSentRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAcceptedByMe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAcceptedByMe.fulfilled, (state, action) => {
                state.loading = false;
                state.acceptedByMe = action.payload;
            })
            .addCase(fetchAcceptedByMe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAcceptedByHer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAcceptedByHer.fulfilled, (state, action) => {
                state.loading = false;
                state.acceptedByHer = action.payload;
            })
            .addCase(fetchAcceptedByHer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchDeclinedByMe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeclinedByMe.fulfilled, (state, action) => {
                state.loading = false;
                state.declinedByMe = action.payload;
            })
            .addCase(fetchDeclinedByMe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchDeclinedByThem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeclinedByThem.fulfilled, (state, action) => {
                state.loading = false;
                state.declinedByThem = action.payload;
            })
            .addCase(fetchDeclinedByThem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPhotoRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPhotoRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.photoRequestsSent = action.payload;
            })
            .addCase(fetchPhotoRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchReceivedPhotoRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReceivedPhotoRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.photoRequestsReceived = action.payload;
            })
            .addCase(fetchReceivedPhotoRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendConnectionRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendConnectionRequest.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendConnectionRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Withdraw connection request
            .addCase(withdrawConnectionRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(withdrawConnectionRequest.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(withdrawConnectionRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(acceptConnectionRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptConnectionRequest.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(acceptConnectionRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(declineConnectionRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(declineConnectionRequest.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(declineConnectionRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProfileById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentProfile = null;
            })
            .addCase(fetchProfileById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProfile = action.payload;
            })
            .addCase(fetchProfileById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPreferenceMatch.fulfilled, (state, action) => {
                state.preferenceMatch = action.payload;
            })
            .addCase(fetchOnlineMatches.fulfilled, (state, action) => {
                state.onlineMatches = action.payload.content || [];
                state.pagination.onlineMatches = {
                    totalPages: action.payload.totalPages,
                    totalElements: action.payload.totalElements,
                    page: action.payload.number
                };
            })
            .addCase(fetchOnlineAccepted.fulfilled, (state, action) => {
                state.onlineAccepted = action.payload.content || [];
                state.pagination.onlineAccepted = {
                    totalPages: action.payload.totalPages,
                    totalElements: action.payload.totalElements,
                    page: action.payload.number
                };
            })
            .addCase(fetchShortlistedSocial.fulfilled, (state, action) => {
                state.shortlistedProfiles = action.payload.content || [];
                state.pagination.shortlistedSocial = {
                    totalPages: action.payload.totalPages,
                    totalElements: action.payload.totalElements,
                    page: action.payload.number
                };
            })
            // New reducers for premium filtering
            .addCase(fetchFilterOptions.fulfilled, (state, action) => {
                state.filterOptions = action.payload;
            })
            .addCase(searchPremiumProfiles.pending, (state) => {
                state.searchLoading = true;
                state.error = null;
            })
            .addCase(searchPremiumProfiles.fulfilled, (state, action) => {
                state.searchLoading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchPremiumProfiles.rejected, (state, action) => {
                state.searchLoading = false;
                state.error = action.payload;
            });
    },
});

export const { addToShortlist, removeFromShortlist } = matchSlice.actions;
export default matchSlice.reducer;
