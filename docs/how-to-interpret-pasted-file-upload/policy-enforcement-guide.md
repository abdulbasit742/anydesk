# RemoteDesk Geo-Fencing Policy Enforcement Guide

## Introduction
This guide outlines the implementation and enforcement of geo-fencing policies within RemoteDesk, enabling administrators to define location-based access controls and actions for users and devices. Geo-fencing enhances security and compliance by ensuring that remote access activities adhere to geographical restrictions.

## 1. Principles of Geo-Fencing Policy Enforcement

-   **Location-Aware Access:** Grant or deny access to RemoteDesk resources based on the geographical location of the user or device.
-   **Dynamic Policy Application:** Policies are applied in real-time as the location of a device or user changes.
-   **Granular Control:** Define policies at various levels, from broad country-based restrictions to precise geographical areas.
-   **Auditable Actions:** All policy enforcement actions and location-based events are logged for security and compliance auditing.

## 2. Key Components

### 2.1. Geo-Fences (`GeoFenceSchema`)
Geo-fences are virtual geographical boundaries defined using `GeoFenceSchema`. RemoteDesk supports several `GeoFenceType`s:

-   **Circle:** Defined by a central coordinate (`latitude`, `longitude`) and a `radiusKm`.
-   **Polygon:** Defined by a series of `coordinates` forming a closed shape.
-   **Country:** Defined by one or more ISO 3166-1 alpha-2 `countryCodes`.
-   **IP Range:** Defined by a list of `ipRanges` (CIDR blocks), which can be used to approximate geographical locations.

Each geo-fence can have associated `actions` (`GeoFenceAction`) that are triggered when a device or user enters or exits the defined area. These actions include:

-   `allow_access`: Permit access to RemoteDesk resources.
-   `deny_access`: Block access to RemoteDesk resources.
-   `require_mfa`: Force Multi-Factor Authentication.
-   `log_event`: Record the event for auditing purposes.

### 2.2. Location Policies (`LocationPolicySchema`)
Location policies (`LocationPolicySchema`) group one or more `geoFenceIds` and define how these geo-fences apply to specific `appliesToUserIds` or `appliesToDeviceIds`. Key attributes include:

-   **Priority:** Policies are evaluated based on their `priority` (lower number = higher priority), allowing for complex rule sets.
-   **Default Action:** A `defaultAction` is specified if no specific geo-fence rule matches the current location.

## 3. Policy Enforcement Workflow

1.  **Location Data Acquisition:** RemoteDesk clients (desktop and mobile) securely acquire location data (e.g., GPS, Wi-Fi, IP geolocation) from the device.
2.  **Location Data Transmission:** Location data is securely transmitted to the RemoteDesk backend.
3.  **Policy Evaluation:** The backend evaluates the device/user location against all active `LocationPolicySchema` and their associated `GeoFenceSchema`.
    -   Policies are evaluated in order of `priority`.
    -   The system determines if the device/user is inside or outside any relevant geo-fence.
4.  **Action Triggering:** Based on the policy evaluation, the defined `GeoFenceAction`s are triggered.
    -   For `deny_access` or `require_mfa`, the client is instructed to enforce the restriction.
    -   For `log_event`, an audit log entry is created.
5.  **Audit Logging:** All location changes and policy enforcement actions are recorded in an audit log, including `userId`, `deviceId`, `timestamp`, `locationData`, and the `actionTaken`.
6.  **Continuous Monitoring:** Location is continuously monitored, and policies are re-evaluated as the device/user moves.

## 4. Implementation Details

### 4.1. Client-Side Location Services
-   Mobile and desktop clients integrate with native location services (GPS, Wi-Fi, cellular triangulation, IP geolocation).
-   Users must grant explicit permission for location services.
-   Location data is anonymized or pseudonymized where possible and encrypted in transit.

### 4.2. Backend Geolocation Services
-   The RemoteDesk backend may use third-party geolocation services to convert IP addresses into geographical coordinates or to validate client-provided location data.

### 4.3. Policy Management Interface
-   Administrators use a dedicated interface within the RemoteDesk web dashboard to define and manage `GeoFenceSchema` and `LocationPolicySchema`.
-   The interface provides visual tools for drawing geo-fences on maps and configuring associated actions.

## 5. Security and Privacy Considerations

-   **Data Minimization:** Collect only the necessary location data required for policy enforcement.
-   **Encryption:** All location data, both in transit and at rest, must be encrypted.
-   **User Consent:** Obtain explicit user consent for location tracking.
-   **Transparency:** Clearly communicate to users how their location data is used and for what purpose.
-   **Tamper Detection:** Implement mechanisms to detect and prevent tampering with client-side location data.
-   **Fallback Mechanisms:** Define clear fallback actions if location data is unavailable or unreliable.

## 6. Benefits

-   **Enhanced Security:** Prevents unauthorized access from restricted geographical areas.
-   **Regulatory Compliance:** Helps meet data residency and access control requirements for various regulations.
-   **Operational Control:** Provides administrators with fine-grained control over where and how RemoteDesk can be used.
-   **Risk Mitigation:** Reduces the risk of data breaches and policy violations related to geographical access.

## 7. Future Enhancements

-   Integration with threat intelligence feeds for real-time risk assessment based on location.
-   Adaptive policies that adjust based on other contextual factors (e.g., time of day, network).
-   More sophisticated visualization of policy enforcement events on a global map.
