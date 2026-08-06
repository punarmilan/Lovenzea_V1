import adminApi from './adminApi';

export const adminDashboardService = {
  getStats: async () => {
    const response = await adminApi.get('/dashboard/stats');
    return response.data;
  },
  getRecentActivity: async () => {
    try {
      const response = await adminApi.get('/logs?page=0&size=6');
      return response.data;
    } catch (e) {
      return null;
    }
  }
};

export default adminDashboardService;
