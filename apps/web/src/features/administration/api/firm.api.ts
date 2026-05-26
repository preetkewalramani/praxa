import { apiClient } from '@/services/api-client';

export const firmApi = {
  get: () => apiClient.get('/admin/firm'),
  update: (payload: { name?: string; logoUrl?: string; timezone?: string; currency?: string }) =>
    apiClient.put('/admin/firm', payload),
};
