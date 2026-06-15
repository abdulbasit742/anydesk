# RemoteDesk Automated Self-healing Actions

This document describes the Automated Self-healing Actions feature within RemoteDesk, designed to proactively address and resolve predicted or detected issues on remote endpoints.

## Overview
Automated Self-healing Actions enable the RemoteDesk platform to automatically execute predefined remediation steps when a potential issue is predicted by the AI Failure Prediction system or detected through other monitoring mechanisms. This capability significantly reduces the need for manual intervention, speeds up problem resolution, and enhances system uptime. Actions can range from simple service restarts to more complex diagnostic script executions, with configurable approval workflows and cooldown periods to prevent unintended consequences.

## Features
- **Automated Remediation**: Execute predefined actions (e.g., restart service, clear cache, reinstall driver, reboot device) to resolve issues.
- **Trigger Mechanisms**: Actions can be triggered by AI failure predictions, predefined thresholds, or manually by administrators.
- **Approval Workflows**: Configurable settings to require manual approval for sensitive actions, preventing automatic execution of potentially disruptive operations.
- **Retry Logic**: Built-in retry mechanisms for actions that initially fail, with a configurable maximum number of retries.
- **Cooldown Periods**: Prevents the same action from being repeatedly triggered on a device within a short timeframe.
- **Status Tracking**: Tracks the status of each self-healing action (Pending, In Progress, Completed Success, Completed Failure, Cancelled).
- **Notification**: Notifies administrators about action triggers, approvals needed, completion status, and failures.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`SelfHealingActionType`**: An enum defining the types of self-healing actions that can be performed (e.g., `RESTART_SERVICE`, `REBOOT_DEVICE`).
- **`SelfHealingActionStatus`**: An enum defining the status of a self-healing action.
- **`SelfHealingAction`**: Represents a self-healing action, including `id`, `deviceId`, `actionType`, `triggeredBy`, `triggeredAt`, `status`, `details`, `logs`, and `failureReason`.
- **`SelfHealingConfig`**: Configuration settings for the Automated Self-healing system, such as `enabled`, `autoApproveActions`, `maxRetries`, and `cooldownPeriodMinutes`.
- **Location**: `remotedesk/packages/shared/src/predictive-maintenance/self-healing.dto.ts`

### API Service Logic
- **`AutomatedSelfHealingService.ts`**: Manages the execution and lifecycle of self-healing actions on the API server.
  - **Configuration Management**: Loads and updates self-healing settings.
  - **Action Triggering**: Initiates a self-healing action, checking for cooldowns and auto-approval settings.
  - **Action Execution**: Simulates sending commands to the desktop agent for execution, with retry logic.
  - **Approval/Cancellation**: Provides methods for administrators to approve or cancel pending actions.
  - **Notification**: Integrates with a `notificationService` to alert administrators about action status.
  - **Action Management**: Provides methods to retrieve and manage self-healing actions.
- **Location**: `remotedesk/apps/api/src/predictive-maintenance/AutomatedSelfHealingService.ts`

### API Routes
- **`/api/predictive-maintenance/self-healing/config` (GET/POST)**: Manage the configuration for Automated Self-healing.
- **`/api/predictive-maintenance/self-healing/trigger` (POST)**: Trigger a self-healing action for a device.
- **`/api/predictive-maintenance/self-healing/approve/:actionId` (POST)**: Approve a pending self-healing action.
- **`/api/predictive-maintenance/self-healing/cancel/:actionId` (POST)**: Cancel a pending or in-progress self-healing action.
- **`/api/predictive-maintenance/self-healing/actions` (GET)**: Retrieve all or device-specific self-healing actions.
- **`/api/predictive-maintenance/self-healing/actions/:id` (GET)**: Retrieve a specific self-healing action by ID.
- **Location**: `remotedesk/apps/api/src/predictive-maintenance/predictive-maintenance.routes.ts`

## Technical Considerations
- **Desktop Agent Integration**: Requires robust integration with the desktop agent to reliably execute commands and report back status.
- **Security**: Actions must be executed with appropriate permissions and security contexts to prevent misuse. Strict authorization checks are essential.
- **Idempotency**: Self-healing actions should ideally be idempotent, meaning they can be run multiple times without causing unintended side effects.
- **Rollback Strategy**: Consider a rollback strategy for actions that cause unintended issues.
- **User Impact**: Actions like rebooting a device can be disruptive and should be handled with clear user notification and consent mechanisms.

## Future Enhancements
- **Pre-flight Checks**: Implement checks before executing an action to ensure the device is in a suitable state.
- **Action Playbooks**: Allow administrators to define sequences of self-healing actions as playbooks.
- **Machine Learning for Action Selection**: Use AI to recommend or automatically select the most effective self-healing action based on the predicted failure type.
- **Integration with Incident Management**: Automatically update incident tickets with self-healing action status.
