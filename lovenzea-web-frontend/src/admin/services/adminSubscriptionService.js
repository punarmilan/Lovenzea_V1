import adminApi from './adminApi';

const adminSubscriptionService = {
    getAllPlans: async () => {
        const response = await adminApi.get('/subscriptions/plans');
        return response.data;
    },
    createPlan: async (plan) => {
        const response = await adminApi.post('/subscriptions/plans', plan);
        return response.data;
    },
    updatePlan: async (id, plan) => {
        const response = await adminApi.put(`/subscriptions/plans/${id}`, plan);
        return response.data;
    },
    deletePlan: async (id) => {
        const response = await adminApi.delete(`/subscriptions/plans/${id}`);
        return response.data;
    }
};

export default adminSubscriptionService;
