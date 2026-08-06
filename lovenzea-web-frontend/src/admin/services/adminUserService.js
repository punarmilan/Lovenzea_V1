import adminApi from './adminApi';

const adminUserService = {
    getAllUsers: async (params) => {
        // params will include page, size, and filters (email, mobileNumber, gender, etc.)
        const response = await adminApi.get('/users', { params });
        return response.data;
    },

    getUserById: async (id) => {
        const response = await adminApi.get(`/users/${id}`);
        return response.data;
    },

    blockUser: async (id) => {
        const response = await adminApi.post(`/users/${id}/block`);
        return response.data;
    },

    unblockUser: async (id) => {
        const response = await adminApi.post(`/users/${id}/unblock`);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await adminApi.delete(`/users/${id}`);
        return response.data;
    }
};

export default adminUserService;
