import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { map, type Observable } from 'rxjs';

import { RequestContextService } from '../../shared/context/request-context.service';
import { type ApiSuccessResponse } from '../../shared/response/api-response.types';
import { buildSuccessResponse } from '../../shared/response/response.builder';

interface RequestLike {
  originalUrl?: string;
  url?: string;
}

@Injectable()
export class ResponseTransformInterceptor<TData> implements NestInterceptor<
  TData,
  ApiSuccessResponse<TData> | TData
> {
  constructor(private readonly requestContext: RequestContextService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<TData>,
  ): Observable<ApiSuccessResponse<TData> | TData> {
    const request = context.switchToHttp().getRequest<RequestLike>();

    if (this.isDocumentationRequest(request.originalUrl ?? request.url)) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) =>
        buildSuccessResponse(data, {
          correlationId: this.requestContext.getCorrelationId(),
        }),
      ),
    );
  }

  private isDocumentationRequest(url: string | undefined): boolean {
    if (!url) {
      return false;
    }

    return url.startsWith('/docs');
  }
}
