import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenException, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JsonResponse } from './types/json-response.type';
import { GatewayService } from './gateway.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { GqlJwtAuthGuard } from '../common/guards/gql-jwt-auth.guard';
import { GqlRolesGuard } from '../common/guards/gql-roles.guard';
import { RegisterInput, LoginInput, CreateUserInput } from './dto/auth.dto';
import {
  IncidentQueryArgs,
  NotificationQueryArgs,
  TrafficAnalyticsQueryArgs,
  VehicleQueryArgs,
} from './dto/gateway-args.dto';
import { Context } from '@nestjs/graphql';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';
import { JsonScalar } from '../common/scalars/json.scalar';

@Resolver()
@UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
export class GatewayResolver {
  constructor(private readonly gatewayService: GatewayService) {}

  @Public()
  @Mutation(() => JsonResponse)
  register(
    @Args('input') input: RegisterInput,
    @Context('req') req: Request,
  ): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'auth',
      'register',
      { method: 'POST', url: '/api/v1/auth/register', data: input },
      req,
    );
  }

  @Public()
  @Mutation(() => JsonResponse)
  login(@Args('input') input: LoginInput, @Context('req') req: Request): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'auth',
      'login',
      { method: 'POST', url: '/api/v1/auth/login', data: input },
      req,
    );
  }

  @Query(() => JsonResponse)
  authMe(@Context('req') req: Request): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'auth',
      'me',
      { method: 'GET', url: '/api/v1/auth/me' },
      req,
    );
  }

  @Roles(Role.ADMIN)
  @Mutation(() => JsonResponse)
  createUser(
    @Args('input') input: CreateUserInput,
    @Context('req') req: Request,
  ): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'auth',
      'createUser',
      { method: 'POST', url: '/api/v1/users', data: input },
      req,
    );
  }

  @Roles(Role.ADMIN)
  @Query(() => JsonResponse)
  users(@Context('req') req: Request): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'auth',
      'users',
      { method: 'GET', url: '/api/v1/users' },
      req,
    );
  }

  @Query(() => JsonResponse)
  vehicles(@Args() query: VehicleQueryArgs, @Context('req') req: Request): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'vehicles',
      'vehicles',
      { method: 'GET', url: '/api/v1/vehicles', params: query },
      req,
    );
  }

  @Query(() => JsonResponse)
  vehicle(
    @Args('id', ParseUUIDPipe) id: string,
    @Context('req') req: Request,
  ): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'vehicles',
      'vehicle',
      { method: 'GET', url: `/api/v1/vehicles/${id}` },
      req,
    );
  }

  @Query(() => JsonResponse)
  trafficZones(@Context('req') req: Request): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'traffic',
      'trafficZones',
      { method: 'GET', url: '/api/v1/zones' },
      req,
    );
  }

  @Query(() => JsonResponse)
  trafficCongestion(
    @Args('zoneId', ParseUUIDPipe) zoneId: string,
    @Context('req') req: Request,
  ): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'traffic',
      'trafficCongestion',
      { method: 'GET', url: `/api/v1/zones/${zoneId}/congestion` },
      req,
    );
  }

  @Query(() => JsonResponse)
  trafficAnalytics(
    @Args() query: TrafficAnalyticsQueryArgs,
    @Context('req') req: Request,
  ): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'traffic',
      'trafficAnalytics',
      { method: 'GET', url: '/api/v1/analytics', params: query },
      req,
    );
  }

  @Roles(Role.ADMIN)
  @Mutation(() => JsonResponse)
  createTrafficZone(
    @Args('input', { type: () => JsonScalar }) input: Record<string, unknown>,
    @Context('req') req: Request,
  ): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'traffic',
      'createTrafficZone',
      { method: 'POST', url: '/api/v1/zones', data: input },
      req,
    );
  }

  @Roles(Role.ADMIN)
  @Mutation(() => JsonResponse)
  analyzeTraffic(
    @Args('input', { type: () => JsonScalar }) input: Record<string, unknown>,
    @Context('req') req: Request,
  ): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'traffic',
      'analyzeTraffic',
      { method: 'POST', url: '/api/v1/congestion/analyze', data: input },
      req,
    );
  }

  @Roles(Role.ADMIN)
  @Mutation(() => JsonResponse)
  simulateTrafficCycle(@Context('req') req: Request): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'traffic',
      'simulateTrafficCycle',
      { method: 'POST', url: '/api/v1/analytics/simulate' },
      req,
    );
  }

  @Query(() => JsonResponse)
  incidents(@Args() query: IncidentQueryArgs, @Context('req') req: Request): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'incidents',
      'incidents',
      { method: 'GET', url: '/api/v1/incidents', params: query },
      req,
    );
  }

  @Mutation(() => JsonResponse)
  declareIncident(
    @Args('input', { type: () => JsonScalar }) input: Record<string, unknown>,
    @Context('req') req: Request,
  ): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'incidents',
      'declareIncident',
      { method: 'POST', url: '/api/v1/incidents', data: input },
      req,
    );
  }

  @Mutation(() => JsonResponse)
  updateIncidentStatus(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input', { type: () => JsonScalar }) input: Record<string, unknown>,
    @Context('req') req: Request,
  ): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'incidents',
      'updateIncidentStatus',
      { method: 'PATCH', url: `/api/v1/incidents/${id}/status`, data: input },
      req,
    );
  }

  @Query(() => JsonResponse)
  notifications(
    @Args() query: NotificationQueryArgs,
    @CurrentUser() user: AuthenticatedUser,
    @Context('req') req: Request,
  ): Promise<JsonResponse> {
    if (query.recipientUserId && query.recipientUserId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You can only access your own notifications');
    }

    const params = {
      ...query,
      recipientUserId: query.recipientUserId ?? user.id,
    };

    return this.gatewayService.callService(
      'notifications',
      'notifications',
      { method: 'GET', url: '/api/v1/notifications', params },
      req,
    );
  }

  @Mutation(() => JsonResponse)
  sendNotification(
    @Args('input', { type: () => JsonScalar }) input: Record<string, unknown>,
    @Context('req') req: Request,
  ): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'notifications',
      'sendNotification',
      { method: 'POST', url: '/api/v1/notifications', data: input },
      req,
    );
  }

  @Mutation(() => JsonResponse)
  markNotificationRead(
    @Args('id', ParseUUIDPipe) id: string,
    @Context('req') req: Request,
  ): Promise<JsonResponse> {
    return this.gatewayService.callService(
      'notifications',
      'markNotificationRead',
      { method: 'PATCH', url: `/api/v1/notifications/${id}/read` },
      req,
    );
  }
}
