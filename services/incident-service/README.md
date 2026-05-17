# Incident Service

> **Status:** Placeholder — will be implemented in PR 4

This service manages:
- Traffic incident reporting
- Incident severity classification
- Incident lifecycle (open → in-progress → resolved)
- Incident assignment to operators

## Planned Endpoints
- `POST /api/v1/incidents` — Report an incident
- `GET /api/v1/incidents` — List incidents
- `PATCH /api/v1/incidents/:id/status` — Update incident status

## Architecture
- NestJS microservice
- PostgreSQL (incident_db)
- Prisma ORM
- JWT authentication
