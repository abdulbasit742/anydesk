# Local Development Setup

## Prerequisites
- Node.js 20+ (use nvm or fnm)
- MySQL 8.0+
- Git

## 1. Clone Repository
```bash
git clone https://github.com/your-org/remotedesk.git
cd remotedesk
```

## 2. Install Dependencies
```bash
npm install
cd apps/web && npm install
```

## 3. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

## 4. Database Setup
```bash
# Create MySQL database
mysql -u root -p -e "CREATE DATABASE remotedesk;"

# Push schema
npm run db:push

# Seed (optional)
npx tsx db/seed.ts
```

## 5. Start Development
```bash
npm run dev
```
App will be available at http://localhost:3000

## 6. Verify Setup
```bash
# Type check
npm run check

# Run tests
npm run test

# Build
npm run build
```

## IDE Setup
### VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Importer

### Recommended Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Troubleshooting
### Port already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Database connection error
- Verify MySQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Type errors after changes
```bash
npm run check
```
