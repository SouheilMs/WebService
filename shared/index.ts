/**
 * @package @traffic-platform/shared
 * Shared types, interfaces, and constants used across all microservices.
 */

export enum Role {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

export enum VehicleType {
  CAR = 'CAR',
  BUS = 'BUS',
  TRUCK = 'TRUCK',
  MOTORCYCLE = 'MOTORCYCLE',
  EMERGENCY = 'EMERGENCY',
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum IncidentType {
  ACCIDENT = 'ACCIDENT',
  ROADWORK = 'ROADWORK',
  ROAD_CLOSED = 'ROAD_CLOSED',
  TRAFFIC_JAM = 'TRAFFIC_JAM',
}

export enum IncidentStatus {
  REPORTED = 'REPORTED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

export enum NotificationType {
  INCIDENT_REPORTED = 'INCIDENT_REPORTED',
  INCIDENT_UPDATED = 'INCIDENT_UPDATED',
  SYSTEM = 'SYSTEM',
}

export enum CongestionLevel {
  FREE = 'FREE',
  MODERATE = 'MODERATE',
  HEAVY = 'HEAVY',
  SEVERE = 'SEVERE',
}

export const INCIDENT_EVENTS = {
  REPORTED: 'incident.reported',
  STATUS_UPDATED: 'incident.status.updated',
} as const;

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: Role;
}

export interface GpsPosition {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: Date;
}

export interface IncidentLifecycleEventDto {
  incidentId: string;
  type: IncidentType;
  status: IncidentStatus;
  occurredAt: string;
  title: string;
  description?: string;
}

export interface CreateNotificationDto {
  recipientUserId?: string;
  title: string;
  message: string;
  type: NotificationType;
  incidentId?: string;
  metadata?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServiceErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp: string;
  path: string;
}
