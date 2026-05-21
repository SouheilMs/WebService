import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): {
    status: 'ok';
    service: 'notification-service';
    timestamp: string;
    uptime: number;
  } {
    return {
      status: 'ok',
      service: 'notification-service',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
    };
  }
}
