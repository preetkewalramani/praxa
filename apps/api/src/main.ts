import { ValidationPipe, VersioningType, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { type AppConfig } from './core/config/app.config';
import { LoggingInterceptor } from './core/logger/logging.interceptor';
import { PinoLoggerService } from './core/logger/pino-logger.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(PinoLoggerService);
  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<AppConfig>('app');

  app.useLogger(logger);
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    credentials: true,
    origin: appConfig.corsOrigins,
  });
  app.setGlobalPrefix(appConfig.globalPrefix);
  app.enableVersioning({
    defaultVersion: appConfig.version,
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(app.get(GlobalExceptionFilter));
  app.useGlobalInterceptors(
    app.get(LoggingInterceptor),
    app.get(TimeoutInterceptor),
    app.get(ResponseTransformInterceptor),
  );
  setupSwagger(app, appConfig);
  app.enableShutdownHooks();

  await app.listen(appConfig.port);
  logger.log(`${appConfig.name} listening on port ${appConfig.port}`, 'Bootstrap');
}

function setupSwagger(app: INestApplication, appConfig: AppConfig): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setDescription('Praxa API foundation documentation.')
    .setVersion(appConfig.version)
    .addBearerAuth()
    .addTag('health')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(appConfig.docsPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}

void bootstrap();
