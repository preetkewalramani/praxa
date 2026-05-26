import { HttpStatus } from '@nestjs/common';

import { BaseAppException } from './base-app.exception';
import { ErrorCode } from './error-code.enum';

export class NotFoundException extends BaseAppException {
  constructor(message = 'Resource was not found.', details?: unknown) {
    super(ErrorCode.NotFound, message, HttpStatus.NOT_FOUND, details);
  }
}
