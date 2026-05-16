import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { tap, type Observable } from 'rxjs';

import { RequestContextService } from '../../shared/context/request-context.service';
import { PinoLoggerService } from './pino-logger.service';

interface HttpRequestLike {
  method?: string;
  originalUrl?: string;
  url?: string;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: PinoLoggerService,
    private readonly requestContext: RequestContextService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();
    const request = context.switchToHttp().getRequest<HttpRequestLike>();

    return next.handle().pipe(
      tap(() => {
        this.logger.info('HTTP request completed.', {
          correlationId: this.requestContext.getCorrelationId(),
          durationMs: Date.now() - startedAt,
          method: request.method,
          path: request.originalUrl ?? request.url,
        });
      }),
    );
  }
}
