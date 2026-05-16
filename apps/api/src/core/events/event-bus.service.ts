import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { type BaseDomainEvent } from './base-domain-event';

export interface EventBusPort {
  publish(event: BaseDomainEvent): Promise<void>;
}

@Injectable()
export class EventBusService implements EventBusPort {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish(event: BaseDomainEvent): Promise<void> {
    await this.eventEmitter.emitAsync(event.eventName, event);
  }
}
