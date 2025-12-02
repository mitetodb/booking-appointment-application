import { api } from './apiClient';

export const doctorService = {
  async getAll(params = {}) {
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
};