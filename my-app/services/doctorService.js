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

  async getMyWorkingHours() {
    const response = await api.get('/doctor/working-hours');
    return response.data;
  },

  async updateMyWorkingHours(workingHours) {
    const response = await api.put('/doctor/working-hours', workingHours);
    return response.data;
  },

  async deleteWorkingHoursByDay(dayOfWeek) {
    const response = await api.delete(`/doctor/working-hours/${dayOfWeek}`);
    return response.data;
  },

  async getMyAppointments() {
    const response = await api.get('/doctor/appointments');
    return response.data;
  },

  async moveAppointment(appointmentId, payload) {
    const response = await api.put(`/doctor/appointments/${appointmentId}/move`, payload);
    return response.data;
  },

  async updateMySpecialty(specialtyId) {
    const response = await api.put('/doctor/me/specialty', { specialtyId });
    return response.data;
  }
};