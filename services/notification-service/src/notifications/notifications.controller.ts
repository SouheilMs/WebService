import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a notification' })
  @ApiResponse({ status: 201, type: NotificationDto })
  send(@Body() dto: CreateNotificationDto): Promise<NotificationDto> {
    return this.notificationsService.sendNotification(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get notifications' })
  @ApiResponse({ status: 200, type: [NotificationDto] })
  list(@Query() query: NotificationQueryDto): Promise<NotificationDto[]> {
    return this.notificationsService.getNotifications(query);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get notifications for a specific user ID' })
  @ApiResponse({ status: 200, type: [NotificationDto] })
  listMine(@Query('recipientUserId') recipientUserId: string): Promise<NotificationDto[]> {
    return this.notificationsService.getNotifications({ recipientUserId, unreadOnly: 'false' });
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({ name: 'id', description: 'Notification UUID' })
  @ApiResponse({ status: 200, type: NotificationDto })
  markAsRead(@Param('id', ParseUUIDPipe) id: string): Promise<NotificationDto> {
    return this.notificationsService.markAsRead(id);
  }
}
