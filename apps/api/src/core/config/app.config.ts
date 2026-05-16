import { registerAs } from '@nestjs/config';

export interface AppConfig {
  corsOrigins: string[];
  docsPath: string;
  globalPrefix: string;
  name: string;
  port: number;
  version: string;
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
    docsPath: process.env.API_DOCS_PATH ?? 'docs',
    globalPrefix: process.env.API_PREFIX ?? 'api',
    name: process.env.API_NAME ?? 'Praxa API',
    port: Number(process.env.API_PORT ?? 3000),
    version: process.env.API_VERSION ?? '1',
  }),
);

function parseCorsOrigins(value: string | undefined): string[] {
  if (!value) {
    return ['http://localhost:5173'];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}
