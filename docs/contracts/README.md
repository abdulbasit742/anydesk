# Contract Finalization

## Overview
All data contracts are defined using Zod schemas for runtime validation.

## Structure
- `contracts/api-dto.ts` - REST API DTOs
- `contracts/socket-dto.ts` - Socket.IO event DTOs
- `contracts/web-dto.ts` - Web dashboard DTOs
- `contracts/desktop-dto.ts` - Desktop app DTOs

## Validation
Every DTO has:
- Strict type validation
- Length limits on strings
- Range limits on numbers
- Email format validation
- UUID format where applicable

## Usage
```typescript
import { LoginRequestSchema } from '@remotedesk/contracts';

// Validate input
const result = LoginRequestSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ errors: result.error.errors });
}
```

## Adding New DTOs
1. Define schema with Zod
2. Export type inference
3. Add validation tests
4. Update this README
