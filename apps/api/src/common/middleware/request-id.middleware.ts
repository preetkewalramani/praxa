import { randomUUID } from 'node:crypto';

import { Injectable, type NestMiddleware } from '@nestjs/common';
import { REQUEST_ID_HEADER } from '@praxa/constants';
import { type NextFunction, type Request, type Response } from 'express';

import { RequestContextService } from '../context/request-context.service';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(private readonly requestContext: RequestContextService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const requestId = this.resolveRequestId(request);

    response.setHeader(REQUEST_ID_HEADER, requestId);
    this.requestContext.run({ requestId }, next);
  }

  private resolveRequestId(request: Request): string {
    const headerValue = request.header(REQUEST_ID_HEADER);

    if (headerValue) {
      return headerValue;
    }

    return randomUUID();
  }
}
