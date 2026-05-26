import { HttpStatus } from '@nestjs/common';

import { BaseAppException } from './base-app.exception';
import { ErrorCode } from './error-code.enum';

export class UnauthorizedException extends BaseAppException {
  constructor(message = 'Authentication is required.', details?: unknown) {
    super(ErrorCode.Unauthorized, message, HttpStatus.UNAUTHORIZED, details);
  }
}
