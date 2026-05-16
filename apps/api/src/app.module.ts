import { MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RequestContextService } from './common/context/request-context.service';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { StructuredLogger } from './common/logger.service';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
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
  providers: [GlobalExceptionFilter, RequestContextService, StructuredLogger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
