import { Injectable, type LoggerService } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { RequestContextService } from '../../shared/context/request-context.service';

@Injectable()
export class PinoLoggerService implements LoggerService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly requestContext: RequestContextService,
  ) {}

  log(message: unknown, context?: string): void {
    this.logger.info(this.withContext(context), this.stringifyMessage(message));
  }

  error(message: unknown, trace?: string, context?: string): void {
    this.logger.error({ ...this.withContext(context), trace }, this.stringifyMessage(message));
  }

  warn(message: unknown, context?: string): void {
    this.logger.warn(this.withContext(context), this.stringifyMessage(message));
  }

  debug(message: unknown, context?: string): void {
    this.logger.debug(this.withContext(context), this.stringifyMessage(message));
  }

  verbose(message: unknown, context?: string): void {
    this.logger.trace(this.withContext(context), this.stringifyMessage(message));
  }

  info(message: string, payload?: Record<string, unknown>): void {
    this.logger.info(this.withContext(undefined, payload), message);
  }

  private withContext(
    context?: string,
    payload?: Record<string, unknown>,
  ): Record<string, unknown> {
    return {
      ...payload,
      context,
      correlationId: this.requestContext.getCorrelationId(),
    };
  }

  private stringifyMessage(message: unknown): string {
    if (typeof message === 'string') {
      return message;
    }

    return JSON.stringify(message);
  }
}
