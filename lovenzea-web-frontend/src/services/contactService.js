import api from './api';
import adminApi from '../admin/services/adminApi';

const contactService = {
    submitMessage: async (messageData) => {
        const response = await api.post('/contact/submit', messageData);
        return response.data;
    },
    // Admin methods using adminApi to ensure Authorization header is sent
    getAllMessages: async () => {
        const response = await adminApi.get('/contact-messages');
        return response.data;
    },
    updateStatus: async (id, status) => {
        const response = await adminApi.patch(`/contact-messages/${id}/status?status=${status}`);
        return response.data;
    }
};

export default contactService;
