import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentRepository {
  private readonly payments: Record<string, any> = {};
  private readonly byInvoice: Record<string, string[]> = {};

  list() { return Object.values(this.payments); }
  get(id: string) { return this.payments[id] ?? null; }
  listByInvoice(invoiceId: string) { return (this.byInvoice[invoiceId] ?? []).map((id) => this.payments[id]); }
  save(payment: any) {
    this.payments[payment.id] = payment;
    this.byInvoice[payment.invoiceId] = [...(this.byInvoice[payment.invoiceId] ?? []), payment.id];
    return payment;
  }
}
