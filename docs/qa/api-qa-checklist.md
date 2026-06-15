# API QA Checklist

## Health
- [ ] GET /health returns 200
- [ ] GET /health/detailed returns 200

## Auth
- [ ] POST /auth/register creates user
- [ ] POST /auth/login returns token
- [ ] POST /auth/logout invalidates token
- [ ] GET /auth/me returns user
- [ ] Invalid token returns 401
- [ ] Expired token returns 401

## Devices
- [ ] GET /devices lists devices
- [ ] POST /devices creates device
- [ ] GET /devices/:id returns device
- [ ] Invalid ID returns 404

## Rate Limiting
- [ ] 100+ requests/min triggers 429
- [ ] Rate limit headers present

## Error Handling
- [ ] Validation errors return 400
- [ ] Auth errors return 401
- [ ] Not found returns 404
- [ ] Server errors return 500 (logged)

## Content Types
- [ ] Accepts application/json
- [ ] Returns application/json
- [ ] Handles invalid JSON gracefully

## Security
- [ ] CORS enforced
- [ ] Security headers present
- [ ] No stack traces in production
- [ ] Input sanitized
