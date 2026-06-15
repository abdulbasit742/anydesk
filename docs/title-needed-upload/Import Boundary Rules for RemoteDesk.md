# Import Boundary Rules for RemoteDesk

This document outlines the rules for importing modules across different packages and applications within the RemoteDesk monorepo. Adhering to these rules helps maintain a clear separation of concerns, prevents circular dependencies, and promotes a modular architecture.

## General Principles

1.  **Strict Layering:** Imports should generally flow downwards, from higher-level applications to lower-level shared packages.
2.  **No Circular Dependencies:** No module or package should directly or indirectly import itself or create a circular dependency chain.
3.  **Explicit Dependencies:** All dependencies must be explicitly declared in `package.json` files where applicable.
4.  **Minimize Cross-Boundary Imports:** While necessary, cross-boundary imports should be minimized and carefully considered.

## Specific Rules by Module Type

### `apps/api`

*   **Allowed Imports:**
    *   `packages/shared` (for types, utility functions, and shared protocols)
    *   Node.js built-in modules
    *   Third-party npm packages (declared in `apps/api/package.json`)
*   **Forbidden Imports:**
    *   `apps/web`
    *   `apps/desktop`
    *   Direct imports from other `apps/api` modules that would create circular dependencies.

### `apps/web`

*   **Allowed Imports:**
    *   `packages/shared` (for types, utility functions, and shared UI components)
    *   Third-party npm packages (declared in `apps/web/package.json`)
*   **Forbidden Imports:**
    *   `apps/api` (direct imports; API calls should be made via HTTP client)
    *   `apps/desktop`
    *   Direct imports from other `apps/web` modules that would create circular dependencies.

### `apps/desktop`

*   **Allowed Imports:**
    *   `packages/shared` (for types, utility functions, and shared protocols)
    *   Third-party npm packages (declared in `apps/desktop/package.json`)
    *   Electron-specific modules
*   **Forbidden Imports:**
    *   `apps/api` (direct imports; API calls should be made via HTTP client)
    *   `apps/web`
    *   Direct imports from other `apps/desktop` modules that would create circular dependencies.

### `packages/shared`

*   **Allowed Imports:**
    *   Other modules within `packages/shared` (with careful consideration to avoid circular dependencies)
    *   Third-party npm packages (declared in `packages/shared/package.json`)
*   **Forbidden Imports:**
    *   `apps/api`
    *   `apps/web`
    *   `apps/desktop`
    *   `packages/shared` modules that would create circular dependencies.

## Enforcement

These rules will be enforced through a combination of:

*   **ESLint Rules:** Custom ESLint rules will be developed to detect and prevent forbidden imports.
*   **Dependency Graph Analysis:** Tools will be used to visualize and analyze the dependency graph to identify violations.
*   **Code Reviews:** Peer code reviews will ensure adherence to these guidelines.
*   **Automated Tests:** Boundary tests will be implemented to programmatically check for violations.

## Example of a Forbidden Import

```typescript
// remotedesk/apps/api/src/service.ts

// FORBIDDEN: API should not directly import from the web application
import { WebComponent } from '../../web/src/components/WebComponent';
```

## Example of a Recommended Import

```typescript
// remotedesk/apps/api/src/service.ts

// RECOMMENDED: API can import shared types and utilities
import { RemoteDeskId } from '../../../packages/shared/ids';
```
