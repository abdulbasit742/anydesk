# API Style Guide

## REST Endpoints
- Use plural nouns: `/devices`, `/sessions`
- Use kebab-case: `/org-members`
- Nested resources: `/organizations/:id/members`

## HTTP Methods
| Method | Usage |
|--------|-------|
| GET | Read |
| POST | Create |
| PUT | Full update |
| PATCH | Partial update |
| DELETE | Remove |

## Response Format
```json
{
  "data": { ... },
  "meta": { "page": 1, "limit": 20 }
}
```

## Error Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

## Naming
- Query params: camelCase
- JSON keys: camelCase
- Database columns: snake_case
- Environment variables: UPPER_SNAKE_CASE
