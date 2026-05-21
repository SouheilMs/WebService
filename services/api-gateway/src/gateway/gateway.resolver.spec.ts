import { ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { Role } from '../common/enums/role.enum';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';
import { GatewayResolver } from './gateway.resolver';
import { GatewayService } from './gateway.service';

describe('GatewayResolver', () => {
  const callService = jest.fn();
  const gatewayService = { callService } as unknown as GatewayService;
  const resolver = new GatewayResolver(gatewayService);

  beforeEach(() => {
    callService.mockReset();
    callService.mockResolvedValue({
      service: 'notifications',
      operation: 'notifications',
      status: 'success',
      requestedAt: new Date().toISOString(),
      payload: [],
    });
  });

  it("blocks operators from querying another user's notifications", async () => {
    const operator: AuthenticatedUser = {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'op@traffic.io',
      username: 'operator',
      role: Role.OPERATOR,
    };

    expect(() =>
      resolver.notifications(
        { recipientUserId: '22222222-2222-2222-2222-222222222222' },
        operator,
        {} as Request,
      ),
    ).toThrow(ForbiddenException);

    expect(callService).not.toHaveBeenCalled();
  });

  it("allows admins to query another user's notifications", async () => {
    const admin: AuthenticatedUser = {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'admin@traffic.io',
      username: 'admin',
      role: Role.ADMIN,
    };

    const req = {} as Request;

    await resolver.notifications(
      { recipientUserId: '22222222-2222-2222-2222-222222222222' },
      admin,
      req,
    );

    expect(callService).toHaveBeenCalledWith(
      'notifications',
      'notifications',
      {
        method: 'GET',
        url: '/api/v1/notifications',
        params: {
          recipientUserId: '22222222-2222-2222-2222-222222222222',
        },
      },
      req,
    );
  });
});
