import {
  Catch,
  HttpException,
  HttpStatus,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import { type Response } from 'express';

import { RequestContextService } from '../../shared/context/request-context.service';
import { buildErrorResponse } from '../../shared/response/response.builder';
import { BaseAppException, type AppExceptionResponse } from '../exceptions';

interface NestHttpExceptionResponse {
  error?: string;
  message?: string | string[];
  statusCode?: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly requestContext: RequestContextService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode = this.resolveStatusCode(exception);

    response.status(statusCode).json(
      buildErrorResponse(this.resolveError(exception, statusCode), {
        correlationId: this.requestContext.getCorrelationId(),
      }),
    );
  }

  private resolveStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private resolveError(exception: unknown, statusCode: number): AppExceptionResponse {
    if (exception instanceof BaseAppException) {
      const response = exception.getResponse();

      if (this.isAppExceptionResponse(response)) {
        return response;
      }
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'string') {
        return {
          code: exception.name,
          message: response,
        };
      }

      if (this.isNestHttpExceptionResponse(response)) {
        return {
          code: response.error ?? exception.name,
          details: response,
          message: this.normalizeMessage(response.message ?? exception.message),
        };
      }

      return {
        code: exception.name,
        message: exception.message,
      };
    }

    return {
      code: HttpStatus[statusCode] ?? 'InternalServerError',
      message: 'Internal server error',
    };
  }

  private isAppExceptionResponse(value: unknown): value is AppExceptionResponse {
    return (
      typeof value === 'object' &&
      value !== null &&
      'code' in value &&
      'message' in value &&
      typeof value.code === 'string' &&
      typeof value.message === 'string'
    );
  }

  private isNestHttpExceptionResponse(value: unknown): value is NestHttpExceptionResponse {
    return typeof value === 'object' && value !== null;
  }

  private normalizeMessage(message: string | string[]): string {
    if (Array.isArray(message)) {
      return message.join(', ');
    }

    return message;
  }
}
