import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories.api';
import { servicesApi } from '../api/services.api';

export const useServices = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['services', params],
    queryFn: () => servicesApi.list(params).then((r) => r.data),
  });
export const useService = (id: string) =>
  useQuery({
    queryKey: ['service', id],
    queryFn: () => servicesApi.get(id).then((r) => r.data),
    enabled: !!id,
  });
const inv = (qc: ReturnType<typeof useQueryClient>) =>
  void qc.invalidateQueries({ queryKey: ['services'] });
export const useCreateService = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: servicesApi.create, onSuccess: () => inv(qc) });
};
export const useUpdateService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      servicesApi.update(id, payload),
    onSuccess: () => inv(qc),
  });
};
export const useArchiveService = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: servicesApi.archive, onSuccess: () => inv(qc) });
};
export const useRestoreService = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: servicesApi.restore, onSuccess: () => inv(qc) });
};
export const usePriceHistory = (id: string) =>
  useQuery({
    queryKey: ['service-prices', id],
    queryFn: () => servicesApi.priceHistory(id).then((r) => r.data),
    enabled: !!id,
  });
export const useUpdatePrice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { amount: number; currency: string; effectiveFrom: string };
    }) => servicesApi.updatePrice(id, payload),
    onSuccess: (_d, vars) => {
      void qc.invalidateQueries({ queryKey: ['service', vars.id] });
      void qc.invalidateQueries({ queryKey: ['service-prices', vars.id] });
    },
  });
};

export const useCategories = () =>
  useQuery({
    queryKey: ['service-categories'],
    queryFn: () => categoriesApi.list().then((r) => r.data),
  });
export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['service-categories'] }),
  });
};
export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { name: string; description?: string };
    }) => categoriesApi.update(id, payload),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['service-categories'] }),
  });
};
export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['service-categories'] }),
  });
};
