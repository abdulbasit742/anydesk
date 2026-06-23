# Operational Runbook

This runbook provides actionable steps for responding to common operational incidents and reliability alerts.

## 1. API Down or High Error Rate

**Symptom:** `/health` endpoint fails, P95 latency spikes > 1000ms, or error rate exceeds 5%.
**Actions:**
1.  Check the Operations Dashboard for the specific routes throwing errors.
2.  Review application logs (filtered for `error` level) for stack traces or database connection issues.
3.  If a recent deployment occurred, initiate an immediate rollback to the previous stable version.
4.  Verify database CPU and connection pool metrics.

## 2. Database Degraded

**Symptom:** API latency spikes globally; slow query logs indicate bottlenecks.
**Actions:**
1.  Identify the slow query via the Operations Dashboard or database monitoring tools.
2.  Check `DATABASE_PERFORMANCE_INDEXES.md` to ensure appropriate indexes exist.
3.  If a specific user or team is causing the load, consider temporary rate-limiting.
4.  Terminate blocking queries if they threaten overall system stability.

## 3. Socket.IO Degraded or High Reconnect Rate

**Symptom:** "Elevated reconnect rate detected" alert triggers; device heartbeat failures spike.
**Actions:**
1.  Check the Socket.IO node CPU and memory usage.
2.  Verify the Redis adapter (if implemented) is healthy and not dropping messages.
3.  Investigate network infrastructure (load balancers, proxies) for aggressive connection termination policies.

## 4. WebRTC Quality Failures

**Symptom:** High ICE failure rate or poor session quality reported across multiple sessions.
**Actions:**
1.  Verify the operational status of the TURN server fleet.
2.  Check if temporary credentials issued by the API are valid and correctly formatted.
3.  If failures are isolated to a specific region, investigate regional network routing issues.

## 5. Emergency Stop Verification

**Symptom:** A user reports an inability to terminate a session, or the emergency stop coverage warning triggers.
**Actions:**
1.  Immediately revoke the compromised device's access via the Admin Dashboard.
2.  Force-disconnect the associated Socket.IO rooms from the server side.
3.  Audit the connection recovery logs to ensure the desktop agent is correctly honoring the `deviceRevoked` state.
