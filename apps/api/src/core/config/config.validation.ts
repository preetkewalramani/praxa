import { apiEnvValidationSchema } from '@praxa/env';
import Joi from 'joi';

export const apiConfigValidationSchema = apiEnvValidationSchema.keys({
  API_DOCS_PATH: Joi.string().default('docs'),
  API_NAME: Joi.string().default('Praxa API'),
  API_PREFIX: Joi.string().default('api'),
  API_VERSION: Joi.string().default('1'),
  CACHE_NAMESPACE: Joi.string().default('praxa'),
  CACHE_TTL_SECONDS: Joi.number().integer().positive().default(300),
  CORS_ORIGINS: Joi.string().default('http://localhost:5173'),
  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent')
    .default('info'),
  LOG_PRETTY: Joi.boolean().truthy('true').falsy('false').default(false),
  QUEUE_DEFAULT_NAME: Joi.string().default('default'),
  QUEUE_ENABLED: Joi.boolean().truthy('true').falsy('false').default(true),
  REQUEST_TIMEOUT_MS: Joi.number().integer().positive().default(10000),
  THROTTLE_LIMIT: Joi.number().integer().positive().default(100),
  THROTTLE_TTL_MS: Joi.number().integer().positive().default(60000),
});
