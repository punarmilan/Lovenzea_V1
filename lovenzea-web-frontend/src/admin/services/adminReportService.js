import adminApi from './adminApi';

const adminReportService = {
    getAllReports: async (params) => {
        const response = await adminApi.get('/reports', { params });
        return response.data;
    },

    resolveReport: async (id, adminNote) => {
        const response = await adminApi.post(`/reports/${id}/resolve`, { adminNote });
        return response.data;
    },

    dismissReport: async (id) => {
        const response = await adminApi.post(`/reports/${id}/dismiss`);
        return response.data;
    }
};

export default adminReportService;
