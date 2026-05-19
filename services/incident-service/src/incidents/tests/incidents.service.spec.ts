import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IncidentStatus, IncidentType } from '@traffic-platform/shared';
import { EventBusService } from '../../events/event-bus.service';
import { PrismaService } from '../../prisma/prisma.service';
import { IncidentsService } from '../incidents.service';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let prisma: {
    incident: {
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      findMany: jest.Mock;
    };
  };
  let eventBus: { emit: jest.Mock };

  const sampleIncident = {
    id: '817646ac-0b9d-4341-b2a1-0d46495cef04',
    title: 'Accident at central avenue',
    description: 'Two lanes blocked',
    type: IncidentType.ACCIDENT,
    status: IncidentStatus.REPORTED,
    latitude: 36.8065,
    longitude: 10.1815,
    reportedByUserId: 'operator-1',
    createdAt: new Date('2026-05-19T10:20:00.000Z'),
    updatedAt: new Date('2026-05-19T10:20:00.000Z'),
    resolvedAt: null,
  };

  beforeEach(async () => {
    prisma = {
      incident: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
    };
    eventBus = { emit: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
  });

  it('declares an incident and emits event', async () => {
    prisma.incident.create.mockResolvedValue(sampleIncident);

    const result = await service.declareIncident({
      title: sampleIncident.title,
      type: IncidentType.ACCIDENT,
      latitude: sampleIncident.latitude,
      longitude: sampleIncident.longitude,
    });

    expect(result.id).toBe(sampleIncident.id);
    expect(eventBus.emit).toHaveBeenCalled();
  });

  it('throws when incident is missing for status update', async () => {
    prisma.incident.findUnique.mockResolvedValue(null);

    await expect(
      service.updateStatus(sampleIncident.id, { status: IncidentStatus.IN_PROGRESS }),
    ).rejects.toThrow(NotFoundException);
  });

  it('blocks invalid transition from resolved to active', async () => {
    prisma.incident.findUnique.mockResolvedValue({
      ...sampleIncident,
      status: IncidentStatus.RESOLVED,
    });

    await expect(
      service.updateStatus(sampleIncident.id, { status: IncidentStatus.IN_PROGRESS }),
    ).rejects.toThrow(BadRequestException);
  });

  it('lists incidents with filters', async () => {
    prisma.incident.findMany.mockResolvedValue([sampleIncident]);

    const result = await service.listIncidents({ status: IncidentStatus.REPORTED, limit: 10 });

    expect(result).toHaveLength(1);
    expect(prisma.incident.findMany).toHaveBeenCalled();
  });
});
