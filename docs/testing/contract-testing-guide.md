# Contract Testing Guide

## Purpose
Contract tests verify that API DTOs, socket events, and data channel formats remain stable across services.

## Types of Contracts
1. **API Schema Contracts** - Zod validators ensure request/response shapes
2. **Socket Event Contracts** - Event names and payload structures
3. **Data Channel Contracts** - WebRTC data channel message formats
4. **Permission Contracts** - Role-based access rules
5. **Error Code Contracts** - Consistent error codes across services

## Running Contract Tests
```bash
# All shared contracts
npm run test --workspace=@remotedesk/shared

# Specific file
vitest run packages/shared/tests/api-contract.test.ts
```

## Adding New Contracts
When adding a new feature:
1. Define the DTO schema in `packages/shared/src/validators.ts`
2. Add socket event to `packages/shared/src/events.ts`
3. Write contract tests before implementation
4. Update this guide

## Contract Versioning
Contracts are versioned implicitly. Breaking changes require:
- Major version bump
- Migration guide
- Backward compatibility layer (if possible)
