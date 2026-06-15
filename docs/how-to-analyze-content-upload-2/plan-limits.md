# Plan Limits and Billing for RemoteDesk

This document outlines how RemoteDesk manages subscription plans, enforces feature limits, and tracks usage for billing purposes.

## Overview
RemoteDesk offers various subscription plans tailored to different user needs, from individual users to large enterprises. Each plan comes with specific feature sets and usage limits. The system is designed to transparently communicate these limits, track current usage, and handle overages.

## Key Concepts

### 1. Subscription Plans
- **Purpose**: Define the features and limits available to an organization.
- **Details**: Each plan (e.g., Free, Pro, Enterprise) has a unique ID, name, description, and pricing structure (monthly/annually). A plan is essentially a collection of `PlanLimit` objects.
- **Related File**: `plan-limits.dto.ts` (defines `SubscriptionPlan` interface).

### 2. Plan Features and Limits
- **Purpose**: Specify quantifiable or boolean restrictions on various aspects of the RemoteDesk service.
- **Details**: Limits can be applied to features such as the maximum number of devices, maximum users, concurrent sessions, session duration, and access to advanced features like session recording, file transfer, API access, and webhooks. Boolean limits indicate feature availability, while numeric limits specify maximum allowed values.
- **Related File**: `plan-limits.dto.ts` (defines `PlanFeature` enum and `PlanLimit` interface).

### 3. Organization Plan Status
- **Purpose**: Track an organization's current subscription plan, actual usage against limits, and any overages.
- **Details**: For each organization, the system maintains a record of their active plan, real-time usage data for each `PlanFeature`, and calculated overage amounts. This status is critical for billing and for informing users about their consumption.
- **Related File**: `plan-limits.dto.ts` (defines `OrganizationPlanStatus` interface).

### 4. Limit Enforcement
- **Purpose**: Prevent users from exceeding their plan's allocated resources or accessing features not included in their subscription.
- **Details**: Enforcement occurs at various points in the application (e.g., when a new device is registered, a session is initiated, or an API call is made). If a limit is exceeded, the action is typically denied, and the user is informed.

### 5. Usage Tracking
- **Purpose**: Accurately measure an organization's consumption of various features over time.
- **Details**: The system continuously monitors and aggregates usage data for all quantifiable `PlanFeature`s. This data is used to update the `OrganizationPlanStatus` and for generating billing reports.

## API Endpoints (Backend)
- `/api/admin/plan-limits/plans`: Get a list of all available subscription plans.
- `/api/admin/plan-limits/organization-status/:organizationId`: Get the current plan status and usage for a specific organization.
- `/api/admin/plan-limits/update-plan/:organizationId`: Update an organization's subscription plan.
- **Related File**: `plan-limits.routes.ts`

## User Experience
- **Dashboard Visibility**: Users and administrators can view their current plan, usage, and remaining limits on their dashboard.
- **Notifications**: Automated notifications are sent when an organization approaches or exceeds a plan limit.
- **Upgrade Path**: Clear options are provided for users to upgrade their subscription plan to access more features or higher limits.

## Testing
- **Limit Enforcement**: Verify that all defined limits are correctly enforced across the application (e.g., cannot add more devices than allowed, session disconnects after max duration).
- **Usage Tracking**: Ensure that usage metrics are accurately recorded and updated in real-time.
- **Plan Changes**: Test the process of upgrading and downgrading plans, ensuring that new limits are applied correctly.
- **Edge Cases**: Test scenarios like reaching limits exactly, attempting actions with zero remaining allowance, and behavior when a feature is completely disabled by the plan.
