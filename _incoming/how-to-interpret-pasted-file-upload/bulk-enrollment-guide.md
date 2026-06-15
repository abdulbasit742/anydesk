# RemoteDesk Bulk Enrollment Guide

## Introduction
This guide provides instructions for performing bulk enrollment of devices into the RemoteDesk platform. Bulk enrollment is designed for organizations that need to provision a large number of devices efficiently, often leveraging existing Mobile Device Management (MDM) solutions, Group Policy Objects (GPO), or other automated deployment tools.

## Prerequisites
-   **Administrative Access:** Access to the RemoteDesk admin console with permissions to manage device enrollment.
-   **Deployment Tool:** An MDM solution, GPO, or other automated software deployment tool capable of distributing files or executing scripts.
-   **Network Connectivity:** Devices must have network access to the RemoteDesk API and signaling servers.

## Bulk Enrollment Methods
RemoteDesk supports bulk enrollment primarily through a configuration file or a pre-shared key.

### Method 1: Configuration File Deployment
This method involves generating a unique configuration file from the RemoteDesk admin console and deploying it to target devices.

#### Steps:
1.  **Generate Configuration File:**
    -   Navigate to the 
RemoteDesk admin console.
    -   Go to `Settings > Device Enrollment > Bulk Enrollment`.
    -   Click `Generate Configuration File`.
    -   Select desired enrollment policies (e.g., auto-approve, default group assignment).
    -   Download the generated `remotedesk-enrollment-config.json` file.
2.  **Distribute Configuration File:**
    -   Use your MDM solution (e.g., Microsoft Intune, Jamf, VMware Workspace ONE) or GPO to distribute the `remotedesk-enrollment-config.json` file to the following location on target devices:
        -   **Windows:** `%PROGRAMDATA%\RemoteDesk\config\remotedesk-enrollment-config.json`
        -   **macOS:** `/Library/Application Support/RemoteDesk/config/remotedesk-enrollment-config.json`
        -   **Linux:** `/etc/remotedesk/config/remotedesk-enrollment-config.json`
3.  **Install RemoteDesk Client:**
    -   Deploy the RemoteDesk desktop client installer to the target devices.
    -   Upon first launch, the client will detect the configuration file and automatically enroll the device.

### Method 2: Pre-Shared Enrollment Key
This method uses a single, pre-shared key that can be embedded into the RemoteDesk client installer or passed as a command-line argument during installation.

#### Steps:
1.  **Generate Enrollment Key:**
    -   Navigate to the RemoteDesk admin console.
    -   Go to `Settings > Device Enrollment > Bulk Enrollment`.
    -   Click `Generate Enrollment Key`.
    -   Note down the generated key.
2.  **Embed Key in Installer (Optional, Advanced):**
    -   For advanced deployments, the enrollment key can be embedded directly into a custom client installer package. Refer to the RemoteDesk SDK documentation for details.
3.  **Pass Key via Command Line:**
    -   During silent installation of the RemoteDesk client, pass the enrollment key as a command-line argument:
        -   **Windows (MSI):** `msiexec /i RemoteDeskClient.msi /qn ENROLLMENT_KEY="YOUR_GENERATED_KEY"`
        -   **macOS (PKG):** `sudo installer -pkg RemoteDeskClient.pkg -target / -args "ENROLLMENT_KEY=YOUR_GENERATED_KEY"`
        -   **Linux (DEB/RPM):** `sudo dpkg -i remotedesk-client.deb && sudo /opt/remotedesk/client --enrollment-key "YOUR_GENERATED_KEY"`

## Post-Enrollment Actions

### 1. Device Approval
-   **Auto-Approve:** If configured, devices will be automatically approved upon successful enrollment.
-   **Manual Approval:** If manual approval is required, administrators will receive a notification and must approve the device in the RemoteDesk admin console before it can be used.

### 2. Group Assignment
-   Devices can be automatically assigned to default groups based on the bulk enrollment policy.
-   Administrators can manually adjust group assignments post-enrollment.

### 3. Verification
-   Verify enrolled devices appear in the RemoteDesk admin console under `Devices`.
-   Check device status and assigned policies.

## Troubleshooting
-   **Enrollment Failure:**
    -   Verify network connectivity to RemoteDesk servers.
    -   Ensure the configuration file or enrollment key is correctly placed/passed.
    -   Check RemoteDesk client logs for enrollment errors.
    -   Review the RemoteDesk admin console for pending devices or error messages.
-   **Device Not Appearing:**
    -   Confirm the device has launched the RemoteDesk client after configuration.
    -   Check for firewall or proxy issues blocking communication.

## Security Considerations
-   **Secure Key Management:** Treat enrollment keys and configuration files as sensitive information. Do not expose them publicly.
-   **Least Privilege:** Ensure the deployment tool used for bulk enrollment operates with the minimum necessary privileges.
-   **Audit Logs:** All bulk enrollment activities are logged for auditing purposes. Regularly review these logs for anomalies.
