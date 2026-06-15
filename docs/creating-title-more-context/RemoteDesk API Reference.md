# RemoteDesk API Reference

This document provides a comprehensive reference for the RemoteDesk Backend API, detailing all available endpoints, request/response formats, authentication requirements, and error codes.

## Base URL

`https://api.remotedesk.com/api/v1` (Production)
`http://localhost:3000/api/v1` (Development)

## Authentication

All API endpoints require authentication using a Bearer Token in the `Authorization` header.

`Authorization: Bearer <YOUR_JWT_TOKEN>`

## Endpoints

### 1. User Management

#### `POST /auth/login`

-   **Description:** Authenticates a user and returns a JWT token.
-   **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
-   **Response (Success 200):**
    ```json
    {
      "token": "string",
      "user": {
        "id": "string",
        "email": "string"
      }
    }
    ```
-   **Response (Error 401):** `AUTH_FAILED`, `INVALID_CREDENTIALS`

#### `POST /auth/signup`

-   **Description:** Registers a new user.
-   **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
-   **Response (Success 201):**
    ```json
    {
      "message": "User registered successfully. Please verify your email."
    }
    ```
-   **Response (Error 409):** `EMAIL_ALREADY_EXISTS`

#### `GET /auth/profile`

-   **Description:** Retrieves the authenticated user's profile.
-   **Response (Success 200):**
    ```json
    {
      "id": "string",
      "email": "string",
      "createdAt": "datetime"
    }
    ```

### 2. Device Management

#### `GET /devices`

-   **Description:** Retrieves a list of devices registered to the authenticated user.
-   **Response (Success 200):**
    ```json
    [
      {
        "id": "string",
        "name": "string",
        "lastSeen": "datetime",
        "isOnline": "boolean",
        "isTrusted": "boolean"
      }
    ]
    ```

#### `PUT /devices/:id`

-   **Description:** Updates a device's information (e.g., name, trust status).
-   **Request Body:**
    ```json
    {
      "name": "string",
      "isTrusted": "boolean"
    }
    ```
-   **Response (Success 200):** Updated device object.
-   **Response (Error 404):** `DEVICE_NOT_FOUND`

### 3. Session Management

#### `GET /sessions`

-   **Description:** Retrieves a list of remote sessions for the authenticated user.
-   **Query Parameters:**
    -   `startDate`: Filter sessions starting after this date.
    -   `endDate`: Filter sessions ending before this date.
    -   `deviceId`: Filter sessions by a specific device.
-   **Response (Success 200):**
    ```json
    [
      {
        "id": "string",
        "deviceId": "string",
        "startTime": "datetime",
        "endTime": "datetime",
        "duration": "number",
        "status": "active" | "ended" | "disconnected"
      }
    ]
    ```

#### `GET /sessions/:id/audit`

-   **Description:** Retrieves the audit trail for a specific session.
-   **Response (Success 200):**
    ```json
    [
      {
        "id": "string",
        "sessionId": "string",
        "event": "string",
        "timestamp": "datetime",
        "details": "object"
      }
    ]
    ```

## Error Codes

Refer to the [API Error Catalog](error-catalog.md) for a complete list of error codes and their meanings.
