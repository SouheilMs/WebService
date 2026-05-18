# Postman / API Testing Examples

## Auth Service (http://localhost:3001)

### Register a new user
```http
POST http://localhost:3001/api/v1/auth/register
Content-Type: application/json

{
  "email": "admin@traffic.io",
  "username": "admin",
  "password": "Admin@123!",
  "role": "ADMIN"
}
```

### Login
```http
POST http://localhost:3001/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@traffic.io",
  "password": "Admin@123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 604800,
  "user": {
    "id": "uuid-...",
    "email": "admin@traffic.io",
    "username": "admin",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2024-01-15T08:30:00.000Z",
    "updatedAt": "2024-01-15T08:30:00.000Z"
  }
}
```

### Get current user profile
```http
GET http://localhost:3001/api/v1/auth/me
Authorization: Bearer <access_token>
```

### List all users (ADMIN only)
```http
GET http://localhost:3001/api/v1/users
Authorization: Bearer <admin_token>
```

### Create user (ADMIN only)
```http
POST http://localhost:3001/api/v1/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "email": "operator@traffic.io",
  "username": "operator1",
  "password": "Operator@123!",
  "role": "OPERATOR"
}
```

### Get user by ID (ADMIN only)
```http
GET http://localhost:3001/api/v1/users/<user-uuid>
Authorization: Bearer <admin_token>
```

### Update user (ADMIN only)
```http
PATCH http://localhost:3001/api/v1/users/<user-uuid>
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "username": "operator_updated"
}
```

### Delete (deactivate) user (ADMIN only)
```http
DELETE http://localhost:3001/api/v1/users/<user-uuid>
Authorization: Bearer <admin_token>
```

## Swagger UI
- Auth Service: http://localhost:3001/api/docs
