# Dual Repository Audit Report

**Date:** June 23, 2026
**Repositories:** `anydesk` (Core Backend & Desktop) and `anydesklovable` (Web Dashboard)
**Auditor:** Manus AI

## 1. Executive Summary

A comprehensive audit was performed across both the `anydesk` (core platform) and `anydesklovable` (frontend dashboard) repositories to evaluate their current state, security posture, and readiness for integration into a unified AnyDesk-style remote desktop SaaS platform (internal product name: RemoteDesk).

Both repositories demonstrate a strong architectural foundation but require significant alignment. The `anydesk` repo uses a pnpm workspace monorepo structure containing the Express API, Electron desktop client, and shared packages. The `anydesklovable` repo is a TanStack Start web application heavily integrated with Supabase for authentication and database management.

**Key Findings:**
* **Architecture Mismatch:** `anydesk` uses a Prisma/Express API, while `anydesklovable` relies directly on Supabase client-side queries and RLS.
* **Build Issues:** The `anydesk` repository currently fails its `typecheck` and `build` scripts due to syntax errors in `packages/shared/src/hardening/csvExport.ts`.
* **Security:** No secrets are committed in `anydesk`. However, `anydesklovable` contains an `.env.example` with Supabase keys (which are public, but should be managed carefully).
* **Missing Contracts:** There is a lack of shared TypeScript interfaces between the Supabase dashboard and the core Socket.IO/WebRTC signaling server.

## 2. Repository 1: `anydesk` (Core Platform)

### 2.1 Structure and Components

* **Workspaces:** Configured as a pnpm workspace (though `pnpm-workspace.yaml` was missing and had to be added) containing `apps/api`, `apps/web`, `apps/desktop`, `packages/shared`, and `packages/client-sdk`.
* **apps/api:** Express server with Prisma ORM and Socket.IO signaling. Routes exist for devices, sessions, users, subscriptions, connectors, and launch operations.
* **apps/desktop:** Electron client. The main process handles security settings, and a preload script bridges IPC. A WebRTC service handles the actual peer-to-peer connection.
* **packages/shared:** Contains shared event names, socket types, and some utility functions.
* **packages/client-sdk:** A wrapper for API interactions.

### 2.2 Completion Status

* **Complete:** Basic workspace scaffolding, Express API routing structure, Prisma schema foundation, Socket.IO basic setup, Electron IPC structure.
* **Incomplete/Mock:** The actual remote control logic (input injection, screen capture streaming) appears to be in early stages. Many routes are stubbed.
* **Build Scripts:** `npm run dev:*`, `npm run build`, `npm run typecheck`. The build currently fails due to a broken regex and missing template literal closing in `csvExport.ts`.

### 2.3 Security Risks

* **Build Failure:** The broken build prevents reliable testing of the security boundaries.
* **Unenforced Policies:** While the desktop client has UI for security settings, the backend enforcement of these policies during an active WebRTC session needs rigorous auditing.

### 2.4 Missing Elements

* **API Contracts:** Formalized DTOs between the dashboard and the API are not fully synchronized.
* **Desktop/WebRTC Work:** The signaling path needs to be securely tied to the session authorization state to prevent unauthorized WebRTC offers.

## 3. Repository 2: `anydesklovable` (Dashboard)

### 3.1 Structure and Components

* **Framework:** TanStack Start, React, Tailwind CSS, shadcn/ui.
* **Backend Integration:** Supabase (Auth, Database, RLS).
* **Pages:** Extensive UI coverage including Overview, Devices, Sessions, Team, Security, Policies (File Transfer, Clipboard, Remote Input), Billing, Support, and Admin.

### 3.2 Completion Status

* **Wired to Real Supabase:** Auth (`/login`, `/signup`), AppShell (user context), Devices list (`/dashboard/devices`), and Audit logs (`/dashboard/audit`).
* **Mock Data Fallback:** The application uses a sophisticated fallback mechanism (`src/lib/services/index.ts`). If Supabase returns empty, it falls back to mock data for almost all pages (Sessions, Billing, Admin, Support, specific Device details).

### 3.3 Security Risks

* **Mock Data Illusion:** The extensive mock data can give a false sense of completion. Security controls (like toggling remote input) currently only update local React state or mock stores, not the actual backend policy.
* **RLS Assumptions:** The application assumes Supabase Row Level Security is correctly configured to scope all queries to `team_id`.

### 3.4 Missing Elements

* **Missing Tables:** While `devices` and `audit_logs` exist, many tables required by the UI (e.g., `sessions`, `support_tickets`, `invoices`) are either missing or not fully wired.
* **Missing API/Client Hooks:** Mutations to actually trigger remote sessions via the `anydesk` signaling server are missing.
* **Missing Desktop Integration:** The dashboard has no real-time Socket.IO connection to the `anydesk` backend to see live desktop status changes.

## 4. Build, Lint, and Typecheck Results

### `anydesk`
* **Install:** `pnpm install` succeeds (after creating `pnpm-workspace.yaml`).
* **Typecheck:** **FAILS** (Exit code 2). Errors in `packages/shared/src/hardening/csvExport.ts` (Unterminated regular expression, missing semicolons, unterminated template literal).
* **Build:** **FAILS** due to the typecheck errors in the shared package, which cascades to the dependent workspace packages.

### `anydesklovable`
* **Install:** `npm install` succeeds.
* **Lint:** **FAILS** (Exit code 1). Over 26,000 formatting and linting errors, primarily due to Prettier formatting mismatches.
* **Build:** **SUCCEEDS**. Vite successfully builds the TanStack Start application.

## 5. Highest Risks

1. **Split Brain Backend:** The `anydesk` repo uses Prisma/Express, while `anydesklovable` queries Supabase directly. This will lead to state synchronization issues and security vulnerabilities if not resolved.
2. **Broken Core Build:** The `anydesk` repo cannot currently be built or tested reliably.
3. **Mock Data Reliance:** The dashboard looks complete but is largely non-functional regarding actual remote desktop operations.

## 6. Architecture Recommendations

1. **Source of Truth:** The `anydesk` Express/Prisma API should become the primary source of truth for session management, signaling, and complex business logic. Supabase should be relegated to Authentication and raw database storage (if Prisma connects to it).
2. **Dashboard Integration:** The `anydesklovable` UI should be updated to make REST API calls to the `anydesk` Express server for remote desktop operations, rather than relying solely on direct Supabase client queries, ensuring all actions pass through the core business and security logic.
3. **Shared Types:** All shared types (Devices, Sessions, Policies) must be centralized in `anydesk/packages/shared` and imported by the dashboard.
