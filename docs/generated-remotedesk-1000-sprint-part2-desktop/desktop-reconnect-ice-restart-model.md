# Reconnect and ICE restart model

Reconnect is additive. It schedules bounded ICE restart attempts using retry backoff and sends restart offers through the existing signaling path supplied by the app. It does not replace the current offer/answer flow and should be wired only after existing signaling code review.
