# RemoteDesk Slack App Documentation

## Introduction
This document provides an overview of the RemoteDesk Slack App, detailing its features, installation process, and usage. The Slack App allows users to receive notifications, manage session requests, and perform quick actions directly within their Slack workspace, enhancing collaboration and response times for remote support scenarios.

## Features

### 1. Session Request Notifications
-   Receive real-time Slack notifications when a new remote session request is initiated for your devices or by users you manage.
-   Notifications include details such as the initiator, target device, and reason for the session.

### 2. Approve/Reject Sessions
-   Approve or reject pending session requests directly from Slack notifications with a single click.

### 3. Session Status Updates
-   Get updates on the status of ongoing sessions (e.g., session started, session ended, session disconnected).

### 4. Device Status Alerts
-   Receive alerts when critical devices go offline or come online.

### 5. Slash Commands
-   Use Slack slash commands to quickly check device status, list active sessions, or initiate support requests.
    -   `/remotedesk status [device_id]`: Check the status of a specific device.
    -   `/remotedesk sessions`: List all active sessions for your organization.
    -   `/remotedesk help`: Display help information for the RemoteDesk Slack App.

## Installation Guide

### Prerequisites
-   An active RemoteDesk enterprise account.
-   Administrator privileges for your Slack workspace.

### Steps
1.  **Access RemoteDesk Integration Settings:** Log in to your RemoteDesk web dashboard and navigate to `Settings > Integrations > Slack`.
2.  **Add to Slack:** Click the `Add to Slack` button. You will be redirected to Slack's authorization page.
3.  **Authorize App:** Review the permissions requested by the RemoteDesk Slack App and click `Allow` to grant access to your Slack workspace.
4.  **Configure Notifications:** After successful installation, you will be redirected back to RemoteDesk. Here, you can configure:
    -   Which Slack channels receive notifications (e.g., #remote-support, #it-alerts).
    -   Types of notifications to send (e.g., all session requests, only critical device alerts).
    -   Mapping of RemoteDesk teams/users to Slack channels for targeted notifications.
5.  **Complete Setup:** Click `Save` to finalize your Slack integration settings.

## Usage

### Receiving Notifications
-   Once configured, notifications for session requests and device status will appear in the designated Slack channels.
-   For session requests, interactive buttons (`Approve` / `Reject`) will be included in the notification.

### Using Slash Commands
-   In any Slack channel or direct message, type `/remotedesk` followed by a command (e.g., `/remotedesk status device-123`).
-   The app will respond with the requested information, visible only to you or in the channel, depending on the command and configuration.

## Troubleshooting
-   **No Notifications:**
    -   Verify that the Slack App is installed and authorized in your Slack workspace.
    -   Check your RemoteDesk integration settings to ensure notifications are enabled and configured for the correct channels.
    -   Ensure the RemoteDesk App has permission to post in the target Slack channels.
-   **Commands Not Working:**
    -   Ensure you are typing the slash command correctly (e.g., `/remotedesk`).
    -   Check if the Slack App is enabled in the channel where you are trying to use the command.
-   **Authorization Issues:** If you encounter authorization errors, try reinstalling the Slack App from the RemoteDesk dashboard.

## Security Considerations
-   **Permissions:** The RemoteDesk Slack App requests minimal necessary permissions to function. Regularly review app permissions in your Slack workspace.
-   **Data Exposure:** Be mindful of the information displayed in Slack notifications. Configure notification settings to avoid exposing sensitive data in public channels.
-   **Access Control:** Ensure that only authorized personnel have access to Slack channels where session approval notifications are sent.

## Uninstallation
To uninstall the RemoteDesk Slack App:
1.  Go to your RemoteDesk web dashboard `Settings > Integrations > Slack` and click `Disconnect`.
2.  In your Slack workspace, navigate to `Administration > Manage Apps`, find the RemoteDesk App, and click `Remove`Remove`Remove`.
