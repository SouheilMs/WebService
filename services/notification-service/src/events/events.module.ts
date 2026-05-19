import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { IncidentEventsController } from './incident-events.controller';

@Module({
  imports: [NotificationsModule],
  controllers: [IncidentEventsController],
})
export class EventsModule {}
