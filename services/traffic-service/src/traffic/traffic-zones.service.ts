import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CongestionLevel, TrafficZone } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrafficZoneDto } from './dto/create-traffic-zone.dto';
import { TrafficZoneDto } from './dto/traffic-zone.dto';

@Injectable()
export class TrafficZonesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTrafficZoneDto): Promise<TrafficZoneDto> {
    await this.ensureBounds(dto);

    const existing = await this.prisma.trafficZone.findFirst({
      where: { name: dto.name.trim() },
    });

    if (existing) {
      throw new ConflictException(`Traffic zone with name "${dto.name}" already exists`);
    }

    const zone = await this.prisma.trafficZone.create({
      data: {
        name: dto.name.trim(),
        description: dto.description?.trim(),
        minLatitude: dto.minLatitude,
        maxLatitude: dto.maxLatitude,
        minLongitude: dto.minLongitude,
        maxLongitude: dto.maxLongitude,
        speedLimitKph: dto.speedLimitKph ?? 50,
        capacity: dto.capacity ?? 100,
        congestionLevel: CongestionLevel.LOW,
      },
    });

    return this.toZoneDto(zone);
  }

  async findAll(): Promise<TrafficZoneDto[]> {
    const zones = await this.prisma.trafficZone.findMany({ orderBy: { name: 'asc' } });
    return zones.map((zone) => this.toZoneDto(zone));
  }

  async findById(id: string): Promise<TrafficZoneDto> {
    const zone = await this.prisma.trafficZone.findUnique({ where: { id } });

    if (!zone) {
      throw new NotFoundException(`Traffic zone with id "${id}" not found`);
    }

    return this.toZoneDto(zone);
  }

  async getZoneEntityOrThrow(id: string): Promise<TrafficZone> {
    const zone = await this.prisma.trafficZone.findUnique({ where: { id } });

    if (!zone) {
      throw new NotFoundException(`Traffic zone with id "${id}" not found`);
    }

    return zone;
  }

  private async ensureBounds(dto: CreateTrafficZoneDto): Promise<void> {
    if (dto.minLatitude >= dto.maxLatitude) {
      throw new ConflictException('minLatitude must be lower than maxLatitude');
    }

    if (dto.minLongitude >= dto.maxLongitude) {
      throw new ConflictException('minLongitude must be lower than maxLongitude');
    }
  }

  private toZoneDto(zone: TrafficZone): TrafficZoneDto {
    return {
      id: zone.id,
      name: zone.name,
      description: zone.description,
      minLatitude: zone.minLatitude,
      maxLatitude: zone.maxLatitude,
      minLongitude: zone.minLongitude,
      maxLongitude: zone.maxLongitude,
      speedLimitKph: zone.speedLimitKph,
      capacity: zone.capacity,
      currentDensity: zone.currentDensity,
      congestionLevel: zone.congestionLevel as unknown as TrafficZoneDto['congestionLevel'],
      createdAt: zone.createdAt,
      updatedAt: zone.updatedAt,
    };
  }
}
