# Smart Urban Traffic Intelligence Platform

Distributed microservices platform for real-time urban traffic supervision, incident coordination, and operational decision support through a unified GraphQL gateway.

## Project Overview

Rapid urban growth increases congestion, response times to incidents, and pressure on traffic operators.  
This project addresses that challenge by providing a scalable digital platform that centralizes traffic data, vehicle movement, incident workflows, and notification delivery.

### Objectives
- Provide secure authentication and role-based access control for traffic operators.
- Track vehicles and movement history using GPS-oriented data flows.
- Analyze zone-level traffic density and classify congestion severity.
- Coordinate incident lifecycle management and system-wide alerting.
- Expose a single GraphQL API for clients while preserving service autonomy.

### Architecture Summary
The platform follows a **microservices architecture** where each domain service encapsulates its own logic and persistence model.  
An **API Gateway** aggregates services into a single GraphQL interface, enforcing centralized authentication and request orchestration.

## System Architecture

### Microservices Architecture
- Services are independently deployable NestJS applications.
- Each core domain (auth, vehicle, traffic, incident, notification) is isolated.
- Services expose REST APIs internally and are composed externally through GraphQL.
- Health endpoints support observability and container orchestration.

### API Gateway Role
- Serves as the unified client entry point on port `4000`.
- Aggregates and delegates operations to downstream domain services.
- Applies centralized JWT validation and role-aware authorization.
- Reduces client complexity by hiding inter-service boundaries.

### Service Communication Model
- **Client → Gateway:** GraphQL queries and mutations.
- **Gateway → Domain Services:** HTTP-based service-to-service orchestration.
- **Incident Service → Notification Service:** Internal incident-event relay endpoint for lifecycle notifications.
- **Services → PostgreSQL:** Service-owned schemas/databases to preserve loose coupling.

## Technologies Used

| Layer | Technology | Purpose |
|---|---|---|
| Backend Framework | NestJS (Node.js) | Modular microservice development |
| API Integration | GraphQL (Apollo Gateway pattern) | Unified API and service aggregation |
| Data Storage | PostgreSQL + Prisma ORM | Persistent domain data and type-safe data access |
| Security | JWT + RBAC (`ADMIN`, `OPERATOR`) | Authentication and authorization |
| Containerization | Docker + Docker Compose | Reproducible local and deployment environments |
| Real-Time (Optional) | WebSocket (notification scaffolding) | Live updates/events |
| Frontend (Optional) | React / Next.js Dashboard | Monitoring and operator UI |

## Microservices Description

### 1) Authentication Service (`auth-service`, port 3001)
**Role:** Identity, access control, and user lifecycle management.  
**Responsibilities:**
- User registration and login.
- JWT issuance and authenticated profile retrieval.
- Role-based user administration (`ADMIN`, `OPERATOR`).

**Main endpoints/features:**
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/users` (ADMIN)
- `GET /api/v1/users` (ADMIN)
- `PATCH /api/v1/users/:id` (ADMIN)

### 2) Vehicle Management Service (`vehicle-service`, port 3002)
**Role:** Vehicle registry, live positioning, and mobility history.  
**Responsibilities:**
- Vehicle creation and management.
- GPS point ingestion/simulation.
- Historical movement retrieval.

**Main endpoints/features:**
- `POST /api/v1/vehicles`
- `GET /api/v1/vehicles`
- `PATCH /api/v1/vehicles/:id`
- `POST /api/v1/vehicles/:id/tracking/simulate`
- `GET /api/v1/vehicles/:id/history`

### 3) Traffic Management Service (`traffic-service`, port 3003)
**Role:** Traffic zone supervision and congestion intelligence.  
**Responsibilities:**
- Traffic zone definition and maintenance.
- Density and congestion analysis.
- Classification into `LOW`, `MEDIUM`, `HIGH`.
- Simulation and analytics snapshots.

**Main endpoints/features:**
- `POST /api/v1/zones`
- `GET /api/v1/zones`
- `GET /api/v1/zones/:id/congestion`
- `POST /api/v1/congestion/analyze`
- `GET /api/v1/analytics`

### 4) Incident Management Service (`incident-service`, port 3004)
**Role:** Incident declaration and operational tracking.  
**Responsibilities:**
- Incident reporting.
- Status transition management (`REPORTED`, `IN_PROGRESS`, `RESOLVED`).
- Event emission to downstream notification workflows.

**Main endpoints/features:**
- `POST /api/v1/incidents`
- `GET /api/v1/incidents`
- `PATCH /api/v1/incidents/:id/status`

### 5) Notification Service (`notification-service`, port 3005)
**Role:** Alert distribution and notification lifecycle.  
**Responsibilities:**
- Notification dispatch and retrieval.
- Read state updates.
- Incident event consumption from internal channel.
- Optional WebSocket gateway scaffolding.

**Main endpoints/features:**
- `POST /api/v1/notifications`
- `GET /api/v1/notifications`
- `GET /api/v1/notifications/me`
- `PATCH /api/v1/notifications/:id/read`
- `POST /api/v1/internal/events/incidents`

### 6) GraphQL Gateway (`api-gateway`, port 4000)
**Role:** Unified API façade over all domain services.  
**Responsibilities:**
- GraphQL schema aggregation.
- Resolver-level service orchestration.
- Centralized security, validation, and error normalization.

**Main endpoint:**
- `http://localhost:4000/graphql`

## Database Design

The platform uses **PostgreSQL** with domain-driven separation: each service owns its schema/database and persists only its bounded context.

### Core Entities
- **Auth Service:** `User`, `RefreshToken`
- **Vehicle Service:** `Vehicle`, `GpsPosition`
- **Traffic Service:** `TrafficZone`, `TrafficSnapshot`
- **Incident Service:** `Incident`
- **Notification Service:** `Notification`

### Main Relations and Data Flow
- `Vehicle → GpsPosition (1:N)`: one Vehicle has many GpsPosition records over time.
- `TrafficZone → TrafficSnapshot (1:N)`: one TrafficZone has many TrafficSnapshot records.
- `Incident` events are relayed to Notification service (logical integration, decoupled persistence).
- `Notification` may reference an `incidentId` to connect alerts with incident workflows.
- Cross-domain data correlation is performed at the API Gateway layer, which composes responses from multiple services without direct database sharing.

This design ensures high cohesion per service, low coupling across domains, and scalability for distributed deployment.
