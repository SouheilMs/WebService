import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that validates the Bearer JWT token in the Authorization header.
 * Attaches the validated user to request.user.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
