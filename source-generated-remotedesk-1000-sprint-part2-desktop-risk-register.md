# RemoteDesk Part 2 Desktop Risk Register

| Risk | Severity | Mitigation |
| --- | --- | --- |
| File transfer writes to unintended path | High | Use save dialog and path tokens only; review token cleanup. |
| Clipboard secrets synced accidentally | High | Disabled by default, text-only, secret-like warning, no audit content. |
| Native input enabled unsafely | Critical | Default no-op executor, explicit host gate, emergency stop, rate limit. |
| Reconnect breaks existing signaling | Medium | Inject send function and add as incremental service only. |
| Support bundle leaks sensitive data | Medium | Redaction helper and explicit export dialog. |
| UI controls claim unsupported capability | Medium | Settings copy states native execution is unavailable by default. |
