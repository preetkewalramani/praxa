import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { API_PREFIX, API_VERSION, APP_NAMES } from '@praxa/constants';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { StructuredLogger } from './common/logger.service';
import { type EnvironmentVariables } from './config/env.validation';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(StructuredLogger);
  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  const port = configService.get('API_PORT', { infer: true });

  app.useLogger(logger);
  app.setGlobalPrefix(API_PREFIX);
  app.enableVersioning({
    defaultVersion: API_VERSION,
    type: VersioningType.URI,
  });
  app.useGlobalFilters(app.get(GlobalExceptionFilter));
  app.enableShutdownHooks();

  await app.listen(port);
  logger.log(`${APP_NAMES.api} listening on port ${port}`, 'Bootstrap');
}

void bootstrap();
