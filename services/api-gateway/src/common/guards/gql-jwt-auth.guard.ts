import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthenticatedUser } from '../types/authenticated-user.type';

interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: AuthenticatedUser['role'];
}

@Injectable()
export class GqlJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(GqlJwtAuthGuard.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext<{
      req: { headers: Record<string, string | string[] | undefined>; user?: AuthenticatedUser };
    }>().req;

    const authHeaderRaw = req.headers.authorization;
    const authHeader = Array.isArray(authHeaderRaw) ? authHeaderRaw[0] : authHeaderRaw;

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.slice('Bearer '.length);
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new UnauthorizedException('JWT secret is not configured in gateway');
    }

    try {
      const decoded = verify(token, secret, { algorithms: ['HS256'] });

      if (
        !decoded ||
        typeof decoded !== 'object' ||
        Array.isArray(decoded) ||
        typeof decoded.sub !== 'string' ||
        typeof decoded.email !== 'string' ||
        typeof decoded.username !== 'string' ||
        typeof decoded.role !== 'string'
      ) {
        throw new UnauthorizedException('Invalid JWT payload');
      }

      const payload = decoded as unknown as JwtPayload;
      req.user = {
        id: payload.sub,
        email: payload.email,
        username: payload.username,
        role: payload.role,
      };
      return true;
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'unknown JWT validation error';
      this.logger.warn(`JWT validation failed: ${reason}`);
      throw new UnauthorizedException('Invalid or expired JWT token');
    }
  }
}
