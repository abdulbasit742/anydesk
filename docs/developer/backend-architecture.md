# Backend Architecture

## Overview
The API is an Express application with Socket.IO for real-time communication.

## Layers
```
HTTP Request
  -> Middleware (auth, rate limit, logging)
    -> Router (auth, devices, sessions, billing, admin)
      -> Service (business logic)
        -> Prisma (database access)
          -> PostgreSQL
```

## Authentication
- JWT tokens (7-day expiry)
- Bearer token in Authorization header
- Socket auth via handshake auth

## Middleware Stack
1. **Helmet** - Security headers
2. **CORS** - Cross-origin config
3. **JSON parser** - Request body parsing
4. **Request logger** - Access logging
5. **Rate limiter** - Request throttling
6. **Auth** - JWT verification
7. **Role check** - RBAC enforcement

## Database Schema
See `apps/api/prisma/schema.prisma`

Key entities:
- User (accounts)
- Session (auth tokens)
- Organization (teams)
- Device (registered computers)
- Policy (org policies)
- AuditLog (activity log)

## Socket.IO Events
See `packages/shared/src/events.ts` for event catalog.

## Error Handling
All errors go through `errorHandler` middleware.
Standard error response:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable",
    "details": {}
  }
}
```
