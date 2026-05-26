import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from 'class-validator';
import { type InvoiceStatus, INVOICE_STATUSES, PAYMENT_METHODS, type PaymentMethod } from '../constants/billing.constants';

export class ListInvoicesQueryDto { @IsOptional() @IsString() search?: string; @IsOptional() @IsString() status?: string; }
export class CreateInvoiceDto { @IsString() clientId!: string; @IsOptional() @IsString() projectId?: string; @IsDateString() dueDate!: string; @IsOptional() @IsString() notes?: string; }
export class UpdateInvoiceDto { @IsOptional() @IsDateString() dueDate?: string; @IsOptional() @IsString() notes?: string; }
export class AddInvoiceLineDto { @IsOptional() @IsString() serviceId?: string; @IsString() @MinLength(1) description!: string; @Type(() => Number) @IsNumber() @IsPositive() quantity!: number; @Type(() => Number) @IsNumber() @IsPositive() unitPrice!: number; }
export class RecordPaymentDto { @Type(() => Number) @IsNumber() @IsPositive() amount!: number; @IsEnum(PAYMENT_METHODS) paymentMethod!: PaymentMethod; @IsOptional() @IsString() referenceNumber?: string; @IsOptional() @IsString() notes?: string; }
export class ChangeInvoiceStatusDto { @IsEnum(INVOICE_STATUSES) status!: InvoiceStatus; }
export class GenerateInvoiceFromProjectDto { @IsOptional() @IsDateString() dueDate?: string; }
