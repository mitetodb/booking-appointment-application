import { api } from './apiClient';

export const appointmentService = {
  async getMyAppointments() {
    const response = await api.get('/appointments/my');
    return response.data;
  },

  async book(doctorId, payload) {
    const response = await api.post(`/appointments/book/${doctorId}`, payload);
    return response.data;
  },

  async update(appointmentId, payload) {
    const response = await api.put(`/appointments/${appointmentId}`, payload);
    return response.data;
  },

  async cancel(appointmentId) {
    const response = await api.delete(`/appointments/${appointmentId}`);
    return response.data;
  },
};
