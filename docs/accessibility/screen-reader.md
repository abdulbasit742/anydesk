# Screen Reader Support

## ARIA Roles
| Element | Role |
|---------|------|
| Desk ID display | `status` |
| Connection status | `status`, `aria-live="polite"` |
| Session video | `img`, `aria-label="Remote screen"` |
| Chat messages | `log`, `aria-live="polite"` |
| Toolbar | `toolbar` |
| Modal | `dialog` |

## Live Regions
```tsx
// Connection status updates
<div aria-live="polite" aria-atomic="true">
  {connectionStatus === "connected" && "Connected to remote desktop"}
  {connectionStatus === "disconnected" && "Disconnected"}
</div>

// New chat messages
<div role="log" aria-live="polite" aria-label="Chat messages">
  {messages.map(msg => (
    <div key={msg.id}>{msg.sender}: {msg.text}</div>
  ))}
</div>

// Session requests
<div aria-live="assertive">
  {pendingRequest && "New connection request received"}
</div>
```

## Labels
```tsx
// Icon buttons
<button aria-label="Share screen">
  <ShareIcon />
</button>

// Desk ID with copy
<div>
  <span>Your Desk ID: </span>
  <span aria-label="Desk ID 123456789">123-456-789</span>
  <button aria-label="Copy desk ID to clipboard">
    <CopyIcon />
  </button>
</div>
```

## Testing
Test with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

## Announcement Priority
| Priority | Usage | Example |
|----------|-------|---------|
| assertive | Critical, immediate | Connection lost |
| polite | Important, non-blocking | Chat message |
| off | Decorative only | Status icon color |
