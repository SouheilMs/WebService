# 🚦 Urban Traffic Management Platform

A distributed intelligent urban traffic management system built on a **microservices architecture** using NestJS, GraphQL, PostgreSQL, and Docker.

## 📋 Overview

This platform manages urban traffic in real-time through independent, scalable microservices:

| Service              | Port | Status  | Description                          |
|---------------------|------|---------|--------------------------------------|
| **auth-service**    | 3001 | ✅ PR1  | JWT authentication & user management |
| **vehicle-service** | 3002 | ✅ PR2  | Vehicle registration & GPS tracking  |
| traffic-service     | 3003 | 🔜 PR3  | Traffic zones & congestion analysis  |
| incident-service    | 3004 | ✅ PR4  | Incident reporting & management      |
| notification-service| 3005 | ✅ PR4* | Notifications & alerts               |
| **api-gateway**     | 4000 | 🔜 PR6  | GraphQL unified API gateway          |

## 🏗️ Architecture

```
/services
  /auth-service        ← NestJS + Prisma + PostgreSQL
  /vehicle-service     ← NestJS + Prisma + PostgreSQL
  /traffic-service     ← NestJS + Prisma + PostgreSQL
  /incident-service    ← NestJS + Prisma + PostgreSQL
  /notification-service← NestJS + Prisma + PostgreSQL
  /api-gateway         ← NestJS + Apollo GraphQL

/shared                ← Common types, interfaces, enums
/docker                ← SQL init scripts
/docs                  ← Architecture docs, API examples
```

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 20
- Docker & Docker Compose
- npm ≥ 10

### 1. Clone & Configure
```bash
git clone https://github.com/souheil-moussa-22/Web_Service.git
cd Web_Service

# Configure root environment
cp .env.example .env

# Configure auth service
cp services/auth-service/.env.example services/auth-service/.env
# Edit .env and set a strong JWT_SECRET
```

### 2. Start PostgreSQL with Docker
```bash
docker compose up -d postgres
```

### 3. Start Auth Service (Development)
```bash
cd services/auth-service
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

### 4. Access the API
- **REST API:** http://localhost:3001/api/v1
- **Swagger UI:** http://localhost:3001/api/docs

## 🔐 Authentication

### Register
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@traffic.io","username":"admin","password":"Admin@123!","role":"ADMIN"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@traffic.io","password":"Admin@123!"}'
```

## 👥 Roles

| Role       | Permissions                                              |
|-----------|----------------------------------------------------------|
| `ADMIN`   | Full access: user management, all CRUD operations        |
| `OPERATOR`| Limited access: read own resources, report incidents     |

## 🐳 Docker (Full Stack)
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f auth-service

# Stop all
docker compose down
```

## 🧪 Testing
```bash
cd services/auth-service
npm test                  # unit tests
npm run test:cov          # with coverage
```

## 📚 Documentation
- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Examples](docs/API_EXAMPLES.md)
- Swagger UI: http://localhost:3001/api/docs (when running)

## 🛠️ Tech Stack

- **Runtime:** Node.js 20
- **Framework:** NestJS 10
- **Database:** PostgreSQL 16
- **ORM:** Prisma 5
- **Auth:** JWT (passport-jwt)
- **Validation:** class-validator
- **API Docs:** Swagger (OpenAPI 3.0)
- **Containers:** Docker Compose
- **CI/CD:** GitHub Actions

## 📈 Development Roadmap

- [x] **PR1** — Project Foundation & Authentication Service
- [x] **PR2** — Vehicle Management Service & GPS Tracking
- [ ] **PR3** — Traffic Zones & Congestion Detection
- [x] **PR4** — Incident Management Service
- [x] **PR5** — Notification Service
- [ ] **PR6** — GraphQL API Gateway

## 📁 Project Structure (Auth Service)

```
services/auth-service/
├── src/
│   ├── main.ts                    # Bootstrap + Swagger
│   ├── app.module.ts              # Root module
│   ├── prisma/                    # Database connection
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── auth/                      # Authentication module
│   │   ├── auth.controller.ts     # POST /auth/register, /auth/login, GET /auth/me
│   │   ├── auth.service.ts        # Business logic
│   │   ├── auth.module.ts
│   │   ├── dto/                   # Request/Response DTOs
│   │   ├── guards/                # JwtAuthGuard
│   │   └── strategies/            # JwtStrategy (passport)
│   ├── users/                     # User management module
│   │   ├── users.controller.ts    # CRUD endpoints
│   │   ├── users.service.ts       # Business logic
│   │   ├── users.module.ts
│   │   └── dto/                   # CreateUserDto, UpdateUserDto, UserResponseDto
│   └── common/                    # Shared utilities
│       ├── filters/               # HttpExceptionFilter
│       ├── guards/                # RolesGuard
│       ├── decorators/            # @CurrentUser(), @Roles()
│       └── types/                 # JwtPayload, AuthenticatedUser, Role
├── prisma/
│   └── schema.prisma              # User & RefreshToken models
├── Dockerfile                     # Multi-stage production build
├── entrypoint.sh                  # Runs migrations + starts server
└── .env.example                   # Environment variable template
```

---

*Built with ❤️ following SOLID principles and Clean Architecture*
