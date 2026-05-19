import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TrafficAnalyticsService } from './traffic-analytics.service';

@Injectable()
export class TrafficSimulationService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TrafficSimulationService.name);
  private intervalRef?: NodeJS.Timeout;

  constructor(private readonly analyticsService: TrafficAnalyticsService) {}

  async onModuleInit(): Promise<void> {
    const enabled = (process.env.TRAFFIC_SIMULATION_ENABLED ?? 'true').toLowerCase() === 'true';

    if (!enabled) {
      this.logger.log('Scheduled traffic simulation disabled');
      return;
    }

    const intervalSeconds = Number(process.env.TRAFFIC_SIMULATION_INTERVAL_SECONDS ?? 300);
    const safeIntervalMs = Math.max(intervalSeconds, 30) * 1000;

    this.intervalRef = setInterval(async () => {
      try {
        await this.analyticsService.runSimulationForAllZones();
        this.logger.debug('Scheduled traffic simulation cycle completed');
      } catch (error) {
        this.logger.error(
          'Scheduled traffic simulation cycle failed',
          error instanceof Error ? error.stack : String(error),
        );
      }
    }, safeIntervalMs);

    this.logger.log(`Scheduled traffic simulation every ${safeIntervalMs / 1000} seconds`);
  }

  onModuleDestroy(): void {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
  }
}
