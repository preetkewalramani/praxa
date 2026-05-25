import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

export const apiClient = axios.create({ baseURL: API_BASE_URL, timeout: 10_000 });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('praxa-access-token');
  const correlationId = crypto.randomUUID();
  config.headers['x-request-id'] = correlationId;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // refresh architecture placeholder
    }
    return Promise.reject(error);
  },
);
