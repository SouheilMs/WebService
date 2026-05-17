# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Urban Traffic Platform                           │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    API Gateway (GraphQL)                      │  │
│  │                   Port: 4000 [PR6]                           │  │
│  └─────────────────────────────────────────────────────────────┘  │
│       │           │            │           │            │           │
│  ┌────┴───┐ ┌─────┴──┐ ┌──────┴─┐ ┌──────┴─┐ ┌───────┴─┐        │
│  │  Auth  │ │Vehicle │ │Traffic │ │Incident│ │Notifi-  │        │
│  │Service │ │Service │ │Service │ │Service │ │cation   │        │
│  │:3001   │ │:3002   │ │:3003   │ │:3004   │ │Service  │        │
│  │[PR1✅] │ │[PR2]   │ │[PR3]   │ │[PR4]   │ │:3005    │        │
│  └────────┘ └────────┘ └────────┘ └────────┘ │[PR5]    │        │
│       │           │            │           │  └─────────┘        │
│  ┌────┴─────────────────────────────────────┐                     │
│  │              PostgreSQL                   │                     │
│  │  auth_db | vehicle_db | traffic_db        │                     │
│  │  incident_db | notification_db            │                     │
│  └───────────────────────────────────────────┘                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Service Responsibilities

| Service          | Port | Database        | PR  |
|-----------------|------|-----------------|-----|
| auth-service    | 3001 | auth_db         | PR1 |
| vehicle-service | 3002 | vehicle_db      | PR2 |
| traffic-service | 3003 | traffic_db      | PR3 |
| incident-service| 3004 | incident_db     | PR4 |
| notification-service | 3005 | notification_db | PR5 |
| api-gateway     | 4000 | —               | PR6 |

## Design Principles

- **SOLID Principles** applied throughout
- **Clean Architecture** (layers: Controller → Service → Repository)
- **DTO Validation** via class-validator on every input
- **JWT Authentication** with role-based authorization
- **Prisma ORM** for type-safe database access
- **Global Exception Filter** for consistent error responses
- **Swagger** documentation for every REST service
- **GraphQL** documentation via introspection

## Authentication Flow

```
Client → POST /api/v1/auth/register → JWT token
Client → POST /api/v1/auth/login    → JWT token
Client → GET  /api/v1/auth/me       → (Bearer token required)
```

## Roles

| Role     | Permissions                                           |
|----------|-------------------------------------------------------|
| ADMIN    | Full CRUD on all resources + user management         |
| OPERATOR | Read + update own resources, report incidents         |
