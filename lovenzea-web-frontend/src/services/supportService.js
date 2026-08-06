import api from './api';

const supportService = {
    createTicket: async (ticketData) => {
        const response = await api.post('/support/tickets', ticketData);
        return response.data;
    },
    getMyTickets: async (page = 0, size = 10) => {
        const response = await api.get('/support/tickets', {
            params: { page, size, sort: 'createdAt,desc' }
        });
        return response.data;
    }
};

export default supportService;
