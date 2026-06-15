# RemoteDesk Batch 8 - Implementation Notes

This document provides detailed implementation notes and instructions for integrating the files generated in Batch 8 into the RemoteDesk project. It also highlights critical steps and considerations for addressing identified risks.

## 1. General Integration Steps

### 1.1. Update `package.json` Dependencies

Ensure all necessary dependencies are added to the respective `package.json` files for `apps/api`, `apps/web`, `apps/desktop`, and `packages/shared`. Key dependencies include:

-   **`apps/api`:** `winston`, `express`, `@prisma/client`
-   **`apps/web`:** `axios`, `socket.io-client`

Run `yarn install` in the project root after updating `package.json` files.

### 1.2. Update Root `tsconfig.json` and `jest.config.js`

Ensure that the new files and directories are included in the TypeScript compilation and Jest test configurations. This might involve updating `include` and `exclude` paths.

### 1.3. Integrate Shared Packages

Ensure that the new utilities and types in `packages/shared` are correctly imported and used across `apps/api`, `apps/web`, and `apps/desktop`.

## 2. Backend API (`apps/api`) Specifics

### 2.1. Prisma Migrations

**CRITICAL:** The `apps/api/prisma/schema.prisma` file has been updated with new models (`Device`, `DeviceAudit`, `SessionEvent`). You **MUST** run the following command from the `apps/api` directory to apply these changes to your database:

```bash
cd apps/api
npx prisma migrate dev --name add_device_and_session_models
cd ../..
```

This will create and apply a new migration file. Review the generated migration to ensure it aligns with expectations.

### 2.2. Integrate New Routes and Middleware

-   **`apps/api/src/index.ts`:** Update the main API entry point to include the new routes (`deviceRoutes.ts`, `sessionAuditRoutes.ts`, `healthRoutes.ts`) and integrate the `featureGateMiddleware.ts`.

    ```typescript
    // Example integration in apps/api/src/index.ts
    import express from 'express';
    import authRoutes from './routes/authRoutes';
    import deviceRoutes from './routes/deviceRoutes';
    import sessionAuditRoutes from './routes/sessionAuditRoutes';
    import healthRoutes from './routes/healthRoutes';
    import { featureGate } from './middleware/featureGateMiddleware';
    import { PlanType } from '../../packages/shared/src/constants/planLimits';

    const app = express();

    // ... other middleware

    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/devices', featureGate('fileTransferEnabled'), deviceRoutes); // Example feature gate usage
    app.use('/api/v1/sessions', sessionAuditRoutes);
    app.use('/api/v1', healthRoutes);

    // ... other routes
    ```

-   **`featureGateMiddleware.ts`:** The `getUserPlanType` function is a placeholder. It **MUST** be replaced with actual logic to retrieve the authenticated user's plan type from your authentication system (e.g., JWT payload, database lookup).

### 2.3. Implement Service Logic

-   **`deviceRegistrationService.ts`:** Implement the logic for registering new devices, associating them with users, and handling initial setup.
-   **`devicePasswordService.ts`:** Implement the logic for generating, rotating, and validating device access passwords.
-   **`sessionEventService.ts`:** Implement the logic for logging various session events (connect, disconnect, input, file transfer, etc.) to the database.

### 2.4. Logging with Winston

-   **`apps/api/src/utils/logger.ts`:** The `winston` logger is configured for console output. For production, configure file transports or integrate with an external logging service (e.g., ELK, Datadog).

## 3. Web Application (`apps/web`) Specifics

### 3.1. Integrate `ToastProvider`

-   **`apps/web/src/pages/_app.tsx` or `index.tsx`:** Wrap your main application component with `ToastProvider` to enable global toast notifications.

    ```typescript
    // Example in apps/web/src/pages/_app.tsx
    import { ToastProvider } from '../components/ui/ToastNotification';

    function MyApp({ Component, pageProps }) {
      return (
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      );
    }
    export default MyApp;
    ```

