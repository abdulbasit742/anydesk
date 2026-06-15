# Developer FAQ

## General

### How do I add a new page?
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add nav link if needed

### How do I add a new API endpoint?
See [API Development Guide](API_DEVELOPMENT.md).

### How do I add a database table?
1. Add schema in `db/schema.ts`
2. Run `npm run db:generate`
3. Run `npm run db:migrate`
4. Add query functions

### How do I add a Socket event?
See [WebSocket Development](WEBSOCKET_DEVELOPMENT.md).

## Testing

### How do I mock tRPC?
```typescript
const mockTrpc = {
  useQuery: () => ({ data: [], isLoading: false }),
};
```

### How do I test WebSocket events?
Use the `createMockSocket()` helper.

### How do I run a single test?
```bash
npx vitest run src/path/to/test.test.ts
```

## Deployment

### How do I deploy to staging?
```bash
git push origin develop
# CI handles the rest
```

### How do I rollback?
```bash
git revert HEAD
git push origin main
```

## Best Practices

### Should I use interface or type?
Interface for objects that extend, type for unions.

### Where do I put shared types?
`packages/shared/src/types/`

### How do I handle errors?
Use the error system with proper error codes.

### How do I add a feature flag?
Add to env vars and check with `isFeatureEnabled()`.
