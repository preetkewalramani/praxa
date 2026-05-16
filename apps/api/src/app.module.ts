import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StructuredLogger } from './common/logger.service';
import { envValidationSchema } from './config/env.validation';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: ['../../.env.local', '../../.env', '.env.local', '.env'],
      isGlobal: true,
      validationOptions: {
        abortEarly: false,
      },
      validationSchema: envValidationSchema,
    }),
    HealthModule,
  ],
  providers: [StructuredLogger],
})
export class AppModule {}
