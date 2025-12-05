import { api } from './apiClient';

export const userService = {
  async getProfile() {
    const res = await api.get('/users/me');
    return res.data;
  },

  async updateProfile(payload) {
    const res = await api.put('/users/me', payload);
    return res.data;
  },

  async updatePassword(payload) {
    // payload = { oldPassword, newPassword }
    const res = await api.put('/users/me/change-password', payload);
    return res.data;
  }
};
