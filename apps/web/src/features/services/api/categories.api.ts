import { apiClient } from '@/services/api-client';

export const categoriesApi = {
  create: (payload: { name: string; description?: string }) =>
    apiClient.post('/service-categories', payload),
  delete: (id: string) => apiClient.delete(`/service-categories/${id}`),
  list: () => apiClient.get('/service-categories'),
  update: (id: string, payload: { name: string; description?: string }) =>
    apiClient.put(`/service-categories/${id}`, payload),
};
