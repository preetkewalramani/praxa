import { apiClient } from '@/services/api-client';

export const servicesApi = {
  archive: (id: string) => apiClient.post(`/services/${id}/archive`),
  create: (payload: Record<string, unknown>) => apiClient.post('/services', payload),
  get: (id: string) => apiClient.get(`/services/${id}`),
  list: (params?: Record<string, unknown>) => apiClient.get('/services', { params }),
  priceHistory: (id: string) => apiClient.get(`/services/${id}/prices`),
  restore: (id: string) => apiClient.post(`/services/${id}/restore`),
  update: (id: string, payload: Record<string, unknown>) =>
    apiClient.put(`/services/${id}`, payload),
  updatePrice: (id: string, payload: { amount: number; currency: string; effectiveFrom: string }) =>
    apiClient.post(`/services/${id}/prices`, payload),
};
