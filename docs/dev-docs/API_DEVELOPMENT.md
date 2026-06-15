# API Development Guide

## Adding a New Endpoint

### 1. Define DTO
```typescript
// contracts/api-dto.ts
export const MyRequestSchema = z.object({
  field: z.string().min(1),
});

export type MyRequest = z.infer<typeof MyRequestSchema>;
```

### 2. Create Router
```typescript
// api/routers/my-module.ts
import { router, authedProcedure } from './base';

export const myModuleRouter = router({
  myEndpoint: authedProcedure
    .input(MyRequestSchema)
    .query(async ({ ctx, input }) => {
      return { data: input.field };
    }),
});
```

### 3. Register Router
```typescript
// api/routers/index.ts
import { myModuleRouter } from './my-module';

export const appRouter = router({
  // ... existing routers
  myModule: myModuleRouter,
});
```

### 4. Frontend Hook
```typescript
// src/hooks/useMyModule.ts
import { trpc } from '@/providers/trpc';

export function useMyModule() {
  return trpc.myModule.myEndpoint.useQuery({ field: 'test' });
}
```

## Error Handling
```typescript
.myEndpoint: authedProcedure
  .input(MyRequestSchema)
  .query(async ({ ctx, input }) => {
    try {
      return await service.process(input);
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Processing failed',
        cause: error,
      });
    }
  }),
```

## Middleware
```typescript
const rateLimit = t.middleware(async ({ ctx, next }) => {
  // Check rate limit
  await checkRateLimit(ctx.userId);
  return next();
});

export const rateLimitedProcedure = t.procedure.use(rateLimit);
```

## Testing
```typescript
describe('myModuleRouter', () => {
  it('should process valid input', async () => {
    const caller = appRouter.createCaller({ user: mockUser });
    const result = await caller.myModule.myEndpoint({ field: 'test' });
    expect(result.data).toBe('test');
  });
});
```
