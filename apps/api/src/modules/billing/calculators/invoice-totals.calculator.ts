export interface InvoiceLineInput { quantity: number; unitPrice: number; }

export const calculateSubtotal = (lines: InvoiceLineInput[]): number =>
  lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);

export const calculateTotals = (subtotal: number, taxAmount: number, amountPaid: number) => {
  const totalAmount = subtotal + taxAmount;
  const amountDue = Math.max(totalAmount - amountPaid, 0);
  return { totalAmount, amountDue };
};
