import { apiClient } from '@/services/api-client';

export const clientsApi = {
  archive: (id: string) => apiClient.post(`/clients/${id}/archive`),
  assignTag: (id: string, tagId: string) => apiClient.post(`/clients/${id}/tags`, { tagId }),
  create: (payload: Record<string, unknown>) => apiClient.post('/clients', payload),
  get: (id: string) => apiClient.get(`/clients/${id}`),
  list: (params?: Record<string, unknown>) => apiClient.get('/clients', { params }),
  removeTag: (id: string, tagId: string) => apiClient.delete(`/clients/${id}/tags/${tagId}`),
  restore: (id: string) => apiClient.post(`/clients/${id}/restore`),
  update: (id: string, payload: Record<string, unknown>) =>
    apiClient.put(`/clients/${id}`, payload),
};
