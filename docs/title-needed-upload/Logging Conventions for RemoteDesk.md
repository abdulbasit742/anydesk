# Logging Conventions for RemoteDesk

This document establishes standardized logging conventions for the RemoteDesk project. Consistent logging is essential for monitoring application health, debugging issues, auditing events, and understanding system behavior across all components (API, Web, Desktop, Shared).

## General Principles

*   **Contextual Information:** Logs should always include sufficient context to understand the event, such as user ID, session ID, request ID, module, function, and relevant data.
*   **Structured Logging:** Prefer structured logging (e.g., JSON format) over plain text. This makes logs easier to parse, query, and analyze with log management systems.
*   **Appropriate Log Levels:** Use log levels consistently to categorize the severity and importance of messages.
*   **Avoid Sensitive Data:** Never log sensitive information (e.g., passwords, API keys, personal identifiable information) without proper redaction or encryption.
*   **Performance:** Logging should have minimal impact on application performance.
*   **Centralized Logging:** All logs should be directed to a centralized log management system (e.g., ELK Stack, Datadog, Splunk).

## Log Levels

We will adhere to standard log levels:

| Level | Description | Usage |
| :--- | :--- | :--- |
| **FATAL** | Critical errors that cause application termination or severe data loss. Immediate attention required. | Application crash, unrecoverable database error. |
| **ERROR** | Runtime errors that prevent some functionality from working correctly, but the application can continue. | Failed API request, unhandled exception, database connection error. |
| **WARN** | Potentially harmful situations or unexpected events that are not errors. | Deprecated API usage, resource nearing limits, slow operation. |
| **INFO** | General operational messages, significant events, and application lifecycle information. | Application start/stop, user login/logout, successful transaction. |
| **DEBUG** | Detailed information for debugging purposes, typically disabled in production. | Variable values, function entry/exit, detailed flow. |
| **TRACE** | Fine-grained informational events, typically used for deep debugging. | Detailed network requests, every step of an algorithm. |

## Logging Implementation (Example using `winston`)

We will use a logging library like `winston` for Node.js applications (API, Desktop main process) and potentially a lightweight solution for frontend (Web, Desktop renderer process) that forwards to the main process or a central service.

### Backend (`apps/api`, `apps/desktop` main process)

```typescript
// remotedesk/apps/api/src/utils/logger.ts

import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Structured logging
  ),
  transports: [
    new winston.transports.Console(),
    // In production, add transports for centralized logging service (e.g., file, HTTP, cloud-specific)
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),
  ],
  exceptionHandlers: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'rejections.log' })
  ]
});

// Add request-specific context for API logs
export const requestLogger = (req: any, res: any, next: any) => {
  req.logger = logger.child({
    requestId: req.headers['x-request-id'] || Math.random().toString(36).substring(2, 15),
    userId: req.user ? req.user.id : 'anonymous',
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
  });
  next();
};

export default logger;
```

**Usage Example:**

```typescript
// remotedesk/apps/api/src/controllers/userController.ts

import logger from '../utils/logger';

export const getUser = (req: any, res: any) => {
  req.logger.info('Fetching user profile', { userId: req.params.id });
  try {
    // ... logic to fetch user
    logger.debug('User data retrieved successfully');
    res.status(200).json({ user: { id: req.params.id, name: 'Test User' } });
  } catch (error) {
    req.logger.error('Failed to fetch user profile', { userId: req.params.id, error: error.message });
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
```

### Frontend (`apps/web`, `apps/desktop` renderer process)

Frontend logging should be lightweight and primarily focus on user-facing events, errors, and warnings. These logs should be forwarded to the backend or a dedicated client-side error reporting service.

```typescript
// remotedesk/apps/web/src/utils/clientLogger.ts

const clientLogger = {
  info: (message: string, context?: object) => {
    console.info(`[INFO] ${message}`, context);
    // Send to backend or error reporting service
    // sendLogToServer({ level: 'info', message, context });
  },
  warn: (message: string, context?: object) => {
    console.warn(`[WARN] ${message}`, context);
    // sendLogToServer({ level: 'warn', message, context });
  },
  error: (message: string, error?: Error, context?: object) => {
    console.error(`[ERROR] ${message}`, error, context);
    // sendLogToServer({ level: 'error', message, error: error?.message, stack: error?.stack, context });
  },
  // ... other levels
};

export default clientLogger;
```

## Best Practices

*   **Be Specific:** Log specific events rather than generic messages.
*   **Avoid Over-Logging:** Do not log every single detail, as it can create noise and impact performance. Focus on actionable information.
*   **Error Context:** When logging errors, always include the error object itself and any relevant context (e.g., request parameters, user ID).
*   **Redaction:** Implement automatic redaction for sensitive fields in logs.
*   **Asynchronous Logging:** Ensure logging operations are non-blocking to avoid impacting critical application paths.
*   **Alerting:** Configure alerts for `ERROR` and `FATAL` level logs in the centralized logging system.
