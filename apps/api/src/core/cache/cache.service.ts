import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { type CachePort, type CacheSetOptions } from './cache.types';

interface CacheEntry<TValue> {
  expiresAt: number | null;
  value: TValue;
}

@Injectable()
export class CacheService implements CachePort {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  constructor(private readonly configService: ConfigService) {}

  get<TValue>(key: string): Promise<TValue | null> {
    const entry = this.store.get(key);

    if (!entry) {
      return Promise.resolve(null);
    }

    if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      this.store.delete(key);

      return Promise.resolve(null);
    }

    return Promise.resolve(entry.value as TValue);
  }

  set<TValue>(key: string, value: TValue, options?: CacheSetOptions): Promise<void> {
    const ttlSeconds =
      options?.ttlSeconds ?? this.configService.get<number>('CACHE_TTL_SECONDS', 300);

    this.store.set(key, {
      expiresAt: ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null,
      value,
    });

    return Promise.resolve();
  }

  delete(key: string): Promise<void> {
    this.store.delete(key);

    return Promise.resolve();
  }
}
