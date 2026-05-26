import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { EventBusService } from './event-bus.service';

@Module({
  exports: [EventBusService],
  imports: [
    EventEmitterModule.forRoot({
      global: true,
      wildcard: true,
    }),
  ],
  providers: [EventBusService],
})
export class EventsModule {}
