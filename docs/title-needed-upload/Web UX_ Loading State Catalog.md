# Web UX: Loading State Catalog

Loading states provide visual feedback to users while data is being fetched or an action is being processed. Well-designed loading states reduce perceived wait times and improve the overall feel of the application. This document provides a catalog of standardized loading states for the RemoteDesk web application.

## 1. Principles for Loading States

*   **Provide Immediate Feedback:** Show a loading indicator as soon as an action is initiated.
*   **Reduce Perceived Wait Time:** Use skeleton screens or progress indicators to show that progress is being made.
*   **Maintain Layout Stability:** Use skeleton screens that match the final layout to avoid jarring layout shifts.
*   **Be Consistent:** Use the same loading patterns across the entire application.
*   **Avoid Overuse:** Don't show loading indicators for very fast actions (e.g., < 300ms).

## 2. Loading State Catalog

### 2.1. Page-Level Loading

Used when a new page is being loaded or a major data fetch is occurring.

*   **Pattern:** Full-page spinner or a top-level progress bar.
*   **Situation:** Initial application load, navigating between major sections (Dashboard, Devices, Billing).
*   **Visual:** A centered, branded spinner or a thin progress bar at the very top of the viewport.

### 2.2. Component-Level Loading (Skeleton Screens)

Used for specific sections of a page while their data is being fetched. This is the preferred method for most data-heavy sections.

*   **Pattern:** Skeleton screens that mimic the structure of the content.
*   **Situation:** Loading the device list, session history, or user profile details.
*   **Visual:** Gray, pulsing placeholders for text, images, and buttons.

| Component | Skeleton Structure |
| :-------- | :----------------- |
| **Device List** | Rows with placeholders for device icon, name, status, and actions. |
| **Session History** | A table-like structure with placeholders for date, device name, and duration. |
| **User Profile** | Placeholders for avatar, name, email, and form fields. |

### 2.3. Action-Level Loading

Used when a specific action is being processed (e.g., submitting a form, starting a session).

*   **Pattern:** Inline spinners or disabled buttons with loading text.
*   **Situation:** Clicking "Connect", "Save Settings", "Update Plan".
*   **Visual:** A small spinner inside the button, or the button text changing to "Connecting...", "Saving...", etc.

### 2.4. Global Progress Indicators

Used for long-running background tasks.

*   **Pattern:** A small progress indicator in a consistent location (e.g., bottom-right).
*   **Situation:** Large file upload/download, generating a complex report.
*   **Visual:** A small circular progress bar or a toast with a progress indicator.

## 3. Implementation Guidelines

*   **Standardized Components:** Use a consistent set of loading components (Spinners, Skeletons, Progress Bars).
*   **Minimum Duration:** Consider a minimum duration for loading states (e.g., 500ms) to avoid "flashing" if data returns very quickly.
*   **Accessibility:** Ensure loading states are accessible (e.g., use `aria-busy="true"` and provide screen reader-friendly text like "Loading...").
*   **Graceful Transitions:** Use subtle fade-in animations when the actual content replaces the loading state.

## 4. Related Documents

*   `web-ux-dashboard.md`
*   `web-ux-empty-states.md`
*   `web-ux-error-states.md`
*   `desktop-ux-accessibility.md`
