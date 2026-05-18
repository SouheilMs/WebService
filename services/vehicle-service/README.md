# Vehicle Service

Vehicle tracking microservice for the Urban Traffic Management Platform.

## Features
- Vehicle CRUD operations
- GPS position tracking and simulated movement
- Vehicle movement history with pagination and date filtering
- REST endpoints with Swagger documentation
- GraphQL queries and mutations
- Prisma/PostgreSQL persistence with vehicle ↔ GPS position relations

## REST Endpoints
- `POST /api/v1/vehicles`
- `GET /api/v1/vehicles`
- `GET /api/v1/vehicles/:id`
- `PATCH /api/v1/vehicles/:id`
- `DELETE /api/v1/vehicles/:id`
- `POST /api/v1/vehicles/:id/tracking/simulate`
- `GET /api/v1/vehicles/:id/history`

## GraphQL
Available at `http://localhost:3002/graphql`

### Queries
- `vehicles`
- `vehicle`
- `vehicleMovementHistory`

### Mutations
- `createVehicle`
- `updateVehicle`
- `deleteVehicle`
- `simulateVehicleTracking`
