# RemoteDesk SCIM Deprovisioning Flow Documentation

## Introduction
This document outlines the System for Cross-domain Identity Management (SCIM) deprovisioning flow within RemoteDesk. Deprovisioning ensures that when a user or group is removed or deactivated in the Identity Provider (IdP), their corresponding access and data in RemoteDesk are appropriately handled, maintaining security and compliance.

## Deprovisioning Scenarios
SCIM deprovisioning in RemoteDesk primarily handles two scenarios:

1.  **User Deactivation:** When a user is suspended or deactivated in the IdP, their RemoteDesk account should be deactivated, preventing further access.
2.  **User Deletion:** When a user is permanently deleted from the IdP, their RemoteDesk account should be deleted, subject to data retention policies.

## User Deprovisioning Flow

### 1. Deactivating a User
When a user is deactivated in the IdP, the IdP sends a `PATCH` or `PUT` request to the user's specific SCIM endpoint (`/scim/v2/Users/{id}`) to update the `active` attribute to `false`.

**Example Request (PATCH /scim/v2/Users/{id}):**
```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "Operations": [
    {
      "op": "replace",
      "path": "active",
      "value": false
    }
  ]
}
```

Upon receiving this request, RemoteDesk will:
-   Mark the user account as inactive.
-   Terminate any active remote sessions for that user.
-   Revoke all access permissions for the user.
-   Retain user data according to the defined data retention policies.
-   Log the deactivation event for auditing purposes.

### 2. Deleting a User
When a user is permanently deleted from the IdP, the IdP sends a `DELETE` request to the user's specific SCIM endpoint (`/scim/v2/Users/{id}`).

**Example Request (DELETE /scim/v2/Users/{id}):**
```
DELETE /scim/v2/Users/USER_ID_FROM_IDP
```

Upon receiving this request, RemoteDesk will:
-   Permanently delete the user account and associated data, subject to data retention and legal hold policies.
-   Log the deletion event for auditing purposes.

## Group Deprovisioning Flow

### 1. Deleting a Group
When a group is deleted from the IdP, the IdP sends a `DELETE` request to the group's specific SCIM endpoint (`/scim/v2/Groups/{id}`).

**Example Request (DELETE /scim/v2/Groups/{id}):**
```
DELETE /scim/v2/Groups/GROUP_ID_FROM_IDP
```

Upon receiving this request, RemoteDesk will:
-   Remove the group and its associated permissions.
-   Update user permissions that were inherited from this group.
-   Log the deletion event for auditing purposes.

## Security Considerations
-   **Authorization:** Ensure that only authorized IdP clients can perform deprovisioning actions.
-   **Audit Trails:** Maintain detailed audit logs of all deprovisioning events, including who initiated the action and when.
-   **Data Retention:** Adhere to organizational and regulatory data retention policies for deleted user data.
-   **Grace Period:** Consider implementing a grace period for user deactivation before permanent deletion to allow for recovery.
-   **Impact Assessment:** Understand the impact of deactivating/deleting users on active sessions, shared resources, and historical data.

## Best Practices
-   **Test Deprovisioning:** Regularly test the deprovisioning flow in a staging environment to ensure it functions as expected.
-   **Monitor SCIM Logs:** Monitor SCIM logs for any errors or failed deprovisioning attempts.
-   **Communicate Changes:** Inform users and administrators about the deprovisioning process and its implications.
