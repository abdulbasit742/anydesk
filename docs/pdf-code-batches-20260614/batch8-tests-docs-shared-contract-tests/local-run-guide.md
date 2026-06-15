   # Local Run Guide


   ## Prerequisites
   - Node 20+
   - pnpm 9+


   ## Install
   ```bash
   pnpm install


Build shared first
   pnpm --filter @remotedesk/shared build


Run everything (3 terminals or a single dev script)
   pnpm --filter @remotedesk/api dev         # http://localhost:4000
   pnpm --filter @remotedesk/web dev         # http://localhost:5173
   pnpm --filter @remotedesk/desktop dev     # Electron window


Environment
Create apps/api/.env :
   RECONNECT_TOKEN_SECRET=change-me
   PORT=4000


Test
   pnpm -r test

   ## `docs/webrtc-troubleshooting.md`
   ```md
   # WebRTC Troubleshooting


   ## Connection stuck on "Connecting"
   - **No ICE candidates exchanged.** Check the signaling channel is delivering `signal:ice` both ways.
   - **Behind symmetric NAT.** STUN alone won't work; configure a TURN server in `iceServersConfig.ts`.

    ## Connects then drops after a few seconds
    - ICE consent freshness failing. Verify the data channel stays open and the reconnect manager fires an ICE restart.
    - Check `connectionStateMachine` transitions: `connected â†’ disconnected â†’ reconnecting` should trigger `restartIce`.


    ## Remote video is black
    - Track added before `setRemoteDescription`. Confirm the ICE candidate queue flushes after the remote description is set.
    - `video.play()` blocked by autoplay policy. The element is muted by default; keep it muted or gate on a user gesture.


    ## Input not registering on host
    - Host input permission gate not granted. Call `grant()` on accept.
    - Data channel not open. Check `readyState` before sending; the sender no-ops when closed.

    ## High latency / poor quality
    - Inspect the stats panel (latency, bitrate, packet loss).
    - Lower capture quality preset to `balanced` or `low` in `streamConstraints.ts`.
    - Ensure a regional TURN server is used if relay is required.
