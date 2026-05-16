import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  type ExceptionFilter,
} from '@nestjs/common';
import { type Response } from 'express';

interface StandardErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode = this.resolveStatusCode(exception);

    response.status(statusCode).json({
      success: false,
      error: {
        code: this.resolveErrorCode(exception),
        message: this.resolveErrorMessage(exception),
      },
    } satisfies StandardErrorResponse);
  }

  private resolveStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private resolveErrorCode(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.name;
    }

    return 'InternalServerError';
  }

  private resolveErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        return exceptionResponse;
      }

      if (this.hasMessage(exceptionResponse)) {
        return this.normalizeMessage(exceptionResponse.message);
      }
    }

    return 'Internal server error';
  }

  private hasMessage(value: unknown): value is { message: string | string[] } {
    return typeof value === 'object' && value !== null && 'message' in value;
  }

  private normalizeMessage(message: string | string[]): string {
    if (Array.isArray(message)) {
      return message.join(', ');
    }

    return message;
  }
}
