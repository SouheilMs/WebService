import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyzeCongestionDto } from './dto/analyze-congestion.dto';
import { CreateTrafficZoneDto } from './dto/create-traffic-zone.dto';
import { TrafficAnalysisDto } from './dto/traffic-analysis.dto';
import { TrafficAnalyticsQueryDto } from './dto/traffic-analytics-query.dto';
import { TrafficClassificationSummaryDto } from './dto/traffic-classification-summary.dto';
import { TrafficZoneDto } from './dto/traffic-zone.dto';
import { TrafficAnalyticsService } from './traffic-analytics.service';
import { TrafficZonesService } from './traffic-zones.service';

@ApiTags('zones', 'congestion', 'analytics')
@Controller()
export class TrafficController {
  constructor(
    private readonly zonesService: TrafficZonesService,
    private readonly analyticsService: TrafficAnalyticsService,
  ) {}

  @Post('zones')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create traffic zone' })
  @ApiResponse({ status: 201, type: TrafficZoneDto })
  createZone(@Body() dto: CreateTrafficZoneDto): Promise<TrafficZoneDto> {
    return this.zonesService.create(dto);
  }

  @Get('zones')
  @ApiOperation({ summary: 'List traffic zones' })
  @ApiResponse({ status: 200, type: [TrafficZoneDto] })
  findZones(): Promise<TrafficZoneDto[]> {
    return this.zonesService.findAll();
  }

  @Get('zones/:id/congestion')
  @ApiOperation({ summary: 'Get latest zone congestion status' })
  @ApiParam({ name: 'id', description: 'Traffic zone UUID' })
  @ApiResponse({ status: 200, type: TrafficAnalysisDto })
  getZoneCongestion(@Param('id', ParseUUIDPipe) id: string): Promise<TrafficAnalysisDto> {
    return this.analyticsService.latestByZone(id);
  }

  @Post('congestion/analyze')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Run congestion analysis for a zone' })
  @ApiResponse({ status: 201, type: TrafficAnalysisDto })
  analyze(@Body() dto: AnalyzeCongestionDto): Promise<TrafficAnalysisDto> {
    return this.analyticsService.analyze(dto);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get traffic analytics history' })
  @ApiResponse({ status: 200, type: [TrafficAnalysisDto] })
  analytics(@Query() query: TrafficAnalyticsQueryDto): Promise<TrafficAnalysisDto[]> {
    return this.analyticsService.listHistory(query);
  }

  @Get('analytics/classification')
  @ApiOperation({ summary: 'Get congestion classification summary' })
  @ApiResponse({ status: 200, type: TrafficClassificationSummaryDto })
  classificationSummary(@Query('limit') limit?: number): Promise<TrafficClassificationSummaryDto> {
    return this.analyticsService.getClassificationSummary(limit);
  }

  @Post('analytics/simulate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Trigger traffic simulation for all zones' })
  @ApiResponse({ status: 201, type: [TrafficAnalysisDto] })
  simulate(): Promise<TrafficAnalysisDto[]> {
    return this.analyticsService.runSimulationForAllZones();
  }
}
