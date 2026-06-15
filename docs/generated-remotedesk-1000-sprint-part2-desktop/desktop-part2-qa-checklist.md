# Desktop Part 2 QA checklist

- Verify file transfer is disabled by default.
- Verify receiver must choose a save location before writes begin.
- Verify blocked extensions cannot be sent or accepted.
- Verify clipboard sync is text-only and disabled by default.
- Verify emergency stop disables remote input immediately.
- Verify no native input executes with the no-op executor.
- Verify support bundle redacts secrets and clipboard-like fields.
- Verify reconnect attempts do not break the current WebRTC offer/answer flow.
