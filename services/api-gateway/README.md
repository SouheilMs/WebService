# API Gateway (GraphQL)

Unified GraphQL entry point for the Urban Traffic Platform.

## Features
- GraphQL schema aggregation for auth, vehicles, traffic, incidents, and notifications
- Centralized JWT authentication and role-based authorization guards
- Global request validation and GraphQL-aware rate limiting
- Request logging middleware
- GraphQL playground enabled by default
- Standardized GraphQL error formatting

## Configuration
Copy `.env.example` to `.env` and configure service URLs and `JWT_SECRET`.

## Run
```bash
cd services/api-gateway
npm install
npm run start:dev
```

## Endpoint
- GraphQL playground: `http://localhost:4000/graphql`
