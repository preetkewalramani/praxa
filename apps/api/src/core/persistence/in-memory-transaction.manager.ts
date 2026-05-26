import { Injectable } from '@nestjs/common';

import { RequestContextService } from '../../shared/context/request-context.service';
import { type TransactionContext, type TransactionManager } from './repository.types';

@Injectable()
export class InMemoryTransactionManager implements TransactionManager {
  constructor(private readonly requestContext: RequestContextService) {}

  runInTransaction<TResult>(
    handler: (context: TransactionContext) => Promise<TResult>,
  ): Promise<TResult> {
    return handler({ correlationId: this.requestContext.getCorrelationId() });
  }
}
