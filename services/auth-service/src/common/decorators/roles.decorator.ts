import { SetMetadata } from '@nestjs/common';
import { Role } from '../types';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify the roles that are allowed to access a route.
 *
 * @example
 * @Roles(Role.ADMIN)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * deleteUser() { ... }
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
