# Admin Device Visibility for RemoteDesk

This document outlines the features and tools available to administrators for monitoring and managing registered devices within RemoteDesk.

## Overview
Maintaining a clear inventory and understanding the status of all devices connected to the RemoteDesk ecosystem is crucial for security, support, and resource management. The admin dashboard provides comprehensive tools for device visibility.

## Key Features

### 1. Device Inventory Page
- **Purpose**: Provides a centralized list of all registered devices, whether they are currently online, offline, or idle.
- **Details**: Displays essential information such as Device ID, Name, Operating System, current Status, Owner, Last Seen timestamp, Health Status, and Trust Status. Includes search and filtering capabilities to manage large inventories.
- **Access**: Accessible via the main admin dashboard.
- **Related File**: `DeviceInventoryPage.tsx`

### 2. Device Detail Page
- **Purpose**: Offers an in-depth view of a specific device.
- **Details**: Provides comprehensive information about a device, including its full specifications, network details, associated user, and historical data. Allows administrators to view and modify certain device attributes, such as trust status.
- **Access**: Navigable from the Device Inventory Page by clicking on a device.
- **Related File**: `DeviceDetailPage.tsx`

### 3. Device Health Status
- **Purpose**: Indicates the operational health of a device.
- **Details**: Devices are categorized as `healthy`, `warning`, or `critical` based on various factors like recent activity, system resource usage (if monitored), and error logs. This helps administrators proactively identify and address potential issues.
- **Access**: Displayed in both the Device Inventory Page and Device Detail Page.
- **Related File**: `DeviceHealthStatus.tsx`

### 4. Last Seen Status
- **Purpose**: Shows the last time a device communicated with the RemoteDesk servers.
- **Details**: Provides a timestamp indicating recent activity, which is crucial for determining if a device is genuinely offline or experiencing connectivity issues. This is a key indicator for device status.
- **Access**: Displayed in both the Device Inventory Page and Device Detail Page.

### 5. Device Owner Information
- **Purpose**: Links devices to their respective users or administrators.
- **Details**: Clearly identifies which user account is associated with a particular device, facilitating accountability and management. This is essential for enterprise environments.
- **Access**: Displayed in both the Device Inventory Page and Device Detail Page.

### 6. Device Trust Status
- **Purpose**: Manages the level of trust assigned to a device within the RemoteDesk ecosystem.
- **Details**: Devices can be marked as `trusted`, `untrusted`, or `pending`. Trusted devices may have fewer restrictions or require less frequent re-authentication. Untrusted devices might be flagged for review or have limited access. This is a critical security control.
- **Access**: Displayed in both the Device Inventory Page and Device Detail Page, with options to modify the status on the detail page.

## API Endpoints (Backend)
- `/api/admin/devices`: Get all registered devices.
- `/api/admin/devices/:deviceId`: Get details for a specific device.
- `/api/admin/devices/:deviceId/trust`: Update the trust status of a device.
- `/api/admin/devices/filtered`: Get devices based on filters (e.g., status, owner, trustStatus).
- **Related File**: `device.routes.ts`

## Testing
Refer to `admin-device-visibility.test.ts` for a comprehensive list of items to verify during testing.
