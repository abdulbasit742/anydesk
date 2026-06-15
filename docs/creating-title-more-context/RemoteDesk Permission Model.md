# RemoteDesk Permission Model

This document details the permission model for RemoteDesk, explaining how access control is managed for users, devices, and sessions.

## 1. Overview

The permission model is designed to ensure that users only have access to resources they own or have been explicitly granted access to. It operates on the principles of least privilege and explicit consent.

## 2. User Roles

Currently, RemoteDesk defines the following primary user roles:

-   **`User`:** The standard role for all registered users. Users can manage their own devices, initiate sessions to their devices, and view their session history.
-   **`Admin`:** (Future implementation) An administrative role with elevated privileges, such as managing all users, devices, and system settings.

## 3. Device Permissions

Device permissions dictate who can interact with a specific device.

-   **Ownership:** The user who registers a device is its owner. The owner has full control over the device, including renaming, deleting, and initiating sessions.
-   **Trust Status:** A device can be marked as "trusted" or "untrusted" by its owner.
    -   **Trusted:** The device can initiate sessions to other devices owned by the same user without requiring explicit permission prompts on the target device (depending on settings).
    -   **Untrusted:** Sessions initiated from this device may require explicit permission on the target device.
-   **Device Access Password:** An optional password can be set for a device, requiring anyone attempting to connect to provide it.

## 4. Session Permissions

Session permissions govern the actions allowed during an active remote session. These permissions are negotiated and enforced during session setup and can be modified during the session.

-   **Screen Viewing:** The fundamental permission to view the host's screen.
-   **Remote Input (Keyboard/Mouse):** Permission to send keyboard and mouse events to the host. This is typically disabled by default and requires explicit consent from the host.
-   **File Transfer:** Permission to transfer files between the host and viewer. This is often gated by subscription plans and requires explicit consent.
-   **Clipboard Sync:** Permission to synchronize the clipboard between the host and viewer. This is also often gated by subscription plans and requires explicit consent.

## 5. Enforcement Mechanisms

-   **Backend API:** The API enforces ownership and role-based access control. For example, an API request to delete a device will fail if the authenticated user is not the owner.
-   **Feature Gating Middleware:** The API uses middleware to check subscription plan limits before allowing access to premium features (e.g., file transfer).
-   **Desktop Application (Host):** The host application enforces session permissions. It displays prompts for remote input or file transfer requests and can revoke these permissions at any time.
-   **Desktop Application (Viewer):** The viewer application respects the permissions granted by the host and disables UI elements for unauthorized actions.

## 6. Future Enhancements

-   **Team/Organization Support:** Implementing a hierarchical structure where users belong to organizations, allowing for shared device access and more granular role definitions (e.g., `Team Admin`, `Team Member`).
-   **Granular Permission Profiles:** Allowing users to create custom permission profiles for different devices or connection scenarios.

This model ensures a secure and controlled environment for remote access, prioritizing user consent and data protection.
