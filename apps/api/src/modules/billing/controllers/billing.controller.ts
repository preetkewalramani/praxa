import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { AddInvoiceLineDto, CreateInvoiceDto, GenerateInvoiceFromProjectDto, ListInvoicesQueryDto, RecordPaymentDto, UpdateInvoiceDto } from '../dto/billing.dto';
import { BillingService } from '../services/billing.service';

@Controller()
export class BillingController {
  constructor(private readonly service: BillingService) {}

  @Get('/invoices') @Permissions('billing.read') listInvoices(@Query() _query: ListInvoicesQueryDto) { return this.service.listInvoices(); }
  @Get('/invoices/:id') @Permissions('billing.read') getInvoice(@Param('id') id: string) { return this.service.getInvoice(id); }
  @Post('/invoices') @Permissions('billing.create') createInvoice(@Body() input: CreateInvoiceDto) { return this.service.createInvoice(input); }
  @Put('/invoices/:id') @Permissions('billing.update') updateInvoice(@Param('id') id: string, @Body() input: UpdateInvoiceDto) { return this.service.updateInvoice(id, input); }
  @Post('/invoices/:id/issue') @Permissions('billing.update') issueInvoice(@Param('id') id: string) { return this.service.issueInvoice(id); }
  @Post('/invoices/:id/cancel') @Permissions('billing.delete') cancelInvoice(@Param('id') id: string) { return this.service.cancelInvoice(id); }
  @Post('/projects/:id/generate-invoice') @Permissions('billing.create') generateFromProject(@Param('id') id: string, @Body() _input: GenerateInvoiceFromProjectDto) { return this.service.generateInvoiceFromProject(id); }
  @Post('/invoices/:id/lines') @Permissions('billing.update') addLine(@Param('id') id: string, @Body() input: AddInvoiceLineDto) { return this.service.addLine(id, input); }
  @Delete('/invoices/:id/lines/:lineId') @Permissions('billing.update') removeLine(@Param('id') id: string, @Param('lineId') lineId: string) { return this.service.removeLine(id, lineId); }
  @Get('/payments') @Permissions('payments.read') listPayments() { return this.service.listPayments(); }
  @Get('/payments/:id') @Permissions('payments.read') getPayment(@Param('id') id: string) { return this.service.getPayment(id); }
  @Post('/invoices/:id/payments') @Permissions('payments.create') recordPayment(@Param('id') id: string, @Body() input: RecordPaymentDto) { return this.service.recordPayment(id, input); }
}
