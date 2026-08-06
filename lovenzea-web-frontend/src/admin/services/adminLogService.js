import adminApi from './adminApi';

const adminLogService = {
    getAllLogs: async (params) => {
        const response = await adminApi.get('/logs', { params });
        return response.data;
    }
};

export default adminLogService;
