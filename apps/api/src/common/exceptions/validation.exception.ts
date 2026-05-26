import { HttpStatus } from '@nestjs/common';

import { BaseAppException } from './base-app.exception';
import { ErrorCode } from './error-code.enum';

export class ValidationException extends BaseAppException {
  constructor(message = 'Validation failed.', details?: unknown) {
    super(ErrorCode.Validation, message, HttpStatus.BAD_REQUEST, details);
  }
}
