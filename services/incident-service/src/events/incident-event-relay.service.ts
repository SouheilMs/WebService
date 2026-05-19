import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { INCIDENT_EVENTS, IncidentLifecycleEventDto } from '@traffic-platform/shared';
import { Subscription } from 'rxjs';
import { EventBusService } from './event-bus.service';

@Injectable()
export class IncidentEventRelayService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(IncidentEventRelayService.name);
  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly eventBus: EventBusService) {}

  onModuleInit(): void {
    this.subscriptions.push(
      this.eventBus
        .on<IncidentLifecycleEventDto>(INCIDENT_EVENTS.REPORTED)
        .subscribe((event) => void this.forwardEvent(event)),
    );

    this.subscriptions.push(
      this.eventBus
        .on<IncidentLifecycleEventDto>(INCIDENT_EVENTS.STATUS_UPDATED)
        .subscribe((event) => void this.forwardEvent(event)),
    );
  }

  onModuleDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private async forwardEvent(event: IncidentLifecycleEventDto): Promise<void> {
    const endpoint = `${process.env.NOTIFICATION_SERVICE_URL ?? 'http://localhost:3005'}/api/v1/internal/events/incidents`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        this.logger.warn(
          `Notification service rejected incident event ${event.incidentId} with status ${response.status}`,
        );
      }
    } catch (error) {
      this.logger.warn(`Failed to forward incident event ${event.incidentId}: ${String(error)}`);
    }
  }
}
