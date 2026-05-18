# API Gateway (GraphQL)

> **Status:** Placeholder — will be implemented in PR 6

This service acts as the unified entry point for all microservices, providing:
- GraphQL API aggregating all services
- Single authentication point
- Request routing to microservices
- Response composition

## Architecture
- NestJS with Apollo Server (GraphQL)
- JWT authentication passthrough
- Microservice communication via HTTP/TCP
- GraphQL schema federation

## GraphQL Playground
Available at `http://localhost:4000/graphql`
