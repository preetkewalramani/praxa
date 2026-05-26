import { HttpException, type HttpStatus } from '@nestjs/common';

export interface AppExceptionResponse {
  code: string;
  details?: unknown;
  message: string;
}

export class BaseAppException extends HttpException {
  constructor(
    readonly code: string,
    message: string,
    statusCode: HttpStatus,
    readonly details?: unknown,
  ) {
    super({ code, details, message } satisfies AppExceptionResponse, statusCode);
  }
}
