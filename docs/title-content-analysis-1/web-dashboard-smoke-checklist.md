# RemoteDesk Web Dashboard Smoke Checklist

This checklist provides a quick, high-level verification of the core functionalities of the RemoteDesk web dashboard. It's designed to ensure that the application is generally functional after a new deployment or significant code changes.

## 1. Core Navigation and Layout

*   [ ] Verify the web application loads successfully in a modern browser (e.g., Chrome, Firefox, Edge).
*   [ ] Verify the main navigation (sidebar/header) is visible and functional.
*   [ ] Verify clicking on main navigation links (e.g., Dashboard, Devices, Sessions, Settings) navigates to the correct pages.
*   [ ] Verify the overall layout and styling appear correct (e.g., no broken CSS, responsive design).

## 2. Authentication Flow

*   [ ] Verify the login page is accessible.
*   [ ] Successfully log in with valid credentials.
*   [ ] Verify the signup page is accessible.
*   [ ] Successfully sign up with new credentials.
*   [ ] Verify the logout functionality works correctly.
*   [ ] Verify password reset/forgot password flow (if implemented).

## 3. Dashboard Page

*   [ ] Verify the dashboard page loads without errors.
*   [ ] Verify key summary information (e.g., number of devices, active sessions) is displayed.
*   [ ] Verify any charts or widgets on the dashboard load and display data (even if placeholder data).

## 4. Devices Page

*   [ ] Verify the devices page loads without errors.
*   [ ] Verify the list of registered devices is displayed (even if empty).
*   [ ] Verify basic device information (e.g., name, status) is visible.
*   [ ] Verify the ability to add a new device (if applicable).

## 5. Sessions Page

*   [ ] Verify the sessions page loads without errors.
*   [ ] Verify the list of past/active sessions is displayed (even if empty).
*   [ ] Verify basic session information (e.g., start/end time, connected devices) is visible.

## 6. Settings Page

*   [ ] Verify the settings page loads without errors.
*   [ ] Verify basic user profile settings are displayed.
*   [ ] Verify security settings (e.g., two-factor authentication status) are visible.

## 7. Error Handling

*   [ ] Verify that API errors are handled gracefully and displayed to the user (e.g., network error, invalid credentials).
*   [ ] Verify that client-side errors do not crash the application.

---

**Author**: Manus AI
**Date**: June 12, 2026
