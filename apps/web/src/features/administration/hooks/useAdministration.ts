import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { firmApi } from '../api/firm.api';
import { invitationsApi } from '../api/invitations.api';
import { usersApi } from '../api/users.api';

export const useUsers = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => usersApi.list(params).then((r) => r.data),
  });
export const useUser = (id: string) =>
  useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => usersApi.get(id).then((r) => r.data),
    enabled: !!id,
  });
export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};
export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { firstName?: string; lastName?: string };
    }) => usersApi.update(id, payload),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};
export const useActivateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.activate,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};
export const useDeactivateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.deactivate,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};
export const useInvitations = () =>
  useQuery({
    queryKey: ['admin-invitations'],
    queryFn: () => invitationsApi.list().then((r) => r.data),
  });
export const useCreateInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: invitationsApi.create,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['admin-invitations'] }),
  });
};
export const useRevokeInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: invitationsApi.revoke,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['admin-invitations'] }),
  });
};
export const useFirm = () =>
  useQuery({ queryKey: ['admin-firm'], queryFn: () => firmApi.get().then((r) => r.data) });
export const useUpdateFirm = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: firmApi.update,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['admin-firm'] }),
  });
};
