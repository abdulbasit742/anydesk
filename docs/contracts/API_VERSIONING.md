# API Versioning

## Strategy
URL-based versioning: `/api/v1/...`

## Current Version: v1
All endpoints under `/api/v1/`

## Deprecation Policy
- 6-month deprecation notice
- Sunset header in responses
- Migration guide published

## Breaking Changes
Breaking changes trigger a new version.
Non-breaking changes (additive) stay on current version.

## Examples
```
GET /api/v1/devices
POST /api/v1/sessions
GET /api/v1/admin/users
```

## Headers
- `Accept: application/json`
- `X-Correlation-ID: {id}`

## Response Format
```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "cid-xxx",
    "timestamp": "2026-01-01T00:00:00Z"
  }
}
```
