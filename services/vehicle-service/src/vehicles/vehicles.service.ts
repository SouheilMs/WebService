import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  GpsPosition,
  PositionSource,
  Prisma,
  Vehicle,
  VehicleStatus,
  VehicleType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { GPSPositionDto } from './dto/gps-position.dto';
import { MovementHistoryQueryDto } from './dto/movement-history-query.dto';
import { PaginatedGpsPositionsDto } from './dto/paginated-gps-positions.dto';
import { PaginatedVehiclesDto } from './dto/paginated-vehicles.dto';
import { SimulateTrackingDto } from './dto/simulate-tracking.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleQueryDto } from './dto/vehicle-query.dto';
import { VehicleDto } from './dto/vehicle.dto';

type VehicleWithRelations = Vehicle & {
  gpsPositions?: GpsPosition[];
  _count?: { gpsPositions: number };
};

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);
  private static readonly DEFAULT_LATITUDE = 36.8065;
  private static readonly DEFAULT_LONGITUDE = 10.1815;

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateVehicleDto): Promise<VehicleDto> {
    await this.ensureUniqueFields(dto.licensePlate, dto.vin);

    const vehicle = await this.prisma.vehicle.create({
      data: {
        licensePlate: this.normalizeLicensePlate(dto.licensePlate),
        vin: dto.vin?.trim().toUpperCase(),
        type: dto.type as unknown as VehicleType,
        status: (dto.status ?? VehicleStatus.ACTIVE) as unknown as VehicleStatus,
        make: dto.make.trim(),
        model: dto.model.trim(),
        year: dto.year,
        color: dto.color?.trim(),
        assignedOperatorId: dto.assignedOperatorId,
        gpsPositions: dto.initialPosition
          ? {
              create: {
                latitude: dto.initialPosition.latitude,
                longitude: dto.initialPosition.longitude,
                altitude: dto.initialPosition.altitude,
                accuracy: dto.initialPosition.accuracy,
                speed: dto.initialPosition.speed,
                heading: dto.initialPosition.heading,
                recordedAt: dto.initialPosition.recordedAt ?? new Date(),
                source: PositionSource.MANUAL,
              },
            }
          : undefined,
      },
      include: this.vehicleInclude,
    });

    this.logger.log(`Vehicle created: ${vehicle.id} (${vehicle.licensePlate})`);
    return this.toVehicleDto(vehicle);
  }

  async findAll(query: VehicleQueryDto): Promise<PaginatedVehiclesDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = this.buildVehicleWhere(query);
    const orderBy = {
      [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'desc',
    } as Prisma.VehicleOrderByWithRelationInput;

    const [total, vehicles] = await this.prisma.$transaction([
      this.prisma.vehicle.count({ where }),
      this.prisma.vehicle.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: this.vehicleInclude,
      }),
    ]);

    return {
      items: vehicles.map((vehicle) => this.toVehicleDto(vehicle)),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findById(id: string): Promise<VehicleDto> {
    const vehicle = await this.getVehicleOrThrow(id);
    return this.toVehicleDto(vehicle);
  }

  async update(id: string, dto: UpdateVehicleDto): Promise<VehicleDto> {
    await this.getVehicleOrThrow(id);

    if (dto.licensePlate) {
      await this.ensureUniqueFields(dto.licensePlate, undefined, id);
    }

    if (dto.vin) {
      await this.ensureUniqueFields(undefined, dto.vin, id);
    }

    const vehicle = await this.prisma.vehicle.update({
      where: { id },
      data: {
        licensePlate: dto.licensePlate ? this.normalizeLicensePlate(dto.licensePlate) : undefined,
        vin: dto.vin?.trim().toUpperCase(),
        type: dto.type as unknown as VehicleType | undefined,
        status: dto.status as unknown as VehicleStatus | undefined,
        make: dto.make?.trim(),
        model: dto.model?.trim(),
        year: dto.year,
        color: dto.color?.trim(),
        assignedOperatorId: dto.assignedOperatorId,
      },
      include: this.vehicleInclude,
    });

    this.logger.log(`Vehicle updated: ${vehicle.id}`);
    return this.toVehicleDto(vehicle);
  }

  async remove(id: string): Promise<boolean> {
    await this.getVehicleOrThrow(id);

    await this.prisma.vehicle.update({
      where: { id },
      data: {
        status: VehicleStatus.INACTIVE,
        deletedAt: new Date(),
      },
    });

    this.logger.log(`Vehicle archived: ${id}`);
    return true;
  }

  async simulateTracking(id: string, dto: SimulateTrackingDto = {}): Promise<GPSPositionDto[]> {
    const vehicle = await this.getVehicleOrThrow(id);
    const lastPosition = vehicle.gpsPositions?.[0] ?? null;
    const steps = dto.steps ?? 1;
    const intervalSeconds = dto.intervalSeconds ?? 60;
    const speedKph = dto.speedKph ?? lastPosition?.speed ?? 40;
    let heading = this.normalizeHeading(dto.heading ?? lastPosition?.heading ?? 45);
    let latitude = lastPosition?.latitude ?? dto.startLatitude ?? VehiclesService.DEFAULT_LATITUDE;
    let longitude =
      lastPosition?.longitude ?? dto.startLongitude ?? VehiclesService.DEFAULT_LONGITUDE;
    const baseRecordedAt = lastPosition?.recordedAt ?? new Date();

    const positions = await this.prisma.$transaction(async (tx) => {
      const created: GpsPosition[] = [];

      for (let index = 0; index < steps; index += 1) {
        const distanceKm = Math.max(speedKph, 5) * (intervalSeconds / 3600);
        const [nextLat, nextLng] = this.moveCoordinate(latitude, longitude, distanceKm, heading);

        const createdPosition = await tx.gpsPosition.create({
          data: {
            vehicleId: id,
            latitude: nextLat,
            longitude: nextLng,
            altitude: dto.altitude,
            accuracy: dto.accuracy ?? 5,
            speed: speedKph,
            heading,
            source: PositionSource.SIMULATED,
            recordedAt: new Date(baseRecordedAt.getTime() + intervalSeconds * 1000 * (index + 1)),
          },
        });

        created.push(createdPosition);
        latitude = nextLat;
        longitude = nextLng;
        heading = this.normalizeHeading(heading + 12);
      }

      return created;
    });

    this.logger.log(`Generated ${positions.length} simulated position(s) for vehicle ${id}`);
    return positions.map((position) => this.toGpsPositionDto(position));
  }

  async getMovementHistory(
    vehicleId: string,
    query: MovementHistoryQueryDto,
  ): Promise<PaginatedGpsPositionsDto> {
    await this.getVehicleOrThrow(vehicleId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: Prisma.GpsPositionWhereInput = {
      vehicleId,
      recordedAt:
        query.from || query.to
          ? {
              gte: query.from,
              lte: query.to,
            }
          : undefined,
    };

    const [total, positions] = await this.prisma.$transaction([
      this.prisma.gpsPosition.count({ where }),
      this.prisma.gpsPosition.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { recordedAt: 'desc' },
      }),
    ]);

    return {
      items: positions.map((position) => this.toGpsPositionDto(position)),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  private buildVehicleWhere(query: VehicleQueryDto): Prisma.VehicleWhereInput {
    const search = query.search?.trim();

    return {
      deletedAt: null,
      type: query.type as unknown as VehicleType | undefined,
      status: query.status as unknown as VehicleStatus | undefined,
      assignedOperatorId: query.assignedOperatorId,
      OR: search
        ? [
            { licensePlate: { contains: search, mode: 'insensitive' } },
            { make: { contains: search, mode: 'insensitive' } },
            { model: { contains: search, mode: 'insensitive' } },
            { vin: { contains: search, mode: 'insensitive' } },
          ]
        : undefined,
    };
  }

  private async ensureUniqueFields(
    licensePlate?: string,
    vin?: string,
    excludeId?: string,
  ): Promise<void> {
    if (licensePlate) {
      const existingByPlate = await this.prisma.vehicle.findFirst({
        where: {
          licensePlate: this.normalizeLicensePlate(licensePlate),
          id: excludeId ? { not: excludeId } : undefined,
        },
      });

      if (existingByPlate) {
        throw new ConflictException('A vehicle with this license plate already exists');
      }
    }

    if (vin) {
      const existingByVin = await this.prisma.vehicle.findFirst({
        where: {
          vin: vin.trim().toUpperCase(),
          id: excludeId ? { not: excludeId } : undefined,
        },
      });

      if (existingByVin) {
        throw new ConflictException('A vehicle with this VIN already exists');
      }
    }
  }

  private async getVehicleOrThrow(id: string): Promise<VehicleWithRelations> {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, deletedAt: null },
      include: this.vehicleInclude,
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id "${id}" not found`);
    }

    return vehicle;
  }

  private normalizeLicensePlate(licensePlate: string): string {
    return licensePlate.trim().toUpperCase();
  }

  private normalizeHeading(heading: number): number {
    const normalized = heading % 360;
    return normalized >= 0 ? normalized : normalized + 360;
  }

  private moveCoordinate(
    latitude: number,
    longitude: number,
    distanceKm: number,
    headingDegrees: number,
  ): [number, number] {
    const earthRadiusKm = 6371;
    const headingRadians = (headingDegrees * Math.PI) / 180;
    const latitudeRadians = (latitude * Math.PI) / 180;
    const longitudeRadians = (longitude * Math.PI) / 180;
    const angularDistance = distanceKm / earthRadiusKm;

    const newLatitudeRadians = Math.asin(
      Math.sin(latitudeRadians) * Math.cos(angularDistance) +
        Math.cos(latitudeRadians) * Math.sin(angularDistance) * Math.cos(headingRadians),
    );

    const newLongitudeRadians =
      longitudeRadians +
      Math.atan2(
        Math.sin(headingRadians) * Math.sin(angularDistance) * Math.cos(latitudeRadians),
        Math.cos(angularDistance) - Math.sin(latitudeRadians) * Math.sin(newLatitudeRadians),
      );

    const newLatitude = Number(((newLatitudeRadians * 180) / Math.PI).toFixed(6));
    const newLongitude = Number(
      ((((newLongitudeRadians * 180) / Math.PI + 540) % 360) - 180).toFixed(6),
    );

    return [newLatitude, newLongitude];
  }

  private toVehicleDto(vehicle: VehicleWithRelations): VehicleDto {
    const currentPosition = vehicle.gpsPositions?.[0] ?? null;

    return {
      id: vehicle.id,
      licensePlate: vehicle.licensePlate,
      vin: vehicle.vin,
      type: vehicle.type as unknown as VehicleDto['type'],
      status: vehicle.status as unknown as VehicleDto['status'],
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      assignedOperatorId: vehicle.assignedOperatorId,
      positionCount: vehicle._count?.gpsPositions ?? 0,
      currentPosition: currentPosition ? this.toGpsPositionDto(currentPosition) : null,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
      deletedAt: vehicle.deletedAt,
    };
  }

  private toGpsPositionDto(position: GpsPosition): GPSPositionDto {
    return {
      id: position.id,
      vehicleId: position.vehicleId,
      latitude: position.latitude,
      longitude: position.longitude,
      altitude: position.altitude,
      accuracy: position.accuracy,
      speed: position.speed,
      heading: position.heading,
      source: position.source as unknown as GPSPositionDto['source'],
      recordedAt: position.recordedAt,
      createdAt: position.createdAt,
    };
  }

  private readonly vehicleInclude = {
    gpsPositions: {
      orderBy: { recordedAt: 'desc' as const },
      take: 1,
    },
    _count: {
      select: { gpsPositions: true },
    },
  };
}