### 3.2. Implement `AuthGuard`

-   **`apps/web/src/lib/auth/AuthGuard.tsx`:** Integrate this component into your protected routes to ensure only authenticated users can access them. The `useUserPlan` hook in `FeatureGate.tsx` also needs to be implemented to fetch the actual user plan.

### 3.3. API Client Integration

-   **`apps/web/src/lib/apiClient.ts`:** Ensure this base client is used consistently across all API calls from the web application.

## 4. Desktop Application (`apps/desktop`) Specifics

### 4.1. WebRTC and Socket.IO Integration

-   **`webrtcErrorMapper.ts`:** Integrate this mapper into your WebRTC error handling logic.
-   **`webrtcStatsCollector.ts`:** Instantiate and use this collector during active sessions to gather performance metrics. Integrate the `onStatsUpdate` callback with your UI (e.g., `DiagnosticsPanel`) or a logging mechanism.
-   **`qualityHistoryStore.ts`:** Use this store to maintain a history of session quality metrics.

### 4.2. Feature Gate Helpers

-   **`featureGateHelpers.ts`:** The `getDesktopUserPlan` function is a placeholder. It **MUST** be replaced with actual logic to retrieve the authenticated user's plan type, likely from local storage after a successful login or an API call.

### 4.3. Diagnostics and Logging

-   **`DiagnosticsPanel.tsx` and `LogsViewer.tsx`:** Implement the actual logic to fetch and display system information, network stats, WebRTC stats, and application logs within these components.
-   **`diagnosticsExporter.ts`:** Integrate this utility to allow users to export diagnostic data for troubleshooting.

## 5. Testing and CI/CD

### 5.1. Implement Tests

-   **`packages/shared/src/tests/`:** Fill in the actual test logic for contract tests, plan limits, and error handling.
-   **`apps/api/src/tests/`:** Implement comprehensive unit and integration tests for backend services and routes.
-   **`apps/desktop/src/tests/`:** Implement tests for desktop-specific services and components.
-   **`apps/web/src/components/__tests__/`:** Implement tests for web components.

### 5.2. Configure CI Workflow

-   **`.github/workflows/ci.yml`:** Ensure this workflow is correctly configured in your GitHub repository. It will run `yarn install`, `yarn lint`, `yarn test`, and build commands for all applications. Adjust `node-version` as needed.

## 6. Documentation Updates

-   **`README.md`:** Review and update the main README to reflect the current state of the project and provide accurate getting started instructions.
-   **`docs/development/local-setup.md`:** Ensure this guide is accurate and includes all necessary steps for a new developer to set up their environment.
-   **`docs/api/api-reference.md` and `docs/api/socket-reference.md`:** Populate these with concrete examples, request/response schemas, and detailed explanations as API implementations progress.
-   **`docs/architecture/data-flow.d2`:** Render this D2 diagram to an image (e.g., PNG) and embed it in `docs/architecture/overview.md`.

## 7. Addressing Risks (from `generated-batch-8-risk-register.md`)

-   **Database Schema Migrations:** (Addressed in 2.1)
-   **Security Configuration:** Ensure `JWT_SECRET` and `SOCKET_IO_SECRET` are strong and managed securely in production environments. Refer to `production-config.md`.
-   **WebRTC Performance:** Monitor and optimize `webrtcStatsCollector.ts` interval and processing. Conduct performance testing.
-   **Incomplete Error Handling:** Continuously test and refine error handling. Expand `error-catalog.md` as needed.
-   **Feature Gate Enforcement:** **CRITICAL:** Implement robust backend enforcement for feature gates (see 2.2 and 4.2). Client-side gates are for UX only.
-   **Testing Infrastructure:** Prioritize implementing actual test logic for all placeholder test files (see 5.1).

By following these notes, the integration of Batch 8 files should proceed smoothly, leading to a more robust and well-documented RemoteDesk application.
