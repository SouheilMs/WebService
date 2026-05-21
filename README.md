# 🚦 Urban Traffic Management Platform

Distributed urban-traffic platform built with NestJS microservices, GraphQL API Gateway, PostgreSQL, Prisma, and Docker.

## ✅ Platform Finalization (PR6)

This repository now includes:
- improved project documentation,
- UML architecture diagrams,
- Postman collection,
- GraphQL test query suite,
- production Docker compose override,
- CI/CD pipeline for all services,
- additional unit tests,
- health-check endpoints for every service,
- frontend admin dashboard structure with traffic map placeholder,
- gateway architecture/performance cleanup.

## 🧩 Services

| Service | Port | Main Role |
|---|---:|---|
| auth-service | 3001 | Authentication & users |
| vehicle-service | 3002 | Vehicle management & tracking |
| traffic-service | 3003 | Zones, congestion analysis, simulation |
| incident-service | 3004 | Incident declaration and lifecycle |
| notification-service | 3005 | Notification delivery + websocket hook |
| api-gateway | 4000 | Unified GraphQL BFF |

## 🏗️ Architecture

- API Gateway exposes GraphQL operations and orchestrates all domain services.
- Each service owns its own Prisma schema and database namespace.
- Incident workflow emits events to notification-service.
- Health checks are available for observability and container orchestration.

Architecture docs:
- `docs/ARCHITECTURE.md`
- `docs/UML_DIAGRAMS.md`

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- Docker + Docker Compose

### 1) Install dependencies

```bash
npm ci
```

### 2) Configure environment

```bash
cp .env.example .env
cp services/auth-service/.env.example services/auth-service/.env
cp services/vehicle-service/.env.example services/vehicle-service/.env
cp services/traffic-service/.env.example services/traffic-service/.env
cp services/incident-service/.env.example services/incident-service/.env
cp services/notification-service/.env.example services/notification-service/.env
cp services/api-gateway/.env.example services/api-gateway/.env
```

### 3) Run with Docker

```bash
docker compose up -d
```

### 4) Production profile

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🩺 Health Checks

- Auth: `http://localhost:3001/api/v1/health`
- Vehicle: `http://localhost:3002/api/v1/health`
- Traffic: `http://localhost:3003/api/v1/health`
- Incident: `http://localhost:3004/api/v1/health`
- Notification: `http://localhost:3005/api/v1/health`
- Gateway: `http://localhost:4000/health`

## 🧪 Testing

### Local validation per service

```bash
cd services/<service-name>
npm run lint
npm run build
npm test -- --passWithNoTests
```

### CI/CD

GitHub Actions workflow:
- `.github/workflows/ci-platform.yml`

Pipeline includes:
- matrix lint/build/test for all six services,
- Prisma generation for Prisma-based services,
- Docker image build stage on push to `main`.

## 📚 API Testing Assets

- Postman collection: `docs/postman/Urban_Traffic_Platform.postman_collection.json`
- GraphQL test queries: `docs/graphql/test-queries.graphql`
- GraphQL testing guide: `docs/GRAPHQL_TESTING.md`
- REST examples: `docs/API_EXAMPLES.md`

## 🖥️ Frontend Dashboard (Structure)

A lightweight dashboard scaffold is available in:
- `frontend/dashboard/`

Includes:
- KPI card layout,
- interactive traffic map placeholder structure,
- real-time feed panel hook for WebSocket/live congestion updates.

## 🔒 Tech Stack

- NestJS 10
- Apollo GraphQL
- Prisma ORM
- PostgreSQL 16
- Docker Compose
- GitHub Actions

---

Built for scalable, observable, and production-ready urban traffic operations.
