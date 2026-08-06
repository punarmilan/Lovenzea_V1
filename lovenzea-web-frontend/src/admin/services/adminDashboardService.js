import adminApi from './adminApi';

export const adminDashboardService = {
    getStats: async () => {
        const response = await adminApi.get('/dashboard/stats');
        return response.data;
    }
};
