import { apiClient } from '@/services/api-client';

export const usersApi = {
  activate: (id: string) => apiClient.post(`/admin/users/${id}/activate`),
  assignRole: (id: string, roleId: string) =>
    apiClient.post(`/admin/users/${id}/roles`, { roleId }),
  create: (payload: { firstName: string; lastName: string; email: string; roleIds: string[] }) =>
    apiClient.post('/admin/users', payload),
  deactivate: (id: string) => apiClient.post(`/admin/users/${id}/deactivate`),
  get: (id: string) => apiClient.get(`/admin/users/${id}`),
  list: (params?: Record<string, unknown>) => apiClient.get('/admin/users', { params }),
  removeRole: (id: string, roleId: string) =>
    apiClient.delete(`/admin/users/${id}/roles/${roleId}`),
  update: (id: string, payload: { firstName?: string; lastName?: string }) =>
    apiClient.put(`/admin/users/${id}`, payload),
};
