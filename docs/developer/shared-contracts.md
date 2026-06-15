# Shared Contracts

## Package: @remotedesk/shared
Located in `packages/shared/`

## Contents
- **Types** (`types.ts`): All DTOs and interfaces
- **Validators** (`validators.ts`): Zod schemas
- **Events** (`events.ts`): Socket and webhook event names
- **Constants** (`constants.ts`): App constants and limits

## Usage
```typescript
import { LoginSchema, SocketEvents, type UserDTO } from "@remotedesk/shared";

// Validate input
const result = LoginSchema.safeParse({ email, password });

// Use event name
socket.emit(SocketEvents.SESSION_REQUEST, payload);
```

## Adding New Contracts
1. Add type to `types.ts`
2. Add validator to `validators.ts`
3. Add event to `events.ts` (if applicable)
4. Write contract test
5. Export from `index.ts`

## Versioning
Shared package version bumps with API changes.
Breaking changes = major version bump.
