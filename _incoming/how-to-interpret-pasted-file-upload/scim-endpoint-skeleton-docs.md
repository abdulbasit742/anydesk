# RemoteDesk SCIM Endpoint Skeleton Documentation

## Introduction
This document provides a skeleton overview of the SCIM (System for Cross-domain Identity Management) endpoints implemented by RemoteDesk. It serves as a quick reference for integrators looking to provision and deprovision users and groups programmatically.

## Base URL
All SCIM 2.0 endpoints are accessible under the following base URL:

`https://api.remotedesk.com/scim/v2` (Production)
`https://api.staging.remotedesk.com/scim/v2` (Staging)

## Authentication
Authentication to the SCIM API is performed using OAuth 2.0 Bearer Tokens. An access token must be included in the `Authorization` header of every request.

`Authorization: Bearer <ACCESS_TOKEN>`

## Endpoints

### 1. Service Provider Configuration
-   **Path:** `/ServiceProviderConfig`
-   **Method:** `GET`
-   **Description:** Retrieves information about the SCIM capabilities and features supported by RemoteDesk.
-   **Response:** A JSON object conforming to the `urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig` schema.

### 2. Schemas
-   **Path:** `/Schemas`
-   **Method:** `GET`
-   **Description:** Retrieves the attribute schemas supported by RemoteDesk for users and groups.
-   **Response:** A JSON object containing an array of schema definitions.

### 3. Users
-   **Path:** `/Users`
-   **Method:** `GET`
    -   **Description:** Retrieves a list of users. Supports filtering, pagination, and sorting.
    -   **Query Parameters:** `filter`, `startIndex`, `count`, `sortBy`, `sortOrder`, `attributes`, `excludedAttributes`.
-   **Method:** `POST`
    -   **Description:** Creates a new user.
    -   **Request Body:** A JSON object conforming to the `urn:ietf:params:scim:schemas:core:2.0:User` schema.
    -   **Response:** The created user resource.

### 4. User by ID
-   **Path:** `/Users/{id}`
-   **Method:** `GET`
    -   **Description:** Retrieves a specific user by their SCIM `id`.
-   **Method:** `PUT`
    -   **Description:** Replaces an existing user resource with a new one.
    -   **Request Body:** A JSON object conforming to the `urn:ietf:params:scim:schemas:core:2.0:User` schema.
-   **Method:** `PATCH`
    -   **Description:** Updates specific attributes of an existing user using JSON Patch operations.
    -   **Request Body:** A JSON object conforming to the `urn:ietf:params:scim:schemas:core:2.0:PatchOp` schema.
-   **Method:** `DELETE`
    -   **Description:** Deletes a user resource.

### 5. Groups
-   **Path:** `/Groups`
-   **Method:** `GET`
    -   **Description:** Retrieves a list of groups. Supports filtering, pagination, and sorting.
    -   **Query Parameters:** `filter`, `startIndex`, `count`, `sortBy`, `sortOrder`, `attributes`, `excludedAttributes`.
-   **Method:** `POST`
    -   **Description:** Creates a new group.
    -   **Request Body:** A JSON object conforming to the `urn:ietf:params:scim:schemas:core:2.0:Group` schema.
    -   **Response:** The created group resource.

### 6. Group by ID
-   **Path:** `/Groups/{id}`
-   **Method:** `GET`
    -   **Description:** Retrieves a specific group by their SCIM `id`.
-   **Method:** `PUT`
    -   **Description:** Replaces an existing group resource with a new one.
    -   **Request Body:** A JSON object conforming to the `urn:ietf:params:scim:schemas:core:2.0:Group` schema.
-   **Method:** `PATCH`
    -   **Description:** Updates specific attributes of an existing group using JSON Patch operations.
    -   **Request Body:** A JSON object conforming to the `urn:ietf:params:scim:schemas:core:2.0:PatchOp` schema.
-   **Method:** `DELETE`
    -   **Description:** Deletes a group resource.

## Error Handling
RemoteDesk SCIM API adheres to the SCIM 2.0 Protocol for error reporting. Common error responses include:
-   `400 Bad Request`: Invalid syntax or unsupported operation.
-   `401 Unauthorized`: Missing or invalid authentication token.
-   `403 Forbidden`: Insufficient permissions.
-   `404 Not Found`: Resource not found.
-   `409 Conflict`: Resource already exists or conflicting operation.
-   `500 Internal Server Error`: Unexpected server error.

## Best Practices
-   Always use HTTPS.
-   Validate all inputs.
-   Handle pagination for large result sets.
-   Implement robust error handling and retry mechanisms.
-   Monitor SCIM API calls for auditing and troubleshooting.
