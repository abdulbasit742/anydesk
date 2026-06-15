# Clipboard Sync QA Checklist

## Pre-conditions
- Two RemoteDesk instances running (viewer + host)
- Session established between them
- Both sides have clipboard sync feature available

## Test Cases

### Enable/Disable

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Default state | Start session, open clipboard panel | Sync shows "Disabled" |
| 2 | Viewer enables | Viewer clicks toggle ON | Shows "Enabled - Sending" |
| 3 | Host enables | Host clicks toggle ON | Shows "Enabled - Bidirectional" |
| 4 | Viewer disables | Viewer clicks toggle OFF | Shows "Disabled", no more sends |
| 5 | Host disables | Host clicks toggle OFF | Shows "Disabled", no more receives |

### Text Sync

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 6 | Basic sync | Copy "Hello" on viewer | "Hello" appears in host clipboard |
| 7 | Unicode | Copy "Hello 世界 🌍" | Exact text appears on host |
| 8 | Large text | Copy 10KB text | Synced successfully |
| 9 | Multi-line | Copy text with newlines | Newlines preserved |
| 10 | Code snippet | Copy code with indentation | Indentation preserved |

### Echo Prevention

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 11 | No echo | Copy "test" on viewer | Host gets "test", viewer doesn't get it back |
| 12 | Rapid copy | Copy "a", then "b", then "c" quickly | Only "c" synced (debounced) |

### Size Limits

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 13 | Under limit | Copy 500KB text | Synced |
| 14 | At limit | Copy 1MB text | Synced |
| 15 | Over limit | Copy 2MB text | Error: size exceeded |
| 16 | Empty | Copy empty string | Ignored |

### Error Handling

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 17 | Network loss | Disconnect during sync | No crash, graceful stop |
| 18 | Rapid toggle | Enable/disable rapidly | No duplicate syncs |
| 19 | Binary content | Attempt to sync binary (if possible) | Rejected |

## Sign-off

- [ ] All test cases passed
- [ ] No clipboard data leaked without consent
- [ ] No echo loops observed
- [ ] Performance acceptable (< 1s sync time)
