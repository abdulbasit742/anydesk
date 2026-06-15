# API Versioning Strategy

## Versioning Method
URL-based versioning: `/v1/`, `/v2/`, etc.

## Current Version: v1
All endpoints documented in `apps/api/src/docs/` are v1.

## Compatibility
- Minor changes: backward compatible
- Breaking changes: new version path
- Deprecated endpoints: 6-month sunset period

## Headers
Clients should include:
```
Accept: application/json
X-API-Version: 1
```

## Future Versions
v2 will include:
- GraphQL endpoint
- Batch operations
- Webhook subscriptions
- Improved filtering

## Deprecation
Deprecated endpoints return:
```
Deprecation: true
Sunset: Sat, 31 Dec 2024 00:00:00 GMT
```
