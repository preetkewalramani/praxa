import { ENV_KEYS, RuntimeEnvironment } from '@praxa/constants';
import Joi from 'joi';

export type NodeEnv = `${RuntimeEnvironment}`;

export interface BaseEnvironment {
  NODE_ENV: NodeEnv;
}

export interface ApiEnvironment extends BaseEnvironment {
  API_PORT: number;
  DATABASE_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
}

export interface WebEnvironment extends BaseEnvironment {
  WEB_PORT: number;
}

export type EnvironmentSource = Readonly<Record<string, string | undefined>>;

export const nodeEnvSchema = Joi.string()
  .valid(RuntimeEnvironment.Development, RuntimeEnvironment.Production, RuntimeEnvironment.Test)
  .default(RuntimeEnvironment.Development);

export const baseEnvValidationSchema = Joi.object<BaseEnvironment>({
  [ENV_KEYS.nodeEnv]: nodeEnvSchema,
});

export const apiEnvValidationSchema = baseEnvValidationSchema.keys<ApiEnvironment>({
  [ENV_KEYS.apiPort]: Joi.number().port().default(3000),
  [ENV_KEYS.databaseUrl]: Joi.string()
    .uri({ scheme: ['mysql'] })
    .default('mysql://root:root@localhost:3306/praxa'),
  [ENV_KEYS.redisHost]: Joi.string().hostname().default('localhost'),
  [ENV_KEYS.redisPort]: Joi.number().port().default(6379),
});

export const webEnvValidationSchema = baseEnvValidationSchema.keys<WebEnvironment>({
  [ENV_KEYS.webPort]: Joi.number().port().default(5173),
});

export function validateEnvironment<TEnvironment extends object>(
  schema: Joi.ObjectSchema<TEnvironment>,
  source: EnvironmentSource,
): TEnvironment {
  const { error, value } = schema.validate(source, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  });

  if (error) {
    throw error;
  }

  return value;
}

export function getRequiredEnv(source: EnvironmentSource, key: string): string {
  const value = source[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getOptionalEnv(
  source: EnvironmentSource,
  key: string,
  defaultValue: string,
): string {
  return source[key] ?? defaultValue;
}

export function parseNumberEnv(
  source: EnvironmentSource,
  key: string,
  defaultValue: number,
): number {
  const value = source[key];

  if (!value) {
    return defaultValue;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    throw new Error(`Environment variable ${key} must be a number.`);
  }

  return parsedValue;
}
