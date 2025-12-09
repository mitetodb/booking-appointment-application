import { api } from './apiClient';

export const notificationService = {
  async getMyNotifications() {
    const res = await api.get('/notifications/my');
    return res.data;
  },

  async markAsRead(id) {
    await api.post(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    await api.post('/notifications/read-all');
  },
};
