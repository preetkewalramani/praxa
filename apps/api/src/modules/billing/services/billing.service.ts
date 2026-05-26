import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { calculateSubtotal, calculateTotals } from '../calculators/invoice-totals.calculator';
import { type AddInvoiceLineDto, type CreateInvoiceDto, type RecordPaymentDto, type UpdateInvoiceDto } from '../dto/billing.dto';
import { InvoiceLineRepository } from '../repositories/invoice-line.repository';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { PaymentRepository } from '../repositories/payment.repository';

@Injectable()
export class BillingService {
  constructor(
    private readonly invoices: InvoiceRepository,
    private readonly lines: InvoiceLineRepository,
    private readonly payments: PaymentRepository,
  ) {}

  listInvoices() { return this.invoices.list(); }
  getInvoice(id: string) {
    const invoice = this.requireInvoice(id);
    return { ...invoice, lines: this.lines.list(id), payments: this.payments.listByInvoice(id) };
  }
  createInvoice(input: CreateInvoiceDto) {
    const invoice = { id: randomUUID(), invoiceNumber: `INV-${new Date().getUTCFullYear()}-${Math.floor(Math.random()*1000000).toString().padStart(6,'0')}`,
      clientId: input.clientId, projectId: input.projectId ?? null, dueDate: input.dueDate, issueDate: null, notes: input.notes ?? null,
      status: 'DRAFT', subtotal: 0, taxAmount: 0, totalAmount: 0, amountPaid: 0, amountDue: 0 };
    return this.invoices.save(invoice);
  }
  updateInvoice(id: string, input: UpdateInvoiceDto) {
    const invoice = this.requireInvoice(id);
    if (invoice.status !== 'DRAFT') throw new BadRequestException('Only draft invoices are editable');
    return this.invoices.save({ ...invoice, ...input });
  }
  issueInvoice(id: string) {
    const invoice = this.requireInvoice(id);
    if (invoice.status !== 'DRAFT') throw new BadRequestException('Only draft invoices can be issued');
    return this.invoices.save({ ...invoice, status: 'ISSUED', issueDate: new Date().toISOString() });
  }
  cancelInvoice(id: string) {
    const invoice = this.requireInvoice(id);
    if (invoice.amountPaid > 0) throw new BadRequestException('Cannot cancel invoice with payments');
    return this.invoices.save({ ...invoice, status: 'CANCELLED' });
  }
  addLine(id: string, input: AddInvoiceLineDto) {
    const invoice = this.requireInvoice(id); if (invoice.status !== 'DRAFT') throw new BadRequestException('Issued invoices are immutable');
    this.lines.add(id, { id: randomUUID(), ...input, lineTotal: input.quantity * input.unitPrice });
    return this.recalculate(id);
  }
  removeLine(id: string, lineId: string) {
    const invoice = this.requireInvoice(id); if (invoice.status !== 'DRAFT') throw new BadRequestException('Issued invoices are immutable');
    this.lines.remove(id, lineId); return this.recalculate(id);
  }
  listPayments() { return this.payments.list(); }
  getPayment(id: string) { const p = this.payments.get(id); if (!p) throw new NotFoundException('Payment not found'); return p; }
  recordPayment(invoiceId: string, input: RecordPaymentDto) {
    const invoice = this.requireInvoice(invoiceId);
    if (input.amount > invoice.amountDue) throw new BadRequestException('Payment cannot exceed amount due');
    const payment = this.payments.save({ id: randomUUID(), invoiceId, ...input, paymentDate: new Date().toISOString() });
    this.recalculate(invoiceId, input.amount);
    return payment;
  }
  generateInvoiceFromProject(projectId: string) {
    return this.createInvoice({ clientId: projectId, projectId, dueDate: new Date().toISOString() });
  }
  private requireInvoice(id: string) { const invoice = this.invoices.get(id); if (!invoice) throw new NotFoundException('Invoice not found'); return invoice; }
  private recalculate(invoiceId: string, paymentDelta = 0) {
    const invoice = this.requireInvoice(invoiceId);
    const subtotal = calculateSubtotal(this.lines.list(invoiceId));
    const amountPaid = invoice.amountPaid + paymentDelta;
    const { totalAmount, amountDue } = calculateTotals(subtotal, invoice.taxAmount, amountPaid);
    const status = amountDue === 0 && amountPaid > 0 ? 'PAID' : amountPaid > 0 ? 'PARTIALLY_PAID' : invoice.status;
    return this.invoices.save({ ...invoice, subtotal, totalAmount, amountPaid, amountDue, status });
  }
}
