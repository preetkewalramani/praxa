import { apiClient } from '@/services/api-client';
import { type Invoice } from '../types/billing.types';

export const listInvoices = async () => (await apiClient.get<Invoice[]>('/invoices')).data;
export const getInvoice = async (id: string) => (await apiClient.get<Invoice>(`/invoices/${id}`)).data;
export const createInvoice = async (payload: { clientId: string; projectId?: string; dueDate: string; notes?: string }) => (await apiClient.post<Invoice>('/invoices', payload)).data;
export const issueInvoice = async (id: string) => (await apiClient.post<Invoice>(`/invoices/${id}/issue`)).data;
export const cancelInvoice = async (id: string) => (await apiClient.post<Invoice>(`/invoices/${id}/cancel`)).data;
export const generateInvoiceFromProject = async (projectId: string) => (await apiClient.post<Invoice>(`/projects/${projectId}/generate-invoice`, {})).data;
