import { registerAs } from '@nestjs/config';

export interface QueueConfig {
  defaultQueueName: string;
  enabled: boolean;
}

export const queueConfig = registerAs(
  'queue',
  (): QueueConfig => ({
    defaultQueueName: process.env.QUEUE_DEFAULT_NAME ?? 'default',
    enabled: process.env.QUEUE_ENABLED !== 'false',
  }),
);
