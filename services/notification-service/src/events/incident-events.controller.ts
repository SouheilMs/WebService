import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IncidentLifecycleEventDto } from '@traffic-platform/shared';
import { NotificationDto } from '../notifications/dto/notification.dto';
import { NotificationsService } from '../notifications/notifications.service';

@ApiTags('internal-events')
@Controller('internal/events')
export class IncidentEventsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('incidents')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Handle internal incident lifecycle event' })
  @ApiResponse({ status: 202, type: NotificationDto })
  handleIncident(@Body() event: IncidentLifecycleEventDto): Promise<NotificationDto> {
    return this.notificationsService.handleIncidentEvent(event);
  }
}
