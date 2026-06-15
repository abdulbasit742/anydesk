# Clipboard Security

## Threat Model

1. **Data leakage** - Sensitive clipboard data exposed
2. **Clipboard injection** - Malicious content inserted
3. **Loop amplification** - Infinite clipboard sync loop

## Controls

- **Disabled by default** - Must be explicitly enabled
- **Loop prevention** - 2-second cooldown after receive
- **Size limit** - 1MB max clipboard size
- **Type restriction** - Text/HTML only by default
- **Per-session** - Each session has independent clipboard state
- **Auto-disable** - Disabled on disconnect
