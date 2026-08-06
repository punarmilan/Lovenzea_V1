import api from './api';

const contactService = {
    submitMessage: async (messageData) => {
        const response = await api.post('/contact/submit', messageData);
        return response.data;
    },
    getAllMessages: async () => {
        const response = await api.get('/admin/contact-messages');
        return response.data;
    },
    updateStatus: async (id, status) => {
        const response = await api.patch(`/admin/contact-messages/${id}/status?status=${status}`);
        return response.data;
    }
};

export default contactService;

