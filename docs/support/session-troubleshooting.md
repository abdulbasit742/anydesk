# Session Troubleshooting Guide

## Problem: Cannot Establish Session

### Step 1: Verify IDs
- Confirm 9-digit RemoteDesk ID is correct
- Check host device is online
- Verify IDs not swapped (viewer vs host)

### Step 2: Check Connectivity
- Both devices have internet
- Ping test to remotedesk.io
- Check firewall rules
- Verify corporate proxy not blocking

### Step 3: Check Desktop Client
- Client is running
- Not in sleep/hibernate
- Latest version installed
- No other session active

### Step 4: WebRTC Diagnostics
- Check `chrome://webrtc-internals` (Chrome)
- Verify ICE candidates gathering
- Check TURN server reachable
- Review connection state changes

### Step 5: Advanced
- Try different network (mobile hotspot)
- Disable VPN temporarily
- Check antivirus not blocking
- Review router NAT settings

## Problem: Session Disconnects Frequently

### Check
- Network stability (packet loss)
- Power saving settings
- Screen lock/sleep settings
- VPN stability
- Router keepalive settings

## Problem: Black Screen

### Check
- Host screen not locked
- Correct display selected
- GPU drivers up to date
- Display resolution compatible
