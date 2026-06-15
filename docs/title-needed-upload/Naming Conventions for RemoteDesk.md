# Naming Conventions for RemoteDesk

This document establishes consistent naming conventions across the RemoteDesk project. Adhering to these conventions improves code readability, maintainability, and reduces cognitive load for developers working on different parts of the system.

## General Principles

*   **Clarity and Readability:** Names should be clear, descriptive, and easy to understand. Avoid abbreviations unless they are universally recognized within the domain.
*   **Consistency:** Maintain a consistent naming style across similar constructs (e.g., all interfaces should follow the same pattern).
*   **Contextual:** Names should reflect the purpose and context of the entity they represent.
*   **Avoid Ambiguity:** Choose names that are unambiguous and do not lead to confusion.

## Specific Naming Conventions

### 1. Files and Folders

| Type | Convention | Example |
| :--- | :--- | :--- |
| **Source Files (.ts, .tsx)** | `kebab-case` for filenames. If a file exports a single default component or utility, the filename should match the export name. | `user-profile.tsx`, `api-client.ts`, `remote-session-manager.ts` |
| **Component Folders** | `kebab-case` for folders containing components. | `user-settings/`, `remote-viewer/` |
| **Utility Folders** | `kebab-case` for folders containing related utility functions. | `utils/`, `helpers/`, `constants/` |
| **Documentation Files (.md)** | `kebab-case` | `naming-conventions.md`, `module-ownership-backend.md` |

### 2. TypeScript/JavaScript

| Type | Convention | Example |
| :--- | :--- | :--- |
| **Variables (let, const)** | `camelCase` | `userName`, `sessionDuration`, `isConnected` |
| **Functions/Methods** | `camelCase` | `getUserProfile()`, `startSession()`, `handleError()` |
| **Classes** | `PascalCase` | `UserSession`, `RemoteDesktopClient`, `ApiError` |
| **Interfaces** | `PascalCase` (often prefixed with `I` for clarity, though not strictly enforced if context is clear) | `IUser`, `ISessionData`, `RemoteDeskConfig` |
| **Types (Type Aliases)** | `PascalCase` | `SessionId`, `ConnectionStatus`, `RemoteInputEvent` |
| **Enums** | `PascalCase` for enum name, `PascalCase` for members | `ConnectionState.Connected`, `SessionType.Host` |
| **Constants (global/module-level)** | `SCREAMING_SNAKE_CASE` | `MAX_SESSION_TIMEOUT`, `DEFAULT_PORT` |
| **React Components** | `PascalCase` | `UserProfile`, `RemoteViewer`, `SessionToolbar` |
| **React Hooks** | `camelCase` (must start with `use`) | `useSessionState()`, `useRemoteInput()` |

### 3. CSS/Tailwind Classes

*   **Utility Classes:** Use Tailwind CSS utility classes directly.
*   **Custom Classes:** `kebab-case` for any custom CSS classes. | `.` `btn-primary`, `.card-header` |

### 4. API Endpoints

*   **Resources:** `kebab-case` for resource names, plural. | `/users`, `/sessions`, `/devices` |
*   **Actions:** Use HTTP verbs (GET, POST, PUT, DELETE) to describe actions. | `GET /users/{id}`, `POST /sessions` |

### 5. Database (Prisma Schema)

*   **Models:** `PascalCase` (singular) | `User`, `Session`, `Device` |
*   **Fields:** `camelCase` | `createdAt`, `updatedAt`, `sessionId` |
*   **Enums:** `PascalCase` for enum name, `SCREAMING_SNAKE_CASE` for members | `Role.ADMIN`, `Status.ACTIVE` |

## Review and Enforcement

These conventions will be enforced through:

*   **Code Reviews:** Peer reviews will check for adherence to naming conventions.
*   **ESLint Rules:** Custom ESLint rules may be implemented for specific naming patterns where possible.
*   **Automated Checks:** Tools like Prettier will handle formatting, indirectly supporting consistency.
