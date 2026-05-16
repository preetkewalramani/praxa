import { Injectable, Logger } from '@nestjs/common';

import { RequestContextService } from './context/request-context.service';

@Injectable()
export class StructuredLogger extends Logger {
  constructor(private readonly requestContext: RequestContextService) {
    super();
  }

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
    return JSON.stringify({
      context,
      message,
      requestId: this.requestContext.getRequestId(),
      timestamp: new Date().toISOString(),
    });
  }
}
