# Notification Service

> **Status:** Placeholder — will be implemented in PR 5

This service manages:
- System notifications
- User-targeted alerts
- Notification delivery channels (in-app, email)
- Notification templates

## Planned Endpoints
- `POST /api/v1/notifications` — Send notification
- `GET /api/v1/notifications/me` — Get my notifications
- `PATCH /api/v1/notifications/:id/read` — Mark as read

## Architecture
- NestJS microservice
- PostgreSQL (notification_db)
- Prisma ORM
- JWT authentication
