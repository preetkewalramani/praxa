import { Module } from '@nestjs/common';
import { BillingController } from './controllers/billing.controller';
import { InvoiceLineRepository } from './repositories/invoice-line.repository';
import { InvoiceRepository } from './repositories/invoice.repository';
import { PaymentRepository } from './repositories/payment.repository';
import { BillingService } from './services/billing.service';

@Module({
  controllers: [BillingController],
  providers: [BillingService, InvoiceRepository, InvoiceLineRepository, PaymentRepository],
  exports: [BillingService],
})
export class BillingModule {}
