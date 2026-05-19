# Incident Service

Incident management microservice for PR4.

## Features
- Declare incident
- Update incident status (`REPORTED`, `IN_PROGRESS`, `RESOLVED`)
- List incidents with filters
- Emit incident lifecycle events
- Forward incident events to notification-service internal endpoint

## Endpoints
- `POST /api/v1/incidents` — Report an incident
- `GET /api/v1/incidents` — List incidents
- `PATCH /api/v1/incidents/:id/status` — Update incident status

## Event-driven flow
1. Incident is created or updated.
2. `EventBusService` emits a lifecycle event.
3. `IncidentEventRelayService` forwards the event to notification-service:
   `POST /api/v1/internal/events/incidents`

## Architecture
- NestJS microservice
- PostgreSQL (`incident_db`)
- Prisma ORM
- Reusable shared enums/DTOs from `@traffic-platform/shared`
