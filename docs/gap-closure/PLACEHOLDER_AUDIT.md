# Placeholder Code Audit

## Recording Feature
- Location: `packages/shared/src/recording/`, `apps/web/src/components/recording/`
- Status: Skeleton implementation
- Feature flag: `FEATURE_RECORDING=false`
- Risk: Low (disabled)
- Resolution: Implement backend in next batch

## Desktop Main Process
- Location: `apps/desktop/src/`
- Status: Framework, needs main process
- Risk: Medium
- Resolution: Complete in desktop-focused batch

## TURN Server
- Location: `docs/devops/TURN_DEPLOYMENT.md`
- Status: Documented, not deployed
- Risk: Medium
- Resolution: Deploy to production infrastructure

## SSO
- Location: `contracts/web-dto.ts` (types only)
- Status: Types defined
- Risk: Low (Enterprise only)
- Resolution: Implement when needed
