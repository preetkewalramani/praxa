import { apiClient } from '@/services/api-client';

export const invitationsApi = {
  create: (payload: { email: string; roleId: string }) =>
    apiClient.post('/admin/invitations', payload),
  list: () => apiClient.get('/admin/invitations'),
  revoke: (id: string) => apiClient.post(`/admin/invitations/${id}/revoke`),
};
