import { Module } from '@nestjs/common';

import { InMemoryTransactionManager } from './in-memory-transaction.manager';

@Module({
  exports: [InMemoryTransactionManager],
  providers: [InMemoryTransactionManager],
})
export class PersistenceModule {}
