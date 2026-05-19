# Traffic Service

Traffic analysis microservice for intelligent congestion monitoring.

## Features
- Traffic zone management
- Traffic density calculation
- Congestion detection and classification (`LOW`, `MEDIUM`, `HIGH`)
- Historical analytics service
- Scheduled traffic simulation cycle
- GraphQL + REST integration

## REST Endpoints
- `POST /api/v1/zones` — Create traffic zone
- `GET /api/v1/zones` — List traffic zones
- `GET /api/v1/zones/:id/congestion` — Latest zone congestion
- `POST /api/v1/congestion/analyze` — Analyze congestion for zone
- `GET /api/v1/analytics` — Traffic analytics history
- `POST /api/v1/analytics/simulate` — Trigger simulation run

## GraphQL Operations
- Queries: `trafficZones`, `trafficZone`, `trafficCongestion`, `trafficAnalytics`, `trafficClassificationSummary`
- Mutations: `createTrafficZone`, `analyzeTraffic`, `simulateTrafficCycle`

## Architecture
- NestJS + GraphQL + Swagger
- Prisma + PostgreSQL (`traffic_db`)
- Clean service layer (`TrafficZonesService`, `TrafficAnalyticsService`, `TrafficSimulationService`)
- Reusable algorithms helper for density, detection, classification, and simulation
