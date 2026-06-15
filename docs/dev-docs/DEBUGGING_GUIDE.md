# Debugging Guide

## Frontend
### React DevTools
- Install browser extension
- Inspect component tree
- Check props and state
- Profile performance

### Console Debugging
```typescript
// Log with context
console.log('[ConnectionManager]', 'Connecting to', deviceId);

// Group related logs
console.group('Session Setup');
console.log('Creating offer...');
console.log('Setting local description...');
console.groupEnd();

// Use table for arrays
console.table(sessions);
```

## Backend
### VS Code Debugging
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Server",
  "runtimeExecutable": "tsx",
  "args": ["api/boot.ts"]
}
```

### Logging
```typescript
import { logger } from '@/lib/logger';

logger.info('Processing request', { requestId, userId });
logger.error('Failed to connect', { error, deviceId });
logger.debug('ICE candidate', { candidate });
```

## WebSocket
### Monitor Events
```typescript
socket.onAny((event, ...args) => {
  console.log(`[Socket] ${event}`, args);
});
```

## Common Issues
### Hot reload not working
- Restart dev server
- Check file watcher limits

### Type errors not showing
- Restart TypeScript server
- Check `tsconfig.json`

### Tests failing
- Check `.env` variables
- Verify database connection
- Check test database name
