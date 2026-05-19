# Notification Service

Notification microservice with reusable notification module.

## Features
- Send notification
- Get notifications
- Mark notification as read
- Receive incident lifecycle events from incident-service
- WebSocket support scaffolding through `NotificationWebsocketGateway`

## Endpoints
- `POST /api/v1/notifications` — Send notification
- `GET /api/v1/notifications` — Get notifications (supports query filters)
- `GET /api/v1/notifications/me` — Get user notifications
- `PATCH /api/v1/notifications/:id/read` — Mark as read
- `POST /api/v1/internal/events/incidents` — Internal incident-event ingress

## Architecture
- NestJS microservice
- PostgreSQL (`notification_db`)
- Prisma ORM
- Reusable shared enums/DTOs from `@traffic-platform/shared`
