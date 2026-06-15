# Clipboard Safety Guide

## How Clipboard Sync Works
When enabled during a session:
- Copy on your device -> Can paste on remote
- Copy on remote -> Can paste on your device
- Supports text and images
- Disabled by default

## Security Considerations

### What Gets Synced
- Text (including passwords if copied)
- Images
- Formatted text (RTF, HTML)

### What Does NOT Get Synced
- Files (use file transfer instead)
- Large data (> 10MB)
- Special formats (may not work)

### Best Practices
- Only enable when needed
- Disable after use
- Do not copy passwords during shared clipboard
- Be aware of sensitive data in clipboard history
- Clear clipboard after session

### Enterprise Controls
Organizations can:
- Disable clipboard sync entirely
- Limit to text only (no images)
- Enable DLP scanning
- Log clipboard operations

### Privacy Note
Clipboard data is encrypted in transit and NOT stored on servers.
Data flows directly through the encrypted WebRTC data channel.
