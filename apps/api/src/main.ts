import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
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
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  await app.listen(port);
  logger.log(`Praxa API listening on port ${port}`, 'Bootstrap');
}

void bootstrap();
