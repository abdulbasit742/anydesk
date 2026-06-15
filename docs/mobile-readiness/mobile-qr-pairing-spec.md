# RemoteDesk QR Pairing Specification

## Overview
QR code pairing allows quick connection between mobile and desktop.

## QR Code Format
```
remotedesk://connect?desk_id=123456789&token=temp_token_abc
```

## Flow
```
Desktop App                    Mobile App
    |                              |
    |-- Generate QR code --------->|
    |   (contains desk_id + token) |
    |                              |
    |<-- Scan QR code -------------|
    |                              |
    |<-- Send pairing request -----|
    |   (token validated)          |
    |                              |
    |-- Accept pairing ----------> |
    |                              |
    |<-- Establish WebRTC -------->|
```

## QR Code Generation
```typescript
function generatePairingQR(deskId: string): string {
  const token = generateSecureToken(16);
  const data = `remotedesk://connect?desk_id=${deskId}&token=${token}`;
  return generateQRCode(data, { size: 256, errorCorrection: "M" });
}
```

## Security
- Token is single-use
- Token expires in 5 minutes
- Token validated server-side
- Desk ID masked in UI (***-***-789)

## Alternative: Numeric Code
For devices without camera:
- Display 6-digit pairing code on desktop
- Enter code on mobile
- Server validates and pairs

## Error Handling
| Error | Message |
|-------|---------|
| Expired | "QR code expired. Please generate a new one." |
| Invalid | "Invalid QR code. Please try again." |
| Used | "QR code already used. Please generate a new one." |
