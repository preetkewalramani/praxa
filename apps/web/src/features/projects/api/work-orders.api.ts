import { apiClient } from '@/services/api-client';

export const workOrdersApi = {
  assign: (id: string, payload: { userId: string }) =>
    apiClient.post(`/work-orders/${id}/assign`, payload),
  changeStatus: (id: string, payload: { status: string }) =>
    apiClient.post(`/work-orders/${id}/status`, payload),
  create: (payload: Record<string, unknown>) => apiClient.post('/work-orders', payload),
  get: (id: string) => apiClient.get(`/work-orders/${id}`),
  list: (params?: Record<string, unknown>) => apiClient.get('/work-orders', { params }),
  update: (id: string, payload: Record<string, unknown>) =>
    apiClient.put(`/work-orders/${id}`, payload),
};
