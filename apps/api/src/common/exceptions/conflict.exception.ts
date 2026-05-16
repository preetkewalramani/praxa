import { HttpStatus } from '@nestjs/common';

import { BaseAppException } from './base-app.exception';
import { ErrorCode } from './error-code.enum';

export class ConflictException extends BaseAppException {
  constructor(message = 'Resource conflict.', details?: unknown) {
    super(ErrorCode.Conflict, message, HttpStatus.CONFLICT, details);
  }
}
