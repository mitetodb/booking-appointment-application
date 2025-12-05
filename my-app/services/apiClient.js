import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';
const DEFAULT_AI_MODEL = import.meta.env.VITE_AI_MODEL || 'claude-haiku-4.5';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
     'X-AI-Model': DEFAULT_AI_MODEL,
  },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('booking_app_auth');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (err) {
      // If the stored auth is corrupted, remove it and continue.
      console.warn('Corrupted auth in localStorage, clearing it.', err);
      try {
        localStorage.removeItem('booking_app_auth');
      } catch (e) {
        // ignore
      }
    }
  }
  // Ensure the AI model header is present on every request
  config.headers = config.headers || {};
  config.headers['X-AI-Model'] = DEFAULT_AI_MODEL;

  return config;
});
