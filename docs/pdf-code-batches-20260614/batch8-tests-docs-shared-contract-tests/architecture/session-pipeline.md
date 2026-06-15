    # Session Pipeline


Viewer                   Signaling (api)               Host
| --- session:request ----------> | --- forward ------------> |
|                   |        (accept/reject) |
| <-- session:accept ------------ | <----------------------- |
| --- signal:offer -------------> | --- forward ------------> | setRemoteDescription
| <-- signal:answer ------------- | <-- forward ------------- | createAnswer
| <==== signal:ice (both) =====> | <====================== |
| <====== media (SRTP) ============================== screen capture
| ==== input:event (data channel) ==================> apply input
    State machine: `idle â†’ connecting â†’ connected â†’ (reconnecting â†” connected) â†’ closed`.
    Reconnect: on `disconnected`/`failed`, exponential backoff triggers ICE restart up to N attempts.
