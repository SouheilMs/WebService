import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CongestionLevel } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TrafficAnalyticsService } from '../traffic-analytics.service';
import { TrafficZonesService } from '../traffic-zones.service';

const mockZone = {
  id: 'cfe1a940-b58d-4988-ae34-7298f26df67f',
  name: 'Downtown Center',
  description: null,
  minLatitude: 36.8,
  maxLatitude: 36.85,
  minLongitude: 10.15,
  maxLongitude: 10.22,
  speedLimitKph: 60,
  capacity: 120,
  congestionLevel: CongestionLevel.LOW,
  currentDensity: 0,
  createdAt: new Date('2026-05-18T18:00:00.000Z'),
  updatedAt: new Date('2026-05-18T18:00:00.000Z'),
};

describe('TrafficAnalyticsService', () => {
  let service: TrafficAnalyticsService;
  let prisma: {
    trafficSnapshot: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
    };
    trafficZone: {
      findMany: jest.Mock;
      update: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let zonesService: { getZoneEntityOrThrow: jest.Mock };

  beforeEach(async () => {
    prisma = {
      trafficSnapshot: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
      },
      trafficZone: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    zonesService = {
      getZoneEntityOrThrow: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrafficAnalyticsService,
        { provide: PrismaService, useValue: prisma },
        { provide: TrafficZonesService, useValue: zonesService },
      ],
    }).compile();

    service = module.get<TrafficAnalyticsService>(TrafficAnalyticsService);
  });

  it('creates an analysis with HIGH classification', async () => {
    zonesService.getZoneEntityOrThrow.mockResolvedValue(mockZone);
    prisma.$transaction.mockImplementation(
      async (
        callback: (tx: {
          trafficSnapshot: { create: jest.Mock };
          trafficZone: { update: jest.Mock };
        }) => Promise<unknown>,
      ) =>
        callback({
          trafficSnapshot: {
            create: jest.fn().mockResolvedValue({
              id: 'snapshot-id',
              zoneId: mockZone.id,
              vehicleCount: 110,
              averageSpeedKph: 20,
              incidentCount: 1,
              densityPercent: 91.67,
              congestionDetected: true,
              classification: CongestionLevel.HIGH,
              isSimulated: false,
              recordedAt: new Date('2026-05-18T19:00:00.000Z'),
            }),
          },
          trafficZone: {
            update: jest.fn(),
          },
        }),
    );

    const result = await service.analyze({
      zoneId: mockZone.id,
      vehicleCount: 110,
      averageSpeedKph: 20,
      incidentCount: 1,
    });

    expect(result.classification).toBe(CongestionLevel.HIGH);
    expect(result.congestionDetected).toBe(true);
  });

  it('returns latest snapshot when available', async () => {
    zonesService.getZoneEntityOrThrow.mockResolvedValue(mockZone);
    prisma.trafficSnapshot.findFirst.mockResolvedValue({
      id: 'latest-id',
      zoneId: mockZone.id,
      vehicleCount: 40,
      averageSpeedKph: 44,
      incidentCount: 0,
      densityPercent: 33.33,
      congestionDetected: false,
      classification: CongestionLevel.LOW,
      isSimulated: false,
      recordedAt: new Date('2026-05-18T19:02:00.000Z'),
    });

    const result = await service.latestByZone(mockZone.id);

    expect(result.id).toBe('latest-id');
    expect(result.classification).toBe(CongestionLevel.LOW);
  });

  it('throws when zone does not exist', async () => {
    zonesService.getZoneEntityOrThrow.mockRejectedValue(new NotFoundException('Missing zone'));

    await expect(
      service.analyze({ zoneId: 'missing-zone', vehicleCount: 10, averageSpeedKph: 45 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('simulates analytics for every zone', async () => {
    zonesService.getZoneEntityOrThrow.mockResolvedValue(mockZone);
    prisma.trafficZone.findMany.mockResolvedValue([mockZone]);
    prisma.$transaction.mockImplementation(
      async (
        callback: (tx: {
          trafficSnapshot: { create: jest.Mock };
          trafficZone: { update: jest.Mock };
        }) => Promise<unknown>,
      ) =>
        callback({
          trafficSnapshot: {
            create: jest.fn().mockResolvedValue({
              id: 'sim-id',
              zoneId: mockZone.id,
              vehicleCount: 60,
              averageSpeedKph: 38,
              incidentCount: 0,
              densityPercent: 50,
              congestionDetected: false,
              classification: CongestionLevel.MEDIUM,
              isSimulated: true,
              recordedAt: new Date('2026-05-18T19:10:00.000Z'),
            }),
          },
          trafficZone: {
            update: jest.fn(),
          },
        }),
    );

    const result = await service.runSimulationForAllZones();

    expect(result).toHaveLength(1);
    expect(result[0].isSimulated).toBe(true);
  });
});
