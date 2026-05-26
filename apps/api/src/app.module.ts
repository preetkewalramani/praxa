import { Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { AuthGuard, PermissionsGuard, RolesGuard, TenantGuard } from './common/guards';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { AdministrationModule } from './modules/administration/administration.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ServicesModule } from './modules/services/services.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { BillingModule } from './modules/billing/billing.module';
import { CacheModule } from './core/cache';
import { CoreConfigModule } from './core/config/config.module';
import { EventsModule } from './core/events';
import { HealthModule } from './core/health/health.module';
import { LoggerModule } from './core/logger/logger.module';
import { LoggingInterceptor } from './core/logger/logging.interceptor';
import { PersistenceModule } from './core/persistence';
import { QueueModule } from './core/queue';
import { RequestContextModule } from './shared/context/request-context.module';

@Module({
  imports: [
    CoreConfigModule,
    AuthModule,
    AdministrationModule,
    ClientsModule,
    ServicesModule,
    ProjectsModule,
    BillingModule,
    RequestContextModule,
    LoggerModule,
    CacheModule,
    EventsModule,
    QueueModule,
    PersistenceModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            limit: configService.get<number>('THROTTLE_LIMIT', 100),
            ttl: configService.get<number>('THROTTLE_TTL_MS', 60000),
          },
        ],
      }),
    }),
    HealthModule,
  ],
  providers: [
    AuthGuard,
    GlobalExceptionFilter,
    LoggingInterceptor,
    PermissionsGuard,
    ResponseTransformInterceptor,
    RolesGuard,
    TenantGuard,
    TimeoutInterceptor,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
