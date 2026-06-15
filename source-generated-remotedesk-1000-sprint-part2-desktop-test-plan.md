# RemoteDesk Part 2 Desktop Test Plan

Run unit tests for reducers, policies, validators, rate limiting, audit queue, reconnect manager, support bundle redaction, and diagnostics store.

Manual QA:

1. Start a host/viewer session and confirm file transfer is off by default.
2. Enable file transfer, send a safe small file, accept with save dialog, verify ACK/progress/completion.
3. Attempt blocked executable extension and verify policy blocks it.
4. Enable clipboard sync on one side only and verify no sync until both sides permit.
5. Trigger emergency stop and verify input events are blocked.
6. Export support bundle and inspect for redacted secrets.
7. Simulate ICE disconnect and confirm reconnect banner/status without breaking session controls.
