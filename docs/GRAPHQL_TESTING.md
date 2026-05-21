# GraphQL Testing Guide

Use the API Gateway GraphQL endpoint:

- URL: `http://localhost:4000/graphql`

## How to run tests manually

1. Start the stack:
   - `docker compose up -d`
2. Open GraphQL Playground (enabled by default in non-prod):
   - `http://localhost:4000/graphql`
3. Copy queries from:
   - `docs/graphql/test-queries.graphql`
4. For protected operations, add auth header:
   - `Authorization: Bearer <access_token>`

## Coverage

The test query set covers:
- Authentication flow (`register`, `login`, `authMe`)
- Traffic read/simulation operations
- Incident declaration/listing
- Notification listing
