import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AnalyzeCongestionDto } from './dto/analyze-congestion.dto';
import { CreateTrafficZoneDto } from './dto/create-traffic-zone.dto';
import { TrafficAnalysisDto } from './dto/traffic-analysis.dto';
import { TrafficAnalyticsQueryDto } from './dto/traffic-analytics-query.dto';
import { TrafficClassificationSummaryDto } from './dto/traffic-classification-summary.dto';
import { TrafficZoneDto } from './dto/traffic-zone.dto';
import { TrafficAnalyticsService } from './traffic-analytics.service';
import { TrafficZonesService } from './traffic-zones.service';

@Resolver(() => TrafficZoneDto)
export class TrafficResolver {
  constructor(
    private readonly zonesService: TrafficZonesService,
    private readonly analyticsService: TrafficAnalyticsService,
  ) {}

  @Query(() => [TrafficZoneDto], { name: 'trafficZones' })
  trafficZones(): Promise<TrafficZoneDto[]> {
    return this.zonesService.findAll();
  }

  @Query(() => TrafficZoneDto, { name: 'trafficZone' })
  trafficZone(@Args('id') id: string): Promise<TrafficZoneDto> {
    return this.zonesService.findById(id);
  }

  @Query(() => TrafficAnalysisDto, { name: 'trafficCongestion' })
  trafficCongestion(@Args('zoneId') zoneId: string): Promise<TrafficAnalysisDto> {
    return this.analyticsService.latestByZone(zoneId);
  }

  @Query(() => [TrafficAnalysisDto], { name: 'trafficAnalytics' })
  trafficAnalytics(@Args() query: TrafficAnalyticsQueryDto): Promise<TrafficAnalysisDto[]> {
    return this.analyticsService.listHistory(query);
  }

  @Query(() => TrafficClassificationSummaryDto, { name: 'trafficClassificationSummary' })
  trafficClassificationSummary(
    @Args('limit', { nullable: true }) limit?: number,
  ): Promise<TrafficClassificationSummaryDto> {
    return this.analyticsService.getClassificationSummary(limit);
  }

  @Mutation(() => TrafficZoneDto)
  createTrafficZone(@Args('input') input: CreateTrafficZoneDto): Promise<TrafficZoneDto> {
    return this.zonesService.create(input);
  }

  @Mutation(() => TrafficAnalysisDto)
  analyzeTraffic(@Args('input') input: AnalyzeCongestionDto): Promise<TrafficAnalysisDto> {
    return this.analyticsService.analyze(input);
  }

  @Mutation(() => [TrafficAnalysisDto])
  simulateTrafficCycle(): Promise<TrafficAnalysisDto[]> {
    return this.analyticsService.runSimulationForAllZones();
  }
}
