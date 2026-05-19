import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationWebsocketGateway } from './websocket/notification-websocket.gateway';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationWebsocketGateway],
  exports: [NotificationsService],
})
export class NotificationsModule {}
