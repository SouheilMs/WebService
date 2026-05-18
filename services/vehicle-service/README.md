# Vehicle Service

> **Status:** Placeholder — will be implemented in PR 2

This service manages:
- Vehicle registration
- Vehicle types (car, bus, truck, motorcycle)
- GPS position tracking
- Vehicle assignment to operators

## Planned Endpoints
- `POST /api/v1/vehicles` — Register a vehicle
- `GET /api/v1/vehicles` — List vehicles
- `GET /api/v1/vehicles/:id` — Get vehicle details
- `PUT /api/v1/vehicles/:id/position` — Update GPS position

## Architecture
- NestJS microservice
- PostgreSQL (vehicle_db)
- Prisma ORM
- JWT authentication
