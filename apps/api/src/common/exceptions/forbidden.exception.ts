import { HttpStatus } from '@nestjs/common';

import { BaseAppException } from './base-app.exception';
import { ErrorCode } from './error-code.enum';

export class ForbiddenException extends BaseAppException {
  constructor(message = 'Access is forbidden.', details?: unknown) {
    super(ErrorCode.Forbidden, message, HttpStatus.FORBIDDEN, details);
  }
}
