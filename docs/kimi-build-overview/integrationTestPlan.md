# Integration Test Plan

## Scope

Integration tests for desktop data channel flows covering:
1. Remote input end-to-end
2. Permission gate interactions
3. Clipboard sync across peers
4. File transfer workflows

## Test Environment

```
┌──────────────────┐         ┌──────────────────┐
│   Viewer Node    │         │    Host Node     │
│  (Test Renderer) │◄───────►│  (Test Renderer) │
│                  │  WebRTC  │                  │
└──────────────────┘         └──────────────────┘
        ▲                            ▲
        │        Mock Main           │
        └──────── Process ───────────┘
```

## Test Categories

### TC-INPUT: Remote Input Flows

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| TC-INPUT-01 | Basic mouse move | 1. Start session 2. Capture mouse move 3. Send via DC | Host receives normalized coordinates |
| TC-INPUT-02 | Mouse click | 1. Send mouse down + up 2. Host receives both | Click executed on host |
| TC-INPUT-03 | Keyboard type | 1. Send key events 2. Host receives | Keys appear on host |
| TC-INPUT-04 | Throttle | 1. Send 1000 mouse moves rapidly 2. Count received | Received count < sent count |
| TC-INPUT-05 | Blocked without permission | 1. Don't grant input 2. Send events | Events dropped, no execution |
| TC-INPUT-06 | Emergency stop | 1. Enable input 2. Send events 3. Emergency stop | Events after stop dropped |
| TC-INPUT-07 | Permission required | 1. Request enable 2. Host denies 3. Send events | Events not forwarded |
| TC-INPUT-08 | Modifier keys | 1. Send Ctrl+C 2. Host receives with modifiers | Modifiers preserved |

### TC-PERM: Permission Flows

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| TC-PERM-01 | Default denied | 1. Start session 2. Check permissions | All denied |
| TC-PERM-02 | Grant input | 1. Request input 2. Host grants | State = granted |
| TC-PERM-03 | Revoke input | 1. Grant input 2. Host revokes | State = denied |
| TC-PERM-04 | Emergency stop | 1. Grant all 2. Emergency stop | All = denied |
| TC-PERM-05 | Audit log | 1. Grant, deny, revoke 2. Check log | All events logged |
| TC-PERM-06 | Sync | 1. Host grants 2. Viewer checks | Viewer sees granted |

### TC-CLIP: Clipboard Flows

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| TC-CLIP-01 | Default off | 1. Start session | Sync = disabled |
| TC-CLIP-02 | Enable sync | 1. Both enable | State = bidirectional |
| TC-CLIP-03 | Send text | 1. Viewer copies text 2. Wait debounce | Host receives text |
| TC-CLIP-04 | No echo | 1. Viewer copies 2. Viewer receives same hash | Ignored (echo detected) |
| TC-CLIP-05 | Size limit | 1. Copy 2MB text 2. Wait | Error: SIZE_EXCEEDED |
| TC-CLIP-06 | Disable stops sync | 1. Enable 2. Copy text 3. Disable 4. Copy again | Only first text synced |
| TC-CLIP-07 | Conflict resolution | 1. Both copy simultaneously 2. Check result | Winner based on strategy |

### TC-FT: File Transfer Flows

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| TC-FT-01 | Offer file | 1. Sender offers file 2. Receiver gets dialog | Dialog shows metadata |
| TC-FT-02 | Accept transfer | 1. Offer 2. Receiver accepts | State = transferring |
| TC-FT-03 | Reject transfer | 1. Offer 2. Receiver rejects | State = rejected |
| TC-FT-04 | Chunk transfer | 1. Accept 2. Wait for completion | All chunks received |
| TC-FT-05 | Hash verify | 1. Complete transfer 2. Verify hash | Hash matches |
| TC-FT-06 | Cancel mid-transfer | 1. Start transfer 2. Cancel | State = cancelled |
| TC-FT-07 | Pause/resume | 1. Transfer 2. Pause 3. Resume | Continues from pause |
| TC-FT-08 | Extension block | 1. Offer .exe file | Rejected with error |
| TC-FT-09 | Filename sanitize | 1. Offer with ../ in name | Name sanitized |
| TC-FT-10 | Timeout | 1. Offer 2. Don't respond 3. Wait 60s | Auto-rejected |

## Test Setup

```typescript
// Mock setup
const mockDataChannel = {
  readyState: 'open',
  send: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
};

const mockMainProcess = {
  executeMouse: vi.fn(),
  executeKeyboard: vi.fn(),
  clipboardWrite: vi.fn(),
  clipboardRead: vi.fn(),
  showSaveDialog: vi.fn(),
  writeChunk: vi.fn(),
};
```

## Execution Plan

1. **Phase 1**: Run unit tests (pure functions)
2. **Phase 2**: Run integration tests with mock data channel
3. **Phase 3**: Manual QA with real WebRTC (see manualQAChecklist.md)
4. **Phase 4**: Security review (see threatModel.md)

## Success Criteria

- All TC-INPUT tests pass
- All TC-PERM tests pass
- All TC-CLIP tests pass
- All TC-FT tests pass
- Zero security findings in review
- Manual QA checklist 100% complete
