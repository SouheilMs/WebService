import { HealthController } from './health.controller';

describe('Incident HealthController', () => {
  it('returns service health payload', () => {
    const controller = new HealthController();
    const result = controller.getHealth();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('incident-service');
    expect(typeof result.timestamp).toBe('string');
    expect(result.uptime).toBeGreaterThanOrEqual(0);
  });
});
