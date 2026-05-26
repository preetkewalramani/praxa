import { apiClient } from '@/services/api-client';
import { type Payment } from '../types/billing.types';

export const listPayments = async () => (await apiClient.get<Payment[]>('/payments')).data;
export const recordPayment = async (invoiceId: string, payload: { amount: number; paymentMethod: string; referenceNumber?: string; notes?: string }) => (await apiClient.post<Payment>(`/invoices/${invoiceId}/payments`, payload)).data;
