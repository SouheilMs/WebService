import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PositionSource, VehicleStatus, VehicleType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { VehicleType as VehicleTypeInput } from '../../common/types';
import { VehiclesService } from '../vehicles.service';

const mockVehicle = {
  id: '3d0d7a90-a2b8-4bb3-a2bd-bd2769056799',
  licensePlate: '123TU4567',
  vin: '1HGCM82633A004352',
  type: VehicleType.CAR,
  status: VehicleStatus.ACTIVE,
  make: 'Toyota',
  model: 'Corolla',
  year: 2024,
  color: 'White',
  assignedOperatorId: null,
  createdAt: new Date('2026-05-17T16:00:00.000Z'),
  updatedAt: new Date('2026-05-17T16:00:00.000Z'),
  deletedAt: null,
  gpsPositions: [
    {
      id: 'f89755f5-20bb-4c6b-9c46-f475ba157f8d',
      vehicleId: '3d0d7a90-a2b8-4bb3-a2bd-bd2769056799',
      latitude: 36.8065,
      longitude: 10.1815,
      altitude: null,
      accuracy: 4.5,
      speed: 34,
      heading: 180,
      source: PositionSource.MANUAL,
      recordedAt: new Date('2026-05-17T16:00:00.000Z'),
      createdAt: new Date('2026-05-17T16:00:00.000Z'),
    },
  ],
  _count: { gpsPositions: 1 },
};

describe('VehiclesService', () => {
  let service: VehiclesService;
  let prisma: {
    vehicle: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    gpsPosition: {
      count: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      vehicle: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      gpsPosition: {
        count: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiclesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
  });

  it('creates a vehicle', async () => {
    prisma.vehicle.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    prisma.vehicle.create.mockResolvedValue(mockVehicle);

    const result = await service.create({
      licensePlate: '123tu4567',
      vin: '1hgcm82633a004352',
      type: VehicleTypeInput.CAR,
      make: 'Toyota',
      model: 'Corolla',
      year: 2024,
    });

    expect(result.licensePlate).toBe('123TU4567');
    expect(prisma.vehicle.create).toHaveBeenCalled();
  });

  it('throws on duplicate vehicle license plate', async () => {
    prisma.vehicle.findFirst.mockResolvedValue(mockVehicle);

    await expect(
      service.create({
        licensePlate: '123TU4567',
        type: VehicleTypeInput.CAR,
        make: 'Toyota',
        model: 'Corolla',
        year: 2024,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('lists paginated vehicles', async () => {
    prisma.$transaction.mockResolvedValue([1, [mockVehicle]]);

    const result = await service.findAll({ page: 1, limit: 10, search: 'toyota' });

    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it('throws when vehicle is missing', async () => {
    prisma.vehicle.findFirst.mockResolvedValue(null);

    await expect(service.findById('missing-id')).rejects.toThrow(NotFoundException);
  });

  it('simulates gps tracking positions', async () => {
    prisma.vehicle.findFirst.mockResolvedValue(mockVehicle);
    prisma.$transaction.mockImplementation(
      async (callback: (tx: { gpsPosition: { create: jest.Mock } }) => Promise<unknown>) =>
        callback({
          gpsPosition: {
            create: jest.fn().mockResolvedValue({
              ...mockVehicle.gpsPositions[0],
              id: 'new-position-id',
              source: PositionSource.SIMULATED,
              recordedAt: new Date('2026-05-17T16:01:00.000Z'),
            }),
          },
        }),
    );

    const result = await service.simulateTracking(mockVehicle.id, { steps: 1 });

    expect(result).toHaveLength(1);
    expect(result[0].source).toBe(PositionSource.SIMULATED);
  });

  it('returns movement history', async () => {
    prisma.vehicle.findFirst.mockResolvedValue(mockVehicle);
    prisma.$transaction.mockResolvedValue([1, mockVehicle.gpsPositions]);

    const result = await service.getMovementHistory(mockVehicle.id, { page: 1, limit: 20 });

    expect(result.items).toHaveLength(1);
    expect(result.totalPages).toBe(1);
  });
});
