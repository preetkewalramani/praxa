import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { RequestContextModule } from '../../shared/context/request-context.module';
import { PinoLoggerService } from './pino-logger.service';

@Module({
  exports: [PinoLoggerService],
  imports: [
    RequestContextModule,
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get<string>('LOG_LEVEL', 'info'),
          transport:
            configService.get<boolean>('LOG_PRETTY', false) === true
              ? {
                  options: {
                    colorize: true,
                    singleLine: true,
                  },
                  target: 'pino-pretty',
                }
              : undefined,
        },
      }),
    }),
  ],
  providers: [PinoLoggerService],
})
export class LoggerModule {}
