import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelInvoice, createInvoice, generateInvoiceFromProject, getInvoice, issueInvoice, listInvoices } from '../api/invoices.api';
import { listPayments, recordPayment } from '../api/payments.api';

export const useInvoices = () => useQuery({ queryKey: ['invoices'], queryFn: listInvoices });
export const useInvoice = (id: string) => useQuery({ queryKey: ['invoice', id], queryFn: () => getInvoice(id), enabled: Boolean(id) });

export const useCreateInvoice = () => { const qc = useQueryClient(); return useMutation({ mutationFn: createInvoice, onSuccess: () => void qc.invalidateQueries({ queryKey: ['invoices'] }) }); };
export const useIssueInvoice = () => { const qc = useQueryClient(); return useMutation({ mutationFn: issueInvoice, onSuccess: () => void qc.invalidateQueries({ queryKey: ['invoices'] }) }); };
export const useCancelInvoice = () => { const qc = useQueryClient(); return useMutation({ mutationFn: cancelInvoice, onSuccess: () => void qc.invalidateQueries({ queryKey: ['invoices'] }) }); };
export const useGenerateInvoiceFromProject = () => { const qc = useQueryClient(); return useMutation({ mutationFn: generateInvoiceFromProject, onSuccess: () => void qc.invalidateQueries({ queryKey: ['invoices'] }) }); };

export const usePayments = () => useQuery({ queryKey: ['payments'], queryFn: listPayments });
export const useRecordPayment = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ invoiceId, payload }: { invoiceId: string; payload: { amount: number; paymentMethod: string; referenceNumber?: string; notes?: string } }) => recordPayment(invoiceId, payload), onSuccess: () => { void qc.invalidateQueries({ queryKey: ['invoices'] }); void qc.invalidateQueries({ queryKey: ['payments'] }); } }); };
