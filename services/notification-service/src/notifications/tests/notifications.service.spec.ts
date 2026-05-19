import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IncidentStatus, IncidentType, NotificationType } from '@traffic-platform/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationWebsocketGateway } from '../websocket/notification-websocket.gateway';
import { NotificationsService } from '../notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: {
    notification: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };
  let gateway: { publish: jest.Mock };

  const sampleNotification = {
    id: '90cfaa15-b1be-432a-87a4-7f51eeb6220c',
    recipientUserId: 'operator-1',
    title: 'Incident update',
    message: 'Incident status changed',
    type: NotificationType.INCIDENT_UPDATED,
    incidentId: '817646ac-0b9d-4341-b2a1-0d46495cef04',
    metadata: { source: 'incident-service' },
    readAt: null,
    createdAt: new Date('2026-05-19T10:20:00.000Z'),
    updatedAt: new Date('2026-05-19T10:20:00.000Z'),
  };

  beforeEach(async () => {
    prisma = {
      notification: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    gateway = { publish: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: prisma },
        { provide: NotificationWebsocketGateway, useValue: gateway },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('sends notification and triggers websocket hook', async () => {
    prisma.notification.create.mockResolvedValue(sampleNotification);

    const result = await service.sendNotification({
      title: sampleNotification.title,
      message: sampleNotification.message,
      type: NotificationType.INCIDENT_UPDATED,
    });

    expect(result.id).toBe(sampleNotification.id);
    expect(gateway.publish).toHaveBeenCalled();
  });

  it('lists notifications', async () => {
    prisma.notification.findMany.mockResolvedValue([sampleNotification]);

    const result = await service.getNotifications({ recipientUserId: 'operator-1' });

    expect(result).toHaveLength(1);
  });

  it('throws when marking missing notification as read', async () => {
    prisma.notification.findUnique.mockResolvedValue(null);

    await expect(service.markAsRead('missing')).rejects.toThrow(NotFoundException);
  });

  it('creates notification from incident event payload', async () => {
    prisma.notification.create.mockResolvedValue(sampleNotification);

    await service.handleIncidentEvent({
      incidentId: '817646ac-0b9d-4341-b2a1-0d46495cef04',
      title: 'Accident at central avenue',
      description: 'Two lanes blocked',
      type: IncidentType.ACCIDENT,
      status: IncidentStatus.REPORTED,
      occurredAt: '2026-05-19T10:20:00.000Z',
    });

    expect(prisma.notification.create).toHaveBeenCalled();
  });
});
