# Desktop UX: Accessibility Copy and Guidelines

Ensuring that RemoteDesk is accessible to all users, including those with disabilities, is a core priority. This document provides guidelines and specific copy for making the RemoteDesk desktop application more accessible.

## 1. Accessibility Principles

*   **Perceivable:** Information and UI components must be presentable to users in ways they can perceive (e.g., text alternatives for non-text content).
*   **Operable:** UI components and navigation must be operable (e.g., keyboard accessibility).
*   **Understandable:** Information and the operation of the UI must be understandable (e.g., clear and consistent labels).
*   **Robust:** Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies.

## 2. Accessibility Copy Guidelines

### 2.1. Descriptive Labels (ARIA Labels)

Provide clear, descriptive labels for all interactive elements, especially those that use icons without text.

| Element | Icon/Visual | ARIA Label / Screen Reader Text |
| :------ | :---------- | :------------------------------ |
| Disconnect Button | ✕ (Red icon) | Disconnect from current session |
| Full Screen Toggle | ⛶ | Toggle full screen mode |
| File Transfer | ⭳ | Open file transfer dialog |
| Clipboard Sync | 📋 | Toggle clipboard synchronization |
| Settings Icon | ⚙ | Open application settings |
| Connection Status | 📶 | Connection quality: [Status] |

### 2.2. Text Alternatives for Images

Ensure all images, icons, and diagrams have appropriate alternative text.

*   **RemoteDesk Logo:** "RemoteDesk Logo"
*   **Success Checkmark:** "Action completed successfully"
*   **Error Warning:** "Error occurred"
*   **Instructional Illustrations:** Provide a concise description of what the illustration conveys.

### 2.3. Clear and Consistent Terminology

Use plain language and avoid ambiguous terms. Ensure the same terms are used consistently throughout the application and documentation.

*   Use "Sign In" instead of "Log On" or "Authenticate".
*   Use "Remote Device" consistently to refer to the computer being controlled.
*   Use "Client Device" consistently to refer to the computer doing the controlling.

### 2.4. Error and Feedback Messages

Make sure error messages and feedback (like toasts) are descriptive and provide clear guidance (refer to `desktop-ux-error-copy.md` and `desktop-ux-toast-copy.md`).

*   "Invalid ID. Please enter a 9-digit number." (Clear and actionable)
*   "Error 404." (Avoid technical codes without explanation)

## 3. Keyboard Accessibility

*   **Logical Tab Order:** Ensure the tab order follows a logical sequence through the UI.
*   **Focus Indicators:** Provide clear visual indicators for the currently focused element.
*   **Keyboard Shortcuts:** Provide keyboard shortcuts for common actions and document them clearly.
*   **No Keyboard Traps:** Ensure users can navigate into and out of all components using only the keyboard.

## 4. Visual Accessibility

*   **High Contrast Support:** Ensure the UI is readable in high-contrast modes.
*   **Color as the Only Indicator:** Do not use color as the sole means of conveying information (e.g., use an icon and text along with a red color for an error).
*   **Adjustable Text Size:** Allow users to adjust the text size within the application.
*   **Screen Reader Compatibility:** Use standard UI components and ARIA attributes to ensure compatibility with screen readers like NVDA, JAWS, and VoiceOver.

## 5. Testing for Accessibility

*   **Automated Scans:** Use accessibility auditing tools (e.g., Axe, Lighthouse).
*   **Manual Testing:** Perform manual testing using only a keyboard and with screen readers.
*   **User Testing:** Conduct usability testing with people with various disabilities.

## 6. Related Documents

*   `desktop-ux-session-toolbar.md`
*   `desktop-ux-first-run.md`
*   `desktop-ux-settings.md`
*   `desktop-ux-error-copy.md`
*   `desktop-ux-toast-copy.md`
