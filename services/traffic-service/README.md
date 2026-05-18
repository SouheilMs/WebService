# Traffic Service

> **Status:** Placeholder — will be implemented in PR 3

This service manages:
- Traffic zones definition
- Congestion level monitoring
- Real-time congestion detection
- Traffic flow analytics

## Planned Endpoints
- `POST /api/v1/zones` — Create traffic zone
- `GET /api/v1/zones` — List zones
- `GET /api/v1/zones/:id/congestion` — Get zone congestion level
- `POST /api/v1/congestion/analyze` — Run congestion analysis

## Architecture
- NestJS microservice
- PostgreSQL (traffic_db)
- Prisma ORM
- JWT authentication
