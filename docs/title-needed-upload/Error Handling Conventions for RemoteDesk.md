# Error Handling Conventions for RemoteDesk

This document outlines the standardized conventions for error handling across the RemoteDesk project. Consistent error handling is crucial for improving application reliability, providing clear feedback to users, and simplifying debugging and maintenance.

## General Principles

*   **Fail Fast, Fail Loudly (in Development):** During development, unhandled errors should be immediately visible to developers to facilitate quick identification and resolution.
*   **Graceful Degradation (in Production):** In production, applications should strive for graceful degradation, preventing crashes and providing meaningful feedback to users without exposing sensitive information.
*   **Contextual Error Messages:** Error messages should be clear, concise, and provide sufficient context for debugging without revealing internal implementation details to end-users.
*   **Centralized Error Logging:** All errors should be logged to a centralized system for monitoring, analysis, and alerting.
*   **Distinguish Between Operational and Programmer Errors:**
    *   **Operational Errors:** Predictable runtime issues (e.g., network timeouts, invalid user input, file not found). These should be handled gracefully.
    *   **Programmer Errors:** Bugs in the code (e.g., `TypeError`, `ReferenceError`). These indicate a fault in the application logic and should typically lead to application restarts or crash reporting.

## Backend (Node.js/TypeScript API)

### 1. Custom Error Classes

For operational errors, we will use custom error classes that extend `Error` and include additional properties like `statusCode` and `isOperational`. This allows for programmatic handling of different error types.

```typescript
// remotedesk/apps/api/src/utils/appError.ts

class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
```

### 2. Asynchronous Error Handling

For asynchronous routes, we will use a `catchAsync` wrapper to avoid repetitive `try-catch` blocks and centralize error forwarding to the global error handler.

```typescript
// remotedesk/apps/api/src/utils/catchAsync.ts

import { Request, Response, NextFunction } from "express";

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchAsync = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
```

### 3. Global Error Handler

A centralized error handling middleware will catch all errors, format them appropriately, and send a standardized response to the client. It will also log errors to our monitoring system.

```typescript
// remotedesk/apps/api/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // In a real app, we would handle specific errors like DB errors, validation errors etc.
    // For now, a generic production error handler.
    sendErrorProd(err, res);
  }
};

export default errorHandler;
```

### 4. Error Logging

All errors, especially non-operational ones, should be logged using a dedicated logging utility (see `logging-conventions.md`) to a centralized logging service.

## Frontend (Web/Desktop Applications)

### 1. User-Friendly Error Messages

Frontend applications should translate technical errors into user-friendly messages. Avoid displaying raw stack traces or cryptic error codes to the user.

### 2. UI Feedback

Provide clear visual feedback to the user when an error occurs (e.g., toast notifications, error banners, disabled buttons).

### 3. Error Boundaries (React)

For React applications, use Error Boundaries to gracefully handle errors in component trees, preventing the entire application from crashing.

```typescript
// remotedesk/apps/web/src/components/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Log the error to an error reporting service
    // Sentry.captureException(error, { extra: errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h1>Something went wrong.</h1>
          <p>We are working to fix the issue. Please try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 4. Centralized Error Reporting

Integrate with an error reporting service (e.g., Sentry, Bugsnag) to automatically capture and report client-side errors, including stack traces and user context.

## Shared Packages

Shared packages should generally throw standard JavaScript `Error` objects or custom `AppError` instances (if applicable) and let the consuming application handle them. They should not implement their own UI-specific error handling.

## Testing Error Handling

*   **Unit Tests:** Test individual functions and components to ensure they throw or handle errors as expected.
*   **Integration Tests:** Verify that errors propagate correctly through different layers of the application.
*   **End-to-End Tests:** Simulate error conditions (e.g., network failures, invalid input) to ensure the application behaves gracefully from a user perspective.
