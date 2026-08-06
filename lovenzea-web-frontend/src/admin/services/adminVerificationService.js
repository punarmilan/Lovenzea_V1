import adminApi from './adminApi';

const adminVerificationService = {
    getPendingProfiles: async (params) => {
        const response = await adminApi.get('/verifications/profiles/pending', { params });
        return response.data;
    },

    approveProfile: async (id) => {
        const response = await adminApi.post(`/verifications/profiles/${id}/approve`);
        return response.data;
    },

    rejectProfile: async (id, reason) => {
        const response = await adminApi.post(`/verifications/profiles/${id}/reject`, { reason });
        return response.data;
    },

    getPendingPhotos: async (params) => {
        const response = await adminApi.get('/verifications/photos/pending', { params });
        return response.data;
    },

    approvePhotos: async (id) => {
        const response = await adminApi.post(`/verifications/photos/${id}/approve`);
        return response.data;
    },

    rejectPhotos: async (id, reason) => {
        const response = await adminApi.post(`/verifications/photos/${id}/reject`, { reason });
        return response.data;
    },

    deleteUserPhoto: async (profileId, index) => {
        const response = await adminApi.delete(`/verifications/photos/${profileId}/${index}`);
        return response.data;
    }
};

export default adminVerificationService;
