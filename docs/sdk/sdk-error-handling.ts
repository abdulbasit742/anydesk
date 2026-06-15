/**
 * SDK Error Handling
 */

export enum RemoteDeskErrorCode {
  AUTH_REQUIRED = "RD_E003",
  PERMISSION_DENIED = "RD_E004",
  RATE_LIMITED = "RD_E005",
  SESSION_NOT_FOUND = "RD_E001",
  DESK_ID_INVALID = "RD_E002",
  NETWORK_ERROR = "RD_E009",
  INTERNAL_ERROR = "RD_E010",
}

export class RemoteDeskError extends Error {
  constructor(
    message: string,
    public code: RemoteDeskErrorCode,
    public statusCode: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "RemoteDeskError";
  }

  /** User-friendly message */
  get userMessage(): string {
    switch (this.code) {
      case RemoteDeskErrorCode.AUTH_REQUIRED:
        return "Please log in to continue.";
      case RemoteDeskErrorCode.PERMISSION_DENIED:
        return "You do not have permission to do this.";
      case RemoteDeskErrorCode.RATE_LIMITED:
        return "Too many requests. Please wait a moment.";
      case RemoteDeskErrorCode.SESSION_NOT_FOUND:
        return "Session not found. Please check the Desk ID.";
      case RemoteDeskErrorCode.DESK_ID_INVALID:
        return "Invalid Desk ID. It should be 9 digits.";
      case RemoteDeskErrorCode.NETWORK_ERROR:
        return "Network error. Please check your connection.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  /** Whether the request should be retried */
  get retryable(): boolean {
    return [
      RemoteDeskErrorCode.RATE_LIMITED,
      RemoteDeskErrorCode.NETWORK_ERROR,
      RemoteDeskErrorCode.INTERNAL_ERROR,
    ].includes(this.code);
  }
}

// Retry logic
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (error instanceof RemoteDeskError && !error.retryable) {
        throw error;
      }
      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, delay * attempt));
      }
    }
  }
  
  throw lastError;
}
