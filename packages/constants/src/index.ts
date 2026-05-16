export const APP_NAMES = {
  api: 'Praxa API',
  web: 'Praxa Web',
} as const;

export const API_PREFIX = 'api' as const;
export const API_VERSION = '1' as const;
export const API_VERSIONED_PREFIX = `${API_PREFIX}/v${API_VERSION}` as const;

export const REQUEST_ID_HEADER = 'x-request-id' as const;

export const ENV_KEYS = {
  apiPort: 'API_PORT',
  databaseUrl: 'DATABASE_URL',
  nodeEnv: 'NODE_ENV',
  redisHost: 'REDIS_HOST',
  redisPort: 'REDIS_PORT',
  webPort: 'WEB_PORT',
} as const;

export enum RuntimeEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export enum SharedEntityStatus {
  Active = 'active',
  Archived = 'archived',
  Draft = 'draft',
}
