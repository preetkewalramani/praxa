import { apiClient } from '@/services/api-client';

export const projectsApi = {
  archiveProject: (id: string) => apiClient.post(`/projects/${id}/archive`),
  assignProjectService: (id: string, payload: { serviceId: string; quantity: number }) =>
    apiClient.post(`/projects/${id}/services`, payload),
  changeProjectStatus: (id: string, payload: { status: string }) =>
    apiClient.post(`/projects/${id}/status`, payload),
  createProject: (payload: Record<string, unknown>) => apiClient.post('/projects', payload),
  getProject: (id: string) => apiClient.get(`/projects/${id}`),
  listProjects: (params?: Record<string, unknown>) => apiClient.get('/projects', { params }),
  removeProjectService: (id: string, serviceId: string) =>
    apiClient.delete(`/projects/${id}/services/${serviceId}`),
  updateProject: (id: string, payload: Record<string, unknown>) =>
    apiClient.put(`/projects/${id}`, payload),
};
