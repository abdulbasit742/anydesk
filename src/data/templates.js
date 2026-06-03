// data/templates.js
// 25 rich prompt templates for Bolt Studio Pro

export const PROMPT_TEMPLATES = [
  {
    id: "tpl_001",
    name: "Full-Stack SaaS Dashboard",
    category: "Dashboard",
    description: "Scaffold a complete SaaS dashboard with sidebar navigation, data tables, charts, and user management.",
    content: `Build a production-ready SaaS dashboard for {{appName}} with the following specifications:

## Stack
- Framework: {{framework}} (React / Next.js / Vue)
- Styling: {{stylingLib}} with dark/light mode support
- State: {{stateManager}}
- Charts: Recharts or Chart.js

## Layout
- Fixed sidebar (240px) with collapsible nav items
- Top header with breadcrumbs, notifications bell, user avatar
- Main content area with responsive grid

## Pages Required
1. /dashboard — KPI cards (Revenue, Users, Conversion, Churn), line chart (30d), top products table
2. /users — searchable, sortable data table with pagination, bulk actions
3. /analytics — date-range picker, multiple chart types, export CSV
4. /settings — profile, billing, notifications, API keys tabs

## Components
- <StatCard value trend icon />
- <DataTable columns data pagination filters />
- <ChartPanel type title data />
- <Sidebar navItems />

## Auth Guard
Wrap all routes with auth check; redirect to /login if unauthenticated.

Extra requirements: {{extraRequirements}}`,
    tags: ["dashboard", "saas", "fullstack", "charts", "tables"],
    platformCompatibility: ["bolt", "lovable", "cursor", "v0"],
    estimatedTokens: 420,
    icon: "LayoutDashboard",
    createdAt: "2025-11-01T09:00:00Z",
  },
  {
    id: "tpl_002",
    name: "REST API with Express + Prisma",
    category: "API Backend",
    description: "Generate a fully typed Express.js REST API with Prisma ORM, JWT auth, and validation.",
    content: `Create a production-grade REST API for {{projectName}} using:

## Tech Stack
- Runtime: Node.js 20 + TypeScript
- Framework: Express.js
- ORM: Prisma with {{database}} (PostgreSQL / MySQL / SQLite)
- Auth: JWT (access + refresh tokens)
- Validation: Zod schemas
- Logging: Winston

## Domain: {{domain}}

## Endpoints to implement:
### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

### {{resourceName}}
- GET    /api/{{resourceName}} (list, paginated)
- GET    /api/{{resourceName}}/:id
- POST   /api/{{resourceName}}
- PUT    /api/{{resourceName}}/:id
- DELETE /api/{{resourceName}}/:id

## Middleware Stack
1. helmet() — security headers
2. cors() with allowlist
3. rateLimit() — 100 req/15 min
4. jwtAuth() — on protected routes
5. zodValidate(schema) — per-route

## Prisma Schema
Generate the {{resourceName}} model with appropriate fields, relations, and indexes.

## Error Handling
Global error handler that returns { success, error, code, details } consistently.

Extra: {{extraFeatures}}`,
    tags: ["api", "express", "prisma", "jwt", "typescript"],
    platformCompatibility: ["bolt", "replit", "cursor", "manus"],
    estimatedTokens: 380,
    icon: "ServerCog",
    createdAt: "2025-11-03T10:00:00Z",
  },
  {
    id: "tpl_003",
    name: "Landing Page — SaaS Hero",
    category: "Landing Page",
    description: "High-converting SaaS landing page with hero, features, pricing, FAQ, and CTA sections.",
    content: `Design and build a conversion-optimized landing page for {{productName}} — {{productTagline}}.

## Sections (in order):
1. **Navbar** — logo, nav links, CTA button ("Get Started Free"), sticky on scroll
2. **Hero** — headline, sub-headline, email capture form, product screenshot/mockup, trust badges
3. **Social Proof** — logos of {{logoCount}} well-known companies using the product
4. **Features** — 6-card grid: icon, title, description. Features: {{featureList}}
5. **How It Works** — 3-step numbered visual flow
6. **Pricing** — 3 tiers (Free / Pro at \${{proPrice}}/mo / Enterprise), feature comparison table
7. **Testimonials** — 3 cards with avatar, name, role, quote
8. **FAQ** — accordion with 6 questions
9. **Final CTA** — centered banner, headline, button
10. **Footer** — links, social icons, legal

## Design System
- Primary: {{primaryColor}}
- Font: Inter or Geist
- Animations: subtle fade-in on scroll (Framer Motion or AOS)
- Mobile-first, fully responsive

## Copy Tone: {{copyTone}} (Professional / Playful / Technical)`,
    tags: ["landing", "marketing", "saas", "hero", "pricing"],
    platformCompatibility: ["bolt", "lovable", "v0"],
    estimatedTokens: 390,
    icon: "Rocket",
    createdAt: "2025-11-05T08:30:00Z",
  },
  {
    id: "tpl_004",
    name: "React Native Mobile App Scaffold",
    category: "Mobile App",
    description: "Full React Native app with navigation, auth flow, and core screens.",
    content: `Scaffold a React Native app for {{appName}} targeting {{platforms}} (iOS / Android / Both).

## Setup
- CLI: Expo SDK 51 + TypeScript
- Navigation: React Navigation v6 (Stack + Tab)
- State: Zustand
- API: Axios with interceptors
- Storage: AsyncStorage / SecureStore

## Screens
### Auth Flow
- SplashScreen — logo + lottie animation
- OnboardingScreen — 3-slide swiper
- LoginScreen — email, password, biometric option
- RegisterScreen — multi-step form
- ForgotPasswordScreen

### Main App (Bottom Tab)
- HomeScreen — welcome card, recent activity feed
- {{screen2Name}}Screen — {{screen2Description}}
- {{screen3Name}}Screen — {{screen3Description}}
- ProfileScreen — avatar, stats, settings list

## Components
- <AppButton variant size loading />
- <AppInput label error secureEntry />
- <Avatar source size />
- <BottomSheet snapPoints />

## Notifications: {{pushNotifications}} (Firebase FCM)
## Analytics: {{analytics}} (Mixpanel / Amplitude / None)`,
    tags: ["mobile", "react-native", "expo", "navigation", "auth"],
    platformCompatibility: ["bolt", "cursor", "manus"],
    estimatedTokens: 410,
    icon: "Smartphone",
    createdAt: "2025-11-07T11:00:00Z",
  },
  {
    id: "tpl_005",
    name: "Authentication System (JWT + OAuth)",
    category: "Auth",
    description: "Complete auth system with JWT, OAuth 2.0 providers, email verification, and password reset.",
    content: `Build a complete authentication system for {{projectName}} with the following providers and features:

## Providers
- Email + Password (primary)
- Google OAuth 2.0
- GitHub OAuth 2.0
- {{additionalProvider}} (optional)

## Features
### Registration
- Email, username, password (zxcvbn strength check)
- Email verification link (expire in 24h)
- CAPTCHA on form: {{captchaProvider}}

### Login
- Rate limiting: 5 failed attempts → 15 min lockout
- Remember me (30-day refresh token)
- MFA: TOTP (Google Authenticator compatible)

### Password Reset
- Email link (expire 1h, single-use)
- New password confirmation

### Session Management
- Access token: 15 min JWT
- Refresh token: 30 days, rotating
- Token blacklist on logout

## Database Models ({{database}})
\`\`\`
User { id, email, username, passwordHash, emailVerified, mfaEnabled, mfaSecret, createdAt }
Session { id, userId, refreshToken, userAgent, ipAddress, expiresAt }
OAuthAccount { id, userId, provider, providerAccountId }
\`\`\`

## Security: bcrypt rounds={{bcryptRounds}}, CSRF tokens, secure cookies`,
    tags: ["auth", "jwt", "oauth", "security", "mfa"],
    platformCompatibility: ["bolt", "lovable", "cursor", "manus", "replit"],
    estimatedTokens: 450,
    icon: "ShieldCheck",
    createdAt: "2025-11-09T14:00:00Z",
  },
  {
    id: "tpl_006",
    name: "Debug & Optimize React Performance",
    category: "Debug",
    description: "Diagnose and fix React performance bottlenecks including unnecessary re-renders, large bundle sizes, and slow lists.",
    content: `Analyze and optimize the following React {{component}} for performance issues:

\`\`\`jsx
{{pasteCodeHere}}
\`\`\`

## Task List
1. **Identify unnecessary re-renders** — add React DevTools Profiler annotations, then apply:
   - React.memo() on pure child components
   - useMemo() for expensive computations
   - useCallback() for stable function references

2. **Virtualize large lists** — if rendering >100 items, replace with react-window <FixedSizeList> or react-virtual

3. **Code splitting** — lazy() + Suspense on route-level components

4. **Bundle analysis** — identify heavy imports, suggest tree-shakeable alternatives

5. **State colocation** — move state down to minimize re-render scope

6. **Image optimization** — lazy loading, next/image or @unpic/react

## Output Format
- Annotated, fixed version of the code
- Explanation of each change
- Before/After estimated render count
- Lighthouse performance score improvement estimate`,
    tags: ["debug", "performance", "react", "optimization", "memo"],
    platformCompatibility: ["bolt", "cursor", "claude"],
    estimatedTokens: 350,
    icon: "Zap",
    createdAt: "2025-11-12T09:00:00Z",
  },
  {
    id: "tpl_007",
    name: "Reusable UI Component Library",
    category: "Component",
    description: "Build a production-ready component library with design tokens, Storybook stories, and TypeScript generics.",
    content: `Create a reusable component library for {{projectName}} with the following spec:

## Setup
- Bundler: Vite library mode + tsup
- Styling: {{stylingApproach}} (CSS Variables / Tailwind / Styled-Components)
- Testing: Vitest + @testing-library/react
- Docs: Storybook 8

## Components to Build

### Primitives
- Button — variants: primary, secondary, ghost, danger | sizes: sm, md, lg | loading, disabled states
- Input — label, helperText, error, prefix/suffix icons
- Badge — color variants, removable
- Avatar — image, fallback initials, size, status dot
- Spinner — size, color

### Layout
- Card — header, body, footer slots
- Modal — size, closeOnOverlay, portal
- Drawer — side: left|right|top|bottom, overlay
- Tabs — horizontal/vertical, lazy content

### Data
- Table — sortable columns, row selection, pagination
- DataGrid — virtual scroll, editable cells
- Select — single/multi, searchable, async options
- DatePicker — range mode, localization

## Each component must have:
- Full TypeScript props interface
- JSDoc comments
- Default export + named export
- Storybook story with controls
- Unit tests

## Design tokens: {{tokenFile}}`,
    tags: ["component", "library", "storybook", "typescript", "design-system"],
    platformCompatibility: ["bolt", "cursor", "v0", "lovable"],
    estimatedTokens: 480,
    icon: "Blocks",
    createdAt: "2025-11-14T10:30:00Z",
  },
  {
    id: "tpl_008",
    name: "E-commerce Product Page",
    category: "E-commerce",
    description: "Full e-commerce product detail page with variant selection, cart, reviews, and recommendations.",
    content: `Build a conversion-optimized product detail page for {{storeName}} selling {{productType}}.

## URL Pattern: /products/{{slug}}

## Page Sections

### Above the Fold
- Image gallery (main image + thumbnails, zoom on hover, mobile swipe)
- Product title, SKU, brand
- Star rating ({{ratingSource}}) + review count link
- Price: original, sale price, savings badge
- Variant selectors: {{variants}} (size, color, etc.)
- Stock indicator: In Stock / Only X left / Out of Stock
- Add to Cart button + quantity selector
- Add to Wishlist, Share buttons

### Product Info Tabs
- Description (rich text)
- Specifications (key-value table)
- Shipping & Returns policy
- Reviews section (sort, filter, pagination, write review form)

### Below the Fold
- "Frequently Bought Together" carousel
- "You May Also Like" recommendations ({{recommendationEngine}})
- Recently Viewed (localStorage)

## Cart Integration
- Add to cart triggers slide-out mini-cart
- Persist cart in localStorage + sync to API if logged in

## SEO
- JSON-LD Product schema
- Open Graph tags
- Canonical URL`,
    tags: ["ecommerce", "product", "cart", "reviews", "shopify"],
    platformCompatibility: ["bolt", "lovable", "v0"],
    estimatedTokens: 430,
    icon: "ShoppingCart",
    createdAt: "2025-11-16T12:00:00Z",
  },
  {
    id: "tpl_009",
    name: "GraphQL API with Apollo Server",
    category: "API Backend",
    description: "Type-safe GraphQL API with Apollo Server 4, DataLoader batching, subscriptions, and caching.",
    content: `Build a production GraphQL API for {{projectName}} with:

## Stack
- Apollo Server 4 + TypeScript
- Database: {{database}} via {{orm}} (Prisma / TypeORM / Drizzle)
- Auth: JWT from Authorization header
- Caching: Redis (DataLoader + persisted queries)

## Schema Design: {{domain}}

\`\`\`graphql
type {{typeName}} {
  id: ID!
  {{fields}}
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  {{typeName}}(id: ID!): {{typeName}}
  {{typeNamePlural}}(filter: {{typeName}}Filter, pagination: PaginationInput): {{typeName}}Connection!
}

type Mutation {
  create{{typeName}}(input: Create{{typeName}}Input!): {{typeName}}!
  update{{typeName}}(id: ID!, input: Update{{typeName}}Input!): {{typeName}}!
  delete{{typeName}}(id: ID!): Boolean!
}

type Subscription {
  {{typeName}}Created: {{typeName}}!
  {{typeName}}Updated(id: ID!): {{typeName}}!
}
\`\`\`

## Resolvers
- Query resolvers with DataLoader batching (N+1 prevention)
- Mutation resolvers with input validation (graphql-scalars)
- Subscription resolvers with PubSub (Redis)

## Plugins
- ApolloServerPluginLandingPageLocalDefault
- Custom logging plugin
- Complexity limiting (max={{maxComplexity}})
- Depth limiting (max={{maxDepth}})`,
    tags: ["graphql", "apollo", "api", "subscriptions", "typescript"],
    platformCompatibility: ["bolt", "cursor", "replit"],
    estimatedTokens: 460,
    icon: "GitBranch",
    createdAt: "2025-11-18T09:00:00Z",
  },
  {
    id: "tpl_010",
    name: "Unit & Integration Test Suite",
    category: "Testing",
    description: "Comprehensive test suite for a React app with Vitest, React Testing Library, and MSW.",
    content: `Generate a complete test suite for {{componentOrModule}} in {{framework}}.

## Test Setup
- Runner: Vitest
- UI Tests: @testing-library/react + @testing-library/user-event
- API Mocking: MSW (Mock Service Worker) v2
- Coverage: c8 (target: 80%+)

## Component: {{componentName}}
\`\`\`jsx
{{pasteComponentHere}}
\`\`\`

## Test Cases to Generate

### Unit Tests
1. Renders without crashing
2. Renders correct initial state
3. Each prop variant renders correctly
4. Conditional rendering logic
5. Error boundary behavior

### Interaction Tests
6. User clicks trigger correct handlers
7. Form submission — success path
8. Form submission — validation errors
9. Keyboard navigation (Tab, Enter, Escape)
10. Async state (loading, success, error)

### Integration Tests
11. API call on mount (MSW mock)
12. Data displays correctly after fetch
13. Error state renders on API failure
14. Pagination / infinite scroll interaction

### Accessibility Tests
15. axe-core accessibility violations = 0
16. ARIA labels present
17. Focus management in modals

## Output: Complete .test.tsx file with all cases`,
    tags: ["testing", "vitest", "rtl", "msw", "coverage"],
    platformCompatibility: ["bolt", "cursor", "claude"],
    estimatedTokens: 400,
    icon: "FlaskConical",
    createdAt: "2025-11-20T11:00:00Z",
  },
  {
    id: "tpl_011",
    name: "Web Design System from Figma Tokens",
    category: "Web Design",
    description: "Convert Figma design tokens into a complete CSS/JS design system with components.",
    content: `Convert the following Figma design tokens into a full CSS + React design system for {{brandName}}.

## Design Tokens
\`\`\`json
{{figmaTokensJson}}
\`\`\`

## Output Structure
\`\`\`
src/
  tokens/
    colors.css     ← CSS custom properties
    typography.css
    spacing.css
    shadows.css
    animations.css
  components/
    Button/
    Input/
    Typography/
    ...
\`\`\`

## Requirements
- All tokens as CSS custom properties (--color-primary-500, etc.)
- TypeScript token map for JS usage
- Tailwind config extension (if using Tailwind)
- Dark mode via [data-theme="dark"] attribute
- Typography scale: {{fontScale}} (Major Third / Perfect Fourth / Custom)
- Responsive breakpoints: {{breakpoints}}

## Components (use tokens, no hardcoded values):
- Heading (h1–h6 mapped to type scale)
- Text (body, caption, label)
- Button (fill, outline, text variants)
- Input, Textarea, Select
- Card, Divider, Badge

## Storybook: generate a tokens/Colors.stories.tsx palette viewer`,
    tags: ["design-system", "figma", "tokens", "css-variables", "tailwind"],
    platformCompatibility: ["bolt", "lovable", "v0", "cursor"],
    estimatedTokens: 420,
    icon: "Palette",
    createdAt: "2025-11-22T10:00:00Z",
  },
  {
    id: "tpl_012",
    name: "Admin Panel with Role-Based Access",
    category: "Dashboard",
    description: "Admin CRUD panel with role-based access control, audit logs, and bulk operations.",
    content: `Build an admin panel for managing {{resourceName}} in {{projectName}}.

## Roles & Permissions
| Role        | Read | Create | Update | Delete | Export | Admin |
|-------------|------|--------|--------|--------|--------|-------|
| viewer      |  ✓   |        |        |        |        |       |
| editor      |  ✓   |  ✓     |  ✓     |        |        |       |
| manager     |  ✓   |  ✓     |  ✓     |  ✓     |  ✓     |       |
| superadmin  |  ✓   |  ✓     |  ✓     |  ✓     |  ✓     |  ✓    |

## Pages

### List Page (/admin/{{resourceSlug}})
- Server-side paginated table (50/page default)
- Column visibility toggle
- Multi-column sort
- Filters: status, date range, {{filterFields}}
- Bulk select + bulk actions (delete, export, status change)
- Export: CSV, Excel, JSON

### Detail/Edit Page (/admin/{{resourceSlug}}/:id)
- Tabbed form: General, {{tab2}}, {{tab3}}, Audit Log
- Inline validation (Zod)
- Auto-save draft
- Confirm on unsaved changes navigate

### Audit Log
- Every create/update/delete logged with: actor, timestamp, diff (before/after)
- Searchable, filterable log table

## Tech: {{framework}} + {{orm}} + {{uiLibrary}}`,
    tags: ["admin", "rbac", "crud", "audit", "dashboard"],
    platformCompatibility: ["bolt", "cursor", "lovable"],
    estimatedTokens: 440,
    icon: "ShieldHalf",
    createdAt: "2025-11-24T09:00:00Z",
  },
  {
    id: "tpl_013",
    name: "Real-Time Chat Application",
    category: "Web Design",
    description: "Full-featured real-time chat with WebSockets, rooms, typing indicators, and file sharing.",
    content: `Build a real-time chat application for {{appName}} with the following features:

## Architecture
- Frontend: {{framework}} + TypeScript
- Backend: Node.js + Socket.io v4
- Database: {{database}} (messages, users, rooms)
- File Storage: {{storage}} (S3 / Cloudinary / local)

## Features

### Messaging
- Real-time message send/receive (Socket.io)
- Message types: text, image, file, code block, emoji
- Delivery receipts: sent ✓ / delivered ✓✓ / read ✓✓ (blue)
- Edit message (with "edited" label)
- Delete message (for me / for everyone)
- Reply to message (quoted preview)
- Reactions (emoji picker, reaction counts)

### Rooms/Channels
- DM (1:1) and Group rooms (up to {{maxMembers}} members)
- Room creation, naming, avatar, description
- Invite by username or shareable link
- Admin roles: owner, admin, member

### Presence
- Online/offline/away status
- Typing indicator (debounced 500ms)
- Last seen timestamp

### Search
- Full-text search across messages ({{searchEngine}})
- File attachment search

## UI Components
- <MessageBubble /> — own vs others, tail, timestamp
- <TypingIndicator /> — animated dots
- <ReactionPicker />
- <FilePreview />`,
    tags: ["chat", "websocket", "realtime", "socket.io", "messaging"],
    platformCompatibility: ["bolt", "replit", "cursor"],
    estimatedTokens: 470,
    icon: "MessageSquare",
    createdAt: "2025-11-26T14:00:00Z",
  },
  {
    id: "tpl_014",
    name: "CI/CD Pipeline Configuration",
    category: "API Backend",
    description: "Generate GitHub Actions workflows for test, build, deploy with caching and environment gates.",
    content: `Generate a complete CI/CD pipeline for {{projectName}} using GitHub Actions.

## Environments
- develop → staging (auto-deploy on push)
- main → production (manual approval gate)

## Workflows

### 1. PR Check (.github/workflows/pr-check.yml)
\`\`\`
Trigger: pull_request to develop or main
Jobs:
  lint:     ESLint + Prettier check
  typecheck: tsc --noEmit
  test:     Vitest (unit + integration) with coverage
  build:    vite build (artifact uploaded)
  security: npm audit + CodeQL
\`\`\`

### 2. Deploy Staging (.github/workflows/deploy-staging.yml)
\`\`\`
Trigger: push to develop
Jobs:
  build → Docker image ({{dockerRegistry}})
  deploy → {{stagingTarget}} (Fly.io / Railway / ECS)
  smoke-test → curl health endpoint
  notify → Slack #deployments
\`\`\`

### 3. Deploy Production (.github/workflows/deploy-prod.yml)
\`\`\`
Trigger: push to main + manual approval
Jobs:
  build → tag Docker image with Git SHA
  deploy → {{productionTarget}}
  db-migrate → prisma migrate deploy
  health-check → retry 3x with 10s delay
  rollback → on failure, redeploy previous image
\`\`\`

## Secrets needed: {{secretsList}}
## Cache: node_modules (yarn.lock hash), Docker layers`,
    tags: ["cicd", "github-actions", "docker", "devops", "deployment"],
    platformCompatibility: ["cursor", "claude", "manus"],
    estimatedTokens: 400,
    icon: "GitMerge",
    createdAt: "2025-11-28T10:00:00Z",
  },
  {
    id: "tpl_015",
    name: "Checkout Flow — Multi-Step",
    category: "E-commerce",
    description: "Multi-step checkout with address, shipping, payment (Stripe), and order confirmation.",
    content: `Build a multi-step checkout flow for {{storeName}} with Stripe integration.

## Steps
1. **Cart Review** — items, quantities, remove, coupon code
2. **Contact & Address** — email, shipping address (Google Places autocomplete), save address option
3. **Shipping Method** — carrier options with prices/ETAs ({{shippingProviders}})
4. **Payment** — Stripe Elements (card, Apple Pay, Google Pay)
5. **Review & Place Order** — summary of all, T&C checkbox
6. **Confirmation** — order number, estimated delivery, "Track Order" CTA

## Technical
- Step state in URL query params (for back navigation)
- Progress indicator (stepper bar)
- Form state: React Hook Form + Zod
- Stripe: @stripe/react-stripe-js (PaymentElement)
- Address validation: {{addressValidator}}
- Tax calculation: {{taxProvider}} (Stripe Tax / Avalara)
- Order creation: optimistic UI, polling for payment confirmation

## Edge Cases
- Handle 3D Secure redirect
- Payment failure retry
- Out-of-stock item detected at payment → back to cart with error
- Session timeout warning at 10 min idle

## Mobile: fully touch-optimized, autofill compatible`,
    tags: ["checkout", "stripe", "ecommerce", "payment", "forms"],
    platformCompatibility: ["bolt", "lovable", "cursor"],
    estimatedTokens: 440,
    icon: "CreditCard",
    createdAt: "2025-11-30T11:00:00Z",
  },
  {
    id: "tpl_016",
    name: "Data Visualization Dashboard",
    category: "Dashboard",
    description: "Analytics dashboard with interactive charts, filters, drill-down, and export.",
    content: `Build an interactive data visualization dashboard for {{datasetName}} with:

## Charts to Include
1. **Time Series** — multi-line chart, zoomable, date range picker
2. **Bar Chart** — grouped/stacked toggle, horizontal/vertical toggle
3. **Pie / Donut** — with legend, click-to-filter
4. **Scatter Plot** — x/y axis selectors, color dimension, size dimension
5. **Heatmap** — calendar view for daily metrics
6. **Funnel Chart** — conversion funnel for {{funnelSteps}}
7. **Geo Map** — choropleth map ({{geoScope}}: world / US states / custom)

## Interactions
- Cross-chart filtering (click bar → filters all charts)
- Date range brush on time series
- Tooltip on hover with formatted values
- Drill-down: click data point → zoom into sub-category
- Reset all filters button

## Data
- Source: {{dataSource}} (REST API / CSV upload / hardcoded)
- Refresh: {{refreshInterval}} (live / manual / scheduled)
- Aggregations: {{aggregations}} (sum, avg, count, p95)

## Export
- PNG/SVG per chart
- Full dashboard PDF
- Raw data CSV

## Library: {{chartLibrary}} (Recharts / D3 / Victory / Nivo)`,
    tags: ["charts", "analytics", "visualization", "d3", "dashboard"],
    platformCompatibility: ["bolt", "cursor", "lovable", "v0"],
    estimatedTokens: 450,
    icon: "BarChart3",
    createdAt: "2025-12-02T09:00:00Z",
  },
  {
    id: "tpl_017",
    name: "Drag-and-Drop Kanban Board",
    category: "Component",
    description: "Trello-style kanban board with drag-drop, swimlanes, card details modal, and persistence.",
    content: `Build a Kanban board component for {{projectName}} with full drag-and-drop support.

## Features
- Columns: {{defaultColumns}} (e.g., Backlog, In Progress, Review, Done)
- Cards draggable within and between columns
- Column reordering via drag
- Add/rename/delete columns
- Card details: title, description (markdown), assignee, labels, due date, checklist, attachments
- Card quick-add (press Enter on inline input)
- Swimlanes by {{swimlaneField}} (optional, toggleable)

## Tech
- DnD: @dnd-kit/core + @dnd-kit/sortable (not react-beautiful-dnd — deprecated)
- State: Zustand with immer middleware
- Persistence: {{persistence}} (localStorage / API)

## Keyboard Shortcuts
- N — new card in focused column
- Cmd+Z — undo last move
- Arrow keys — navigate cards
- Enter — open card detail
- Escape — close modal

## Card Component
\`\`\`tsx
<KanbanCard
  id title description
  assignee={{ avatar, name }}
  labels={[{ color, text }]}
  dueDate checklistProgress
  attachmentCount commentCount
  priority={low|medium|high|critical}
/>
\`\`\`

## Board persistence format (JSON): {{persistenceSchema}}`,
    tags: ["kanban", "dnd", "drag-drop", "project-management", "component"],
    platformCompatibility: ["bolt", "lovable", "v0", "cursor"],
    estimatedTokens: 430,
    icon: "KanbanSquare",
    createdAt: "2025-12-04T14:00:00Z",
  },
  {
    id: "tpl_018",
    name: "Mobile-First Blog Engine",
    category: "Web Design",
    description: "SEO-optimized blog with MDX, syntax highlighting, table of contents, and comments.",
    content: `Build a mobile-first blog engine for {{blogName}} using {{framework}}.

## Tech Stack
- Framework: Next.js 14 App Router
- Content: {{contentSource}} (MDX files / Contentful / Sanity)
- Styling: Tailwind + Typography plugin
- Syntax Highlight: Shiki (server-side, zero JS)
- Search: Fuse.js (client-side) or Algolia

## Pages
- / — hero, featured post, category grid, newsletter signup
- /blog — post list (card grid), filter by category/tag, search bar
- /blog/{{slug}} — article page (see below)
- /category/{{name}} — filtered list
- /author/{{handle}} — bio + posts

## Article Page Features
- Reading time estimate
- Progress bar (scroll %)
- Table of Contents (auto-generated, sticky on desktop)
- Code blocks: language label, copy button, diff highlighting
- Image zoom (medium.com style)
- Series navigator (prev/next in series)
- Author card
- Related posts (by tag similarity)
- Comments: {{commentProvider}} (Giscus / Disqus / None)
- Share: Twitter, LinkedIn, Copy Link

## SEO
- generateMetadata() per post
- sitemap.xml
- robots.txt
- JSON-LD Article schema
- OpenGraph + Twitter card images (auto-generated with @vercel/og)`,
    tags: ["blog", "mdx", "nextjs", "seo", "content"],
    platformCompatibility: ["bolt", "cursor", "v0"],
    estimatedTokens: 420,
    icon: "BookOpen",
    createdAt: "2025-12-06T10:00:00Z",
  },
  {
    id: "tpl_019",
    name: "Form Builder with Validation",
    category: "Component",
    description: "Dynamic form builder with drag-drop field ordering, conditional logic, and schema export.",
    content: `Build a dynamic form builder for {{appName}} where users can visually construct forms.

## Field Types
- Text Input (short/long)
- Number, Email, URL, Phone
- Date / DateTime / Time picker
- Select (single/multi), Radio, Checkbox group
- File upload ({{maxFileSize}}, {{allowedTypes}})
- Rich Text (Tiptap or Quill)
- Rating (stars / numeric)
- Signature pad
- Section divider, Heading, Paragraph (static)

## Builder UI
- Left panel: field type palette
- Center: form canvas (drop zone, reorderable)
- Right panel: field properties editor (label, placeholder, required, validation rules, help text)

## Conditional Logic
- Show/Hide field when: [field] [operator] [value]
- Operators: equals, not equals, contains, greater than, is empty
- Multiple conditions with AND/OR

## Validation Rules (per field)
- Required, Min/Max length, Pattern (regex), Custom message

## Output
- JSON Schema: {{schemaFormat}} (JSON Schema draft-7 / custom)
- Rendered <FormRenderer schema={...} onSubmit={...} />
- Export: JSON, CSV template

## Submission handling
- Success message or redirect
- Email notification to {{notifyEmail}}
- Webhook POST to {{webhookUrl}}`,
    tags: ["forms", "builder", "validation", "drag-drop", "dynamic"],
    platformCompatibility: ["bolt", "lovable", "cursor"],
    estimatedTokens: 460,
    icon: "FormInput",
    createdAt: "2025-12-08T11:00:00Z",
  },
  {
    id: "tpl_020",
    name: "WebSocket Real-Time Notification System",
    category: "API Backend",
    description: "Real-time notification system with WebSocket, notification center, and delivery tracking.",
    content: `Build a real-time notification system for {{appName}}.

## Architecture
- WebSocket: Socket.io server (Node.js)
- Queue: {{queueProvider}} (Bull / BullMQ with Redis)
- DB: {{database}} — Notification, NotificationPreference tables
- Push: Web Push API (VAPID keys)

## Notification Types
- in_app: shown in notification center
- email: queued for {{emailProvider}} (SendGrid / Resend)
- push: browser push notification
- sms: optional, via {{smsProvider}}

## Events to Notify
{{eventList}} — e.g., new_message, mention, task_assigned, payment_received, system_alert

## Notification Center (Frontend)
- Bell icon with unread count badge
- Dropdown: grouped by today / yesterday / older
- Mark as read (individual + bulk)
- Notification item: icon, actor, action, target, timestamp (relative)
- "See all" → /notifications page
- Infinite scroll with read/unread filter

## Delivery Tracking
\`\`\`
Notification {
  id, userId, type, title, body,
  data (JSON), channel, read, readAt,
  delivered, deliveredAt, createdAt
}
\`\`\`

## User Preferences
- Per-type, per-channel opt-in/out
- Quiet hours: {{quietHoursSupport}}
- Frequency digest: instant / hourly / daily`,
    tags: ["notifications", "websocket", "realtime", "push", "queue"],
    platformCompatibility: ["bolt", "cursor", "replit"],
    estimatedTokens: 450,
    icon: "Bell",
    createdAt: "2025-12-10T09:00:00Z",
  },
  {
    id: "tpl_021",
    name: "API Rate Limiter & Analytics",
    category: "API Backend",
    description: "Middleware for rate limiting API routes with Redis, analytics tracking, and quota dashboards.",
    content: `Implement a robust API rate limiting system for {{apiName}}.

## Strategy
- Algorithm: {{algorithm}} (Token Bucket / Sliding Window / Fixed Window)
- Storage: Redis (ioredis)
- Key: {{keyStrategy}} (IP / API key / userId / combined)

## Tiers
| Tier    | RPM | RPH  | RPD   | Burst |
|---------|-----|------|-------|-------|
| Free    |  10 |  200 | 1,000 |  20   |
| Pro     | 100 | 2000 |50,000 | 200   |
| Business| 500 |10000 |500k   | 1000  |
| Custom  | {{customLimit}} |

## Middleware (Express)
\`\`\`ts
app.use('/api', rateLimiter({
  getTier: (req) => req.user?.tier || 'free',
  onLimit: (req, res, info) => res.status(429).json({
    error: 'Rate limit exceeded',
    retryAfter: info.retryAfter,
    limit: info.limit,
    remaining: 0,
    reset: info.reset,
  }),
}));
\`\`\`

## Response Headers
- X-RateLimit-Limit
- X-RateLimit-Remaining
- X-RateLimit-Reset
- Retry-After

## Analytics Dashboard
- Requests/min chart per endpoint
- Top consumers by API key
- Error rate (4xx/5xx)
- Latency p50/p95/p99
- Rate limit hit frequency

## Alerts: notify via {{alertChannel}} when error rate > {{errorThreshold}}%`,
    tags: ["api", "rate-limit", "redis", "analytics", "middleware"],
    platformCompatibility: ["cursor", "bolt", "replit"],
    estimatedTokens: 400,
    icon: "Gauge",
    createdAt: "2025-12-12T14:00:00Z",
  },
  {
    id: "tpl_022",
    name: "Onboarding Flow — Multi-Step",
    category: "Web Design",
    description: "Smooth multi-step user onboarding with progress, skip options, and profile completion.",
    content: `Build a delightful multi-step onboarding flow for {{appName}}.

## Steps
1. **Welcome** — animated hero, "Let's get you set up" CTA
2. **Profile Setup** — name, avatar upload, role/job title
3. **Use Case** — select primary goal (multiple choice cards, select {{maxSelections}})
4. **Invite Team** — email input list, skip option
5. **Connect Integrations** — one-click connect cards for {{integrations}}
6. **Customize** — theme picker, notification preferences
7. **Done!** — confetti animation, summary of setup, "Go to Dashboard" CTA

## UX Requirements
- Progress bar (step X of Y) at top
- Skip step button (not on required steps)
- Back navigation
- Auto-save progress to localStorage + API (resume on re-visit)
- Keyboard navigable
- Estimated time: "~2 min"

## Animations
- Step transition: slide-in from right
- Confetti: canvas-confetti on final step
- Lottie animation on welcome screen ({{lottieAsset}})

## Analytics Events
- onboarding_started
- step_completed { step, duration }
- step_skipped { step }
- onboarding_completed { totalDuration }
- integration_connected { name }`,
    tags: ["onboarding", "ux", "flow", "animation", "wizard"],
    platformCompatibility: ["bolt", "lovable", "v0"],
    estimatedTokens: 390,
    icon: "Footprints",
    createdAt: "2025-12-14T10:00:00Z",
  },
  {
    id: "tpl_023",
    name: "Subscription Billing System",
    category: "E-commerce",
    description: "Stripe-powered subscription management with plan upgrades, invoices, and usage billing.",
    content: `Build a full subscription billing system for {{saasName}} powered by Stripe.

## Plans
{{planList}} — e.g., Starter $9/mo, Pro $29/mo, Team $79/mo/seat, Enterprise custom

## Features

### Subscription Lifecycle
- Checkout with Stripe Checkout or embedded PaymentElement
- Plan upgrade/downgrade (prorated immediately)
- Cancellation: immediate or end of period, with survey
- Reactivation before period ends
- Free trial: {{trialDays}} days, credit card required: {{ccRequired}}

### Usage-Based Billing (if applicable)
- Meter: {{usageMetric}} (API calls, seats, GB stored)
- Report usage to Stripe Metered Billing each billing cycle
- Usage dashboard: current period consumption vs. limit

### Customer Portal
- Stripe Customer Portal (hosted) for: change plan, update payment, download invoices, cancel
- Or custom portal with same features

### Webhooks (stripe.webhooks.constructEvent)
- checkout.session.completed
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_failed → email + grace period logic
- invoice.payment_succeeded → provision/update access

## Database
\`\`\`
Subscription { id, userId, stripeSubId, plan, status, currentPeriodEnd, cancelAtPeriodEnd }
Invoice { id, userId, stripeInvoiceId, amount, status, pdf }
\`\`\``,
    tags: ["billing", "stripe", "subscription", "saas", "payments"],
    platformCompatibility: ["bolt", "cursor", "replit"],
    estimatedTokens: 460,
    icon: "Receipt",
    createdAt: "2025-12-16T11:00:00Z",
  },
  {
    id: "tpl_024",
    name: "Error Monitoring & Logging Setup",
    category: "Debug",
    description: "Set up Sentry error monitoring with structured logging, alerting, and source maps.",
    content: `Configure comprehensive error monitoring and logging for {{projectName}}.

## Error Monitoring: Sentry
\`\`\`ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.RELEASE_TAG,
  tracesSampleRate: {{tracesSampleRate}}, // 0.1 in prod
  profilesSampleRate: 0.1,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({ maskAllText: true }),
  ],
  beforeSend: (event) => {
    // strip PII: emails, tokens
    return sanitizeEvent(event);
  },
});
\`\`\`

## Structured Logging (Backend)
- Library: Pino (fastest) or Winston
- Format: JSON with { level, msg, timestamp, requestId, userId, ... }
- Levels: error, warn, info, debug, trace
- Transports: stdout (dev) + {{logDestination}} (Datadog / CloudWatch / Logtail)

## Log Correlation
- Each request gets a unique X-Request-ID header
- All log lines in a request share requestId field
- Frontend errors include sessionId and user email (masked)

## Alerting Rules
- Error rate > {{errorRateThreshold}}% in 5 min → PagerDuty
- New error type unseen in last 24h → Slack
- P95 latency > {{latencyThreshold}}ms → email

## Dashboard
- Sentry: error trends, user impact, release health
- Custom: request rate, error rate, latency (Grafana / {{dashboardTool}})

## Source Maps: upload to Sentry on deploy (sentry-cli)`,
    tags: ["monitoring", "sentry", "logging", "debugging", "observability"],
    platformCompatibility: ["cursor", "claude", "manus"],
    estimatedTokens: 390,
    icon: "AlertTriangle",
    createdAt: "2025-12-18T09:00:00Z",
  },
  {
    id: "tpl_025",
    name: "Accessibility Audit & Remediation",
    category: "Testing",
    description: "Run a WCAG 2.1 AA audit on a component and generate a remediation plan with fixes.",
    content: `Perform a comprehensive WCAG 2.1 AA accessibility audit on the following component and provide fixes:

\`\`\`jsx
{{pasteComponentHere}}
\`\`\`

## Audit Checklist

### Perceivable
- [ ] All images have meaningful alt text (or alt="" if decorative)
- [ ] Color contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [ ] No information conveyed by color alone
- [ ] Videos have captions, audio has transcripts

### Operable
- [ ] All interactive elements keyboard-accessible (Tab, Enter, Space)
- [ ] Visible focus indicator (not removed with outline:none without replacement)
- [ ] No keyboard traps
- [ ] Skip navigation link at top
- [ ] No time limits without user control

### Understandable
- [ ] Language attribute set (lang="en")
- [ ] Labels associated with all form inputs
- [ ] Error messages are descriptive and associated with fields
- [ ] No unexpected context changes on focus

### Robust
- [ ] Valid semantic HTML (no div-soup buttons)
- [ ] ARIA roles/labels used correctly (not redundant)
- [ ] Works with screen readers: NVDA, VoiceOver

## Tools Used
- axe-core (automated)
- WAVE extension manual check
- Keyboard-only navigation test

## Output
1. Issue list with severity (Critical/Major/Minor), WCAG criterion, and location
2. Fixed code with inline comments explaining each change
3. Regression test cases using jest-axe`,
    tags: ["accessibility", "wcag", "a11y", "audit", "aria"],
    platformCompatibility: ["cursor", "claude", "bolt"],
    estimatedTokens: 410,
    icon: "Eye",
    createdAt: "2025-12-20T10:00:00Z",
  },
];

export default PROMPT_TEMPLATES;
