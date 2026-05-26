import { apiClient } from '@/services/api-client';

export const tagsApi = {
  create: (payload: { name: string; color: string }) => apiClient.post('/client-tags', payload),
  delete: (id: string) => apiClient.delete(`/client-tags/${id}`),
  list: () => apiClient.get('/client-tags'),
  update: (id: string, payload: { name: string; color: string }) =>
    apiClient.put(`/client-tags/${id}`, payload),
};
