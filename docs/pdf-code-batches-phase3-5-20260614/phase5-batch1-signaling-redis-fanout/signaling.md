  # Signaling Server


  ## What it does
  Socket.IO server (mounted on the same HTTP server as the REST API) that relays
  `signal:offer/answer/ice` between the two peers in a session room. JWT-authed handshake.


  ## Multi-replica fan-out
  - Each session = a Socket.IO room (`session:<id>`).
  - The `@socket.io/redis-adapter` broadcasts room emits across replicas.
  - We also publish to a Redis channel (`sig:<id>`) and re-emit locally, skipping the
    origin socket, so a host on replica A reaches a viewer on replica B.
  - Presence lives in Redis with a 30s TTL, refreshed by client heartbeats.

   ## Client
   `createSignalingClient(url, token, deviceId)` connects, joins via `session:request`,
   and wires offer/answer/ice into the WebRTC engine from `@remotedesk/shared-webrtc`.


   ## Scaling notes
   - Sticky sessions NOT required (the adapter handles cross-node delivery), but help.
   - For very high fan-out, shard Redis or move to a dedicated signaling deployment.




Phase 5, Batch 1 done: 16 files — Redis client + pub/sub, presence registry (TTL-based, cross-replica), session
room/channel naming, the signaling gateway (JWT handshake, offer/answer/ice relay, audit hook), socket
server with the Redis adapter, server.ts now boots HTTP+sockets+Redis, the web signaling client upgraded to
real JWT auth + heartbeats, redis in compose + k8s, 3 tests (including a live two-peer relay test), and a signaling
doc.

The keystone: every batch since Phase 1 assumed "signaling delivers offer/answer/ice." Now it actually does,
and it works across multiple api replicas via Redis, so the k8s HPA scaling from Batch 4.3 doesn't break real-
time. Host on one pod, viewer on another, they still connect.

Next number = Phase 5 Batch 2 (file transfer over a data channel + clipboard sync between host and viewer).
Bolo.
