import { api } from './apiClient';

export const assistantService = {
  async getMyDoctors() {
    const res = await api.get('/assistant/doctors');
    return res.data;
  },

  async getDoctorAppointments(doctorId) {
    const res = await api.get(`/assistant/doctor/${doctorId}/appointments`);
    return res.data;
  },

  async createAppointment(doctorId, payload) {
    const res = await api.post(`/assistant/doctor/${doctorId}/appointments`, payload);
    return res.data;
  },

  async updateAppointment(appointmentId, payload) {
    const res = await api.put(`/assistant/appointments/${appointmentId}`, payload);
    return res.data;
  },

  async cancelAppointment(appointmentId) {
    const res = await api.delete(`/assistant/appointments/${appointmentId}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await api.get('/assistant/users');
    const users = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.users || []);
    return users;
  }
};
