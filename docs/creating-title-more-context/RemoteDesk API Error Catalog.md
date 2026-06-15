# RemoteDesk API Error Catalog

This document provides a comprehensive catalog of error codes and messages returned by the RemoteDesk API, along with their descriptions and potential resolutions.

## Error Structure

All API errors will follow a standardized JSON structure:

```json
{
  "code": "ERROR_CODE_ENUM",
  "message": "A human-readable error message.",
  "details": "Optional: More specific details about the error, e.g., validation errors."
}
```

## Error Codes

| Error Code                     | HTTP Status | Description                                                              | Potential Resolution                                                              |
| :----------------------------- | :---------- | :----------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| `UNKNOWN_ERROR`                | 500         | An unexpected server error occurred.                                     | Contact support with the request ID.                                            |
| `INVALID_INPUT`                | 400         | The request payload or parameters are invalid.                           | Review API documentation and ensure request format is correct.                    |
| `UNAUTHORIZED`                 | 401         | Authentication credentials are missing or invalid.                       | Provide a valid authentication token.                                           |
| `FORBIDDEN`                    | 403         | The authenticated user does not have permission to perform this action.  | Check user roles and permissions.                                               |
| `NOT_FOUND`                    | 404         | The requested resource could not be found.                               | Verify the resource ID or endpoint path.                                        |
| `SERVICE_UNAVAILABLE`          | 503         | The service is temporarily unavailable.                                  | Retry the request after a short delay.                                          |
| `INTERNAL_SERVER_ERROR`        | 500         | A generic internal server error.                                         | Contact support.                                                                |
| `DEVICE_NOT_FOUND`             | 404         | The specified device does not exist or is not accessible.                | Verify device ID.                                                               |
| `SESSION_NOT_FOUND`            | 404         | The specified session does not exist or is not accessible.               | Verify session ID.                                                              |
| `AUTH_FAILED`                  | 401         | Authentication failed due to incorrect credentials.                      | Check username/password.                                                        |
| `EMAIL_ALREADY_EXISTS`         | 409         | A user with the provided email already exists.                           | Use a different email or initiate password recovery.                            |
| `INVALID_CREDENTIALS`          | 401         | The provided credentials are not valid.                                  | Re-enter credentials carefully.                                                 |
| `PASSWORD_RESET_FAILED`        | 400         | Password reset request failed (e.g., invalid token).                     | Request a new password reset link.                                              |
| `EMAIL_VERIFICATION_FAILED`    | 400         | Email verification failed (e.g., expired or invalid token).              | Request a new verification email.                                               |
| `WEBRTC_CONNECTION_FAILED`     | 500         | Failed to establish a WebRTC connection.                                 | Check network connectivity and firewall settings.                               |
| `SOCKET_CONNECTION_FAILED`     | 500         | Failed to establish a Socket.IO connection.                              | Check network connectivity and server status.                                   |

## Custom Errors

For specific business logic errors, custom error codes can be defined within the `ErrorCode` enum in `packages/shared/src/types/error.ts`.
