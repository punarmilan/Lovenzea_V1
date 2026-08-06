import adminApi from './adminApi';

const adminSupportService = {
    getAllTickets: async (params) => {
        const response = await adminApi.get('/support/tickets', { params });
        return response.data;
    },
    respondToTicket: async (id, responseText) => {
        const response = await adminApi.post(`/support/tickets/${id}/respond`, { response: responseText });
        return response.data;
    }
};

export default adminSupportService;
