import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StructuredLogger extends Logger {
  override log(message: string, context?: string): void {
    super.log(this.formatMessage(message, context));
  }

  override error(message: string, trace?: string, context?: string): void {
    super.error(this.formatMessage(message, context), trace);
  }

  override warn(message: string, context?: string): void {
    super.warn(this.formatMessage(message, context));
  }

  override debug(message: string, context?: string): void {
    super.debug(this.formatMessage(message, context));
  }

  override verbose(message: string, context?: string): void {
    super.verbose(this.formatMessage(message, context));
  }

  private formatMessage(message: string, context?: string): string {
    return JSON.stringify({ context, message, timestamp: new Date().toISOString() });
  }
}
