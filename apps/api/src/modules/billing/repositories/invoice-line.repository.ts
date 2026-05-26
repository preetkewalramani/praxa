import { Injectable } from '@nestjs/common';

@Injectable()
export class InvoiceLineRepository {
  private readonly lines: Record<string, any[]> = {};
  list(invoiceId: string) { return this.lines[invoiceId] ?? []; }
  add(invoiceId: string, line: any) { this.lines[invoiceId] = [...this.list(invoiceId), line]; return line; }
  remove(invoiceId: string, lineId: string) { this.lines[invoiceId] = this.list(invoiceId).filter((line) => line.id !== lineId); }
}
