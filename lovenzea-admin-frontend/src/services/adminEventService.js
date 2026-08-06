import adminApi from './adminApi';

const adminEventService = {
  getAllEvents: async () => {
    const response = await adminApi.get('/events');
    return response.data;
  },
  createEvent: async (eventData) => {
    const response = await adminApi.post('/events', eventData);
    return response.data;
  },
  updateEvent: async (id, eventData) => {
    const response = await adminApi.put(`/events/${id}`, eventData);
    return response.data;
  },
  deleteEvent: async (id) => {
    const response = await adminApi.delete(`/events/${id}`);
    return response.data;
  },
  getEventRegistrants: async (id) => {
    const response = await adminApi.get(`/events/${id}/registrants`);
    return response.data;
  }
};

export default adminEventService;
