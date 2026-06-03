# AgentFlow — Multi-Platform AI Broadcast Studio

> **Premium SaaS dashboard** for broadcasting AI prompts to multiple coding platforms simultaneously. Built with React + Vite + Supabase.

[![Built with React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Powered by Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com)

---

## ✨ Features

| Category | Highlights |
|---|---|
| **Broadcast Studio** | Send prompts to Bolt.new, Lovable, Replit, Manus, v0.dev & more simultaneously |
| **AI Optimizer** | Analysises and rewrites prompts for clarity, specificity and structure |
| **Smart Router** | Auto-recommends the best platform for each prompt type |
| **Security Vault** | AES-256 client-side encryption for all API keys and credentials |
| **Autonomous Agent** | Self-improving AI that builds and enhances the project in real-time |
| **60+ Pages** | Full SaaS UI: onboarding, billing, analytics, team hub, observability, and more |
| **Dark/Light Mode** | Persistent theme toggle with smooth CSS variable transitions |
| **Mobile Responsive** | Slide-in sidebar, responsive grids, tested down to 360px |
| **Error Recovery** | React ErrorBoundary on every page with stack-trace viewer |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18  
- **npm** ≥ 9  
- A **Supabase** project (free tier works)

### 1. Clone & install

```bash
git clone https://github.com/your-org/agentflow.git
cd agentflow
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

All other variables are optional — see [`.env.example`](.env.example) for the full list.

### 3. Run locally

```bash
npm run dev
```

App opens at **http://localhost:5173**

---

## 🗂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.jsx      # Collapsible, drag-to-reorder navigation
│   ├── Topbar.jsx       # Global search, notifications, dark/light toggle
│   ├── EmptyState.jsx   # Generic zero-data placeholder with actions
│   ├── ErrorBoundary.jsx# Render error recovery with stack trace
│   ├── ToastSystem.jsx  # Toast notification provider
│   └── ...
├── pages/               # 60+ page-level components
│   ├── Dashboard.jsx    # KPI overview + live activity
│   ├── Broadcast.jsx    # Broadcast studio with prompt composer
│   ├── Optimizer.jsx    # AI prompt optimizer
│   ├── Docs.jsx         # Help Center with 18 articles
│   └── ...
├── lib/
│   ├── supabase.js      # Supabase client singleton
│   ├── soundEngine.js   # Ambient UI sound system
│   └── store.js         # Global Zustand-like state store
├── data/
│   └── constants.js     # Platform definitions, feature flags
├── App.jsx              # Root router, providers, global layout
├── index.css            # Design system (CSS custom properties)
└── main.jsx             # Vite entry point
```

---

## 🎨 Design System

All colours, spacing and typography are defined as **CSS custom properties** in [`src/index.css`](src/index.css):

```css
:root {
  --gold:    #f5b731;   /* Primary accent */
  --teal:    #22d3ee;   /* Secondary accent */
  --purple:  #a78bfa;   /* Tertiary accent */
  --surface: #0e0e16;   /* Background */
  --font-sans: 'Syne', sans-serif;
  --font-mono: 'DM Mono', monospace;
}
```

**Light mode** is toggled by `data-theme="light"` on `<body>`. The toggle persists to `localStorage` (`agentflow_theme`).

---

## 🌐 Deployment

### Vercel (recommended)

```bash
npm run build        # Produces dist/
vercel --prod        # Deploy (uses vercel.json for SPA routing)
```

`vercel.json` is pre-configured with:
- SPA catch-all rewrite (`/* → /index.html`)
- Immutable cache headers for hashed assets
- Security headers (CSP, X-Frame-Options, etc.)

### Netlify

Add a `public/_redirects` file:

```
/*    /index.html   200
```

### Docker

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## 🔐 Supabase Setup

### Database tables

Run the SQL in `supabase/migrations/` (or apply manually):

```sql
-- accounts: connected AI platform sessions
CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  platform text NOT NULL,
  label text,
  api_key_enc text,          -- AES-256 encrypted
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- broadcasts: sent prompt events
CREATE TABLE broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  prompt text NOT NULL,
  targets jsonb,
  results jsonb,
  priority text DEFAULT 'normal',
  created_at timestamptz DEFAULT now()
);
```

### Row Level Security

Enable RLS and add policies so users can only read/write their own rows.

### Auth

Email + password auth is enabled by default. To add OAuth (GitHub, Google):
1. Dashboard → Auth → Providers
2. Enable the provider and add client ID/secret
3. Add redirect URL: `https://your-domain.com`

---

## 🧪 Development

### Lint

```bash
npm run lint
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Type checking (optional)

If you add TypeScript, run:

```bash
npx tsc --noEmit
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `react` 18 | UI framework |
| `vite` 5 | Build tool & dev server |
| `@supabase/supabase-js` | Auth + database client |
| `recharts` | Analytics charts |
| `react-beautiful-dnd` | Drag-and-drop (workflow builder) |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat: add XYZ'`
4. Push and open a PR against `main`

---

## 📄 License

MIT © 2026 AgentFlow Inc.

---

## 💬 Support

- **Docs**: Navigate to Help Center (📖) inside the app
- **Email**: support@agentflow.io
- **Issues**: [GitHub Issues](https://github.com/your-org/agentflow/issues)
- **Status**: [status.agentflow.io](https://status.agentflow.io)
