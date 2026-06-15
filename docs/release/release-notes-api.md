# Release Notes API

## Endpoints
```
GET /v1/releases - List all releases
GET /v1/releases/latest - Get latest release
GET /v1/releases/:version - Get specific release
```

## Response
```json
{
  "version": "2.3.1",
  "date": "2026-06-12",
  "changes": [
    { "type": "fixed", "description": "Connection timeout issue" },
    { "type": "security", "description": "Updated dependencies" }
  ]
}
```
