# Web UX: Error State Copy Catalog

Error states in the web application occur when a request fails, a page cannot be found, or a system error occurs. Providing clear and helpful error messages is crucial for maintaining user trust and helping them resolve issues. This document provides a catalog of standardized error state messages for the RemoteDesk web application.

## 1. Principles for Error State Copy

*   **Be Clear and Specific:** Explain what went wrong without being overly technical.
*   **Provide a Solution:** Tell the user what they can do to fix the problem or where to get help.
*   **Use a Supportive Tone:** Avoid blaming the user and maintain a professional yet empathetic voice.
*   **Keep it Brief:** Get to the point quickly.
*   **Include Error Codes:** For non-obvious errors, include a code for support reference.

## 2. Error State Catalog

### 2.1. Common Page-Level Errors

| Error | Situation | Error Message (Title & Body) | Recommended Action (CTA) |
| :---- | :-------- | :--------------------------- | :----------------------- |
| **404 Not Found** | User navigates to a non-existent URL. | **Page Not Found**<br>The page you are looking for doesn't exist or has been moved. | Go to Dashboard |
| **500 Internal Server Error** | A general server-side error occurs. | **Something Went Wrong**<br>We're experiencing an internal issue. Our team has been notified. | Try Again Later |
| **403 Forbidden** | User lacks permission to access a page. | **Access Denied**<br>You don't have permission to view this page. | Contact Administrator |
| **No Internet Connection** | User's device is offline. | **No Internet Connection**<br>Please check your network settings and try again. | Refresh Page |

### 2.2. Component-Level Errors

| Situation | Error Message (Title & Body) | Recommended Action |
| :-------- | :--------------------------- | :----------------- |
| **Failed to Load Data** | A specific section (e.g., Device List) fails to fetch data. | **Failed to Load**<br>We couldn't retrieve the data for this section. | Retry |
| **Form Submission Failed** | A form (e.g., Update Profile) fails to submit. | **Update Failed**<br>There was an error saving your changes. Please try again. | Try Again |
| **Search Failed** | The search request timed out or failed. | **Search Error**<br>Something went wrong with your search. | Retry Search |

### 2.3. Action-Specific Errors

| Action | Situation | Error Message (Title & Body) | Recommended Action |
| :----- | :-------- | :--------------------------- | :----------------- |
| **Start Session** | Failed to initiate a remote session. | **Connection Failed**<br>Could not start the session. Please check the remote device status. | Check Device |
| **Payment Failed** | Subscription payment was unsuccessful. | **Payment Failed**<br>We couldn't process your payment. Please check your card details. | Update Payment Method |
| **Invite User** | Failed to send an invitation. | **Invitation Failed**<br>Could not send the invitation email. | Check Email & Retry |

## 3. Implementation Guidelines

*   **Standardized Error Components:** Use consistent UI components for page-level errors (e.g., a full-page error view) and component-level errors (e.g., an inline error message or toast).
*   **Include Error Codes:** Always include a unique error code (e.g., ERR_WEB_404) to help support teams.
*   **Logging:** Log all errors with relevant context for debugging (refer to `audit-log-structure.md`).
*   **Localization:** Ensure all error state copy is properly localized (refer to `locale-contract.md`).

## 4. Related Documents

*   `web-ux-dashboard.md`
*   `web-ux-empty-states.md`
*   `web-ux-loading-states.md`
*   `desktop-ux-error-copy.md`
*   `audit-log-structure.md`
*   `locale-contract.md`
