import adminApi from './adminApi';

export const adminAuthService = {
    login: async (email, password) => {
        const response = await adminApi.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('adminData', JSON.stringify(response.data));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('adminData');
    },
    // Staff Management
    getAllStaff: async () => {
        const response = await adminApi.get('/dashboard/staff');
        return response.data;
    },
    createStaff: async (staffData) => {
        const response = await adminApi.post('/dashboard/staff', staffData);
        return response.data;
    },
    deleteStaff: async (id) => {
        const response = await adminApi.delete(`/dashboard/staff/${id}`);
        return response.data;
    }
};

export default adminApi;
