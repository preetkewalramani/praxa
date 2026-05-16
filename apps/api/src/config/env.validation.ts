import Joi from 'joi';

export interface EnvironmentVariables {
  API_PORT: number;
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'production' | 'test';
  REDIS_HOST: string;
  REDIS_PORT: number;
}

export const envValidationSchema = Joi.object<EnvironmentVariables>({
  API_PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['mysql'] })
    .default('mysql://root:root@localhost:3306/praxa'),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  REDIS_HOST: Joi.string().hostname().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
});
