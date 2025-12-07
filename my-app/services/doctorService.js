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

  async getMyProfile() {
    const response = await api.get('/doctor/me');
    return response.data;
  },

  async updateMyWorkingHours(workingHours) {
    const response = await api.put('/doctor/me/working-hours', { workingHours });
    return response.data;
  },

  async getMyAppointments() {
    const response = await api.get('/doctor/me/appointments');
    return response.data;
  },

  async moveAppointment(appointmentId, payload) {
    const response = await api.put(`/doctor/appointments/${appointmentId}/move`, payload);
    return response.data;
  }
};