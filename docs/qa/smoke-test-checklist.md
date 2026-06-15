# Smoke Test Checklist

Quick validation that core functionality works.

## Run Time: 15 minutes

## Tests
- [ ] API health check returns 200
- [ ] Web dashboard loads
- [ ] Login works
- [ ] Device list displays
- [ ] Desktop app launches
- [ ] Session connects
- [ ] Video stream visible
- [ ] Disconnect works
- [ ] Logout works

## Environments
- [ ] Local dev
- [ ] Staging
- [ ] Production (post-deploy)

## Automated Smoke
```bash
#!/bin/bash
set -e
curl -f http://localhost:4000/health
echo "API OK"
npx playwright test tests/e2e/smoke.spec.ts
echo "Web OK"
```
