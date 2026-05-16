import { registerAs } from '@nestjs/config';

export interface LoggerConfig {
  level: string;
  pretty: boolean;
}

export const loggerConfig = registerAs(
  'logger',
  (): LoggerConfig => ({
    level: process.env.LOG_LEVEL ?? 'info',
    pretty: process.env.LOG_PRETTY === 'true' || process.env.NODE_ENV === 'development',
  }),
);
