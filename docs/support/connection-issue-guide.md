# Troubleshooting Connection Issues

## Cannot Connect to Remote Desktop

### Step 1: Verify Desk ID
- Ensure 9-digit number is correct
- Ask host to re-read their Desk ID
- Check for typos (common: 0 vs O, 1 vs l)

### Step 2: Check Network
- Both parties need internet access
- Corporate firewalls may block WebRTC
- Test at https://test.webrtc.org

### Step 3: Firewall Rules
Required ports:
- 443 (HTTPS/WSS) - outbound
- 3478 (TURN) - outbound
- 49152-65535 (UDP) - outbound

### Step 4: TURN Server
If direct connection fails:
- Check if TURN server is configured
- Verify TURN credentials
- Try different network (mobile hotspot)

### Step 5: Browser Issues
- Use Chrome, Firefox, Safari, or Edge (latest)
- Disable VPN browser extensions
- Clear cache and cookies
- Try incognito/private mode

## Connection Drops Frequently
1. Check internet stability (ping test)
2. Reduce quality settings
3. Close bandwidth-heavy applications
4. Try wired connection instead of WiFi
5. Check if corporate network has session limits

## High Latency
1. Both parties close to same region?
2. Check bandwidth (need 1+ Mbps)
3. Reduce screen resolution
4. Pause video streaming/downloads
5. Use TURN server closer to both parties
