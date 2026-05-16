import { type BaseEntity } from './entity.types';

export interface RepositoryFindOptions {
  limit?: number;
  offset?: number;
}

export interface BaseRepository<
  TEntity extends BaseEntity,
  TId extends TEntity['id'] = TEntity['id'],
> {
  findById(id: TId): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
}

export interface TransactionContext {
  correlationId?: string;
}

export interface TransactionManager {
  runInTransaction<TResult>(
    handler: (context: TransactionContext) => Promise<TResult>,
  ): Promise<TResult>;
}
