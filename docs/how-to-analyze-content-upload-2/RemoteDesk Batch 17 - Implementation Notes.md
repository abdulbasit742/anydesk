# RemoteDesk Batch 17 - Implementation Notes

This document provides detailed implementation notes for the files generated in Batch 17 of the RemoteDesk SaaS project. It covers dependencies, potential migration steps, and instructions for running, type-checking, and testing the new components.

## Overview
Batch 17 focused on enhancing the RemoteDesk platform with critical infrastructure for desktop distribution, auto-update, diagnostics, enterprise controls, and improved developer and user experiences. The generated files are primarily TypeScript/React components, API routes, and Markdown documentation.

## Dependencies Added
No new external `npm` or `pip` dependencies were explicitly added in this batch. All generated code relies on existing project structures and commonly used libraries (e.g., `react`, `@chakra-ui/react`, `express`).

If any new UI components were introduced (e.g., `InAppFeedback.tsx`, `GuidedTour.tsx`), they assume the presence of `@chakra-ui/react` for styling and `framer-motion` for animations. If these are not already installed in the `apps/web` project, they would need to be added:

```bash
cd remotedesk/apps/web
pnpm add @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

## Migration Steps

### 1. API Route Integration
- The new API routes for Plan Limits (`plan-limits.routes.ts`), Privacy (`privacy.routes.ts`), and Admin Sessions/Devices (mocked in `session.api.ts`, `device.api.ts`) need to be integrated into the main API server application.
- **Action**: Add the new route modules to the main `remotedesk/apps/api/src/index.ts` or equivalent API entry point.

Example `remotedesk/apps/api/src/index.ts` (conceptual update):
```typescript
import express from 'express';
// ... other imports
import planLimitsRoutes from './plan-limits/plan-limits.routes';
import privacyRoutes from './privacy/privacy.routes';
import adminSessionRoutes from './admin/sessions/session.routes';
import adminDeviceRoutes from './admin/devices/device.routes';

const app = express();
// ... other middleware

