import { Injectable, NotFoundException } from '@nestjs/common';
import { Notification, NotificationType as PrismaNotificationType, Prisma } from '@prisma/client';
import {
  IncidentLifecycleEventDto,
  NotificationType,
  CreateNotificationDto as SharedCreateNotificationDto,
} from '@traffic-platform/shared';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { NotificationWebsocketGateway } from './websocket/notification-websocket.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly websocketGateway: NotificationWebsocketGateway,
  ) {}

  async sendNotification(
    dto: CreateNotificationDto | SharedCreateNotificationDto,
  ): Promise<NotificationDto> {
    const notification = await this.prisma.notification.create({
      data: {
        recipientUserId: dto.recipientUserId,
        title: dto.title.trim(),
        message: dto.message.trim(),
        type: dto.type as unknown as PrismaNotificationType,
        incidentId: dto.incidentId,
        metadata: dto.metadata as Prisma.InputJsonValue | undefined,
      },
    });

    const result = this.toDto(notification);
    this.websocketGateway.publish(result);

    return result;
  }

  async getNotifications(query: NotificationQueryDto): Promise<NotificationDto[]> {
    const unreadOnly = query.unreadOnly === 'true';

    const notifications = await this.prisma.notification.findMany({
      where: {
        ...(query.recipientUserId ? { recipientUserId: query.recipientUserId } : {}),
        ...(unreadOnly ? { readAt: null } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return notifications.map((notification) => this.toDto(notification));
  }

  async markAsRead(id: string): Promise<NotificationDto> {
    const existing = await this.prisma.notification.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Notification with id "${id}" not found`);
    }

    if (existing.readAt) {
      return this.toDto(existing);
    }

    const updated = await this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });

    return this.toDto(updated);
  }

  async handleIncidentEvent(event: IncidentLifecycleEventDto): Promise<NotificationDto> {
    const isReported = event.status === 'REPORTED';

    return this.sendNotification({
      recipientUserId: undefined,
      title: isReported ? 'New incident reported' : 'Incident status updated',
      message: `${event.title} is now ${event.status}`,
      type: isReported ? NotificationType.INCIDENT_REPORTED : NotificationType.INCIDENT_UPDATED,
      incidentId: event.incidentId,
      metadata: {
        occurredAt: event.occurredAt,
        incidentType: event.type,
      },
    });
  }

  private toDto(notification: Notification): NotificationDto {
    return {
      id: notification.id,
      recipientUserId: notification.recipientUserId,
      title: notification.title,
      message: notification.message,
      type: notification.type as unknown as NotificationType,
      incidentId: notification.incidentId,
      metadata: notification.metadata as Record<string, unknown> | null,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }
}
