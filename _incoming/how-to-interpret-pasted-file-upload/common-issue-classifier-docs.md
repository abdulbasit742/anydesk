# RemoteDesk Common Issue Classifier Documentation

## Introduction
This document outlines the approach and methodology for classifying common support issues within RemoteDesk. An effective issue classification system helps in efficient routing, faster resolution, and better analysis of support trends. This system can be used manually by support agents or integrated into an automated triage system.

## Classification Objectives
-   To standardize the categorization of incoming support tickets.
-   To enable efficient routing of tickets to the appropriate support teams or agents.
-   To facilitate data-driven analysis of common problems and product areas requiring improvement.
-   To improve first-response and resolution times.

## Classification Categories
RemoteDesk support issues can be broadly categorized into the following top-level categories, with further sub-categorization as needed:

### 1. Connectivity & Performance
-   **Description:** Issues related to establishing or maintaining a remote connection, or the performance of an active session.
-   **Sub-categories:**
    -   `Connection Failure`: Unable to connect to a remote device.
    -   `Frequent Disconnects`: Sessions dropping unexpectedly.
    -   `High Latency/Lag`: Noticeable delay during remote control.
    -   `Poor Video Quality`: Pixelation, freezing, or low frame rates.
    -   `Audio Issues`: No audio or distorted audio during sessions.
    -   `Firewall/Proxy Issues`: Network configuration preventing connection.

### 2. Account & Authentication
-   **Description:** Problems related to user accounts, login, and identity management.
-   **Sub-categories:**
    -   `Login Failure`: Unable to log in to the web dashboard or desktop client.
    -   `Password Reset`: Issues with resetting or changing passwords.
    -   `SSO Configuration`: Problems setting up or using Single Sign-On.
    -   `Account Lockout`: Account locked due to too many failed attempts.
    -   `User Provisioning (SCIM/JIT)`: Issues with automated user creation/updates.

### 3. Feature Functionality
-   **Description:** Issues where a specific RemoteDesk feature is not working as expected.
-   **Sub-categories:**
    -   `Remote Input (Keyboard/Mouse)`: Input not registering or behaving incorrectly.
    -   `Clipboard Sync`: Copy/paste not working between local and remote.
    -   `File Transfer`: Unable to send or receive files.
    -   `Chat Functionality`: Chat messages not sending/receiving.
    -   `Session Recording`: Recording not starting, stopping, or saving.
    -   `Multi-Monitor Issues`: Problems with multiple displays on remote device.
    -   `Unattended Access`: Issues with connecting to devices without user presence.

### 4. Device Management & Enrollment
-   **Description:** Problems related to adding, managing, or configuring remote devices.
-   **Sub-categories:**
    -   `Device Enrollment Failure`: Unable to enroll a new device.
    -   `Device Offline`: Enrolled device showing as offline when it should be active.
    -   `Device Approval`: Issues with the device approval workflow.
    -   `Fleet Management`: Problems with managing multiple devices (e.g., updates).

### 5. Billing & Subscription
-   **Description:** Inquiries or issues related to invoices, payments, or subscription plans.
-   **Sub-categories:**
    -   `Invoice Discrepancy`: Questions about billing amounts.
    -   `Payment Failure`: Credit card declines, payment processing issues.
    -   `Subscription Upgrade/Downgrade`: Problems changing plans.
    -   `License Key Issues`: Problems with license activation.

### 6. General Inquiry & Feedback
-   **Description:** Non-technical questions, feature requests, or general feedback.
-   **Sub-categories:**
    -   `Feature Request`: Suggestion for new functionality.
    -   `General Question`: How-to questions not covered in KB.
    -   `Product Feedback`: General comments or suggestions.

## Classification Process

1.  **Initial Review:** Support agent reviews the incoming ticket subject and description.
2.  **Keyword Matching:** Identify keywords or phrases that suggest a category (e.g., 
‘cannot connect’, ‘login failed’, ‘file transfer error’).
3.  **Category Assignment:** Assign the most relevant top-level category and sub-category.
4.  **Automated Triage (if applicable):** If auto-triage rules are configured, the system may automatically assign priority, tag the ticket, or route it to a specific team based on the classification.
5.  **Refinement:** If initial classification is unclear, the agent can refine it after further investigation.

## Integration with Auto-Triage Rules

This classification system can be directly integrated with the `AutoTriageRuleSchema` defined in `packages/shared/support/auto-triage-rules.ts`. For example:

-   **Condition:** If `description` `contains` 

    ‘login failed’ AND `field` `equals` ‘customer_email’ `value` ‘@example.com’
-   **Action:** `set_priority` `value` ‘high’ AND `assign_team` `value` ‘Account Management’

## Best Practices
-   **Consistency:** Ensure all support agents use the classification system consistently.
-   **Regular Review:** Periodically review the classification categories and update them based on emerging issues or product changes.
-   **Training:** Provide regular training to support staff on how to effectively use the classification system.
-   **Feedback Loop:** Establish a feedback loop between support, product, and engineering teams to address recurring issues identified through classification data.
