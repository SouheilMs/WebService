import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { AuthenticatedUser } from '../types/authenticated-user.type';

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const user = gqlContext.getContext<{ req: { user?: AuthenticatedUser } }>().req.user;

    if (!user) {
      throw new ForbiddenException('Access denied: no authenticated user found');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Access denied: requires one of [${requiredRoles.join(', ')}]`);
    }

    return true;
  }
}
