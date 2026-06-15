# TURN credential leasing

TURN REST credentials should be short-lived and scoped by user/session.
Never log TURN shared secrets.
Relay region selection should prefer healthy low-latency regions and fail closed when no relay is healthy.
