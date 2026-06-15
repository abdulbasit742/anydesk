# Knowledge Base: Admin Issues

This article provides troubleshooting steps and solutions for common administrative issues encountered by RemoteDesk administrators. It is intended to help administrators manage their organizations, users, and security settings effectively.

## 1. User Management Issues

**Symptom:** Administrators are unable to add, modify, or delete users within their organization.

**Potential Causes and Solutions:**

*   **Insufficient Permissions:** The administrator attempting the action might not have the necessary permissions (e.g., only Super Admins can delete other admins).
    *   *Solution:* Verify the administrator's role and permissions. If necessary, log in with a Super Admin account to perform the action or adjust permissions.
*   **Account Limits Reached:** The organization might have reached its licensed limit for the number of active users.
    *   *Solution:* Check the subscription details and current user count. Upgrade the subscription if more user seats are needed, or deactivate inactive users.
*   **User Already Exists:** Attempting to add a user with an email address that is already registered within the organization or globally.
    *   *Solution:* Search for the existing user. If they are inactive, reactivate them. If they belong to another organization, they cannot be added to the current one.
*   **System Errors:** Transient issues with the user management API.
    *   *Solution:* Try again after a few minutes. If the issue persists, check the API logs for specific error messages.

## 2. Security Policy Configuration Problems

**Symptom:** Administrators are unable to apply or modify security policies (e.g., MFA requirements, session timeouts, IP restrictions).

**Potential Causes and Solutions:**

*   **Permission Restrictions:** Only administrators with specific security management roles can alter security policies.
    *   *Solution:* Ensure the administrator has the correct role. Refer to the `admin-safety-guide.md` for role-based access control details.
*   **Conflicting Policies:** Attempting to apply a new policy that conflicts with an existing, higher-priority policy.
    *   *Solution:* Review the hierarchy and precedence of security policies. Resolve any conflicts before applying the new policy.
*   **Invalid Configuration:** Incorrect syntax or values in the policy configuration.
    *   *Solution:* Double-check the policy settings against the documentation. The system should provide validation errors for invalid inputs.

## 3. Audit Log Access and Interpretation

**Symptom:** Administrators have difficulty accessing audit logs or understanding the events recorded.

**Potential Causes and Solutions:**

*   **Log Retention Limits:** Audit logs might be automatically purged after a certain period based on subscription or policy.
    *   *Solution:* Check the log retention policy. If older logs are needed, ensure they are exported regularly. Refer to `audit-correlation-guide.md`.
*   **Filtering/Search Issues:** Inability to find specific events due to incorrect search queries or filters.
    *   *Solution:* Provide guidance on effective use of audit log filters and search functionalities. Ensure correct date ranges are selected.
*   **Lack of Context:** Log entries might lack sufficient detail to understand the full context of an event.
    *   *Solution:* Suggest cross-referencing with other system logs or security event timelines. Provide training on interpreting log data.

## 4. Unattended Access Configuration Issues

**Symptom:** Unattended access fails to work as expected on remote devices.

**Potential Causes and Solutions:**

*   **Incorrect Password/PIN:** The unattended access password or PIN is incorrect or has expired.
    *   *Solution:* Verify and reset the unattended access password. Ensure the `unattended-access-warning-guide.md` has been reviewed.
*   **Host Device Offline/Asleep:** The remote device is not powered on, is in sleep mode, or has lost network connectivity.
    *   *Solution:* Confirm the device is online and configured to prevent sleep. Check `kb-common-connection-issues.md`.
*   **OS Security Settings:** Operating system security settings (e.g., UAC, firewall, specific macOS/Windows permissions) are blocking unattended access.
    *   *Solution:* Guide the user through configuring necessary OS permissions for RemoteDesk. This often requires local administrative privileges on the host device.
*   **RemoteDesk Service Not Running:** The RemoteDesk background service responsible for unattended access might not be running.
    *   *Solution:* Check the status of the RemoteDesk service on the host device and restart it if necessary.

## Diagnostic Information Required for Support

If the issue persists, please gather the following information:

1.  **Admin User ID/Email:** The administrator's account details.
2.  **Organization ID:** The ID of the organization experiencing the issue.
3.  **Date/Time of Issue:** When the administrative issue occurred.
4.  **Specific Action:** What action was being attempted (e.g., adding user, changing policy).
5.  **Error Messages:** Any specific error messages displayed in the admin panel or logs.
6.  **Relevant User IDs/Device IDs:** If the issue pertains to a specific user or device.
7.  **Application Logs:** If possible, export relevant application logs (refer to `support-diagnostics-guide.md`).
