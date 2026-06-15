# RemoteDesk API Debug Logging Guide

This guide provides instructions on how to enable and configure debug logging for the RemoteDesk API service. Effective logging is crucial for troubleshooting issues, monitoring application behavior, and understanding the flow of requests and data within the API.

## 1. Overview of API Logging

The RemoteDesk API, built with Express and Socket.IO, typically uses a logging library (e.g., Winston, Pino, or a simple console logger) to output information about its operations. Debug logging provides more verbose output, including detailed request/response information, database queries, and internal process states.

## 2. Configuring Logging Levels

Logging levels allow you to control the verbosity of the logs. Common levels include:

*   **error**: Critical errors that prevent the application from functioning.
*   **warn**: Potentially problematic situations.
*   **info**: General application flow and significant events.
*   **debug**: Detailed information useful for debugging, including variable values and function calls.
*   **verbose**: Even more granular details, often including raw data.

### 2.1 Environment Variable Control

The most common way to control logging levels in a Node.js application is through environment variables. For example, a `LOG_LEVEL` environment variable can be used.

```ini
# apps/api/.env
LOG_LEVEL=debug
```

Your API application code would then read this variable and configure the logger accordingly:

```typescript
// Example: apps/api/src/config/logger.ts
import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),
  ],
});

export default logger;
```

### 2.2 Express Request Logging

For HTTP requests, you can use middleware like `morgan` to log incoming requests and their details.

```typescript
// Example: apps/api/src/app.ts
import express from 'express';
import morgan from 'morgan';
import logger from './config/logger';

const app = express();

// Use morgan for HTTP request logging
// 'dev' format is concise, 'combined' is Apache standard, or define custom format
app.use(morgan('dev', { stream: { write: (message) => logger.http(message.trim()) } }));

// ... other middleware and routes
```

## 3. Socket.IO Debug Logging

Socket.IO has its own debugging mechanism that can be enabled using the `DEBUG` environment variable.

```ini
# apps/api/.env
DEBUG=socket.io:*,engine:* # Logs all Socket.IO and Engine.IO events
```

To enable specific parts of Socket.IO debugging, you can use more granular values:

*   `socket.io:server`: Server-side events.
*   `socket.io:client`: Client-side events (if running a Socket.IO client within the API).
*   `engine:socket`: Low-level Engine.IO socket events.
*   `*`: All debug output (can be very verbose).

When `DEBUG` is set, Socket.IO will print detailed logs to `stderr` (which usually goes to your console).

## 4. Prisma Query Logging

For debugging database interactions, Prisma allows you to log all executed queries.

```typescript
// Example: apps/api/src/db/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Params: ' + e.params);
  console.log('Duration: ' + e.duration + 'ms');
});

prisma.$on('error', (e) => {
  console.error('Prisma Error:', e);
});

export default prisma;
```

To enable query logging, ensure your `apps/api/.env` file does not override the `LOG_LEVEL` to something that would suppress `info` or `debug` if your logger is configured to capture these events.

## 5. Collecting Logs

During local development, logs are typically output to the console. For more persistent storage or analysis, consider:

*   **Redirecting output**: `npm run dev > api.log 2>&1`
*   **Log files**: Configure your logger (e.g., Winston transports) to write to files.
*   **Log management systems**: For production, integrate with centralized log management solutions (e.g., ELK stack, Datadog, Splunk).

## 6. Best Practices

*   **Avoid sensitive data in logs**: Never log passwords, API keys, or other highly sensitive information.
*   **Contextual logging**: Include relevant context (e.g., user ID, request ID) in your log messages to make them easier to trace.
*   **Structured logging**: Use JSON format for logs to facilitate parsing and analysis by log management tools.
*   **Performance**: Be mindful of the performance impact of excessive debug logging in production environments.

---

**Author**: Manus AI
**Date**: June 12, 2026
