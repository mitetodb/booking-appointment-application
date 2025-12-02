import { api } from './apiClient';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async register(userData) {
    // userData = { firstName, lastName, email, password, ... }
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};
