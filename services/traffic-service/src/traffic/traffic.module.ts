import { Module } from '@nestjs/common';
import { TrafficController } from './traffic.controller';
import { TrafficResolver } from './traffic.resolver';
import { TrafficAnalyticsService } from './traffic-analytics.service';
import { TrafficSimulationService } from './traffic-simulation.service';
import { TrafficZonesService } from './traffic-zones.service';

@Module({
  controllers: [TrafficController],
  providers: [
    TrafficZonesService,
    TrafficAnalyticsService,
    TrafficSimulationService,
    TrafficResolver,
  ],
})
export class TrafficModule {}
