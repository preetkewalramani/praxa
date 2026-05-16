import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { appConfig } from './app.config';
import { cacheConfig } from './cache.config';
import { apiConfigValidationSchema } from './config.validation';
import { loggerConfig } from './logger.config';
import { queueConfig } from './queue.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      envFilePath: ['../../.env.local', '../../.env', '.env.local', '.env'],
      isGlobal: true,
      load: [appConfig, loggerConfig, cacheConfig, queueConfig],
      validationOptions: {
        abortEarly: false,
      },
      validationSchema: apiConfigValidationSchema,
    }),
  ],
})
export class CoreConfigModule {}
