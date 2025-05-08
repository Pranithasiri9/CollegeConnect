import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API functions for events
export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

export const getEvent = async (eventId: string) => {
  const response = await api.get(`/events/${eventId}`);
  return response.data;
};

export const createEvent = async (eventData: any) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const deleteEvent = async (eventId: string) => {
  const response = await api.delete(`/events/${eventId}`);
  return response.data;
};

export const getEventRegistrations = async (eventId: string) => {
  const response = await api.get(`/events/${eventId}/registrations`);
  return response.data.registrations;
};

// API functions for registration
export const registerForEvent = async (eventId: string, userData: any) => {
  const response = await api.post(`/register/${eventId}`, userData);
  return response.data;
};

export const getConfirmation = async (registrationId: string) => {
  const response = await api.get(`/confirmation/${registrationId}`);
  return response.data;
};

// Auth API
export const login = async (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  const response = await api.post('/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};

export default api;