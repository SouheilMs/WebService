import { Injectable, Logger } from '@nestjs/common';
import { NotificationDto } from '../dto/notification.dto';

@Injectable()
export class NotificationWebsocketGateway {
  private readonly logger = new Logger(NotificationWebsocketGateway.name);

  publish(_notification: NotificationDto): void {
    this.logger.debug('WebSocket publishing hook triggered (stub implementation)');
  }
}
