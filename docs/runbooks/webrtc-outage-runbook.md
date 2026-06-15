# WebRTC Outage Runbook

## Symptoms
- Connection failures > 10%
- Black screens
- No video/audio
- ICE connection failures

## Diagnosis

### Step 1: Check TURN Server
```bash
# Test TURN connectivity
turnutils_uclient -u test -w secret turn.remotedesk.io

# Check allocations
turnserver -l | wc -l

# Check bandwidth
iftop -i eth0
```

### Step 2: Check STUN
```bash
# Test STUN
stunclient stun.remotedesk.io
```

### Step 3: Check Signaling
```bash
# WebSocket connections
curl https://api.remotedesk.io/health
```

### Step 4: Check Client Issues
- Browser compatibility
- Firewall blocking
- VPN interference

## Mitigation
| Issue | Action |
|-------|--------|
| TURN down | Failover to backup TURN |
| TURN overloaded | Scale TURN instances |
| STUN down | Use host candidates only |
| Regional issue | Route to different region |

## Escalation
- L1: Try mitigation steps
- L2: Engage media team
- L3: Vendor support (Coturn/Twilio)
