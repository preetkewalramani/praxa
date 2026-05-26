import { registerAs } from '@nestjs/config';

export interface CacheConfig {
  defaultTtlSeconds: number;
  namespace: string;
}

export const cacheConfig = registerAs(
  'cache',
  (): CacheConfig => ({
    defaultTtlSeconds: Number(process.env.CACHE_TTL_SECONDS ?? 300),
    namespace: process.env.CACHE_NAMESPACE ?? 'praxa',
  }),
);
