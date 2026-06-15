# RemoteDesk 80-File Feature Pack - Review Required Files

The following files from the generated feature pack require manual review and careful integration into your existing codebase. They cannot be safely copied directly without potential conflicts or missing configurations.

## API Service (`apps/api`)

*   **`apps/api/prisma/schema.prisma`**
    *   **Reason**: Contains new Prisma models (`Device`, `SecurityPolicy`, `AuditLogEntry`, `NetworkConfiguration`, `NetworkMetrics`, `SessionRecording`).
    *   **Action**: Manually merge these models into your existing `schema.prisma` file. Ensure no naming conflicts exist. Run `pnpm prisma migrate dev` and `pnpm prisma generate` after merging.
*   **`apps/api/src/routes/sessionRecording.routes.ts`**
    *   **Reason**: New API routes for session recording.
    *   **Action**: Integrate into your main API router (e.g., `app.use('/api/session-recordings', sessionRecordingRoutes)`).
*   **`apps/api/src/routes/device.routes.ts`**
    *   **Reason**: New API routes for device management.
    *   **Action**: Integrate into your main API router (e.g., `app.use('/api/devices', deviceRoutes)`).
*   **`apps/api/src/routes/security.routes.ts`**
    *   **Reason**: New API routes for security policies and audit logs.
    *   **Action**: Integrate into your main API router (e.g., `app.use('/api/security', securityRoutes)`).
*   **`apps/api/src/routes/network.routes.ts`**
    *   **Reason**: New API routes for network configurations and metrics.
    *   **Action**: Integrate into your main API router (e.g., `app.use('/api/network', networkRoutes)`).

## Desktop Application (`apps/desktop`)

*   **`apps/desktop/src/main/sessionRecording/index.ts`**
    *   **Reason**: Electron main process handlers for session recording.
    *   **Action**: Import and call `initializeSessionRecordingHandlers()` in your main Electron initialization file.
*   **`apps/desktop/src/preload/sessionRecording/index.ts`**
    *   **Reason**: Electron preload script for session recording.
    *   **Action**: Integrate the `contextBridge.exposeInMainWorld` call into your main preload script.
*   **`apps/desktop/src/main/chat/index.ts`**
    *   **Reason**: Electron main process handlers for chat.
    *   **Action**: Import and call `initializeChatHandlers()` in your main Electron initialization file.
*   **`apps/desktop/src/preload/chat/index.ts`**
    *   **Reason**: Electron preload script for chat.
    *   **Action**: Integrate the `contextBridge.exposeInMainWorld` call into your main preload script.
*   **`apps/desktop/src/main/deviceManagement/index.ts`**
    *   **Reason**: Electron main process handlers for device management.
    *   **Action**: Import and call `initializeDeviceManagementHandlers()` in your main Electron initialization file.
*   **`apps/desktop/src/preload/deviceManagement/index.ts`**
    *   **Reason**: Electron preload script for device management.
    *   **Action**: Integrate the `contextBridge.exposeInMainWorld` call into your main preload script.
*   **`apps/desktop/src/main/security/index.ts`**
    *   **Reason**: Electron main process handlers for security.
    *   **Action**: Import and call `initializeSecurityHandlers()` in your main Electron initialization file.
*   **`apps/desktop/src/preload/security/index.ts`**
    *   **Reason**: Electron preload script for security.
    *   **Action**: Integrate the `contextBridge.exposeInMainWorld` call into your main preload script.
*   **`apps/desktop/src/main/network/index.ts`**
    *   **Reason**: Electron main process handlers for network metrics.
    *   **Action**: Import and call `initializeNetworkHandlers()` in your main Electron initialization file.
*   **`apps/desktop/src/preload/network/index.ts`**
    *   **Reason**: Electron preload script for network metrics.
    *   **Action**: Integrate the `contextBridge.exposeInMainWorld` call into your main preload script.

## DevOps & Deployment

*   **`.github/workflows/ci-cd.yml`**
    *   **Reason**: GitHub Actions workflow for CI/CD.
    *   **Action**: Review and adapt to your existing CI/CD setup. Ensure all required secrets (e.g., `VERCEL_TOKEN`, `AWS_ACCESS_KEY_ID`) are configured in your GitHub repository.
*   **`docker-compose.yml`**
    *   **Reason**: Docker Compose configuration for local development.
    *   **Action**: Merge with your existing `docker-compose.yml`. Update environment variables and service names as necessary.
*   **`deploy/kubernetes/api-ingress.yaml`**
    *   **Reason**: Kubernetes ingress configuration.
    *   **Action**: Update `api.yourdomain.com` to your actual domain and verify ingress controller configuration.
*   **`deploy/kubernetes/remotedesk-secrets.yaml`**
    *   **Reason**: Kubernetes secret configuration.
    *   **Action**: Populate with base64 encoded values of your sensitive environment variables before applying.
*   **`deploy/terraform/ecs.tf`**
    *   **Reason**: Terraform configuration for AWS ECS.
    *   **Action**: Review IAM roles, security groups, and network configuration to ensure they align with your AWS environment.
*   **`deploy/terraform/variables.tf`**
    *   **Reason**: Terraform variables file.
    *   **Action**: Populate with actual values and sensitive data for your deployment environment.
*   **`deploy/terraform/main.tf`**
    *   **Reason**: Terraform main configuration file.
    *   **Action**: Review VPC, security groups, and load balancer configurations to ensure they align with your AWS environment.
*   **`scripts/deploy/deploy-api-ecs.sh`**
    *   **Reason**: Deployment script for API on ECS.
    *   **Action**: Update AWS region, account ID, and ECR/ECS names to match your environment.
*   **`scripts/deploy/deploy-web-vercel.sh`**
    *   **Reason**: Deployment script for Web on Vercel.
    *   **Action**: Ensure Vercel CLI is configured and necessary secrets are set in your CI/CD environment.
*   **`scripts/deploy/release-desktop.sh`**
    *   **Reason**: Deployment script for Desktop application.
    *   **Action**: Integrate with GitHub Releases or your preferred distribution mechanism.

Please review these files carefully before merging them into your `main` or `develop` branches.
