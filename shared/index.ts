/**
 * @package @traffic-platform/shared
 * Shared types, interfaces, and constants used across all microservices.
 */

// ── Enums ─────────────────────────────────────────────────────────────────────

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

export enum IncidentStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum CongestionLevel {
  FREE = 'FREE',       // < 30% capacity
  MODERATE = 'MODERATE', // 30–60%
  HEAVY = 'HEAVY',    // 60–85%
  SEVERE = 'SEVERE',  // > 85%
}

// ── JWT ───────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: string;    // user id
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

// ── GPS ───────────────────────────────────────────────────────────────────────

export interface GpsPosition {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  speed?: number;       // km/h
  heading?: number;     // degrees (0–360)
  timestamp: Date;
}

// ── Service responses ─────────────────────────────────────────────────────────

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
