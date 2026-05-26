export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'UPI' | 'CARD' | 'CHEQUE' | 'OTHER';

export interface Invoice { id: string; invoiceNumber: string; clientId: string; projectId?: string | null; status: InvoiceStatus; totalAmount: number; amountPaid: number; amountDue: number; dueDate: string; }
export interface Payment { id: string; invoiceId: string; amount: number; paymentMethod: PaymentMethod; paymentDate: string; referenceNumber?: string; }
