import { HttpStatus } from '@nestjs/common';

import { BaseAppException } from './base-app.exception';
import { ErrorCode } from './error-code.enum';

export class InfrastructureException extends BaseAppException {
  constructor(message = 'Infrastructure dependency failed.', details?: unknown) {
    super(ErrorCode.Infrastructure, message, HttpStatus.SERVICE_UNAVAILABLE, details);
  }
}