app.use('/api/admin/plan-limits', planLimitsRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/admin/sessions', adminSessionRoutes);
app.use('/api/admin/devices', adminDeviceRoutes);

// ... start server
```

### 2. Prisma Schema Changes (Potential)
- While no explicit `prisma.schema` changes were generated, features like Plan Limits, Security Events, and Notifications would typically require database schema modifications.
- **Action**: Review the DTOs (`plan-limits.dto.ts`, `security-event.types.ts`, `notification.types.ts`, `privacy-settings.dto.ts`) and implement corresponding Prisma models.
- **Example**: For `PlanFeature` and `SubscriptionPlan`, new models would be needed.

```prisma
// remotedesk/apps/api/prisma/schema.prisma (conceptual additions)
model SubscriptionPlan {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  priceMonthly Int
  priceAnnually Int
  isDefault   Boolean  @default(false)
  limits      Json // Store PlanLimit[] as JSON
}

model OrganizationPlanStatus {
  id              String         @id @default(cuid())
  organizationId  String         @unique
  currentPlanId   String
  currentPlan     SubscriptionPlan @relation(fields: [currentPlanId], references: [id])
  usage           Json // Store usage as JSON
  overages        Json // Store overages as JSON
  nextBillingDate DateTime
}

// ... similar models for SecurityEvent, Notification, UserPrivacySettings, OrganizationPrivacySettings
```
- **Migration**: After updating `prisma.schema`, run `npx prisma migrate dev --name <migration-name>` to generate and apply database migrations.

## How to Run / Typecheck / Test

### 1. Project Setup
Assuming the `remotedesk` project structure is already set up with `pnpm` workspaces:

```bash
cd remotedesk
pnpm install
```

### 2. Typechecking
To typecheck the entire project (or specific apps/packages):

```bash
pnpm typecheck
# Or for a specific app:
cd apps/web && pnpm typecheck
cd apps/api && pnpm typecheck
```

### 3. Running the Web Application (Frontend)
To run the Next.js web application:

```bash
cd remotedesk/apps/web
pnpm dev
```
This will typically start the development server on `http://localhost:3000`.

### 4. Running the API Server (Backend)
To run the Express API server:

```bash
cd remotedesk/apps/api
pnpm dev # Or pnpm start if a build step is involved
```
This will typically start the API server on `http://localhost:3001` (or configured port).

### 5. Running Tests
Placeholder test files (`.test.ts`, `.test.tsx`) have been created for each area. To run these tests, you would typically use a test runner like Jest:

```bash
cd remotedesk
pnpm test
# Or for specific apps/packages:
cd apps/web && pnpm test
cd apps/api && pnpm test
```

**Note**: The generated test files are placeholders and would require actual test logic to be implemented to provide meaningful coverage. They serve as a guide for where tests should reside.

## Manual Steps Required
- **Database Setup**: If Prisma models are introduced, a database (e.g., PostgreSQL, MySQL) needs to be set up and configured for the API service.
- **Environment Variables**: Securely configure environment variables for API keys, database connections, and other sensitive information in `.env` files.
- **UI Integration**: The generated UI components (e.g., `ApiKeyManagementUI.tsx`, `NotificationCenter.tsx`, `PlanLimitsDashboard.tsx`, `SecurityEventsDashboard.tsx`, `UserPrivacySettingsUI.tsx`, `OrganizationPrivacySettingsUI.tsx`, `InAppFeedback.tsx`, `GuidedTour.tsx`) need to be integrated into the main web application's navigation and routing.
- **Desktop Client Build System**: The desktop distribution files (`nsis-config.nsi`, `dmg-docs.md`, `appimage-docs.md`) require integration with a build system (e.g., Electron Builder, custom scripts) to generate actual installers.
- **Auto-update Server**: An auto-update server (e.g., Squirrel.Windows, Squirrel.Mac, custom HTTP server) needs to be set up to serve release metadata and binaries.

## Known Risks
Refer to `generated-batch-17-risk-register.md` for a detailed list of known risks.


# RemoteDesk Batch 18 - Implementation Notes

This document provides detailed implementation notes for the files generated in Batch 18 of the RemoteDesk SaaS project. It covers dependencies, potential migration steps, and instructions for running, type-checking, and testing the new components.

## Overview
Batch 18 focused on Advanced Remote Control Features, Collaboration & Interactive Tools, Mobile Readiness & SDKs, and Enterprise Integration & Security. The generated files include TypeScript DTOs, React/TypeScript UI components, Node.js/TypeScript API services, and comprehensive Markdown documentation.

## Dependencies Added

- `axios`: Used for making HTTP requests in SIEM and ITSM integration services.

To install this dependency, navigate to the `remotedesk/apps/api` directory and run:

```bash
cd remotedesk/apps/api
pnpm add axios
```

## Migration Steps

### 1. API Route Integration
- The new API routes for Mobile Device Management (`mobile-device.routes.ts`) and Advanced Audit (`audit.routes.ts`) need to be integrated into the main API server application.
- **Action**: Add the new route modules to the main `remotedesk/apps/api/src/index.ts` or equivalent API entry point.

Example `remotedesk/apps/api/src/index.ts` (conceptual update):
```typescript
import express from 'express';
// ... other imports
import mobileDeviceRoutes from './mobile/mobile-device.routes';
import auditRoutes from './enterprise/audit.routes';

const app = express();
// ... other middleware

app.use('/api/mobile', mobileDeviceRoutes);
app.use('/api/enterprise/audit', auditRoutes);

// ... start server
```

### 2. Prisma Schema Changes (Potential)
- Features like IdP Integration, ITSM, SIEM, Push Notifications, Mobile Devices, Annotations, Chat Messages, Multi-User Sessions, and Session Invitations would typically require database schema modifications if persistent storage is desired for these entities.
- **Action**: Review the DTOs (`idp-integration.dto.ts`, `itsm.dto.ts`, `siem.dto.ts`, `push-notification.dto.ts`, `mobile-device.dto.ts`, `annotation.dto.ts`, `chat.dto.ts`, `multi-user-session.dto.ts`) and implement corresponding Prisma models.

**Example**: For `IdpConfig`, `ItsmTicket`, `SiemEvent`, `PushNotificationSubscription`, `MobileDeviceInfo`, `Annotation`, `ChatMessage`, `SessionParticipant`, and `SessionInvitation`, new models would be needed.

```prisma
// remotedesk/apps/api/prisma/schema.prisma (conceptual additions)
model IdpConfig {
  id             String @id @default(cuid())
  organizationId String
  providerType   String
  name           String
  enabled        Boolean
  // ... other fields from IdpConfig DTO
}

model ItsmTicket {
  id                   String  @id @default(cuid())
  type                 String
  priority             String
  summary              String
  description          String
  status               String
  requesterId          String
  assignedTo           String?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  remoteDeskSessionId  String?
  remoteDeskDeviceId   String?
}

model SiemEvent {
  id          String   @id @default(cuid())
  timestamp   DateTime @default(now())
  eventType   String
  severity    String
  userId      String?
  userName    String?
  sessionId   String?
  deviceId    String?
  sourceIp    String?
  details     Json
}

model PushNotificationSubscription {
  userId       String
  deviceId     String
  platform     String
  token        String @unique
  subscribedAt DateTime @default(now())

  @@id([userId, deviceId])
}

model MobileDeviceInfo {
  deviceId    String @id
  userId      String
  platform    String
  osVersion   String
  model       String
  appVersion  String
  lastSeen    DateTime @default(now())
  pushToken   String?
}

model Annotation {
  id          String   @id @default(cuid())
  sessionId   String
  userId      String
  tool        String
  color       String
  strokeWidth Int
  points      Json
  text        String?
  displayId   String?
  createdAt   DateTime @default(now())
}

model ChatMessage {
  id              String   @id @default(cuid())
  sessionId       String
  senderId        String
  senderName      String
  timestamp       DateTime @default(now())
  content         String
  isSystemMessage Boolean  @default(false)
}

model SessionParticipant {
  userId      String
  sessionId   String
  userName    String
  role        String
  canControl  Boolean
  canAnnotate Boolean
  canChat     Boolean
  isConnected Boolean

  @@id([userId, sessionId])
}

model SessionInvitation {
  id              String   @id @default(cuid())
  sessionId       String
  invitedByUserId String
  invitedToUserId String
  role            String
  status          String
  createdAt       DateTime @default(now())
  expiresAt       DateTime
}
```
- **Migration**: After updating `prisma.schema`, run `npx prisma migrate dev --name <migration-name>` to generate and apply database migrations.

## Manual Steps Required

- **Environment Variables**: Securely configure environment variables for SIEM and ITSM API endpoints and keys in `.env` files.
- **UI Integration**: The generated UI components (`MultiMonitorSelectionUI.tsx`, `AnnotationToolbar.tsx`, `SessionParticipantsList.tsx`, `InviteParticipantUI.tsx`, `ChatWindow.tsx`, `AdvancedAuditLogViewer.tsx`) need to be integrated into the main web/desktop application's navigation and routing.
- **Mobile Push Notification Handling**: Implement platform-specific push notification handling in mobile apps (FCM/APNS integration).
- **Audio/Video Capture and Streaming**: Implement actual audio/video capture and streaming logic in `RemoteAudioService` and `SessionRecordingService`, connecting to WebRTC data channels.
- **Local Printing**: Implement actual local printing logic in `RemotePrintingService` using native OS APIs.
- **Local Clipboard Interaction**: Implement actual local clipboard interaction in `AdvancedClipboardService` using native OS APIs.
- **Annotation Rendering**: Integrate `AnnotationService` with a canvas rendering layer for displaying annotations on the remote screen.
- **External System Setup**: Set up and configure external SIEM and ITSM systems to receive events and create tickets from RemoteDesk.
- **IdP Configuration**: Configure IdP settings (SAML metadata, SCIM endpoints) in the RemoteDesk admin panel.

## Known Risks
Refer to `remotedesk/generated-batch-18-risk-register.md` for a detailed list of known risks.


# RemoteDesk Batch 19 - Implementation Notes

This document provides detailed implementation notes for the files generated in Batch 19 of the RemoteDesk SaaS project. It covers dependencies, potential migration steps, and instructions for running, type-checking, and testing the new components.

## Overview
Batch 19 focused on AI-Powered Assistance, Advanced Security & Compliance, Performance Optimizations, and Customization & Extensibility. The generated files include TypeScript DTOs, React/TypeScript UI components, Node.js/TypeScript API services, and comprehensive Markdown documentation.

## Dependencies Added

- `axios`: Used for making HTTP requests in Advanced Webhooks Service.

To install this dependency, navigate to the `remotedesk/apps/api` directory and run:

```bash
cd remotedesk/apps/api
pnpm add axios
```

## Migration Steps

### 1. API Route Integration
- The new API routes for AI features (`ai.routes.ts`), Security features (`security.routes.ts`), Performance features (`performance.routes.ts`), and Customization features (`customization.routes.ts`) need to be integrated into the main API server application.
- **Action**: Add the new route modules to the main `remotedesk/apps/api/src/index.ts` or equivalent API entry point.

Example `remotedesk/apps/api/src/index.ts` (conceptual update):
```typescript
import express from 'express';
// ... other imports
import aiRoutes from './ai/ai.routes';
import securityRoutes from './security/security.routes';
import performanceRoutes from './performance/performance.routes';
import customizationRoutes from './customization/customization.routes';

const app = express();
// ... other middleware

app.use('/api/ai', aiRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/customization', customizationRoutes);

// ... start server
```

### 2. Prisma Schema Changes (Potential)
- Features like AI Session Insights, Automated Troubleshooting, Session Summaries, DLP, Threat Detection, Compliance Reporting, Advanced Webhooks, Plugin System, and White-labeling would typically require database schema modifications if persistent storage is desired for these entities.
- **Action**: Review the DTOs (`session-insights.dto.ts`, `troubleshooting.dto.ts`, `session-summary.dto.ts`, `dlp.dto.ts`, `threat-detection.dto.ts`, `compliance-reporting.dto.ts`, `advanced-webhooks.dto.ts`, `plugin-system.dto.ts`, `white-labeling.dto.ts`) and implement corresponding Prisma models.

**Example**: For `AISessionInsight`, `AutomatedTroubleshootingLog`, `SessionSummary`, `DlpIncident`, `ThreatAlert`, `ComplianceReport`, `WebhookSubscription`, `WebhookDeliveryAttempt`, `InstalledPlugin`, and `WhiteLabelingConfig`, new models would be needed.

```prisma
// remotedesk/apps/api/prisma/schema.prisma (conceptual additions)
model AISessionInsight {
  id          String   @id @default(cuid())
  sessionId   String
  insightType String
  summary     String
  details     Json
  timestamp   DateTime @default(now())
}

model AutomatedTroubleshootingLog {
  id          String   @id @default(cuid())
  sessionId   String
  problem     String
  solution    String
  status      String
  timestamp   DateTime @default(now())
}

model SessionSummary {
  id          String   @id @default(cuid())
  sessionId   String   @unique
  summaryText String
  keywords    Json
  duration    Int
  timestamp   DateTime @default(now())
}

model DlpIncident {
  id          String   @id @default(cuid())
  sessionId   String
  eventType   String
  dataDetected String
  actionTaken String
  timestamp   DateTime @default(now())
}

model ThreatAlert {
  id          String   @id @default(cuid())
  sessionId   String?
  deviceId    String?
  alertType   String
  severity    String
  description String
  timestamp   DateTime @default(now())
}

model ComplianceReport {
  id          String   @id @default(cuid())
  reportType  String
  periodStart DateTime
  periodEnd   DateTime
  status      String
  reportData  Json
  generatedAt DateTime @default(now())
}

model WebhookSubscription {
  id              String   @id @default(cuid())
  organizationId  String
  name            String
  targetUrl       String
  secret          String
  events          Json
  status          String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  retryCount      Int      @default(0)
  filterConditions Json?
}

model WebhookDeliveryAttempt {
  id             String   @id @default(cuid())
  subscriptionId String
  timestamp      DateTime @default(now())
  eventType      String
  payload        Json
  statusCode     Int
  success        Boolean
  errorMessage   String?
  responseBody   String?
}

model InstalledPlugin {
  id             String   @id
  organizationId String
  manifest       Json
  status         String
  configuration  Json
  installedAt    DateTime @default(now())
  lastUpdatedAt  DateTime @updatedAt
  enabledByUserId String
}

model WhiteLabelingConfig {
  organizationId            String   @id
  enabled                   Boolean
  customDomain              String?
  logoUrl                   String?
  faviconUrl                String?
  primaryColor              String?
  secondaryColor            String?
  supportEmail              String?
  supportPhone              String?
  customCss                 String?
  customJs                  String?
  desktopClientBrandingEnabled Boolean
  desktopClientLogoUrl      String?
  desktopClientAppName      String?
}
```
- **Migration**: After updating `prisma.schema`, run `npx prisma migrate dev --name <migration-name>` to generate and apply database migrations.

## Manual Steps Required

- **AI Model Integration**: The AI services (`SessionInsightsService`, `AutomatedTroubleshootingService`, `SessionSummaryService`) are conceptual. Actual integration with external AI/ML models (e.g., OpenAI, custom ML models) would be required.
- **DLP Pattern Definition**: Define specific regex patterns or ML models for DLP to detect sensitive data.
- **Threat Detection Rules**: Configure rules and heuristics for the `ThreatDetectionService`.
- **Compliance Standards**: Implement the specific logic for generating reports based on various compliance standards within `ComplianceReportingService`.
- **WebRTC Optimization Integration**: The `WebRtcOptimizationService` on the desktop client needs to be integrated with the actual WebRTC peer connection logic to dynamically adjust parameters.
- **Edge Routing Client-side Logic**: The desktop/web clients need to implement logic to query the `EdgeRoutingService` and use the returned optimal STUN/TURN servers.
- **Resource Management Agent**: Implement agents on servers to collect and send `ResourceMetric` data to the `ResourceManagementService`.
- **Plugin Execution Environment**: For `sandboxPlugins` to be effective, a secure execution environment (e.g., isolated processes, WebAssembly runtime) needs to be implemented for running plugin code.
- **White-labeling UI/UX Integration**: The web and desktop clients need to dynamically fetch and apply the `WhiteLabelingConfig` to rebrand their interfaces.
- **Custom Domain Setup**: For white-labeling with custom domains, DNS records (e.g., CNAME) will need to be configured to point to RemoteDesk servers.

## Known Risks
Refer to `remotedesk/generated-batch-19-risk-register.md` for a detailed list of known risks.


# RemoteDesk Batch 20 - Implementation Notes

This document provides detailed implementation notes for the files generated in Batch 20 of the RemoteDesk SaaS project. It covers dependencies, potential migration steps, and instructions for running, type-checking, and testing the new components.

## Overview
Batch 20 focused on Advanced Mobile Features, Predictive Maintenance, AR Support, and the Developer Ecosystem. The generated files include TypeScript DTOs, React/TypeScript UI components, Node.js/TypeScript API services, and comprehensive Markdown documentation.

## Dependencies Added

No new external `npm` or `pip` dependencies were explicitly added in this batch. All generated code relies on existing project structures and commonly used libraries (e.g., `react`, `express`).

## Migration Steps

### 1. API Route Integration
- The new API routes for Advanced Mobile Features (`mobile-advanced.routes.ts`), Predictive Maintenance (`predictive-maintenance.routes.ts`), AR Support (`ar.routes.ts`), Analytics (`analytics.routes.ts`), and Marketplace (`marketplace.routes.ts`) need to be integrated into the main API server application.
- **Action**: Add the new route modules to the main `remotedesk/apps/api/src/index.ts` or equivalent API entry point.

Example `remotedesk/apps/api/src/index.ts` (conceptual update):
```typescript
import express from 'express';
// ... other imports
import mobileAdvancedRoutes from './mobile/mobile-advanced.routes';
import predictiveMaintenanceRoutes from './predictive-maintenance/predictive-maintenance.routes';
import arRoutes from './ar/ar.routes';
import analyticsRoutes from './analytics/analytics.routes';
import marketplaceRoutes from './developer-ecosystem/marketplace.routes';

const app = express();
// ... other middleware

app.use('/api/mobile-advanced', mobileAdvancedRoutes);
app.use('/api/predictive-maintenance', predictiveMaintenanceRoutes);
app.use('/api/ar', arRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// ... start server
```

### 2. Prisma Schema Changes (Potential)
- Features like Mobile Host sessions, Biometric Authentication, AI Failure Predictions, Automated Self-healing Actions, AR Streams, AR Annotations, Analytics Dashboards, Marketplace Items, and Marketplace Reviews would typically require database schema modifications if persistent storage is desired for these entities.
- **Action**: Review the DTOs (`mobile-host.dto.ts`, `biometric-auth.dto.ts`, `failure-prediction.dto.ts`, `self-healing.dto.ts`, `ar.dto.ts`, `analytics.dto.ts`, `marketplace.dto.ts`) and implement corresponding Prisma models.

**Example**: For `MobileHostSession`, `BiometricAuthRecord`, `FailurePredictionEvent`, `SelfHealingAction`, `ARStream`, `ARAnnotation`, `UserDashboardConfig`, `MarketplaceItem`, and `MarketplaceReview`, new models would be needed.

```prisma
// remotedesk/apps/api/prisma/schema.prisma (conceptual additions)
model MobileHostSession {
  id            String   @id @default(cuid())
  deviceId      String
  userId        String
  status        String
  startedAt     DateTime @default(now())
  endedAt       DateTime?
  // ... other fields from MobileHostSession DTO
}

model BiometricAuthRecord {
  id            String   @id @default(cuid())
  userId        String
  deviceId      String
  authType      String
  success       Boolean
  timestamp     DateTime @default(now())
  // ... other fields from BiometricAuth DTO
}

model FailurePredictionEvent {
  id                  String   @id @default(cuid())
  deviceId            String
  predictedFailureType String
  severity            String
  predictionScore     Float
  predictedAt         DateTime @default(now())
  estimatedFailureTime DateTime?
  status              String
  details             Json
}

model SelfHealingAction {
  id            String   @id @default(cuid())
  deviceId      String
  actionType    String
  triggeredBy   String
  triggeredAt   DateTime @default(now())
  status        String
  details       Json
  logs          Json?
  failureReason String?
}

model ARStream {
  id            String   @id @default(cuid())
  sessionId     String   @unique
  hostDeviceId  String
  viewerDeviceId String
  status        String
  startedAt     DateTime @default(now())
  endedAt       DateTime?
  // ... other fields from ARStreamInfo DTO
}

model ARAnnotation {
  id            String   @id @default(cuid())
  sessionId     String
  userId        String
  type          String
  position      Json
  orientation   Json?
  text          String?
  color         String?
  strokeWidth   Int?
  points        Json?
  targetAnchorId String?
  timestamp     DateTime @default(now())
}

model UserDashboardConfig {
  id            String   @id @default(cuid())
  userId        String
  dashboardId   String   @unique
  name          String
  widgets       Json
  lastModified  DateTime @default(now())
}

model MarketplaceItem {
  id                  String   @id @default(cuid())
  developerId         String
  name                String
  description         String
  type                String
  status              String
  version             String
  latestReleaseDate   DateTime @default(now())
  pricingModel        String
  price               Float?
  currency            String?
  averageRating       Float
  totalReviews        Int
  iconUrl             String
  bannerUrl           String?
  screenshots         Json?
  documentationUrl    String
  supportEmail        String
  privacyPolicyUrl    String
  termsOfServiceUrl   String
  installationGuideUrl String
  tags                Json
  compatibleVersions  Json
  manifestUrl         String
  webhookEvents       Json?
  apiScopesRequired   Json?
}

model MarketplaceReview {
  id            String   @id @default(cuid())
  itemId        String
  userId        String
  rating        Int
  comment       String
  createdAt     DateTime @default(now())
}
```
- **Migration**: After updating `prisma.schema`, run `npx prisma migrate dev --name <migration-name>` to generate and apply database migrations.

## Manual Steps Required

- **Mobile App Integration**: The generated mobile services (`MobileGestureService.ts`, `BiometricAuthService.ts`) need to be integrated into the native mobile applications (iOS/Android) to interact with platform-specific APIs for gestures and biometrics.
- **AR SDK Integration**: The AR features require integration with native AR SDKs (ARKit for iOS, ARCore for Android) within the mobile application to capture AR data and render annotations.
- **AI Model Integration**: The `AIFailurePredictionService` and `AutomatedSelfHealingService` are currently conceptual. They require integration with actual machine learning models and a data pipeline for telemetry collection and prediction inference.
- **Analytics UI**: The `AnalyticsService` provides data, but a frontend UI (`remotedesk/apps/web/src/admin/analytics`) needs to be developed to visualize these reports and manage user dashboards.
- **Marketplace UI**: A comprehensive frontend UI (`remotedesk/apps/web/src/marketplace`) is needed for users to browse, search, install, and review marketplace items, and for developers to submit and manage their items.
- **Real-time Communication**: For AR annotations and potentially mobile host interactions, a real-time communication layer (e.g., WebSockets) needs to be implemented and integrated with the `ARService` and `MobileHostService` to broadcast updates to connected clients.
- **Environment Variables**: Securely configure environment variables for any external services (e.g., AI model endpoints, payment gateways for marketplace) in `.env` files.

## Known Risks
Refer to `remotedesk/generated-batch-20-risk-register.md` for a detailed list of known risks.
