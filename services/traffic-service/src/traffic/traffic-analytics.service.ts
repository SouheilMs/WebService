import { Injectable } from '@nestjs/common';
import { CongestionLevel, TrafficSnapshot } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyzeCongestionDto } from './dto/analyze-congestion.dto';
import { TrafficAnalysisDto } from './dto/traffic-analysis.dto';
import { TrafficAnalyticsQueryDto } from './dto/traffic-analytics-query.dto';
import { TrafficClassificationSummaryDto } from './dto/traffic-classification-summary.dto';
import { TrafficAlgorithms } from './helpers/traffic-algorithms.helper';
import { TrafficZonesService } from './traffic-zones.service';

@Injectable()
export class TrafficAnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly zonesService: TrafficZonesService,
  ) {}

  async analyze(dto: AnalyzeCongestionDto): Promise<TrafficAnalysisDto> {
    const zone = await this.zonesService.getZoneEntityOrThrow(dto.zoneId);

    const densityPercent = TrafficAlgorithms.calculateDensityPercent(
      dto.vehicleCount,
      zone.capacity,
    );
    const classification = TrafficAlgorithms.classifyCongestion(densityPercent);
    const congestionDetected = TrafficAlgorithms.detectCongestion(
      densityPercent,
      dto.averageSpeedKph,
      zone.speedLimitKph,
      dto.incidentCount,
    );

    const snapshot = await this.prisma.$transaction(async (tx) => {
      const createdSnapshot = await tx.trafficSnapshot.create({
        data: {
          zoneId: zone.id,
          vehicleCount: dto.vehicleCount,
          averageSpeedKph: dto.averageSpeedKph,
          incidentCount: dto.incidentCount ?? 0,
          densityPercent,
          congestionDetected,
          classification: classification as unknown as CongestionLevel,
          isSimulated: dto.isSimulated ?? false,
        },
      });

      await tx.trafficZone.update({
        where: { id: zone.id },
        data: {
          currentDensity: densityPercent,
          congestionLevel: classification as unknown as CongestionLevel,
        },
      });

      return createdSnapshot;
    });

    return this.toAnalysisDto(snapshot);
  }

  async latestByZone(zoneId: string): Promise<TrafficAnalysisDto> {
    await this.zonesService.getZoneEntityOrThrow(zoneId);

    const snapshot = await this.prisma.trafficSnapshot.findFirst({
      where: { zoneId },
      orderBy: { recordedAt: 'desc' },
    });

    if (!snapshot) {
      return this.analyze({
        zoneId,
        vehicleCount: 0,
        averageSpeedKph: 0,
        incidentCount: 0,
        isSimulated: false,
      });
    }

    return this.toAnalysisDto(snapshot);
  }

  async listHistory(query: TrafficAnalyticsQueryDto): Promise<TrafficAnalysisDto[]> {
    const snapshots = await this.prisma.trafficSnapshot.findMany({
      where: {
        zoneId: query.zoneId,
      },
      orderBy: { recordedAt: 'desc' },
      take: query.limit ?? 10,
    });

    return snapshots.map((snapshot) => this.toAnalysisDto(snapshot));
  }

  async runSimulationForAllZones(): Promise<TrafficAnalysisDto[]> {
    const zones = await this.prisma.trafficZone.findMany({ orderBy: { createdAt: 'asc' } });
    const analyses: TrafficAnalysisDto[] = [];

    for (const zone of zones) {
      const baseline = zone.congestionLevel as unknown as TrafficAnalysisDto['classification'];
      const vehicleCount = TrafficAlgorithms.generateVehicleCount(zone.capacity, baseline);
      const averageSpeedKph = TrafficAlgorithms.generateAverageSpeed(zone.speedLimitKph, baseline);

      const result = await this.analyze({
        zoneId: zone.id,
        vehicleCount,
        averageSpeedKph,
        incidentCount: 0,
        isSimulated: true,
      });

      analyses.push(result);
    }

    return analyses;
  }

  async getClassificationSummary(limit = 100): Promise<TrafficClassificationSummaryDto> {
    const snapshots = await this.prisma.trafficSnapshot.findMany({
      orderBy: { recordedAt: 'desc' },
      take: Math.max(1, Math.min(limit, 500)),
      select: { classification: true },
    });

    const summary = snapshots.reduce(
      (accumulator, snapshot) => {
        if (snapshot.classification === CongestionLevel.LOW) {
          accumulator.low += 1;
        } else if (snapshot.classification === CongestionLevel.MEDIUM) {
          accumulator.medium += 1;
        } else {
          accumulator.high += 1;
        }

        accumulator.total += 1;
        return accumulator;
      },
      { low: 0, medium: 0, high: 0, total: 0 },
    );

    return summary;
  }

  private toAnalysisDto(snapshot: TrafficSnapshot): TrafficAnalysisDto {
    return {
      id: snapshot.id,
      zoneId: snapshot.zoneId,
      vehicleCount: snapshot.vehicleCount,
      averageSpeedKph: snapshot.averageSpeedKph,
      incidentCount: snapshot.incidentCount,
      densityPercent: snapshot.densityPercent,
      congestionDetected: snapshot.congestionDetected,
      classification: snapshot.classification as unknown as TrafficAnalysisDto['classification'],
      isSimulated: snapshot.isSimulated,
      recordedAt: snapshot.recordedAt,
    };
  }
}
