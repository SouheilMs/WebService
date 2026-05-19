import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  Incident,
  IncidentStatus as PrismaIncidentStatus,
  IncidentType as PrismaIncidentType,
} from '@prisma/client';
import {
  INCIDENT_EVENTS,
  IncidentLifecycleEventDto,
  IncidentStatus,
  IncidentType,
} from '@traffic-platform/shared';
import { EventBusService } from '../events/event-bus.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentDto } from './dto/incident.dto';
import { IncidentQueryDto } from './dto/incident-query.dto';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';

@Injectable()
export class IncidentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async declareIncident(dto: CreateIncidentDto): Promise<IncidentDto> {
    const incident = await this.prisma.incident.create({
      data: {
        title: dto.title.trim(),
        description: dto.description?.trim(),
        type: dto.type as unknown as PrismaIncidentType,
        status: PrismaIncidentStatus.REPORTED,
        latitude: dto.latitude,
        longitude: dto.longitude,
        reportedByUserId: dto.reportedByUserId,
      },
    });

    this.emitIncidentEvent(INCIDENT_EVENTS.REPORTED, incident);

    return this.toDto(incident);
  }

  async updateStatus(id: string, dto: UpdateIncidentStatusDto): Promise<IncidentDto> {
    const incident = await this.prisma.incident.findUnique({ where: { id } });

    if (!incident) {
      throw new NotFoundException(`Incident with id "${id}" not found`);
    }

    if (
      incident.status === PrismaIncidentStatus.RESOLVED &&
      dto.status !== IncidentStatus.RESOLVED
    ) {
      throw new BadRequestException('Resolved incidents cannot transition back to active statuses');
    }

    const updated = await this.prisma.incident.update({
      where: { id },
      data: {
        status: dto.status as unknown as PrismaIncidentStatus,
        resolvedAt: dto.status === IncidentStatus.RESOLVED ? new Date() : null,
      },
    });

    this.emitIncidentEvent(INCIDENT_EVENTS.STATUS_UPDATED, updated);

    return this.toDto(updated);
  }

  async listIncidents(query: IncidentQueryDto): Promise<IncidentDto[]> {
    const incidents = await this.prisma.incident.findMany({
      where: {
        ...(query.type ? { type: query.type as unknown as PrismaIncidentType } : {}),
        ...(query.status ? { status: query.status as unknown as PrismaIncidentStatus } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit ?? 50,
    });

    return incidents.map((incident) => this.toDto(incident));
  }

  private emitIncidentEvent(name: string, incident: Incident): void {
    const payload: IncidentLifecycleEventDto = {
      incidentId: incident.id,
      type: incident.type as unknown as IncidentType,
      status: incident.status as unknown as IncidentStatus,
      occurredAt: new Date().toISOString(),
      title: incident.title,
      description: incident.description ?? undefined,
    };

    this.eventBus.emit(name, payload);
  }

  private toDto(incident: Incident): IncidentDto {
    return {
      id: incident.id,
      title: incident.title,
      description: incident.description,
      type: incident.type as unknown as IncidentType,
      status: incident.status as unknown as IncidentStatus,
      latitude: incident.latitude,
      longitude: incident.longitude,
      reportedByUserId: incident.reportedByUserId,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
      resolvedAt: incident.resolvedAt,
    };
  }
}
