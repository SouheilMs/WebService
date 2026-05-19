import { Module } from '@nestjs/common';
import { EventBusService } from './event-bus.service';
import { IncidentEventRelayService } from './incident-event-relay.service';

@Module({
  providers: [EventBusService, IncidentEventRelayService],
  exports: [EventBusService],
})
export class EventsModule {}
