# Admin Troubleshooting

## Common Issues

### User Cannot Login
1. Check user status (not suspended)
2. Verify email verified
3. Check organization status (not suspended)
4. Review failed login attempts
5. Reset password if needed

### Device Shows Offline
1. Check device last seen time
2. Verify desktop client running
3. Check network connectivity
4. Review device logs
5. Re-register if needed

### Session Fails to Connect
1. Check both devices online
2. Verify IDs correct
3. Check host accepted request
4. Review WebRTC ICE logs
5. Check TURN server availability

### Billing Issues
1. Verify Stripe webhook delivery
2. Check subscription status in Stripe
3. Review webhook event logs
4. Re-sync if needed

### Performance Issues
1. Check API response times
2. Review database query performance
3. Check Redis connection
4. Monitor error rates
5. Review recent deployments

## Escalation
- L1: Basic troubleshooting (this guide)
- L2: Engineering team
- L3: On-call engineer (P0/P1)
