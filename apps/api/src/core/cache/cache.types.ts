export interface CacheSetOptions {
  ttlSeconds?: number;
}

export interface CachePort {
  delete(key: string): Promise<void>;
  get<TValue>(key: string): Promise<TValue | null>;
  set<TValue>(key: string, value: TValue, options?: CacheSetOptions): Promise<void>;
}
