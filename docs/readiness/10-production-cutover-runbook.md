# Production cutover runbook

1. Freeze release branch.
2. Apply reviewed migrations.
3. Deploy API behind health checks.
4. Deploy web dashboard.
5. Publish signed desktop build to internal channel.
6. Run smoke tests.
7. Increase rollout percentage gradually.
8. Monitor error rates and support queue.
