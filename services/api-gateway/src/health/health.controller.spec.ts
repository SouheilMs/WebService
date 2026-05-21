import { HealthController } from './health.controller';

describe('Gateway HealthController', () => {
  it('returns service health payload', () => {
    const controller = new HealthController();
    const result = controller.getHealth();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('api-gateway');
    expect(typeof result.timestamp).toBe('string');
    expect(result.uptime).toBeGreaterThanOrEqual(0);
  });
});
