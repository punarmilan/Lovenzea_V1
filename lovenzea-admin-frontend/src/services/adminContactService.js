import adminApi from './adminApi';

const adminContactService = {
  getAllMessages: async () => {
    const response = await adminApi.get('/contact-messages');
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await adminApi.patch(`/contact-messages/${id}/status?status=${status}`);
    return response.data;
  }
};

export default adminContactService;
