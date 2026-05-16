import { AsyncLocalStorage } from 'node:async_hooks';

import { Injectable } from '@nestjs/common';

export interface RequestContext {
  correlationId: string;
  tenantId?: string;
  userId?: string;
}

@Injectable()
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<RequestContext>();

  run(context: RequestContext, callback: () => void): void {
    this.storage.run(context, callback);
  }

  getContext(): RequestContext | undefined {
    return this.storage.getStore();
  }

  getCorrelationId(): string | undefined {
    return this.getContext()?.correlationId;
  }

  getTenantId(): string | undefined {
    return this.getContext()?.tenantId;
  }

  getUserId(): string | undefined {
    return this.getContext()?.userId;
  }
}
