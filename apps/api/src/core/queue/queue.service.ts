import { Injectable } from '@nestjs/common';

import { type BaseJob, type EnqueueOptions } from './base-job';

export interface QueuePort {
  enqueue<TPayload extends object>(job: BaseJob<TPayload>, options?: EnqueueOptions): Promise<void>;
}

@Injectable()
export class QueueService implements QueuePort {
  enqueue<TPayload extends object>(
    _job: BaseJob<TPayload>,
    _options?: EnqueueOptions,
  ): Promise<void> {
    // BullMQ-compatible placeholder. Wire a concrete adapter when queue infrastructure is introduced.
    return Promise.resolve();
  }
}
