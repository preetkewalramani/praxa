import { Injectable } from '@nestjs/common';

@Injectable()
export class InvoiceRepository {
  private readonly invoices: Record<string, any> = {};

  list() { return Object.values(this.invoices); }
  get(id: string) { return this.invoices[id] ?? null; }
  save(invoice: any) { this.invoices[invoice.id] = invoice; return invoice; }
  delete(id: string) { delete this.invoices[id]; }
}
