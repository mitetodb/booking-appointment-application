import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';
const DEFAULT_AI_MODEL = import.meta.env.VITE_AI_MODEL || 'claude-haiku-4.5';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
     'X-AI-Model': DEFAULT_AI_MODEL,
  },
});

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
      console.warn('Corrupted auth in localStorage, clearing it.', err);
      try {
        localStorage.removeItem('booking_app_auth');
      } catch (e) {
      }
    }
  }
  config.headers = config.headers || {};
  config.headers['X-AI-Model'] = DEFAULT_AI_MODEL;

  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      console.error('API Network Error:', {
        message: 'No response from server. Please check if the backend is running.',
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      error.message = 'Network error: Could not reach the server. Please check if the backend is running on ' + API_BASE_URL;
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);
