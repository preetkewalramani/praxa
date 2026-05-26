import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projects.api';
import { workOrdersApi } from '../api/work-orders.api';

export const useProjects = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectsApi.listProjects(params).then((r) => r.data),
  });
export const useProject = (id: string) =>
  useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getProject(id).then((r) => r.data),
    enabled: !!id,
  });
const inv = (qc: ReturnType<typeof useQueryClient>) =>
  void qc.invalidateQueries({ queryKey: ['projects'] });
export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: projectsApi.createProject, onSuccess: () => inv(qc) });
};
export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      projectsApi.updateProject(id, payload),
    onSuccess: () => inv(qc),
  });
};
export const useChangeProjectStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status: string } }) =>
      projectsApi.changeProjectStatus(id, payload),
    onSuccess: () => inv(qc),
  });
};
export const useAssignProjectService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { serviceId: string; quantity: number };
    }) => projectsApi.assignProjectService(id, payload),
    onSuccess: () => inv(qc),
  });
};
export const useRemoveProjectService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, serviceId }: { id: string; serviceId: string }) =>
      projectsApi.removeProjectService(id, serviceId),
    onSuccess: () => inv(qc),
  });
};
export const useArchiveProject = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: projectsApi.archiveProject, onSuccess: () => inv(qc) });
};

export const useWorkOrders = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['work-orders', params],
    queryFn: () => workOrdersApi.list(params).then((r) => r.data),
  });
export const useWorkOrder = (id: string) =>
  useQuery({
    queryKey: ['work-order', id],
    queryFn: () => workOrdersApi.get(id).then((r) => r.data),
    enabled: !!id,
  });
const invWo = (qc: ReturnType<typeof useQueryClient>) =>
  void qc.invalidateQueries({ queryKey: ['work-orders'] });
export const useCreateWorkOrder = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: workOrdersApi.create, onSuccess: () => invWo(qc) });
};
export const useUpdateWorkOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      workOrdersApi.update(id, payload),
    onSuccess: () => invWo(qc),
  });
};
export const useAssignWorkOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { userId: string } }) =>
      workOrdersApi.assign(id, payload),
    onSuccess: () => invWo(qc),
  });
};
export const useChangeWorkOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status: string } }) =>
      workOrdersApi.changeStatus(id, payload),
    onSuccess: () => invWo(qc),
  });
};
