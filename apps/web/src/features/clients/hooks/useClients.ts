import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '../api/clients.api';
import { tagsApi } from '../api/tags.api';

export const useClients = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientsApi.list(params).then((r) => r.data),
  });
export const useClient = (id: string) =>
  useQuery({
    queryKey: ['client', id],
    queryFn: () => clientsApi.get(id).then((r) => r.data),
    enabled: !!id,
  });
const invalidate = (qc: ReturnType<typeof useQueryClient>) =>
  void qc.invalidateQueries({ queryKey: ['clients'] });
export const useCreateClient = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: clientsApi.create, onSuccess: () => invalidate(qc) });
};
export const useUpdateClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      clientsApi.update(id, payload),
    onSuccess: () => invalidate(qc),
  });
};
export const useArchiveClient = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: clientsApi.archive, onSuccess: () => invalidate(qc) });
};
export const useRestoreClient = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: clientsApi.restore, onSuccess: () => invalidate(qc) });
};
export const useTags = () =>
  useQuery({ queryKey: ['client-tags'], queryFn: () => tagsApi.list().then((r) => r.data) });
export const useCreateTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tagsApi.create,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['client-tags'] }),
  });
};
export const useUpdateTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name: string; color: string } }) =>
      tagsApi.update(id, payload),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['client-tags'] }),
  });
};
export const useDeleteTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tagsApi.delete,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['client-tags'] }),
  });
};
export const useAssignTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tagId }: { id: string; tagId: string }) => clientsApi.assignTag(id, tagId),
    onSuccess: () => invalidate(qc),
  });
};
export const useRemoveTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tagId }: { id: string; tagId: string }) => clientsApi.removeTag(id, tagId),
    onSuccess: () => invalidate(qc),
  });
};
